import { 
	REACT_TEXT,
	REACT_FORWARD_REF_TYPE,
	REACT_PROVIDER,
	REACT_CONTEXT
} from './constants'
import { addEvent } from './event';


/**
 *  S1 把虚拟DOM转成真实DOM插入容器中
 *  S2 参数-  vdom：虚拟DOM    container：容器
 */
function render(vdom,container){
  mount(vdom,container);
}

function mount(vdom,container){
  let newDOM = createDOM(vdom);
  container.appendChild(newDOM)  //插入容器中
  if (newDOM.componentDidMount) newDOM.componentDidMount()
}


/**
 *  S1 作用：把虚拟DOM转成真实DOM
 *  S2 参数：vdom  虚拟DOM
 */
function createDOM(vdom){
  let { type, props, ref } = vdom
	//S1 即将创建并返回的 真实DOM元素
	let dom  

	if(type&&type.$$typeof===REACT_PROVIDER){
        return mountProviderComponent(vdom)
    } else if( type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
		return mountForwardComponent(vdom)
    } else if (type === REACT_TEXT){
		// 如果是一个文本元素，就创建一个文本节点
		dom = document.createTextNode(props.content)
  } else if ( typeof type === 'function' ) {
		if (type.isReactComponent) {
			//说明它是一个类组件
			return mountClassComponent(vdom);
	  } else {
		  //说明是React函数组件
			return mountFunctionComponent(vdom);
	  }

	}  else {
		// 原生DOM类型
		dom = document.createElement(type) 
	}

	//根据虚拟DOM中的属性更新真实DOM属性
	if (props) {
		updateProps(dom, {}, props)
		if(typeof props.children == 'object' && props.children.type) {
			render(props.children, dom);
		} else if ( Array.isArray(props.children) )  {
			reconcileChildren(props.children, dom)
		}
    }

	vdom.dom = dom            // 让虚拟DOM的dom属性 指向它的真实DOM 
	if(ref) ref.current = dom   // 让ref.current属性 指向真实DOM的实例

  return dom
}

function mountProviderComponent(vdom){
    // type={ $$typeof: REACT_PROVIDER, _context: context}, props={value, children}
    let { type,props } = vdom
    //在渲染Provider组件的时候，拿到属性中的value，赋给context._currentValue
    type._context._currentValue = props.value
    let renderVdom = props.children
    vdom.oldRenderVdom = renderVdom
    return createDOM(renderVdom)
}


function mountForwardComponent(vdom){
	let { type, props, ref } = vdom
	let renderVdom = type.render(props, ref)
	vdom.oldRenderVdom = renderVdom
	return createDOM(renderVdom);
}

function mountClassComponent(vdom){
	let { type, props, ref } = vdom
	let defaultProps = type.defaultProps || {}
    let classInstance = new type( { ...defaultProps, ...props} )
	// context实现：类组件类型的vdom中，type就是 被定义的class
	if(type.contextType){
        // classInstance.context = type.contextType.Provider._value
		classInstance.context = type.contextType._currentValue
    }

	vdom.classInstance = classInstance
    if (classInstance.componentWillMount) {
		classInstance.componentWillMount()
	}
    // 执行render
	let renderVdom= classInstance.render()

	// 挂载的时候计算出虚拟DOM，然后挂到类的实例上
	classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom
	// ref.current指向类组件的实例
	if(ref) ref.current = classInstance 
	let dom =  createDOM(renderVdom)

	//暂时把didMount方法暂存到dom上
	if (classInstance.componentDidMount) {
		dom.componentDidMount = classInstance.componentDidMount.bind(classInstance)
	}
	return dom
}


function mountFunctionComponent(vdom){
	let { type,props } = vdom
	let renderVdom = type(props)
	vdom.oldRenderVdom = renderVdom
	return createDOM(renderVdom)
}


function updateProps(dom, oldProps, newProps){
	for (let key in newProps) {
		// 后面会单独处理children属性，所以此处跳过去
		if (key === 'children') { continue; }

		if (key === 'style') {
			let styleObj = newProps[key];
			for (let attr in styleObj) {
				dom.style[attr] = styleObj[attr]
			}
		} else if( key.startsWith('on') ) {  //onClick
		//   dom[key.toLocaleLowerCase()]=newProps[key]  //dom.onclick=handleClick
		addEvent(dom, key.toLocaleLowerCase(), newProps[key] )
		} else {
			if ( newProps[key] ) {
				dom[key]=newProps[key];
			}
		}
		
	}
}

function reconcileChildren(childrenVdom, parentDOM){
  for(let i=0; i<childrenVdom.length; i++) {
    let childVdom = childrenVdom[i]
    render(childVdom,parentDOM)
  }
}

/**
 * 根据vdom返回真实DOM
 * @param {*} vdom 
 */
 export function findDOM(vdom){
	let type = vdom.type;
	let dom
	//原生的组件
	if (typeof type === 'string' || type === REACT_TEXT){ 
	 dom = vdom.dom
	} else {
		// 可能函数组件 类组件 provider context forward
	 dom = findDOM(vdom.oldRenderVdom);
	}
	return dom
}


export function compareTwoVdom( parentDOM, oldVdom, newVdom, nextDOM ) {
  //   let oldDOM = findDOM(oldVdom)
  //   let newDOM = createDOM(newVdom)
  //   parentDOM.replaceChild(newDOM,oldDOM)
  //   debugger
  
  if (!oldVdom && !newVdom) {
	  //如果老的虚拟DOM是null, 新的虚拟DOM也是null
  } else if ( oldVdom && (!newVdom) ) {
	//老的为不null + 新的为null, 销毁老组件
	let currentDOM = findDOM(oldVdom)
	//把老的真实DOM删除
	currentDOM.parentNode.removeChild(currentDOM)
	//执行组件卸载方法
	if(oldVdom.classInstance&&oldVdom.classInstance.componentWillUnmount){
		oldVdom.classInstance.componentWillUnmount()
	}
  } else if ( !oldVdom && newVdom ){
	//如果老的没有+ 新的有，根据新组件创建新DOM并添加到父DOM中  
	let newDOM = createDOM(newVdom)
	if(nextDOM){
		parentDOM.insertBefore(newDOM, nextDOM)
	} else {
		parentDOM.appendChild(newDOM)
	}

	if (newDOM.componentDidMount) {
		newDOM.componentDidMount()
	}
  // 新老都有，但是不同类型，也不能复用，则需要删除老的，添加新的	
  } else if (oldVdom && newVdom && (oldVdom.type !== newVdom.type) ) {
	let oldDOM  = findDOM(oldVdom)          // 先获取 老的真实DOM
	let newDOM = createDOM(newVdom)     // 创建新的真实DOM
	oldDOM.parentNode.replaceChild(newDOM,oldDOM)
	//执行组件卸载方法
	if(oldVdom.classInstance&&oldVdom.classInstance.componentWillUnmount) {
		oldVdom.classInstance.componentWillUnmount()
	}
	if (newDOM.componentDidMount) { 
		newDOM.componentDidMount()
	}

  } else {
	//老的有，新的也有，类型也一样，需要复用老节点，进行深度dom diff
	updateElement(oldVdom,newVdom)
  }
}

function updateElement (oldVdom,newVdom) {
	if(oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
        let currentDOM = newVdom.dom = findDOM(oldVdom)
        if (oldVdom.props.content !== newVdom.props.content) {
            currentDOM.textContent = newVdom.props.content
		}
	// 说明是原生组件 div		
    } else if ( typeof oldVdom.type === 'string' ){
		//让新的虚拟DOM的 真实DOM属性  等于 老的虚拟DOM对应的 那个真实DOM
		let currentDOM = newVdom.dom = findDOM(oldVdom)
		//用新的属性 更新DOM的老属性
		updateProps(currentDOM, oldVdom.props, newVdom.props)
		updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children)
	} else if (typeof oldVdom.type === 'function'){
        if(oldVdom.type.isReactComponent){
            updateClassComponent(oldVdom,newVdom);
        }else {
            updateFunctionComponent(oldVdom,newVdom);
        }
    }
}

function updateClassComponent(oldVdom,newVdom){
    let classInstance = newVdom.classInstance = oldVdom.classInstance
    newVdom.oldRenderVdom = oldVdom.oldRenderVdom;
    //因为此更新是由于父组件更新引起的
	// 父组件在重新渲染的时候，给子组件传递新的属性
    if(classInstance.componentWillReceiveProps){
        classInstance.componentWillReceiveProps()
    }
    classInstance.updater.emitUpdate(newVdom.props)
}

function updateFunctionComponent(oldVdom,newVdom){
    let parentDOM = findDOM(oldVdom).parentNode
    let {type,props} = newVdom
    let renderVdom = type(props)
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom)
    newVdom.oldRenderVdom = renderVdom
}


function updateChildren(parentDOM, oldVChildren, newVChildren){
	oldVChildren = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]
	newVChildren = Array.isArray(newVChildren) ? newVChildren : [newVChildren]
	let maxLength = Math.max( oldVChildren.length, newVChildren.length)
    for(let i=0;i<maxLength;i++){
        //找当前的虚拟DOM节点这后的  最近的一个真实DOM节点
        let nextVNode = oldVChildren.find( (item,index)=> 
		index>i && item && findDOM(item) )
        compareTwoVdom(parentDOM, oldVChildren[i], newVChildren[i], nextVNode&&findDOM(nextVNode) )
    }
}


const ReactDOM = {
	render
}
export default ReactDOM;


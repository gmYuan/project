import { 
	REACT_TEXT,
	REACT_FORWARD_REF_TYPE,
	REACT_PROVIDER,
	REACT_CONTEXT,
	REACT_MEMO
} from './constants'
import { addEvent } from './event';

// hooks相关 
let scheduleUpdate
let hookState = []  // 这是一个全局变量，用来记录hook的值
let hookIndex = 0  //存放当前hook的索引值


export function useReducer(reducer, initialState ) {
    hookState[hookIndex]= hookState[hookIndex] || initialState  //hookState[0]=10
    let currentIndex = hookIndex
    function dispatch(action) {
        action = typeof action === 'function'? action(hookState[currentIndex]) : action
        hookState[currentIndex] = reducer ? reducer(hookState[currentIndex], action) : action
        scheduleUpdate()  //状态变化后，要执行调度更新任务
    }
    return [ hookState[hookIndex++], dispatch]
}


export function useState(initialState){
	return useReducer(null,initialState)
 }

 /** 
export function useState(initialState){
    hookState[hookIndex] = hookState[hookIndex] || initialState   //hookState[0]=10
    let currentIndex = hookIndex
    function setState(newState) {
		// currentIndex指向hookIndex赋值的时候的那个值  0
        hookState[currentIndex] = newState
		//状态变化后，要执行调度更新任务
        scheduleUpdate() 
    }
    return [ hookState[hookIndex++], setState ]
}
*/


export function useMemo(factory,deps) {
	if(hookState[hookIndex]) {  //说明不是第一次是更新
		let [ lastMemo, lastDeps] = hookState[hookIndex]
	  	let everySame = deps.every( (item,index) => item === lastDeps[index] )
	 	if( everySame ){
			 hookIndex++
			 return lastMemo
	  	} else {
			let newMemo = factory()
		  	hookState[hookIndex++] = [newMemo, deps]
		  	return newMemo
	  }
	} else {
		let newMemo = factory()
	  	hookState[hookIndex++] = [newMemo,deps]
	  	return newMemo
	}
}

export function useCallback(callback,deps){
	if ( hookState[hookIndex] ) {	//说明不是第一次是更新
		let [ lastCallback, lastDeps ] = hookState[hookIndex]
		let everySame = deps.every((item,index)=>item === lastDeps[index])
		if (everySame) {
			hookIndex++
			return lastCallback
		} else {
			hookState[hookIndex++] = [callback,deps]
			return callback
		 }
	} else {
		hookState[hookIndex++] = [callback,deps]
		return callback
	}
}

/**
 * @param {*} callback 当前渲染完成之后下一个宏任务
 * @param {*} deps 依赖数组，
 */
 export function useEffect(callback,deps){
	if (hookState[hookIndex]) {
			let [destroy,lastDeps] = hookState[hookIndex];
			let everySame = deps.every((item,index)=>item === lastDeps[index]);
			if(everySame){
				hookIndex++;
			}else {
					//销毁函数每次都是在下一次执行的时候才会触发执行 
					destroy && destroy() 
					setTimeout(()=>{
						let destroy = callback();
						hookState[hookIndex++]=[destroy,deps]
					})
			}
	}else{
			//初次渲染的时候，开启一个宏任务，在宏任务里执行callback,保存销毁函数和依赖数组
			setTimeout(()=>{
					let destroy = callback()
					hookState[hookIndex++] = [destroy,deps]
			});
	}
}


/**
 *  S1 把虚拟DOM转成真实DOM插入容器中
 *  S2 参数-  vdom：虚拟DOM    container：容器
 */
function render(vdom, container){
	mount(vdom,container)
    // 执行hooks更新
  	scheduleUpdate = ()=>{
		hookIndex = 0   //把索引重置为0
		//从根节点执行完整的dom-diff 进行组件的更新，这里的vdom是 根vdom
		compareTwoVdom(container, vdom, vdom)
	}
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

	if (type && type.$$typeof === REACT_MEMO) {
		return mountMemo(vdom)
  	}  else if (type&&type.$$typeof===REACT_CONTEXT){
        return mountContextComponent(vdom)
    } else if (type&&type.$$typeof===REACT_PROVIDER){
        return mountProviderComponent(vdom)
    } else if ( type && type.$$typeof === REACT_FORWARD_REF_TYPE) {
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

	}  else  {
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



function mountMemo(vdom){
	// type = { $$typeof:REACT_MEMO,  type,//函数组件    compare  }
	let { type, props } = vdom   // type.type 函数组件
	let renderVdom = type.type(props)
	vdom.prevProps= props      // 在vdom记录上一次的属性对象
	vdom.oldRenderVdom = renderVdom
	return createDOM(renderVdom)
}


function mountContextComponent(vdom){
    let {type,props} = vdom;
    let renderVdom = props.children(type._context._currentValue)
    vdom.oldRenderVdom = renderVdom;
    return createDOM(renderVdom)
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
	if(oldVdom.type.$$typeof === REACT_MEMO){
		updateMemo(oldVdom, newVdom)

	} else if (oldVdom.type && oldVdom.type.$$typeof === REACT_PROVIDER) {
        updateProviderComponent(oldVdom,newVdom)
    } else if (oldVdom.type && oldVdom.type.$$typeof === REACT_CONTEXT) {
        updateContextComponent(oldVdom,newVdom)

    } else if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT) {
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


function updateMemo(oldVdom, newVdom) {
	// debugger
    let {type,prevProps} = oldVdom
    //比较结果是相等,就不需要重新渲染 render
    let renderVdom=oldVdom.oldRenderVdom
    if(!type.compare(prevProps,newVdom.props)){
        let currentDOM = findDOM(oldVdom);
        let parentDOM = currentDOM.parentNode
        let {type,props} = newVdom;
        renderVdom = type.type(props)
        compareTwoVdom(parentDOM,oldVdom.oldRenderVdom,renderVdom)
    }
    newVdom.prevProps = newVdom.props;
    newVdom.oldRenderVdom = renderVdom;
}


function updateProviderComponent(oldVdom,newVdom){
    let parentDOM = findDOM(oldVdom).parentNode;
    let {type,props} = newVdom;
    type._context._currentValue = props.value
    let renderVdom = props.children
    compareTwoVdom(parentDOM,oldVdom.oldRenderVdom,renderVdom)
    newVdom.oldRenderVdom = renderVdom;
}

function updateContextComponent(oldVdom,newVdom){
    let parentDOM = findDOM(oldVdom).parentNode;
    let {type,props} = newVdom;
    let renderVdom = props.children(type._context._currentValue);
    compareTwoVdom(parentDOM,oldVdom.oldRenderVdom,renderVdom);
    newVdom.oldRenderVdom = renderVdom;
}

function updateFunctionComponent(oldVdom,newVdom){
    let parentDOM = findDOM(oldVdom).parentNode
    let {type,props} = newVdom
    let renderVdom = type(props)
    compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom)
    newVdom.oldRenderVdom = renderVdom
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


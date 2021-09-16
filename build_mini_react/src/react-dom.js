import {
  REACT_TEXT,
  
} from './constants'


/**
 *  S1 把虚拟DOM转成真实DOM插入容器中
 *  S2 参数-  vdom：虚拟DOM    container：容器
 */
function render(vdom,container){
  mount(vdom,container);
}

function mount(vdom,container){
  let newDOM = createDOM(vdom)
  container.appendChild(newDOM) 
  console.log('container', container)
}


/**
 *  S1 作用：把虚拟DOM转成真实DOM
 *  S2 参数：vdom  虚拟DOM
 */
function createDOM(vdom){
  let { type, props } = vdom
	//S1 即将创建并返回的 真实DOM元素
	let dom  

	if (type === REACT_TEXT){
		// 如果是一个文本元素，就创建一个文本节点
		dom = document.createTextNode(props.content)
  } else if ( typeof type === 'function' ) {
		//说明这是一个React函数组件
		return mountFunctionComponent(vdom)
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
  return dom
}

function mountFunctionComponent(vdom){
	let { type,props } = vdom
	let renderVdom = type(props)
	// vdom.oldRenderVdom = renderVdom
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



const ReactDOM = {
	render
}
export default ReactDOM;


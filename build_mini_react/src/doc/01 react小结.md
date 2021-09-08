
Q1 React中JSX是什么
A：
S1 本质上是 React.createElement(type, config, children)的语法糖，返回/生成一个 React元素

S2 react元素 === 虚拟DOM === 一个具有 type/props等属性的 JS对象

```js
let element = <h1>hello world</h1>
console.log('element', JSON.stringify(element) )
// 结果大致为以下对象
{
  type:"h1",
  key: null,
  ref:null,
  props: {
    children: "hello world"
  }
  _owner:null,
}
```

------
Q2 React.createElement(type, config, children)大致做了什么
A：
S1 自定义config属性：处理config内部的特殊属性，如 ref和key

S2 生成 props对象：把 conifg 作为 props值

S3 生成 props.children：把chidren作为props属性值，即props.children

S4 返回vdom：返回一个如  `{ type: "div",  props: {key: bb,  children: [xxx]  } }` 的 vdom对象

```js
function createElement(type,config,children){
  let ref      //用来 获取虚拟DOM实例的
  let key     //用来 区分同一个父亲的不同儿子
  // S1
  if(config){
    delete config.__source;
    delete config.__self;
    ref = config.ref;
    delete config.ref;
    key = config.key;
    delete config.key;
  }
  //S2 
  let props = {...config}   

  //S3 如果参数大于3个，说明有多个儿子
  if(arguments.length>3) {
    //把字符串/数字类型的 节点转换成对象的形式
    props.children = Array.prototype.slice.call(arguments,2).map(wrapToVdom)
  } else {
    if(typeof children !== 'undefined') {
      props.children = wrapToVdom(children)
    }
  }
  // S4
  return {
    type,
    props,
    ref,
    key
  }
}
```

------
Q3 reactDOM.render()大致做了什么
A：
S1 render((vdom,container)：把虚拟DOM转成真实DOM，并插入div容器中

S2 createDOM(vdom)：根据 vdom，创建真实DOM
  - 根据 type + DOM API，创建 真实原生DOM
  - 根据 props，生成 真实DOM的属性

S3 updateProps(dom, oldProps, newProps)：对props进行针对性处理
  - props.chilren：单独处理，具体见下
  - props.style：	`dom.style[attr] = styleObj[attr]`
  - 其他props.xxx：直接赋值给真实DOM

S4 单独处理 props.children
  - 只有一个儿子，直接调用 render(props.chilren, dom)即可
  - 有多个儿子，则调用 reconcileChildren(childrenVdom, parentDOM)：对每一个childrenVdom调用render


```js
function render(vdom,container){
  mount(vdom,container);
}
// S1
function mount(vdom,container){
  let newDOM = createDOM(vdom)
  container.appendChild(newDOM) 
}

// S2
function createDOM(vdom){
  let { type, props } = vdom
	//即将创建并返回的 真实DOM元素
	let dom  
  // S2.1
	if (type === REACT_TEXT){
		// 如果是一个文本元素，就创建一个文本节点
		dom = document.createTextNode(props.content)
  } else {
		// 原生DOM类型
		dom = document.createElement(type) 
	}
	// S2.2 
	if (props) {
		updateProps(dom, {}, props)
    // S4
    if(typeof props.children == 'object' && props.children.type) {
      // S4.1 它是个对象 只有一个儿子
      render(props.children, dom);
    } else if ( Array.isArray(props.children) )  {
      // S4.2
      reconcileChildren(props.children, dom)
    }
  }

  return dom
 
}

// S3
function updateProps(dom, oldProps, newProps){
	for (let key in newProps) {
		// S3.1  后面会单独处理children属性，所以此处跳过去
		if (key === 'children') { continue; }
    // S3.2 处理style
		if (key === 'style') {
			let styleObj = newProps[key];
			for (let attr in styleObj) {
				dom.style[attr] = styleObj[attr]
			}
    // S3.3 处理其他props
		} else {
			if ( newProps[key] ) {
				dom[key]=newProps[key];
			}
		}

	}
}
 
// S4.2 
function reconcileChildren(childrenVdom, parentDOM){
  for(let i=0; i<childrenVdom.length; i++) {
    let childVdom = childrenVdom[i]
    render(childVdom,parentDOM)
  }
}

```

-----
Q4
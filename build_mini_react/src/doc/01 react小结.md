## React小结

Q1：一段JSX代码是如何转化成 显示在页面上的DOM元素的
A：
以 
```js
<h1 className='box' style={{color: 'red'}} key='h1' >
  <span key='span1'>
    hello 
    <span key='span1-c2'>--</span>
  </span> 
  <span key='span2'>world</span> 
</h1>
```
   为例，过程如下所示：

S1 JSX 转化为 React.createElement(type, config, children)，结果为
```js
React.createElement("h1", 
  {
    key: "h1",
    className: "box",
    style: {
      color: 'red'
    }
  }, 
  React.createElement("span", { key: "span1"}, "hello", 
    React.createElement("span", { key: "span1-c2" } , "--")
  ), 
  React.createElement("span",  { key: "span2"}, "world")
)
```

S2.1 React.createElement有多个子元素时，以 `深度优先` 的顺序执行(函数栈的入栈和执行顺序)

S2.2 React.createElement(type, config, children)大致做了一下工作
  - 自定义config属性：处理config内部的特殊属性，如 ref和key
  - 生成 props对象：把 conifg 作为 props值
  - 生成 props.children：把chidren作为props属性值，即props.children
  - 返回vdom：返回一个如  `{ type: "div",  props: {key: bb,  children: [xxx]  } }` 的 vdom对象

所以 以上代码的执行顺序为 '--' ==> 'hello' ==> 'world' ==> h1.box，最后生成的vdom为：

```js
// 第1次执行
React.createElement("span", null, "--") 的执行结果为：
const v1 = {
  key: 'span1-c2',
  type: 'span',
  props: { children: { type:REACT_TEXT,  props: { content: '--'} } }
}

// 第2次执行
React.createElement("span", { key: "span1"}, "hello",
  React.createElement("span", { key: "span1-c2"}, "--")
)  ===> React.createElement( "span", { key: "span1"}, "hello", v1) )  的执行结果为：

const v2 = {
  key: "span1",
  type: 'span',
  props: {
    children: [
      { type: REACT_TEXT,  props: { content: 'hello'} },
      { key: "span1-c2", type: 'span',  props: {
         children: { type:REACT_TEXT,  props: { content: '--'} }, 
        }
      }
    ],
  },
}

// 第3次执行
React.createElement("span",  { key: "span2"}, "world") 的执行结果为：
const v3 = {
  key: "span2",
  type: 'span',
  props: { children: { type: REACT_TEXT,  props: { content: 'world'} } }
}

// 第4次执行
React.createElement("h1", 
  {
    key: "h1"
    className: "box",
    style: {
      color: 'red'
    }
  }, 
  v2,
  v3
) 的执行结果为

const vdom = const v4 = {
  key: "h1",
  type: 'h1',
  props: {
    className: "box",
    style: { color: 'red' },
    children: [
      // v2
      { 
        key: "span1",
        type: 'span', 
        props: { 
          children: [
            { type: REACT_TEXT,  props: { content: 'hello'} },
            { key: "span1-c2", type: 'span', 
              props: { children: { type:REACT_TEXT,  props: { content: '--'} } }
            }
          ]
        } 
      },
      // v3
      {
        key: "span2"
        type: 'span', 
        props: {
          children: { type:REACT_TEXT,  props: { content: 'world'} },
        }
      }
    ],
  },
}
```

S3 reactDOM.render(vdom, container)大致做了以下工作
  S3.1 render(vdom,container)：把虚拟DOM转成真实DOM，并插入 container容器中

  S3.2 createDOM(vdom)：根据 vdom，创建真实DOM
    - 根据 type + DOM API，创建 真实原生DOM，赋值给dom
    - 根据 props，生成 真实DOM的属性

  S3.3 updateProps(dom, oldProps, newProps)：对props进行针对性处理
    - props.chilren：单独处理，具体见下
    - props.style：	`dom.style[attr] = styleObj[attr]`
    - 其他props.xxx：直接赋值给真实DOM

  S3.4 单独处理 props.children
    - 只有一个儿子，直接调用 render(props.chilren, dom)即可
    - 有多个儿子，则调用 reconcileChildren(childrenVdom, parentDOM)：深度优先 遍历调用 render

```js
// 入参vdom为
const vdom = {
  key: undefined,
  type: 'h1',
  props: {
    className: "box",
    style: { color: 'red' },
    children: [
      // v2
      { 
        key: undefined,
        type: 'span', 
        props: { 
          children: [
            { type: REACT_TEXT,  props: { content: 'hello'} },
            { key: undefined, type: 'span', 
              props: { children: { type:REACT_TEXT,  props: { content: '--'} } }
            }
          ]
        } 
      },
      // v3
      {
        key: undefined
        type: 'span', 
        props: {
          children: { type:REACT_TEXT,  props: { content: 'world'} },
        }
      }
    ],
  },
}
// 第1次 执行过程
render() 即 mount(vdom, container)  即  createDOM(vdom) ==>  dom = h1 
updateProps(dom, {}, props) ==>  dom = h1.box & h1.box.style.color = 'red'
reconcileChildren(v4.props.children, h1.box) ==> 遍历执行 render(), 即 render(v4.props.children[0],  h1.box)

// 第2次执行过程为
render() 即 mount(vdom, container)  即  createDOM(v4.props.children[0]) ==>  dom = span
updateProps(dom, {}, props) ==>  dom = span
reconcileChildren(props.children, span) ==> 遍历执行 render(), 即 render(v2.props.children[0],  span)

// 第2.1次执行过程为
render() 即 mount(vdom, container)  即  createDOM(  { type: REACT_TEXT,  props: { content: 'hello'} }) ==>  dom = text
updateProps(dom, {}, props) ==>  dom = text.content = 'hello'

createDOM() 执行返回结果，即 dom = text.content = 'hello'
mount执行 container.appendChild(newDOM)，即 把 text.content = 'hello' 插入到 div.root 中

// 第2.2次执行过程为
继续执行 reconcileChildren(v4.props.children, span) ==> 遍历执行 render(), 即 render(v4.props.children[1],  span)


render() 即 mount(vdom, container)  即  createDOM(  { type: REACT_TEXT,  props: { content: 'hello'} }) ==>  dom = text
updateProps(dom, {}, props) ==>  dom = text.content = 'hello'

createDOM() 执行返回结果，即 dom = text.content = 'hello'
mount执行 container.appendChild(newDOM)，即 把 text.content = 'hello' 插入到 div.root 中


```
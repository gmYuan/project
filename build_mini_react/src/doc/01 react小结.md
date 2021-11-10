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
  - 返回vdom：返回一个如  `{ type: "div",  key: bb, props: { children: [xxx]  } }` 的 vdom对象

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

  render(vdom, container)：createDOM(vdom) 并且 container.appendChild(newRealDom)

  createDom(vdom)：
    - realDom = createRelDomByVdomType(vdom.type)
    - updateProps(realDom, oldProps, newProps)：处理非children的props赋值
    - 根据 vdom.props.children的 数量/类型 ，分别调用 render(childrenVdom, realDOM)  或者 reconcileChildren(childrenVdom, realDOM)

所以，render的执行过程，也是一个 根据函数栈顺序执行的 "深度优先"操作，最终结果是生成真实DOM

举例示意一下执行顺序，需要画一下函数执行栈才能更好的理解
```js
// 入参vdom为
const vdom = const v4 =  {
  key: "h1",
  type: 'h1',
  props: {
    className: "box",
    style: { color: 'red' },
    children: [
      v2,
      v3
  },
}

//S1 第1次render 执行过程
render(vdom, container)，即 render(v4, div.root)：
  createDom(vdom), 即 createDom(v4)：
    createRelDomByVdomType(v4.type) ==> domA = h1

    updateProps(realDom, oldProps, newProps)，即 updateProps(domA, {}, v4.props) ==> domA = h1.box 并且 h1.box.style.color = 'red'

    reconcileChildren(childrenVdom, parentRealDOM)，即 reconcileChildren(v4.props.children, domA)  ==> 对 v4.props.children，依次调用 render(vdom, container)
    即 render(v4.props.children[0], domB)，即 render(v2, domA) 
  
  第1次的createDom 被打断
    
//S2 第2次render 执行过程
render(v2, domA)：
  createDom(v2)：
    createRelDomByVdomType(v2.type) ==> domB = span
    updateProps(domB, {}, v2.props) ==> domB = span
    reconcileChildren(v2.props.children, domB) ==> 对 v2.props.children，依次调用 render
    即 render(v2.props.children[0], domB)，即 render('hello', domB) 
  
  第2次的createDom 被打断  

//S3 第3次render 执行过程
render('hello', domB)：
  createDom('hello')：
    createRelDomByVdomType('hello'.type) ==> domB1 = text
    updateProps(domB, {}, 'hello'.props) ==> domB1 = text.content='hello'
    'hello'无 props.children，所以调用新的 render()，也就没有新的函数入栈 打断createDom
  
  所以第3次的createDom 未被打断   执行到了 return realDom，即 return domB1
  parentRealDom.appendChild(newRealDom), 即 domB.child = domB1

第3次render执行完成，render栈退出，恢复到 第2次render 执行过程中 被打断的位置

//S4 第2次render过程恢复执行
render(v2.props.children[0], domB)，即 render('hello', domB) 完成
接下来继续执行 render(v2.props.children[1], domB)，即 render('span1-c2', domB) 
所以 第4次调用render

//S5 第4次render 执行过程
render('span1-c2', domB)：
  createDom('span1-c2')：
    createRelDomByVdomType('span1-c2'.type) ==> domB2 = span
    updateProps(domB2, {}, 'span1-c2'.props) ==> domB2 = span

    因为 domB2.props.children的数量为1，所以不调用 reconcileChildren，而是直接调用render
  第4次的createDom 被打断

// S6 第5次render 执行过程
render('--', domB2)
  过程类似S3, 即 domB2.child = '--'
第5次render执行完成，render栈退出，恢复到 第4次render 执行过程中 被打断的位置

// S7 恢复 第4次render 执行过程
render('span1-c2', domB)：
  createDom('span1-c2')：返回newRealDom，即domB2
  domB.appendChild(domB2) 
第4次render 执行过程结束， 恢复到第2次render过程恢复执行

//S8 恢复 第2次render 执行过程
 即 render(v4.props.children[1], domB)，即 render(v3, domA1) 

之后过程同上类似，不赘述
```

--------
Q2 如何实现 函数组件显示为 DOM

A：
S1 形如 const element = <FnCom name='test' />的函数组件，经过编译，会转化为 React.createElement( FnCom, { name: "test" } )

S2 React.createElement(type, config, children) ==>  vdom = { type: FnCom,  { name: "test" }, key: undefined  }

S3 ReactDom.render(vdom, container) ==> createDOM(vdom)

createDom(vdom)：
  - realDom = createRelDomByVdomType(vdom.type)
  - updateProps(realDom, oldProps, newProps)：处理非children的props赋值
  - 根据 vdom.props.children的 数量/类型 ，分别调用 render(childrenVdom, realDOM)  或者 reconcileChildren(childrenVdom, realDOM)

S4 createRelDomByVdomType(vdom.type)  
  - 发现vdom.type为函数 ==> return mountFunctionComponent(vdom)
  - mountFunctionComponent：renderVdom = type(props) + return createDOM(renderVdom)
  - 因为mountFunctionComponent执行完成后 已经获取到了newRealDom, 所以createDom直接返回它即可

-------
Q3 如何渲染 自定义类组件内容 到页面上

A:
S1 JSX调用编译： 形如 const element = <ClassCom name="world"/>的类组件，经过编译，会转化为  React.createElement(ClassCom, {name: "world"})

S2 React.createElement执行 ==> 返回 vdom = { type: class ClassCom, props: {name: 'world'}, key: undefined }

S3 ReactDOM.render(vdom, container)执行 ==>
  - createDOM(vdom) ==> 根据vdom，创建并返回 真实DOM元素，即newDOM
  - container.appendChild(newDOM) 

S4 createDOM(vdom)执行 ==> 
  - realDom = createRelDomByVdomType(vdom.type)
  - updateProps(realDom, oldProps, newProps)：处理非children的props赋值
  - reconcileChildren(childrenVdom, realDOM)：依次调用render()，从而把子vdom挂载到realDom上

S5 createRelDomByVdomType(vdom.type)
  - 要能够区分出是类组件，而不是函数组件：定义 React.Component父类上的isReactComponent属性为true + 自定义类组件都继承自 React.Component，从而保证vdom.type.isReactComponent = true

  - 要能获取到类组件 内部的vdom：vdom = new type(props).render()，在此过程中，会渲染出包含页面内容结构的vdom对象

  - 转化vdom为真实dom渲染：reactDOM.render ==> createDOM(vdom)，具体过程见上

-------
Q4 setState是如何工作的，它是同步还是异步执行

A:
S1 从表明形式上
  - 在React可以控制的范围内，如生命周期/事件处理函数等，setState是批量更新 + 异步的；
  - 在React无法控制的范围内，如setTimeout/Promise.then等，它是非批量 + 同步的

执行流程为 开锁isBatchingUpdate + 执行事件处理函数完成后 => 批量执行setState语句 ==> 解锁isBatchingUpdate ==> 页面渲染显示新数据

S2 从实现原理上

使用JSX ==> 调用 React.createElement() ==> 生成vdom
  - 原生类型 vdom  ==> { key: xxx, type: 'div',  props: { children: [] } }
  - 自定义类/函数组件 vdom  ==> { key: xxx, type: Class/Fn,  props: { children: [] } }

举例理解DOM的渲染 和 更新过程：
```js
// 渲染过程
执行JSX ==> 生成classVdom = { type: classCom, props: { xxx }, key: xxx}

1 mount(classVdom, div.root) 
  2 createDOM(classVdom)
    3 return mountClassComponent(classVdom) ==> Instace.oldRenDOM = classVdom.oldRenDOM = renderVdom1 =  { divVdom / textVdom + fnVdom }  +  return createDOM(renderVdom1)

      4 createDOM(divVdom)  ==> domDiv + reconcileChildren(childrenVdom, domDiv)

        5.1 render/mount(textVdom, domDiv)
          6 createDOM(textVdom) ==> textVdom.dom = domTextA + return domTextA
        5.1 domDiv.append(domTextA)  

        5.2 render/mount(fnVdom, domDiv)
          6 createDOM(fnVdom) 
            7 return mountFunctionComponent(fnVdom) ==> fnVdom.oldRenDOM = renderVdom2 =  { btnVdom }   +  return createDOM(renderVdom2)

              8 createDOM(btnVdom)  ==> domBtn + render(textVdomB, domBtn)
                9 render/mount (textVdomB, domBtn)
                  10 createDOM(textVdomB) ==> textVdomB.dom = domTextB + return domTextB
                9 domBtn.append(domTextB)  
              8 btnVdom.dom = domBtn + return domBtn  

            7 return domBtn
          6  return domBtn
        5.2 domDiv.append(domBtn)    
    
      4 divVdom.dom = domDiv + return domDiv
    3 return domDiv
  2 return domDiv
1  div.root.append(domDiv)      


// 更新过程
1 classInstance.setState(partialState, cb)

  2 this.updater.addState(partialState, cb) ==> this.pendingStates.push(partialState) + this.callbacks.push(cb) + this.emitUpdate
    3 this.emitUpdate==> this.updateComponent
      4 this.updateComponent==>  shouldUpdate(this.classInstance, this.getState())
        4.2 this.getState:  根据老状态，和pendingStates这个更新队列，计算并返回 新状态
      
      5 shouldUpdate(classInstance, nextState) ==> classInstance.state = nextState + classInstance.forceUpdate 

        6 forceUpdate==> 
        let oldRenderVdom = this.oldRenderVdom ==> 即 { divVdom / textVdom + fnVdom } 
        oldDOM = findDOM(oldRenderVdom) ==> 即 domDiv
        `findDOM是一个递归函数，是为了防止oldRenderVdom内部返回的还是一个 自定义类/函数组件`

        let newRenderVdom = this.render() ==> 即更新state之后的 rendvdom

        compareTwoVdom(oldDOM.parentNode, oldRenderVdom, newRenderVdom) ==> 替换DOM
        this.oldRenderVdom = newRenderVdom
```

而React的自定义合成事件 + 批量更新实现步骤如下
```js
1 createDOM
  2 updateProps处理onXXX属性时：Events.addEvent(dom, key.toLocaleLowerCase(), newProps[key] )，即对应 dom.onclick = handleClick

    3 addEvent(dom, eventType, handler)：
      S1 创建store = dom.store = {onclick = handler}
      S2 事件委托到document上：document[eventType] = dispatchEvent
  
  2 继续执行UpdateProps ......
1 继续执行createDOM ......

target触发了点击事件后，冒泡到 document.onClick事件上，从而调用了dispatchEvent

1 dispatchEvent(event)：
  S1  切换为批量更新模式: updateQueue.isBatchingUpdate = true
  S2 创建合成事件： let syntheticEvent = createSyntheticEvent(event)
  S3 从 DOM.store 的DOM事件中心中，获取对应当前事件的回调函数 + 执行回调:  let handler = target.store[eventType] + handler.call( target, syntheticEvent)

  2 handler里调用了setState
    3  this.updater.addState(partialState, callback) ==> this.pendingStates.push(partialState) + this.callbacks.push(cb) + this.emitUpdate
      4  this.emitUpdate ==> 如果是updateQueue.isBatchingUpdate，那么updateQueue.updaters.push(this)，否则才会调用 this.updateComponent
  2 handler非 setState的逻辑语句： 直接执行即可
  
  S4 循环更新target，从而模拟 事件冒泡的过程
  S5 完成冒泡过程后，设置updateQueue.isBatchingUpdate为false + 调用批量更新
 updateQueue.batchUpdate
   
  2 updateQueue.batchUpdate ==> 循环每个 updateQueue.updaters +  调用 updater.updateComponent 来更新组建
    3 updateComponent ==> shouldUpdate ==> forceUpdate等一系列更新逻辑
```

---------------------
Q5 ref的实现原理
1 createRef ==> 返回一个{ current: null } 对象
2 JSX ==> createElement ==>  vdom = { type, props, ref, key }
3 reactDOm.createDOM ==> 
  - 原生vdom类型：vdom.dom = dom + ` if(ref) ref.current = dom`

  - 类组件类型：父组件a的ref指向子 类组件实例对象b，b的ref执行 原生dom类型，这样通过 a.b.ref.current来 间接获取到子组件的 dom指向  ==> classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom + `if(ref) ref.current = classInstance`

  - 函数组件类型：通过 `React.forwardRef(FnCom)`, 返回一个新的传递ref的 类组件实例

----------------
Q6 生命周期实现原理
A：
S1 init： constructor在创建类实例时自动执行
S2 componentWillMount/render/componentDidMount：
  - reactDOM.mountClassComponent里调用钩子即可

S3 componentWillUpdate / shouldComponentUpdate：
  - 在 react.Component里的 shouldUpdate函数里实现
  - 根据shouldComponentUpdate的返回结果，决定是否执行 更新视图的逻辑
  - 不管视图是否更新，属性和状态的值 都要更新为最新的

S4 componentDidUpdate
  - 在 react.Component里的 forceUpdate函数里实现
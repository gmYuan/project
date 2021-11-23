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

  - 类组件类型：父组件a的ref指向子 类组件实例对象b，b的ref指向 原生dom类型，这样通过 a.b.ref.current来 间接获取到子组件的 dom指向  ==> classInstance.oldRenderVdom = vdom.oldRenderVdom = renderVdom + `if(ref) ref.current = classInstance`

  - 函数组件类型：通过 `React.forwardRef(FnCom)`, 返回一个forward类型对象 + 后续特定处理

调试过程理解如下：

1 调用JSX ==> createElement()  ==> 生成vdom{ type, key, ref, props }
2 ReactDOM.render(vdom, container) ==> mount(vdom, container) 
  3.1 newDOM = createDOM(vdom)
    4.1  dom = createDOMByVdomType
    4.2 updateProps(dom, {}, props)
    4.3 render(props.children, dom) / reconcileChildren(props.children, dom)
    4.4 挂载 生成的真实dom :  vdom.dom = dom + ref.current = dom

  3.2 container.appendChild(newDOM)  
 

4.1 dom = createDOMByVdomType 过程细化解析 
  5.1 mountClassComponent：处理 class类型的vdom
    6.1 初始化/ 构造类组件实例 classInstance = new type({...defaultProps,...props})
      7 执行类组件构造函数 ==> React.Component默认父组件构造函数 ==>
        classInstance = { props: {} , state: {},  updater: Updater }
    6.2 执行 类组件生命周期：
      7 classInstance.WillMount() 
       let renderVdom = classInstance.render() ==> JSX ==> 子内容vdom
       classInstance.DidMount()
    6.3 addNewPropertyToVdom：vdom.oldRenderVdom = renderVdom
    6.4 addNewPropertyToClassInstance：classInstance.oldRenderVdom = renderVdom
    6.5 处理类组件的ref，让它执行类组件实例 ==>  ref.current = classInstance 
    6.6 根据vdom 生成真实vom ==> 递归执行 return const  dom =  createDOM(renderVdom)

  综上，类组件的vdom 和 classInstance的属性分别有：
  vdom = {type, props, key,  ref: classInstance, oldRenderVdom: vdom,  dom: dom }
  classInstance = { props, state,  updater: Updater, oldRenderVdom: vdom  }

  5.2 mountForwardComponent(vdom)：处理Forward类型的 vdom
    6.1 执行被传入forward的函数组件 ==> let renderVdom = type.render(props, ref)
    6.2 addNewPropertyToVdom：vdom.oldRenderVdom = renderVdom
    6.3 根据vdom 生成真实vom ==> 递归执行 return createDOM(renderVdom)

  5.3 ......

----------------
Q6 生命周期实现原理

A：
  - willMount/render/didMount ==> ReactDOM.render中挂载

组件渲染过程见下：
1 返回JSX ==> React.createElement() ==> 生成 vdom { type, key, ref, props }

2 ReactDOM.render(vdom, container) ==> mount(vdom, container) 
  2.1 newDOM = createDOM(vdom)
  2.2 container.appendChild(newDOM)  
  2.3 comDidMount生命周期执行：`newDOM.componentDidMount()`
 
2.1 newDOM = createDOM(vdom)过程细化
  3.1  dom = createDOMByVdomType：mountClassComponent等
  3.2 updateProps(dom, {}, props)
  3.3 render / reconcileChildren(props.children, dom)
  3.4 在vdom上挂载 生成的真实dom + 处理ref指向： 
    - vdom.dom = dom
    - ref.current = dom


3.1 mountClassComponent 过程细化解析
  4.1 构造组件实例 classInstance = new type({...df, ...props})
    - 执行类组件构造函数 ==> React.Component默认父组件构造函数 
    - classInstance = { props, state,  updater: Updater }
  
  4.2 `执行 类组件生命周期钩子`
    - classInstance.componentWillMount()
    - renderVdom = classInstance.render() ==> JSX/ 子内容vdom

  4.3 在vdom/classInstance上，挂载一些生成的新属性
    -  vdom.classInstance = classInstance
    -  vdom.oldRenderVdom = renderVdom
    -  classInstance.oldRenderVdom = renderVdom
  
  4.4 处理ref，指向类组件的实例：ref.current = classInstance 

  4.5 生成真实DOM + `挂载didMount`
    - return let dom =  createDOM(renderVdom) 递归调用
    - dom.componentDidMount = classInstance.componentDidMount.bind(classInstance)

综上，类组件的vdom 和 classInstance的属性分别有：
  vdom = { type, props, key,  ref, oldRenderVdom,  classInstance, dom }
  classInstance = { props, state,  updater, oldRenderVdom }
其中，
  classInstance.oldRenderVdom 用于 
    - 基于上一次渲染的vdom, `配合vdom.dom` 获取到 上一次视图的真实DOM
    - 用于dom-diff，比较新旧 vdom节点的差异
  
  vdom.classInstance 用于 
    - 执行挂载在 classInstance的生命周期钩子，如willUnmount


3.2 mountFunctionComponent 过程细化解析
  4.1 创建函数组件实例 ==>	let renderVdom = type(props)
  4.2 在vdom上，挂载一些生成的新属性
    -  vdom.oldRenderVdom = renderVdom
  4.3 生成真实DOM ==> return createDOM(renderVdom)

3.3 mountForwardComponent 过程细化解析
  4.1 创建`封装的` 函数组件实例==>	renderVdom = type(props, ref)
  4.2 在vdom上，挂载一些生成的新属性
    -  vdom.oldRenderVdom = renderVdom
  4.3 生成真实DOM ==> return createDOM(renderVdom)


组件更新过程见下：

1 updateProps
  1.1 处理 props.children ==> 略过
  1.2 处理 props.style ==> 处理对象 + 赋值到 dom.style上
  1.3 处理 props.onXXX ==> addEvent(dom,  eventType, handler)
  1.4 处理 props.其他属性 ==> dom[key] = Props[key]
 
1.3 Event里的 addEvent(dom,  eventType, handler)
  2.1 创建store = dom.store = {onclick = handler}
  2.2 事件委托到 document上：document[onclick] = dispatchEvent

3 target触发事件 ==> 冒泡到document.onclick ==> 调用dispatchEvent(event)
  3.1 切换为批量更新模式: updateQueue.isBatchingUpdate = true
  3.2 创建合成事件：syntheticEvent=createSyntheticEvent(event)
  3.3 从 DOM.store 的DOM事件中心中，获取对应当前事件的回调函数 + 执行回调 ==>  let handler = target.store[eventType] + handler.call(target, syntheticEvent)
  3.4 循环冒泡事件 + 事件都执行完成 ==> updateQueue.isBatchingUpdate = false + updateQueue.batchUpdate()

4 handler里调用了setState ==> addState(partialState, cb)
  4.1 更新入队：pendingStates.push(partialState) + cbs.push(cb)
  4.2 触发更新：this.emitUpdate()    

4.2 this.emitUpdate() 
  5.1 如果处于批量更新模式，就把此updater实例 入队到updateQueue ==>  updateQueue.updaters.push(this)
  5.2 不处于批量更新模式/开始执行 updateQueue.batchUpdate，则让组件更新：this.updateComponent() ==>
    shouldUpdate(classInstance, nextProps, this.getState())

5.2 shouldUpdate(classInstance, nextProps, nextState)
  6.1 getState ==> 合并更新 + 返回 最新的state对象值
  6.2 按前置条件决定是否 `执行生命周期` + 是否更新视图：
    - shouldComponentUpdate()
    - componentWillUpdate()
  6.3 无论视图是否更新，属性和状态的值都要更新为最新的：
    - classInstance.props = nextProps
    - 挂上`生命周期钩子: getDerivedStateFromProps`
    - classInstance.state = nextState
  
  
  6.4 如果要更新视图，则调用 classInstance.forceUpdate()

6.4 classInstance.forceUpdate()   
  7.1 获取上一次oldRenderVdom对应的真实DOM
    - oldDOM = findDOM(this.oldRenderVdom)
  7.2 基于新的属性和状态，计算新的虚拟DOM
    - newRenderVdom = this.render()
  
  7.2 `执行生命周期钩子`
    - extraArgs = this.getSnapshotBeforeUpdate()
    - extraArgs 用于之后的 componentDidUpdate(newProps,newState, extraArgs)


  7.3 通过DOM.diff策略，比较新老vdom + 更新视图真实DOM  
    - compareTwoVdom(oldDOM.parentNode, this.oldRenderVdom, newRenderVdom)
  7.4 更新classInstance.oldRenderVdom + 执行 `生命周期`
    - this.oldRenderVdom = newRenderVdom
    -  this.componentDidUpdate( this.props, this.state )

7.3 compareTwoVdom(parentDOM, oldVdom, newVdom, nextDOM)
  8.1 !oldVdom && !newVdom：无变化，什么都不做
  8.2 oldVdom && (!newVdom)：销毁老组件 + `生命周期函数`
    - currentDOM.parentNode.removeChild(currentDOM)
    - oldVdom.classInstance.componentWillUnmount()
  8.3 !oldVdom && newVdom：创建新DOM + `生命周期函数`
    - parentDOM.insertBefore(newDOM, nextDOM) / parentDOM.appendChild(newDOM)
    - newDOM.componentDidMount()
  
  8.4 新老都有 + DOM类型不同：删除老DOM，添加新DOM + `生命周期`
    - oldDOM  = findDOM(oldVdom) + newDOM = createDOM(newVdom)
    - oldDOM.parentNode.replaceChild(newDOM,oldDOM)
    - oldVdom.classInstance.willUnmount() + newDOM.didMount()
  
  8.5 新老都有 + DOM类型相同：复用老节点，进行深度dom diff
    9 updateElement(oldVdom,newVdom)

9 updateElement (oldVdom,newVdom) 
  10.1 文本类型组件，直接更新文本内容即可：
    - let currentDOM = newVdom.dom = findDOM(oldVdom)
    - currentDOM.textContent = newVdom.props.content
  
  10.2 其他原生DOM组件：
    - let currentDOM = newVdom.dom = findDOM(oldVdom)
    - 更新DOM的属性 ==>  updateProps(currentDOM, oldVdom.props, newVdom.props)
    - 更新DOM的children ==> updateChildren(currentDOM, oldVdom.props.children, newVdom.props.children)
  
  10.3 类组件类型 ==> updateClassComponent(oldVdom,newVdom)
  10.4 函数组件类型==> updateFunctionComponent(oldVdom,newVdom)


10.2 updateChildren(parentDOM, oldVChildren, newVChildren)
  - 把oldVChildren/newVChildren封装  为数组，获取较大的长度
  - 找当前的虚拟DOM节点之后的 最近的一个真实DOM节点 ==> 
     nextVNode = oldVChildren.find( (item,index) =>
       index > i  && item && findDOM(item) )

  - 递归逐个比较子元素并更新 ==> compareTwoVdom(
    parentDOM, oldVChildren[i], newVChildren[i],
    nextVNode && findDOM(nextVNode) )

10.3 updateClassComponent(oldVdom,newVdom)
  - classInstance.updater.emitUpdate(newVdom.props)


10.4 updateFunctionComponent(oldVdom,newVdom)
  -  获取 fnVdom的真实父容器DOM： parentDOM = findDOM(oldVdom).parentNode
  -  获取新的 renderVdom：renderVdom = newVdom.type(props)
  - compareTwoVdom(parentDOM, oldVdom.oldRenderVdom, renderVdom)
  - newVdom.oldRenderVdom = renderVdom

----------------
Q7 Context实现原理

A：
1 React.createContext
  - 1.1 返回一个 { Provider, Consumer }的对象
  - 1.2 Provider/Consumer是函数，通过JSX调用时，会生成 函数类型的vdom
  - 1.3 Provider创建了Provider._value，Consumer使用了/消费了 Provider._value

2 处理类组件的 context
  - 2.1 渲染时 ==> 类实例的context属性赋值为静态方法上的值  ` classInstance.context = type.contextType.Provider._value`
  - 2.2 更新时 ==> 思路同上，语法细节略有不同 `this.context = this.constructor.contextType.Provider._value`
  

具体到源码实现，则
1 React.createContext
  - 1.1 返回一个 { Provider, Consumer }的对象
  - 1.2 Provider/Consumer是  {typeof: xxx,  _context: context } 的 循环引用对象

2 处理context类型的vdom  ==>  mountProviderComponent：赋值_currentValue
3 处理类组件的 context 
  - 渲染时： `classInstance.context = type.contextType._currentValue`
  - 更新时： `this.context = this.constructor.contextType._currentValue`





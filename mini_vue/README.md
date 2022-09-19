Vue实现流程介绍

A:<br/>
this._init(options)
  - initState(vm) 
    - initData(vm)
      - vm.data取值代理 ==> proxy(vm,'_data',key)
      - observe(data)
        - new Observer(data)
          - 代理arrayMethods + this.observeArray(data)
          - defineReactive(data, key, value)
            - data的 get/set
            - dep.depend() / dep.notify()
  
  - vm.$mount(vm.$options.el)
    - compileToFunctions(template)
      - parseHTML(template)
      - generate(ast)
      - renderFn

    - mountComponent(vm,el)
      - updateComponent = () => { vm._update(vm._render()) }
      - new Watcher(vm, updateComponent, () => {}, true)
        - dep.pushTarget(watcher) / popTarget()

        vm._render()
          - vm.$options.render.call(vm)
          - vm.pty._c ==> createElement / createTextNode ==> vnode()

        vm._update()
          - patch(oldVnode, vnode) ==> createElm

initGlobalApi(Vue)
  - Vue.mixin: mergeOptions 
    - lifeCycleHooks: 生命周期钩子 ==> 实现订阅
    - callHook: 在不同阶段触发钩子 ==> 实现发布


----------------------
01 rollUp的配置

Q1: <br/>
A: 

S1 rollup依赖安装

S2 设置配置文件rollup.config.js

S3 初始化项目结构


-----------------------------
02 数据劫持定义

Q1: Vue如何实现 扩展解偶 <br/>
A:

S1 定义Vue函数 & 扩展Vue原型对象 + 在构造函数里，执行初始化方法 
  - 如何对 Vue原型对象进行扩展 ==> 通过多个 Mixin组合，从而解偶
  - 入口方法  ==> this._init(options)，在 initMixin中被定义
  - [00:00-05:30]

S1.2 initMixin插件: 实现了多个关于 初始化流程的方法
  - Vue.prototype._init
  - Vue.prototype.$mount


S2 Vue.pty._init: 数据劫持 + 挂载渲染
  - initState(vm): 初始化State ==> initData / initProps等
  - vm.$mount(vm.$options.el): 模板编译 + 挂载组件


S3 initData(vm): 数据劫持 
  - 把data结果 挂载到 vue._data上 [16:00-18:45]
  - 对data进行数据劫持 observe(data)函数定义 [(19:00-02_end)]


------------------------------------
03 对象的数据劫持
04 数组的数据劫持

Q1: Vue2如何实现 数据劫持/响应式原理  <br/>
A: 

initData的流程
  1.执行函数获取到vm.$options.data值，并赋值给 vm_data
  2.用vm._data代理 vm.$options.data的每个值，从而可以直接访问到 vm.data
  3.劫持数据 ==> observe(data)

observe 劫持数据的流程
  1. data是基本类型数据: 直接返回，不进行劫持（递归中止条件）
  2. 如果是对象: 对data里的每个成员，调用defineReactive，递归进行get/set劫持
  3. 递归调用的情况: data里的成员a是一个引用类型/ a之后被赋值了一个新对象地址

  [04Start-04end]
  4. 如果是数组: 单独处理该类型, 因为监测数组里的每个index 过于耗费性能
    - 对数组中的会改变原数组的 原型方法进行覆盖: arrayMethods
    - 如果数组的成员是对象类型，再监控对象的变化: this.observeArray(data)

  5. arrayMethods: 切片编程/高阶函数/代理模式
    - 获取原本的数组原型对象并继承: arrayMethods = Object.create(old)
    - 遍历 arrayMethods中会改变原数组的方法: push/pop等
    - 执行 push/pop + 获取到新插入的数据: insertedArr
    - 监测insertedArr里的每个成员: ob.observeArray(insertedArr)
    - 如何在data对象里，可以调用observeArray ==> data.__ob__ = this(Observer类实例)
     

defineReactive的缺点  [03Start-03end]
  1. 需要递归调用Object.defineProperty劫持 嵌套对象(增加get/set), 影响性能
  2. 所以 Vue3改成了 proxy来监听


------------------------
05 模板编译
06 html-parser实现
07 把html转为AST语法树
08 生成代码
09 生成render函数


Q1: 如何实现 模板编译为render函数 <br/>
A: 

模板编译为 render函数的流程
  1. 编译优先级: render方法 > template属性 > el的内容
  2. 把模板编译成render函数 ==> 
      ast = compileToFunctions(template);
      fnBody = generate(ast);
      renderFn = new Function(`with(this){ return ${fnBody}}`); 


compileToFunctions的流程:
  1.1 把 tempalte转化为 树结构的语法对象 ==> parseHTML(template)
    - 目标演示  [05__11:00-17:00]
    - 正则含义  [05__17:00-27:00]

  1.2 parseHTML(template)实现流程
    - 本质就是: 字符串匹配 + 处理字符串 + 字符串截取
    - 解析开始标签 (parseStartTag) : 获取tagName + 截断已解析部分 + 获取attrs + 截断字符  [06__07:20-16:00]
    - start: 创建元素节点对象, 作为root/curParent值 + 入栈 [07__05:30-07:50]
    - chars: 解析文本标签: 截断空字符串 + 添加文本类型节点 
    [06__16:30-20:00] && [07__07:55-09:10]
    - 解析结束标签: 更新currentParent + 创建父子关系指针
     [06__20:00-24:30] && [07__09:30-15:40]
    - 使用 root/curParent/stack来记录 树结构状态  [07__00:00-05:00]


generate(ast)的流程:
  本质是: 字符串拼接/模板引擎
  目标是: 通过ast树结构，生成函数体字符串内容: _c('div', {id: app}, _v('hello' + _s(name), _v(.....) )   [08__00:00-04:00]

  1. generate(eleAst):  拼接 原生类型的节点对象 (从ast的root开始)
  2. genProps(attrs): 拼接 节点的属性对象 [08__08:00-14:00]

  3. genChildrenn(el): 处理一个节点下的 所有子节点对象，并拼接成字符串
  4. gen(node): 递归函数，分别处理 原生类型/文本类型 的节点 [09__05:00-20:00]


生成函数，注入上下文对象的方法  [09__20:00-25:00]
  1. renderFn = new Function(`with(this){ return ${fnBody}}`); 


-----------------
10 代理_data属性

Q1: 如何实现 vm.data取值代理  <br/>
A: 

S1 通过proxy，代理 vm_data的读取逻辑 [0:00-05:00]

S2 具体实现，见 [01_vue初渲染/src/state.js]


-----------------------
11 初始化渲染流程
12 初次渲染

01 如何实现页面初始化渲染 <br/>
A: 

1. 渲染watcher, 每个组件都有一个watcher  
  - 每次组件数据发生变化，就会触发Watcher监听的回调
  - 所以 Watcher属于 响应数据的 observer下
  - new Watcher(vm, updateComponent, () => {}, true)

1.2 更新函数: updateComponent   [11__00-00:11:00]
  - vm._render: 通过render函数，生成虚拟dom
  - vm._update: 用虚拟dom 生成真实dom

1.3 Watcher的实现流程
  - 构造函数: 调用 get, 即调用 updateComponent [12__00:00-03:00]

2. vm._render的流程: [12__04:00-13:00]
  - 获取到vm.$options.render + render.call(vm)
  - 分别实现 vm.pty._c 和 vm.pty._v 和 vm.pty._s ==> createElement
  - 调用 createElement / createTextNode

2.1 createElement/ createTextNode的流程 [12__13:00-19:30]
  - 调用 vnode，创建 vdom对象

3. 根据vm_render生成的vdom,生成真实dom  [12__33:00-46:30]
  - vm.pty._update ==> patch()
  - patch(oldVnode, vnode)
    - 渲染阶段: createElm + 插入新的真实dom + 删除旧的真实dom
    - 更新阶段

3.1 createElm的实现流程
  - 处理当前vnode节点: vnode.el = document.createElement(tag)
  - 更新属性: updateProperties(vnode);
  - 处理当前vnode节点的子节点: 递归调用 createElm


-----------------------
13 生命周期的合并策略

Q1 如何实现生命周期钩子 <br/>   
A: 

1. 定义Vue 静态属性和方法: initGlobalApi(Vue)  [12:30-20:00]
  - Vue.options
  - Vue.mixin()

2. Vue.mixin具体实现 
  实现订阅逻辑
    - 合并一般属性对象  [20:00-26:00]
    - 合并特殊属性，如生命周期  [26:00-31:00]
    - 支持组件实例的 生命周期合并 [32:00-34:00]
  
  实现发布逻辑  [34:00-42:00]
    - 实现callHook
    - 在不同的阶段，触发调用不同的钩子


-----------------------
14 对象的依赖收集

01 如何实现数据更新后，页面dom也随之自动更新 <br/>
A: 

1. 要存储 可以生成dom的 函数，即存储updateComponent
  - updateComponent被传给了new Watcher(vm, expOrFn)
  - new Watcher() ==> this.get()

1.2 new Watcher()
  - this.get()
    - 在Dep的stack中 存入/推出 Watcher实例 [00:00-10:00]
    - 执行了this.getter()， 即 expOrFn()
 
2. 要能知道数据发生了变化 + 发现数据变化，就自动就触发 渲染流程
  [10:00-18:00]
  - observe() ==> defineReactive对每个data属性进行代理
  - data的每个属性，都有一个dep实例，即new Dep()
  - data.get时，就触发 dep.depend() 来进行订阅
  - data.set时，就触发 dep.notify() 来进行发布

即:

1. 初次渲染: 创建了渲染watcher

2. Dep: 每个data都有一个dep实例，dep可以通过Dep.target，获取到当前的watcher

3. Watcher: 每个watcher实例，都有方法, 可以根据当前data值，渲染出真实dom


-----------------------
15 解决watcher重复存放问题

01 如何处理 读取数据时，dep.depend会重复添加同一个watcher实例 <br/>
A: 

目标:
  - watcher实例 不重复依赖同一个dep实例
  - dep实例 不重复记录 同一个watcher实例

功能流程: [00:00-05:00]

1. dep.depend()
  - 调用 Dep.target.addDep(this)，即 watcher.addDep(dep)

2. watcher.addDep(dep)
  - 不重复的记录 watcher依赖的dep: this.depIds = new Set() + this.deps.push(dep)
  - 让 dep不重复的记录当前的 watcher实例: dep.addSub(watcher)
  

-----------------------
16 数组的依赖收集

01 如何实现 数组类型的data更新时，触发页面渲染 <br/>
A: 

S1 数组类型的data也要有 dep实例  [00:00-02:00]
  - observer实例里，定义this.dep = new Dep()
  - 这样在arrayMethods里，就能通过ob属性来获取到 observer实例

S2 数组类型的data更新时,在这之前要 触发dep的订阅  [02:50-11:30]
  - Vue规定了 data最外层必然是一个对象，这样就可以获取到子属性的 observe实例
  - 当属性触发get时，就尝试进行订阅 childOb.dep.depend()

S3 数组类型的data真正更新时, 要 触发dep的发布 [02:00-02:50]
  - 调用 ob.dep.notify()

S4 处理 data里数组a嵌套数组b的情况  [12:40-23:00]
  - 递归监测数组属性，从而进行订阅 ==> dependArray


---------------
17 异步更新

1. 当前更新问题:
  - 每次更改data，就都会调用updateFn,导致页面多次渲染DOM，性能差

2. 优化方法  [00:00-12:40]
  - watcher.update不再直接调用 watcher.get, 而是使用缓存队列
  - 缓存队列 + 重复watcherId过滤

3. 代码结构优化 [12:40-22:00]
  - nextTick微任务的工具函数封装
  - $nextTick的使用场景 [20:00-22:00]

4. vue.pty.$nextTick实现 [22:00-31:00]


---------------
18 组件定义流程


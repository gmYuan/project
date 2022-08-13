Q1 Vue实现流程介绍

A:

this._init(options)
  1. initState(vm) 
    - initData(vm): 数据劫持/响应式原理 
  
  2. vm.$mount(vm.$options.el)
    - compileToFunctions(template)
    - mountComponent(vm,el)
        1. updateComponent => vm._update( vm._render() )
        2. new Watcher(vm, updateComponent)





S1 定义Vue函数 & 扩展Vue原型对象 + 在构造函数里，执行入口方法 
  - 如何对 Vue原型对象进行扩展 ==> 通过多个 Mixin组合，从而解偶
  - 入口方法  ==> this._init(options)，在 initMixin中被定义
  

S1.2 initMixin插件: 实现了多个关于 初始化渲染的方法
  - Vue.prototype._init
  - Vue.prototype.$mount


S1 ==> S2 Vue.pty._init: 代理数据 + 挂载渲染
  - initState(vm): 对state根据类型 进行细分处理 ==> initData / initProps等
  - vm.$mount(vm.$options.el): 模板编译 + 挂载组件


S2 ==> S3.1 initData(vm): 数据劫持/响应式原理 ==> observe
  - 对 对象中的所有属性 进行劫持: this.walk(data)
  - 对 对象进行遍历, 每个属性用defineProperty重新定义: defineReactive
  - 对数组原来的方法进行改写：切片编程/高阶函数/代理模式
  - 如果数组中的数据是对象类型，需要监控对象的变化


S2 ==> S3.2 Vue.pty.$mount
  - 把模板编译成render函数: render = compileToFunctions(template)
  - 挂载组件: mountComponent(vm,el);


S3.2 ==> S4.1 compileToFunctions
  - 把html代码转化成 "ast"语法:  ast = parseHTML(template);
  - 字符串拼接(模板引擎), 生成函数体:  fnBody = generate(ast);
  - 注入变量上下文环境: new Function(`with(this){ return ${fnBody}}`); 
  - 返回renderFn


S3.2 ==> S4.2 渲染真实DOM 到页面中
  - vm_render: 通过执行 options.render, 生成vdom
  - vm_update: 通过vdom, 生成真实DOM
  - Watcher
 
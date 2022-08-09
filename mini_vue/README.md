Q1 Vue实现流程介绍

A:

S1 对Vue进行声明和扩展 + 初始化数据 this._init(options)
  - 对Vue对象的 原型进行扩展==> 写成一个个的插件，从而解偶代码
  - initMixin


S2 initMixin: 定义原型方法 Vue.prototype._init
  - initState(vm): 对初始化数据的类型进行逻辑细分 ==> Props/ Data/ Computed等
  - vm.$mount(vm.$options.el): 准备模板编译

S2.1 initState(vm)
  - initProps(vm)
  - initMethods(vm)
  - initData(vm): 数据劫持/响应式原理 ==> observe
  - initComputed(vm)
  - initWatch(vm)

S2.2 Vue.prototype.$mount
  - 把模板编译成render函数: render = compileToFunctions(template)
  - 挂载组件: mountComponent(vm,el);


S2.1 ==> S3 observe
  - 对对象中的所有属性 进行劫持: this.walk(data)
  - 对 对象进行遍历, 每个属性用defineProperty重新定义: defineReactive
  - 对数组原来的方法进行改写：切片编程/高阶函数/代理模式
  - 如果数组中的数据是对象类型，需要监控对象的变化
 

S2.2 ==> S4.1 compileToFunctions
  - 把html代码转化成 "ast"语法:  ast = parseHTML(template);
  - 字符串拼接(模板引擎), 生成函数体:  fnBody = generate(ast);
  - 注入变量上下文环境: new Function(`with(this){ return ${fnBody}}`); 
  - 返回renderFn


S2.2 ==> S4.2 渲染真实DOM 到页面中
  - vm_render: 通过执行 options.render, 生成vdom
  - vm_update: 通过vdom, 生成真实DOM
  - Watcher
 
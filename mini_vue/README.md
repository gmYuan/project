01 rollUp的配置

Q1:
A: <br/>

S1 rollup依赖安装

S2 设置配置文件rollup.config.js

S3 初始化项目结构


-----------------------------
02 数据劫持定义 <br/>

Q1: Vue如何实现 扩展解偶
A: <br/>

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
03 

Q1: Vue2如何实现 数据劫持/响应式原理
A: <br/>

S1




----------------
Q1: Vue如何实现 数据劫持/响应式原理
A: <br/>

  - 对 对象中的所有属性 进行劫持: this.walk(data)
  - 对 对象进行遍历, 每个属性用defineProperty重新定义: defineReactive
  - 对数组原来的方法进行改写：切片编程/高阶函数/代理模式
  - 如果数组中的数据是对象类型，需要监控对象的变化







-----------------------
Vue实现流程介绍

A:

this._init(options)
  - initState(vm) 
    - initData(vm)
      - observe(data)
  
  - vm.$mount(vm.$options.el)
    - compileToFunctions(template)
    - mountComponent(vm,el)
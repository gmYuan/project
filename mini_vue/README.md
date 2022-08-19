Vue实现流程介绍

A:<br/>
this._init(options)
  - initState(vm) 
    - initData(vm)
      - observe(data)
        - new Observer(data)
          - 代理arrayMethods + this.observeArray(data)
          - defineReactive(data, key, value)
  
  - vm.$mount(vm.$options.el)
    - compileToFunctions(template)
    - mountComponent(vm,el)


----------------------
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
03 对象的数据劫持
04 数组的数据劫持

Q1: Vue2如何实现 数据劫持/响应式原理
A: <br/>

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


-------------------
05 模板编译

Q1: 如何实现 模板编译
A: <br/>

xxx的流程
  1.









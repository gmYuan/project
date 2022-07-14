(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

    function observe(data) {
      console.log('observe--data', data);
    }

    function initState(vm) {
      var opts = vm.$options;

      if (opts.props) ;

      if (opts.methods) ;

      if (opts.data) {
        initData(vm);
      }

      if (opts.computed) ;

      if (opts.watch) ;
    }

    function initData(vm) {
      var data = vm.$options.data; // 把data结果 挂载到 vue._data上

      vm._data = data = typeof data == 'function' ? data.call(vm) : data; //S3 数据劫持/响应式原理
      // Vue2: 对象==> Object.defineProperty; 数组==> 单独处理
      // 当我去vm上取属性时 ，帮我将属性的取值代理到vm._data上
      // for(let key in data){
      //     proxy(vm,'_data',key);
      // } 

      observe(data);
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        var vm = this;
        vm.$options = options; // S2 对初始化数据的类型进行 逻辑细分 ==> Props/ Data/ Computed等

        initState(vm);
      };
    }

    // 入口：对Vue进行声明和扩展

    function Vue(options) {
      //S1 初始化数据
      this._init(options);
    } //代码技巧：对Vue对象的 原型进行扩展==> 写成一个个的插件，从而解偶代码


    initMixin(Vue);

    return Vue;

})));
//# sourceMappingURL=vue.js.map

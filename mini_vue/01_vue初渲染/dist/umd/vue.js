(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(val) {
    return _typeof(val) == 'object' && val !== null;
  }

  function observe(data) {
    // 如果是对象才观测
    if (!isObject(data)) {
      return;
    }

    return new Observer(data);
  } // 对象类型的 劫持中心

  var Observer = /*#__PURE__*/function () {
    //S1 对对象中的所有属性 进行劫持
    // 缺点：需要递归劫持嵌套对象的属性（增加get/set）,影响性能
    // 所以 Vue3 改成了 proxy来监听
    function Observer(data) {
      _classCallCheck(this, Observer);

      this.walk(data);
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }(); // vue2会对对象进行遍历 ==> 每个属性用defineProperty重新定义


  function defineReactive(data, key, value) {
    observe(value); // 处理对象嵌套 ==> 递归调用

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newV) {
        // Todo 更新视图
        console.log('监测到值发生了变化'); //如果赋值的是一个新对象 ，也需要对这个新对象 进行劫持

        observe(newV);
        value = newV;
      }
    });
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

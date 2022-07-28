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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function isObject(val) {
    return _typeof(val) == 'object' && val !== null;
  }

  // S1 拿到数组原型上的方法 （原来的方法）
  var oldArrayProtoMethods = Array.prototype; //S2 创建新的原型基础对象：arrayMethods.__proto__ = Array.prototype

  var arrayMethods = Object.create(oldArrayProtoMethods); // S3 获取 数组中会改变原数组的方法

  var methods = ["push", "shift", "unshift", "pop", "reverse", "sort", "splice"]; // S4 调用的如果是以上七个方法，就会优先读取下面重写的，否则用原来的数组方法

  methods.forEach(function (method) {
    // 接收参数
    arrayMethods[method] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      //S5 要先执行原逻辑
      var result = oldArrayProtoMethods[method].apply(this, args);
      var inserted; //S6 根据当前数组获取到observer实例

      var ob = this.__ob__;

      switch (method) {
        case "push": // arr.push({a:1},{b:2})

        case "unshift":
          //这2个方法都是追加 追加的内容可能是对象类型，应该被再次进行劫持
          inserted = args;
          break;

        case "splice":
          // vue.$set原理
          inserted = args.slice(2);
      } // S7 如果有新增的内容，要进行继续劫持,
      // 需要观测的是 数组里的每一项，而不是数组


      if (inserted) ob.observeArray(inserted); // S8 返回结果

      return result;
    };
  });

  // 1.如果数据是对象：会将对象不停的递归 进行劫持
  // 2.如果是数组：会劫持数组的方法，并对数组中不是基本数据类型的 进行劫持
  // 劫持对象类型

  function observe(data) {
    // 如果是对象才观测
    if (!isObject(data)) {
      return;
    }

    return new Observer(data);
  } // 劫持中心

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // S3 在所有被劫持过的属性上，都增加 __ob__属性
      // data.__ob__ = this;
      Object.defineProperty(data, "__ob__", {
        value: this,
        enumerable: false // 不可枚举的

      });

      if (Array.isArray(data)) {
        //S2 单独处理 数组劫持的逻辑，因为数组并不能只是 简单检测它的key变化
        //S2.1 对数组原来的方法进行改写：切片编程/高阶函数/代理模式
        data.__proto__ = arrayMethods; //S2.2 如果数组中的数据是对象类型，需要监控对象的变化

        this.observeArray(data);
      } else {
        //S1 对对象中的所有属性 进行劫持
        // 缺点：需要递归劫持嵌套对象的属性（增加get/set）,影响性能
        // 所以 Vue3 改成了 proxy来监听
        this.walk(data);
      }
    }

    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        // 对数组成员里的 嵌套数组/对象类型，进行递归劫持
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }, {
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
        console.log("监测到值发生了变化"); //如果赋值的是一个新对象 ，也需要对这个新对象 进行劫持

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

  // 关于正则可视化，参见：https://jex.im/regulex/#!flags=&re=
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // 标签名
  // ?:匹配不捕获

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //S1 标签开头的正则 捕获的内容是标签名

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // console.log('开始标签是', startTagOpen)
  // console.log('开始标签测试结果是', '<my_name//:is_ygm>'.match(startTagOpen))
  //S2 匹配标签结尾的 </div>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // console.log('结束标签是', endTag)
  //S3 匹配属性 aaa="aaa"  a='aaa'   a=aaa

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; //S4 匹配标签的右箭头>

  var startTagClose = /^\s*(\/?)>/; //S5 匹配Vue里的变量模版 双大括号 {{ }}
  /**
  作用: 把html模板内容转化为 AST节点对象

  流程:
  S1 解析模板内的 标签： startTagMatch / endTagMatch
    - startTagMatch: parseStartTag + start
    - endTagMatch: end +  advance
   
  S2 解析模板内的 文本：chars + advance  

  S3.1 parseStartTag: 获取tagName 和 tag属性 信息
  S3.2 start: 创建 root + 创建AstElement并入栈 + 更新currentParent
  S3.3 chars: 创建 文本类型的AstElement + 作为currentParent.children
  S3.4 end: 利用html文档标签的天然栈性质，创建节点之间的 父子关系
  */

  var root;
  var currentParent;
  var stack = [];
  var html;
  function parseHTML(sourceHTML) {
    html = sourceHTML;

    while (html) {
      //只要html不为空字符串就一直解析
      var textEnd = html.indexOf("<"); // 当前解析的开头
      // S1 说明是标签(开始/结束标签) ==> 处理标签

      if (textEnd == 0) {
        // 解析开始标签
        var startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        } // 解析结束标签


        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      } //S2 处理文本


      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text);
      }
    } // console.log('root是', root)


    return root;
  } // 将字符串进行截取操作 + 更新html内容

  function advance(len) {
    html = html.substring(len);
  } // 处理开始标签


  function parseStartTag() {
    var start = html.match(startTagOpen);

    if (start) {
      var match = {
        tagName: start[1],
        attrs: []
      }; // 删除开始标签左半部分：<div id='app'> 中的 <div

      advance(start[0].length);

      var _end;

      var attr; // 如果没有遇到开始标签的结尾，就不停的解析
      // 能匹配到属性

      while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        // 保存属性值
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5]
        }); // 去掉html当前标签里的 属性

        advance(attr[0].length);
      } // 删除匹配到的开始标签的 右结束标签 >


      if (_end) {
        advance(_end[0].length);
      }

      return match;
    }

    return false; // 不是开始标签
  }

  function start(tagName, attrs) {
    var element = createASTElement(tagName, attrs);

    if (!root) {
      root = element;
    }

    currentParent = element;
    stack.push(element);
  } // 处理结束标签 ==> 在结尾标签处，创建父子关系


  function end(tagName) {
    var element = stack.pop();
    currentParent = stack[stack.length - 1]; // 在闭合时可以知道这个标签的父亲是谁

    if (currentParent) {
      element.parent = currentParent;
      currentParent.children.push(element);
    }
  } // 处理文本


  function chars(text) {
    text = text.trim();

    if (text) {
      currentParent.children.push({
        type: 3,
        text: text
      });
    }
  } // 创建ast元素节点


  function createASTElement(tagName, attrs) {
    return {
      tag: tagName,
      // 标签名
      type: 1,
      // 元素类型
      attrs: attrs,
      parent: null,
      children: []
    };
  }

  // 核心思路就是将模板转化成 下面这段字符串
  // 即 把AST对象 转化为Render函数的 函数体
  // <div id="app" style="color:red"> <p>hello {{name}} </p> hello </div>
  // 将ast树 再次转化成js的语法
  // _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello')) 
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 生成host元素类型标签 对应的 字符串

  function generate(el) {
    var children = genChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genProps(el.attrs)) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  } // 拼接属性

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {}; // 对样式进行特殊的处理 

          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  } // 处理标签 子节点对应的 字符串


  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  }

  function gen(node) {
    // 元素类型标签， 递归调用
    if (node.type == 1) {
      return generate(node); // 处理文本节点 和 变量文本节点
    } else {
      // 节点内容举例: <div>a {{  name  }} b{{age}} c </div>
      var text = node.text;
      var tokens = [];
      var match, index; // 变量含义: 每次的偏移量
      // 正则特性: 只要是全局匹配 就需要将lastIndex每次匹配的时候调到0处

      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index; // 纯文本类型

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        } // 变量文本类型


        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      } // 剩余的 纯文本类型


      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  // 流程: html转化为AST => with + new Function

  function compileToFunctions(template) {
    //1. 把html代码转化成 "ast"语法 （ast树，可以用来描述语言本身）
    var ast = parseHTML(template); //2. 字符串拼接(模板引擎), 生成函数体

    var fnBody = generate(ast); // 3. 注入变量上下文环境 new Function + with

    var renderFn = new Function("with(this){ return ".concat(fnBody, "}")); // vue的render函数执行，返回的就是虚拟dom

    console.log('render--', renderFn);
    return renderFn;
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // S2 对初始化数据的类型进行 逻辑细分 ==> Props/ Data/ Computed等

      initState(vm); // S3 准备模板编译

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    }; // S3 编译过程
    // 把模板转化成 对应的渲染函数render ==>
    // 虚拟dom vnode: 增加额外的对象属性 && 用diff算法来 更新虚拟dom ==>
    // 生成真实dom


    Vue.prototype.$mount = function (el) {
      var vm = this;
      var options = vm.$options;
      el = document.querySelector(el);
      vm.$el = el; // 编译优先级： render方法 > template属性 > el的内容

      if (!options.render) {
        var template = options.template;

        if (!template && el) {
          // 也没有传递template 就取el的内容作为模板
          template = el.outerHTML;
        } //S3.1 将模板编译成render函数


        var render = compileToFunctions(template);
        options.render = render;
      }
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

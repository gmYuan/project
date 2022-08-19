// S1 拿到数组原型上的方法 （原来的方法）
let oldArrayProtoMethods = Array.prototype;

//S2 创建新的原型基础对象：arrayMethods.__proto__ = Array.prototype
export let arrayMethods = Object.create(oldArrayProtoMethods);

// S3 获取 数组中会改变原数组的方法
let methods = ["push", "shift", "unshift", "pop", "reverse", "sort", "splice"];

// S4 调用的如果是以上七个方法，就会优先读取下面重写的，否则用原来的数组方法
methods.forEach((method) => {
  // 接收参数
  arrayMethods[method] = function (...args) {
    //S5 要先执行原逻辑
    const result = oldArrayProtoMethods[method].apply(this, args);
    let inserted;

    //S6 根据当前数组获取到observer实例
    let ob = this.__ob__;

    switch (method) {
      case "push": // arr.push({a:1},{b:2})
      case "unshift":
        //这2个方法都是追加, 追加的内容可能是对象类型，应该被再次进行劫持
        inserted = args;
        break;
      case "splice": // vue.$set原理
        inserted = args.slice(2); // arr.splice(0,1,{a:1},{a:1},{a:1})
      default:
        break;
    }

    // S7 如果有新增的内容，要进行继续劫持,
    // 需要观测的是 数组里的每一项，而不是数组
    if (inserted) ob.observeArray(inserted);

    // S8 返回结果
    return result;
  };
});

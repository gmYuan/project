import { isObject } from "../utils/index";
import { arrayMethods } from "./array";
import Dep from './dep'

// 基本原则：
// 1.如果数据是对象：会将对象不停的递归 进行劫持
// 2.如果是数组：会劫持数组的方法，并对数组中不是基本数据类型的 进行劫持

// 劫持对象类型
export function observe(data) {
  // 如果是对象才观测
  if (!isObject(data)) {
    return;
  }
  return new Observer(data);
}

// 劫持中心
class Observer {
  constructor(data) {
    // S3 在所有被劫持过的属性上，都增加 __ob__属性
    // data.__ob__ = this; // 直接这样写会在递归执行时，因为该属性爆栈
    Object.defineProperty(data, "__ob__", {
      value: this,
      enumerable: false, //不可枚举的,以防止observeArray递归调用爆栈
      configurable: false
    });

    if (Array.isArray(data)) {
      //S2 单独处理 数组劫持的逻辑，因为数组并不能只是 简单检测它的key变化

      //S2.1 对数组原来的方法进行改写：切片编程/高阶函数/代理模式
      data.__proto__ = arrayMethods;

      //S2.2 如果数组中的数据是对象类型，需要监控对象的变化
      this.observeArray(data);
    } else {
      //S1 对对象中的所有属性 进行劫持
      // 缺点：需要递归劫持嵌套对象的属性（增加get/set）,影响性能
      // 所以 Vue3 改成了 proxy来监听
      this.walk(data);
    }
  }

  observeArray(data) {
    // 对数组成员里的 嵌套数组/对象类型，进行递归劫持
    data.forEach((item) => observe(item));
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key]);
    });
  }
}

// vue2会对对象进行遍历 ==> 每个属性用defineProperty重新定义
function defineReactive(data, key, value) {
  let dep = new Dep(); // 每个属性都有一个Dep实例
  observe(value); // 处理对象嵌套 ==> 递归调用

  Object.defineProperty(data, key, {
    get() {
      if (Dep.target) {
        dep.depend()
      }

      return value;
    },
    set(newV) {
      // Todo 更新视图
      console.log("defineReactive监测到值发生了变化");
      //如果赋值的是一个新对象 ，也需要对这个新对象 进行劫持
      observe(newV);
      value = newV;

      dep.notify();
    },
  });
}

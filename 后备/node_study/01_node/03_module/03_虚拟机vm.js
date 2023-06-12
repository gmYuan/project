// 虚拟机模块： (沙箱)/干净的环境

//S1 内部一般情况下操作的都是字符串逻辑
//S2 如何让一个字符串被当作JS来运行  `console.log(1)`

// 方法1：eval默认会取当前的作用域下的变量，所以是不干净的环境
const a = 100;
eval(`console.log('我是eval--', a)`);

// 方法2: new Function: 来创建一个沙箱环境，让字符串执行
let fn = new Function("b", "d", `let c=1; console.log(a)`);

try {
  fn();
} catch (err) {
  console.log("err是--", err);
}

/***
 * 模板引擎的实现原理:
 *   with语法 + 字符串拼接 + new Function来实现
 */

// 方法3 虚拟机模块 ==> 可以创建沙箱环境
// const vm = require("vm");
// vm.runInThisContext(`console.log(a)`);

// S1  node和前端的区别 & node基本属性
/**
 * 
 * 前端里面有dom/bom  服务端中没有widnow；
 * 服务端中有global属性： 全局对象

console.log(Object.keys(global))
  - process 进程（重要）
  - Buffer 类型来处理二进制文件
  - setInterval/ clearInterval +  setTimeout/ clearTimeout
  - setImmediate / clearImmediate  宏任务


浏览器以前的方法 还是可以使用的只是默认没有被枚举出来
console.dir(global,{showHidden:true})  
*/

//-------------------------------
// S2 process属性介绍
/**
1. process默认取值时，会向global中查找
2. node中有一个模块化系统，是以文件为单位的，每个文件都是一个模块，模块中的this被更改为{} )

3. 
console.log(process.platform)   // 可以用这个属性来判断当前执行的系统环境  win32 darwin
console.log(process.argv)         // 1.node.exe  2.node当前执行的文件 （解析用户自己传递的参数）

console.log(process.env.b)  // 环境变量  可以根据环境变量实现不同的功能
window set key=value  mac export key=value  这样设置的环境变量是临时的变量
let domain = process.env.NODE_ENV === 'production'? 'localhost':'zfpx.com';
*/

//-------------------------------
//S3 commander 使用
const program = require("commander");
program.version("1.0.0").name("my_node").usage("my-server");

program.option("-P,--port <v>", "set your port");
program.option("-C,--config <v>", "set your config file");

// program.command("create").action(() => {
//   console.log("创建项目22");
// });

let res = program.parse(process.argv); // -- 开头的是key  不带--是值
// console.log("res", res);

//-------------------------------
// S4 cwd 与 __dirname
console.log(process.cwd());
// 当前用户的工作目录 current working directory  (这个目录可以更改，用户自己切换即可 )
console.log(__dirname); // 当前文件的所在的目录 这个目录是不能手动修改的

/***
在 01_node下执行  node 02_nodeCore/2_node.js

  -  /Users/ygm/Documents/learn/project/node_study/01_node
  - /Users/ygm/Documents/learn/project/node_study/01_node/02_nodeCore

*/

//-------------------------------
// S5 node中的事件环和浏览器中的区别

// S5.1
// node中自己实现的微任务  nextTick / queueMicrotask
// console.log(process.nextTick);

// S5.2 node中setImmediate 属于宏任务

// S5.3 setImmediate 和 setTimeout执行顺序受性能影响，顺序是不固定的
setTimeout(() => {
  // 进入事件环时 setTimeout 有可能没有完成
  console.log("timeout");
}, 0);
setImmediate(() => {
  console.log("setImmediate");
});

// S5.4 poll之后则必然先执行setImmediate
const fs = require("fs");
// poll 完成后 setImmediate -> setTimeout
fs.readFile("./name.txt", () => {
  setTimeout(() => {
    console.log("fs--timeout");
  }, 0);
  setImmediate(() => {
    console.log("fs--setImmediate");
  });
});

//  S5.5 process.nextTick 并不属于事件环的一部分  在本轮代码执行后执行

setTimeout(() => {
  console.log(1);
  Promise.resolve().then(() => {
    console.log("then");
  });
  // nextTick 比 promise.then的优先级还高
  process.nextTick(() => {
    console.log("nextTick");
  });
}, 0);
setTimeout(() => {
  console.log(2);
}, 0);

// vue的源码 nextTick 方法 描述了浏览器中常见的 宏任务和微任务

// 宏任务 script / ui / setTiemout / setInterval /requestFrameAnimation / setImmediate / MessageChannel  异步的  click  ajax

// 语言的本身提供的 promise.then mutationObserver nextTick

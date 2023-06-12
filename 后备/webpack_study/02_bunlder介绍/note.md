webpack的核心功能 ==> 打包器
  - 支持JS模块的导入导出: import/export语法

S1 如何让浏览器支持 import/export语法
  - 方法1: 使用script标签 <script src='xxx' type='module'> ;
    缺点: 兼容性较差 + 文件请求会过多

  - 方法2: 转义关键字 ==> @babel/core + @babel/preset-env

具体实现，见 bundler_1.ts


--------------------------
S2 运行bundler_1.ts，或者说 import/export转义后的代码内容 是什么

```ts
"use strict";
// 设置 exports = { __esModule: true }
Object.defineProperty(exports, "__esModule", {value: true}); 

// 重置 exports = { __esModule: true， default: undefined }
exports["default"] = void 0;   

// 语法兼容的情况下, 把import 转化为 require("./b.js")函数调用
var _b = _interopRequireDefault(require("./b.js"));        
function _interopRequireDefault(obj) {                       
  return obj && obj.__esModule ? obj : { "default": obj };
}
var a = {
  value: 'a',  
  getB: function getB() {
    return _b["default"].value + ' from a.js';              
  }
};

// 把export 转化为 exports = { __esModule: true， default: a }
var _default = a;                                           
exports["default"] = _default;                               
```

本质上，就是:
ESModule语法 变成了 CommonJS规则
  - import关键字会变成 require函数
  - export关键字会变成 exports对象


--------------------------
S3 如何实现一个打包器

生成的打包文件内容期望
  - 有一个依赖数组：{ key: string, deps: string[], code: string }[]
  - 有一个执行入口函数：execute(depRelation[0].key)
  - 调用code函数，往 module.exports 上添加导出属性
  - 打包后的生成文件，见 dist.js / dist2.js


具体实现流程
S1 初始化一个空的 depRelation数组，用于收集依赖
S2 读取入口文件内容 + 遇到依赖模块的AST语句，就存入到 depRelation数组

S3 生成/定义 打包后生成的 文件内容
  - 遍历 depRelation，修改其中的code为 commonJS规则函数 
  - 定义一个缓存对象modules， 用来保证不会陷入 循环引用导致爆栈
  - 执行入口文件 execute(depRelation[0].key)

S4 execute的逻辑
  - 定义了 require函数逻辑： 就是用于 执行导入的文件内容 ==> execute(pathToKey)
  - 定义了 结果对象: module = { exports: { __esModule: true, default: xx } }
  - 执行了 item.code(require, module, module.exports)
  - 在执行完item.code，往module.exports上添加属性后 + 返回了 module.exports对象
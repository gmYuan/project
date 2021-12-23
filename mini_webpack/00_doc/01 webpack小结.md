## webpack小结

Q1：webpack是什么

A:
S1 对于JS程序的 静态模块打包工具
S2 webpack打包程序 ==> 基于模块生成依赖图 ==> 生成一个/多个bundle
S3 安装webpack
  -  [官方文档-起步](https://webpack.docschina.org/guides/getting-started/)

-----------------------------
Q2 webpack 有哪些核心概念

A:
S1 入口(entry)：主执行文件， 依赖图起点
S2 输出(output)：定义/配置 输出bundle(多个 module集合)的 相关信息
S3 loader：
  1. webpack 只能理解 JS 和 JSON 文件
  2. loader 用于把其他类型的文件 转化为Webpack的 有效模块，并添加到依赖图中
  3. loader 本质上是一个输出JS模块的 函数
  
S4 插件(plugin):
  1. 生命周期 钩子函数，可以执行各种类型的任务
  2. 包括：打包优化，资源管理，注入环境变量等

S5 模式(mode):
  1. 开启webpack在不同环境下的 优化设置

具体配置参考，见
[官方文档- 概念](https://webpack.docschina.org/concepts/)

---------------------------------------
Q3 如何配置本地开发服务器

A:  
S1 使用 webpack-dev-server
S2 运行在内存中--> 内存文件系统: memory-fs
S3 output文件访问路径-->
  http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename]
S4 devServer的static配置==> 待继续学习

具体配置参考，见
[官方- 指南 - 开发环境](https://webpack.docschina.org/guides/development/)
[官方- 配置 - DevServer](https://webpack.docschina.org/configuration/dev-server/)

---------------------------------------
Q4 如何配置 图片资源引入

A:
S1 使用步骤为：安装 --> 配置 --> 使用

S1 处理less/css等 样式文件的引入：less-loader/ css-loader/ style-loader
S2 处理图片的引入
  1. file-loader/ url-loader/ html-loader/ asset module(内置模块)
  2. file-loader处理内容：拷贝图片 + 把图片模块 变成JS模块

[官方- 指南- 管理资源](https://webpack.docschina.org/guides/asset-management/)

---------------------------------------
Q5 如何配置转化 ES6/ES7等语法

A:
S1 安装loader、预设、集成、插件：
  1. npm install -D babel-loader @babel/core @babel/preset-env
  2. npm install --save-dev @babel/preset-react
  3. npm install --save @babel/polyfill
  4.1  npm install --save-dev @babel/plugin-proposal-decorators
  4.2 npm install --save-dev @babel/plugin-proposal-class-properties

S2 loader/ 预设/ 的功能
  1. babel-loader：使用/依赖 babelCore，来进行内容转化，它的作用 就是调用babelCore
  2. babelCore：只负责 代码 <==> 抽象语法树的双向转化，只是提供一个过程管理功能
  3. presetEnv：把ES6语法树，按一定的规则 转化成 ES5语法树
  



[官方- Loader- babel-loader](https://webpack.docschina.org/loaders/babel-loader/)
[babel官方- 插件](https://www.babeljs.cn/docs/plugins-list)



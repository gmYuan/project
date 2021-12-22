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
Q4 有哪些常用的loader

A:
S1 使用步骤为：安装 --> 配置 --> 使用

S1 处理less/css等 样式文件的引入：less-loader/ css-loader/ style-loader





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

S2 loader/ 预设/插件 的功能
  1. babel-loader：使用/依赖 babelCore，来进行内容转化，它的作用 就是调用babelCore
  2. babelCore：只负责 代码 <==> 抽象语法树的双向转化，只是提供一个过程管理功能
  3. presetEnv：把ES6语法树，按一定的规则 转化成 ES5语法树
   
  4. 预设是 插件的集合

[官方- Loader- babel-loader](https://webpack.docschina.org/loaders/babel-loader/)
[babel官方- 插件](https://www.babeljs.cn/docs/plugins-list)


---------------------------------------
Q6 如何配置 eslint规校验

A:
S1 安装esllint/ eslint-loader/ @babel/eslint
  - eslint-loader已被替换为 eslint-webpack-plugin
  - @babel/eslint已被替换为 @babel/eslint-parser
  1. npm install eslint eslint-webpack-plugin --save-dev
  2. npm install @babel/eslint-parser --save-dev

S2 配置规则
  1. eslint-loader：
    - loader: 'eslint-loader', // 先进行代码校验，然后再编译代码
    - enforce: 'pre',        // 强制指定顺序  pre normal inline post
    - options: { fix: true },    // 启动自动修复
    - include: resolve(__dirname, 'src'),    // 白名单
    - exclude:/node_modules/               // 黑名单
  
  2. 新增配置文件.eslintrc.js
    - 配置 parser/rules等规则

S3 引入规范化的规则集合
  1. 安装eslint-config-airbnb: 
    - npx install-peerdeps --dev eslint-config-airbnb
  2. eslintrc.js 配置： ` extends: 'airbnb' `
  3. 自动修复设置：IDE功能配置文件

[官方- plugin- EslintWebpackPlugin](https://webpack.docschina.org/plugins/eslint-webpack-plugin/)
[@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)


---------------------------------------
Q7 如何配置 sourceMap
A：
S1 明确各类型取值的含义
  - source-map：生成单独的 .map文件 + 包含行列映射 + 包含loader的map
  - eval：每个模块都使用 eval() 执行 + 不包含行映射 + 可以缓存以提高性能
  - cheap：不包含列映射 + 忽略 loader的 source map
  - module：包含loader的 souce map
  - inline：source map转换为 DataUrl后添加到bundle中，不生成单独的.map

S2 最佳实践配置
  - 开发环境：`devtool: eval-cheap-module-source-map`
  - 生产环境：`devtool: hidden-source-map`

[官方- 配置- Devtool](https://webpack.docschina.org/configuration/devtool/)


---------------------------------------
Q8 如何加载第三方组件
A:
S1 加载方式
  1. import/ require 直接引用：痛点是比较麻烦，每次使用都要引入
  2. webpack.ProvidePlugin组件引入
    - 优点是 不需要手动引用了，直接 就能使用
    - 缺点是 无法在全局下使用
  3. expose-loader引入
    - 配置内容为：exposes: { globalName: "_", override: true }
  4. CDN 
    - 手动导入 CDN插件脚本
    - 执行后 会被挂在到全局对象上
    - 配置 externals排除依赖
    - 缺点：需要手动插入脚本 + 不管代码里用到没有用到，都会引入
  5. html-webpack-extenrals-plugin
    - 自动导入 CDN等脚本
    - 只会用到时才 按需引入

[官方- loader- expose-loader](https://webpack.docschina.org/loaders/expose-loader/)

[npm- htmlWebpackExternalsPlugin](https://www.npmjs.com/package/html-webpack-externals-plugin)


---------------------------------------
Q9 如何实现 webpack环境配置
A:

S1 设置webpack-cli的env值，会被传入到webpack.config.js的函数里
  -  scripts里配置 "webpack --env develop"
  -  --env只能给webpack配置文件自己使用

S2 使用cross-env配置 NODE_ENV变量
  -  scripts里配置  "wt2": "cross-env NODE_ENV=wt2 webpack"
  -  通过cross-env，可以设置 node环境中的process.env.NODE_ENV值
  
S3 设置webpack-cli的mode值
  - scripts里配置 webpack --mode=development
  - mode ==> 关联了 其他JS文件内的 process.env.NODE_ENV变量值
  - webpack mode默认值是production

S4 如何在全局里拿到 NODE_ENV变量
  - 设置webpack.DefinePlugin：定义全局变量的插件
  - 通过webpack.DefinePlugin，可以在浏览器中模拟 NODE_ENV变量

[官方-API- cli](https://webpack.docschina.org/api/cli/#env)

[cross-env介绍](https://www.npmjs.com/package/cross-env)


---------------------------------------
Q10 如何实现 
A:
S1
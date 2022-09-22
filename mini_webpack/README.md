## mini_webpack目录

01 webpack的核心概念

Q1: webpack核心概念介绍 <br/>
A: 

S1 入口(entry): 主执行文件， 依赖图起点
  - 使用不同的配置文件: https://webpack.docschina.org/configuration/#use-different-configuration-file

S2 输出(output): 配置 输出bundle(多个 module集合)的 相关信息

S3 加载器(loader): [21:00-32:00]
  - webpack 只能理解 JS 和 JSON 文件
  - loader 可以把其他类型的文件 转化为JS模块，并添加到依赖图中
  - loader 本质上是一个 输出JS模块的函数

S4 插件(plugin):
  - 它通过webpack提供的 生命周期钩子，可以执行各种类型的任务
  - 包括：打包优化，资源管理，注入环境变量等

S5 模式(mode):
  - 用于设置 webpack在不同环境下的 打包配置

具体配置参考，见
[官方文档- 概念](https://webpack.docschina.org/concepts/)


Q2: 其他知识点备忘<br/>
A:

S1 Node.js中 resolve和join的区别  [13:00-15:00]


---------------------------------------
02 配置webpack-dev-server

Q1: webpack-dev-server介绍

A: <br/>

S1 运行在内存中--> 内存文件系统: memory-fs

S2 output文件访问路径-->
  http://[devServer.host]:[devServer.port]/[output.publicPath]/[output.filename]

S3 devServer的static配置 [11:50-14:00]

具体配置参考，见

[官方- 指南 - 开发环境](https://webpack.docschina.org/guides/development/)

[官方- 配置 - DevServer](https://webpack.docschina.org/configuration/dev-server/)


Q2: 其他知识点备忘 <br/>
A: 

S1 Node.js中 memory-fs介绍  [14:00-15:00]


----------------------
03 配置支持less/scss/css类型文件

Q1: 如何安装和使用 css-loader <br/>
A: 

S1 [官方- 指南 - 管理资源](https://webpack.docschina.org/guides/asset-management/#loading-css)


Q2: 其他知识点备忘  <br/>
A: 

S1 path /publicPath /contentBase含义 [00:00-18:35] & [06_00:00-14:30]
  - path: 指定 输出目录
  - fileName: 指定 打包文件在 path下的文件路径

  - publicPath: 用于指定没有在entry中导入，但是却在项目中被依赖的资源(按需加载的资源/静态资源)的 url请求路径，同时也是 打包后的index.html里引用资源的前缀
  - 本质上，publicPath就相当于配置 dist目录的 "虚拟目录"别名

  - contentBase: 用于在 dev环境中配置 读取的静态资源 所在的目录,在webpack5中，已被 static_dir替代


------------------------
04 支持图片

Q1: 如何支持 图片资源引入 <br/>
A: 

S1 file-loader(url-loader)/ html-loader/ asset module(内置模块)
  - file-loader: 拷贝图片 + 把图片模块 变成JS模块 ==> JS中 import引入图片
  - css-loaer: css中的 ulr()引入图片
  - html-loader: html中的 直接引入图片的相对路径 [16:00-17:30]

S2 file-loader的简单实现
  - 具体内容见 01_basic/loaders/file-loader.js

具体配置，可参考

[官方- 指南- 管理资源](https://webpack.docschina.org/guides/asset-management/)


---------------------------------------
05 支持JS语法

Q1: 如何支持 ES6/ES7等语法   <br/>
A:

S1 安装loader、预设、插件、集成:
  1. npm install -D babel-loader @babel/core @babel/preset-env
  2. npm install --save-dev @babel/preset-react
  3. npm install --save @babel/polyfill
  4.1  npm install --save-dev @babel/plugin-proposal-decorators
  4.2 npm install --save-dev @babel/plugin-proposal-class-properties

S2 配置使用，具体见

[官方- Loader- babel-loader](https://webpack.docschina.org/loaders/babel-loader/)

[babel官方- 插件](https://www.babeljs.cn/docs/plugins-list)


S3 loader/ 预设/插件 的功能  [08:50-15:50]
  - babel-loader的简单实现，见 01_basic/loaders/babel-loader.js

  - babel-loader：使用/依赖 babelCore，来进行内容转化，它的作用 就是调用babelCore
  - babelCore：只负责 代码 <==> 抽象语法树的双向转化，只是提供一个过程管理功能

  - presetEnv：把ES6语法树，按一定的规则 转化成 ES5语法树
   
  - 预设是 插件的集合，安装一个预设相当于 安装了多个插件


---------------------------------------
06 解析path等问题

Q1: 如何支持 ES6/ES7中 类似Promise的 新的API [19:00-27:00]  <br/>
A: 

S1 全量使用 @babel/polyfill

S2 在 @babel/preset-env中 配置参数，以 按需使用polyfill

S3 polyfill-service: 了解即可   [38:30-44:00]


S4 关于useBuiltIns参数含义  [46:00-49:20]
  - false: 全量引入polyfill
  - entry: 手动引入 需要的polyfill
  - usage: 根据配置和使用，按需引入polyfill

需要使用polyfill的原因： @babel/preset-env只能转化ES6的语法(如 箭头函数)，无法转化API(如 Promise)和实例方法(如 String.pty.includes)


---------------------------------------
07 eslint代码风格检查

Q1: 如何配置eslint  <br/>
A: 

S1 安装esllint/ eslint-loader/ @babel/eslint
  - eslint-loader已被替换为 eslint-webpack-plugin
  - @babel/eslint已被替换为 @babel/eslint-parser
  1. npm install eslint eslint-webpack-plugin --save-dev
  2. npm install @babel/eslint-parser --save-dev


S2 配置规则
  1. eslint-loader：  [01:00-05:30]
    - loader: 'eslint-loader', // 先进行代码校验，然后再编译代码
    - enforce: 'pre',        // 强制指定顺序  pre normal inline post
    - options: { fix: true },    // 启动自动修复
    - include: resolve(__dirname, 'src'),    // 白名单
    - exclude: /node_modules/               // 黑名单
  
  2. 新增配置文件.eslintrc.js     [05:30-10:30]
    - 配置 parser/rules等规则

S3 引入规范化的规则集合    [13:00-16:00]
  1. 安装eslint-config-airbnb: 
    - npx install-peerdeps --dev eslint-config-airbnb
  2. eslintrc.js 配置： ` extends: 'airbnb' `
  3. 自动修复设置：IDE功能配置文件  [16:50-17:50]


具体参考 

[官方- plugin- EslintWebpackPlugin](https://webpack.docschina.org/plugins/eslint-webpack-plugin/)

[@babel/eslint-parser](https://www.npmjs.com/package/@babel/eslint-parser)


---------------------------------------
08 sourceMap
13 sourceMap答疑

Q1 如何配置 sourceMap <br/>
A:

S1 明确各类型取值的含义
  - source-map：生成单独的 .map文件 + 包含行列映射 + 包含loader的map
  - eval：模块级别的sourceMap + 每个模块都使用 eval() 执行 + 不包含行映射 + 可以缓存sourceMap文件 以提高性能 [21:00-26:00]
  - cheap：不包含列映射 + 不包含 loader的sourceMap  [12:00-19:00]
  - module：包含loader的 sourceMap
  - inline：sourceMap转换为 DataUrl后添加到bundle中，不生成单独的.map

S2 常见配置组合 [27:00-30:30]
  - source-map
  - eval-source-map
  - cheap-source-map
  - ......

S2 最佳实践配置 [31:20-36:30]
  - 开发环境：`devtool: cheap-module-eval-source-map`
  - 生产环境：`devtool: hidden-source-map`

S3 更细化配置sourceMap方法  [13__10:00-24:00]
   - 使用 SourceMapDevToolPlugin


具体文档，可见

[官方- 配置- Devtool](https://webpack.docschina.org/configuration/devtool/)

[官方- plugin- SourceMapDevToolPlugin](https://webpack.docschina.org/plugins/source-map-dev-tool-plugin/)


---------------------------------------
09 打包第三方类库

Q1 如何加载 第三方库 <br/>
A:

S1 import/require 直接引用
  - 缺点: 比较麻烦，模块内每次使用都要 手动引入

S2 webpack.ProvidePlugin组件引入  [02:30-06:50]
  - 优点: 不需要在模块中手动引用, 直接 就能使用
  - 缺点: 无法在全局下使用

S3 expose-loader引入   [06:50-17:20]
  - 优点: 可以在全局作用域内 使用
  - 配置内容为：exposes: { globalName: "_", override: true }
  
S4 CDN   [17:30-22:30]
  - 手动导入 CDN插件脚本
  - 执行后 会被挂在到全局对象上
  - 配置 externals排除依赖
  - 缺点：需要手动插入脚本 + 不管代码里用到没有用到，都会引入

S5 html-webpack-extenrals-plugin  [23:00-30:00]
  - 自动导入 CDN等脚本
  - 只会用到时才 按需引入
  - 具体配置实例，见 01_basic/webpack.config.js

具体文档，可参考

[官方- loader- expose-loader](https://webpack.docschina.org/loaders/expose-loader/)

[npm- htmlWebpackExternalsPlugin](https://www.npmjs.com/package/html-webpack-externals-plugin)


---------------------------------------
10 环境变量配置

Q1 如何设置 webpack环境变量 <br/>
A:
 
1. webpack-cli的env值   [00:00-06:00]
  - scripts里配置 "webpack --env develop"
  - 设置webpack-cli的env值，会被传入到webpack.config.js的函数里
  - env只能给webpack配置文件自己使用 ==> process.env.NODE_ENV无法获取到
  - 当 env 和 mode值不一致时，webpack配置文件内 会以mode值为准


2. 使用cross-env配置 NODE_ENV变量   [00:60-14:00]
  - scripts里配置  "wt2": "cross-env NODE_ENV=wt2 webpack"
  - 通过cross-env，可以设置 node环境中的process.env.NODE_ENV值

  
3. 设置webpack-cli的mode值 [具体见11]
  - 默认为production
  - 可以通过命令行配置  修改值 ==>  dev: webpack --mode=development
  - 在模块内，可以通过 process.env.NODE_ENV读取到它的值
  - 在webpack.config.js内，无法通过 process.env.NODE_ENV读取值


4. 在全局里拿到 NODE_ENV变量  [16:00-30:00]
  - 设置webpack.DefinePlugin: 定义全局变量的插件
  - 通过webpack.DefinePlugin，可以在浏览器中模拟 NODE_ENV变量

具体文档，见: 

[官方-API- cli](https://webpack.docschina.org/api/cli/#env)

[cross-env介绍](https://www.npmjs.com/package/cross-env)


---------------------------------------
11 开发和线上环境配置

Q1 如何分别设置 webpack的开发/生产环境 <br/>
A:

1. 设置webpack-cli的mode值  [00:00-10:00]
  - 默认为production
  - 可以通过命令行配置  修改值 ==>  dev: webpack --mode=development
  - 在模块内，可以通过 process.env.NODE_ENV读取到它的值
  - 在webpack.config.js内，无法通过 process.env.NODE_ENV读取值

2. webpack-cli的env值   [10:00-16:00]
  - scripts里配置 "webpack --env develop"
  - 设置webpack-cli的env值，会被传入到webpack.config.js的函数里
  - env只能给webpack配置文件自己使用 ==> process.env.NODE_ENV无法获取到

3. webpack.DefinePlugin  [17:00-21:00]

4. 使用cross-env配置 NODE_ENV变量 [21:00-23:00]

小结:  [23:00-43:00]

1. 影响环境变量的3个变量: --mode=xxx/ cross-env NODE_ENV=wt2 / --env xxx
2. mode决定了 模块内的process.env.NODE_ENV 的值
3. cross-env NODE_ENV (export NODE_ENV) 决定了node环境下的process.env.NODE_ENV 的值 
4. --env决定了 webpack.config.js入口函数的 env形参变量值



21 env环境变量

1. 配置环境变量的第4种方式: dotenv  [01:00-09:00]

文档见: [dotenv](https://www.npmjs.com/package/dotenv)


---------------------------------------
12 babel答疑_polyfill和runtime等

1. babel-loader的presets  [02:00-06:30]
  - "@babel/preset-env": 只能转化ES6的语法，不能转化新的API
  - ES6的语法: 如箭头函数;  ES6的API和属性方法: 如Promise

2. babel-loader的polyfill   [06:30-09:30]
  - "@babel/polyfill": 用于转化ES6 新的API(属性方法等)
  - 设置 ['@babel/preset-env', { useBuiltIns: 'xxx' } ]  

2.2 polyfill的引入方式    [09:30-19:00-21:00]
  - 全量引入: { useBuiltIns: 'entry' } + 使用模块中引入 `require('@babel/polyfill')` + core2/3
  - 按需使用 polyfill：{ useBuiltIns: 'useage' }
  - 缺点：污染了全局对象和变量


3. babel-runtime库：提供编译模块的 工具函数 [21:00-25:00]
  - 优点：不会污染 全局空间污染
  - 缺点：每次使用时，都需要在使用模块中 手动引入所需工具函数
  - 安装：`npm install --save @babel/runtime`
  - 使用：在a.js中直接引入`require('babel-runtime/core-js/promise')`即可


4. @babel/plugin-transform-runtime插件  [25:00-36:00]
  - 按需自动引入babel-runtime工具函数(babel-runtime/core-js、babel-runtime/regenerator)
  - 移除内联的babel helpers，替换使用 babel-runtime/helpers

小结: [36:00-38:00]
  - babel-runtime 适合 在组件/类库项目中使用
  - babel-polyfill适合 在业务项目中使用


[@babel/plugin-transform-runtime 到底是什么](https://zhuanlan.zhihu.com/p/147083132)

[@babel/plugin-transform-runtime官方文档](https://babeljs.io/docs/en/babel-plugin-transform-runtime)


---------------------------------------
14 watch/ clean/ copy/ proxy

Q1 如何设置源内容更新后，自动更新 打包文件  <br/>
A:             

1. 配置 watch: true + watchOptions  [01:15-07:30]


Q2 其他知识 <br/>
1. copy-webpack-plugin  [07:30-11:00]

2. clean-webpack-plugin [24:00-28:00]

3. 配置proxy  [28:30-39:00__41:30-51:10]
  - devServer: { proxy: { target: {}}, before() {} ....  }
  - dev-server.js ==> webpack-dev-middleware + express
  - nodemon dev-server.js


4. chunk/ bundle的 含义  [12:30-14:00__17:00-23:30]
  - chunk
    - 模块a及其依赖模块b/c... 的集合，叫做chunk
    - 单独生成chunk的情况: 入口文件 / 代码分割/ 动态import()
  - bundle: 
    - chunk打包后生成的资源文件，叫做bunlde
    - webpack 没有bundle概念，而是叫做 assets (产出的资源文件)


[官方- 配置- watch](https://webpack.docschina.org/configuration/watch/)

[官方- 配置- proxy](https://webpack.docschina.org/configuration/dev-server/#devserverproxy)

[clean-webpack-plugin](https://www.npmjs.com/package/clean-webpack-plugin)

[webpack-dev-middleware](https://www.npmjs.com/package/webpack-dev-middleware) 


---------------------------------------
15 hash

Q1 如何设置 MiniCssExtractPlugin <br/>
A:  

1. MiniCssExtractPlugin：抽取CSS为单独的文件，以并行下载样式文件  [10:30-30:00]
  - style-loader的简单实现  [00:30-03:00]
  - 用 MiniCssExtractPlugin.loader替换掉 style-loader
  - 把收集到的所有的CSS样式都写入到 [name].css
  - HtmlWebpackPlugin把此资源插入到HTML（webpack在打包后 会把所有的产出的资源放在assets对象上）
  - MiniCssExtractPlugin.loader的简单实现 [20:30-25:00]


Q2 其他知识点 <br/>
A:  

1. output里 fileName和chunkName的含义   [30:00-39:30]
  - 分别配置了 入口代码块的名称/ 非入口代码块的名称
  - 单独生成chunk的情况: 入口文件 / 代码分割(vendor/common)/ 动态import()

2. 图片资源等打包到单独的文件夹内  [39:30-49:30]
  - url-loader配置 outputPath + publicPath
  - url-loader配置 name: 'images/[name].[ext]'
  

3. hash相关   [50:00-1:08:00]
  - hash是"文件指纹"，每次webpack构建，就会生成一个 统一的哈希值
  - hash一般是 配合CDN缓存使用
  - chunkHash：根据chunk生成hash，来源于同一个chunk，则hash值一样
  - contentHash：根据内容生成hash，文件内容相同，则hash值一样

具体示例，可见 [hash内容](01_basic/debug/04 hash内容.js)


4. 配置项里, [name]的值如何确定的  [1:09:00-1:12:00]
  - 对于入口chunkn来说，name就是 entry的key, 字符串就是默认值 main
  - 对于非入口来说 
    懒加载时：import('./src/title.js') ==> src_title_js
    代码分割:  vendor common  是由人为指定的

[MiniCssExtractPlugin](https://webpack.docschina.org/plugins/mini-css-extract-plugin#root) 


19 hash实战

1. chunkHash的使用   [09:00-16:30]
  - 使用场景: 文件缓存，以优化性能
  - 使用方法 

![chunkHash含义.png](https://imgtu.com/i/H1HAr6)


2. contentHash的使用   [16:40-19:30]
  - 使用方法
  - 缺点：需要读取文件内容，比价耗时

![contentHash含义.png](https://s4.ax1x.com/2022/02/08/H1HqFe.png)


3. hash的选取场景   [22:00-25:00]
  - 单入口: 一般直接用hash
  - 多入口: 一般使用 chunkHash
  - 文件内容很少变化 + 需要长时间缓存: 一般使用 contentHash


----------------------------
16 CSS兼容和压缩

Q1 如何配置 自动兼容CSS样式 / 压缩CSS和JS文件 <br/>
A:  

1. 配置postcss  [01:30-09:30]

2. 配置optimize-css-assets-webpack-plugin  [10:25-15:00]
  - 作用: 压缩和优化CSS资源的插件

3. 配置 terser-webpack-plugin
  - 作用: 压缩和优化JS资源的插件

4. postcss相关知识点
  - 配置文件查找优先级 [25:00-27:00]


配置文档，可参考:

01 [postcss-loader](https://webpack.docschina.org/loaders/postcss-loader/#postcss-options)

02 [OptimizeCssAssetsWebpackPlugin](https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/)

03 [TerserWebpackPlugin](https://webpack.docschina.org/plugins/terser-webpack-plugin/)


---------------------------------------
17 px2rem

Q1 如何配置 px2rem <br/>
A:  

1 配置px2rem-loader 

2 自动适配rem值: 动态计算根元素的font-size值

3 该方案已过时，稍微了解一下即可 [05:00-13:00]


---------------------------------------
18 Map多入口配置

Q1 如何配置 多入口页面 <br/>
A:         

S1 修改entry配置项  [00:30-09:00]

S2 生成对应入口的html文件 [09:00-14:00]


---------------------------------------
20 webpack-merge

Q1 如何配置 webpack-merge <br/>
A:          

S1 webpack-merge使用演示  [03:30-10:00]


---------------------------------------
22 webpack 同步加载打包文件

1. 前置知识
  - object.pty.toString 
  - symbol.toStringTag   [05:00-06:00]
  - Object.pty.defineProperty


2. webpack打包后的 main.js文件内容  [13:00-23:00__26:30-31:00]

S1 自执行函数，来调用 入口文件内容函数
  - 内部调用 require

S2 require
  - 根据传入的moduleId，查找全局modules对象里 对应的模块 + 执行 模块内容函数
  - 模块内容函数会把其执行结果，赋值给传入的 module.exports

S3 根据是否存入了缓存，来返回 cache[moduleId].exports/ module.exports

具体内容， 见[02_bundle/1.sync/main.js]分析流程


3. webpack打包时做了什么
  - 本质上，webpack在内部自己实现了一套 commonJS规范
  

---------------------------------------
23 模块的兼容性实现

1. webpack实现 ES6 Modules等不同模块规范的 兼容支持

S1 common.js加载common.js: 默认支持 

S2 支持 common.js加载ES6 Modules  
  - 如果导入的是ES6 Modules规范，就调用require.r函数 ==> 标识出它的类型是esModule  [01:30-10:30]

  - 调用require.d函数 ==> 把导出的属性，封装成key-value 挂载到 exports的同名key值属性上  [10:30-20:00]

具体内容，见[02_bundle/02.common-load-es/main.js]


S3 支持 ES6 Modules加载 ES6 Modules
  - require.d/ require.r属性简写的原因  [25:00-30:00]
  - 入口文件modules.index调用require.r==> 进行esModule标识 [33:00-35:00]
  - 转化import语句为 调用require   [35:00-39:40]

具体内容，见[02_bundle/03.es-load-es/main.js]


S4 支持 ES6 Modules加载 common.js  [39:45-52:00]
  - 入口调用 require.r()
  - 调用require ==> 获取到导入的 依赖对象
  - 调用require.n ==> 用以支持es6Module/common.js的默认导出语法

具体内容，见[02_bundle/04.es-load-common/main.js]


---------------------------------------
24 异步加载代码块

1. import('xx').then(cb)动态加载 实例  [00:00-16:30]

2. 实现流程

S1 调用 require.e(chunkId)  [16:30-18:30]
  - 创建promises，调用 require.f.j(chunkId,promises)
  - 通过 Promise.all(promises)来获取 所有的异步加载代码块的 返回结果

S2 require.f.j  [18:30-30:00]
  - 通过jsonp异步加载chunkId
  - 创建一个新的promise, 并存入到promises
  - 创建installedChunks对象，其key为chunkId, value为 promise的[reslove, reject]
  - 创建 jsonp的 url ==> 调用 require.p + require.u
  - 发送 url请求 ==> 调用 require.l(url)

S3.1 require.p
  - 指向资源访问路径，即配置文件里的 publicPath值

S3.2 require.u
  - 返回 代码块的文件名

S3.3 require.l
  - 通过JSONP请求这个url地址
  - hello.main.js会被执行: 赋值全局变量window["webpack5"] + 调用window["webpack5"]的 push方法


S4 window["webpack5"]全局变量  [30:00-45:00]
  - 在main.js执行时，全局变量 chunkLoadingGlobal = window["webpack5"]
  - 重写push方法: chunkLoadingGlobal.push = webpackJsonpCallback

S4.2 webpackJsonpCallback [45:00-1:00:01]
  - 把异步加载来的代码块，合并到 总的模块定义对象modules上
  - 通过传入的chunkId，在installedChunks对象找到对应的key,然后执行value里的resolve方法，从而让Promise的状态 改变为resolved

具体内容，见[02_bundle/05.lazy异步加载]


---------------------------------------
25 todo

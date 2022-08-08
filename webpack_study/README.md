Q1 如何实现一个打包器

A: </br>

S1 初始化一个 depRelation数组，用于收集依赖

S2 从入口文件开始，尝试构建 文件依赖关系

S3 收集文件依赖信息，并存入到 depRelation数组中 ==> collectCodeAndDeps
  - 读取 源文件内容code1
  - 遇到非JS文件类型的，就转化为 JS模块类型并通过 ESModule导出
  - 通过 babel.transform + @babel/preset-env，转化ESModule为 CommonJS规范,记做code2
  - 向 depRelation全局依赖数组里，push入当前文件内容 { key, deps, code2 }
  
S4 通过 @babel/parser + @babel/traverse，处理code1里所有 import语句
  - 把 子依赖文件a/b/c...，都加入到 当前文件的 deps字段中
  - 递归执行 collectCodeAndDeps，收集 子依赖文件的 依赖信息


S5 生成最终的打包文件 dist/bundle.js
  - 定义最终返回的 文件字符串内容 ==> code变量
  - 遍历并扩展depRelation数组，把每一项成员{ key, deps, code2 }中的code2,转化为函数 `function(require, module, exports){ ${code} }`
  - 定义一个缓存对象modules， 保存所有的模块文件，用来保证不会因为 循环引用爆栈
  - 执行入口文件 execute(depRelation[0].key)

S5.2 execute的逻辑: 执行文件内容 + 把导出的属性挂载到 module.exports对象上
  - 定义 结果对象: module = { exports: { __esModule: true, default: xx } }
  - 调用执行 item.code(require, module, module.exports)
  - 执行完item.code，往module.exports上添加属性后 + 返回了 module.exports对象

  - 定义了 require函数: 就是用于 执行文件内容 ==> execute(pathToKey)
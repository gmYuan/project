let { SyncHook } = require("tapable");
const path = require("path");
const fs = require("fs");
// AST相关
const types = require("babel-types");
const parser = require("@babel/parser"); //源代码转成AST抽象语法树
const traverse = require("@babel/traverse").default; //遍历语法树
const generator = require("@babel/generator").default; //把语法树重新生成代码

// 当前文件目录
let baseDir = path.dirname(path.resolve(__dirname));

class Compiler {
  constructor(options) {
    this.options = options;
    this.hooks = {
      run: new SyncHook(), //会在开始编译的时候触发
      done: new SyncHook(), //会在完成编译的时候触发
    };

    this.modules = new Set(); // 这里存放着所有的模块
    this.chunks = new Set(); // webpack5 this.chunks = new Set();
    this.assets = {}; // 输出列表 存放着将要产出的资源文件
    this.files = new Set(); // 表示本次编译的所有产出的文件名
  }

  //4.执行对象的run方法开始执行编译
  run(callback) {
    //当调用run方法的时候会触发run这个钩子, 进而执行它的回调函数
    this.hooks.run.call();

    //5.根据配置中的entry找出入口文件,得到entry的绝对路径
    //C:\xxx\xxx\src\index.js
    //打包后的文件，所有的路径都是\ => /
    let entry = {};
    if (typeof this.options.entry === "string") {
      entry.main = this.options.entry;
    } else {
      entry = this.options.entry;
    }
    for (let entryName in entry) {
      let entryFilePath = toUnixPath(
        path.join(this.options.context, entry[entryName])
      );
      //6. 从入口文件出发,调用所有配置的Loader对模块进行编译
      let entryModule = this.buildModule(entryName, entryFilePath);
      // console.log('modules-----', this.modules)

      //7.根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk
      let chunk = {
        name: "main",
        entryModule,
        modules: this.modules,
      };
      this.chunks.add(chunk);
    }

    //8.再把每个Chunk转换成一个单独的文件加入到输出列表
    //一个 chunk会成为this.assets对象的一个key value
    //一个chunk对应this.assets的一个属性，而每个assets属性会对应一个文件file
    this.chunks.forEach((chunk) => {
      //key: 文件名;  值: 是打包后的内容
      this.assets[chunk.name + "js"] = getSource(chunk);
    });

    //9.在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统
    this.files = Object.keys(this.assets); //['main.js']
    // 存放本次编译输出的目标文件路径
    let targetPath = path.join(
      this.options.output.path,
      this.options.output.filename
    );
    for (let file in this.assets) {
      fs.writeFileSync(targetPath, this.assets[file]);
    }

    // 完成钩子触发
    this.hooks.done.call();
  }

  buildModule = (name, modulePath) => {
    //6.1 读取原始源代码
    let originalSourceCode = fs.readFileSync(modulePath, "utf8");
    let targetSourceCode = originalSourceCode;

    //6.2 查找此模块对应的loader对代码进行转换
    let rules = this.options.module.rules;
    let loaders = [];
    for (let i = 0; i < rules.length; i++) {
      //正则匹配上了模块的路径
      if (rules[i].test.test(modulePath)) {
        loaders = [...loaders, ...rules[i].use];
      }
    }
    //loaders=['logger1-loader.js','logger2-loader.js','logger3-loader.js','logger4-loader.js']
    //6.3  从右到左执行loader
    for (let i = loaders.length - 1; i >= 0; i--) {
      let loader = loaders[i];
      targetSourceCode = require(loader)(targetSourceCode);
    }

    //todo 6.5.4  webpack最核心 的几个概念要出场了 module { 模块ID ，依赖的数组 }
    let moduleId = "./" + path.posix.relative(baseDir, modulePath); // -->  ./src/index.js
    // console.log('eeeee1111----', baseDir)
    // console.log('eeeee2222----', modulePath)
    // console.log('eeeee3333----', moduleId)
    let module = { id: moduleId, dependencies: [], name };

    // 现在我们已经得到转换后的代码 babel-loader es6=>es5
    //6.4 再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    let astTree = parser.parse(targetSourceCode, { sourceType: "module" });
    //6.5 遍历语法树，并找出require节点
    traverse(astTree, {
      CallExpression: ({ node }) => {
        if (node.callee.name === "require") {
          // 6.5.1 获取到 当前模块的绝对路径
          let moduleName = node.arguments[0].value; //--> ./title

          //要判断一个moduleName绝对还是相对，相对路径才需要下面的处理
          //6.5.2 以下代码目的：获取到模块A的所有依赖模块B/C/的 绝对路径  父目录+文件名+文件类型后缀

          let dirname = path.posix.dirname(modulePath); // --> /user/mini_webpack/04_flow/src
          let depModulePath = path.posix.join(dirname, moduleName); // --> /user/mini_webpack/04_flow/src/title
          let extensions = this.options.resolve.extensions;
          //结果是 /user/mini_webpack/04_flow/src/title.js
          depModulePath = tryExtensions(
            depModulePath,
            extensions,
            moduleName,
            dirname
          );

          // 6.5.3 修改module里的 moduleId值 + 生成 module.dependencies.

          // 每个打包后的模块都会有一个moduleId, 默认值为 ./src/[name].[etc]
          //  "./src/title.js"  depModulePath=/a/b/c  baseDir=/a/b   relative=>c ./c
          let depModuleId = "./" + path.posix.relative(baseDir, depModulePath); //-->  ./src/title.js
          // 6.6 修改抽象语法树,以更新打包生成的模块参数为  moduleId
          node.arguments = [types.stringLiteral(depModuleId)];
          module.dependencies.push(depModulePath);
        }
      },
    });

    //6.7 根据新的语法树生成新代码
    let { code } = generator(astTree);
    module._source = code; //转换后的代码 ==> module: { moduleId, dependencies,  _source }

    //6.8 再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理
    module.dependencies.forEach((dependency) => {
      let dependencyModule = this.buildModule(name, dependency);
      this.modules.add(dependencyModule);
    });
    return module;
  };
}

//path.posix.sep /  path.sep不同操作系统的路径分隔符 ==>  \/
function toUnixPath(filePath) {
  return filePath.replace(/\\/g, "/");
}

function tryExtensions(
  modulePath,
  extensions,
  originalModulePath,
  moduleContext
) {
  for (let i = 0; i < extensions.length; i++) {
    if (fs.existsSync(modulePath + extensions[i])) {
      return modulePath + extensions[i];
    }
  }
  throw new Error(
    `Module not found: Error: Can't resolve '${originalModulePath}' in '${moduleContext}'`
  );
}

//chunk = { name:'main', entryModule, modules:this.modules }
function getSource(chunk) {
  return `
  (() => {
   var modules = {
     ${[...chunk.modules]
       .map(
         (module) => `
         "${module.id}": (module,exports,require) => {
           ${module._source}
         }`
       )
       .join(",")}
   };
   var cache = {};
   function require(moduleId) {
     if (cache[moduleId]) {
       return cache[moduleId].exports;
     }
     var module = (cache[moduleId] = {
       exports: {},
     });
     modules[moduleId](module, module.exports, require);
     return module.exports;
   }
   (() => {
    ${chunk.entryModule._source}
   })();
 })();
  `;
}

module.exports = Compiler;

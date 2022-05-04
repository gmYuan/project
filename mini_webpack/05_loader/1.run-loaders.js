let path = require("path");
let fs = require("fs");
let { runLoaders } = require("loader-runner");
// let { runLoaders } = require("./loader-runner");

let filePath = path.resolve(__dirname, "src", "index.js");
let request = `inline-loader1!inline-loader2!${filePath}`;

//4.1 使得resource/inline-loaders的获取  不受特殊字符前缀配置的干扰
let parts = request.replace(/^-?!+/, "").split("!");

//1. 获取loader要作用的文件/资源 &&  最后一个元素就是要加载的资源了
let resource = parts.pop();
// 2. 通用方法，用于组装出loader的绝对路径
let resolveLoader = (loader) => path.resolve(__dirname, "loaders2", loader);

// 3.1 获取到 inlineLoaders
let inlineLoaders = parts.map(resolveLoader);

// 3.2 获取到 preLoaders / postLoaders / normalLoaders  ==>  begin
let rules = [
  {
    test: /\.js$/,
    use: ["normal-loader1", "normal-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "post", //post webpack保证一定是后执行的
    use: ["post-loader1", "post-loader2"],
  },
  {
    test: /\.js$/,
    enforce: "pre", //一定先执行pre类型的，如 eslint
    use: ["pre-loader1", "pre-loader2"],
  },
];
let preLoaders = [];
let postLoaders = [];
let normalLoaders = [];
for (let i = 0; i < rules.length; i++) {
  let rule = rules[i];
  if (rule.test.test(resource)) {
    if (rule.enforce == "pre") {
      preLoaders.push(...rule.use);
    } else if (rule.enforce == "post") {
      postLoaders.push(...rule.use);
    } else {
      normalLoaders.push(...rule.use);
    }
  }
}
preLoaders = preLoaders.map(resolveLoader);
postLoaders = postLoaders.map(resolveLoader);
normalLoaders = normalLoaders.map(resolveLoader);
// 3.2 获取到 preLoaders / postLoaders / normalLoaders  ==>  end

// 4.2 支持特殊字符前缀配置
let loaders = [];
if (request.startsWith("!!")) {
  //noPrePostAutoLoaders
  loaders = [, ...inlineLoaders];
} else if (request.startsWith("-!")) {
  //noPreAutoLoaders
  loaders = [...postLoaders, ...inlineLoaders];
} else if (request.startsWith("!")) {
  //不要普通 loader
  loaders = [...postLoaders, ...inlineLoaders, ...preLoaders];
} else {
  loaders = [...postLoaders, ...inlineLoaders, ...normalLoaders, ...preLoaders];
}
console.log(loaders);
debugger;
runLoaders(
  {
    resource,
    loaders,
    context: { name: "zhufeng" },
    readResource: fs.readFile.bind(fs),
  },
  function (err, result) {
    // console.log(err);
    // console.log(result.result, result.resourceBuffer.toString());
  }
);

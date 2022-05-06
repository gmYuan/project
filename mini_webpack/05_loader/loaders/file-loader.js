const path = require("path");
const { getOptions, interpolateName } = require("loader-utils");
/**
 * file-loader负责打包加载图片
 * 1. 获取到webpck内的 loader配置值 ==>  options / getOptions
 * 2. 获取到 loder配置里的 文件名称等 ==>  filename / interpolateName
 * 3 向输出目录(dist)里 写入文件：文件名 + 文件内容  ==>  this.emitFile
 * 4 支持不同 输出规范
 *
 * @param {*} source
 * @param {*} inputSourceMap
 * @param {*} data
 */

function loader(content) {
  console.log("这是我们自己的file-loader------");
  //this=loaderContext
  let options = getOptions(this) || {}; //获取我们在loader中配置的参数对象
  let filename = interpolateName(this, options.name, { content });

  //3 向输出目录里写入文件：文件名 + 文件内容
  this.emitFile(filename, content); //this.assets[filename]=content;

  // 4 支持不同 输出规范
  if (typeof options.esModule === "undefined" || options.esModule) {
    return `export default "${filename}"`; //es modules
  } else {
    return `module.exports="${filename}"`; //commonjs
  }
}
//如果不希望webpack把内容转成字符串的的话，设置raw=true, 这样 content就是一个二进制的Buffer
loader.raw = true;
module.exports = loader;

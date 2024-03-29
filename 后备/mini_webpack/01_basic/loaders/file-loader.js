/**
 * loader.raw=true   loader得到的是一个二进制的Buffer
 * loader.raw=false  loader得到的是一个utf8字符串
 *
 * @param {*} source 是文件内容
 * fs.readFile
 */
function loader(source) {
  // 1.首先 生成文件名
  const filename = "f0a12b17c9.png";
  // 2.向输出目录写入一个文件
  this.emitFile(filename);
  // 3.返回一个JS脚本
  return `module.exports = "${filename}"`;
}

loader.raw = true;
module.exports = loader;

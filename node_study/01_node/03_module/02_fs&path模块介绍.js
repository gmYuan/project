const fs = require("fs");
const path = require("path");

// 所有的方法基本上都是同步方法、异步方法
// 同步：如果刚刚运行程序可以去使用同步的方法
// 异步：开启一个服务监听客户端访问，就需要使用异步了  异步是非阻塞的

// 操作文件时 尽量使用"绝对路径"来进行操作
// 获取当前的目录： process.cwd() 可变的  __dirname 不可变的
// __dirname 代表的是当前文件所在的文件夹，__dirname并不属于global，每个模块独有的

// resolve不能遇到/, 否则会返回根目录
console.log(path.resolve(__dirname, "./name.txt", "./"));
console.log(path.join(__dirname, "./name.txt", "./")); // 拼接
console.log("扩展名是---", path.extname("a/b/a.min.js")); // 获取当前路径的扩展名

// 1.同步判断文件是否存在
const exists = fs.existsSync(path.resolve(__dirname, "..", "name.txt"));
console.log("exists是---", exists);

// 2.同步的读取文件
if (exists) {
  const r = fs.readFileSync(path.resolve(__dirname, "..", "name.txt"), "utf8");
  console.log("r是---", r);
}

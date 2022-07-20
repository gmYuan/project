// 实现自定义的模板引擎

/**
// 第三方模块
const ejs = require('ejs'); 
ejs.renderFile(
    path.resolve(__dirname,'template.html'),
    {name:'zf',age:11,arr:[1,2,3]},
    (err,data)=>{
        console.log(data);
    }
)
*/

/*
自定义模板引擎的实现流程：
S1 读取模板文件内容html, 其类型为字符串
S2 利用正则，替换掉占位字符
S3 设置res字符串，拼接html中需要返回的内容
S4 把res作为函数体，传入到new Function() 中
S5 对于 res内的变量作用域查找，利用 with进行显式指向
S6 对于模板变量，利用正则转化为 ES6字符串变量即可

*/

const fs = require("fs");
const path = require("path");

const renderFile = (filePath, obj, cb) => {
  // S1 读取文件内容
  fs.readFile(filePath, "utf8", function (err, html) {
    if (err) {
      return cb(err, html);
    }

    // S6 替换模板变量符  {{name}} => ${name}
    html = html.replace(/\{\{([^}]+)\}\}/g, function () {
      let key = arguments[1].trim();
      return "${" + key + "}"; // {{name}} => ${name}
    });

    // S3 设置res字符串，拼接html中需要返回的内容 + S5 利用 with进行显式指向
    let head = `let str = '';\r\n with(obj){\r\n`;
    head += "str+=`";

    //S2 利用正则，替换掉占位字符
    html = html.replace(/\{\%([^%]+)\%\}/g, function () {
      return "`\r\n" + arguments[1] + "\r\nstr+=`\r\n";
    });

    let tail = "`}\r\n return str;";

    // S3 拼接完成
    // console.log("11111----", head + html + tail);

    // S4 把res作为函数体，传入到new Function() 中
    let fn = new Function("obj", head + html + tail);
    // console.log(fn.toString());

    // 返回结果
    cb(err, fn(obj));
  });
};

// 使用
renderFile(
  path.resolve(__dirname, "my-template.html"),
  { name: "zf", age: 11, arr: [1, 2, 3] },
  function (err, data) {
    console.log("cb的data是--", data);
  }
);

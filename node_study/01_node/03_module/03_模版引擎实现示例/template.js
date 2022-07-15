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

const fs = require("fs");
const path = require("path");

const renderFile = (filePath, obj, cb) => {
  // S1 读取文件内容
  fs.readFile(filePath, "utf8", function (err, html) {
    if (err) {
      return cb(err, html);
    }
    //S2 利用正则获取到 模板中占位的变量
    html = html.replace(/\{\{([^}]+)\}\}/g, function () {
      // RegExp.$1
      let key = arguments[1].trim();
      return obj[key];
    });

    // 触发回调
    cb(err, html);
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

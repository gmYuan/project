// 例1 babel-loader
/** 
const sum = (a, b) => a + b;
debugger;
console.log("sum", sum(1, 2));
*/

//例2 file-loader
// const logo = require("./images/kf.jpg").default;
// console.log("logo", logo);
// let img = new Image();
// img.src = logo;
// document.body.appendChild(img);

// 例3 less-loader 和 style-loader
require("./index.less");

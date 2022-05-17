let loaderUtils = require("loader-utils");

/**
 * pitch function
 * S1 先获取到style样式，然后创建一个style标签，并插入到页面中
 * S2 什么时候会用到pitch loader ==>
 *      当你想把左侧的loader级联使用的时候
 *
 */

function normal() {}

// 方法2: 以normal方式实现，此时inputSource接收的是已被处理好的 CSS字符串
function normal3(inputSource) {
  return `
            let style = document.createElement('style');
            style.innerHTML = ${JSON.stringify(inputSource)};
            document.head.appendChild(style);
      `;
}

// 方法1: 以pitch方式实现，此时inputSource接收的是行内loader
normal.pitch = function (remainingRequest, previousRequest, data) {
  // require参数为 剩下的loader!要加载的路径
  // 即  !!./loaders/css-loader.js!./src/index.css
  // !!表示 只执行  行内样式
  let style = `
     let style = document.createElement('style');
     style.innerHTML = require(${loaderUtils.stringifyRequest(
       this,
       "!!" + remainingRequest
     )}).toString();
     document.head.appendChild(style);
    `;
  return style;
};

module.exports = normal;

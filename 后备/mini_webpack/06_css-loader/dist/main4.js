/***
 * S1 定义 require函数 +  定义modules里module
 *   - module = { id, exports } + modules: { moduleId1: Fn1,  mpduleId2: Fn2  }
 *
 * S2 自执行入口函数index.js里的 require函数
 *   - index.css ==> css-loader.js!./src/index.css
 *   - 返回值是一个 二维数组 [ [1, 'xxx'], [2, 'yyy'] ]
 *
 * S3 定义返回值为 二维数组 + 重写其toSting方法 + 新增其i方法 ==> api(cssWithMappingToString)
 *
 * S4 基本同上，在index中引入global（即支持@import的CSS语法）
 *
 */

(function () {
  var modules = {
    // S2 index.css ==> css-loader.js!./src/index.css
    // 感叹号分隔符，它是什么意思？它的意思是此./src/index.css经过css-loader.js处理后的结果
    "./src/index.css": (module, exports, require) => {
      var result = require("css-loader.js!./src/index.css");
      module.exports = result.toString();
      //module.exports = "body{\r\n background-color: green;\r\n}";
    },

    // S3
    "css-loader.js!./src/index.css": (module, exports, require) => {
      var api = require("api.js");
      let cssWithMappingToString = (item) => item[1];
      // S3 定义返回值为 二维数组 + 重写其toSting方法 + 新增其i方法
      let EXPORT = api(cssWithMappingToString);
      // S4 基本同上，在index中引入global（即支持@import的CSS语法）
      let GLOBAL = require("css-loader.js!./src/global.css");

      EXPORT.i(GLOBAL);
      EXPORT.push([module.id, "body{\r\ncolor: red;\r\n}"]);
      module.exports = EXPORT;
    },
    // S4
    "css-loader.js!./src/global.css": (module, exports, require) => {
      var api = require("api.js");
      let cssWithMappingToString = (item) => item[1];
      let EXPORT = api(cssWithMappingToString);
      EXPORT.push([module.id, "body{\r\n background-color: green;\r\n}"]);
      module.exports = EXPORT;
    },

    "api.js": (module, exports, require) => {
      module.exports = function (cssWithMappingToString) {
        var list = []; //为什么搞了个数组，是为了方便处理@import
        list.toString = function () {
          return this.map(cssWithMappingToString).join("");
        };
        list.i = function (otherList) {
          list.unshift(...otherList);
        };
        return list;
      };
    },
  };

  // S1 定义 require函数 + 定义modules里module
  var cache = {};
  function require(moduleId) {
    if (cache[moduleId]) {
      return cache[moduleId].exports;
    }
    var module = (cache[moduleId] = {
      id: moduleId,
      exports: {},
    });
    modules[moduleId](module, module.exports, require);
    return module.exports;
  }
  const css = require("./src/index.css");
  console.log(css);
})();

// module.exports = "body{\r\n background-color: green;\r\n}";

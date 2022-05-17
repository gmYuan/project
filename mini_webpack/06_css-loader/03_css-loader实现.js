let loaderUtils = require("loader-utils");
let postcss = require("postcss");
let Tokenizer = require("css-selector-tokenizer");

/**
 * S1 通过postcss生成pipline，其中postcss会把 css语法树的root节点 传给plugin回调函数
 *
 * S2 通过plugin处理 CSS语法树
 *   S2.1 删除所有的@import  + 把它想要导入的 CSS文件路径 添加到options.imports里
 *   S5.1 遍历语法树，找到里面所有的url
 *
 *
 * S3 处理完CSS语法内容后，返回css文件结果
 *   S3.1 返回入口css样式内容
 *   S3.2/S4 填入@import 文件的css语句内容 ==> 
 *         list.push(...require('./global.css')) ==> webpack分析这个依赖，并且打包./global.css
 *         ==> 会再次走css-loader ==> webpack会去处理'./src/global.css'这个依赖
  
 *   即 递归执行CSS-loader   
 *
 * S4 webpack载入require资源，递归执行CSS-loader  
 * 
 * S5 支持url() 语法 ==> 
 *   S5.1 遍历语法树，找到里面所有的url
 *   S5.2 把bg的 url值，替换为 require导入语句，从而转化为md模块对象
 *
 */

function loader(inputSource) {
  let loaderOptions = loaderUtils.getOptions(this) || {};
  let callback = this.async();
  //  S2 通过plugin处理 CSS语法树
  const cssPlugin = (options) => {
    return (root) => {
      // S2.1 删除所有的@import  + 把它想要导入的 CSS文件路径 添加到options.imports里
      if (loaderOptions.import) {
        root.walkAtRules(/^import$/i, (rule) => {
          rule.remove(); //在CSS脚本里把这@import删除
          options.imports.push(rule.params.slice(1, -1)); //./global.css
        });
      }

      // S5 支持url() 语法
      if (loaderOptions.url) {
        //S5.1 遍历语法树，找到里面所有的url
        //因为这个正则只能匹配属性
        root.walkDecls(/^background-image/, (decl) => {
          // 可以把css 规则值转化为 key-value对象
          let values = Tokenizer.parseValues(decl.value);
          values.nodes.forEach((node) => {
            node.nodes.forEach((item) => {
              if (item.type === "url") {
                //stringifyRequest可以把任意路径标准化为相对路径
                let url = loaderUtils.stringifyRequest(this, item.url);
                // S5.2 把bg的 url值，替换为 require导入语句，从而转化为md模块对象
                item.stringType = "'";
                item.url = "`+require(" + url + ")+`";
                //require会给webpack看和分析，webpack一看你引入了一张图片
                //webpack会使用file-loader去加载图片
              }
            });
          });
          let value = Tokenizer.stringifyValues(values);
          decl.value = value;
        });
      }
    };
  };

  //将会用它来收集所有的@import
  let options = { imports: [] };
  // S1 通过postcss生成pipline，其中postcss会把 css语法树的root节点 传给plugin
  let pipeline = postcss([cssPlugin(options)]);

  // S1
  pipeline.process(inputSource).then((result) => {
    // S3 处理完CSS语法内容后，返回css文件结果

    let { importLoaders = 0 } = loaderOptions; //几个前置loader
    let { loaders, loaderIndex } = this; //所有的loader数组和当前loader的索引
    let loadersRequest = loaders
      .slice(loaderIndex, loaderIndex + 1 + importLoaders)
      .map((x) => x.request)
      .join("!");
    //request是loader绝对路径
    // -!css-loader.js的绝对路径!less-loader.js的绝对路径!./global.css
    console.log("loadersRequest---------", loadersRequest);

    // S4 webpack载入require资源，递归执行CSS-loader
    //-!	不要前置和普通 loader
    // loader-utils中的stringifyRequest方法,可以将绝对路径转化为相对路径，即
    // c://loader.js=>./src/loader.js ""
    let importCss = options.imports
      .map(
        (url) =>
          `list.push(...require(` +
          loaderUtils.stringifyRequest(this, `-!${loadersRequest}!${url}`) +
          `));`
      )
      .join("\r\n");

    // S3.1 返回入口css样式内容
    let script = `
         var list = [];
         list.toString = function(){return this.join('')}
         ${importCss}
         list.push(\`${result.css}\`);
         module.exports = list;
      `;
    callback(null, script);
  });
}

module.exports = loader;

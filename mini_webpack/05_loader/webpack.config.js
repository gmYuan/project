const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

/**
 * 想使用自定义的loader，有三种方法
 * 1.alias
 * 2.modules
 * 3.绝对路径
 */

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  //配置如何查找loader
  /* resolveLoader:{
        alias:{
            'babel-loader':path.resolve('./loaders/babel-loader.js')
        },
        modules:[path.resolve('./loaders'),'node_modules']
    } ,
    */
  module: {
    rules: [
      // {
      //   test: /\.js$/,
      //   use: [path.resolve("./loaders/babel-loader.js")],
      //   include: path.resolve("src"),
      // },
      {
        test: /\.(jpg|png|gif)$/,
        use: [
          {
            loader: path.resolve("./loaders/url-loader.js"),
            // loader: path.resolve("./loaders/file-loader.js"),
            // loader: "file-loader",
            options: {
              name: "[hash:8].[ext]",
              limit: 40 * 1024,
              // fallback: path.resolve("./loaders/file-loader.js"),
            },
          },
        ],
        include: path.resolve("src"),
      },

      // {
      //     test:/\.less$/,
      //     use:[path.resolve('./loaders/style-loader.js')
      //     ,path.resolve('./loaders/less-loader.js')],
      //     include:path.resolve('src')
      // }
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};

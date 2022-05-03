const path = require("path");
const Run1Plugin = require("./plugins/run1-plugin");
const Run2Plugin = require("./plugins/run2-plugin");
const DonePlugin = require("./plugins/done-plugin");

module.exports = {
  mode: "development",

  ///user/xxx/mini_webpack
  // context: process.cwd(), //根目录 current working directory
  context: path.resolve(__dirname), //当前文件所在父目录

  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },

  entry: {
    page1: "./src/page1.js",
    page2: "./src/page2.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // path.resolve(__dirname, "loaders", "logger1-loader.js"),
          // path.resolve(__dirname, "loaders", "logger2-loader.js"),
        ],
      },
    ],
  },

  plugins: [new Run2Plugin(), new Run1Plugin(), new DonePlugin()],
};

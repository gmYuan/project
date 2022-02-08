const { resolve, join, basename } = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
// UglifyJsPlugin 已经废弃，不再使用

// console.log('process.env----', process.env.NODE_ENV);
// dotenv
require('dotenv').config({
   path: resolve(__dirname, '.env'),
});

console.log('999999-----', process.env.NODE_ENV);
// console.log('process.env.NODE_ENV', process.env);

module.exports = (env) => {
  console.log('webpackEnv---', env);
  return {
    mode: process.env.NODE_ENV === 'prod' ? 'production' : 'development',
    devtool: 'eval-cheap-module-source-map',
    entry: './src/index.js',
    optimization: {
      minimize: process.env.NODE_ENV === 'production', // 如果是生产环境才开启压缩
      minimizer: (env && env.production) ? [
        new TerserPlugin(), // 如果是生产环境才会配置js压缩器
      ] : [], // 否则不配置任何压缩器
    },

    output: {
      path: resolve(__dirname, 'dist'),
      // 入口代码块的名称，如main    输出的文件名
      filename: '[name].[hash:5].js',
      // 非入口代码块的名称配置项
      // 非入口代码块有两个来源1.代码分割 vendor common
      // 懒加载  import方法加载模块
      chunkFilename: '[name].[hash:3].js',
      publicPath: '/',
    },

    watch: false,
    watchOptions: { // 监听选项
      ignored: /node_modules/, // 不监听哪些文件夹
      aggregateTimeout: 300, // 监听到文件发生变化后延迟300毫秒才去重新编译
      poll: 1000, // 1秒问1000次，数字越大，越敏感，数字越小，越延迟
    },

    devServer: {
      port: 6061,
      open: true,
      devMiddleware: {
        writeToDisk: true,
      },
      static: {
        // directory: join(__dirname, 'static'),
        // publicPath: '/static',
      },
      // 请求代理
      // create-react-app支持你把代理写在package.json
      // proxy: {
      //   '/api': { // http://localhost:8080 /users
      //     target: 'http://localhost:3000',
      //     pathRewrite: {
      //       "^/api": "",
      //     },
      //   },
      // },

      // 不是启动一个新服务器，而是给原来老的8080服务器添加了一个路由
      // before(app) {
      //   // webpack-dev-sever就是一个express服务器 express();
      //   app.get('/api/users', (req, res) => { // 可以在这里定义路由
      //     res.json([{ id: 1, name: 'zhufeng' }]);
      //   });
      // },
    },

    // externals: {
    //   lodash: '_',
    // },

    module: {
      rules: [
        /**  可被HtmlWebpackExternalsPlugin替换 * */
        // {
        //   test: require.resolve("lodash"),
        //   loader: "expose-loader",
        //   options: {
        //       exposes: {
        //         globalName: "_",
        //         override: true,
        //       },
        //   },
        // },
        { test: /\.txt$/, use: 'raw-loader' },
        // 用MiniCssExtractPlugin.loader替换掉style-loader
        // 把所有的css样式先收集起来
        // { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] },
        { test: /\.less$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'] },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          type: 'asset',
          generator: { filename: 'assets/[hash:10][ext]' },
          parser: {
            dataUrlCondition: { maxSize: 0 * 1024 },
          },
        },
        { test: /\.html$/, loader: "html-loader" },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  // useBuiltIns: 'entry',
                  // corejs: { version: 3 },
                  // targets: ">0.25%",
                  // useBuiltIns: 'usage',
                },
                ],
                ["@babel/preset-react"],
              ],
              plugins: [
                [
                  "@babel/plugin-transform-runtime",
                  {
                    corejs: 3,
                  },
                ],
                // ["@babel/plugin-proposal-decorators", { legacy: true }],
                // ["@babel/plugin-proposal-class-properties", { loose: true }],
              ],
            },
          },
        },

      ],
    },

    plugins: [
      // webpack在打包之会把所有的产出的资源放在一个assets对象上
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html',
        // chunks: ['main'],
      }),

      // 把收集到的所有的CSS样式都写入到main.css,然后把此资源插入到HTML
      new MiniCssExtractPlugin({
        // 只要CSS内容不变，contenthash就不会变
        filename: 'assets/[name].[contenthash:2].css',
      }),

      // new ESLintPlugin({
      //   extensions: ['js', 'jsx'],
      //   // fix: true,
      // }),

      // new HtmlWebpackExternalsPlugin({
      //   externals: [
      //     {
      //       module: 'lodash',
      //       entry: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js',
      //       global: '_',
      //     },
      //   ],
      // }),

      // 区分环境
      new webpack.DefinePlugin({
        'process.env': {
          APP_ENV: JSON.stringify(process.env.NODE_ENV),
        },
      }),

      // 调试sourceMap
      // new webpack.SourceMapDevToolPlugin({
      //   filename: '[file].map',
      //    append: "\n//# sourceMappingURL=http://localhost:6061/[url]",
      // }),
      // new FileManagerPlugin({
      //   events: {
      //     onEnd: {
      //       copy: [
      //         {
      //           source: './dist/**/*.map',
      // eslint-disable-next-line max-len
      //           destination: '/Users/gongba/Documents/write/myproj/project/mini_webpack/01_basic/sourcemap',
      //         },
      //       ],
      //       delete: ['./dist/*.map'],
      //     },
      //   },
      // }),

      // 复制文件内容
      new CopyWebpackPlugin({
        patterns: [
          {
            from: resolve(__dirname, 'src/documents'),
            to: resolve(__dirname, 'dist/documents'),
          },
        ],
      }),

      // 清空之前的打包内容
      new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["**/*"],
      }),

      (env && env.production) && new OptimizeCssAssetsWebpackPlugin(),

    ].filter(Boolean),
  };
};

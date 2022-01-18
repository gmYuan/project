const { resolve, join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

console.log('process.env----', process.env.NODE_ENV);

module.exports = (webpackEnv) => {
  console.log('webpackEnv---', webpackEnv);
  return {
  mode: process.env.NODE_ENV === 'prod' ? 'production' : 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[hash:10].js', // 输出的文件名
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

  externals: {
    lodash: '_',
  },

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
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/,
          type: 'asset',
          generator: { filename: 'assets/[hash:10][ext]' },
          parser: {
            dataUrlCondition: { maxSize: 4 * 1024 },
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
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      // fix: true,
    }),

    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'lodash',
          entry: 'https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js',
          global: '_',
        },
      ],
    }),

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

  ],
};
};

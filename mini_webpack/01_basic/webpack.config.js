const { resolve, join } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');

console.log('process.env----', process.env.NODE_ENV);

module.exports = (webpackEnv) => {
  console.log('webpackEnv---', webpackEnv);
  return {
  mode: process.env.NODE_ENV === 'prod' ? 'production' : 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js',
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

    // 增加调试sourceMap
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
       append: "\n//# sourceMappingURL=http://localhost:6061/[url]",
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            {
              source: './dist/**/*.map',
              destination: '/Users/gongba/Documents/write/myproj/project/mini_webpack/01_basic/sourcemap',
            },
          ],
          delete: ['./dist/*.map'],
        },
      },
    }),

  ],
};
};

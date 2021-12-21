const { resolve, join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = (env) => ({
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js',
    publicPath: '/',
  },
  devServer: {
    port: 8080, 
    open: true, 
    devMiddleware: {
      writeToDisk: true,
    },
    static: {
      directory: join(__dirname, 'assets'),
    },
  },

  module: {
    rules: [
        // { test: /\.txt$/,  use: resolve(__dirname, './loaders/raw-loader.js') },
        { test: /\.txt$/,  use: 'raw-loader' },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin(
      { template: './src/index.html' }
    )
  ],

})
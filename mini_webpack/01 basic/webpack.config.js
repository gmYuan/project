const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = (env) => ({
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js',
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
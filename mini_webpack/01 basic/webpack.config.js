const { resolve } = require('path')

module.exports = (env) => ({
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js',
  },
  module: {
    rules: [
        { test: /\.txt$/,  use: resolve(__dirname, './loaders/raw-loader.js') },
        // { test: /\.txt$/,  use: 'raw-loader' },
        
    ]
  },

})
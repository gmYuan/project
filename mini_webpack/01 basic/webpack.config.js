const { resolve } = require('path')

module.exports = (env) => ({
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'my_test.js',
  },
})
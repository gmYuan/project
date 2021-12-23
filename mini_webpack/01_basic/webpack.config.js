const { resolve, join } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = (env) => ({
  mode: 'development',
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

  module: {
    rules: [
        // { test: /\.txt$/,  use: resolve(__dirname, './loaders/raw-loader.js') },
        { test: /\.txt$/,  use: 'raw-loader' },
        { test: /\.css$/, use: ['style-loader', 'css-loader'] },
        { test: /\.less$/, use: [ 'style-loader', 'css-loader', 'less-loader' ] },
        { test: /\.(png|svg|jpg|jpeg|gif)$/, 
          type: 'asset',  
          generator: { filename: 'assets/[hash:10][ext]'},
          parser: {
            dataUrlCondition: { maxSize: 4 * 1024 }
          }
        },
        { test: /\.html$/, loader: "html-loader" },
        {
          test: /\.jsx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            }
          }
        },

    ]
  },

  plugins: [
    new HtmlWebpackPlugin(
      { template: './src/index.html' }
    )
  ],

})
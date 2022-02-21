const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode:'development',
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.join(__dirname, 'dist')
    },
    devServer: {
        contentBase:path.join(__dirname, 'dist')
    },
    module:{
        rules:[
            {
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options:{"plugins": []}
                },
                include: path.join(__dirname,'src'),
                exclude:/node_modules/
            }
        ]
    }
    plugins:[
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html'
        })
    ]
}
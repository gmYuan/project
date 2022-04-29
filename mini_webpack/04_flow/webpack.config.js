const path = require('path');
const Run1Plugin = require('./plugins/run1-plugin')
const Run2Plugin = require('./plugins/run2-plugin')
const DonePlugin = require('./plugins/done-plugin')

module.exports = {
    mode:'development',
    entry: './src/index.js',
    output:{
        path: path.resolve(__dirname,'dist'),
        filename:' [name].js'
    },
    module:{
        rules: []
    },

    plugins:[
        new Run2Plugin(),
        new Run1Plugin(),
        new DonePlugin(),  
    ]
}
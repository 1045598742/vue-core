const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry:'./src/index.js',//以index作为入口进行打包
    output:{
        filename:'bundle.js',
        path:path.resolve(__dirname,'dist')
    },
    resolve:{
        //更改解析模块的查找方式
        modules: [path.resolve(__dirname,'source'),path.resolve('node_modules')]
    },
    devtool:'source-map',//生成source-map
    plugins:[
        new htmlWebpackPlugin({
            template:path.resolve(__dirname,'public/index.html')
        })
    ]
}
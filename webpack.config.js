var path=require('path');
var webpack=require('webpack');
var htmlWebpackPlugin=require('html-webpack-plugin');
var VueLoaderPlugin=require('vue-loader/lib/plugin');

module.exports={
    entry:path.join(__dirname,'./src/main.js'),
    output:{
        path:path.join(__dirname,'./dist'),
        filename:'bundle.js'
    },
    devServer: {
        host:'127.0.0.1',
        inline: true,//实时刷新
        open:true,
        proxy:{
            '/bus':{
                target:'http://127.0.0.1:3001/',
                pathRewrite: {'^/bus' : '/bus'},
                changeOrigin:true,
                secure:true
            }
        }
      },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new htmlWebpackPlugin({
            template:path.join(__dirname,'./index.html'),
            filename:'index.html'
        }),
        new VueLoaderPlugin()
        
    ],
    module:{
        rules:[
            //这是处理css文件的配置
            {test:/\.css$/,use:['style-loader','css-loader']},
            //这是处理字体文件的配置
            {test:/\.(ttf|eot|svg|woff|woff2)$/,use:'url-loader'},
            //这是处理图片url的配置
            {test:/\.(jpg|png|webp|bmp|icon|gif|jpeg)$/,use:'url-loader?limit=6000&name=[hash:8]-[name].[ext]'},
            //这是babel的配置
            { test:/\.js$/,use:'babel-loader',exclude:/node_modules/},
            //这是加载vue组件的配置
            { test:/\.vue$/,use:'vue-loader'}
        ],
        
    },
    resolve:{
        alias:{
            "vue$":"vue/dist/vue.js"
        }
    }  
      

}
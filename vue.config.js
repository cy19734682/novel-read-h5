const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
module.exports = {
  productionSourceMap:process.env.NODE_ENV !== 'development',
  devServer: {
    inline: true,//实时刷新
    open:true,
    proxy:{
      '/bus':{
        target:'http://139.186.77.25:8081/',
        pathRewrite: {'^/bus' : '/bus'},
        changeOrigin:true,
        secure:true
      }
    }
  },
  chainWebpack: config => {
    // ============路由懒加载不生效问题 start============
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    // ============路由懒加载不生效问题 end============
  },
  configureWebpack:config => {
    // 生产环境相关配置
    if (process.env.NODE_ENV !== 'development') {
      // 代码压缩
      config.plugins.push(
        new UglifyJsPlugin({
          uglifyOptions: {
            //生产环境自动删除console
            compress: {
              drop_debugger: true,
              drop_console: true,
              pure_funcs: ['console.log']
            }
          },
          sourceMap: false,
          parallel: true
        })
      )
    }
  }
}
 
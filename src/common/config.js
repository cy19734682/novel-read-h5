var Vue = require("vue")
var Router  = require("../router.js")
var Store  = require("../store.js")
var configDerivation = {
  global:{}
}
initConfig();
module.exports = {
  //协议名称，必选
  protocal :'http',
  withCredentials :true,
  timeout:configDerivation.timeout || 30000,//接口超时时间
  //请求过滤
  requestFilter:{
    requestBefore:function(){//接口请求前拦截
    },
    requestAfter:function(data){//接口请求后拦截
      if(data.data.code === -999){
        sessionStorage.removeItem("userInfo")
       Vue.default.prototype.$dialog.confirm({
         title: '系统提示',
         message: '登录超时,是否重新登录?',
         confirmButtonText:"登录",
       }).then(()=>{
         Router.default.push({ name: "login"})//跳转登录页面
       })
       .catch(() => {
         Store.default.commit('updateReload');//刷新页面
       });
        return false;
      }else{
        return true;
      }
    },
  },
  global: {
    "pageFilters": configDerivation.global.pageFilters || [],//页面过滤（设置不可访问页面）
    "server": configDerivation.global.server || "http://139.186.77.25:3001",
    "serverImg": configDerivation.global.serverImg || "http://139.186.77.25:3001/uploadFile/images/",
  },
}

/**
 * 初始化配置
 */
function initConfig(){
  if(typeof (window.externalConfig) == 'object'){
    configDerivation = window.externalConfig;
    if(typeof (configDerivation.global) != 'object'){
      configDerivation['global'] = {};
    }
  }
}

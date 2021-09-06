//导入vue
import Vue from 'vue'
import App from './App.vue'
//导入vant
import Vant from 'vant';
import 'vant/lib/index.css';
import './assets/css/common.css';
//导入路由
import router from './router.js'
// 创建vuex
import store from './store.js'
//导入全局函数
import  './common/common';
import config from './common/config'
import netWork from './common/netWork'
netWork.getConfig(config)


Vue.prototype.serverImg = config.global.serverImg;
window.serverImg = config.global.serverImg;
Vue.prototype.server = config.global.server;
window.server = config.global.server;

Vue.use(Vant);

new Vue({
    el:'#app',
    store,
    render:c => c(App),
    router
})

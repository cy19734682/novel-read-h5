//导入vue
import Vue from 'vue'

//导入vue-router
import VueRouter from 'vue-router'

//导入自定义的vue组件
import Index from './pages/index/index.vue'
import Recommended from './pages/recommend/index.vue'
import Search from './pages/search/index.vue'
import Ranking from './pages/ranking/index.vue'
import ReadIndex from './pages/read/index.vue'
import ReadDirectory from './pages/read/directory.vue'
import Read from './pages/read/read.vue'
import Login from './pages/user/login.vue'
import Register from './pages/user/register.vue'

//手动安装vue-router
Vue.use(VueRouter)

//创建vue-router对象
var router=new VueRouter({
    routes:[
        { path:'/',component:Index },
        { path:'/login',name:'login',component:Login },
        { path:'/register',name:'register',component:Register },
        { path:'/recommend',name:"recommend",component:Recommended },
        { path:'/search',name:"search",component:Search },
        { path:'/ranking',name:"ranking",component:Ranking },
        { path:'/book/:id',name:'book',component:ReadIndex },
        { path:'/chapter/list/:id',name:'chapterList',component:ReadDirectory },
        { path:'/chapter/:id',name:'chapter',component:Read }
    ]
})

export default router
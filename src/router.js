//导入vue
import Vue from 'vue'

//导入vue-router
import VueRouter from 'vue-router'

//导入自定义的vue组件
const Index = ()=>import("./pages/index/index.vue")
const Recommended = ()=>import("./pages/recommend/index.vue")
const Search = ()=>import("./pages/search/index.vue")
const Ranking = ()=>import("./pages/ranking/index.vue")
const ReadIndex = ()=>import("./pages/read/index.vue")
const ReadDirectory = ()=>import("./pages/read/directory.vue")
const Read = ()=>import("./pages/read/read.vue")
const Login = ()=>import("./pages/user/login.vue")
const Register = ()=>import("./pages/user/register.vue")

//手动安装vue-router
Vue.use(VueRouter)

//创建vue-router对象
var router=new VueRouter({
    routes:[
        { path:'/',component:Index },
        { path:'/index',component:Index },
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

router.beforeEach((to, from, next) => {
    to = to || {};
    from = from || {};
    //把当前页和上一页的页面数据缓存下来
    let curPage = {meta:to.meta,path:to.path,name:to.name,params:to.params,query:to.query};
    let prePage = {meta:from.meta,path:from.path,name:from.name,params:from.params,query:from.query};
    sessionStorage.setItem("_curPage",JSON.stringify(curPage));
    sessionStorage.setItem("_prePage",JSON.stringify(prePage));
    //把第一次进入项目的页面保存下来，用于页面后退的时候判断是否是最后一页并且不是首页
    if(!sessionStorage.getItem('firstPage')){
        sessionStorage.setItem("firstPage",to.path);
    }
    next()
})

export default router
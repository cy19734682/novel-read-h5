## 项目信息
__注：此项目纯属个人瞎搞，不用于任何商业用途。__

### 项目简介
该项目是小说网站H5端，该项目使用vue为基础框架，vant为前端组件库来开发，网站具备了小说阅读基本功能，包括首页推荐，小说分类，小说列表和详情，
加入书架，分享功能，阅读设置等

### 技术栈
vue + vuex + vue-router + axios + vant

### 项目特色
- 使用vant为前端组件搭建框架，简化开发流程
- 封装http请求和接口调用，降低代码耦合度
- 小说分享，可以生成二维码或者分享到微信

### 项目完成情况
- [x] 首页 -- 完成
- [x] 登录/注册 -- 完成
- [x] 小说推荐 -- 完成
- [x] 小说分类 -- 完成
- [x] 小说排行榜 -- 完成
- [x] 小说搜索 -- 完成
- [x] 小说详情 -- 完成
- [x] 我的书架 -- 完成
- [x] 阅读设置 -- 完成
- [ ] 微信登录 -- 未完成


### 项目结构
``` lua
├── babel.config.js             babel语法转化配置
├── package.json                依赖包文件
├── public
|  ├── favicon.ico
|  ├── index.html               静态打包首页
|  └── js
|     └── externalConfig.js     外部配置文件
├── src
|  ├── App.vue                  Vue首页
|  ├── assets                 
|  |  ├── css                   样式文件
|  |  └── img                   资源文件
|  ├── common
|  |  ├── common.js             公共方法文件
|  |  ├── config.js             公共配置文件
|  |  ├── http.js               http请求配置文件
|  |  └── netWork.js            http拦截配置文件
|  ├── components
|  |  ├── comment.vue           评论组件
|  |  ├── commentItem.vue       评论详情组件
|  |  ├── header.vue            公共头部组件
|  |  └── nativeShare.vue       分享组件
|  ├── main.js                  入口配置文件
|  ├── pages
|  |  ├── index                 首页
|  |  ├── ranking               排行榜页面
|  |  ├── read                  阅读页面
|  |  ├── recommend             推荐页面
|  |  ├── search                搜索页面
|  |  └── user                  用户登录/注册
|  ├── router.js                路由设置
|  ├── service
|  |  ├── baseService.js        公共接口调用
|  |  └── commService.js        接口方法配置
|  └── store.js                 Vuex相关配置
└── vue.config.js               Vue相关配置
```


## 项目启动
安装`nodejs`

#### 本地环境启动
1. npm install 或 yarn(推荐)
2. npm run serve
3. 访问 http://localhost:8081

✨温馨提示✨
npm install 有些依赖包需从github拉取，网络不好会有失败的情况，可以切换好点的网络或者切换淘宝镜像使用cnpm引入；
也可以使用新的依赖安装方式如yarn或pnpm等



## 项目打包上线

1. npm run build
2. 生成dist文件放到线上环境对应目录
3. nginx配置文件中配置对应路径
``` lua
location / {
 root   /srv/novel/novel-read/;
 try_files $uri   /index.html;
 } 
```
4.启动nginx：`systemctl start nginx`

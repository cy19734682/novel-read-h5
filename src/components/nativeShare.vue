<template>
  <div id="nativeShare_global" v-show="is_show_share">
    <div class="blockbg zindex2000" @click="closeShare()"></div>
    <div class="sharebox zindex2001" v-show="!is_show_ewm">
      <div class="sharebtn">
        <a
            href="javascript:;" data-app="weixin" class="nativeShare wxjssdk" @click="shareBindEvent(0)"
            v-if="isWeixin || isqqBrowser || isucBrowser"
        >
          <span class="sp1"><img src="../assets/img/icon/weixin.png" alt=""/></span>
          <p>微信</p>
        </a>
        <a
            href="javascript:;" data-app="weixinFriend" class="nativeShare wxjssdk" @click="shareBindEvent(1)"
            v-if="isWeixin || isqqBrowser || isucBrowser"
        >
          <span class="sp2"><img src="../assets/img/icon/weixin_friend.png" alt=""></span>
          <p>朋友圈</p>
        </a>
        <a
            href="javascript:;" data-app="sinaWeibo" class="nativeShare webweibo" v-if="!isqqApp && !isWeixin"
            @click="shareBindEvent(2)"
        >
          <span class="sp3"><img src="../assets/img/icon/weibo.png" alt=""/></span>
          <p>微博</p>
        </a>
        <a href="javascript:;" data-app="QZone" class="nativeShare webqzone" @click="shareBindEvent(3)">
          <span class="sp4"><img src="../assets/img/icon/qqzone.png" alt=""/></span>
          <p>QQ空间</p>
        </a>
        <a
            href="javascript:;" data-app="QQ" class="nativeShare qq" v-if="!isWeixin && isqqBrowser"
            @click="shareBindEvent(4)"
        >
          <span class="sp5"><img src="../assets/img/icon/qq.png" alt=""/></span>
          <p>QQ好友</p>
        </a>
        <a
            href="javascript:;" data-app="ewm" class="nativeShare ewm" @click="shareBindEvent(5)"
            v-if="!isWeixin && !isqqBrowser && !isucBrowser"
        >
          <span class="sp5"><img src="../assets/img/icon/ewm.png" alt=""/></span>
          <p>二维码</p>
        </a>
      </div>
      <div class="notshare">
        <a href="javascript:;" @click="closeShare()">取消</a>
      </div>
    </div>
    <div v-show="is_show_ewm" @click="closeShare()">
      <div class="blockbg zindex2000"></div>
      <div class="ewm_global zindex2001">
        <vue-qr :logoSrc="ewmConfig.logo" :text="ewmConfig.url" :size="ewmConfig.size"></vue-qr>
        <div class="ewm_text">
          <p>{{ewmConfig.text}}</p>
        </div>
      </div>
    </div>
    <!--微信中分享给朋友引导图-->
    <div class="guide_img_global" v-show="is_show_weixin" @click="is_show_weixin = false">
      <img src="../assets/img/icon/guide_1.png">
    </div>
    <!--微信中分享给朋友圈引导图-->
    <div class="guide_img_global" v-show="is_show_weixinFriend" @click="is_show_weixinFriend = false">
      <img src="../assets/img/icon/guide_2.png">
    </div>
  </div>
</template>

<script>
  import vueQr from 'vue-qr'
  export default {
    components: {
      vueQr
    },
    data() {
      return {
        is_show_share: false,//是否展示分享弹框
        is_show_ewm: false,//是否显示二维码图片
        is_show_weixinFriend: false,//是否显示分享到朋友圈引导图
        is_show_weixin: false,//是否显示分享到微信好友引导图
        platform_os: "",
        qApiSrc: {
          lower: "//3gimg.qq.com/html5/js/qb.js",
          higher: "//jsapi.qq.com/get?api=app.share"
        },
        bLevel: {
          qq: {
            forbid: 0,
            lower: 1,
            higher: 2
          },
          uc: {
            forbid: 0,
            allow: 1
          }
        },
        UA: navigator.appVersion,
        isqqBrowser: "",
        isucBrowser: "",
        version: {
          uc: "",
          qq: ""
        },
        isWeixin: false,
        isqqApp: false,
        socialShareParam: {},
        url: document.location.href,
        title: document.title,
        desc: document.title,
        imgUrl: document.title,
        img_title: document.title,
        from: window.location.host || '',
        ewmType: "",
        forTimeline: "",
        ewmConfig:{
          url:document.location.href,
          text:"http://www.baidu.com",
          logo: require('../assets/img/favicon.png'),
          size:200
        },
        ucAppList: {
          sinaWeibo: [
            'kSinaWeibo',
            'SinaWeibo',
            11,
            '新浪微博'
          ],
          weixin: [
            'kWeixin',
            'WechatFriends',
            1,
            '微信好友'
          ],
          weixinFriend: [
            'kWeixinFriend',
            'WechatTimeline',
            '8',
            '微信朋友圈'
          ],
          QQ: [
            'kQQ',
            'QQ',
            '4',
            'QQ好友'
          ],
          QZone: [
            'kQZone',
            'QZone',
            '3',
            'QQ空间'
          ]
        },
        qzone: 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url={url}&title={title}&pics={pic}&summary={content}',//QQ空间地址
        sina: 'http://service.weibo.com/share/share.php?url={url}&appkey=&title={title}&pic={pic}&language=zh_cn',
        tqq: 'http://share.v.t.qq.com/index.php?c=share&a=index&url={url}&title={title}&appkey=801cf76d3cfc44ada52ec13114e84a96',
        douban: 'http://www.douban.com/share/service?href={url}&name={title}&text={content}&image={pic}',
      }
    },
    created() {
      this.is_show_ewm = false;
      this.isqqBrowser = (this.UA.split("MQQBrowser/").length > 1) ? this.bLevel.qq.higher : this.bLevel.qq.forbid;
      this.isucBrowser = (this.UA.split("UCBrowser/").length > 1) ? this.bLevel.uc.allow : this.bLevel.uc.forbid;
      this.platform_os = this.getPlantform();
      this.version.qq = this.isqqBrowser ? this.getVersion(this.UA.split("MQQBrowser/")[1]) : 0;
      this.version.uc = this.isucBrowser ? this.getVersion(this.UA.split("UCBrowser/")[1]) : 0;
      this.isWeixin = this.is_weixin();
      this.isqqApp = this.is_qqApp();
      if ((this.isqqBrowser && this.version.qq < 5.4 && this.platform_os === "iPhone") ||
        (this.isqqBrowser && this.version.qq < 5.3 && this.platform_os === "Android")) {
        this.isqqBrowser = this.bLevel.qq.forbid;
      }
      else {
        if (this.isqqBrowser && this.version.qq < 5.4 && this.platform_os === "Android") {
          this.isqqBrowser = this.bLevel.qq.lower;
        }
        else {
          if (this.isucBrowser && ((this.version.uc < 10.2 && this.platform_os === "iPhone") ||
            (this.version.uc < 9.7 && this.platform_os === "Android"))) {
            this.isucBrowser = this.bLevel.uc.forbid;
          }
        }
      }
      this.isloadqqApi();
    },
    mounted() {
    },
    props: {},
    methods: {
      //关闭分享弹框
      closeShare() {
        this.is_show_ewm = false;
        this.is_show_share = false;
        this.is_show_weixinFriend = false;//是否显示分享到朋友圈引导图
        this.is_show_weixin = false;//是否显示分享到微信好友引导图
      },
      initNativeShare: function (config) {
        config = config || {};
        this.url = config.url || this.url || '';
        this.title = config.title || this.title || '';
        this.desc = config.desc || this.desc || '';
        if (config.img) {
          config.img = config.img.replace("./", "/");
        }
        this.img = config.img || "";
        this.img_title = config.img_title || this.img_title;
        this.from = config.from || this.from;
        this.ewmType = config.type || "";
        this.forTimeline = config.forTimeline || "";
        this.socialShareParam = {
          url: this.url,
          title: this.title,
          content: this.desc,
          pic: this.img
        };
        this.is_show_share = true;
      }, // QQ & UC 浏览器调用各自的插件，拉起手机app应用,进行分享
      shareToApp:function(to_app) {
        if (this.isucBrowser) {
          to_app = to_app == '' ? '' : (this.platform_os == 'iPhone' ? this.ucAppList[to_app][0] : this.ucAppList[to_app][1]);
          if (to_app == 'QZone') {
            let B = "mqqapi://share/to_qzone?src_type=web&version=1&file_type=news&req_type=1&image_url="+ this.img +"&title="+ this.title +"&description="+ this.desc +"&url="+ this.url +"&app_name=" + this.from;
            let k = document.createElement("div");
            k.style.visibility = "hidden";
            k.innerHTML = '<iframe src="' + B + '" scrolling="no" width="1" height="1"></iframe>';
            document.body.appendChild(k);
            setTimeout(function () {
              k && k.parentNode && k.parentNode.removeChild(k);
            }, 30000);
            return false;
          }
          if (typeof(window.ucweb) != "undefined") {
            window.ucweb.startRequest("shell.page_share", [this.title, this.desc, this.url, to_app, "", "", ""]);
          } else {
            if (typeof(window.ucbrowser) != "undefined") {
              window.ucbrowser.web_share && window.ucbrowser.web_share.apply(null,[this.title,this.desc, this.url, to_app, "", "", ""]);
            }
          }
        } else if(this.isqqBrowser && !this.isWeixin){
          to_app = to_app == '' ? '' : this.ucAppList[to_app][2];
          //好友圈和好友分享的标题不一样
          let ah = {
            url: this.url,
            title: (to_app == "8" || to_app == "3" || to_app == "2")? this.forTimeline : this.title,
            description: this.desc,
            img_url: this.img,
            img_title: this.img_title,
            to_app: to_app, //微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
            cus_txt: "请输入此时此刻想要分享的内容"
          };
          ah = to_app == '' ? '' : ah;
          if (typeof(window.browser) != "undefined") {
            if (typeof(window.browser.app) != "undefined" && this.isqqBrowser == this.bLevel.qq.higher) {
              window.browser.app.share(ah);
            }
          } else {
            if (typeof(window.qb) != "undefined" && this.isqqBrowser == this.bLevel.qq.lower) {
              window.qb.share(ah);
            }
          }
        }
      },
      //如果是QQ浏览器 引用对应版本的js插件
      isloadqqApi:function(){
        if (this.isqqBrowser) {
          let b = (this.version.qq < 5.4) ? this.qApiSrc.lower : this.qApiSrc.higher;
          let d = document.createElement("script");
          let a = document.getElementsByTagName("body")[0];
          d.setAttribute("src", b);
          a.appendChild(d);
        }
      },
      //判断客户端是ios 还是 Android
      getPlantform:function(){
        let ua = navigator.userAgent;
        if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1)) {
          return "iPhone";
        }
        return "Android";
      },
      //是否是QQ内置浏览器
      is_qqApp:function(){
        if(/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)){
          return /\sQQ/i.test(navigator.userAgent);
        }else if(/(Android)/i.test(navigator.userAgent)){
          return /MQQBrowser/i.test(navigator.userAgent) && /\sQQ/i.test((navigator.userAgent).split('MQQBrowser'));
        }else{
          return false;
        }
      },
      // 判断浏览器是否为 微信内置浏览器
      is_weixin:function() {
        let a = this.UA.toLowerCase();
        if (a.match(/MicroMessenger/i) == "micromessenger") {
          return true;
        } else {
          return false;
        }
      },
      //获取浏览器版本号
      getVersion:function(c) {
        let a = c.split("."), b = parseFloat(a[0] + "." + a[1]);
        return b;
      },
      //替换参数
      replaceAPI:function(api,options) {
        api = api.replace('{url}', encodeURIComponent(options.url));
        api = api.replace('{title}', encodeURIComponent(options.title));
        api = api.replace('{content}', encodeURIComponent(options.content));
        api = api.replace('{pic}', encodeURIComponent(options.pic));
        return api;
      },
      //分享
      shareBindEvent(type){
        //微信好友
        if(type === 0){
          if (!this.isWeixin && (this.isqqBrowser || this.isucBrowser)) {
            this.shareToApp("weixin");
          }else{
            this.is_show_weixin = true;
          }
        }
        //微信朋友圈
        else if(type === 1){
          if (!this.isWeixin && (this.isqqBrowser || this.isucBrowser)) {
            this.shareToApp("weixinFriend");
          }else{
            this.is_show_weixinFriend = true;
          }
        }
        //微博
        else if(type === 2){
          if (!this.isWeixin && (this.isqqBrowser || this.isucBrowser)) {
            this.shareToApp("sinaWeibo");
          }else{
            this.sinaWeibo(null,{url: this.url});
          }
        }
        //QQ空间
        else if(type === 3){
          if (!this.isWeixin && this.isqqBrowser) {
            this.shareToApp("QZone");
          }else{
            this.qZone(null,{url: this.url});
          }
        }
        //QQ好友
        else if(type === 4){
          if (!this.isWeixin && (this.isqqBrowser || this.isucBrowser)) {
            this.shareToApp("QQ");
          }else{
            this.tQQ(null,{url: this.url});
          }
        }
        //二维码
        else if(type === 5){
          this.queryQrCode();
        }
      },
      //非UC和QQ浏览器分享到QQ
      tQQ:function(target, opt){
        opt = opt || {};
        window.open(this.replaceAPI(this.tqq,Object.assign(this.socialShareParam,opt)), "_self");
      },
      //非UC和QQ浏览器分享到QQ空间
      qZone:function(target, opt){
        opt = opt || {};
        window.open(this.replaceAPI(this.qzone,Object.assign(this.socialShareParam,opt)), "_self");
      },
      //非UC和QQ浏览器分享到微博
      sinaWeibo:function(target, opt){
        opt = opt || {};
        window.open(this.replaceAPI(this.sina,Object.assign(this.socialShareParam,opt)), "_self");
      },
      //获取二维码
      queryQrCode: function () {
        this.ewmConfig["url"] = this.url
        this.ewmConfig["text"] = this.title
        this.is_show_ewm = true;
      },
    },
    watch: {}
  }
</script>

<style scoped>

  #nativeShare_global {
    font-size: 13px;
  }

  #nativeShare_global .list span {
    width: 30%;
    display: inline-block;
    text-align: center;
    margin: 10px 0;
  }

  #nativeShare_global .list span i {
    width: 40px;
    height: 40px;
    display: block;
    margin: 0 auto 5px;
  }

  .blockbg {
    background-color: rgba(0, 0, 0, .5);
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: block;
  }

  .zindex2000 {
    z-index: 2000;
  }

  .sharebox {
    background: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 1001;
  }

  .zindex2001 {
    z-index: 2001;
  }

  .sharebtn {
    padding: 2px 0;
    display: flex;
    display: -webkit-flex;
    display: -moz-flex;
    display: -ms-flex;
  }

  .sharebtn a {
    display: block;
    flex: 1;
    padding: 10px;
  }

  .sharebtn a p {
    text-align: center;
    margin: 0;
    font-size: 12px;
    color: #333;
    line-height: 12px;
    padding-top: 1px;
  }

  .sharebtn a span {
    display: block;
    background: #FFF;
    width: 47px;
    height: 47px;
    margin: 0 auto;
    border-radius: 3px;
  }

  .sharebtn a span img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .notshare a {
    display: block;
    width: 100%;
    height: 45px;
    line-height: 45px;
    text-align: center;
    font-size: 16px;
    color: #333;
    border-top: 1px solid #dedede;
  }

  .guide_img_global {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2001;
    background-color: rgba(0, 0, 0, .8);
    text-align: center;
  }

  .guide_img_global img {
    margin-top: 1px;
    width: 80%;
  }

  .ewm_global {
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    position: fixed;
  }
  .ewm_text{
    background-color: rgba(0, 0, 0, .9);
    color: #fff;
    text-align: center;
  }
  .ewm_text p{
    line-height: 20px;
    text-align: left;
    display: inline-block;
    padding: 2px 5px;
  }
</style>

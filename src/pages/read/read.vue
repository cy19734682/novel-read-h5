<template>
  <div :class="[{'black':setting.isShwNight},setting.bgColor]">
    <div>
      <van-overlay
          :show="show" :custom-style="{'background-color': 'rgba(0,0,0,.1)'}" z-index="998"
          @click="closeOverlay($event)"
      />
      <div class="menuRow row" :style="{top:show?'0':'-100%'}">
        <van-icon name="arrow-left" @click="back" class="col-1"/>
        <p class="col-10 popTitle">{{ bookName}}</p>
        <van-icon name="share-o" class="col-1" @click="onShare"/>
      </div>
      <a href="javascript:" class="readJoin" :class="{'active':show}" v-if="!isFollow" @click="addToBookshelf">加入书架</a>
      <div class="menuRow row" :style="{bottom:show?'0':'-100%'}">
        <div class="col-4">
          <van-icon name="wap-nav" size="16" @click="listShow = !listShow;settingShow = false"/>
          目录
        </div>
        <div class="col-4">
          <van-icon :name="setting.isShwNight?'closed-eye':'eye-o'" size="16" @click="changeSetting(0)"/>
          {{setting.isShwNight?'护眼':'正常'}}
        </div>
        <div class="col-4">
          <van-icon :name="settingShow?'setting':'setting-o'" size="16" @click="settingShow = !settingShow"/>
          设置
        </div>
      </div>
      <div class="settingRow" v-show="settingShow">
        <div>
          <span class="settName">字号</span>
          <span class="settSpan" :class="{disabled:setting.fontSize >= maxFontSize}" @click="changeSetting(2,0)">A+</span>
          <span class="settSpan" :class="{disabled:setting.fontSize <= minFontSize}" @click="changeSetting(2,1)">A-</span>
        </div>
        <div>
          <span class="settName">背景</span>
          <span
              class="settSpan" v-for="(item,index) in bgColorList" :key="index" :class="[item,{active:setting.bgColor===item}]"
              @click="changeSetting(1,item)"
          >&nbsp;</span>
        </div>
        <div>
          <span class="settName">翻页</span>
          <span class="settSpan" :class="{disabled:setting.turnType === 0}" @click="changeSetting(3,0)">上下滑动</span>
          <span class="settSpan" :class="{disabled:setting.turnType === 1}" @click="changeSetting(3,1)">左右滑动</span>
        </div>
      </div>
    </div>
    <van-popup v-model="listShow" position="left" :style="{ width: '70%',height:'100%' }">
      <div class="col-12 dir">
        <p>目录</p>
      </div>
      <div class="col-12">
        <van-list
            v-model="loadingX"
            :finished="finishedX"
            finished-text="没有更多了"
            @load="queryChapterList"
        >
          <van-cell
              @click="readChapter(item)"
              v-for="(item,index) in chapterList" :key="index"
              :class="{'red':chapter.id == item.id}"
              :title="item.title"
          />
        </van-list>
      </div>
    </van-popup>
    <!--内容容器-->
    <div class="contentRow" :class="{H:setting.turnType === 1}">
      <!--头部title-->
      <van-sticky>
        <p class="col-12 topTitle" :class="[{'black':setting.isShwNight,'white':setting.isShwNight},setting.bgColor]">{{chapter.title}}</p>
      </van-sticky>
      <div ref="bookRef" class="turnContent" @click="handlerClick">
        <van-pull-refresh class="scrollContent" v-model="isLoading" @refresh="onRefresh" loosing-text="释放加载上一章" pulling-text="下拉加载上一章" v-if="setting.turnType === 0">
          <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              :offset="100"
              @load="onLoad"
              :immediate-check="false"
          >
            <article :style="{'font-size':setting.fontSize+'px'}" ref="articleScroll">
              <section v-for="(item,index) in chapters" :key="index">
                <h3 class="col-12 cTitle" :class="[{'white':setting.isShwNight}]">{{ item.title}}</h3>
                <div class="col-12" :class="{'white':setting.isShwNight}" v-html="item.content"></div>
              </section>
            </article>
          </van-list>
        </van-pull-refresh>
        <article  class="swipeContent"  :style="{'font-size':setting.fontSize+'px'}" v-else>
          <section :style="{transform:'translateX(' + -translateX + 'px)'}" ref="articleScroll">
            <h3 class="col-12 cTitle" :class="[{'white':setting.isShwNight}]">{{ chapter.title}}</h3>
            <div class="col-12" :class="{'white':setting.isShwNight}" v-html="chapter.content"></div>
          </section>
          <p class="col-12" style="font-size: 14px">{{page.cur +'/'+ page.max}}</p>
        </article>
      </div>
    </div>
    <div class="loadEndIng" v-show="loadEnd">
      <van-loading size="24" color="#333333" vertical>加载中...</van-loading>
    </div>
    <nativeShare ref="shareRef"/>
  </div>
</template>

<script>
  import nativeShare from '../../components/nativeShare.vue'
  import {
    queryChapter, queryChapterPreOrNext, addBookShelf, queryBook
  } from '../../service/commService'

  export default {
    name: "chapter",
    components: {
      nativeShare
    },
    data() {
      return {
        loadEnd: true,
        userInfo: JSON.parse(sessionStorage.getItem("userInfo")) || {},
        bgColorList: [
          "bg-default",
          "bg-blue",
          "bg-green",
          "bg-light"
        ],
        setting:{
          isShwNight: localStorage.getItem("setting") && JSON.parse(localStorage.getItem("setting"))["isShwNight"] ||
            false,//是否显示黑夜模式
          bgColor: localStorage.getItem("setting") && JSON.parse(localStorage.getItem("setting"))["bgColor"] ||
            "bg-default",
          fontSize: localStorage.getItem("setting") && JSON.parse(localStorage.getItem("setting"))["fontSize"] || 16,
          turnType: localStorage.getItem("setting") && JSON.parse(localStorage.getItem("setting"))["turnType"] || 0,//0上下翻页  1左右翻页
        },
        minFontSize: 14,
        maxFontSize: 20,
        page: {
          cur: 1,
          max: 0
        },
        translateX: 0,//偏移量
        chapterId: this.$route.params.id,//章节ID
        bookId: this.$route.query.bookId,//书籍ID
        bookName: this.$route.query.bookName,//书籍名称
        bookDetail: {},
        chapterPre: {},//上一章节
        chapter: {},//当前章节
        chapters: [],//当前章节
        chapterNext: {},//下一章节
        chapterList: [],//章节列表
        show: false,//是否显示遮罩层
        settingShow: false,//是否显示设置
        listShow: false,//是否显示列表
        loading: false,//章节详情是否加载中
        finished: false,//章节详情是否加载完成
        isLoading: false,//章节详情是否可以加载
        current: 1,
        size: 100,
        loadingX: false,//章节列表是否加载中
        finishedX: false,//章节列表是否加载完成
        isFollow: false//是否加入了书架
      }
    },
    mounted() {
      this.onLoad();//查询章节详情
      this.queryBookDetail();//查询书籍详情
      this.queryChapterList();//查询章节列表
      this.$nextTick(() => {
        this.$refs.bookRef.addEventListener('scroll', this.handleScroll, true)
      })
    },
    beforeDestroy() {
      this.$refs.bookRef.removeEventListener('scroll', this.handleScroll)
    },
    methods: {
      queryBookDetail() {//查询书籍详情
        queryBook({
          id: this.bookId,
          userId: this.userInfo.id
        }).then(res => {
          if (res && res.code === 0 && res.data && res.data.length) {
            this.bookDetail = res.data[0]
            this.isFollow = !!this.bookDetail.fid
            this.bookName = this.bookName || this.bookDetail.title
          }
        }, err => {
          console.log(err)
        })
      },
      addToBookshelf() {//加入书架
        if (JSON.stringify(this.userInfo) === "{}") {
          this.$toast("您还未登录，请先登录！");
          return
        }
        addBookShelf({
          userId: this.userInfo.id,
          novelId: this.bookId
        }).then(res => {
          if (res && res.code === 0) {
            this.isFollow = true
          }
          else {
            this.$toast.fail(res.msg);
          }
        }, err => {
          console.log(err)
        })
      },
      queryChapterList() {//查询章节列表
        queryChapter({
          novel_id: this.bookId,
          current: this.current,
          size: this.size
        }).then(res => {
          if (res && res.code === 0) {
            this.chapterList = this.chapterList.concat(res.data)
            this.total = res.total
            this.loadingX = false;
            if (res.current >= res.pages) {
              this.finishedX = true;
            }
            else {
              this.current++
            }
          }
          else {
            this.finishedX = true;
            this.loadingX = false;
          }
        }, err => {
          console.log(err)
        })
      },
      onLoad(isNew,isPre) {
        queryChapterPreOrNext({
          chapter_id: this.chapterId,
          novel_id: this.bookId,
        }).then(res => {
          if (res && res.code === 0 && res.data && res.data.length) {
            this.chapterPre = {}
            this.chapterNext = {}
            if (isNew || this.chapters.length === 0) {//当刷新页面或只有一条数据时，锁定上一章
              this.replaceHistory(this.chapterId)
            }
            let len = res.data.length
            if (len === 1) {//只有一个章节
              this.chapter = res.data[0]
              this.finished = true;
            }
            else if (len === 2) {//只有2个章节，当前处于第一章或最后一章
              let rIndex = res.data.findIndex(e => {
                return e.id == this.chapterId
              })
              if (rIndex === 0) {//处于第一章
                this.chapter = res.data[0]
                this.chapterNext = res.data[1]
                this.chapterId = this.chapterNext.id
              }
              else {//处于最后一章
                if (isNew || this.chapters.length === 0) {//当刷新页面或只有一条数据时，锁定上一章
                  this.chapterPre = res.data[0]
                }
                this.chapter = res.data[1]
                this.finished = true;
              }
            }
            else if (len === 3) {//有上一章和下一章
              if (isNew || this.chapters.length === 0) {//当刷新页面或只有一条数据时，锁定上一章
                this.chapterPre = res.data[0]
              }
              this.chapter = res.data[1]
              this.chapterNext = res.data[2]
              this.chapterId = this.chapterNext.id
            }
            if (!(this.chapter.content && this.chapter.content.length > 0)) {//防止出现空章节导致页面不断加载下一章
              this.finished = true;
            }
            if (isNew) {
              this.$refs.bookRef.scrollTop = 0
              this.chapters = []
            }
            if (this.setting.turnType === 0) {//上下翻页才需要
              this.chapters.push(this.chapter)
            }
            this.initModes(false, isPre)//初始化阅读模式
            this.saveReadHistory()//保存阅读记录
            this.isLoading = false
            this.loading = false
          }
          this.loadEnd = false
        }, err => {
          this.loadEnd = false
          console.log(err)
        })
      },
      onRefresh() {
        if (!this.chapterPre.id) {
          this.$toast("已经是第一章了");
          this.isLoading = false;
          return
        }
        this.chapterId = this.chapterPre.id
        this.finished = false;
        this.loading = true;
        this.onLoad(true,true)
      },
      readChapter(item) {
        this.listShow = false
        this.show = false
        this.refreshing = true
        this.chapterId = item.id
        this.current = 1
        this.onLoad(true);
      },
      //设置更改
      changeSetting(type,val){
        this.listShow = false
        let setting = JSON.parse(localStorage.getItem("setting")) || {}
        if(type === 0){//切换护眼模式
          this.setting.isShwNight = !this.setting.isShwNight
          setting["isShwNight"] = this.setting.isShwNight
        }
        else if(type === 1){//更换背景颜色
          if(this.setting.bgColor === val){
            return
          }
          this.setting.isShwNight = false
          this.setting.bgColor = val
          setting["isShwNight"] = this.setting.isShwNight
          setting["bgColor"] = this.setting.bgColor
        }
        else if(type === 2){//更改字体大小
          if ((val === 1 && this.setting.fontSize <= this.minFontSize) || (val === 0 && this.setting.fontSize >= this.maxFontSize)) {
            return
          }
          if (val === 0) {
            this.setting.fontSize++
          }
          else {
            this.setting.fontSize--
          }
          setting["fontSize"] = this.setting.fontSize
          this.initModes(true)
        }
        else if(type === 3){//翻页模式
          if(this.setting.turnType === val){
            return
          }
          this.setting.turnType = val
          setting["turnType"] = this.setting.turnType
          this.initModes(true)
        }
        localStorage.setItem("setting", JSON.stringify(setting))
      },
      saveReadHistory() {
        let historyReadBook = localStorage.getItem("historyReadBook");
        if (!historyReadBook) {
          historyReadBook = [];
        }
        else {
          historyReadBook = JSON.parse(historyReadBook);
          // 只保存20个最新阅读的书籍
          if (historyReadBook.length > 20) {
            historyReadBook = historyReadBook.splice(0, 1);//移除第一个元素
          }
        }
        // 如果数组中没有存当前值 则添加到历史中
        let hisIndex = historyReadBook.findIndex(e => {
          return e.bookId == this.bookId
        })
        let book = {
          bookId: this.bookId,
          chapterId: this.chapter.id
        }
        if (hisIndex === -1) {
          historyReadBook.push(book);
        }
        else {
          historyReadBook[hisIndex] = book
        }
        localStorage.setItem("historyReadBook", JSON.stringify(historyReadBook));
      },
      onShare() {
        let content = this.chapter.content && this.chapter.content.replace(/<\/?.+?>/g, "").replace(/ /g, "") || "";
        let config = {
          title: this.bookName + '-' + this.chapter.title,
          img: this.serverImg + this.bookDetail.pic_id + this.bookDetail.suffix,
          desc: content && content.slice(0, 150) + "..." || "精彩不容错过！"
        }
        this.$refs.shareRef.initNativeShare(config);
      }, //页面滑动获取当前章节的方法
      handleScroll(e) {
        if (this.$refs.bookRef) {
          let scrollTop = e.target.scrollTop;
          let scrollHeight = e.target.scrollHeight;
          let thisScrollHeight = this.$refs.bookRef.scrollHeight;
          let childrenList = this.$refs.articleScroll.children
          if (scrollHeight == thisScrollHeight) {//防止横向滚动条影响
            for (let i = 0; i < childrenList.length; i++) {
              let e = childrenList[i]
              if (e.offsetTop < scrollTop && e.offsetTop + e.offsetHeight > scrollTop) {
                this.chapter = this.chapters[i]
                this.replaceHistory(this.chapter.id)
                break;
              }
            }
          }
        }
      }, //替换地址栏链接
      replaceHistory(chapterId) {
        let oldChapterId = window.location.href.split("/")[window.location.href.split("/").length - 1].split("?")[0]
        if (!chapterId || oldChapterId == chapterId) {
          return
        }
        window.history.replaceState(null, null, window.location.href.replace(oldChapterId, chapterId));//替换地址栏链接
        this.saveReadHistory()//保存阅读记录
      },
      closeOverlay(e) {//关闭遮罩层
        e.stopPropagation()
        this.show = false;
        this.settingShow = false
      },
      initModes(isChange, isPre) {
        if (isChange && this.setting.turnType === 0) {
          this.chapters = [this.chapter]
        }
        else {
          this.$nextTick(() => {
            let elScroller = this.$refs.articleScroll
            this.page.cur = 1;
            this.page.max = Math.round((elScroller.scrollWidth + 15) / (elScroller.clientWidth + 15));
            if (isPre) {
              this.page.cur = this.page.max
              this.translateX = (elScroller.clientWidth + 15) * (this.page.cur - 1)
            }
            else {
              this.translateX = 0
            }
          })
        }
      },
      handlerClick(e) {//点击页面翻页
        e.preventDefault()
        if (this.setting.turnType === 0) {
          let height = e.currentTarget.clientHeight
          let scrollTop = e.currentTarget.scrollTop
          let range = [
            height / 3,
            height * 2 / 3
          ];
          let oneScreenContentHeight = height - 5;
          let options = {
            $scroller: e.currentTarget,
            scrollTop: scrollTop,
            moveNum: oneScreenContentHeight,
          }
          if (e.y <= range[0]) {//向上翻页
            options["type"] = 0
            this.scrollTo(options)
          }
          else if (e.y >= range[1]) {//向下翻页
            options["type"] = 1
            this.scrollTo(options)
          }
          else {//点击中部唤起设置
            this.show = !this.show
          }
        }
        else {
          let width = e.currentTarget.clientWidth
          let range = [
            width / 3,
            width * 2 / 3
          ];
          if (e.x <= range[0]) {//向左翻页
            this.turnLeft()
          }
          else if (e.x >= range[1]) {//向右翻页
            this.turnRight()
          }
          else {//点击中部唤起设置
            this.show = !this.show
          }
        }
      },
      turnLeft(){
        let elScroller = this.$refs.articleScroll
        let clientWidth = (elScroller.clientWidth + 15)
        if (this.page.cur === 1) {
          this.translateX = 0
          this.onRefresh()
          return
        }
        this.scrollTo({
          moveNum: clientWidth,
          type: 0
        })
        this.page.cur--
      },
      turnRight(){
        let elScroller = this.$refs.articleScroll
        let clientWidth = (elScroller.clientWidth + 15)
        if (this.page.cur === this.page.max) {
          this.onLoad()
          return
        }
        this.scrollTo({
          moveNum: clientWidth,
          type: 1
        })
        this.page.cur++
      },
      //options 配置项
      scrollTo(options) {
        options = options || {}
        let moveNum = options.moveNum
        let type = options.type
        let scrollTop = 0
        let stepNum = 10
        moveNum = type === 0 ? -moveNum : moveNum
        let step = () => {
          scrollTop += moveNum*100 / stepNum
          if (Math.abs(scrollTop) <= Math.abs(moveNum * 100)) {
            if (this.setting.turnType === 0) {//上下翻页
              options.$scroller.scrollTop = options.scrollTop + scrollTop/100
            }
            else {
              this.translateX += (moveNum*100 / stepNum)/100
            }
            if (window.requestAnimationFrame) {
              requestAnimationFrame(step)
            }
            else {
              setTimeout(step, 17)
            }
          }
        }
        step()
      },
      back() {
        this.pageBack()
      }
    }
  }
</script>

<style scoped>
  /***背景颜色start***/
  .white {
    color: #999 !important;
  }
  .black {
    background: #1a1a1a none !important;
  }
  .van-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }
  .bg-default {
    background: #c4b395 url(../../assets/img/bg.png) no-repeat center;
    background-size: 100%
  }

  .bg-blue {
    background: #cad9e8
  }

  .bg-green {
    background: #d1edd1
  }

  .bg-light {
    background: #e6e6e6
  }
  /***背景颜色end***/

  /***底部设置start***/
  .menuRow {
    height: 45px;
    background-color: rgba(0, 0, 0, .9);
    margin: 0;
    width: 100%;
    position: fixed;
    z-index: 999;
    transition: all .2s;
  }
  .menuRow .col-4 {
    text-align: center;
    font-size: 12px;
    color: white;
    padding-top: 5px;
  }
  .popTitle {
    margin: 0 auto;
    line-height: 40px;
    font-size: 14px;
    color: white;
    text-align: center;
  }
  .settingRow {
    background-color: rgba(0, 0, 0, .9);
    margin: 0;
    width: 100%;
    position: fixed;
    z-index: 999;
    bottom: 45px;
  }

  .settingRow > div {
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, .1);
  }
  .settName {
    padding: 10px;
    color: #fff;
    font-size: 14px;
    display: inline-block;
  }
  .settSpan {
    height: 30px;
    line-height: 30px;
    margin: 0 15px 0 5px;
    padding: 0 20px;
    font-size: 14px;
    min-width: 50px;
    text-align: center;
    border-radius: 5px;
    border: #fff solid 1px;
    color: white;
    display: inline-block;
  }
  .settSpan.active {
    border: #ed424b solid 1px;
  }
  .settSpan.disabled {
    color: #333333;
  }
  /***底部设置end***/

  /***加入书架 start***/
  .readJoin {
    font-size: 13px;
    line-height: 36px;
    position: fixed;
    top: 60px;
    right: 0;
    padding: 0 8px 0 12px;
    transition: all .2s;
    transform: translateX(100%);
    color: #fff;
    border-radius: 48px 0 0 48px;
    background: rgba(0, 0, 0, .9);
    z-index: 999;
    text-decoration: none;
    outline: 0;
  }
  .active.readJoin {
    transform: translateX(0);
  }
  /***加入书架 end***/

  /***章节内容start***/
  .contentRow {
    height: 100%;
    width: 100%;
    overflow-y: auto;
  }
  .topTitle {
    height: 40px;
    margin: 0;
    line-height: 40px;
    font-size: 12px;
    color: rgba(0, 0, 0, .4);
  }
  .contentRow .turnContent {
    overflow-y: auto;
    height: calc(100% - 40px);
  }
  .contentRow article{
    padding-bottom: 150px;
    line-height: 1.8;
    text-align: justify;
  }
  .H.contentRow .turnContent{
    overflow: hidden;
  }
  .H.contentRow article {
    height: 100%;
    padding-bottom: 0;
  }
  .H.contentRow  section {
    overflow: visible;
    height: calc(100% - 30px);
    columns: calc(100vw - 30px) 1;
    column-gap: 15px;
    min-height: inherit;
    padding-bottom: 0;
  }
  .cTitle {
    font-weight: 500;
    margin: 0.8em 0;
    font-size: 1.2em;
  }
  /***章节内容end***/

  /***文章目录start***/
  .dir {
    padding: 0;
  }
  .dir > p {
    text-align: center;
    border-bottom: 1px solid red;
    margin: 0;
    font-size: 14px;
    line-height: 2em;
    color: red;
  }
  .red {
    color: red;
  }
  /***文章目录end***/

  /***页面loading start***/
  .loadEndIng {
    background-color: rgba(0, 0, 0, .1);
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .loadEndIng .van-loading {
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    position: fixed;
  }
  /***页面loading end***/
</style>
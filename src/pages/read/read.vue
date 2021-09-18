<template>
  <div ref="bookRef" :class="[{'black':isShwNight},bgColor]">
    <div>
      <van-overlay :show="show" z-index="998" @click="show = false;settingShow=false" />
      <div class="menuRow row" :style="{top:show?'0':'-100%'}">
        <van-icon name="arrow-left" @click="back" class="col-1"/>
        <p  class="col-10 popTitle">{{ bookName}}</p>
        <van-icon name="ellipsis"  class="col-1"/>
      </div>
      <div class="menuRow row" :style="{bottom:show?'0':'-100%'}">
        <div  class="col-4">
          <van-icon name="wap-nav"  size="16" @click="listShow = !listShow"/>
          目录
        </div>
        <div  class="col-4">
          <van-icon :name="isShwNight?'closed-eye':'eye-o'"  size="16" @click="switchNight"/>
          {{isShwNight?'护眼':'正常'}}
        </div>
        <div  class="col-4">
          <van-icon :name="settingShow?'setting':'setting-o'"  size="16" @click="settingShow = !settingShow"/>
          设置
        </div>
      </div>
      <div class="settingRow" v-show="settingShow">
        <div>
          <span class="settName">字号</span>
          <span class="settSpan" :class="{disabled:fontSize >= 20}" @click="changeFontSize(0)">A+</span>
          <span class="settSpan" :class="{disabled:fontSize <= 14}" @click="changeFontSize(1)">A-</span>
        </div>
        <div>
          <span class="settName">背景</span>
          <span class="settSpan" v-for="(item,index) in bgColorList" :key="index" :class="[item,{active:bgColor===item}]" @click="setBgColor(item)" >&nbsp;</span>
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
    <!--头部title-->
    <van-sticky>
      <p class="col-12 topTitle" :class="[{'black':isShwNight,'white':isShwNight},bgColor]"  @click="show = !show">{{ chapter.title}}</p>
    </van-sticky>
    <!--内容容器-->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loosing-text="释放加载上一章" pulling-text="下拉加载上一章">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :offset="0"
          @load="onLoad"
          :immediate-check="false"
      >
        <div class="content" @click="show = !show" :style="{'font-size':fontSize+'px'}">
          <div class="col-12" :class="{'white':isShwNight}" v-html="chapter.content"></div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
  import {queryChapter,queryChapterPreOrNext} from '../../service/commService'

  export default {
    name:"chapter",
    data() {
      return {
        bgColorList:["bg-default","bg-blue","bg-green","bg-light"],
        isShwNight: localStorage.getItem("setting") && JSON.parse(localStorage.getItem("setting"))["isShwNight"] || false,//是否显示黑夜模式
        bgColor: localStorage.getItem("setting") && JSON.parse(localStorage.getItem("setting"))["bgColor"] || "bg-default",
        fontSize: localStorage.getItem("setting") && JSON.parse(localStorage.getItem("setting"))["fontSize"] ||16,
        minFontSize:14,
        maxFontSize:20,
        chapterId: this.$route.params.id,//章节ID
        bookId: this.$route.query.bookId,//书籍ID
        bookName: this.$route.query.bookName,//书籍名称
        chapterPre: {},//上一章节
        chapter: {},//当前章节
        chapterNext: {},//下一章节
        chapterList: [],//章节列表
        show: false,//是否显示遮罩层
        settingShow:false,//是否显示设置
        listShow: false,//是否显示列表
        loading: false,//章节详情是否加载中
        finished: false,//章节详情是否加载完成
        isLoading: false,//章节详情是否可以加载
        current: 1,
        size: 100,
        loadingX: false,//章节列表是否加载中
        finishedX: false,//章节列表是否加载完成
      }
    },
    mounted() {
      this.onLoad();//查询章节详情
      this.queryChapterList();//查询章节列表
    },
    methods: {
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
            if(res.current >= res.pages){
              this.finishedX = true;
            }else{
              this.current ++
            }
          }else{
            this.finishedX = true;
            this.loadingX = false;
          }
        }, err => {
          console.log(err)
        })
      },
      onLoad() {
        queryChapterPreOrNext({
          chapter_id: this.chapterId,
          novel_id: this.bookId,
        }).then(res => {
          if (res && res.code === 0 && res.data) {
            this.$refs.bookRef.scrollTop = 0
            let oldChapterId = window.location.href.split("/")[window.location.href.split("/").length-1].split("?")[0]
            history.replaceState(null, null, window.location.href.replace(oldChapterId,this.chapterId));//替换地址栏链接
            let len = res.data.length
            if(len === 1){
              this.chapter = res.data[0]
              this.finished = true;
            }else if(len === 2){
              let rIndex =  res.data.findIndex(e=>{return e.id == this.chapterId})
              if(rIndex === 0){
                this.chapter = res.data[0]
                this.chapterNext = res.data[1]
                this.chapterId = this.chapterNext.id
              }else{
                this.chapterPre = res.data[0]
                this.chapter = res.data[1]
                this.finished = true;
              }
            }else if(len === 3){
              this.chapterPre = res.data[0]
              this.chapter = res.data[1]
              this.chapterNext = res.data[2]
              this.chapterId = this.chapterNext.id
            }
            if(!(this.chapter.content && this.chapter.content.length>0)){
              this.finished = true;
            }
            this.saveReadHistory()//保存阅读记录
            this.isLoading = false
            this.loading = false
          }
        }, err => {
          console.log(err)
        })
      },
      onRefresh() {
        this.chapterId = this.chapterPre.id
        this.finished = false;
        this.loading = true;
        this.onLoad()
      },
      readChapter(item){
        this.listShow = false
        this.show = false
        this.refreshing = true
        this.chapterId = item.id
        this.current = 1
        this.onLoad();
      },
      switchNight(){//切换护眼模式
        this.isShwNight = !this.isShwNight
        let setting = JSON.parse(localStorage.getItem("setting")) || {}
        setting["isShwNight"] = this.isShwNight
        localStorage.setItem("setting",JSON.stringify(setting))
      },
      setBgColor(color){//更换背景颜色
        this.isShwNight = false
        this.bgColor = color
        let setting = JSON.parse(localStorage.getItem("setting")) || {}
        setting["isShwNight"] = this.isShwNight
        setting["bgColor"] = this.bgColor
        localStorage.setItem("setting",JSON.stringify(setting))
      },
      changeFontSize(type){//更改字体大小
        if((type === 1 && this.fontSize <= 14) || (type === 0 && this.fontSize >=20)){
          return
        }
        if(type === 0){
          this.fontSize ++
        }else{
          this.fontSize --
        }
        let setting = JSON.parse(localStorage.getItem("setting")) || {}
        setting["fontSize"] = this.fontSize
        localStorage.setItem("setting",JSON.stringify(setting))
      },
      saveReadHistory(){
        let historyReadBook =  localStorage.getItem("historyReadBook");
        if (!historyReadBook) {
          historyReadBook = [];
        } else {
          historyReadBook = JSON.parse(historyReadBook);
          // 只保存20个最新阅读的书籍
          if (historyReadBook.length > 20) {
            historyReadBook = historyReadBook.splice(0, 1);//移除第一个元素
          }
        }
        // 如果数组中没有存当前值 则添加到历史中
        let hisIndex = historyReadBook.findIndex(e=>{
          return e.bookId == this.bookId
        })
        let book = {
          bookId:this.bookId,
          chapterId:this.chapter.id
        }
        if(hisIndex === -1){
          historyReadBook.push(book);
        }else{
          historyReadBook[hisIndex] = book
        }
        localStorage.setItem("historyReadBook",JSON.stringify(historyReadBook));
      },
      back() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style scoped>
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
  
  .menuRow{
    height:45px;
    background-color:rgba(0,0,0,.9);
    margin: 0;
    width: 100%;
    position: fixed;
    z-index: 999;
    transition: all .2s;
  }
  .menuRow .col-4{
    text-align: center;
    font-size: 12px;
    color: white;
    padding-top: 5px;
  }
  .popTitle{
    margin: 0 auto;
    line-height: 40px;
    font-size: 14px;
    color: white;
    text-align: center;
  }
  .settingRow{
    background-color:rgba(0,0,0,.9);
    margin: 0;
    width: 100%;
    position: fixed;
    z-index: 999;
    bottom: 45px;
  }
  .settingRow>div{
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid rgba(255,255,255,.1);
  }
  .settName{
    padding: 10px;
    color: #fff;
    font-size: 14px;
    display: inline-block;
  }
  .settSpan{
    height: 30px;
    margin:0 15px 0 5px;
    padding: 2px 20px;
    font-size: 15px;
    min-width: 50px;
    text-align: center;
    border-radius: 5px;
    border: #fff solid 1px;
    color: white;
    display: inline-block;
  }
  .settSpan.active{
    border: #ed424b solid 1px;
  }
  .settSpan.disabled{
    color: #333333;
  }
  .topTitle {
    height: 40px;
    margin: 0;
    line-height: 40px;
    font-size: 12px;
    color: rgba(0,0,0,.4);
  }
  .content{
    padding-bottom: 250px;
    line-height: 1.8;
  }
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
  .red{
    color: red;
  }
</style>
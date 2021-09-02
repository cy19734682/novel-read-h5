<template>
  <div :class="{'bg':true,'black':isShwNight}">
    <van-action-sheet v-model="show">
      <div class="row" style="height:40px;background:black;margin: 0">
        <van-icon name="arrow-left" @click="back" class="col-4"/>
        <van-icon name="wap-nav" @click="listShow = !listShow" class="col-4"/>
        <van-icon :name="isShwNight?'closed-eye':'eye-o'" @click="switchNight" class="col-4"/>
      </div>
    </van-action-sheet>
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
    <van-sticky>
      <p class="col-12 top" :class="{'black':isShwNight,'white':isShwNight}"  @click="show = !show">{{ chapter.title}}</p>
    </van-sticky>
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" loosing-text="释放加载上一章" pulling-text="下拉加载上一章">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          :offset="0"
          @load="onLoad"
      >
        <div class="content" @click="show = !show">
          <div class="col-12" :class="{'white':isShwNight}" v-html="chapter.content"></div>
        </div>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
  import {queryChapter, queryChapterDetail,queryChapterPreOrNext} from '../../service/commService'

  export default {
    data() {
      return {
        isShwNight: localStorage.getItem("isShwNight") || false,//是否显示黑夜模式
        chapterId: this.$route.params.id,//章节ID
        bookId: this.$route.query.bookId,//书籍ID
        bookName: this.$route.query.bookName,//书籍名称
        chapterPre: {},//上一章节
        chapter: {},//当前章节
        chapterNext: {},//下一章节
        chapterList: [],//章节列表
        show: false,//是否显示遮罩层
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
      // this.chapterDetail();//查询章节详情
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
        })
      },
      onLoad() {
        queryChapterPreOrNext({
          chapter_id: this.chapterId,
          novel_id: this.bookId,
        }).then(res => {
          if (res && res.code === 0 && res.data) {
            window.scrollTo(0, 0);
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
          else {
          }
        }, err => {
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
      switchNight(){
        this.isShwNight = !this.isShwNight
        localStorage.setItem("isShwNight",this.isShwNight)
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
    background: none !important;
    background-color: #212529 !important;
  }

  .van-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .bg {
    background: url('../../assets/img/bg.png') no-repeat;
    background-size: 100% 100%;
    min-height: 1000px;
  }

  .top {
    background: url('../../assets/img/bg.png') no-repeat;
    background-size: 100% 100%;
    height: 40px;
    margin: 0;
    line-height: 40px;
    font-size: 12px;
    color: #988153;
  }

  .content p {
    margin: 0;
    font-size: 18px;
    line-height: 1.8;
  }

  .sup {
    background-color: whitesmoke;
    margin: 0;
    padding: 0 30px;
    font-size: 12px;
    line-height: 36px;
    color: #999;
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
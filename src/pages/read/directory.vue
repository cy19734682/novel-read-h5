<template>
  <div style="padding-top: 46px">
    <van-nav-bar
        :title="bookName"
        left-arrow
        @click-left="back"
        fixed
    />
    <van-skeleton title :row="15" :loading="skLoading">
      <div class="col-12 dir">
        <p>目录</p>
        <p>共{{total}}章</p>
      </div>
    </van-skeleton>
    <div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
          <van-cell
              v-for="(item,index) in chapter" :key="index"
              :title="item.title"
              :class="{'red':hisChapterId == item.id}"
              :to="{name:'chapter',params:{id:item.id},query:{bookId:bookId,bookName:bookName}}"
          />
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
  import {queryChapter} from '../../service/commService'

  export default {
    data() {
      return {
        skLoading: true,
        bookId: this.$route.params.id,
        bookName: this.$route.query.bookName,
        hisChapterId:null,
        chapter: [],
        total: 0,
        current: 1,
        size: 100,
        loading: false,
        finished: false,
        refreshing: false,
      }
    },
    created() {
      let historyReadBook =  JSON.parse(localStorage.getItem("historyReadBook")) || []
      let hisIndex = historyReadBook.findIndex(e=>{
        return e.bookId == this.bookId
      })
      if(hisIndex > -1){
        this.hisChapterId = historyReadBook[hisIndex].chapterId
      }
    },
    methods: {
      onLoad() {
        queryChapter({
          novel_id: this.bookId,
          current: this.current,
          size: this.size
        }).then(res => {
          if (res && res.code === 0 && res.data) {
            if (this.refreshing) {
              this.chapter = [];
              this.total = 0;
              this.refreshing = false;
            }
            this.chapter = this.chapter.concat(res.data)
            this.total = res.total
            this.loading = false;
            if (res.current >= res.pages) {
              this.finished = true;
            }
            else {
              this.current++
            }
          }
          else {
            this.refreshing = false;
            this.finished = true;
            this.loading = false;
          }
          this.skLoading = false
        }, err => {
          console.log(err)
        })
      },
      onRefresh() {//下拉刷新
        this.current = 1
        // 清空列表数据
        this.finished = false;
        // 重新加载数据
        // 将 loading 设置为 true，表示处于加载状态
        this.loading = true;
        this.onLoad();
      },
      back() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  .row {
    margin: 0;
  }

  .top {
    display: flex;
    align-items: center;
  }

  .top p {
    margin: 10px 0;
    padding-left: 20px;
  }

  .dir {
    padding: 0;
  }

  .dir p:nth-child(1) {
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

  .dir p:nth-child(2) {
    margin: 0;
    font-weight: 800;
    line-height: 3em;
    font-size: 15px;
    text-indent: 1em;
  }

  .sup {
    background-color: whitesmoke;
    margin: 0;
    padding: 0 30px;
    font-size: 12px;
    line-height: 36px;
    color: #999;
  }
</style>
<template>
  <div style="padding-top: 46px">
    <van-nav-bar left-arrow @click-left="back" @click-right="searchBook" fixed class="searchBar">
      <template #title>
        <van-search v-model="searchText" placeholder="请输入搜索关键词" right-icon="" left-icon="" @clear="cleanInput"/>
      </template>
      <template #right>
        <van-icon name="search" size="18"/>
      </template>
    </van-nav-bar>
    <div v-show="searchText.length === 0">
      <div class="col-12 topic_bar">
        <h5 class="topic col-10">历史搜索</h5>
        <span class="col-2 clear" @click="clearHistorySearch">清空<van-icon name="delete" /></span>
      </div>
      <div class="col-12">
        <van-tag plain v-for="(item,index) in historySearchList" :key="index" @click="hotKeyClick(item)">{{item}}</van-tag>
      </div>
    </div>
    <div class="col-12" v-show="searchText.length > 0">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
        >
          <div class="bookDetail">
            <van-card v-for="(item,index) in bookList" :key="index" @click="toPage(item)">
              <p slot="title" class="title">{{ item.title }}</p>
              <p slot="desc" class="desc">{{item.content}}</p>
              <div slot="tags" class="ifo">
                <span class="author"><van-icon name="contact"/>{{ item.author }}</span>
                <div>
                  <van-tag plain>{{item.categoryName}}</van-tag>
                  <van-tag plain type="primary">{{item.word | numFormat}}万字</van-tag>
                </div>
              </div>
              <van-image
                  style=" height:110px;width:80px" :src="serverImg+item.pic_id+item.suffix" fit="fill" slot="thumb"
              ></van-image>
            </van-card>
          </div>
        </van-list>
      </van-pull-refresh>
      <van-empty  image="search" v-show="!(bookList && bookList.length) && isLoadEnd" description="暂无数据" />
    </div>
  </div>
</template>

<script>

  import {queryBookList} from "../../service/commService"

  export default {
    data() {
      return {
        loading: false,
        finished: false,
        refreshing: false,
        isLoadEnd:false,
        historySearchList:[],
        current: 1,
        size: 15,
        searchText: "",
        bookList: [],
      }
    },
    watch:{
      searchText(){
        this.isLoadEnd = false
      }
    },
    created() {
      //监控输入框，500毫秒后发送请求
      this.$watch('searchText', this.debounce(() => {
        this.refreshing = true
        this.onRefresh()
        this.searchHistory(this.searchText);//保存搜索历史
      }, 500));
    },
    mounted() {
      this.initSearchHistory()
    },
    methods: {
      toPage(item) {
        this.$router.push({
          name: "book",
          params: {id: item.id}
        });
      },
      hotKeyClick(value){
        this.searchText = value
      },
      searchBook(){
        this.refreshing = true
        this.onRefresh()
      },
      onLoad() {
        if(this.searchText.length === 0){
          this.bookList = [];
          this.refreshing = false;
          this.finished = true;
          this.loading = false;
          return
        }
        queryBookList({
          title: this.searchText,
          current: this.current,
          size: this.size
        }).then(res => {
          if (res && res.code === 0 && res.data) {
            if (this.refreshing) {
              this.bookList = [];
              this.refreshing = false;
            }
            this.bookList = this.bookList.concat(res.data)
            if (res.current >= res.pages) {
              this.finished = true;
            }
            else {
              this.finished = false;
              this.current++
            }
          }
          else {
            this.refreshing = false;
            this.finished = true;
          }
          this.loading = false;
          this.isLoadEnd = true
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
      cleanInput(){
        this.initSearchHistory();
      },
      /**
       * 搜索过的条件存储到历史记录里面
       */
      searchHistory(searchValue) {
        let searchHistory =  localStorage.getItem("historySearchKey");
        if (!searchHistory) {
          searchHistory = [];
        } else {
          searchHistory = JSON.parse(searchHistory);
          // 只保存10个最新的记录
          if (searchHistory.length > 10) {
            searchHistory = searchHistory.splice(0, 1);//移除第一个元素
          }
        }
        // 如果数组中没有存当前值 则添加到历史中
        if (searchValue && searchHistory.indexOf(searchValue) == -1) {
          searchHistory.push(searchValue);
          localStorage.setItem("historySearchKey",JSON.stringify(searchHistory));
        }
      },
      /**
       * 初始化搜索历史
       */
      initSearchHistory() {
        let searchHistory = localStorage.getItem("historySearchKey");
        if (searchHistory) {
          searchHistory = JSON.parse(searchHistory);
          this.historySearchList = searchHistory;
          this.historySearchList = this.historySearchList.reverse();
        }
      },
      //清空历史搜索
      clearHistorySearch(){
        this.historySearchList = [];
        localStorage.removeItem("historySearchKey");
      },
      debounce(func, delay) {
        let timer
        return function (...args) {
          if (timer) {
            clearTimeout(timer)
          }
          timer = setTimeout(() => {
            func.apply(this, args)
          }, delay)
        }
      },
      back() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style>
  .searchBar .van-nav-bar__title{
    min-width: 75%;
  }
</style>
<style scoped>
  .topic_bar {
    display: flex;
  }
  .topic {
    font-size: 15px;
    font-weight: 600;
    padding: 10px 15px 0 15px;
  }
  .clear {
    display: flex;
    line-height: 24px;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    color: #999;
  }
</style>
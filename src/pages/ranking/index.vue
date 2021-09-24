<template>
  <div style="padding-top: 46px">
    <van-nav-bar :title="title" left-arrow @click-left="back" @click-right="show = true" fixed>
      <template #right>
         <span class="more">
          筛选<van-icon name="filter-o" />
        </span>
      </template>
    </van-nav-bar>
    <div class="col-12">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
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
      <van-empty v-show="!(bookList && bookList.length) && isLoadEnd" description="暂无数据" />
    </div>
    <van-popup v-model="show" position="left" :style="{height:'100%',width:'80%'}">
      <van-tree-select
          height="100%"
          :items="categoryList"
          :active-id.sync="activeId"
          :main-active-index.sync="mainActiveIndex"
          @click-nav="clickNav"
          @click-item="clickItem"
      />
    </van-popup>
  </div>
</template>

<script>
  import {queryCategory, queryBookList} from "../../service/commService"

  export default {
    data() {
      return {
        title:"全部",
        isLoadEnd:false,
        show: false,
        loading: false,
        finished: false,
        refreshing: false,
        current: 1,
        size: 15,
        category: null,
        activeId: 0,
        mainActiveIndex: 0,
        categoryList: [],
        bookList: [],
      }
    },
    mounted() {
      this.queryCategoryList()
    },
    methods: {
      toPage(item) {
        this.$router.push({
          name: "book",
          params: {id: item.id}
        });
      },
      onLoad() {
        queryBookList({
          category: this.category,
          current: this.current,
          size: this.size
        }).then(res => {
          this.isLoadEnd = true
          if (res && res.code === 0 && res.data && res.data.length>0) {
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
            this.bookList = [];
            this.refreshing = false;
            this.finished = true;
          }
          this.loading = false;
        }, err => {
          console.log(err)
          this.isLoadEnd = true
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
      clickNav(index){
        if(index === 0){
          this.activeId = 0
          this.title = "全部"
          this.show = false
          this.category = null
          this.current = 1
          this.refreshing = true
          this.onLoad();
        }
      },
      clickItem(data) {
        this.title = data.textName
        this.show = false
        this.category = data.id
        this.current = 1
        this.refreshing = true
        this.onLoad();
      },
      queryCategoryList() {
        queryCategory().then(res => {
          if (res && res.code === 0 && res.data && res.data.length) {
            this.categoryList = res.data
            this.categoryList.unshift({
              id: null,
              title: "全部"
            })
            this.selectChild(this.categoryList)
          }
        }, err => {
          console.log(err)
        })
      },
      selectChild(items) {
        items = items || []
        items.forEach(e => {
          e.textName = e.text||e.title
          e.text = e.title
          if (Object.prototype.hasOwnProperty.call(e, 'children')) {
            e.children.unshift({
              id: e.id,
              text: e.title,
              title: "全部"
            })
            this.selectChild(e.children)
          }
        })
      },
      back() {
        this.pageBack()
      },
    }
  }
</script>

<style scoped>
  .top {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }
  .van-tree-select__item {
    font-weight: initial;
  }
  .top p {
    margin: 0;
    padding-left: 20px;
  }
  .more {
    display: flex;
    font-size: 12px;
    justify-content: center;
    align-items: center;
  }
</style>


<template>
  <div style="padding-top: 46px">
    <van-nav-bar
        :title="title"
        left-arrow
        @click-left="back"
        fixed
    />
    <div class="col-12">
      <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
      >
        <van-card v-for="(item,index) in recommend" :key="index" @click="toRecommend(item)">
          <p slot="title" class="title">{{ item.bookName }}</p>
          <p slot="desc" class="desc">{{item.content}}</p>
          <div slot="tags" class="ifo">
            <span class="author"><van-icon name="contact"/>{{ item.author }}</span>
            <div>
              <van-tag plain>{{item.cName}}</van-tag>
              <van-tag plain type="primary">{{item.word | numFormat}}万字</van-tag>
            </div>
          </div>
          <van-image
              style=" height:110px;width:80px" :src="serverImg+item.pic_id+item.suffix" fit="fill" slot="thumb"
          ></van-image>
        </van-card>
      </van-list>
    </div>
  </div>
</template>

<script>
  import {queryRecommend} from "../../service/commService"

  export default {
    data() {
      return {
        skLoading: true,
        code: this.$route.query.code,
        title: this.$route.query.title,
        finished: false,
        loading: false,
        recommend: []
      }
    },
    methods: {
      toRecommend(item) {
        this.$router.push({
          name: "book",
          params: {id: item.novelId}
        });
      },
      onLoad() {
        queryRecommend({
          code: this.code,
          limit: 99
        }).then((res) => {
          if (res && res.code === 0) {
            this.recommend = res.data
            this.skLoading = false
            this.finished = true;
          }
          else {

          }
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      back() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style scoped>
  .top {
    display: flex;
    align-items: center;
    margin: 10px 0;
  }

  .top p {
    margin: 0;
    padding-left: 20px;
  }

  .van-card {
    background-color: #fff;
    border-bottom: 1px solid #f5f7fa;
    height: 125px;
  }

  .ifo {
    display: flex;
    justify-content: space-between;
  }

  .title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 8px;
  }

  .desc {
    color: #999;
    margin-bottom: 5px;
    font-size: 12px;
    line-height: 20px;
    max-height: 60px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .author {
    color: #999;
    font-size: 12px;
    display: flex;
    align-items: center;
  }

  .van-image {
    box-shadow: 0 1px 6px rgba(0, 0, 0, .35), 0 0 5px #f9f2e9 inset;
  }
</style>


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
        <div class="bookDetail">
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
        </div>
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
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
      },
      back() {
        this.pageBack()
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
</style>


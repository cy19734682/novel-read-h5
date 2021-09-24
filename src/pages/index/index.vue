<template>
  <div class="bg">
    <Head></Head>
    <van-skeleton title :row="15" :loading="loading">
      <div>
        <van-swipe :autoplay="3000" :height="146" indicator-color="white">
          <van-swipe-item v-for="(item,index) in bannerList" :key="index">
            <router-link :to="{path:item.url}">
              <img :src="serverImg+item.pid+item.suffix" style="width: 100%;height: auto;"/>
            </router-link>
          </van-swipe-item>
        </van-swipe>
      </div>
      <div style="background-color:white;margin-bottom:20px;padding-top: 10px" v-if="recommend1 && recommend1.length">
        <div class="col-12 topic_bar">
          <h5 class="topic col-10">{{recommend1[0].rTitle}}</h5>
          <span class="col-2 more">
            <router-link :to="{name:'recommend',query:{code:'force_push',title:recommend1[0].rTitle}}">更多</router-link>
            <van-icon name="arrow"/>
          </span>
        </div>
        <van-grid :column-num="3" :border="false">
          <van-grid-item v-for="(item,index) in recommend1" :key="index" @click="toRecommend(item)">
            <van-image style=" height:110px;width:95px" :src="serverImg+item.pic_id+item.suffix" fit="fill"></van-image>
            <span class="bookName">{{ item.bookName }}</span>
          </van-grid-item>
        </van-grid>
      </div>
      <div style="background-color:white;margin-bottom:20px" v-if="recommend2 && recommend2.length">
        <div class="col-12 topic_bar">
          <h5 class="topic col-10">{{recommend2[0].rTitle}}</h5>
          <span class="col-2 more">
            <router-link :to="{name:'recommend',query:{code:'best_sell',title:recommend1[0].rTitle}}">更多</router-link>
            <van-icon name="arrow"/>
          </span>
        </div>
        <div class="bookDetail">
          <van-card v-for="(item,index) in recommend2" :key="index" @click="toRecommend(item)">
            <p class="title" slot="title">{{ item.bookName }}</p>
            <p class="desc" slot="desc">{{ item.content }}</p>
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
      </div>
      <div class="col-12 footer">
        <p>Copyright © XXX</p>
      </div>
    </van-skeleton>
  </div>
</template>

<script>
  import {queryBanner, queryRecommend} from '../../service/commService'
  import Head from '../../components/header.vue'

  export default {
    components: {
      Head,
    },
    data() {
      return {
        loading: true,
        bannerList: [],
        recommend1: [],
        recommend2: [],
      }
    },
    mounted() {
      this.queryBannerList();
      this.queryRecommendList();
    },
    methods: {
      toRecommend(item) {
        this.$router.push({
          name: "book",
          params: {id: item.novelId}
        });
      },
      queryBannerList() {
        queryBanner().then(res => {
          if (res && res.code === 0) {
            this.bannerList = res.data
          }
        }, err => {
          console.log(err)
        })
      },
      queryRecommendList() {
        Promise.all([
          queryRecommend({code: "force_push"}),
          queryRecommend({code: "best_sell"})
        ]).then((res) => {
          if (res[0] && res[0].code === 0 && res[1] && res[1].code === 0) {
            this.recommend1 = res[0].data
            this.recommend2 = res[1].data
            this.loading = false
          }
        }).catch((e) => {
          console.log(e)
        })
      }
    }
  }
</script>

<style scoped>
  .col-12 >>> .van-grid-item__content--center {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding: 10px 8px;
  }
  .bookName {
    line-height: 18px;
    font-size: 12px;
    width: 100%;
    text-align: center;
    display: inline-block;
    color: black;
    margin-top: 3px;
  }
  .topic_bar {
    display: flex;
  }
  .topic {
    font-size: 15px;
    font-weight: 600;
    padding: 10px 15px 0 15px;
  }
  .more {
    display: flex;
    line-height: 24px;
    font-size: 12px;
    justify-content: center;
    align-items: center;
    color: #999;
  }
  .bg {
    background-color: whitesmoke;
    padding-bottom: 1px;
  }
  .col-12 >>> .van-tabs__wrap {
    margin-bottom: 10px;
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    position: relative;
    bottom: 0;
    left: 0;
  }

  .footer p {
    color: #999;
    font-size: 12px;
    text-align: center;
    margin: 0;
  }
</style>
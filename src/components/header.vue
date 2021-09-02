<template>
  <div>
    <van-popup v-model="show" position="left" :style="{height:'100%',width:'80%'}">
      <div v-if="userInfo.id">
        <p class="myBook col-12">{{userInfo.username}}的书架</p>
        <div v-if="bookshelf && bookshelf.length">
          <van-card v-for="(item,index) in bookshelf" :key="index" @click="read(item)">
            <h3 slot="title">{{ item.title }}</h3>
            <p slot="desc">{{ item.author }}</p>
            <van-image slot="thumb" style=" height:100px;width:80px" :src="serverImg+item.pic_id+item.suffix" fit="fill"></van-image>
            <div slot="footer">
              <van-button type="danger" size="small" @click="removeFromBookshelf(item,$event)">移出书架</van-button>
            </div>
          </van-card>
        </div>
        <van-empty description="书架空空如也" v-else-if="loadEnd"/>
      </div>
      <div v-else>
        <van-empty image="error" description="您还未登录">
          <router-link :to="{name:'login'}"><van-button round type="danger" class="bottom-button">去登录</van-button></router-link>
        </van-empty>
      </div>
    </van-popup>
    <van-sticky>
      <div class="row col-12" style="background-color:white">
        <van-icon name="ellipsis" class="col-2 user_icon" @click="checkBookshelf"/>
        <van-search placeholder="请输入搜索关键词" v-model="search" class="col-8" right-icon="search" left-icon="" disabled @click="toSearch()"/>
        <span class="col-2 all">
            <router-link :to="{name:'ranking'}">分类</router-link>
          </span>
      </div>
    </van-sticky>
  </div>
</template>

<script>
  import {userBookShelf, deleteBookShelf} from "../service/commService"
  export default {
    data() {
      return {
        show: false,
        loadEnd:false,
        search: '',
        bookshelf: [],
        userInfo:JSON.parse(sessionStorage.getItem("userInfo")) || {}
      }
    },
    mounted() {

    },
    methods: {
      toSearch(){
        this.$router.push({name: "search"});
      },
      read(item) {
        this.$router.push({
          name: "book",
          params: {id: item.novel_id}
        });
        this.show = false;
      },
      removeFromBookshelf(item,e) {
        e.stopPropagation()
        deleteBookShelf({userId:this.userInfo.id,novelId:item.novel_id}).then(res => {
          if (res && res.code === 0) {
            this.checkBookshelf()
          }else{
            this.$toast.fail(res.msg);
          }
        }, err => {
        })
      },
      checkBookshelf() {
        this.show = true
        this.loadEnd = false
        userBookShelf({userId:this.userInfo.id}).then(res => {
          if (res && res.code === 0) {
            this.bookshelf = res.data
          }
          this.loadEnd = true
        }, err => {
          this.loadEnd = true
        })
      }
    }
  }
</script>

<style scoped>
  .myBook {
    text-align: center;
    margin: 20px 0;
  }

  .user_icon {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .row {
    margin: 0;
  }

  .van-image {
    box-shadow: 0 1px 6px rgba(0, 0, 0, .35), 0 0 5px #f9f2e9 inset;
  }

  .van-card {
    padding: 15px;
    background-color: whitesmoke;
  }

  .van-card__header {
    height: 70px;
  }

  .van-card__thumb {
    width: 80px;
    height: 100px;
    margin-right: 10px;
  }
  .all{
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .all a{
    color: #212529;
  }
  .all a:link{
    text-decoration: none;
  }
  .bottom-button {
    width: 160px;
    height: 40px;
  }
</style>


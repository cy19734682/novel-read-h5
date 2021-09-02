<template>
  <div class="bg" style="padding-top: 46px">
    <van-nav-bar
        :title="book.title"
        left-arrow
        @click-left="back"
        fixed
    />
    <van-skeleton title :row="15" :loading="loading">
      <div class="col-12 ifo_box">
        <van-card>
          <h5 slot="title">{{ book.title }}</h5>
          <p slot="desc">{{ book.author }}</p>
          <div slot="tags">
            <van-tag
                v-if="book && book.tag" plain type="danger" v-for="(item,index) in book.tag && book.tag.split(',')"
                :key="index"
            >{{item}}
            </van-tag>
            <p>{{book.categoryName}} {{book.word | numFormat}}字</p>
            <p>{{book.serialize === 1?'连载中':'已完结'}}</p>
          </div>
          <van-image v-if="book.pic_id" slot="thumb" width="120" height="160" :src="serverImg+book.pic_id+book.suffix"/>
        </van-card>
      </div>
      <div class="col-12 desc">
        <div class="content">
          <p>{{ book.content }}</p>
        </div>
        <div class="row col-12">
          <p class="col-11 dir">目录</p>
          <router-link v-if="book.title" :to="{name:'chapterList',params:{ id:book.id },query:{bookName:book.title}}">
            <van-icon name="arrow"/>
          </router-link>
        </div>
      </div>
      <div class="bottom col-12">
        <Comment :bookId="bookId"></Comment>
      </div>
      <van-goods-action>
        <van-goods-action-button type="primary" :loading="followLoading" :text="isFollow?'移除书架':'加入书架'" @click="addToBookshelf"/>
        <van-goods-action-button type="info" :loading="readLoading" text="立即阅读" @click="readBook"/>
      </van-goods-action>
    </van-skeleton>
  </div>
</template>

<script>
  import {queryBook, addBookShelf, deleteBookShelf, queryChapter} from '../../service/commService'
  import Comment from "../../components/comment.vue"
  export default {
    components: {
      Comment
    },
    data() {
      return {
        loading: true,
        followLoading:false,
        readLoading:false,
        userInfo:JSON.parse(sessionStorage.getItem("userInfo")) || {},
        book: {},
        bookId: this.$route.params.id,
        isFollow:false,
        commentList: []
      }
    },
    mounted() {
      this.queryBookDetail();
    },
    methods: {
      queryBookDetail() {
        queryBook({id: this.bookId,userId:this.userInfo.id}).then(res => {
          if (res && res.code === 0 && res.data) {
            this.book = res.data[0]
            this.isFollow = !!this.book.fid
            this.loading = false
          }
        }, err => {
        })
      },
      addToBookshelf() {
        if(JSON.stringify(this.userInfo) === "{}"){
          this.$toast.fail("您还未登录，请先登录！");
          return
        }
        this.followLoading = true
        if(this.isFollow){
          deleteBookShelf({userId:this.userInfo.id,novelId:this.bookId}).then(res => {
            if (res && res.code === 0) {
              this.$toast.success('已移除书架');
              this.isFollow = false
            }else{
              this.$toast.fail(res.msg);
            }
            this.followLoading = false
          }, err => {
            this.followLoading = false
          })
        }else{
          addBookShelf({userId:this.userInfo.id,novelId:this.bookId}).then(res => {
            if (res && res.code === 0) {
              this.$toast.success('已加入书架');
              this.isFollow = true
            }else{
              this.$toast.fail(res.msg);
            }
            this.followLoading = false
          }, err => {
            this.followLoading = false
          })
        }
      },
      readBook(){

        let historyReadBook =  JSON.parse(localStorage.getItem("historyReadBook")) || []
        let hisIndex = historyReadBook.findIndex(e=>{
          return e.bookId == this.bookId
        })
        if(hisIndex > -1){
          this.$router.push({
            name: "chapter",
            params:{id:historyReadBook[hisIndex].chapterId},
            query:{bookId:this.book.id,bookName:this.book.title}
          });
          return
        }
        this.readLoading = true
        queryChapter({
          novel_id: this.bookId,
          current: 1,
          size: 1
        }).then(res => {
          if (res && res.code === 0) {
              if(res.data && res.data.length){
                this.$router.push({
                  name: "chapter",
                  params:{id:res.data[0].id},
                  query:{bookId:this.book.id,bookName:this.book.title}
                });
              }else{
                this.$toast.fail("章节为空");
              }
          }else{
            this.$toast.fail(res.msg);
          }
          this.readLoading = false
        }, err => {
          this.readLoading = false
        })
      },
      back() {
        this.$router.go(-1)
      },
    }
  }
</script>

<style scoped>
  .row {
    margin: 0;
    align-items: center;
  }

  .top {
    display: flex;
    align-items: center;
  }

  .top p {
    margin: 10px 0;
    padding-left: 20px;
  }

  .ifo_box, .bg {
    background-color: whitesmoke;
  }

  .ifo_box p {
    margin: 8px 0;
    font-size: 14px;
    line-height: 24px;
  }

  .ifo_box h5 {
    margin: 0;
    font-weight: 800;
  }

  .van-card {
    padding: 15px;
    background-color: whitesmoke;
  }

  .van-card__header {
    height: 160px;
  }

  .van-card__thumb {
    width: 120px;
    height: 160px;
    margin-right: 15px;
  }

  .ifo_box >>> img {
    box-shadow: 0 1px 6px rgba(0, 0, 0, .35), 0 0 5px #f9f2e9 inset;
  }

  .desc {
    margin-bottom: 10px;
    background-color: #fff;
  }

  .van-tag {
    margin: 5px 3px 0 0;
  }

  .content {
    min-height: 100px;
    border-bottom: 1px solid whitesmoke;
    padding-top: 20px;
    font-size: 14px;
    line-height: 1.8em;
    text-indent: 2em;
  }

  .bottom {
    background-color: #fff;
    padding-bottom: 50px;
  }

  .dir {
    margin: 0;
    line-height: 39px;
    font-size: 15px;
    font-weight: 800;
  }
</style>

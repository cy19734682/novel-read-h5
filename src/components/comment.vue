<template>
  <div style="min-height: 200px">
    <h5 class="topic">文章评论 <span class="commentBtn" @click="openCommentPop">评论</span></h5>
    <div class="comment_container" v-if="commentList && commentList.length">
      <div v-for="(item, index) in commentList" :key="index">
        <div class="comment_content">
          <div class="info_wrap">
            <div class="name_date_row">
              <span class="user_name">{{item.username}}:&nbsp;&nbsp;</span>
              <span class="comment_text">{{item.content}}</span>
              <span class="comment_date">&nbsp;&nbsp;{{item.create_time | formatTime}}</span>
              <span class="reply" @click="replyClick(item)">回复</span>
            </div>
          </div>
        </div>
        <div class="commend_child">
          <comment-item @replycom="replyClick" :comment="item" :comment-children="item.children"></comment-item>
        </div>
      </div>
    </div>
    <div v-else style="font-size: 14px;color: #666666;padding-top: 20px">
      <p style="text-align: center">还没有评论哦！快来抢占沙发~</p>
    </div>
    <van-popup v-model="showPop" closeable position="bottom" :style="{height:'40%',width:'100%'}">
      <p class="commentTitle">{{popTips}}</p>
      <van-field
          :label-width="0"
          v-model="commentStr"
          rows="5"
          :maxlength="150"
          autosize
          type="textarea"
          :placeholder="'请输入'+popTitle"
      />
      <div style="margin:20px 16px 0 16px;">
        <van-button @click="submitComment" round block type="info" native-type="submit">{{popTitle}}</van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './commentItem.vue'
import {queryComment,addComment} from "../service/commService"

export default {
  name: 'comment',
  data () {
    return {
      showPop:false,
      commentList: [],
      userInfo:JSON.parse(sessionStorage.getItem("userInfo")) || {},
      commentStr:"",
      pid:null,
      popTips:"评论",
      popTitle:"评论",
    }
  },
  components: {
    CommentItem
  },
  props:{
    bookId:null
  },
  created () {
    this.queryCommentList()
  },
  methods: {
    queryCommentList() {
      queryComment({novelId: this.bookId}).then(res => {
        if (res && res.code === 0 && res.data && res.data.length) {
          this.commentList = res.data
        }
      }, err => {
        console.log(err)
      })
    },
    //点击了回复
    replyClick (item) {
      this.showPop = true
      this.commentStr = ""
      this.pid = item.id
      this.popTips = "回复 "+item.username
      this.popTitle = "回复"
    },
    openCommentPop(){
      this.showPop = true
      this.commentStr = ""
      this.pid = 0
      this.popTips = "评论"
      this.popTitle = "评论"
    },
    submitComment(){
      if(JSON.stringify(this.userInfo) === "{}"){
        this.$toast("您还未登录，请先登录！");
        return
      }
      if(this.commentStr.trim() == ''){
        this.$toast("评论内容不能为空");
        return
      }
      let params ={
        userId:this.userInfo.id,
        novelId:this.bookId,
        pid:this.pid,
        content:this.commentStr
      }
      addComment(params).then(res => {
        if (res && res.code === 0) {
          this.queryCommentList()
          this.showPop = false
        }else {
          this.$toast.fail(res.msg);
        }
      }, err => {
        console.log(err)
      })
    }
  },
}
</script>
<style scoped>
  .topic {
    font-size: 15px;
    font-weight: 600;
    padding: 15px 15px 10px 15px;
  }
  .comment_container {
    font-size: 14px;
    padding: 0 15px;
  }
  .comment_container>div {
    border-bottom: 1px solid #eee;
  }
  .comment_content {
    display: flex;
  }
  .info_wrap {
    flex: 1;
  }
  .name_date_row {
    justify-content: space-between;
    margin-bottom: 5px;
    color: #666;
  }
  .user_name{
    color: #4f4f4f;
  }
  .comment_text{
    color: #222226;
  }
  .comment_date{
    color: #6b6b6b;
    font-size: 12px;
  }
  .reply {
    color: #1989fa;
    white-space: nowrap
  }
  .commend_child {
    padding: 5px 15px;
  }
  .commentBtn{
    float: right;
    margin-right: 15px;
    font-size: 12px;
    color: #ffffff;
    background-color: #1989fa;
    padding: 3px 10px;
    border-radius: 5px;
    font-weight: 500;
  }
  .commentTitle{
    padding: 15px 20px 0 10px;
  }
</style>
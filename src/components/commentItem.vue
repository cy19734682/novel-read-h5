<template>
  <div class="comment_item" v-if="commentChildren">
    <div class="comment_content" v-for="(item, index) in commentChildren" :key="index">
      <div class="comment_right">
        <div class="info_wrap">
          <div class="name_date_row">
            <span class="user_name">{{item.username}} <span style="font-size: 12px">回复</span> {{comment.username}}:&nbsp;&nbsp;</span>
            <span class="comment_text">{{item.content}}</span>
            <span class="comment_date">{{item.create_time | formatTime}}</span>
            <span class="reply"  @click="replyChild(item)">&nbsp;&nbsp;回复</span>
          </div>
        </div>
      </div>
      <div class="comment_child">
        <commentchild-item
            @replycom="replycommentchild"
            :comment="item"
            :comment-children="item.children"
        ></commentchild-item>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'commentchildItem',
    data() {
      return {}
    },
    props: {
      comment: null,
      commentChildren: null
    },
    methods: {
      replyChild(item) {
        this.$emit('replycom', item)
      },
      replycommentchild(item) {
        this.$emit('replycom', item)
      }
    },
  }
</script>
<style scoped>
  .comment_content {
    display: flex;
    flex-direction: column;
    padding: 5px 0;
  }
  .comment_right {
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
  .comment_date .reply {
    color: #333;
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
    color: #5893c2;
    white-space: nowrap
  }
  .comment_child {
    padding: 5px 0;
  }
</style>
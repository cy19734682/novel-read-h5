<template>
  <div id="app">
    <transition mode="out-in">
      <router-view class="router-view" v-if="isRouterAlive"></router-view>
    </transition>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name:"app",
    computed:{
      ...mapState([
        'isReload'
      ])
    },
    data(){
      return {
        isRouterAlive:true
      }
    },
    watch:{
      isReload(){
        this.isRouterAlive = false
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style>
  #app{
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
  }
  .router-view {
    height: 100%;
    top: 0;
    position: absolute;
    left:0;
    width: 100%;
  }
  .v-enter, .v-leave-to {
    opacity: 0;
    transform: translate3d(100px, 0, 100px);
  }

  .v-enter-active, .v-leave-active {
    transition: all 0.2s;
  }
</style>

<template>
  <div style="height:100%">
    <transition mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  export default {}
</script>

<style>
  .v-enter, .v-leave-to {
    opacity: 0;
    transform: translate3d(100px, 0, 100px);
  }

  .v-enter-active, .v-leave-active {
    transition: all 0.2s;
  }
</style>

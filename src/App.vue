<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {};
  },
  beforeCreate() {},
  created() {
    // console.log(this.getJsUrl('userId'))
  },
  updated() {
    //默认选中第一项
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped>
// @import '//at.alicdn.com/t/font_1832696_4cwetrybfbr.css'
</style>

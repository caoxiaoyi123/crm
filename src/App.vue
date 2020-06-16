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
    this.getDepart();
  },
  updated() {
    //默认选中第一项
  },
  mounted() {
    if (this.getJsUrl("userId")) {
      sessionStorage.setItem("userid", this.getJsUrl("userId"));
    }
    if (this.getJsUrl("role")) {
      sessionStorage.setItem("role", this.getJsUrl("role"));
    }
  },
  methods: {
    getDepart() {
      //获取组织关系
      this.$http({
        method: "get",
        url: "/common/depart"
      }).then(res => {
        // let d = JSON.parse(JSON.stringify(res.data));
        sessionStorage.setItem("depart", JSON.stringify(res.data));
        // let c = this.getTreeDic('',d,1);
        // this.tableData=c;
        // this.$refs.list.setCurrentRow(this.tableData[0]);
      });
    },
    getJsUrl(name) {
      var pos, str, para, url;
      str = document.referrer;
      url = str.split("?")[1];
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      if (url != null && url.toString().length > 1) {
        var r = url.match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      }
    }
  }
};
</script>
<style lang="less" scoped>
// @import '//at.alicdn.com/t/font_1832696_4cwetrybfbr.css'
</style>

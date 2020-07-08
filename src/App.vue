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
  beforeCreate() {
    if (!localStorage.getItem("cityAllTree")) {
      this.$http({
        method: "get",
        url: "/so/area/all"
      }).then(res => {
        let d = JSON.parse(JSON.stringify(res.data));
        let c = this.toTree(d,'areaId','pid');
        localStorage.setItem("cityAllTree", JSON.stringify(c));
      });
    }
    if (!sessionStorage.getItem("cityTree")) {
      this.$http({
        method: "get",
        url: "/so/area/server"
      }).then(res => {
        sessionStorage.setItem("cityTree", JSON.stringify(res.data));
      });
    }
  },
  created() {
    // console.log(this.getJsUrl('userId'))
    if(!sessionStorage.getItem('depart')){
      this.getDepart();
    }
  },
  updated() {
    //默认选中第一项
  },
  mounted() {
    if (this.getParam("userid")) {
      // sessionStorage.setItem("userid", this.getJsUrl("userId"));
      sessionStorage.setItem("userid", this.getParam("userid"));
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
        let c = this.toTree(res.data,'depCode','pid');
        sessionStorage.setItem("depart", JSON.stringify(c));
        
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
    },
    getParam(name) {
      //获取参数
      var url = window.location.search; //获取问号之后的字0符
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      if (url != null && url.toString().length > 1) {
        var r = url.substr(1).match(reg);
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

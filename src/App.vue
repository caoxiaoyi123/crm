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
    this.getDepart()
  },
  updated() {
    //默认选中第一项
  },
  mounted() {},
  methods: {
    getDepart(){//获取组织关系
        this.$http({
            method:'get',
            url:'/common/depart'
        }).then(res=>{
            // let d = JSON.parse(JSON.stringify(res.data));
            sessionStorage.setItem('depart',JSON.stringify(res.data));
            // let c = this.getTreeDic('',d,1);
            // this.tableData=c;
            // this.$refs.list.setCurrentRow(this.tableData[0]);
        })
    },
  }
};
</script>
<style lang="less" scoped>
// @import '//at.alicdn.com/t/font_1832696_4cwetrybfbr.css'
</style>

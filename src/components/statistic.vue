<!-- 模型： DOM 结构 -->
<template>
  <div class="statistic">
    <div class="drc fs13">
      <b class="mr15"
        >回款金额：<font class="red-txt">{{ summary["回款"] }}</font
        >万</b
      >
      <b class="mr15"
        >甲方数量：<font class="red-txt">{{ summary["甲方数量"] }}</font
        >个</b
      >
      <b class="mr15"
        >签约金额：<font class="red-txt">{{ summary["签约"] }}</font
        >万</b
      >
      <!-- <b class="mr15" v-for="(val,key,i) in summary1" :key="i">{{key}}：<font class="red-txt">{{val}}</font>万</b> -->
      <el-popover placement="bottom" trigger="manual" v-model="visible">
        <span class="draw-tit cp" style="display: inline-block;" @click="visible = !visible" slot="reference">
          <template v-if="visible">
            关闭查看
            <i class="el-icon-d-arrow-right draw-tit rotate270 "></i>
          </template>
          <template v-else>
            查看全部
            <i class="el-icon-d-arrow-right draw-tit rotate90"></i>
          </template>
        </span>
        <div class="content-box">
          <b
            >内部验收：<font class="red-txt">{{ summary["内部验收"] }}</font
            >张</b
          >
          <b
            >培训证明：<font class="red-txt">{{ summary["培训证明"] }}</font
            >张</b
          >
          <b
            >外部验收：<font class="red-txt">{{ summary["外部验收"] }}</font
            >张</b
          >
          <b
            >客户好评：<font class="red-txt">{{ summary["客户好评"] }}</font
            >个</b
          >
          <b
            >客户回访：<font class="red-txt">{{ summary["客户回访"] }}</font
            >次</b
          >
          <b
            >硬件安装验收：<font class="red-txt">{{
              summary["硬件安装验收"]
            }}</font
            >张</b
          >
          <!-- <b class="mr15" v-for="(val,key,i) in summary0" :key="i">{{key}}：<font class="red-txt">{{val}}</font>张</b> -->
        </div>
      </el-popover>
    </div>
  </div>
</template>
<script>
export default {
  name: "statistic", // 结构名称
  data() {
    return {
      // 数据模型a
      summary: {}, //销售支撑统计
      visible: false,
      userId: null
    };
  },
  watch: {
    // 监控集合
  },
  props: {
    // 集成父级参数
    planid:{
      default: ""
    },
    responsibleId:{
      default: ""
    },
    ppid:{
      default:''
    }
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    if(!this.$route.query.id){
      this.id=sessionStorage.getItem('plandetailid')
    }else{
      this.id = this.$route.query.id;
    }
    if(this.responsibleId){
      this.userId=this.responsibleId
    }else{
      if (sessionStorage.getItem("userid")) {
        this.userId = sessionStorage.getItem("userid");
      } else {
        this.userId = "3A27BD25-8567-479D-9D96-1BA7BBEC5F0E"; //当前用户id
      }
    }
    this.getCount();
  },
  beforeMount() {
    // console.group('挂载前状态  ===============》beforeMount');
  },
  mounted() {
    // console.group('挂载结束状态===============》mounted');
    this.$nextTick(function() {
      // console.log('执行完后，执行===============》mounted');
    });
  },
  beforeUpdate() {
    // console.group('更新前状态  ===============》beforeUpdate');
  },
  updated() {
    // console.group('更新完成状态===============》updated');
  },
  beforeDestroy() {
    // console.group('销毁前状态  ===============》beforeDestroy');
  },
  destroyed() {
    // console.group('销毁完成状态===============》destroyed');
  },
  methods: {
    // 方法 集合
    getCount(){
      if(this.ppid){
        this.id=this.ppid;
      }
      this.$http({
        method: "get",
        url: "/sv/plan/support/planSummary",
        params: {
          ppid: this.id,
          responsibleId: this.userId,
        }
      }).then(res => {
        if (res.succ) {
          this.summary = res.data;
        }
      });
      // this.$http({
      //   method: "get",
      //   url: "/sv/plan/support/summary",
      //   params: {
      //     planId: this.id,
      //     responsibleId: this.userId,
      //     supType: 0
      //   }
      // }).then(res => {
      //   if (res.succ) {
      //     this.summary0 = res.data;
      //   }
      // });
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.rotate90 {
  transform: rotate(90deg);
}
.rotate270 {
  transform: rotate(-90deg);
}
.content-box {
  display: grid;
  grid-template-columns: repeat(3, 125px);
  grid-template-rows: repeat(2, 50%);
  // justify-items:center;
}
</style>

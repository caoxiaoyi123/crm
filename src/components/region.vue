<!-- 模型： DOM 结构 -->
<template>
  <div class="region">
    <el-cascader
      ref="region"
      placeholder="请选择所属地区"
      v-model="value"
      :options="options"
      @change="handleChange"
      :props="{ label: 'areaName', value: 'areaId', checkStrictly: true }"
      :separator="'-'"
      :clearable="true"
    ></el-cascader>
  </div>
</template>
<script>
export default {
  name: "region", // 结构名称
  data() {
    return {
      // 数据模型
      value: [],
      options: []
    };
  },
  watch: {
    // 监控集合
    region(val, old) {
      if (val == "") {
        this.value = "";
      } else {
        this.value = val;
      }
    }
  },
  props: {
    // 集成父级参数
    region: {
      default: ""
    }
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    let city = JSON.parse(localStorage.getItem("cityAllTree"));
    this.options = city;
    // if(this.region&&this.region!=''){
    //     let arr=this.region.split('-',3);
    //     arr.map(item=>{
    //         item+'-'
    //     })
    //     this.value=arr
    // }
    this.value = this.region;
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
    handleChange() {
      this.$refs.region.dropDownVisible =false//选中后隐藏下拉框
      let d = JSON.parse(JSON.stringify(this.value));
      d = this.value[this.value.length - 1];
      console.log(d);
      let data = {
        regionVal: d
      };
      this.$emit("regionChange", data);
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped></style>

<!-- 模型： DOM 结构 -->
<template>
  <div class="drawer">
    <el-drawer
      :close-on-press-escape="false"
      :wrapperClosable="false"
      :visible.sync="d"
      :modal-append-to-body="false"
      :size="drawerW"
      :show-close="true"
      :withHeader="false"
      :destroy-on-close="true"
      :append-to-body="isAppend"
      ref="drref"
    >
      <header>
        <font class="fs20 draw-tit">{{ title }}</font>
        <i class="el-icon-close cp" @click="closeFn"></i>
      </header>
      <section id="content-box">
        <slot></slot>
        <div
          class="btn-box mt30 text-r"
          :class="drawerW == '803px' ? 'fix' : ''"
        >
          <template v-if="readOnly">
            <button class="cancel-btn text-c fs14 cp" @click="closeFn">
              关闭
            </button>
          </template>
          <template v-else>
            <button class="cancel-btn mr30 text-c fs14 cp" @click="closeFn">
              取消
            </button>
            <button class="sure-btn text-c fs14 cp" @click="sumbitFn">
              确定
            </button>
          </template>
        </div>
      </section>
    </el-drawer>
  </div>
</template>
<script>
export default {
  name: "drawer", // 结构名称
  data() {
    return {
      // 数据模型
      d: false,
      isAppend: false
    };
  },
  watch: {
    // 监控集合
    drawer(val, old) {
      this.d = val;
    },
    d(val, old) {
      if (this.type == 0) {
        this.$parent.drawer = val;
      } else if (this.type == 2) {
        this.$parent.drawer2 = val;
      } else if (this.type == 3) {
        this.$parent.drawer3 = val;
      }
    }
  },
  props: {
    // 集成父级参数
    drawer: {
      default: false
    },
    title: {
      default: ""
    },
    drawerW: {
      default: "660px"
    },
    type: {
      default: 0
    },
    readOnly: {
      default: false
    }
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    if (this.title == "新建支撑") {
      this.isAppend = true;
    }
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
    if (this.readOnly && document.getElementById("content-box")) {
      document.getElementById("content-box").scrollTop = 0;
    }
  },
  beforeDestroy() {
    // console.group('销毁前状态  ===============》beforeDestroy');
  },
  destroyed() {
    // console.group('销毁完成状态===============》destroyed');
  },
  methods: {
    // 方法 集合
    closeFn() {
      // if(this.drawerW=='803px'){
      // this.$parent.drawer=false
      // }else{
      this.$refs.drref.closeDrawer();
      this.$emit('closeFn');
      // }
    },
    sumbitFn() {
      this.$emit("submitFn");
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
header {
  padding: 20px;
  position: relative;
  i {
    position: absolute;
    top: 15px;
    right: 15px;
  }
}
section {
  max-height: calc(100vh - 90px);
  overflow-y: auto;
  padding: 0 35px;
  .btn-box {
    button {
      width: 62px;
      line-height: 32px;
      border: 1px solid #1989fa;
      border-radius: 4px;
      outline: none;
    }
    .cancel-btn {
      background: #fff;
      color: #1989fa;
    }
    .sure-btn {
      background: #1989fa;
      color: #fff;
    }
  }
  .fix {
    position: fixed;
    bottom: 0;
    width: 803px;
    background: #fff;
    margin: 0;
    line-height: 74px;
    right: 0;
    padding-right: 35px;
    box-sizing: border-box;
  }
}
</style>

<!-- 模型： DOM 结构 -->
<template>
  <div class="drawer">
    <el-drawer
      :close-on-press-escape="false"
      :wrapperClosable="false"
      :visible.sync="d"
      :modal-append-to-body="false"
      size="915px"
      :show-close="true"
      :withHeader="false"
      :destroy-on-close="true"
      ref="drref"
    >
      <header>
        <font class="fs20 draw-tit">反馈详情</font>
        <i class="el-icon-close cp" @click="closeFn"></i>
      </header>
      <section>
        <div class="dfrb content">
          <!-- 历史记录 -->
          <div class="main">
            <h5 class="tit-txt fs16 text-l">历史记录</h5>
            <div class="box bor">
              <p class="fs13 tit-txt" style="margin-bottom:17px">反馈记录</p>
              <ul class="record">
                <li class="mb10" v-for="(item, i) of recordList" :key="i">
                  <div class="tit-txt fs13">
                    <font
                      class="mr10"
                      :class="item.role == 'consumer' ? 'tr' : ''"
                      >!</font
                    >
                    {{ item.createtime }}
                    <b>[{{ item.status }}]</b>
                    {{ item.userName }}添加了反馈
                  </div>
                  <p class="fs12">{{ item.description }}</p>
                </li>
              </ul>
              <div class="btm-box bor-t pt20" v-if="!from">
                <p class="fs13 tit-txt" style="margin-bottom:12px">相关文档</p>
                <ul>
                  <li
                    v-for="(item, i) of fileList"
                    :key="i"
                    class="fs12 bule-txt cp"
                    @click="previewFn(item)"
                  >
                    {{ item.fileName }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="main">
            <h5 class="tit-txt fs16 text-l">当前反馈</h5>
            <div class="box bor">
              <p class="fs13 tit-txt">我要反馈</p>
              <textarea
                placeholder="请详细填写反馈内容，该内容会同步展示给服务提出人，请谨慎填写！"
                v-model="fromData.description"
                class="fs13 bor mb10"
              ></textarea>
              <el-form @submit.native.prevent>
                <el-form-item label="相关文档" label-width="75px" v-if="!from">
                  <v-upload :fileData="file"></v-upload>
                </el-form-item>
                <el-form-item label="服务类型" label-width="75px" v-else>
                  <el-select
                    placeholder="请选择服务类型"
                    v-model="fromData.type"
                    style="width:250px"
                  >
                    <el-option
                      v-for="item in typeList"
                      :key="item"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="处理阶段" label-width="75px">
                  <button
                    v-for="(item, i) of btnList"
                    :key="i"
                    class="status-btn fs12 mr10 cp"
                    :class="item == btnTxt ? 'active' : ''"
                    @click="btnTxt = item"
                  >
                    {{ item }}
                  </button>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="btn-box mt30 text-r">
          <button class="cancel-btn mr30 text-c fs14 cp" @click="closeFn">
            取消
          </button>
          <button class="sure-btn text-c fs14 cp" @click="sumbitFn">
            保存
          </button>
        </div>
      </section>
    </el-drawer>
  </div>
</template>
<script>
import {
  baseUrl //引入baseUrl
} from "../../config/env";
import upload from "@/components/upload";
export default {
  name: "drawer", // 结构名称
  data() {
    return {
      // 数据模型
      d: false,
      recordList: [],
      fileList: null,
      file: {
        data: {
          id: null,
          type: 13,
          uploadType: "server",
          userId: null
        },
        list: []
      },
      typeList: [
        "售前交流",
        "平台配置",
        "售后培训",
        "硬件安装",
        "bug反馈",
        "操作指导",
        "功能优化",
        "新加功能",
        "回访客户",
        "好评反馈",
        "其他类型"
      ],
      btnList: ["进行中", "已处理"],
      btnTxt: "进行中",
      fromData: {}
    };
  },
  components: {
    "v-upload": upload
  },
  watch: {
    // 监控集合
    drawer(val, old) {
      this.d = val;
      this.file.data.id = this.$parent.comid;
      if (sessionStorage.getItem("userid")) {
        this.file.data.userId = sessionStorage.getItem("userid");
      } else {
        this.file.data.userId = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
      }
      this.file.id = null;
      this.fromData = new Object();
      this.getDetail();
    },
    d(val, old) {
      this.$parent.drawer1 = val;
    }
  },
  props: {
    // 集成父级参数
    drawer: {
      default: false
    },
    id: {
      default: ""
    },
    from: {
      default: false
    }
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    this.file.id = null;
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
    closeFn() {
      // this.$parent.drawer=false
      this.$refs.drref.closeDrawer();
    },
    sumbitFn() {
      let d = JSON.parse(JSON.stringify(this.fromData));
      d.fileId = this.file.id;
      d.problemid = this.id;
      d.projId = this.recordList[0].projId;
      if (sessionStorage.getItem("userid")) {
        d.userid = sessionStorage.getItem("userid");
      } else {
        d.userid = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
      }
      d.status = this.btnTxt;
      if (!d.description || d.description == "") {
        this.$message({
          message: "服务内容为必填项",
          type: "warning"
        });
        return false;
      }
      if (this.from) {
        if (!d.type || d.type == "") {
          this.$message({
            message: "服务类型为必填项",
            type: "warning"
          });
          return false;
        }
      }
      this.$http({
        method: "post",
        url: "/so/problem/saveFeedback",
        data: d
      }).then(res => {
        if (res.succ) {
          this.$message({
            title: "成功",
            message: res.data,
            type: "success"
          });
          this.file.list = []; //置空
          this.d = false;
          this.$parent.ajax();
        }
      });
    },
    previewFn(row) {
      if (row.servFileType == "company" || row.servFileType == "server") {
        if (
          row.fileType.toLocaleLowerCase() == ".ppt" ||
          row.fileType.toLocaleLowerCase() == ".pptx" ||
          row.fileType.toLocaleLowerCase() == ".doc" ||
          row.fileType.toLocaleLowerCase() == ".docx" ||
          row.fileType.toLocaleLowerCase() == ".pdf"
        ) {
          this.openPdf(baseUrl + "/so/file/view?fileId=" + row.fileId);
        } else {
          this.openLink(baseUrl + "/so/file/view?fileId=" + row.fileId);
        }
      } else {
        this.openLink(row.fileAddress);
      }
    },
    getDetail() {
      this.$http({
        method: "post",
        url: "/so/problem/feedbackDetail",
        data: {
          id: this.id
        }
      }).then(res => {
        if (res.succ) {
          this.recordList = JSON.parse(JSON.stringify(res.data.list));
          this.fileList = JSON.parse(JSON.stringify(res.data.withDoc));
        }
      });
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
  max-height: calc(100vh - 140px);
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
  .content {
    .main {
      width: 47%;
      .box {
        padding: 15px;
        border-radius: 4px;
        margin-top: 5px;
        padding-bottom: 20px;
        .record {
          font {
            display: inline-block;
            width: 15px;
            line-height: 15px;
            border-radius: 50%;
            background: #1989fa;
            color: #fff;
            text-align: center;
          }
          .tr {
            background: #f7aa12;
            transform: rotateX(180deg);
          }
          p {
            margin-top: 5px;
            padding-left: 28px;
          }
        }
        textarea {
          padding: 10px;
          width: 100%;
          box-sizing: border-box;
          height: 115px;
          border-radius: 4px;
          margin-top: 15px;
          resize: none;
          outline: none;
        }
        .status-btn {
          width: 50px;
          text-align: center;
          line-height: 25px;
          background: rgba(103, 194, 58, 0.1);
          border: 1px solid #67c23a;
          color: #67c23a;
          border-radius: 4px;
          outline: none;
        }
        .active {
          background: #eff7fe;
          border: 1px solid #1989fa;
          color: #1989fa;
        }
      }
    }
  }
}
</style>

<!-- 模型： DOM 结构 -->
<template>
  <div class="file">
    <div class="head-box drc">
      <span class="drc cp mr20" v-if="isshow" @click="upFn">
        <i class="icon icon-sc"></i>
        <font class="fs13">上传</font>
      </span>
    </div>
    <div class="table-box">
      <el-table
        cell-class-name="fs13 table-h"
        header-cell-class-name="table-header table-h"
        border
        height="calc(65vh - 199px)"
        :data="tableData"
        style="width:100%"
      >
        <el-table-column
          align="center"
          class-name="serial-num"
          width="50"
          label="序号"
          type="index"
        ></el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="文档名称"
          prop="fileName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="上传人"
          prop="userName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="上传时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column align="center" label="预览">
          <template slot-scope="scope">
            <span @click="previewFn(scope.row)" class="cp draw-tit">预览</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <v-drawer :title="'上传'" :drawer="drawer">
      <el-form
        :model="fromData"
        ref="fromData"
        label-width="80px"
        size="medium"
        @submit.native.prevent
      >
        <el-form-item label="文档名称" prop="fileName">
          <el-input
            placeholder="请输入文档名称"
            :disabled="disabled"
            v-model="fromData.fileName"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传附件">
          <el-upload
            ref="upload"
            :action="baseUrl + '/so/file/upload'"
            :show-file-list="false"
            :multiple="false"
            :on-success="sucFn"
            :on-error="upLoadfn.uploadErrFn"
            :limit="1"
            :on-exceed="upLoadfn.uploadExcFn"
            :data="fromData"
            :before-upload="beforeAvatarUpload"
          >
            <button
              :disabled="disabled"
              class="fs12 text-c cp upload-btn"
              :class="disabled ? 'ban' : ''"
            >
              {{ btnTxt }}
            </button>
          </el-upload>
        </el-form-item>
      </el-form>
    </v-drawer>
  </div>
</template>
<script>
import {
  baseUrl //引入baseUrl
} from "../../../config/env";
export default {
  name: "file", // 结构名称
  data() {
    return {
      // 数据模型a
      drawer: false,
      tableData: [],
      isshow: false,
      fromData: {
        id: null,
        fileName: null,
        uploadType: "company",
        userId: null
      },
      baseUrl: baseUrl,
      btnTxt: "点击上传",
      disabled: false
    };
  },
  watch: {
    // 监控集合
    comid: function(val, old) {
      if (val != "") {
        this.isshow = true;
        this.fromData.fileName = "";
        if (sessionStorage.getItem("userid")) {
          this.fromData.userId = sessionStorage.getItem("userid");
        } else {
          this.fromData.userId = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
        }
        this.fromData.id = this.comid;
        this.ajax();
      } else {
        this.isshow = false;
        this.tableData.splice(0);
      }
    }
  },
  props: {
    // 集成父级参数
    comid: {
      default: ""
    }
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    if (this.comid != "") {
      this.ajax();
      this.fromData.id = this.comid;
      this.isshow = true;
    }
    if (sessionStorage.getItem("userid")) {
      this.fromData.userId = sessionStorage.getItem("userid");
    } else {
      this.fromData.userId = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
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
  },
  beforeDestroy() {
    // console.group('销毁前状态  ===============》beforeDestroy');
  },
  destroyed() {
    // console.group('销毁完成状态===============》destroyed');
  },
  methods: {
    // 方法 集合
    ajax() {
      this.tableData.splice(0);
      this.$http({
        method: "post",
        data: {
          comId: this.comid
        },
        url: "/so/file/list"
      }).then(res => {
        this.tableData = res.data.list;
        this.isUpload = res.data.isUpload;
      });
    },
    upFn() {
      if (this.isUpload) {
        this.upLoadfn.uploadExcFn();
      } else {
        this.drawer = true;
      }
    },
    previewFn(row) {
      if (row.servFileType == "company" || row.servFileType == "server") {
        if (
          row.fileType.toLocaleLowerCase() == ".ppt" ||
          row.fileType.toLocaleLowerCase() == ".doc" ||
          row.fileType.toLocaleLowerCase() == ".docx" ||
          row.fileType.toLocaleLowerCase() == ".pdf" ||
          row.fileType.toLocaleLowerCase() == ".pptx"
        ) {
          this.openPdf(baseUrl + "/so/file/view?fileId=" + row.fileId);
        } else {
          this.openLink(baseUrl + "/so/file/view?fileId=" + row.fileId);
        }
      } else {
        this.openLink(row.fileAddress);
      }
    },
    sucFn(response, file, fileList) {
      if (response.succ) {
        this.upLoadfn.uploadSucFn();
        this.$refs.upload.clearFiles();
        this.btnTxt = "点击上传";
        this.disabled = false;
        this.drawer = false;
        this.ajax();
      } else {
        this.$message({
          message: response.msg,
          type: "warning"
        });
      }
    },
    beforeAvatarUpload(file) {
      this.btnTxt = "上传中";
      this.disabled = true;
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message({
          message: "上传附件大小不能超过 20MB!",
          type: "warning"
        });
        this.btnTxt = "点击上传";
        this.disabled = false;
        return false;
      }
      return isLt2M;
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.head-box {
  height: 40px;
  i {
    margin-right: 5px;
  }
}
.el-form /deep/ .el-form-item__label {
  font-size: 13px;
  color: #5a5e66;
}
</style>

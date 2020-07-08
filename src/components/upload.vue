<!-- 模型： DOM 结构 -->
<template>
  <div class="upload">
    <el-upload
      ref="file"
      :action="baseUrl + '/so/file/upload'"
      :show-file-list="true"
      list-type="text"
      :multiple="false"
      :on-success="suncfn"
      :on-error="upLoadfn.uploadErrFn"
      :limit="1"
      :on-exceed="upLoadfn.uploadExcFn"
      :data="fileData.data"
      :file-list="fileData.list"
      :on-preview="previewFn"
      :on-remove="removeFn"
      :before-upload="beforeAvatarUpload"
    >
      <button
        class="fs12 text-c cp upload-btn"
        :disabled="disabled"
        :class="disabled ? 'ban' : ''"
      >
        上传文件
      </button>
    </el-upload>
  </div>
</template>
<script>
import { baseUrl } from "../../config/env"; //引入baseUrl
export default {
  name: "upload", // 结构名称
  data() {
    return {
      // 数据模型
      baseUrl: baseUrl,
      disabled: false
    };
  },
  watch: {
    // 监控集合
  },
  props: {
    // 集成父级参数
    fileData: {
      default: {}
    }
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
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
    suncfn(res, file, fileList) {
      this.$refs.file.clearFiles();
      this.disabled = false;
      if (res.succ) {
        this.upLoadfn.uploadSucFn();
        this.fileData.list.push(file);
        this.fileData.id = res.data.id;
      } else {
        this.$message({
          message: res.msg,
          type: "warning"
        });
      }
    },
    previewFn(file) {
      let str = file.name.substr(file.name.lastIndexOf("."));
      if (
        str == ".ppt" ||
        str == ".doc" ||
        str == ".docx" ||
        str == ".pdf" ||
        str == ".pptx"
      ) {
        this.openPdf(
          baseUrl +
            "/so/file/view?fileId=" +
            this.fileData.id +
            "&fileName=" +
            this.fileData.list[0].name
        );
      } else {
        this.openLink(baseUrl + "/so/file/view?fileId=" + this.fileData.id);
      }
    },
    removeFn() {
      this.fileData.id = null;
      this.fileData.list = [];
    },
    beforeAvatarUpload(file) {
      this.disabled = true;
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        this.$message({
          message: "上传附件大小不能超过 20MB!",
          type: "warning"
        });
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
.upload /deep/ .el-upload--text {
  margin-right: 27px;
}
.upload > div {
  display: flex;
  align-items: center;
  max-width: 600px;
}
.upload /deep/ .el-upload-list {
  width: calc(100% - 95px);
}
.upload /deep/ .el-upload-list__item {
  margin-top: 0;
}
.upload /deep/ .el-upload-list__item .el-progress {
  display: none;
}
</style>

<!-- 模型： DOM 结构 -->
<template>
  <div class="file">
    <div class="head-box drc">
      <span class="drc cp mr20 hover-color" v-if="isshow" @click="upFn">
        <i class="icon iconfont iconshangchuan"></i>
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
          width="60"
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
    <v-drawer :title="'上传'" :drawer="drawer" @submitFn="submitFn">
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
            :maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="上传附件">
          <v-upload :fileData="fileData" :type="'file'"></v-upload>
          <!-- <el-upload
            ref="upload"
            :action="baseUrl + '/so/file/upload'"
            :show-file-list="true"
            :multiple="false"
            :on-success="sucFn"
            :on-error="errorFn"
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
          </el-upload> -->
        </el-form-item>
      </el-form>
    </v-drawer>
  </div>
</template>
<script>
import {
  baseUrl //引入baseUrl
} from "../../../config/env";
import upload from "@/components/upload";
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
      disabled: false,
      fileid:null,
      fileData:{
        data:{
          id: null,
          fileName: null,
          uploadType: "company",
          userId: null
        },
        list:[],
      }
    };
  },
  watch: {
    // 监控集合
    comid: function(val, old) {
      if (val != "") {
        this.isshow = true;
        this.fileData.data.fileName = "";
        if (sessionStorage.getItem("userid")) {
          this.fileData.data.userId = sessionStorage.getItem("userid");
        } else {
          this.fileData.data.userId = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
        }
        this.fileData.data.id = this.comid;
        this.ajax();
      } else {
        this.isshow = false;
        this.tableData.splice(0);
      }
    }
  },
  components: {
    "v-upload": upload
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
      this.fileData.data.id = this.comid;
      this.isshow = true;
    }
    if (sessionStorage.getItem("userid")) {
      this.fileData.data.userId = sessionStorage.getItem("userid");
    } else {
      this.fileData.data.userId = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
    }
    // this.fileData.data=JSON.stringify(JSON.parse(this.fromData));
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
      // if (this.isUpload) {
        // this.upLoadfn.uploadExcFn();
      // } else {
        this.drawer = true;
        this.fileData.list=[];
        this.fromData.fileName='';
        this.fileData.id=null;
      // }
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
          this.openPdf(
            baseUrl +
              "/so/file/view?fileId=" +
              row.fileId +
              "&fileName=" +
              row.fileName
          );
        } else {
          this.openLink(baseUrl + "/so/file/view?fileId=" + row.fileId);
        }
      } else {
        this.openLink(row.fileAddress);
      }
    },
    submitFn(){
      if(!this.fileData.id){
        this.$message({
          message:'请先上传文件',
          type: "warning"
        })
        return false
      }
      this.$http({
        method:'post',
        url:'/so/company/saveFile',
        data:{
          comId:this.fileData.data.id,
          fileId:this.fileData.id,
          userId:this.fileData.data.userId,
          fileName:this.fromData.fileName
        }
      }).then(res=>{
        if(res.succ){
          this.drawer = false;
          this.fromData.fileName = "";
          this.fileData.id=null;
          this.ajax();
        }
      })
      
    },
    // sucFn(response, file, fileList) {
    //   this.btnTxt = "点击上传";
    //   this.disabled = false;
    //   this.$refs.upload.clearFiles();
    //   if (response.succ) {
    //     this.fileid=response.data.resId;
    //     this.upLoadfn.uploadSucFn();
    //     // this.drawer = false;
    //     // this.ajax();
    //   } else {
    //     this.$message({
    //       message: response.msg,
    //       type: "warning"
    //     });
    //   }
    // },
    // beforeAvatarUpload(file) {
    //   this.btnTxt = "上传中";
    //   this.disabled = true;
    //   const isLt2M = file.size / 1024 / 1024 < 20;
    //   if (!isLt2M) {
    //     this.$message({
    //       message: "上传附件大小不能超过 20MB!",
    //       type: "warning"
    //     });
    //     this.btnTxt = "点击上传";
    //     this.disabled = false;
    //     return false;
    //   }
    //   return isLt2M;
    // },
    // errorFn() {
    //   this.btnTxt = "点击上传";
    //   this.disabled = false;
    //   this.upLoadfn.uploadErrFn;
    // }
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
</style>

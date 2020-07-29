<!-- 模型： DOM 结构 -->
<template>
  <div class="contract">
    <div class="table-box">
      <el-table
        height="calc(65vh - 159px)"
        cell-class-name="fs13 table-h"
        header-cell-class-name="table-header table-h"
        border
        :data="tableData"
        style="width:100%"
      >
        <el-table-column
          align="center"
          class-name="serial-num"
          width="60px"
          label="序号"
          type="index"
        ></el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="合同编号"
          width="120"
          prop="contractNo"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.contractNo" placement="right">
              <span class="clamp-2">
                {{ scope.row.contractNo }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="签订时间"
          width="120"
          prop="confirmDate"
        ></el-table-column>
        <el-table-column align="center" label="区域" width="80" prop="province">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.province" placement="right">
              <span class="text-over">
                {{ scope.row.province }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="销售姓名"
          width="90"
          prop="userName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="收入类型"
          width="125"
          prop="incomeType"
        ></el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="业主单位/甲方"
          width="235"
          prop="comName"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.comName" placement="right">
              <span class="clamp-2">
                {{ scope.row.comName }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="项目名称"
          width="220"
          prop="projName"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.projName" placement="right">
              <span class="clamp-2">
                {{ scope.row.projName }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="合同单位"
          width="230"
          prop="contractUnit"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.contractUnit" placement="right">
              <span class="clamp-2">
                {{ scope.row.contractUnit }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="上传人"
          width="80"
          prop="createName"
        ></el-table-column>
        <el-table-column
          align="right"
          header-align="center"
          label="金额"
          width="90"
          prop="amount"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.amount">{{ scope.row.amount }}万</span>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          header-align="center"
          label="回款"
          width="90"
          prop="receivedPayments"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.receivedPayments">{{ scope.row.receivedPayments }}万</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="是否开发票"
          width="120"
          prop="isTicket"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isTicket == 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="合同" width="90">
          <template slot-scope="scope">
            <span
              @click="previewFn(scope.row)"
              class="cp draw-tit"
              v-if="scope.row.fileId"
              >查看</span
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { baseUrl } from "../../../config/env"; //引入baseUrl
export default {
  name: "contract", // 结构名称
  data() {
    return {
      // 数据模型a
      tableData: []
    };
  },
  watch: {
    // 监控集合
    comid: function(val, old) {
      if (val != "") {
        this.ajax();
      } else {
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
      //this.comid
      this.tableData.splice(0);
      let that = this;
      this.$http({
        method: "post",
        data: {
          comId: this.comid
        },
        url: "/so/contract/list"
      }).then(res => {
        this.tableData = res.data.data;
      });
    },
    previewFn(row) {
      if (
        row.file.fileType.toLocaleLowerCase() == ".ppt" ||
        row.file.fileType.toLocaleLowerCase() == ".doc" ||
        row.file.fileType.toLocaleLowerCase() == ".docx" ||
        row.file.fileType.toLocaleLowerCase() == ".pdf" ||
        row.file.fileType.toLocaleLowerCase() == ".pptx"
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
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped></style>

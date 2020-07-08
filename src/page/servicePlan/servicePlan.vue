<!-- 模型： DOM 结构 -->
<template>
  <div class="servicePlan">
    <div class="top-box drc">
      <span class="drc mr20">
        <font class="fs13" style="margin-right:12px">计划类型</font>
        <el-select
          v-model="data.type"
          placeholder="请选择"
          size="small"
          style="width:122px"
          @change="dataTypeChange"
        >
          <el-option
            v-for="item in typeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </span>
      <span class="drc cp mr20 hover-color" @click="creatFn">
        <i class="icon iconfont iconxinjian"></i>
        <font class="fs13">新建</font>
      </span>
      <span
        class="drc cp mr20 hover-color"
        @click="editFn"
        v-if="tableData && tableData.length > 0"
      >
        <i class="icon iconfont iconbianji"></i>
        <font class="fs13">编辑</font>
      </span>
      <span
        class="drc cp hover-color"
        @click="deleteFn"
        v-if="tableData && tableData.length > 0"
      >
        <i class="el-icon-remove-outline"></i>
        <font class="fs13">删除</font>
      </span>
    </div>
    <div class="table-box">
      <el-table
        cell-class-name="fs13 table-h"
        @current-change="tableSelectFn"
        highlight-current-row
        header-cell-class-name="table-header table-h"
        border
        ref="list"
        height="calc(100vh - 175px)"
        :data="tableData"
        style="width:100%"
        v-loading="isajax"
        element-loading-text="数据正在加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column
          align="center"
          class-name="serial-num"
          width="50"
          label="序号"
          type="index"
          :index="indexFn"
        ></el-table-column>
        <el-table-column align="center" label="计划类型">
          <template slot-scope="scope">
            {{ scope.row.type | planType }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="责任人"
          prop="responsibleName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="指派人"
          prop="designeeName"
        ></el-table-column>
        <el-table-column align="center" label="起止时间">
          <template slot-scope="scope">
            {{
              scope.row.startDate ? scope.row.startDate.replace("-", "/") : ""
            }}-{{
              scope.row.endDate ? scope.row.endDate.replace("-", "/") : ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="计划项数"
          prop="detailTotal"
        ></el-table-column>
        <el-table-column align="center" label="附件">
          <template slot-scope="scope">
            <span
              @click="previewFn(scope.row)"
              class="cp draw-tit"
              v-if="scope.row.pubFileEntity"
              >查看</span
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="编辑">
          <template slot-scope="scope">
            <span @click="jump(scope.row)" class="cp draw-tit">添加计划</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box dfrcb">
        <span class="fs13">
          显示{{ (data.pageNo - 1) * data.pageSize + 1 }}到{{
            total > data.pageNo * data.pageSize
              ? data.pageNo * data.pageSize
              : total
          }}，共{{ total }}条记录
        </span>
        <el-pagination
          @current-change="pageNoChange"
          :current-page="data.pageNo"
          :page-size="data.pageSize"
          layout="prev,pager,next,jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <v-drawer :title="title" :drawer="drawer" @submitFn="submitFn">
      <el-form
        :model="fromData"
        label-width="80px"
        class="plan"
        ref="fromData"
        size="medium"
        @submit.native.prevent
      >
        <el-form-item label="计划类型">
          <el-select
            v-model="fromData.type"
            placeholder="请选择"
            size="small"
            @change="typeChange"
          >
            <el-option
              v-for="item in typeList1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止时间">
          <template v-if="fromData.type == 2">
            <el-date-picker
              v-model="timeValue"
              type="week"
              format="yyyy 第 WW 周"
              value-format="yyyy-MM-dd"
              placeholder="选择周"
            >
            </el-date-picker>
          </template>
          <template v-else-if="fromData.type == 1">
            <el-date-picker
              v-model="timeValue"
              type="month"
              value-format="yyyy-MM-dd"
              placeholder="选择月"
            >
            </el-date-picker>
          </template>
          <template v-else>
            <el-date-picker
              v-model="timeValue"
              type="year"
              value-format="yyyy-MM-dd"
              placeholder="选择年"
            >
            </el-date-picker>
          </template>
        </el-form-item>
        <el-form-item label="附件">
          <v-upload :fileData="fileData"></v-upload>
        </el-form-item>
      </el-form>
    </v-drawer>
  </div>
</template>
<script>
import upload from "@/components/upload";
import { baseUrl } from "../../../config/env"; //引入baseUrl
export default {
  name: "servicePlan", // 结构名称
  data() {
    return {
      // 数据模型a
      isajax: true,
      timeValue: "", //承载年月日
      typeList: [
        {
          label: "全部",
          value: 99
        },
        {
          label: "年计划",
          value: 0
        },
        {
          label: "月计划",
          value: 1
        },
        {
          label: "周计划",
          value: 2
        }
      ],
      typeList1: [
        {
          label: "年计划",
          value: 0
        },
        {
          label: "月计划",
          value: 1
        },
        {
          label: "周计划",
          value: 2
        }
      ],
      fileData: {
        data: {
          type: 14,
          uploadType: "plan",
          userId: null
        },
        list: []
      },
      drawer: false,
      fromData: {},
      fromObj: {},
      title: "",
      tableData: [],
      data: {
        type: 99,
        pageNo: 1,
        pageSize: 20,
        userId: null //当前用户id
      },
      total: 0
    };
  },
  components: {
    "v-upload": upload
  },
  watch: {
    // 监控集合
    timeValue(val, old) {
      if (val) {
        let start, end;
        let nowY = new Date(val).getFullYear();
        const oneD = 86400000;
        if (this.fromData.type == 0) {
          //年计划
          start = val;
          let nextY = nowY + 1;
          let nextStr = nextY + "-01-01";
          let nextTime = new Date(nextStr).getTime() - oneD;
          end = this.formatDate(nextTime);
        } else if (this.fromData.type == 1) {
          //月计划
          start = val;
          let nextM = new Date(val).getMonth() + 2;
          if (nextM < 10) {
            nextM = "0" + nextM;
          }
          let nextStr = nowY + "-" + nextM + "-01";
          let nextTime = new Date(nextStr).getTime() - oneD;
          end = this.formatDate(nextTime);
        } else if (this.fromData.type == 2) {
          //周计划
          let nowTimestr = new Date(val).getTime();
          start = this.formatDate(nowTimestr - oneD);
          let nextW = nowTimestr + 5 * oneD;
          end = this.formatDate(nextW);
        }
        this.fromData.startDate = start;
        this.fromData.endDate = end;
      } else {
        this.fromData.startDate = "";
        this.fromData.endDate = "";
      }
    },
    fileData: {
      deep: true,
      handler(val, old) {
        if (!val.id && val.list.length == 0) {
          if (this.fromData.planFile) {
            this.fromData.planFile = "";
          }
        }
      }
    }
  },
  filters: {
    planType(val) {
      if (val == 0) {
        return "年计划";
      } else if (val == 1) {
        return "月计划";
      } else if (val == 2) {
        return "周计划";
      }
    }
  },
  props: {
    // 集成父级参数
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    if (sessionStorage.getItem("userid")) {
      this.data.userId = sessionStorage.getItem("userid");
    } else {
      this.data.userId = "3A27BD25-8567-479D-9D96-1BA7BBEC5F0E"; //当前用户id
    }
    this.fileData.data.userId = this.data.userId;
    this.ajax();
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
      this.isajax = true;
      this.tableData.splice(0);
      let that = this;
      let d = this.data;
      this.$http({
        method: "get",
        params: d,
        url: "/sv/plan/main/list"
      }).then(res => {
        if (res.succ) {
          this.isajax = false;
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.$refs.list.setCurrentRow(this.tableData[0]);
        }
      });
    },
    indexFn(index) {
      let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
      return n;
    },
    creatFn() {
      let d = {};
      d.type = 2;
      this.fromData = JSON.parse(JSON.stringify(d));
      this.fileData.list = [];
      this.fileData.id = null;
      this.timeValue = this.formatDate(new Date());
      this.drawer = true;
      this.title = "新建计划";
      // if (this.$refs.fromData) {
      //     this.$refs.fromData.resetFields();
      // }
    },
    editFn() {
      this.fromData = JSON.parse(JSON.stringify(this.fromObj));
      if (this.fromData.planFile) {
        this.fileData.id = this.fromData.planFile;
        if (this.fromData.pubFileEntity) {
          let d = {
            name: this.fromData.pubFileEntity.fileName,
            status: "success",
            uid: new Date().getTime()
          };
          this.$set(this.fileData.list, 0, d);
        }
      } else {
        this.fileData.list = [];
        this.fileData.id = null;
      }
      this.timeValue = this.fromData.startDate;
      // if(this.fromData.type==0||this.fromData.type==1){
      //     this.timeValue=this.fromData.startDate
      // }else{
      //     let start=new Date(this.fromData.startDate).getTime();
      //     let t=start+86400000;
      //     this.timeValue=this.formatDate(t);
      // }
      this.drawer = true;
      this.title = "编辑计划";
    },
    deleteFn() {
      //删除组织
      this.$confirm("您确定删除该项吗？", "提示", {
        confirmButtonText: "删除",
        showClose: false,
        distinguishCancelAndClose: true,
        confirmButtonClass: "red-btn",
        cancelButtonClass: "cancel-btn"
      }).then(() => {
        this.$http({
          method: "get",
          params: {
            planId: this.fromObj.planId,
            userId: this.data.userId
          },
          url: "/sv/plan/main/delete"
        }).then(res => {
          if (res.succ) {
            this.$message({
              title: "成功",
              message: res.data,
              type: "success"
            });
            this.ajax();
          }
        });
      });
    },
    tableSelectFn(currentRow, oldCurrentRow) {
      //表格选中时
      if (currentRow) {
        let obj = JSON.parse(JSON.stringify(currentRow));
        this.fromObj = obj;
      }
    },
    previewFn(row) {
      if (
        row.pubFileEntity.fileType.toLocaleLowerCase() == ".ppt" ||
        row.pubFileEntity.fileType.toLocaleLowerCase() == ".doc" ||
        row.pubFileEntity.fileType.toLocaleLowerCase() == ".docx" ||
        row.pubFileEntity.fileType.toLocaleLowerCase() == ".pdf" ||
        row.pubFileEntity.fileType.toLocaleLowerCase() == ".pptx"
      ) {
        this.openPdf(
          baseUrl +
            "/so/file/view?fileId=" +
            row.pubFileEntity.fileId +
            "&fileName=" +
            row.pubFileEntity.fileName
        );
      } else {
        this.openLink(
          baseUrl + "/so/file/view?fileId=" + row.pubFileEntity.fileId
        );
      }
    },
    pageNoChange(val) {
      this.data.pageNo = val;
      this.ajax();
    },
    jump(row) {
      this.$router.push({
        path: "planDetailed",
        query: {
          type: row.type,
          id: row.planId
        }
      });
    },
    submitFn() {
      this.$refs.fromData.validate(valid => {
        if (valid) {
          if (!this.timeValue) {
            this.$message({
              message: "起止时间不得为空",
              type: "warning"
            });
            return false;
          }
          let d = JSON.parse(JSON.stringify(this.fromData));
          d.designeeId = this.data.userId;
          d.responsibleId = this.data.userId;
          if (this.fileData.id) {
            d.planFile = this.fileData.id;
          }
          for (let x in d) {
            if (x == "detailTotal") {
              delete d[x];
            }
            if (x == "responsibleName") {
              delete d[x];
            }
            if (x == "designeeName") {
              delete d[x];
            }
            if (x == "pubFileEntity") {
              delete d[x];
            }
          }
          this.$http({
            method: "post",
            url: "/sv/plan/main/update",
            data: d
          }).then(res => {
            if (res.succ) {
              this.$message({
                title: "成功",
                message: res.data,
                type: "success"
              });
              this.fileData.list = [];
              this.fileData.id = null;
              this.drawer = false;
              this.ajax();
            }
          });
        }
      });
    },
    typeChange() {
      this.timeValue = "";
    },
    dataTypeChange() {
      this.ajax();
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.servicePlan {
  .top-box {
    margin-bottom: 15px;
    .hover-color {
      i {
        margin-right: 5px;
      }
    }
  }
}
</style>

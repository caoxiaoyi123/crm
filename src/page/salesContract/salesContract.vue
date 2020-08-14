<!-- 模型： DOM 结构 -->
<template>
  <div class="salesContract">
    <div class="top-box dfrcb">
      <div class="drc">
        <font class="fs13">起止时间</font>
        <el-date-picker
          placeholder="请输入起止时间"
          @change="timeClick"
          v-model="timer"
          type="daterange"
          :editable="false"
          value-format="yyyy-MM-dd"
          range-separator="至"
          style="width:280px;margin:0 12px"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size="small"
        ></el-date-picker>
        <div class="comname-ipt" @keydown.13="keywordFn">
          <input
            type="text"
            v-model="data.keyword"
            placeholder="请输入关键字"
          />
          <i class="el-icon-search cp" slot="append" @click="keywordFn"></i>
        </div>
        <span class="drc cp mr20 operate hover-color" @click="creatFn">
          <i class="icon iconfont iconxinjian"></i>
          <font class="fs13">新建</font>
        </span>
        <span
          class="drc cp mr20 operate hover-color"
          @click="editFn"
          v-if="tableData && tableData.length > 0"
        >
          <i class="icon iconfont iconbianji"></i>
          <font class="fs13">编辑</font>
        </span>
        <span
          class="drc cp mr20 operate hover-color"
          @click="deleteFn"
          v-if="tableData && tableData.length > 0"
        >
          <i class="el-icon-remove-outline"></i>
          <font class="fs13">删除</font>
        </span>
        <span
          class="drc cp operate hover-color"
          @click="exportFn"
          v-if="tableData && tableData.length > 0"
        >
          <i class="icon iconfont icondaochu"></i>
          <font class="fs13">导出excel</font>
        </span>
      </div>
      <div class="drc fs13 blod">
        <span class="mr10"
          >合同数：<font class="red-txt">{{ count.total }}</font
          >份</span
        >
        <span class="mr10"
          >签约金额：<font class="red-txt">{{ count.amount }}</font
          >万</span
        >
        <span class="mr10"
          >回款金额：<font class="red-txt">{{ count.receivedPayments }}</font
          >万</span
        >
        <span
          >待回款金额：<font class="red-txt">{{ count.waitAmount }}</font
          >万</span
        >
      </div>
    </div>
    <div class="table-box">
      <el-table
        cell-class-name="fs13 table-h"
        @current-change="tableSelectFn"
        highlight-current-row
        header-cell-class-name="table-header table-h"
        border
        ref="list"
        height="calc(100vh - 125px)"
        :data="tableData"
        style="width:100%"
        v-loading="isajax"
        element-loading-text="数据正在加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column
          align="center"
          class-name="serial-num"
          width="60"
          label="序号"
          type="index"
          :index="indexFn"
        ></el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          min-width="120"
          label="合同编号"
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
          min-width="70"
          label="地区"
          prop="province"
          show-overflow-tooltip
        >
          <!-- <template slot-scope="scope">
            <el-tooltip :content="scope.row.province" placement="right">
              <span class="text-over">
                {{ scope.row.province }}
              </span>
            </el-tooltip>
          </template> -->
        </el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          label="签订时间"
          prop="confirmDate"
        ></el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          label="销售姓名"
          prop="userName"
        ></el-table-column>
        <el-table-column
          align="center"
          min-width="120"
          label="收入类型"
          prop="incomeType"
        ></el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          min-width="200"
          label="业主单位/甲方"
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
          min-width="200"
          header-align="center"
          label="项目名称"
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
          min-width="200"
          header-align="center"
          label="合同单位"
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
          align="right"
          header-align="center"
          min-width="100"
          label="金额"
          prop="amount"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.amount">{{ scope.row.amount }}万</span>
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          header-align="center"
          min-width="100"
          label="回款"
          prop="receivedPayments"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.receivedPayments">{{ scope.row.receivedPayments }}万</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          label="是否开发票"
          prop="isTicket"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.isTicket == 1 ? "是" : "否" }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="50" label="合同">
          <template slot-scope="scope">
            <!-- <span @click="previewFn(scope.row)" class="cp draw-tit" v-if="scope.row.fileId">查看</span> -->
            <span
              @click="updownFn(scope.row)"
              class="cp draw-tit"
              v-if="scope.row.fileId"
              >下载</span
            >
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
        @submit.native.prevent
        :model="fromData"
        ref="fromData"
        label-width="90px"
        size="medium"
      >
        <div class="dfrb">
          <el-form-item
            label="合同编号"
            prop="contractNo"
            :rules="{ required: true, message: '合同编号不得为空' }"
          >
            <el-input
              :maxlength="25"
              placeholder="请输入合同编号"
              v-model="fromData.contractNo"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="签订时间"
            prop="confirmDate"
            :rules="{ required: true, message: '签订时间不得为空' }"
          >
            <el-date-picker
              v-model="fromData.confirmDate"
              type="date"
              value-format="yyyy-MM-dd"
              :editable="false"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="区域"
            prop="re"
            :rules="{ required: true, message: '区域不得为空' }"
          >
            <el-cascader
              placeholder="请选择区域"
              ref="cascader"
              style="width:202px"
              v-model="fromData.re"
              :options="options"
              @change="regionWacth"
              :props="{
                label: 'areaName',
                value: 'areaId',
                checkStrictly: true
              }"
              :separator="'-'"
              :clearable="true"
            ></el-cascader>
          </el-form-item>
          <el-form-item
            label="销售姓名"
            prop="userId"
            :rules="{ required: true, message: '销售姓名不得为空' }"
          >
            <!-- <el-input placeholder="请输入销售姓名" v-model="fromData.userName"></el-input> -->
            <el-select
              v-model="fromData.userId"
              placeholder="请选择销售姓名"
              style="width:202px"
              @change="userChange"
            >
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.userNickname"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="收入类型"
            prop="incomeType"
            :rules="{ required: true, message: '收入类型不得为空' }"
          >
            <el-select
              v-model="fromData.incomeType"
              placeholder="请选择收入类型"
              style="width:202px"
            >
              <el-option
                v-for="item in incomeList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="业主单位"
            prop="comId"
            :rules="{ required: true, message: '业主单位不得为空' }"
          >
            <el-select
              v-model="fromData.comId"
              filterable
              placeholder="请选择业主单位"
              @change="comChange"
            >
              <el-option
                v-for="item in comList"
                :key="item.comId"
                :label="item.comName"
                :value="item.comId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="项目名称"
            prop="projId"
            :rules="{ required: true, message: '项目名称不得为空' }"
          >
            <el-select
              v-model="fromData.projId"
              placeholder="请选择项目名称"
              style="width:202px"
            >
              <el-option
                v-for="item in projectList"
                :key="item.projId"
                :label="item.projName"
                :value="item.projId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="合同单位"
            prop="contractUnit"
            :rules="{ required: true, message: '合同单位不得为空' }"
          >
            <el-input
              :maxlength="50"
              placeholder="请输入合同单位"
              v-model="fromData.contractUnit"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="金额(万)"
            prop="amount"
            :rules="[
              {
                pattern: /^\d{1,5}\.\d{1,2}$|^\d{1,5}$/,
                message: '金额最多5位，小数点后不超过2位',
                trigger: ['blur', 'change']
              },
              { required: true, message: '金额不得为空' }
            ]"
          >
            <el-input
              :maxlength="20"
              placeholder="请输入金额(万)"
              v-model="fromData.amount"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="回款(万)"
            prop="receivedPayments"
            :rules="{
              pattern: /^\d{1,5}\.\d{1,2}$|^\d{1,5}$/,
              message: '回款最多5位，小数点后不超过2位'
            }"
          >
            <el-input
              :maxlength="20"
              placeholder="请输入回款(万)"
              v-model="fromData.receivedPayments"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="是否开发票"
            prop="isTicket"
            :rules="{ required: true, message: '是否开发票不得为空' }"
          >
            <el-select v-model="fromData.isTicket" style="width:202px">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="上传合同"
            style="width:100%"
            :rules="{ required: true, message: '合同附件为必传' }"
          >
            <v-upload :fileData="fileData"></v-upload>
          </el-form-item>
        </div>
      </el-form>
    </v-drawer>
  </div>
</template>
<script>
import { baseUrl } from "../../../config/env"; //引入baseUrl
import upload from "@/components/upload";
export default {
  name: "salesContract", // 结构名称
  data() {
    return {
      // 数据模型a
      isajax: true,
      timer: "",
      userId: "", //当前用户id
      total: 0,
      data: {
        keyword: "",
        start: "",
        end: "",
        pageNo: 1,
        pageSize: 30
      },
      tableData: [],
      drawer: false,
      title: "",
      fromData: {
        isTicket: 1
      },
      fromObj: {},
      comList: [], //业主名称list
      projectList: [], //项目名称list
      //收入类型list
      incomeList: [
        "OA+门户网站",
        "档案管理",
        "房建",
        "河长/湖长",
        "河长/湖长/路长",
        "监管系统",
        "水利",
        "项目管理平台",
        "智慧工地",
        "智慧劳务",
        "地铁",
        "养护"
      ],
      options: [], //承载地区数组
      userList: [], //销售人员数组
      fileData: {
        data: {
          id: null,
          type: 7,
          uploadType: "contract",
          userId: null
        },
        list: []
      },
      count: {},
      isSave:true,
    };
  },
  components: {
    "v-upload": upload
  },
  watch: {
    // 监控集合
    fileData: {
      deep: true,
      handler(val, old) {
        // if(val.id){
        this.fromData.fileId = val.id;
        // }
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
    let city = JSON.parse(localStorage.getItem("cityAllTree"));
    if (sessionStorage.getItem("userid")) {
      this.userId = sessionStorage.getItem("userid");
    } else {
      this.userId = "3A27BD25-8567-479D-9D96-1BA7BBEC5F0E"; //当前用户id
    }
    this.fileData.data.userId = this.userId;
    this.options = city;
    this.ajax();
    this.getCount();
    // this.getComName();
    this.getUserList();
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
    indexFn(index) {
      let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
      if(n==1){
        return '1'
      }
      return n;
    },
    timeClick(val) {
      //时间监听
      this.data.pageNo = 1;
      if (val) {
        this.data.start = val[0];
        this.data.end = val[1];
      } else {
        this.data.start = "";
        this.data.end = "";
      }
      this.ajax();
      this.getCount();
    },
    keywordFn() {
      this.data.pageNo = 1;
      // this.total = 0;
      this.ajax();
      this.getCount();
    },
    creatFn() {
      //新建
      // this.fromData = new Object();
      let d = {
        isTicket: "1",
        confirmDate: this.formatDate(new Date())
      };
      this.fromData = JSON.parse(JSON.stringify(d));
      this.fileData.list = [];
      this.projectList = [];
      this.fileData.id = null;
      this.title = "新建合同";
      this.drawer = true;
      if (this.$refs.fromData) {
        this.$refs.fromData.resetFields();
      }
    },
    editFn() {
      //编辑
      if (this.$refs.fromData) {
        this.$refs.fromData.resetFields();
      }
      this.title = "编辑合同";
      this.fromData = JSON.parse(JSON.stringify(this.fromObj));
      this.getComName(this.fromData.userId);
      this.getProList(this.fromData.comId);
      this.fileData.id = this.fromData.fileId;
      let d = {
        name: this.fromData.file.fileName,
        status: "success",
        uid: new Date().getTime()
      };
      this.$set(this.fileData.list, 0, d);
      this.drawer = true;
    },
    exportFn() {
      let keyword='',start='',end='';
      if(this.data.keyword){
        keyword=this.data.keyword
      }
      if(this.data.start){
        start=this.data.start
      }
      if(this.data.end){
        end=this.data.end
      }
      //导出
      window.open(baseUrl + "/so/contract/download?keyword="+keyword+'&start='+start+'&end='+end, "_blank");
    },
    deleteFn() {
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
            contractId: this.fromObj.contractId
          },
          url: "/so/contract/del"
        }).then(res => {
          if (res.succ) {
            this.$message({
              title: "成功",
              message: res.data,
              type: "success"
            });
            this.data.pageNo=1;
            this.ajax();
            this.getCount();
          }
        });
      });
    },
    tableSelectFn(currentRow, oldCurrentRow) {
      //表格选中时
      if (currentRow) {
        let obj = JSON.parse(JSON.stringify(currentRow));
        obj.re = obj.contractRegion;
        obj.confirmDate = this.formatDate(obj.time);
        this.fromObj = obj;
      }
    },
    submitFn() {
      this.$refs.fromData.validate(valid => {
        if (valid) {
          if (!this.fromData.fileId) {
            this.$message({
              message: "请上传合同文件",
              type: "warning"
            });
            return false;
          }
          if(!this.isSave){
              return false
          }
          this.isSave=false
          let d = JSON.parse(JSON.stringify(this.fromData));
          for (let x in d) {
            if (x == "re") {
              delete d[x];
            }
          }
          d.creator = this.userId;
          // d.userId = this.userId;
          // if(this.fileData.id){
          //     d.fileId=this.fileData.id;
          // }
          this.$http({
            method: "post",
            url: "/so/contract/save",
            data: d
          }).then(res => {
            if (res.succ) {
              this.drawer = false;
              this.$message({
                title: "成功",
                message: res.data,
                type: "success"
              });
              this.fileData.list = [];
              this.fileData.id = null;
              this.isSave=true;
              this.ajax();
              this.getCount();
            }else{
              this.isSave=true;
            }
          });
        }
      });
    },
    regionWacth(p) {
      //监听地区组件返回的值
      this.$refs.cascader.dropDownVisible = false; //选中后隐藏下拉框
      let d = JSON.parse(JSON.stringify(this.fromData));
      if (this.fromData.re && this.fromData.re.length > 0) {
        d = this.fromData.re[this.fromData.re.length - 1];
        this.fromData.contractRegion = d;
      } else if (!this.fromData.re) {
        let arr = this.fromData.contractRegion.split("-");
        arr.pop();
        let arr1 = [];
        let str = "";
        arr.map(item => {
          str = str + item + "-";
          arr1.push(str);
        });
        this.fromData.re = arr1;
      }
    },
    ajax() {
      this.isajax = true;
      this.tableData.splice(0);
      let that = this;
      let d = this.data;
      this.$http({
        method: "post",
        data: d,
        url: "/so/contract/sales/list"
      }).then(res => {
        if (res.succ) {
          this.isajax = false;
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.$refs.list.setCurrentRow(this.tableData[0]);
        }
      });
    },
    updownFn(row) {
      this.openLink(baseUrl + "/so/file/download?fileId=" + row.fileId);
    },
    comChange(val) {
      this.getProList(val);
      let d = JSON.parse(JSON.stringify(this.fromData));
      d.projId = null;
      this.fromData = JSON.parse(JSON.stringify(d));
      // this.fromData.projId=null
    },
    userChange(val){
      this.getComName(val);
      let d = JSON.parse(JSON.stringify(this.fromData));
      d.comId = null;
      d.projId=null;
      this.fromData = JSON.parse(JSON.stringify(d));
    },
    getComName(val) {
      this.$http({
        method: "get",
        url: "/so/company/list",
        params: {
          userId:val
        }
      }).then(res => {
        this.comList = res.data;
      });
    },
    getProList(val) {
      this.$http({
        method: "post",
        url: "/so/project/comPrject/list",
        data: {
          comId: val
        }
      }).then(res => {
        this.projectList = JSON.parse(JSON.stringify(res.data));
      });
    },
    getCount() {
      let that = this;
      let d = this.data;
      this.$http({
        method: "post",
        url: "/so/contract/count",
        data: d
      }).then(res => {
        this.count = res.data;
      });
    },
    getUserList() {
      this.$http({
        method: "get",
        url: "/so/user/depart/list"
      }).then(res => {
        this.userList = res.data;
      });
    },
    pageNoChange(val) {
      this.data.pageNo = val;
      this.ajax();
      this.getCount();
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.salesContract {
  padding: 15px;
  .top-box {
    margin-bottom: 15px;
    .comname-ipt {
      width: 165px;
      margin-right: 15px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      padding: 0 15px;
      box-sizing: border-box;
      input {
        border: none;
        outline: none;
        height: 30px;
        line-height: 30px;
        width: calc(100% - 16px);
      }
    }
    .operate {
      i {
        margin-right: 5px;
      }
    }
  }
}
</style>

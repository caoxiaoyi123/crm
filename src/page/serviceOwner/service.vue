<!-- 模型： DOM 结构 -->
<template>
  <div class="service">
    <div class="head-box drc">
      <span class="drc mr20">
        <font class="fs13" style="margin-right:12px">项目名称</font>
        <el-select
          v-model="data.projId"
          placeholder="请选择"
          size="mini"
          style="width:250px"
          @change="selectChange"
        >
          <el-option
            v-for="item in projectList"
            :key="item.projId"
            :label="item.projName"
            :value="item.projId"
          ></el-option>
        </el-select>
      </span>
      <span class="drc cp mr20 hover-color" @click="creatFn" v-if="isshow">
        <i class="icon iconfont iconxinjian"></i>
        <font class="fs13">新建</font>
      </span>
      <span
        class="drc cp mr20 hover-color"
        @click="editFn"
        v-if="tableData && tableData.length > 0 && isoperation"
      >
        <i class="icon iconfont iconbianji"></i>
        <font class="fs13">编辑</font>
      </span>
      <span
        class="drc cp hover-color"
        @click="deleteFn"
        v-if="tableData && tableData.length > 0 && isoperation"
      >
        <i class="el-icon-remove-outline"></i>
        <font class="fs13">删除</font>
      </span>
    </div>
    <div class="table-box">
      <el-table
        ref="list"
        height="calc(65vh - 231px)"
        cell-class-name="fs13 table-h"
        header-cell-class-name="table-header table-h"
        border
        @current-change="tableSelectFn"
        highlight-current-row
        :data="tableData"
        style="width:100%"
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
          header-align="center"
          align="left"
          label="项目名称"
          prop="projName"
          width="250px"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.projName" placement="right">
              <span class="clamp-2">
                {{ scope.row.projName }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="销售人员">{{
          allotUserName
        }}</el-table-column>
        <el-table-column
          align="center"
          label="客户联系人"
          prop="contact"
        ></el-table-column>
        <el-table-column
          align="center"
          label="服务来源"
          prop="sourceFrom"
        ></el-table-column>
        <el-table-column
          align="center"
          label="服务类型"
          prop="type"
        ></el-table-column>
        <el-table-column
          align="center"
          label="服务人员"
          prop="person"
        ></el-table-column>
        <!-- <el-table-column align="center" label="服务时间" prop="createtime">
                    <template slot-scope="scope">
                        <span>{{formatDate(scope.row.createtime)}}</span>
                    </template>
                </el-table-column>-->
        <el-table-column
          align="center"
          label="服务时间"
          prop="serverTime"
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          label="服务内容"
          prop="description"
          width="250px"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.description" placement="right">
              <span class="clamp-2">
                {{ scope.row.description }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="处理阶段" prop="resStatus">
          <template slot-scope="scope">
            <span v-if="scope.row.resStatus == '未处理'" class="red-txt fs14"
              >待处理</span
            >
            <span
              v-else-if="scope.row.resStatus == '进行中'"
              class="yellow-txt fs14"
              >处理中</span
            >
            <span v-else class="green-txt fs14">{{ scope.row.resStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <span class="draw-tit cp fs14" @click="feedbackFn(scope.row)"
              >反馈</span
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="page-box dfrcb">
        <span class="fs13">
          显示{{
            total == 0 ? total : (data.pageNo - 1) * data.pageSize + 1
          }}到{{
            total > data.pageNo * data.pageSize
              ? data.pageNo * data.pageSize
              : total
          }}，共{{ total }}条记录
        </span>
        <div class="drc">
          <el-pagination
            @current-change="pageNoChange"
            :current-page="data.pageNo"
            :page-size="data.pageSize"
            layout="prev,pager,next,jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <v-drawer
      :title="title"
      :drawer="drawer"
      :drawerW="drawerW"
      @submitFn="submitFn"
    >
      <el-form
        :model="fromData"
        label-width="94px"
        ref="fromData"
        size="medium"
        @submit.native.prevent
      >
        <div class="dfrb">
          <el-form-item
            label="单位名称"
            :rules="{ required: true, message: '单位名称不得为空' }"
          >
            <el-input v-model="comName" disabled></el-input>
          </el-form-item>
          <el-form-item
            label="项目名称"
            prop="projId"
            :rules="{ required: true, message: '项目名称不得为空' }"
          >
            <el-select
              placeholder="请选择项目名称"
              v-model="fromData.projId"
              style="width:202px"
            >
              <el-option
                v-for="item in projectList1"
                :key="item.projId"
                :label="item.projName"
                :value="item.projId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="销售人员"
            :rules="{ required: true, message: '销售人员不得为空' }"
          >
            <el-input v-model="allotUserName" disabled></el-input>
          </el-form-item>
          <el-form-item
            label="客户联系人"
            prop="contact"
            :rules="{ required: true, message: '客户联系人不得为空' }"
          >
            <el-select
              v-model="fromData.contact"
              filterable
              placeholder="请选择客户联系人"
            >
              <el-option
                v-for="item in userNameList"
                :key="item.userId"
                :label="item.userNickname"
                :value="item.userNickname"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="服务来源"
            prop="sourceFrom"
            :rules="{ required: true, message: '服务来源不得为空' }"
          >
            <el-select
              placeholder="请选择服务来源"
              v-model="fromData.sourceFrom"
              style="width:202px"
            >
              <el-option
                v-for="item in sourceFromList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="服务类型"
            prop="type"
            :rules="{ required: true, message: '服务类型不得为空' }"
          >
            <el-select
              placeholder="请选择服务类型"
              v-model="fromData.type"
              style="width:202px"
            >
              <el-option
                v-for="item in typeList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item
          label="服务时间"
          prop="created"
          :rules="{ required: true, message: '服务时间不得为空' }"
        >
          <el-date-picker
            v-model="fromData.created"
            type="date"
            :editable="false"
            value-format="timestamp"
            placeholder="请选择服务时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          class="text-line"
          label="服务内容"
          prop="description"
          :rules="{ required: true, message: '服务内容不得为空' }"
        >
          <el-input
            placeholder="请输入服务内容"
            type="textarea"
            resize="none"
            v-model="fromData.description"
            maxlength="200"
          ></el-input>
        </el-form-item>
        <h4 class="bor-b mb20"></h4>
        <div class="dfrb">
          <el-form-item
            label="内部验收单"
            label-width="115px"
            style="width:100%"
          >
            <v-upload :fileData="file.nbys"></v-upload>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="硬件安装验收单"
            label-width="115px"
            style="width:100%"
          >
            <v-upload :fileData="file.yjaz"></v-upload>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="培训证明" label-width="115px" style="width:100%">
            <v-upload :fileData="file.pxzm"></v-upload>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="好评截图" label-width="115px" style="width:100%">
            <v-upload :fileData="file.hpjt"></v-upload>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="其他文件" label-width="115px" style="width:100%">
            <v-upload :fileData="file.qtwj"></v-upload>
          </el-form-item>
        </div>
      </el-form>
    </v-drawer>
    <v-d :drawer="drawer1" :id="id" :from="rowFrom"></v-d>
  </div>
</template>
<script>
import {
  baseUrl //引入baseUrl
} from "../../../config/env";
import drawer1 from "@/components/drawer1";
import upload from "@/components/upload";
export default {
  name: "service", // 结构名称
  data() {
    return {
      // 数据模型a
      projectList: [], //项目名称list
      projectList1: [],
      userNameList: [], //客户联系人list
      drawer: false,
      drawer1: false,
      id: "", //反馈问题id
      rowFrom: "", //反馈问题来源
      tableData: [],
      drawerW: "764px",
      title: "",
      fromData: {},
      fromObj: {},
      sourceFromList: ["微信", "QQ", "上门", "电话"], //服务来源list
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
      ], //服务类型list
      baseUrl: baseUrl,
      data: {
        comId: null,
        comName: null,
        pageNo: 1,
        pageSize: 10,
        projId: null
      },
      total: 0,
      isshow: false,
      isoperation: true,
      serverId: "", //选中服务项的id
      file: {
        nbys: {
          data: {
            id: null,
            type: 8,
            uploadType: "server",
            userId: null
          },
          list: []
        },
        yjaz: {
          data: {
            id: null,
            type: 9,
            uploadType: "server",
            userId: null
          },
          list: []
        },
        pxzm: {
          data: {
            id: null,
            type: 10,
            uploadType: "server",
            userId: null
          },
          list: []
        },
        hpjt: {
          data: {
            id: null,
            type: 11,
            uploadType: "server",
            userId: null
          },
          list: []
        },
        qtwj: {
          data: {
            id: null,
            type: 12,
            uploadType: "server",
            userId: null
          },
          list: []
        }
      },
      role: "",
      userId: ""
    };
  },
  components: {
    "v-d": drawer1,
    "v-upload": upload
  },
  watch: {
    // 监控集合
    comid: function(val, old) {
      if (val != "") {
        this.projectList = [];
        this.isshow = true;
        this.data.comId = val;
        this.data.comName = this.comName;
        this.data.pageNo = 1;
        this.ajax();
        this.getProList();
        this.getUserNameList();
      } else {
        this.isshow = false;
        // this.tableData.splice(0);
      }
    }
  },
  props: {
    // 集成父级参数
    comid: {
      default: ""
    },
    comName: {
      default: ""
    },
    allotUserName: {
      default: ""
    }
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    if (this.comid != "") {
      this.isshow = true;
      this.data.comId = this.comid;
      this.data.comName = this.comName;
      this.ajax();
      this.getProList();
      this.getUserNameList();
    }
    if (sessionStorage.getItem("role")) {
      this.role = sessionStorage.getItem("role");
    } else {
      this.role = "server";
    }
    if (sessionStorage.getItem("userid")) {
      this.userId = sessionStorage.getItem("userid");
    } else {
      this.userId = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
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
    indexFn(index) {
      let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
      return n;
    },
    pageNoChange(val) {
      this.data.pageNo = val;
      this.ajax();
    },
    feedbackFn(row) {
      this.id = row.id;
      this.drawer1 = true;
    },
    creatFn() {
      this.fromData = new Object();
      if (this.$refs.fromData) {
        this.$refs.fromData.resetFields();
      }
      this.fromData.created=new Date().getTime()
      let u = this.userId;
      this.file.nbys.data.userId = u;
      this.file.yjaz.data.userId = u;
      this.file.pxzm.data.userId = u;
      this.file.hpjt.data.userId = u;
      this.file.qtwj.data.userId = u;
      this.file.nbys.data.id = this.comid;
      this.file.yjaz.data.id = this.comid;
      this.file.pxzm.data.id = this.comid;
      this.file.hpjt.data.id = this.comid;
      this.file.qtwj.data.id = this.comid;
      this.file.nbys.list = [];
      this.file.yjaz.list = [];
      this.file.pxzm.list = [];
      this.file.hpjt.list = [];
      this.file.qtwj.list = [];
      this.drawerW = "764px";
      this.title = "新建服务记录";
      this.drawer = true;
    },
    editFn() {
      this.fromData = new Object();
      if (this.$refs.fromData) {
        this.$refs.fromData.resetFields();
      }
      let u = this.userId;
      this.file.nbys.data.userId = u;
      this.file.yjaz.data.userId = u;
      this.file.pxzm.data.userId = u;
      this.file.hpjt.data.userId = u;
      this.file.qtwj.data.userId = u;
      this.file.nbys.data.id = this.comid;
      this.file.yjaz.data.id = this.comid;
      this.file.pxzm.data.id = this.comid;
      this.file.hpjt.data.id = this.comid;
      this.file.qtwj.data.id = this.comid;
      this.file.nbys.list = [];
      this.file.yjaz.list = [];
      this.file.pxzm.list = [];
      this.file.hpjt.list = [];
      this.file.qtwj.list = [];
      let that = this;
      this.$http({
        method: "post",
        url: "/so/problem/detail",
        data: {
          id: this.serverId
        }
      }).then(res => {
        if (res.data.files) {
          for (let x of res.data.files) {
            let d = {
              name: x.fileName,
              status: "success",
              uid: new Date().getTime()
            };
            if (x.type == 8) {
              that.file.nbys.id = x.fileId;
              that.$set(that.file.nbys.list, 0, d);
            } else if (x.type == 9) {
              that.file.yjaz.id = x.fileId;
              that.$set(that.file.yjaz.list, 0, d);
            } else if (x.type == 10) {
              that.file.pxzm.id = x.fileId;
              that.$set(that.file.pxzm.list, 0, d);
            } else if (x.type == 11) {
              that.file.hpjt.id = x.fileId;
              that.$set(that.file.hpjt.list, 0, d);
            } else if (x.type == 12) {
              that.file.qtwj.id = x.fileId;
              that.$set(that.file.qtwj.list, 0, d);
            }
          }
        }

        this.fromObj = res.data;
        this.fromData = JSON.parse(JSON.stringify(this.fromObj));
        this.drawer = true;
        this.title = "编辑服务记录";
        this.drawerW = "764px";
      });
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
          method: "post",
          data: {
            id: this.serverId
          },
          url: "/so/problem/del"
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
    submitFn() {
      this.$refs.fromData.validate(valid => {
        if (valid) {
          let d = JSON.parse(JSON.stringify(this.fromData));
          if (d.type == "平台配置") {
            if (!this.file.nbys.id) {
              this.$message({
                message: "服务类型为平台配置时，必须上传内部验收单",
                type: "warning"
              });
              return false;
            }
          } else if (d.type == "硬件安装") {
            if (!this.file.yjaz.id) {
              this.$message({
                message: "服务类型为硬件安装时，必须上传硬件安装验收单",
                type: "warning"
              });
              return false;
            }
          } else if (d.type == "售后培训") {
            if (!this.file.pxzm.id) {
              this.$message({
                message: "服务类型为售后培训时，必须上传培训证明",
                type: "warning"
              });
              return false;
            }
          } else if (d.type == "好评反馈") {
            if (!this.file.hpjt.id) {
              this.$message({
                message: "服务类型为好评反馈时，必须上传好评截图",
                type: "warning"
              });
              return false;
            }
          }
          let arr = [];
          for (let x in this.file) {
            if (this.file[x].id) {
              arr.push(this.file[x].id);
            }
          }
          // d.files = JSON.parse(JSON.stringify(this.file));
          d.fileId = arr.join(",");
          d.comId = this.comid;
          d.company = this.comName;
          d.creator = this.userId;
          d.role = this.role; //当前用户角色
          this.$http({
            method: "post",
            url: "/so/problem/save",
            data: d
          }).then(res => {
            if (res.succ) {
              this.$message({
                title: "成功",
                message: res.data,
                type: "success"
              });
              for (let x in this.file) {
                this.file[x].list = [];
                this.file[x].id = null;
              }
              this.drawer = false;
              this.ajax();
              // this.$parent.data.pageNo=1;
              // this.$parent.ajax();
            }
          });
        }
      });
    },
    tableSelectFn(currentRow, oldCurrentRow) {
      //表格选中时
      if (currentRow) {
        let obj = JSON.parse(JSON.stringify(currentRow));
        this.rowFrom = false;
        this.isoperation = true;
        this.serverId = obj.id;
        if (
          currentRow.sourceFrom == "工单" ||
          currentRow.sourceFrom == "内部"
        ) {
          this.isoperation = false;
          if (currentRow.sourceFrom == "工单") {
            this.rowFrom = true;
          }
        }
        // this.fromObj = obj;
        // this.id = currentRow.depId;
      }
    },
    selectChange() {
      this.data.pageNo = 1;
      this.total = 0;
      this.ajax();
    },
    ajax() {
      let d = JSON.parse(JSON.stringify(this.data));
      this.$http({
        method: "post",
        url: "/so/problem/list",
        data: d
      }).then(res => {
        if (res.succ && res.data.data) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.$refs.list.setCurrentRow(this.tableData[0]);
        }
      });
    },
    // corpCodeSelect(item) {
    //     this.fromData.contact = item.userNickname;
    // },
    getUserNameList() {
      this.$http({
        method: "post",
        url: "/so/user/userNameList",
        data: {
          comId: this.comid,
          userName: ""
        }
      }).then(res => {
        // cb(res.data);
        this.userNameList = res.data;
      });
    },
    getProList() {
      this.$http({
        method: "post",
        url: "/so/project/comPrject/list",
        data: {
          comId: this.comid,
          comName: this.comName
        }
      }).then(res => {
        this.projectList = JSON.parse(JSON.stringify(res.data));
        this.projectList1 = JSON.parse(JSON.stringify(res.data));
        this.projectList.unshift({ projName: "请选择", projId: null });
      });
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
</style>

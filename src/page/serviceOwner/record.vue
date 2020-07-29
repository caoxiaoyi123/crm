<!-- 模型： DOM 结构 -->
<template>
  <div class="record">
    <div class="head-box drc">
      <span class="drc" style="margin-right:13px">
        <font class="fs13" style="margin-right:12px">项目名称</font>
        <el-select
          v-model="data.projId"
          placeholder="请选择"
          size="mini"
          style="width:250px"
        >
          <el-option
            v-for="item in projectList"
            :key="item.projId"
            :label="item.projName"
            :value="item.projId"
          ></el-option>
        </el-select>
      </span>
      <span class="drc">
        <font class="fs13" style="margin-right:12px">人员名称</font>
        <el-select
          v-model="data.userId"
          placeholder="请选择"
          size="mini"
          style="width:122px"
        >
          <el-option
            v-for="item in userList"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          ></el-option>
        </el-select>
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
          align="center"
          label="跟进人"
          prop="userName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="联系日期"
          prop="recordDate"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机号码"
          prop="phone"
        ></el-table-column>
        <el-table-column align="center" label="联系方式" prop="lxMethod">
          <template slot-scope="scope">{{
            scope.row.lxMethod | lxMethod
          }}</template>
        </el-table-column>
        <el-table-column align="center" label="漏斗阶段" prop="isHk">
          <template slot-scope="scope">{{ scope.row.isHk | isHk }}</template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          label="跟踪内容"
          prop="recordRemarks"
          width="250px"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.recordRemarks" placement="right">
              <span class="clamp-2">
                {{ scope.row.recordRemarks }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="下次跟进时间"
          prop="nextRecordDate"
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          label="下次跟进思路"
          prop="nextSl"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.nextSl" placement="right">
              <span class="clamp-2">
                {{ scope.row.nextSl }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="查看详情">
          <template slot-scope="scope">
            <span class="draw-tit cp fs14" @click="seeDetail(scope.row)"
              >查看</span
            >
          </template>
        </el-table-column>
      </el-table>
      <v-drawer
        :title="'查看详情'"
        :drawer="drawer"
        :drawerW="'680px'"
        :readOnly="true"
        ref="drawer"
      >
        <el-form
          :disabled="true"
          :model="fromData"
          label-width="90px"
          size="medium"
        >
          <h4 class="bor-b tit-txt fs16">基本信息</h4>
          <div class="dfrb">
            <el-form-item label="项目名称" prop="projName">
              <el-input v-model="fromData.projName"></el-input>
            </el-form-item>
            <el-form-item label="人员名称" prop="userName">
              <el-input v-model="fromData.userName"></el-input>
            </el-form-item>
          </div>
          <div class="dfrb">
            <el-form-item label="下次跟踪时间" prop="nextRecordDate">
              <el-input
                v-model="fromData.nextRecordDate"
                prefix-icon="el-icon-date"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系日期" prop="recordDate">
              <el-input
                v-model="fromData.recordDate"
                prefix-icon="el-icon-date"
              ></el-input>
            </el-form-item>
          </div>
          <div class="dfrb">
            <el-form-item label="联系方式" prop="lxMethod">
              <el-input></el-input>
              <span class="filter-font">
                {{ fromData.lxMethod | lxMethod }}
              </span>
              <ul
                class="file-list"
                v-if="lxMethodList && lxMethodList.length > 0"
              >
                <li
                  class="bule-txt fs12 text-over cp"
                  v-for="(item, i) of lxMethodList"
                  :key="i"
                  @click.prevent="openLink(item.fileAddress)"
                >
                  {{ item.fileName }}
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="漏斗阶段" prop="isHk">
              <el-input></el-input>
              <span class="filter-font">{{ fromData.isHk | isHk }}</span>
              <ul class="file-list" v-if="isHkList && isHkList.length > 0">
                <li
                  class="bule-txt fs12 text-over cp"
                  v-for="(item, i) of isHkList"
                  :key="i"
                  @click.prevent="openLink(item.fileAddress)"
                >
                  {{ item.fileName }}
                </li>
              </ul>
            </el-form-item>
          </div>
          <div class="dfrb">
            <el-form-item
              label="回款金额(万)"
              prop="hmoeny"
              v-if="fromData.hmoeny"
            >
              <el-input v-model="fromData.hmoeny"></el-input>
            </el-form-item>
            <el-form-item
              label="签约金额(万)"
              prop="qmoney"
              v-if="fromData.qmoney"
            >
              <el-input v-model="fromData.qmoney"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="反思" prop="fs" class="text-line">
            <el-input
              type="textarea"
              resize="none"
              v-model="fromData.fs"
            ></el-input>
          </el-form-item>
          <el-form-item label="下次追踪思路" prop="nextSl" class="text-line">
            <el-input
              type="textarea"
              resize="none"
              v-model="fromData.nextSl"
            ></el-input>
          </el-form-item>
          <el-form-item label="跟踪内容" prop="recordRemarks" class="text-line">
            <el-input
              type="textarea"
              resize="none"
              v-model="fromData.recordRemarks"
            ></el-input>
          </el-form-item>
          <el-form-item label="AB对话" prop="abask" class="text-line">
            <el-input
              type="textarea"
              resize="none"
              v-model="fromData.abask"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="followContent" class="text-line">
            <el-input
              type="textarea"
              resize="none"
              v-model="fromData.followContent"
            ></el-input>
          </el-form-item>
          <h4 class="bor-b tit-txt fs16">文档资源</h4>
          <div class="dfrb mb20">
            <div class="layout-box text-c">
              <span>
                <font class="fs13 file-label">好评</font>
                <button
                  class="see-btn fs12 text-c cp"
                  :class="fromData.hpurl ? '' : 'ban'"
                  @click.prevent="openLink(fromData.hpurl)"
                >
                  点击查看
                </button>
              </span>
            </div>
            <div class="layout-box text-c">
              <span>
                <font class="fs13 file-label">清单</font>
                <button
                  class="see-btn fs12 text-c cp"
                  :class="fromData.qdurl ? '' : 'ban'"
                  @click.prevent="openLink(fromData.qdurl)"
                >
                  点击查看
                </button>
              </span>
            </div>
          </div>
          <div class="dfrb">
            <div class="layout-box text-c">
              <span>
                <font class="fs13 file-label">报道</font>
                <button
                  class="see-btn fs12 text-c cp"
                  :class="fromData.bdurl ? '' : 'ban'"
                  @click.prevent="openLink(fromData.bdurl)"
                >
                  点击查看
                </button>
              </span>
            </div>
            <div class="layout-box text-c">
              <span>
                <font class="fs13 file-label">其他文档</font>
                <button
                  class="see-btn fs12 text-c cp"
                  :class="fromData.qtwdurl ? '' : 'ban'"
                  @click.prevent="openLink(fromData.qtwdurl)"
                >
                  点击查看
                </button>
              </span>
            </div>
          </div>
        </el-form>
      </v-drawer>
    </div>
  </div>
</template>
<script>
export default {
  name: "record", // 结构名称
  data() {
    return {
      // 数据模型a
      tableData: [],
      projectList: [],
      userList: [],
      data: {
        comId: "",
        projId: null,
        userId: null
      },
      fromData: {},
      lxMethodList: [],
      isHkList: [],
      drawer: false
    };
  },
  watch: {
    // 监控集合
    comid: function(val, old) {
      this.projectList = [];
      this.userList = [];
      if (val != "") {
        this.data.projId = null;
        this.data.userId = null;
        this.ajax();
        this.getUserList();
        this.getProList();
      } else {
        this.tableData.splice(0);
      }
    },
    data: {
      deep: true,
      handler(val, old) {
        this.ajax();
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
    }
  },
  filters: {
    lxMethod(val) {
      if (val == 1) {
        return "电话";
      } else if (val == 2) {
        return "微信";
      } else if (val == 3) {
        return "上门";
      } else if (val == 4) {
        return "有效电话";
      }
    },
    isHk(val) {
      if (val == 1) {
        return "早期联系";
      } else if (val == 2) {
        return "深度意向";
      } else if (val == 3) {
        return "上会/培训";
      } else if (val == 4) {
        return "签约";
      } else if (val == 5) {
        return "回款";
      }
    }
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    if (this.comid != "") {
      this.ajax();
      this.getUserList();
      this.getProList();
    }
    // if (sessionStorage.getItem("userid")) {
    //     this.userId = sessionStorage.getItem("userid");
    // }
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
      let d = this.data;
      d.comId = this.comid;
      for (let x in d) {
        if (d[x] == null) {
          delete d[x];
        }
      }

      this.$http({
        method: "post",
        data: d,
        url: "/so/record/list"
      }).then(res => {
        this.tableData = res.data;
      });
    },
    seeDetail(row) {
      //查看详情
      // this.fromData=row;
      this.isHkList = [];
      this.lxMethodList = [];
      let that = this;
      this.$http({
        method: "post",
        url: "/so/record/detail",
        data: {
          recordId: row.claimRecordId
        }
      }).then(res => {
        if (res.data) {
          if (res.data.files && res.data.files.length > 0) {
            for (let x of res.data.files) {
              if (x.type == 1) {
                that.lxMethodList.push(x);
              } else if (x.type == 2) {
                that.isHkList.push(x);
              } else if (x.type == 3) {
                res.data.hpurl = x.fileAddress;
              } else if (x.type == 4) {
                res.data.qdurl = x.fileAddress;
              } else if (x.type == 5) {
                res.data.bdurl = x.fileAddress;
              } else if (x.type == 6) {
                res.data.qtwdurl = x.fileAddress;
              }
            }
          }
          this.fromData = res.data;
          this.fromData.projName = row.projName;
          this.fromData.userName = row.userName;
        }
      });
      this.drawer = true;
    },
    // openLink(url) {
    //     //新开链接
    //     if (url && url != "") {
    //         window.open(url, "_blank",);
    //     }
    // },
    getUserList() {
      this.$http({
        method: "post",
        url: "/so/user/record/list",
        data: {
          comId: this.comid,
          comName: this.comName
        }
      }).then(res => {
        this.userList = res.data;
        this.userList.unshift({ userName: "请选择", userId: null });
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
        this.projectList = res.data;
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
.el-form /deep/ .el-form-item__content {
  position: relative;
  .filter-font {
    position: absolute;
    left: 15px;
    color: #c0c4cc;
    cursor: no-drop;
  }
}
.layout-box {
  width: 50%;
  span {
    width: 135px;
    text-align: right;
    display: inline-block;
  }
  .file-label {
    margin-right: 13px;
  }
  .see-btn {
    width: 68px;
    line-height: 23px;
    border: 1px solid #1989fa;
    background: #fff;
    color: #1989fa;
    outline: none;
    border-radius: 12px;
  }
}
.file-list {
  width: 202px;
  li {
    line-height: 24px;
  }
}
</style>

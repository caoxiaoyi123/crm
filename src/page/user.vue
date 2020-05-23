<!-- 模型： DOM 结构 -->
<template>
  <div class="user">
    <div class="head-box drc">
      <span class="drc cp mr20" @click="creatFn" v-if="isshow">
        <i class="el-icon-plus"></i>
        <font class="fs13">新建</font>
      </span>
      <span
        class="drc cp mr20"
        @click="editFn"
        v-if="tableData && tableData.length > 0"
      >
        <i class="el-icon-edit"></i>
        <font class="fs13">编辑</font>
      </span>
      <span
        class="drc cp mr20"
        @click="exportFn"
        v-if="tableData && tableData.length > 0"
      >
        <i class="icon icon-daochu el-icon-upload2"></i>
        <font class="fs13">导出excel</font>
      </span>
      <span class="drc cp mr20">
        <el-upload
          ref="upload"
          :action="baseUrl + '/so/user/upload'"
          :show-file-list="false"
          :multiple="false"
          :on-success="sucFn"
          :data="fileData"
          :on-error="upLoadfn.uploadErrFn"
          :limit="1"
          :on-exceed="upLoadfn.uploadExcFn"
          :before-upload="beforeUp"
        >
          <i class="icon icon-daoru el-icon-download"></i>
          <font class="fs13">批量导入</font>
        </el-upload>
      </span>
      <span class="drc cp mr20" @click="tempFn">
        <i class="icon icon-yhmb"></i>
        <font class="fs13">用户模板</font>
      </span>
      <span class="drc">
        <font class="fs13" style="margin-right:12px">在职状态</font>
        <el-select
          v-model="data.state"
          placeholder="请选择"
          size="mini"
          style="width:122px"
          @change="selectChange"
        >
          <el-option
            v-for="item in stateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
        height="32vh"
        :data="tableData"
        style="width:100%"
      >
        <el-table-column
          align="center"
          class-name="serial-num"
          width="50px"
          label="序号"
          type="index"
          :index="indexFn"
        ></el-table-column>
        <el-table-column align="left" header-align="center" label="所属公司">
          <template>
            <span class="text-over" :title="comName">{{ comName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="姓名"
          prop="userNickname"
        ></el-table-column>
        <el-table-column
          align="center"
          label="用户名"
          prop="userName"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机号码"
          prop="userPhone"
        ></el-table-column>
        <el-table-column
          align="center"
          label="电子邮箱"
          prop="userEmail"
        ></el-table-column>
        <el-table-column align="center" label="产品授权"></el-table-column>
        <el-table-column align="center" label="APP授权"></el-table-column>
        <el-table-column align="center" label="在职状态" prop="userState">
          <template slot-scope="scope">{{
            scope.row.userState | userState
          }}</template>
        </el-table-column>
        <el-table-column align="center" label="管理者" prop="isAdmin">
          <template slot-scope="scope">
            <span class="cp red-font" @click="isAdminFn(scope.row)">
              {{ scope.row.isAdmin == 1 ? "是" : "否" }}
            </span>
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
    <v-drawer :title="title" :drawer="drawer" @submitFn="submitFn">
      <el-form
        ref="fromData"
        :model="fromData"
        label-width="80px"
        size="medium"
      >
        <h4 class="bor-b tit-txt fs16">用户信息</h4>
        <div class="dfrb">
          <el-form-item
            label="用户名"
            prop="userName"
            :rules="[
              {
                pattern: /^([A-Za-z]+[0-9]+)|([0-9]+[A-Za-z]+)$/,
                message: '请输入数字和字母',
                trigger: ['blur', 'change']
              },
              { required: true, message: '用户名不得为空' }
            ]"
          >
            <el-input
              placeholder="请输入用户名"
              :disabled="title == '编辑用户'"
              v-model="fromData.userName"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="姓名"
            prop="nickName"
            :rules="{ required: true, message: '姓名不得为空' }"
          >
            <el-input
              placeholder="请输入姓名"
              v-model="fromData.nickName"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb" v-if="title == '新建用户'">
          <el-form-item
            label="密码"
            prop="password"
            :rules="{ required: true, message: '密码不得为空' }"
          >
            <el-input
              placeholder="请输入密码"
              v-model="fromData.password"
              show-password
              style="width:200px"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="password2"
            :rules="[
              { required: true, message: '确认密码不得为空' },
              { validator: confirmPass, trigger: 'blur' }
            ]"
          >
            <el-input
              placeholder="请确认密码"
              v-model="fromData.password2"
              show-password
              style="width:200px"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="单位" prop="comName">
            <el-input
              placeholder="请输入单位"
              v-model="fromData.comName"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="电子邮箱"
            prop="email"
            :rules="{
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }"
          >
            <el-input
              placeholder="请输入电子邮箱"
              v-model="fromData.email"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="手机号码"
            prop="phone"
            :rules="[
              {
                pattern: /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147,145))\d{8}$/,
                message: '请输入正确的手机号码',
                trigger: ['blur', 'change']
              },
              { required: true, message: '手机号码不得为空' }
            ]"
          >
            <el-input
              v-model="fromData.phone"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="职务" prop="job">
            <el-input
              placeholder="请输入职务"
              v-model="fromData.job"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="性别" prop="info_sex">
            <el-select v-model="fromData.info_sex" style="width:200px">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="年龄"
            prop="user_age"
            :rules="{
              pattern: /^[0-9]+$/,
              message: '请输入数字',
              trigger: ['blur', 'change']
            }"
          >
            <el-input
              placeholder="请输入年龄"
              v-model.trim="fromData.user_age"
            ></el-input>
          </el-form-item>
        </div>
        <h4 class="bor-b tit-txt fs16">其他资料</h4>
        <div class="dfrb">
          <el-form-item label="籍贯" prop="info_native_place">
            <el-input
              placeholder="请输入籍贯"
              v-model="fromData.info_native_place"
            ></el-input>
          </el-form-item>
          <el-form-item label="毕业院校" prop="info_school">
            <el-input
              placeholder="请输入毕业院校"
              v-model="fromData.info_school"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="学历" prop="info_enducation">
            <el-input
              placeholder="请输入学历"
              v-model="fromData.info_enducation"
            ></el-input>
            <!-- <el-select v-model="fromData.info_enducation" style="width:200px">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select> -->
          </el-form-item>
          <el-form-item label="爱好" prop="info_hobby">
            <el-input
              placeholder="请输入爱好"
              v-model="fromData.info_hobby"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="婚姻状况" prop="info_wedlock">
            <el-input
              placeholder="请输入婚姻状况"
              v-model="fromData.info_wedlock"
            ></el-input>
          </el-form-item>
          <el-form-item label="工作经历" prop="work_experience">
            <el-input
              placeholder="请输入工作经历"
              v-model="fromData.work_experience"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </v-drawer>
  </div>
</template>
<script>
import {
  baseUrl //引入baseUrl
} from "../../config/env";
export default {
  name: "user", // 结构名称
  data() {
    return {
      // 数据模型a
      tableData: [],
      drawer: false,
      title: "",
      fromData: {},
      fromObj: {},
      userId: null,
      stateList: [
        {
          label: "在职",
          value: 0
        },
        {
          label: "离职",
          value: 1
        },
        {
          label: "长沙地铁",
          value: 2
        }
      ],
      total: 0,
      data: {
        comId: "",
        comName: "",
        state: 0,
        pageNo: 1,
        pageSize: 10
      },
      isshow: false,
      baseUrl: baseUrl,
      fileData: {
        id: null,
        userId: null
      }
    };
  },
  watch: {
    // 监控集合
    comid: function(val, old) {
      if (val != "") {
        this.isshow = true;
        this.ajax();
      } else {
        this.isshow = false;
        this.tableData.splice(0);
      }
    }
    // data: {
    //     deep: true,
    //     handler(val, old) {
    //         this.ajax();
    //     }
    // }
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
    userState(val) {
      if (val == 1) {
        return "离职";
      } else if (val == 2) {
        return "长沙地铁";
      } else if (val == 0) {
        return "在职";
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
      this.isshow = true;
      this.fileData.id = this.comid;
      this.fileData.userId = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
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
    confirmPass(rule, value, callback) {
      //确认密码验证
      if (value !== this.fromData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },
    tableSelectFn(currentRow, oldCurrentRow) {
      //表格选中时
      if (currentRow) {
        let obj = JSON.parse(JSON.stringify(currentRow));
        this.userId = obj.userId;
        this.fromObj = obj;
        // this.id = currentRow.depId;
      }
    },
    creatFn() {
      //新建
      this.fromData = new Object();
      this.fromData.comName = this.comName;
      this.drawer = true;
      this.title = "新建用户";
      if (this.$refs.fromData) {
        this.$refs.fromData.resetFields();
      }
    },
    editFn() {
      //编辑
      this.$http({
        method: "post",
        url: "/so/user/detail",
        data: { userId: this.userId }
      }).then(res => {
        this.fromData = JSON.parse(JSON.stringify(res.data));
        this.fromData.comName = this.comName;
        this.drawer = true;
        this.title = "编辑用户";
      });
    },
    exportFn() {
      //导出
      window.open(
        baseUrl +
          "/so/user/export?comId=" +
          this.comid +
          "&comName=" +
          this.comName,
        "_blank"
      );
    },
    tempFn() {
      //用户模板
      window.open(baseUrl + "/so/user/temple", "_blank");
    },
    selectChange() {
      this.data.pageNo = 1;
      this.total = 0;
      this.ajax();
    },
    ajax() {
      let d = this.data;
      d.comId = this.comid;
      d.comName = this.comName;
      this.$http({
        method: "post",
        data: d,
        url: "/so/user/list"
      }).then(res => {
        this.tableData = res.data.data;
        this.total = res.data.total;
        this.$refs.list.setCurrentRow(this.tableData[0]);
      });
    },
    isAdminFn(row) {
      //管理员授权
      let str, isAdmin;
      if (row.isAdmin == 1) {
        str = "确定取消该用户管理员权限？";
        isAdmin = 0;
      } else {
        str = "确定要设置该用户为管理员？";
        isAdmin = 1;
      }
      this.$confirm(str, "提示", {
        // confirmButtonText: "保存",
        showClose: false,
        distinguishCancelAndClose: true,
        confirmButtonClass: "white-font",
        cancelButtonClass: "cancel-btn"
      }).then(() => {
        this.$http({
          method: "post",
          url: "/so/user/operaterUser",
          data: {
            userId: row.userId,
            isAdmin: isAdmin
          }
        }).then(res => {
          if (res.succ) {
            this.$message({
              title: "成功",
              message: res.data,
              type: "success"
            });
            this.drawer = false;
            this.ajax();
          }
        });
      });
    },
    sucFn(response, file, fileList) {
      this.$refs.upload.clearFiles();
      if (response.succ) {
        this.upLoadfn.uploadSucFn();
        this.ajax();
      } else {
        this.$message({
          message: response.msg,
          type: "warning"
        });
      }
    },
    beforeUp() {
      this.fileData.id = this.comid;
      this.fileData.userId = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
    },
    submitFn() {
      //新建or修改
      //提交
      this.$refs.fromData.validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.fromData));
          data.creator = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户的id

          if (this.title == "新建用户") {
            data.comId = this.comid;
          }
          // for (let x in data) {
          //     if (data[x] == null) {
          //         delete data[x];
          //     }
          //     if (x == "re") {
          //         delete data[x];
          //     }
          // }
          // this.editAddFn(data);
          this.$http({
            method: "post",
            url: "/so/user/save",
            data: data
          }).then(res => {
            if (res.succ) {
              this.$message({
                title: "成功",
                message: res.data,
                type: "success"
              });
              this.drawer = false;
              this.ajax();
            }
          });
        }
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
.drawer /deep/ .el-form h4 {
  height: 44px;
  line-height: 44px;
  margin-bottom: 15px;
}
.el-form /deep/ .el-form-item__label {
  font-size: 13px;
  color: #5a5e66;
}
.red-font {
  color: #fa5555;
}
</style>

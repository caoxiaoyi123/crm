<!-- 模型： DOM 结构 -->
<template>
  <div class="organize">
    <div class="head-box drc">
      <span class="drc cp mr20 hover-color" @click="creatFn" v-if="isshow">
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
        ref="depList"
        @current-change="tableSelectFn"
        highlight-current-row
        header-cell-class-name="table-header table-h"
        border
        height="calc(65vh - 231px)"
        :data="tableData"
        style="width:100%"
      >
        <el-table-column
          align="center"
          class-name="serial-num"
          width="50"
          label="序号"
          type="index"
          :index="indexFn"
        >
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="部门名称"
          prop="depName"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.depName" placement="right">
              <span class="clamp-2">
                {{ scope.row.depName }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="部门负责人"
          prop="depManager"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机号码"
          prop="depTel"
        ></el-table-column>
        <el-table-column
          align="center"
          label="邮箱"
          prop="depMail"
        ></el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          label="备注"
          prop="depMemo"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.depMemo" placement="right">
              <span class="clamp-2">
                {{ scope.row.depMemo }}
              </span>
            </el-tooltip>
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
        :model="fromData"
        label-width="80px"
        ref="fromData"
        size="medium"
      >
        <div class="dfrb">
          <el-form-item
            label="部门名称"
            prop="depName"
            :rules="{ required: true, message: '部门名称不得为空' }"
          >
            <el-input
              placeholder="请输入部门名称"
              v-model="fromData.depName"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门负责人" prop="depManager">
            <el-input
              placeholder="请输入部门负责人"
              v-model="fromData.depManager"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="手机号码"
            prop="depTel"
            :rules="{
              pattern: /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147,145))\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: ['blur', 'change']
            }"
          >
            <el-input
              placeholder="请输入手机号码"
              v-model="fromData.depTel"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="邮箱"
            prop="depMail"
            :rules="{
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }"
          >
            <el-input
              placeholder="请输入邮箱"
              v-model="fromData.depMail"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="备注" prop="depMemo" class="text-line">
          <el-input
            placeholder="请输入备注"
            type="textarea"
            resize="none"
            v-model="fromData.depMemo"
            maxlength="50"
          ></el-input>
        </el-form-item>
      </el-form>
    </v-drawer>
  </div>
</template>
<script>
export default {
  name: "organize", // 结构名称
  data() {
    return {
      // 数据模型a
      tableData: [],
      drawer: false,
      title: "",
      fromData: {},
      fromObj: {},
      data: {
        pageNo: 1,
        pageSize: 10,
        comId: null
      },
      id: "",
      isshow: false,
      total: 0
    };
  },
  watch: {
    // 监控集合
    comid: function(val, old) {
      if (val != "") {
        this.isshow = true;
        this.data.pageNo = 1;
        this.ajax(val);
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
      this.ajax(this.comid);
      this.isshow = true;
    }
  },
  beforeMount() {
    // console.group('挂载前状态  ===============》beforeMount');
  },
  mounted() {
    // console.group('挂载结束状态===============》mounted');
    this.$nextTick(function() {});
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
      this.ajax(this.comid);
    },
    creatFn() {
      this.fromData = new Object();
      this.drawer = true;
      this.title = "新建组织";
      if (this.$refs.fromData) {
        this.$refs.fromData.resetFields();
      }
    },
    editFn() {
      this.fromData = JSON.parse(JSON.stringify(this.fromObj));
      this.drawer = true;
      this.title = "编辑组织";
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
            comId: this.comid,
            depId: this.id
          },
          url: "/so/depart/delete"
        }).then(res => {
          if (res.succ) {
            this.$message({
              title: "成功",
              message: res.data,
              type: "success"
            });
            this.ajax(this.comid);
          }
        });
      });
    },
    tableSelectFn(currentRow, oldCurrentRow) {
      //表格选中时
      if (currentRow) {
        let obj = JSON.parse(JSON.stringify(currentRow));
        this.fromObj = obj;
        this.id = currentRow.depId;
      }
    },
    submitFn() {
      this.$refs.fromData.validate(valid => {
        if (valid) {
          let url, data;
          if (this.title == "新建组织") {
            url = "/so/depart/add";
            data = this.fromData;
            data.comId = this.comid;
          } else {
            url = "/so/depart/edit";
            data = this.fromData;
            data.depId = this.id;
          }
          for (let x in data) {
            if (data[x] == null) {
              delete data[x];
            }
          }
          this.editAddFn(url, data);
        }
      });
    },
    editAddFn(url, data) {
      this.$http({
        method: "post",
        url: url,
        data: data
      }).then(res => {
        if (res.succ) {
          this.$message({
            title: "成功",
            message: res.data,
            type: "success"
          });
          this.drawer = false;
          this.ajax(this.comid);
        }
      });
    },
    ajax(comId) {
      this.tableData.splice(0);
      let d = JSON.parse(JSON.stringify(this.data));
      d.comId = comId;
      this.$http({
        method: "get",
        params: d,
        url: "/so/depart/get"
      }).then(res => {
        if (res.succ) {
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.$refs.depList.setCurrentRow(this.tableData[0]);
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
</style>

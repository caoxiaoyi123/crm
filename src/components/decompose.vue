<!-- 模型： DOM 结构 -->
<template>
  <div class="decompose">
    <div class="top-box drc mb10">
      <span class="mr40"
        >计划内容：<font class="red-txt">{{ contentTxt }}</font></span
      >
      <span class="mr10"
        >输出：<font class="red-txt">{{ outTxt }}</font></span
      >
    </div>
    <div class="table-box">
      <el-table
        cell-class-name="fs13 table-h"
        header-cell-class-name="table-header table-h"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @expand-change="expandedChange"
        border
        :indent="4"
        :row-key="getRowKey"
        :data="tableData"
        height="calc(60vh - 160px)"
        ref="depList"
        style="flex:1.2"
        highlight-current-row
        @current-change="tableSelectFn"
      >
        <el-table-column
          header-align="center"
          align="left"
          prop="depName"
          label="部门名称"
        >
          <template slot-scope="scope">
            <div
              style="display:flex;align-items: center;max-width: calc(100% - 30px);"
            >
              <i
                class="left-icon"
                :class="
                  scope.row.selected
                    ? 'el-icon-folder-remove'
                    : 'el-icon-folder-add'
                "
                v-if="scope.row.children"
              ></i>
              <i class="left-icon el-icon-document" v-else></i>
              <span class="text-over" :title="scope.row.depName">{{
                scope.row.depName
              }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        cell-class-name="fs13 table-h"
        header-cell-class-name="table-header table-h"
        border
        row-key="id"
        :data="leftData"
        @selection-change="leftChange"
        height="calc(60vh - 160px)"
        @selection-all="leftAll"
        @select="leftRow"
      >
        <el-table-column align="center" type="selection"></el-table-column>
        <el-table-column
          align="center"
          label="姓名"
          prop="name"
        ></el-table-column>
      </el-table>
      <div class="left-or-right">
        <p
          class="transfer-btn mb20"
          @click="toRight"
          :class="leftList.length > 0 ? 'acitve' : ''"
        >
          <i class="icon el-icon-d-arrow-right fs16"></i>
        </p>
        <p
          class="transfer-btn"
          @click="toLeft"
          :class="rightList.length > 0 ? 'acitve' : ''"
        >
          <i class="icon el-icon-d-arrow-left fs16"></i>
        </p>
      </div>
      <el-table
        cell-class-name="fs13 table-h"
        header-cell-class-name="table-header table-h"
        border
        row-key="id"
        :data="rightData"
        @selection-change="rightChange"
        height="calc(60vh - 160px)"
        @selection-all="rightAll"
        @select="rightRow"
        style="flex:2"
      >
        <el-table-column
          align="center"
          class-name="serial-num"
          type="selection"
        ></el-table-column>
        <el-table-column
          align="center"
          width="50"
          label="序号"
          type="index"
        ></el-table-column>
        <el-table-column
          align="center"
          label="姓名"
          prop="name"
        ></el-table-column>
        <el-table-column align="center" label="输出标准">
          <template slot-scope="scope">
            <el-input
              type="text"
              v-model="scope.row.output"
              placeholder="点击输入"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="btn-box text-r mt20">
      <button class="cancel-btn mr30 text-c fs14 cp" @click="closeFn">
        取消
      </button>
      <button class="sure-btn text-c fs14 cp" @click="sumbitFn">保存</button>
    </div>
  </div>
</template>
<script>
export default {
  name: "decompose", // 结构名称
  data() {
    return {
      // 数据模型a
      tableData: [],
      leftData: [1, 2, 3],
      rightData: [],
      leftList: [], //左侧勾选承载数组
      rightList: [] //右侧勾选承载数组
    };
  },
  watch: {
    // 监控集合
    list: {
      deep: true,
      handler(val, old) {
        if (val.length > 0) {
          this.rightData = JSON.parse(JSON.stringify(val));
        }
      }
    }
  },
  props: {
    // 集成父级参数
    detailId: {
      //计划明细id
      default: null
    },
    outTxt: {
      //输出
      default: ""
    },
    contentTxt: {
      //内容
      default: ""
    },
    list: {
      default: []
    },
    id: {
      default: null
    }
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    // if(this.list.length>0){
    //     this.rightData=JSON.parse(JSON.stringify(this.list));
    // }
  },
  beforeMount() {
    // console.group('挂载前状态  ===============》beforeMount');
  },
  mounted() {
    // console.group('挂载结束状态===============》mounted');
    this.getDepart();
    if (this.list.length > 0) {
      this.rightData = JSON.parse(JSON.stringify(this.list));
    }
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
    getRowKey(row) {
      return row.depId;
    },
    expandedChange(row) {
      if (row.selected) {
        row.selected = !row.selected;
      } else {
        row.selected = true;
      }
    },
    forInRight(obj) {
      for (let x of this.rightData) {
        if (x.dealUserId == obj.userId) {
          return false;
        }
      }
      return true;
    },
    toRight() {
      let r = JSON.parse(JSON.stringify(this.leftList));
      for (let x of r) {
        if (this.forInRight(x)) {
          let d = {
            dealUserId: x.userId,
            name: x.name
          };
          if (this.detailId) {
            d.detailId = this.detailId;
          }
          this.rightData.push(d);
        }
      }
    },
    toLeft() {
      let r1 = JSON.parse(JSON.stringify(this.rightData));
      let r2 = JSON.parse(JSON.stringify(this.rightList));
      for (let x in r1) {
        for (let y in r2) {
          if (r1[x].dealUserId == r2[y].dealUserId) {
            r1.splice(x, 1);
          }
        }
      }
      this.rightData = JSON.parse(JSON.stringify(r1));
    },
    /*监听多选框*/
    leftChange(sele) {
      this.leftList = JSON.parse(JSON.stringify(sele));
      // if (sele.length > 0) {
      //     for (let x of sele) {
      //         x.isReadx = 1;
      //     }
      // } else {
      //     for (let x of this.tableData1) {
      //         x.isReadx = 0;
      //     }
      // }
    },
    leftRow(sele, row) {
      // this.list=JSON.parse(JSON.stringify(sele));
      // if (row.isReadx == 1) {
      //     row.isReadx = 0;
      // }
    },
    leftAll(sele) {
      // console.log(sele);
    },
    rightChange(sele) {
      this.rightList = JSON.parse(JSON.stringify(sele));
      // if (sele.length > 0) {
      //     for (let x of sele) {
      //         x.isReadx = 1;
      //     }
      // } else {
      //     for (let x of this.tableData1) {
      //         x.isReadx = 0;
      //     }
      // }
    },
    rightRow(sele, row) {
      console.log(row);
      // if (row.isReadx == 1) {
      //     row.isReadx = 0;
      // }
    },
    rightAll(sele) {
      // console.log(sele);
    },
    /**监听多选框end */
    getDepart() {
      //获取组织关系
      let d = JSON.parse(sessionStorage.getItem("depart"));
      this.tableData = d;
      this.$refs.depList.setCurrentRow(this.tableData[0]);
    },
    tableSelectFn(currentRow, oldCurrentRow) {
      //表格选中时
      if (currentRow) {
        this.$http({
          method: "get",
          url: "/common/departUser",
          params: {
            depId: currentRow.depId
          }
        }).then(res => {
          if (res.succ) {
            this.leftData = res.data;
          }
        });
      }
    },
    closeFn() {
      let d = JSON.parse(JSON.stringify(this.rightData));
      this.$emit("closeFn", { list: d });
    },
    sumbitFn() {
      let d = JSON.parse(JSON.stringify(this.rightData));
      if (d.length && d.length > 0) {
        for (let x of d) {
          if (d[0].detailId) {
            x.detailId = d[0].detailId;
          } else if (this.id) {
            x.detailId = this.id;
          }
          if (!x.output) {
            this.$message({
              message: "请填写输出标准",
              type: "warning"
            });
            return false;
          }
          for (let i in x) {
            if (i == "name") {
              delete x[i];
            }
          }
        }
        this.$http({
          method: "post",
          url: "/sv/plan/resolve/update",
          data: d
        }).then(res => {
          if (res.succ) {
            let obj = {
              resolveIds: res.data,
              list: this.rightData
            };
            this.$emit("submitFn", obj);
          }
        });
      } else {
        this.$message({
          message: "请选择人员",
          type: "warning"
        });
      }
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.decompose {
  padding: 15px;
  .table-box {
    display: flex;
    justify-content: space-between;
    .left-icon {
      color: #f7aa12;
      font-size: 16px;
      margin-right: 10px;
    }
    .el-table /deep/ .cell {
      display: flex;
      align-items: center;
      position: relative;
      & .el-table__expand-icon {
        position: absolute;
        right: 10px;
      }
    }
    .el-table /deep/ .is-center .cell {
      padding: 0;
      justify-content: center;
    }
    .el-table /deep/ .el-input__inner {
      border: none;
      text-align: center;
    }
    .el-table /deep/ .el-input__inner::-webkit-input-placeholder {
      color: #2796ff;
    }
    .el-table /deep/ .el-input__inner::-moz-input-placeholder {
      color: #2796ff;
    }
    .el-table /deep/ .el-input__inner::-ms-input-placeholder {
      color: #2796ff;
    }
    .left-or-right {
      align-self: center;
      margin: 0 30px;
      .transfer-btn {
        width: 40px;
        line-height: 28px;
        border-radius: 4px;
        border: 1px solid #dfe4ed;
        text-align: center;
        background: #fff;
        cursor: no-drop;
        .icon {
          color: #bfc8d8;
        }
      }
      .acitve {
        cursor: pointer;
        border-color: #2796ff;
        background: #2796ff;
        .icon {
          color: #fff;
        }
      }
    }
  }
  .btn-box {
    button {
      width: 62px;
      line-height: 32px;
      border: 1px solid #1989fa;
      border-radius: 4px;
      outline: none;
    }
    .cancel-btn {
      background: #fff;
      color: #1989fa;
    }
    .sure-btn {
      background: #1989fa;
      color: #fff;
    }
  }
}
</style>

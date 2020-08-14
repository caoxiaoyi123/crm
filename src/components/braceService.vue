<!-- 模型： DOM 结构 -->
<template>
  <div class="braceService">
    <div class="top-box dfrcb">
      <div class="drc">
        <span class="drc cp mr20 operate hover-color" @click="creatFn">
          <i class="icon iconfont iconxinjian"></i>
          <font class="fs13">新建</font>
        </span>
        <span
          class="drc cp mr20 operate hover-color"
          @click="deleteFn"
          v-if="tableData && tableData.length > 0"
        >
          <i class="el-icon-remove-outline"></i>
          <font class="fs13">删除</font>
        </span>
        <div class="comname-ipt" @keydown.13="keywordFn">
          <input
            type="text"
            v-model="data.searchCompName"
            placeholder="请输入关键字"
            maxlength="50"
          />
          <i class="el-icon-search cp" slot="append" @click="keywordFn"></i>
        </div>
      </div>
      <div class="drc fs12">
        <b class="mr10">内部验收：<font class="red-txt">{{ summary["内部验收"] }}</font>张</b>
        <b class="mr10">培训证明：<font class="red-txt">{{ summary["培训证明"] }}</font>张</b>
        <b class="mr10">外部验收：<font class="red-txt">{{ summary["外部验收"] }}</font>张</b>
        <b class="mr10">客户好评：<font class="red-txt">{{ summary["客户好评"] }}</font>个</b>
        <b class="mr10">客户回访：<font class="red-txt">{{ summary["客户回访"] }}</font>次</b>
        <b>硬件安装验收：<font class="red-txt">{{summary["硬件安装验收"]}}</font>张</b>
        <!-- <span class="mr10">内部验收：<font class="red-txt">{{count.total}}</font>张</span>
                <span class="mr10">培训证明：<font class="red-txt">{{count.amount}}</font>张</span>
                <span class="mr10">外部验收：<font class="red-txt">{{count.receivedPayments}}</font>张</span> -->
        <!-- <span class="mr10">客户好评：<font class="red-txt">{{count.receivedPayments}}</font>张</span> -->
        <!-- <span class="mr10">客户好评：<font class="red-txt">{{count.receivedPayments}}</font>个</span>
                <span>客户回访：<font class="red-txt">{{count.waitAmount}}</font>次</span> -->
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
        height="calc(100vh - 250px)"
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
          fixed
          label="序号"
          type="index"
          :index="indexFn"
        ></el-table-column>
        <el-table-column
          align="center"
          label="责任人姓名"
          width="100"
          prop="responsibleName"
        ></el-table-column>
        <el-table-column
          align="center"
          min-width="140"
          label="地区"
          prop="cityDetail"
        >
          <template slot-scope="scope">
            <el-tooltip
              :content="scope.row.cityDetail?returnRegion(scope.row.cityDetail):''"
              placement="right"
            >
              <span class="text-over">
                {{ scope.row.cityDetail?returnRegion(scope.row.cityDetail):'' }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          min-width="150"
          label="单位名称"
          prop="compName"
          show-overflow-tooltip
        >
          <!-- <template slot-scope="scope">
            <el-tooltip :content="scope.row.compName" placement="right">
              <span class="clamp-2">
                {{ scope.row.compName }}
              </span>
            </el-tooltip>
          </template> -->
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          min-width="150"
          label="项目名称"
          prop="projName"
          show-overflow-tooltip
        >
          <!-- <template slot-scope="scope">
            <el-tooltip :content="scope.row.projName" placement="right">
              <span class="clamp-2">
                {{ scope.row.projName }}
              </span>
            </el-tooltip>
          </template> -->
        </el-table-column>
        <el-table-column
          align="center"
          label="负责人"
          prop="comManager"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机"
          width="125"
          prop="comTel"
        ></el-table-column>
        <el-table-column
          v-for="o in num"
          :key="o"
          align="center"
          :label="o + ''"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.arr[o - 1].id">
              <el-tooltip placement="top" effect="light">
                <div slot="content">
                  <p class="fs14">阶段：{{ scope.row.arr[o - 1].param }}</p>
                  <p class="fs14">备注：{{ scope.row.arr[o - 1].remark }}</p>
                </div>
                <span
                  class="cp fs14"
                  @click="braceTap(scope.row.arr[o - 1], o)"
                  >{{ scope.row.arr[o - 1].param }}</span
                >
              </el-tooltip>
            </template>
            <template v-else>
              <span
                class="draw-tit cp fs14"
                @click="braceTap(scope.row.arr[o - 1], o, scope.row)"
                >点击选择</span
              >
            </template>
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
    <v-drawer
      :title="'新建支撑'"
      :drawerW="'885px'"
      :drawer="drawer"
      @submitFn="submitFn"
    >
      <v-newBrace @returnAdd="addFn" :supType="0" :isload="drawer"></v-newBrace>
    </v-drawer>
    <el-dialog
      width="370px"
      :visible="isDialog"
      :show-close="false"
      :append-to-body="true"
    >
      <!-- 头部 -->
      <div class="dia-tit dfrcb" slot="title">
        <span class="color-fff">任务阶段</span>
        <i class="color-fff el-icon-close cp" @click="isDialog = false"></i>
      </div>
      <!-- 内容 -->
      <div class="main">
        <el-form v-model="fromData" label-width="40px" size="medium">
          <el-form-item label="阶段">
            <el-select
              v-model="fromData.param"
              placeholder="请选择阶段"
              size="small"
              style="width:100%"
            >
              <el-option
                v-for="item in columnList"
                :key="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="备注"
            prop="remark"
            class="text-line"
            style="margin-bottom:12px"
          >
            <el-input
              placeholder="请输入备注"
              type="textarea"
              resize="none"
              v-model="fromData.remark"
              maxlength="50"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 操作 -->
      <div slot="footer" class="btn-box text-r">
        <button class="cancel-btn text-c fs14 cp" @click="isDialog = false">
          取消
        </button>
        <button class="sure-btn text-c fs14 cp" @click="sumbitFn">保存</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import newBrace from "@/components/newBrace";
export default {
  name: "braceService", // 结构名称
  data() {
    return {
      // 数据模型a
      num: 31,
      isajax: true,
      userId: "", //当前用户id
      total: 0,
      data: {
        searchCompName: null,
        pageNo: 1,
        pageSize: 30,
        planId: null,
        supType: 0
      },
      tableData: [],
      drawer: false,
      summary: {},
      addList: [],
      isDialog: false,
      columnList: [
        "内部验收",
        "外部验收",
        "培训证明",
        "硬件安装验收",
        "客户好评",
        "客户回访"
      ],
      fromData: {},
      isSave:true,
      isSave1:true,
    };
  },
  watch: {
    // 监控集合
  },
  components: {
    "v-newBrace": newBrace
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
      this.userId = sessionStorage.getItem("userid");
    } else {
      this.userId = "3A27BD25-8567-479D-9D96-1BA7BBEC5F0E"; //当前用户id
    }
    if (this.$route.query.type == 0) {
      this.num = 12;
    } else if (this.$route.query.type == 1) {
      this.num = 31;
    } else if (this.$route.query.type == 2) {
      this.num = 7;
    }
    let ppid
    if(this.$route.query.id){
      ppid=this.$route.query.id;
    }else{
      ppid=sessionStorage.getItem('plandetailid')
    }
    this.data.ppid = ppid;
    this.data.userId=this.userId
    this.ajax();
    // this.getCount();
    this.count();
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
    count() {
      let d = {
        ppid: this.data.ppid,
        responsibleId: this.userId,
        supType: 0
      };
      this.$http({
        method: "get",
        url: "/sv/plan/support/summary",
        params: d
      }).then(res => {
        if (res.succ) {
          this.summary = res.data;
        }
      });
    },
    addFn(p) {
      this.addList = JSON.parse(JSON.stringify(p.addlist));
    },
    indexFn(index) {
      let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
      return n;
    },
    keywordFn() {
      this.data.pageNo = 1;
      // this.total = 0;
      this.ajax();
      this.count();
    },
    creatFn() {
      //新建
      this.drawer = true;
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
            ppid: this.data.ppid,
            supId: this.fromObj.supId,
            userId: this.userId
          },
          url: "/sv/plan/support/task/delete"
        }).then(res => {
          if (res.succ) {
            this.$message({
              title: "成功",
              message: res.data,
              type: "success"
            });
            this.ajax();
            this.count();
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
    submitFn() {
      if(!this.isSave1){
          return false
      }
      this.isSave1=false
      let d = JSON.parse(JSON.stringify(this.addList));
      this.$http({
        method: "post",
        url: "/sv/plan/support/task/add",
        data: d
      }).then(res => {
        if (res.succ) {
          this.drawer = false;
          this.$children[2].$children[0].closeDrawer()
          this.$message({
            title: "成功",
            message: res.data,
            type: "success"
          });
          this.isSave1=true;
          this.ajax();
          this.count();
        }else{
          this.isSave1=true;
        }
      });
    },
    ajax() {
      this.isajax = true;
      this.tableData.splice(0);
      let that = this;
      let d = this.data;
      this.$http({
        method: "get",
        params: d,
        url: "/sv/plan/support/task/list"
      }).then(res => {
        this.isajax = false;
        if (res.succ) {
          for (let o of res.data.data) {
            o.arr = [];
            for (let x = 0; x < this.num; x++) {
              let d = {};
              for (let y of o.exps) {
                if (y.seq == x + 1) {
                  d = Object.assign(d, y);
                }
              }
              o.arr.push(d);
            }
          }
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.$refs.list.setCurrentRow(this.tableData[0]);
        }
      });
    },
    getCount() {
      // let that = this;
      // let d=this.data
      // this.$http({
      //     method:'post',
      //     url:'/so/contract/count',
      //     data:d,
      // }).then(res=>{
      //     this.count=res.data
      // })
    },
    pageNoChange(val) {
      this.data.pageNo = val;
      this.ajax();
      this.count();
    },
    returnRegion(row) {
      //地区过滤器
      let str = "";
      if (row.province) {
        str += row.province;
      }
      if (row.city) {
        str += "/" + row.city;
      }
      if (row.area) {
        str += "/" + row.area;
      }
      return str;
    },
    braceTap(row, i, rows) {
      if (row.id) {
        this.fromData = JSON.parse(JSON.stringify(row));
      } else {
        this.fromData = new Object();
        this.fromData.seq = i;
        this.fromData.supId = rows.supId;
        // this.fromData.param='内部验收'
      }
      this.isDialog = true;
    },
    sumbitFn() {
      if(!this.fromData.param){
          this.$message({
              title: "消息",
              message:'必须填写漏斗阶段',
              type: "warning"
          });
          return false
      }
      if(this.fromData.param=='无'&&!this.fromData.id){
          this.isDialog = false;
          return false
      }
      if(!this.isSave){
          return false
      }
      this.isSave=false
      let d = JSON.parse(JSON.stringify(this.fromData));
      this.$http({
        method: "post",
        url: "/sv/plan/support/task/expUpdate",
        data: d
      }).then(res => {
        if (res.data) {
          this.isDialog = false;
          this.$message({
            title: "成功",
            message: "保存成功",
            type: "success"
          });
          this.isSave=true;
          this.ajax();
          this.count();
        } else {
          this.isSave=true;
          this.$message.error({
            message: "保存失败"
          });
        }
      });
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.braceService {
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

/**dialog样式 */
.el-dialog__wrapper /deep/ .el-form .el-input {
  width: 100%;
}
.el-dialog__wrapper /deep/ .el-dialog__header {
  background: #1989fa;
  padding: 0 20px;
  line-height: 44px;
}
.el-dialog__wrapper /deep/ .el-dialog__body {
  padding: 15px 20px 0;
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
    margin-right: 15px;
  }
  .sure-btn {
    background: #1989fa;
    color: #fff;
  }
}
</style>

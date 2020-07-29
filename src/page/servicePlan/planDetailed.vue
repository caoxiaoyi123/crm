<!-- 模型： DOM 结构 -->
<template>
  <div class="planDetailed">
    <div class="top-box dfrcb">
      <div class="drc">
        <b class="tit-type mr20">{{ typeTxt }}</b>
        <span class="drc cp mr20  hover-color" @click="creatFn">
          <i class="icon iconfont iconxinjian"></i>
          <font class="fs13">新建</font>
        </span>
        <span
          class="drc cp mr20  hover-color"
          @click="editFn"
          v-if="tableData && tableData.length > 0"
        >
          <i class="icon iconfont iconbianji"></i>
          <font class="fs13">编辑</font>
        </span>
        <span
          class="drc cp mr20  hover-color"
          @click="deleteFn"
          v-if="tableData && tableData.length > 0"
        >
          <i class="el-icon-remove-outline"></i>
          <font class="fs13">删除</font>
        </span>
        <span
          class="drc cp mr20  hover-color"
          @click="resolveFn"
          v-if="tableData && tableData.length > 0"
        >
          <i class="icon iconfont iconrenwufenjie"></i>
          <font class="fs13">任务分解</font>
        </span>
        <span class="drc cp mr20  hover-color" @click="drawer3 = true">
          <i class="icon iconfont iconxiaoshourenwuzhicheng"></i>
          <font class="fs13">销售任务支撑</font>
        </span>
        <span class="drc cp mr20  hover-color" @click="drawer2 = true">
          <i class="icon iconfont iconfuwurenwuzhicheng"></i>
          <font class="fs13">服务任务支撑</font>
        </span>
      </div>
      <v-statistic ref="statistic"></v-statistic>
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
          width="60"
          label="序号"
          type="index"
          :index="indexFn"
        ></el-table-column>
        <el-table-column align="center" label="工作性质">
          <template slot-scope="scope">
            {{ scope.row.workNature == 1 ? "非量化" : "量化" }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="内容"
          prop="content"
        ></el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="输出"
          prop="output"
        ></el-table-column>
        <el-table-column align="center" label="起止时间">
          <template slot-scope="scope">
            {{
              scope.row.startDate ? scope.row.startDate.replace(/-/g,'/') : ""
            }}-{{
              scope.row.endDate ? scope.row.endDate.replace(/-/g,'/'): ""
            }}
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="任务分解"
          prop="resolve"
        >
          <template slot-scope="scope">
            <span v-html="returnResolve(scope.row.resolve)"></span>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          header-align="center"
          label="备注"
          prop="remark"
        ></el-table-column>
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
    <v-drawer :title="title" :drawer="drawer" :drawerW="'500px'" @submitFn="submitFn">
      <el-form
        :model="fromData"
        label-width="80px"
        class="plan"
        ref="fromData"
        size="medium"
        @submit.native.prevent
      >
        <el-form-item label="工作性质">
          <el-select v-model="fromData.workNature" style="width:200px" :disabled="disabled">
            <el-option
              v-for="(x, i) of workNatureList"
              :key="i"
              :label="x.label"
              :value="x.value"
            ></el-option>
            <!-- <el-option label="量化" value="0"></el-option>
                        <el-option label="非量化" value="1"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item
          label="内容"
          prop="content"
          :rules="{ required: true, message: '内容不得为空' }"
        >
          <el-input
            placeholder="请输入内容"
            v-model="fromData.content"
            :disabled="disabled"
            :maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="输出"
          prop="output"
          :rules="{ required: true, message: '输出不得为空' }"
        >
          <el-input
            placeholder="请输入输出"
            v-model="fromData.output"
            :disabled="disabled"
            :maxlength="50"
          ></el-input>
        </el-form-item>
        <div class="drc">
          <el-form-item label="任务分解">
            <el-input
              placeholder="任务分解"
              v-model="fromData.resolve"
              style="position: relative;"
              :disabled="true"
              :title="fromData.resolve"
            ></el-input>
            <button class="ml10 search-btn cp" @click.prevent="mask = true">
              添加
            </button>
            <div class="mask-box" v-if="mask">
              <div class="mask-content">
                <div class="dia-tit dfrcb">
                  <span class="color-fff">添加任务分解</span>
                  <i class="color-fff el-icon-close cp" @click="mask = false"></i>
                </div>
                <v-decompose
                  @closeFn="mask = false"
                  @submitFn="addResolve"
                  :outTxt="fromData.output"
                  :id="fromData.detailId"
                  :list="fromFjList"
                  :contentTxt="fromData.content"
                ></v-decompose>
              </div>
              
            </div>
          </el-form-item>
        </div>
        <el-form-item label="起止时间">
          <el-date-picker
              placeholder="请输入起止时间"
              @change="timeClick"
              v-model="timeValue"
              :clearable="false"
              type="daterange"
              :editable="false"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :disabled="disabled"
          ></el-date-picker>
          <!-- <template v-if="$route.query.type == 2">
            style="width:280px;margin:0 12px"
            <el-date-picker
              v-model="timeValue"
              type="week"
              format="yyyy 第 WW 周"
              value-format="yyyy-MM-dd"
              placeholder="选择周"
            >
            </el-date-picker>
          </template>
          <template v-else-if="$route.query.type == 1">
            <el-date-picker
              v-model="timeValue"
              type="month"
              value-format="yyyy-MM-dd"
              placeholder="选择月"
            >
            </el-date-picker>
          </template>
          <template v-else-if="$route.query.type == 0">
            <el-date-picker
              v-model="timeValue"
              type="year"
              value-format="yyyy-MM-dd"
              placeholder="选择年"
            >
            </el-date-picker>
          </template> -->
        </el-form-item>
        <el-form-item label="备注" prop="remark" class="text-line">
          <el-input
            placeholder="请输入备注"
            type="textarea"
            resize="none"
            v-model="fromData.remark"
            maxlength="50"
          ></el-input>
        </el-form-item>
      </el-form>
    </v-drawer>
    <el-drawer
      :close-on-press-escape="false"
      :wrapperClosable="false"
      :visible.sync="drawer1"
      :modal-append-to-body="false"
      size="820px"
      :show-close="true"
      :withHeader="false"
      :destroy-on-close="true"
    >
      <header>
        <font class="fs20 draw-tit">任务分解</font>
        <i class="el-icon-close cp" @click="drawer1 = false"></i>
      </header>
      <section id="section-box">
        <v-decompose
          @closeFn="drawer1 = false"
          :id="fromObj.detailId"
          @submitFn="resolveUpdate"
          :outTxt="fromObj.output"
          :list="FjList"
          :contentTxt="fromObj.content"
        ></v-decompose>
      </section>
    </el-drawer>
    <v-drawer
      :title="'项目/单位支撑-服务'"
      :drawerW="'975px'"
      :drawer="drawer2"
      :readOnly="true"
      :type="2"
      @closeFn="closeFn"
    >
      <v-braceService></v-braceService>
    </v-drawer>
    <v-drawer
      :title="'项目/单位支撑-销售'"
      :drawerW="'975px'"
      :drawer="drawer3"
      @submitFn="xsSaveFn"
      :type="3"
      @closeFn="closeFn"
    >
      <v-braceSell @returnList="receiveFn"></v-braceSell>
    </v-drawer>
  </div>
</template>
<script>
import braceService from "@/components/braceService";
import braceSell from "@/components/braceSell";
import decompose from "@/components/decompose";
import statistic from "@/components/statistic";
export default {
  name: "planDetailed", // 结构名称
  data() {
    return {
      // 数据模型a
      timeValue:[],
      typeTxt: "",
      tableData: [],
      data: {
        pageNo: 1,
        pageSize: 30,
        planId: ""
      },
      total: 0,
      isajax: true,
      title: "",
      drawer: false,
      drawer1: false,
      drawer2: false,
      drawer3: false,
      fromData: {},
      fromObj: {},
      workNatureList: [
        {
          label: "量化",
          value: 0
        },
        {
          label: "非量化",
          value: 1
        }
      ],
      mask: false,
      fromFjList: [], //表单内分解的list
      FjList: [],
      receiveList: [],
      isSave:true,
      isSave1:true,
      disabled:false,
    };
  },
  watch: {
    // 监控集合
    // timeValue(val, old) {
    //   if (val) {
    //     let start, end;
    //     let nowY = new Date(val).getFullYear();
    //     const oneD = 86400000;
    //     if (this.$route.query.type == 0) {
    //       //年计划
    //       start = val;
    //       let nextY = nowY + 1;
    //       let nextStr = nextY + "-01-01";
    //       let nextTime = new Date(nextStr).getTime() - oneD;
    //       end = this.formatDate(nextTime);
    //     } else if (this.$route.query.type == 1) {
    //       //月计划
    //       start = val;
    //       let nextM = new Date(val).getMonth() + 2;
    //       if (nextM < 10) {
    //         nextM = "0" + nextM;
    //       }
    //       let nextStr = nowY + "-" + nextM + "-01";
    //       let nextTime = new Date(nextStr).getTime() - oneD;
    //       end = this.formatDate(nextTime);
    //     } else if (this.$route.query.type == 2) {
    //       //周计划
    //       let nowTimestr = new Date(val).getTime();
    //       start = this.formatDate(nowTimestr - oneD);
    //       let nextW = nowTimestr + 5 * oneD;
    //       end = this.formatDate(nextW);
    //     }
    //     this.fromData.startDate = start;
    //     this.fromData.endDate = end;
    //   } else {
    //     this.fromData.startDate = "";
    //     this.fromData.endDate = "";
    //   }
    // }
  },
  components: {
    "v-decompose": decompose, //任务分解
    "v-braceService": braceService, //服务支撑
    "v-braceSell": braceSell, //销售支撑
    "v-statistic": statistic //支撑统计
  },
  props: {
    // 集成父级参数
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    if (this.$route.query.type == 0) {
      this.typeTxt = "年计划";
    } else if (this.$route.query.type == 1) {
      this.typeTxt = "月计划";
    } else {
      this.typeTxt = "周计划";
    }
    if (sessionStorage.getItem("userid")) {
      this.userId = sessionStorage.getItem("userid");
    } else {
      this.userId = "3A27BD25-8567-479D-9D96-1BA7BBEC5F0E"; //当前用户id
    }
    this.data.planId = this.$route.query.id;
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
    returnResolve(val) {
      if(val){
        return val.replace(/;/g, "<br>");
      }else{
        return ''
      }
    },
    indexFn(index) {
      let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
      return n;
    },
    timeClick(val){
      this.fromData.startDate = val[0];
      this.fromData.endDate = val[1];
      if(this.fromFjList.length>0){
        for(let x of this.fromFjList){
          x.startDate=val[0];
          x.endDate=val[1];
        }
      }
    },
    resolveUpdate(p) {//单个任务分解更新
      // this.drawer1 = false;
      let d=JSON.parse(JSON.stringify(this.fromObj));
      d.planId = this.$route.query.id;
      let data={
        detail:d,
        userId:this.userId,
        resolve:JSON.parse(JSON.stringify(p))
      }
      this.$http({
        method: "post",
        url: "/sv/plan/detail/update",
        data:data
      }).then(res => {
        if (res.succ) {
          this.$message({
            title: "成功",
            message: res.data,
            type: "success"
          });
          this.drawer1 = false;
          this.ajax();
        }
      });
    },
    resolveFn() {
      this.$http({
        method: "get",
        url: "/sv/plan/detail/resolveList",
        params: {
          detailId: this.fromObj.detailId
        }
      }).then(res => {
        if (res.succ) {
          this.FjList = res.data;
          this.drawer1 = true;
        }
      });
    },
    creatFn() {
      this.disabled=false;
      let d = new Object();
      if (this.$refs.fromData) {
        this.$refs.fromData.resetFields();
      }
      d.workNature = 0;
      d.startDate=this.$route.query.startDate;
      d.endDate=this.$route.query.endDate;
      this.fromData = JSON.parse(JSON.stringify(d));
      this.fromFjList = [];
      this.timeValue[0] =this.$route.query.startDate;
      this.timeValue[1] =this.$route.query.endDate;
      this.drawer = true;
      this.title = "新建计划明细";
    },
    editFn() {
      this.disabled=false;
      this.$http({
        url:"/sv/plan/detail/editPermiss",
        params:{
          detailId:this.fromObj.detailId,
          userId:this.userId,
        }
      }).then(res=>{
        if(!res.data){
          this.disabled=true
        }
      })
      this.$http({
        method: "get",
        url: "/sv/plan/detail/resolveList",
        params: {
          detailId: this.fromObj.detailId
        }
      }).then(res => {
        if (res.succ) {
          this.fromFjList = res.data;
        }
      });
      this.fromData = JSON.parse(JSON.stringify(this.fromObj));
      this.timeValue[0] = this.fromData.startDate;
      this.timeValue[1]=this.fromData.endDate;
      this.drawer = true;
      this.title = "编辑计划明细";
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
            detailId: this.fromObj.detailId,
            userId:this.userId,
          },
          url: "/sv/plan/detail/delete"
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
          if(!this.isSave){
              return false
          }
          this.isSave=false
          // if (!this.fromFjList||this.fromFjList.length==0) {
          //   this.$message({
          //     message: "任务分解不得为空",
          //     type: "warning"
          //   });
          //   return false;
          // }
          
          let d = JSON.parse(JSON.stringify(this.fromData));
          for (let x in d) {
            if (x == "resolve") {
              delete d[x];
            }
          }
          d.planId = this.$route.query.id;
          let data={
            detail:d,
            userId:this.userId,
            resolve:JSON.parse(JSON.stringify(this.fromFjList))
          }
          this.$http({
            method: "post",
            url: "/sv/plan/detail/update",
            data:data
          }).then(res => {
            if (res.succ) {
              this.drawer = false;
              this.$message({
                title: "成功",
                message: res.data,
                type: "success"
              });
              this.isSave=true;
              this.ajax();
            }else{
              this.isSave=true;
            }
          });
        }
      });
    },
    addResolve(p) {//新建或编辑时记录任务分解
      let arr = [];
      for (let x of p) {
        let str = x.name + "," + x.output;
        arr.push(str);
      }
      this.fromFjList = JSON.parse(JSON.stringify(p));
      // let d=new Object();
      // d.resolve=arr.join(';');
      // d.resolveIds=p.resolveIds;
      this.fromData.resolve = arr.join(";");
      // this.fromData.resolveIds = p.resolveIds;
      // this.fromData=Object.assign(d,this.fromData);
      this.mask = false;
    },
    tableSelectFn(currentRow, oldCurrentRow) {
      //表格选中时
      if (currentRow) {
        let obj = JSON.parse(JSON.stringify(currentRow));
        this.fromObj = obj;
      }
    },
    pageNoChange(val) {
      this.data.pageNo = val;
      this.ajax();
    },
    ajax() {
      this.isajax = true;
      this.tableData.splice(0);
      let that = this;
      let d = this.data;
      this.$http({
        method: "get",
        params: d,
        url: "/sv/plan/detail/list"
      }).then(res => {
        if (res.succ) {
          this.isajax = false;
          this.tableData = res.data.data;
          this.total = res.data.total;
          this.$refs.list.setCurrentRow(this.tableData[0]);
        }
      });
    },
    receiveFn(p) {
      this.receiveList = JSON.parse(JSON.stringify(p.list));
    },
    xsSaveFn() {
      if(!this.isSave1){
          return false
      }
      this.isSave1=false
      let d = JSON.parse(JSON.stringify(this.receiveList));
      this.$http({
        method: "post",
        url: "/sv/plan/support/sell/save",
        data: d
      }).then(res => {
        if (res.data) {
          this.drawer3 = false;
          this.$message({
            title: "成功",
            message: "保存成功",
            type: "success"
          });
          this.isSave1=true;
          this.$refs.statistic.getCount()
        } else {
          this.isSave1=true;
          this.$message.error({
            message: "保存失败"
          });
        }
      });
    },
    closeFn(){
      this.$refs.statistic.getCount()
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.planDetailed {
  .top-box {
    margin-bottom: 15px;
    .hover-color {
      i {
        margin-right: 5px;
      }
    }
    .tit-type {
      font-size: 16px;
      color: #2796ff;
      padding-left: 8px;
      position: relative;
      &::before {
        content: "";
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 3px;
        background: #2796ff;
        height: 14px;
        left: 0;
      }
    }
  }
  .mask-box {
    position: fixed;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    z-index: 1;
    .mask-content{
      background: #fff;
      min-width: 788px;
      min-height: 60vh;
      width: 50vw;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      border-radius: 4px;
    }
    .dia-tit {
      background: #1989fa;
      line-height: 40px;
      padding: 0 20px;
      border-radius: 4px 4px 0 0;
    }
  }
}
.search-btn {
  width: 58px;
  border: 1px solid #2796ff;
  color: #2796ff;
  line-height: 33px;
  text-align: center;
  outline: none;
  background: #fff;
  border-radius: 4px;
}
.planDetailed /deep/ .el-drawer {
  overflow: inherit;
}
.planDetailed /deep/ #content-box {
  overflow-y: inherit;
}
.el-drawer {
  header {
    padding: 20px;
    position: relative;
    i {
      position: absolute;
      top: 15px;
      right: 15px;
    }
  }
  section {
    max-height: calc(100vh - 140px);
    overflow-y: auto;
    padding: 0 25px;
  }
}
</style>

<!-- 模型： DOM 结构 -->
<template>
  <div class="detailed">
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
        <span class="drc ml30">
          <font class="fs13" style="margin-right:12px">部门</font>
          <el-cascader
            style="width:140px;"
            size="small"
            placeholder="请选择部门"
            v-model="value"
            :options="depList"
            @change="departFn"
            :props="{ label: 'depName', value: 'depId' }"
            :clearable="true"
          ></el-cascader>
          <!-- <el-select
                    v-model="data.departId"
                    placeholder="请选择"
                    size="small"
                    style="width:122px"
                    @change="departFn"
                    >
                        <el-option
                            v-for="item in depList"
                            :key="item.depId"
                            :label="item.depName"
                            :value="item.depId"
                        ></el-option>
                    </el-select> -->
        </span>
        <span class="drc ml30">
          <font class="fs13" style="margin-right:12px">人员</font>
          <el-select
            v-model="data.userId"
            placeholder="请选择"
            size="small"
            style="width:122px"
          >
            <el-option
              v-for="item in perponList"
              :key="item.userId"
              :label="item.name"
              :value="item.userId"
            ></el-option>
          </el-select>
        </span>
        <span
          class="drc cp operate ml30 hover-color"
          @click="exportFn"
          v-if="tableData && tableData.length > 0"
        >
          <i class="icon iconfont icondaochu"></i>
          <font class="fs13">导出excel</font>
        </span>
      </div>
    </div>
    <div class="table-box">
      <el-table
        cell-class-name="fs13 table-h"
        header-cell-class-name="table-header table-h"
        border
        ref="list"
        height="calc(100vh - 185px)"
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
        <el-table-column
          align="center"
          min-width="100"
          label="姓名"
          prop="person"
        ></el-table-column>
        <el-table-column
          align="left"
          min-width="200"
          header-align="center"
          label="单位"
          prop="company"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.company" placement="right">
              <span class="text-over">{{ scope.row.company }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          min-width="200"
          header-align="center"
          label="项目"
          prop="projName"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.projName" placement="right">
              <span class="text-over">{{ scope.row.projName }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          label="销售人员"
          prop="allotUserName"
        ></el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          label="客户联系人"
          prop="contact"
        ></el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          label="服务来源"
          prop="sourceFrom"
        ></el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          label="服务类型"
          prop="type"
        ></el-table-column>
        <el-table-column
          align="center"
          min-width="110"
          label="服务时间"
          prop="serverTime"
        ></el-table-column>
        <el-table-column
          align="center"
          min-width="200"
          label="服务内容"
          prop="description"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.description" placement="right">
              <span class="text-over">{{ scope.row.description }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          label="处理阶段"
          prop="status"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status == '未处理'" class="red-txt fs14"
              >待处理</span
            >
            <span
              v-else-if="scope.row.status == '进行中'"
              class="yellow-txt fs14"
              >处理中</span
            >
            <span v-else class="green-txt fs14">{{ scope.row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" min-width="80" label="反馈详情">
          <template slot-scope="scope">
            <span class="draw-tit cp fs14" @click="feedbackFn(scope.row)"
              >查看</span
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
    <v-d :drawer="drawer1" :id="id" :from="rowFrom" :type="1"></v-d>
  </div>
</template>
<script>
import drawer1 from "@/components/drawer1";
export default {
  name: "detailed", // 结构名称
  data() {
    return {
      // 数据模型a
      isajax: true,
      total: 0,
      timer: "",
      data: {
        pageNo: 1,
        pageSize: 20,
        userId: null,
        departId: null,
        start: null,
        end: null
      },
      tableData: [],
      depList: [],
      perponList: [],
      drawer1: false,
      id: "", //反馈问题id
      rowFrom: "", //反馈问题来源
      value: ""
    };
  },
  watch: {
    // 监控集合
    data: {
      deep: true,
      handler(val, old) {
        this.ajax();
      }
    },
    value(val, old) {
      this.data.departId = val[val.length - 1];
    }
  },
  components: {
    "v-d": drawer1
  },
  props: {
    // 集成父级参数
  },
  beforeCreate() {
    // console.group('创建前状态  ===============》beforeCreate');
  },
  created() {
    // console.group('创建完毕状态===============》created');
    this.ajax();
    this.getDepart();
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
        method: "post",
        data: d,
        url: "/so/report/server/detail/list"
      }).then(res => {
        this.isajax = false;
        if (res.succ) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    timeClick(val) {
      //时间监听
      if (val) {
        this.data.start = val[0];
        this.data.end = val[1];
      } else {
        this.data.start = null;
        this.data.end = null;
      }
      this.data.pageNo = 1;
    },
    indexFn(index) {
      let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
      return n;
    },
    exportFn() {
      //导出
      window.open(
        // baseUrl +
        // "/so/report/server/detail/excel?departId=" +this.data.departId +
        // "&start=" +this.data.start+
        // "&userId=" +this.data.userId+
        // "&end=" +this.data.end,
        // "_blank"
        baseUrl + "/so/report/server/detail/excel",
        "_blank"
      );
    },
    getDepart() {
      //获取组织关系
      let c = JSON.parse(sessionStorage.getItem("depart"));
      this.depList = c;
    },
    departFn() {
      this.data.userId = "";
      this.data.pageNo = 1;
      this.perponList = [];
      let id;
      if (val.length > 0) {
        id = val[val.length - 1];
      } else {
        return false;
      }
      this.$http({
        method: "get",
        url: "/common/departUser",
        params: {
          depId: id
        }
      }).then(res => {
        if (res.succ) {
          this.perponList = res.data;
        }
      });
    },
    pageNoChange(val) {
      this.data.pageNo = val;
      this.ajax();
    },
    feedbackFn(row) {
      this.drawer1 = true;
      this.id = row.id;
      // this.rowFrom = false;
      // if (row.sourceFrom == "工单" ||row.sourceFrom == "内部") {
      //     if (row.sourceFrom == "工单") {
      //         this.rowFrom = true;
      //     }
      // }
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.detailed {
  .top-box {
    margin-bottom: 15px;
    .operate {
      i {
        margin-right: 5px;
      }
    }
  }
}
</style>

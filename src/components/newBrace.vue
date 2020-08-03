<!-- 模型： DOM 结构 -->
<template>
  <div class="newBrace">
    <div class="top-box dfrcb">
      <div class="drc">
        <span class="drc mr15" v-if="supType == 1">
          <font class="fs13" style="margin-right:12px">来源</font>
          <el-select
            v-model="source"
            placeholder="请选择"
            size="small"
            style="width:122px"
            @change="data.pageNo=1"
          >
            <el-option label="私海" value="私海"></el-option>
            <el-option label="公海" value="公海"></el-option>
          </el-select>
        </span>
        <span class="drc mr15">
          <font class="fs13" style="margin-right:12px">地区</font>
          <el-cascader
            placeholder="请选择地区"
            ref="cascader"
            style="width:140px;"
            size="small"
            v-model="value"
            :options="options"
            @change="regionWacth"
            :props="{
              label: 'areaName',
              value: 'areaId',
              checkStrictly: true
            }"
            :clearable="true"
          ></el-cascader>
        </span>
        <span class="drc mr15" v-if="supType == 1">
          <font class="fs13" style="margin-right:12px">漏斗</font>
          <el-select
            v-model="funnel"
            placeholder="请选择"
            size="small"
            style="width:122px"
            @change="data.pageNo=1"
          >
            <el-option
              v-for="item in funnelList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </span>
        <div class="comname-ipt" @keydown.13="keywordFn">
          <input
            type="text"
            v-model="data.searchCompName"
            placeholder="请输入关键字"
          />
          <i class="el-icon-search cp" slot="append" @click="keywordFn"></i>
        </div>
      </div>
    </div>
    <div class="table-box">
      <el-table
        cell-class-name="fs13 table-h"
        header-cell-class-name="table-header table-h"
        border
        ref="list"
        height="calc(100vh - 250px)"
        :data="tableData"
        style="width:100%"
        v-loading="isajax"
        :row-key="getRowKey"
        @selection-change="seleChange"
        element-loading-text="数据正在加载中"
        element-loading-spinner="el-icon-loading"
      >
        <el-table-column
          align="center"
          :reserve-selection="true"
          class-name="serial-num"
          type="selection"
        ></el-table-column>
        <el-table-column
          align="center"
          width="60"
          label="序号"
          type="index"
          :index="indexFn"
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
          header-align="center"
          min-width="150"
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
        <el-table-column align="center" label="漏斗" width="125" prop="funnel">
          <template slot-scope="scope">
            <span>{{ scope.row.funnel | funnelFn }}</span>
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
  </div>
</template>
<script>
export default {
  name: "newBrace", // 结构名称
  data() {
    return {
      // 数据模型a
      source: "私海",
      funnel: 99,
      value: "",
      isajax: true,
      total: 0,
      data: {
        pageNo: 1,
        pageSize: 20,
        searchCompName: null,
        ppid: null
      },
      tableData: [],
      funnelList: [
        {
          label: "全部",
          value: 99
        },
        {
          label: "早期联系",
          value: 1
        },
        {
          label: "深度意向",
          value: 2
        },
        {
          label: "上会/培训",
          value: 3
        },
        {
          label: "签约",
          value: 4
        },
        {
          label: "回款",
          value: 5
        },
        {
          label: "复购",
          value: 6
        },{
            label: "无",
            value:0
        }
      ],
      userId: ""
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
    source(val, old) {
      this.data.source = val;
      this.ajax();
    },
    funnel(val, old) {
      this.data.funnel = val;
      this.ajax();
    },
    isload(val, old) {
      this.ajax();
    }
  },
  props: {
    // 集成父级参数
    supType: {
      default: null
    },
    isload: {
      default: null
    }
  },
  filters: {
    funnelFn(val) {
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
      } else if (val == 6) {
        return "复购";
      } else {
        return "";
      }
    }
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
    let city = JSON.parse(localStorage.getItem("cityAllTree"));
    this.options = city;
    if (this.supType == 1) {
      this.data.source = "私海";
      this.data.funnel = 99;
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
    getRowKey(row){
      return row.comId+row.projId
    },
    ajax() {
      this.isajax = true;
      this.tableData.splice(0);
      this.$refs.list.clearSelection();
      let that = this;
      let d = this.data;
      let url;
      if (this.supType == 0) {
        url = "/sv/plan/support/server/addList";
      } else if (this.supType == 1) {
        url = "/sv/plan/support/sell/addList";
      }
      this.$http({
        method: "get",
        params: d,
        url: url
      }).then(res => {
        this.isajax = false;
        if (res.succ) {
          this.tableData = res.data.data;
          this.total = res.data.total;
        }
      });
    },
    seleChange(sele) {
      let arr = [];
      for (let x of sele) {
        let d = {
          compId: x.comId,
          planId:this.data.ppid ,
          planType: this.$route.query.type,
          projId: x.projId,
          responsibleId: this.userId,
          supType: this.supType
        };
        arr.push(d);
      }
      this.$emit("returnAdd", { addlist: arr });
      // this.addList=JSON.parse(JSON.stringify(arr));
    },
    indexFn(index) {
      let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
      return n;
    },
    pageNoChange(val) {
      // this.$refs.list.clearSelection();
      this.data.pageNo = val;
      this.ajax();
    },
    keywordFn() {
      // this.$refs.list.clearSelection();
      this.data.pageNo = 1;
      // this.total = 0;
      this.ajax();
    },
    regionWacth(val) {
      this.$refs.cascader.dropDownVisible = false;
      this.data.areaCode = val[val.length - 1];
      this.data.pageNo=1;
      this.ajax();
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
    }
  }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.newBrace {
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
        height: 34px;
        line-height: 34px;
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

<!-- 模型： DOM 结构 -->
<template>
  <div class="supplier">
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
    </div>
    <div class="table-box">
      <el-table
        cell-class-name="fs13 table-h"
        ref="ownList"
        @current-change="tableSelectFn"
        highlight-current-row
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
          header-align="center"
          align="left"
          label="供应商名称"
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
          align="center"
          label="负责人"
          prop="comManager"
        ></el-table-column>
        <el-table-column
          align="center"
          label="手机号码"
          prop="comPhone"
        ></el-table-column>
        <el-table-column align="center" label="省/市/区/县" prop="comRegion">
          <template slot-scope="scope">
            <el-tooltip :content="returnRegion(scope.row)" placement="right">
              <span class="text-over">
                {{ returnRegion(scope.row) }}
              </span>
            </el-tooltip>
          </template>
          <!-- <template slot-scope="scope">{{ returnRegion(scope.row) }}</template> -->
        </el-table-column>
        <el-table-column align="center" label="认证状态" prop="comAuthstatus">
          <template slot-scope="scope">
            {{ scope.row.comAuthstatus | comAuthstatus }}
          </template>
        </el-table-column>
      </el-table>
    </div>
    <v-drawer
      :title="title"
      :drawer="drawer"
      :drawerW="'850px'"
      @submitFn="submitFn"
    >
      <el-form
        :model="fromData"
        label-width="80px"
        size="medium"
        ref="fromData"
      >
        <div class="dfrb">
          <el-form-item label="公司名称" prop="comName" :rules="rules.comName">
            <el-autocomplete
              placeholder="请输入公司名称"
              v-model="fromData.comName"
              @select="corpCodeSelect"
              :fetch-suggestions="corpCodeAjax"
              :trigger-on-focus="false"
            >
              <template slot-scope="{ item }">
                <span :title="item.jgmc">{{ item.jgmc }}</span>
              </template>
            </el-autocomplete>
            <!-- <el-input v-model="fromData.comName"></el-input> -->
          </el-form-item>
          <div style="display:flex;align-items:end">
            <el-form-item
              label-width="126px"
              label="统一社会信用代码"
              prop="corpCode"
              :rules="rules.corpCode"
            >
              <el-input
                placeholder="请输入统一社会信用代码"
                v-model="fromData.corpCode"
              ></el-input>
            </el-form-item>
            <button class="ml10 search-btn cp" @click.prevent="searchFn">
              点击查询
            </button>
          </div>
        </div>
        <div class="dfrb" style="padding-right: 74px;">
          <el-form-item label="所属地区" prop="re" :rules="rules.comRegion">
            <el-cascader
              placeholder="请选择所属地区"
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
            <!-- <v-region style="width:202px" :region="fromData.comRegion" @regionChange='regionWacth'></v-region> -->
          </el-form-item>
          <el-form-item label="负责人" prop="comManager">
            <el-input
              placeholder="请输入负责人"
              v-model="fromData.comManager"
              maxlength="15"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb" style="padding-right: 74px;">
          <el-form-item
            label="手机号码"
            prop="comPhone"
            :rules="rules.comPhone"
          >
            <el-input
              placeholder="请输入手机号码"
              v-model="fromData.comPhone"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="comTel">
            <el-input
              placeholder="请输入电话"
              v-model="fromData.comTel"
              maxlength="25"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb" style="padding-right: 74px;">
          <el-form-item
            label="电子邮箱"
            prop="comEmail"
            :rules="rules.comEmail"
          >
            <el-input
              placeholder="请输入电子邮箱"
              v-model="fromData.comEmail"
              maxlength="25"
            ></el-input>
          </el-form-item>
          <el-form-item label="传真" prop="comFax">
            <el-input
              placeholder="请输入传真"
              v-model="fromData.comFax"
              maxlength="25"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb" style="padding-right: 74px;">
          <el-form-item label="地址" prop="comAddr">
            <el-input
              placeholder="请输入地址"
              v-model="fromData.comAddr"
              maxlength="250"
            ></el-input>
          </el-form-item>
          <el-form-item label="网址" prop="comWeb">
            <el-input
              placeholder="请输入网址"
              v-model="fromData.comWeb"
              maxlength="25"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb" style="padding-right: 74px;">
          <el-form-item label="系统名称" prop="comSystemname">
            <el-input
              placeholder="请输入系统名称"
              v-model="fromData.comSystemname"
              maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="comMemo">
            <el-input
              placeholder="请输入备注"
              v-model="fromData.comMemo"
              maxlength="50"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </v-drawer>
  </div>
</template>
<script>
import region from "@/components/region";
export default {
  name: "supplier", // 结构名称
  data() {
    return {
      // 数据模型a
      tableData: [],
      drawer: false,
      title: "",
      fromData: {},
      fromObj: {},
      id: "",
      searchList: [],
      isshow: false,
      rules: {
        comName: { required: true, message: "公司名称不得为空" },
        corpCode: [
          { required: true, message: "统一社会信用代码不得为空" },
          {
            pattern: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10})$/,
            message: "请输入正确的统一社会信用代码",
            trigger: ["blur", "change"]
          }
        ],
        comRegion: { required: true, message: "所属地区不得为空" },
        comPhone: {
          pattern: /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147,145))\d{8}$/,
          message: "请输入正确的手机号码",
          trigger: ["blur", "change"]
        },
        comEmail: {
          type: "email",
          message: "请输入正确的邮箱地址",
          trigger: ["blur", "change"]
        }
      },
      options: []
    };
  },
  components: {
    "v-region": region
  },
  computed: {},
  filters: {
    comAuthstatus(val) {
      if (val == 0) {
        return "未认证";
      } else if (val == 1) {
        return "中级";
      } else if (val == 2) {
        return "高级";
      } else if (val == 3) {
        return "政府";
      }
    }
  },
  watch: {
    // 监控集合
    comid: function(val, old) {
      if (val != "") {
        this.isshow = true;
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
    let city = JSON.parse(localStorage.getItem("cityAllTree"));
    this.options = city;
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
    creatFn() {
      // this.fromData.comRegion='';
      this.fromData = new Object();
      this.drawer = true;
      this.title = "新建供应商";
      if (this.$refs.fromData) {
        this.$refs.fromData.resetFields();
      }
    },
    editFn() {
      if (this.$refs.fromData) {
        this.$refs.fromData.resetFields();
      }
      this.fromData = JSON.parse(JSON.stringify(this.fromObj));
      this.drawer = true;
      this.title = "编辑供应商";
    },
    tableSelectFn(currentRow, oldCurrentRow) {
      //表格选中时
      if (currentRow) {
        let obj = JSON.parse(JSON.stringify(currentRow));
        obj.re = obj.comRegion;
        this.fromObj = obj;
        this.id = currentRow.comId;
      }
    },
    ajax(comid) {
      this.tableData.splice(0);
      this.$http({
        method: "get",
        url: "/so/supplier/list",
        params: {
          ownId: comid
        }
      }).then(res => {
        this.tableData = res.data;
        this.$refs.ownList.setCurrentRow(this.tableData[0]);
      });
    },
    regionWacth(p) {
      //监听地区组件返回的值
      this.$refs.cascader.dropDownVisible = false; //选中后隐藏下拉框
      let d = JSON.parse(JSON.stringify(this.fromData));
      if (this.fromData.re && this.fromData.re.length > 0) {
        d = this.fromData.re[this.fromData.re.length - 1];
        this.fromData.comRegion = d;
      } else if (!this.fromData.re) {
        let arr = this.fromData.comRegion.split("-");
        arr.pop();
        let arr1 = [];
        let str = "";
        arr.map(item => {
          str = str + item + "-";
          arr1.push(str);
        });
        console.log(arr1);
        this.fromData.re = arr1;
      }
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
    submitFn() {
      //提交
      this.$refs.fromData.validate(valid => {
        if (valid) {
          let data = this.fromData;
          data.comMgrid = this.comid;
          if (this.title == "新建供应商") {
            data.comId = null;
          } else {
            data.comId = this.id;
          }
          for (let x in data) {
            if (data[x] == null) {
              delete data[x];
            }
            if (x == "re") {
              delete data[x];
            }
          }
          this.editAddFn(data);
        }
      });
    },
    editAddFn(data) {
      this.$http({
        method: "post",
        url: "/so/supplier/save",
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
    corpCodeSelect(item) {
      this.$set(this.fromData, "corpCode", item.tyshxydm);
      this.fromData.comName = item.jgmc;
    },
    corpCodeAjax(str, cb) {
      //根据公司名称查询
      this.$http({
        method: "get",
        url: "http://api.jizhibao.com.cn/Account/GetCompanyListFromWebSite",
        params: {
          q: this.fromData.comName
        }
      }).then(res => {
        this.searchList = res;
        cb(res);
      });
    },
    searchFn() {
      //根据公司名称跳到信用中国
      if (this.fromData.comName && this.fromData.comName != "") {
        window.open(
          "https://www.creditchina.gov.cn/xinyongxinxi/index.html?index=0&scenes=defaultScenario&tableName=credit_xyzx_tyshxydm&searchState=2&entityType=1,2,4,5,6,7,8&keyword=" +
            this.fromData.comName,
          "_blank"
        );
      } else {
        this.$message({
          title: "警告",
          message: "公司名称不得为空",
          type: "warning"
        });
      }
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
.search-btn {
  width: 62px;
  border: 1px solid #1989fa;
  color: #1989fa;
  line-height: 30px;
  text-align: center;
  outline: none;
  background: #fff;
}
</style>

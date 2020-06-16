<template>
  <div class="service-owner">
    <el-container>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside
          width="170px"
          style="height:calc(100vh);padding-top: 15px;box-sizing: border-box;"
        >
          <ul class="prov bor-r" style="height: 100%;">
            <h5 class="fs13">区域</h5>
            <!-- :class="[o.selected?'active':'',(!o.children)&&o.selected?'listbg':'']" -->
            <li
              v-for="(o, i) of cityList"
              :key="i"
              :class="o.selected ? 'active' : ''"
            >
              <div
                class="prov-box dfrcb"
                @click="listTapFn(o)"
                style="padding:0 17px"
                :class="data.areaId == o.areaId ? 'listbg' : ''"
              >
                <div class="fs13 text-over" :title="o.areaName">
                  <template v-if="o.children">
                    <i
                      class="left-icon"
                      :class="
                        o.selected
                          ? 'el-icon-folder-remove'
                          : 'el-icon-folder-add'
                      "
                      @click="openTapFn(o)"
                    ></i>
                  </template>
                  <template v-else>
                    <i class="left-icon el-icon-document"></i>
                  </template>
                  {{ o.areaName }}
                </div>
                <i
                  class="fs13"
                  :class="
                    o.selected ? 'el-icon-arrow-down' : 'el-icon-arrow-right'
                  "
                  v-if="o.children"
                  @click="openTapFn(o)"
                ></i>
              </div>
              <ul class="city" v-if="o.children">
                <li
                  v-for="(x, y) of o.children"
                  :key="y"
                  style="text-indent:7px"
                  :class="x.selected ? 'active' : ''"
                >
                  <div
                    class="prov-box dfrcb"
                    @click="listTapFn(x)"
                    style="padding:0 17px"
                    :class="data.areaId == x.areaId ? 'listbg' : ''"
                  >
                    <div class="fs13 text-over" :title="x.areaName">
                      <template v-if="x.children">
                        <i
                          class="left-icon"
                          :class="
                            x.selected
                              ? 'el-icon-folder-remove'
                              : 'el-icon-folder-add'
                          "
                          @click="openTapFn(x)"
                        ></i>
                      </template>
                      <template v-else>
                        <i class="left-icon el-icon-document"></i>
                      </template>
                      {{ x.areaName }}
                    </div>
                    <i
                      class="fs13"
                      :class="
                        x.selected
                          ? 'el-icon-arrow-down'
                          : 'el-icon-arrow-right'
                      "
                      v-if="x.children"
                      @click="openTapFn(x)"
                    ></i>
                  </div>
                  <ul class="area" v-if="x.children">
                    <li
                      v-for="(item, n) of x.children"
                      :key="n"
                      style="text-indent:14px"
                    >
                      <div
                        class="prov-box dfrcb"
                        @click="listTapFn(item)"
                        style="padding:0 17px"
                        :class="data.areaId == item.areaId ? 'listbg' : ''"
                      >
                        <div class="fs13 text-over" :title="item.areaName">
                          <i class="left-icon el-icon-document"></i>
                          {{ item.areaName }}
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
        </el-aside>
        <!-- 内容 -->
        <el-main style="box-sizing: border-box;height:100vh">
          <div class="main-top">
            <div class="top-box dfrcb mb10">
              <div class="drc">
                <div class="drc">
                  <font class="fs13 tit-txt">业主</font>
                  <div class="comname-ipt" @keydown.13="comNameFn">
                    <input
                      type="text"
                      v-model="data.comName"
                      placeholder="请输入关键字"
                    />
                    <i
                      class="el-icon-search cp"
                      slot="append"
                      @click="comNameFn"
                    ></i>
                  </div>
                </div>
                <!--  -->
                <div
                  class="drc cp hover-color"
                  @click="editFn"
                  v-if="tableData && tableData.length > 0"
                >
                  <i class="icon iconfont iconbianji"></i>
                  <font class="fs13">修改</font>
                </div>
              </div>
              <div class="drc">
                <span class="fs13 tit-txt">客户等级：</span>
                <span
                  class="fs13 tit-txt lvclass mr20"
                  :class="o.value == data.grade ? 'active' : ''"
                  v-for="(o, i) of customerLv"
                  :key="i"
                  @click="customerLvFn(o)"
                  >{{ o.name }}</span
                >
              </div>
            </div>
            <div class="table-box">
              <!-- <template v-if="isajax"> -->
              <el-table
                ref="serverList"
                @current-change="tableSelectFn"
                height="35vh"
                cell-class-name="fs13 table-h"
                highlight-current-row
                header-cell-class-name="table-header table-h"
                border
                :data="tableData"
                style="width:100%"
                v-loading="isajax"
                element-loading-text="数据正在加载中"
                element-loading-spinner="el-icon-loading"
              >
                <el-table-column
                  align="center"
                  fixed
                  class-name="serial-num"
                  width="50"
                  label="序号"
                  type="index"
                  :index="indexFn"
                ></el-table-column>
                <el-table-column
                  align="center"
                  fixed
                  label="省份"
                  min-width="70"
                  prop="province"
                ></el-table-column>
                <el-table-column
                  align="center"
                  fixed
                  label="市州"
                  min-width="70"
                  prop="city"
                >
                  <template slot-scope="scope">
                    <el-tooltip :content="scope.row.city" placement="left">
                      <span class="text-over">
                        {{ scope.row.city }}
                      </span>
                    </el-tooltip>
                  </template>
                </el-table-column>
                <el-table-column
                  header-align="center"
                  align="left"
                  fixed
                  label="名称"
                  min-width="182"
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
                  label="销售负责人"
                  min-width="120"
                  prop="allotUserName"
                ></el-table-column>
                <el-table-column
                  align="center"
                  label="负责人"
                  min-width="120"
                  prop="comManager"
                ></el-table-column>
                <el-table-column
                  align="center"
                  label="手机号码"
                  min-width="130"
                  prop="comPhone"
                ></el-table-column>
                <el-table-column
                  align="center"
                  label="电子邮箱"
                  min-width="170"
                  prop="comEmail"
                ></el-table-column>
                <el-table-column
                  align="center"
                  label="服务进度"
                  min-width="270"
                  prop="process"
                >
                  <template slot-scope="scope">
                    <span :class="scope.row.process != '无' ? 'red-txt' : ''">
                      {{ scope.row.process }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  label="销售添加时间"
                  min-width="185"
                  prop="allotTime"
                ></el-table-column>
                <el-table-column
                  align="center"
                  label="注册时间"
                  min-width="170"
                  prop="createTime"
                ></el-table-column>
                <el-table-column
                  align="center"
                  label="客户等级"
                  min-width="115"
                  prop="grade"
                ></el-table-column>
                <el-table-column
                  align="center"
                  label="跟进数"
                  min-width="100"
                  prop="followNum"
                ></el-table-column>
              </el-table>
              <!-- </template>
                            <template v-else>
                                <div style="min-height:240px" v-loading="loading" element-loading-text="拼命加载中"></div>
                            </template> -->
            </div>
            <div class="page-box dfrcb">
              <span class="fs13">
                显示{{ (data.pageNo - 1) * data.pageSize + 1 }}到{{
                  total > data.pageNo * data.pageSize
                    ? data.pageNo * data.pageSize
                    : total
                }}，共{{ total }}条记录
              </span>
              <div class="drc">
                <el-pagination
                  @size-change="pageSizeChange"
                  @current-change="pageNoChange"
                  :current-page="data.pageNo"
                  :page-sizes="[30, 50, 100]"
                  :page-size="data.pageSize"
                  layout="prev,pager,next,jumper,sizes"
                  :total="total"
                ></el-pagination>
                <div class="drc cp" @click="refreshFn">
                  <i class="el-icon-refresh-right"></i>
                  <span class="fs13">刷新</span>
                </div>
              </div>
            </div>
          </div>
          <div class="main-bottom">
            <div class="tab-box">
              <el-tabs
                v-model="tabNum"
                :stretch="false"
                @tab-click="tabChangeFn"
              >
                <el-tab-pane
                  v-for="(o, i) of tabList"
                  :key="i"
                  :label="o.name"
                  :name="o.path"
                ></el-tab-pane>
              </el-tabs>
            </div>
            <router-view
              :comid="comid"
              :comName="comname"
              :allotUserName="fromData.allotUserName"
            />
          </div>
        </el-main>
      </el-container>
    </el-container>
    <v-drawer :title="'修改业主信息'" :drawer="drawer" @submitFn="submitFn">
      <el-form
        :model="fromData"
        ref="fromData"
        label-width="80px"
        size="medium"
      >
        <div class="dfrb">
          <el-form-item
            label="单位名称"
            prop="comName"
            :rules="{ required: true, message: '单位名称不得为空' }"
          >
            <el-input
              placeholder="请输入单位名称"
              v-model="fromData.comName"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="负责人"
            prop="comManager"
            :rules="{ required: true, message: '负责人不得为空' }"
          >
            <el-input
              placeholder="请输入负责人"
              v-model="fromData.comManager"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="手机号码"
            prop="comPhone"
            :rules="[
              { required: true, message: '手机号码不得为空' },
              {
                pattern: /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147,145))\d{8}$/,
                message: '请输入正确的手机号码',
                trigger: ['blur', 'change']
              }
            ]"
          >
            <el-input
              placeholder="请输入手机号码"
              v-model="fromData.comPhone"
            ></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="comTel">
            <el-input
              placeholder="请输入电话"
              v-model="fromData.comTel"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="地址" prop="comAddr">
            <el-input
              placeholder="请输入地址"
              v-model="fromData.comAddr"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="电子邮箱"
            prop="comEmail"
            :rules="{
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: ['blur', 'change']
            }"
          >
            <el-input
              placeholder="请输入电子邮箱"
              v-model="fromData.comEmail"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="传真" prop="comFax">
            <el-input
              placeholder="请输入传真"
              v-model="fromData.comFax"
            ></el-input>
          </el-form-item>
          <el-form-item label="所属地区" prop="comRegion">
            <v-region
              style="width:202px"
              :region="fromData.comRegion"
              @regionChange="regionWacth"
            ></v-region>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="网址" prop="comWeb">
            <el-input
              placeholder="请输入网址"
              v-model="fromData.comWeb"
            ></el-input>
          </el-form-item>
          <el-form-item label="系统名称" prop="comSystemname">
            <el-input
              placeholder="请输入系统名称"
              v-model="fromData.comSystemname"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="备注" prop="comMemo" class="text-line">
          <el-input
            placeholder="请输入备注"
            type="textarea"
            resize="none"
            v-model="fromData.comMemo"
          ></el-input>
        </el-form-item>
      </el-form>
    </v-drawer>
  </div>
</template>
<script>
import region from "@/components/region";
export default {
  name: "serviceOwner",
  data() {
    return {
      isajax: true,
      cityList: [], //城市list
      customerLv: [
        {
          name: "全部",
          value: "all"
        },
        {
          name: "A类",
          value: "A"
        },
        {
          name: "B类",
          value: "B"
        },
        {
          name: "C类",
          value: "C"
        },
        {
          name: "其他",
          value: "其它"
        }
      ], //客户等级选择list
      tableData: [], //表格列表
      data: {
        areaId: "all",
        comName: "",
        grade: "all",
        pageNo: 1,
        pageSize: 30
      },
      total: 0,
      tabList: [
        {
          name: "组织",
          path: "organize"
        },
        {
          name: "用户",
          path: "user"
        },
        {
          name: "项目",
          path: "project"
        },
        {
          name: "供应商",
          path: "supplier"
        },
        {
          name: "方法论",
          path: "method"
        },
        {
          name: "跟进记录",
          path: "record"
        },
        {
          name: "服务",
          path: "service"
        },
        {
          name: "合同",
          path: "contract"
        },
        {
          name: "归档",
          path: "file"
        }
        // {
        //     name:'单位授权',
        //     path:'empower'
        // }
      ],
      tabNum: "organize",
      drawer: false,
      fromData: { comRegion: "" },
      fromObj: {},
      comid: "",
      comname: ""
    };
  },
  components: {
    "v-region": region
  },
  watch: {
    tableData(val) {
      //默认选中第一项
      this.$refs.serverList.setCurrentRow(this.tableData[0]);
    }
  },
  beforeCreate() {
    let that = this;
    if (!localStorage.getItem("cityAllTree")) {
      this.$http({
        method: "get",
        url: "/so/area/all"
      }).then(res => {
        let d = JSON.parse(JSON.stringify(res.data));
        let c = that.getTreeDic("", d);
        localStorage.setItem("cityAllTree", JSON.stringify(c));
      });
    }
    if (!sessionStorage.getItem("cityTree")) {
      this.$http({
        method: "get",
        url: "/so/area/server"
      }).then(res => {
        sessionStorage.setItem("cityTree", JSON.stringify(res.data));
        let city = JSON.parse(sessionStorage.getItem("cityTree"));
        city = this.getTreeDic("", city);
        let obj = {
          areaId: "all",
          areaName: "全部",
          selected: false,
          children: null
        };
        city.unshift(obj);
        this.cityList = city; //服务业主地区
      });
    }
  },
  created() {
    // console.log(this.getJsUrl('userId'))

    if (sessionStorage.getItem("cityTree")) {
      let city = JSON.parse(sessionStorage.getItem("cityTree"));
      // let city=JSON.parse(localStorage.getItem('cityAllTree'))
      city = this.getTreeDic("", city);
      let obj = {
        areaId: "all",
        areaName: "全部",
        selected: false,
        children: null
      };
      city.unshift(obj);
      this.cityList = city; //服务业主地区
    }
    this.tabNum = this.$route.name; //控制下方的tab路由
    this.ajax();
  },
  updated() {
    //默认选中第一项
    // this.$refs.serverList.setCurrentRow(this.tableData[0])
  },
  mounted() {
    this.$refs.serverList.setCurrentRow(this.tableData[0]);
  },
  methods: {
    indexFn(index) {
      let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
      return n;
    },

    editFn() {
      this.drawer = true;
      // this.fromData=JSON.parse(JSON.stringify(this.fromObj));
      // if(this.$refs.fromData){
      //     this.$refs.fromData.resetFields()
      // }
    },
    tableSelectFn(currentRow, oldCurrentRow) {
      //表格选中时
      if (currentRow) {
        let obj = JSON.parse(JSON.stringify(currentRow));
        // this.fromObj=obj
        this.fromData = obj;
        this.comid = this.fromData.comId;
        this.comname = this.fromData.comName;
      } else {
        this.comid = "";
        this.comname = "";
      }
    },
    refreshFn() {
      //刷新表格数据
      this.tableData = [];
      this.data.pageNo = 1;
      this.total = 0;
      this.ajax();
    },
    pageNoChange(val) {
      this.data.pageNo = val;
      this.ajax();
    },
    pageSizeChange(val) {
      this.data.pageNo = 1;
      this.total = 0;
      this.data.pageSize = val;
      this.ajax();
    },
    openTapFn(o) {
      //地区控制是否展开
      o.selected = !o.selected;
    },
    comNameFn() {
      this.data.pageNo = 1;
      this.total = 0;
      this.ajax();
    },
    listTapFn(o) {
      //地区是否选中
      this.data.pageNo = 1;
      this.total = 0;
      this.data.areaId = o.areaId;
      this.ajax();
    },
    customerLvFn(o) {
      this.data.pageNo = 1;
      this.total = 0;
      this.data.grade = o.value;
      this.ajax();
    },
    tabChangeFn(tab, event) {
      //重新赋值comid，触发子组件监听器
      this.$router.push({
        path: tab.name
      });
    },
    ajax() {
      this.isajax = true;
      this.tableData.splice(0);
      let that = this;
      let d = this.data;
      for (let x in d) {
        if (d[x] == null) {
          delete d[x];
        }
      }
      this.$http({
        method: "get",
        params: d,
        url: "/so/list"
      }).then(res => {
        if (res.data) {
          that.comid = "";
          if (res.succ) {
            that.isajax = false;
            that.tableData = res.data.data;
            that.total = res.data.total;
          }
        }
      });
    },
    regionWacth(p) {
      //监听地区组件返回的值
      this.fromData.comRegion = p.regionVal;
    },
    submitFn() {
      //提交表单
      this.$refs.fromData.validate(valid => {
        if (valid) {
          let d = this.fromData;
          for (let x in d) {
            if (d[x] == "" || d[x] == null) {
              delete d[x];
            }
          }
          this.$http({
            method: "post",
            data: d,
            url: "/so/edit"
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
<style lang="less" scoped>
@import "../../base/base.less";
li {
  list-style: none;
}
.prov {
  h5 {
    background: @titbgColor;
    line-height: 33px;
    color: @titFontColor;
    text-align: center;
  }
  li {
    cursor: pointer;
    color: @fontColor;
    height: 40px;
    overflow: hidden;
    box-sizing: border-box;
    border-top: 1px dashed #f1f4fa;
    .left-icon {
      color: #f7aa12;
      font-size: 16px;
      margin-right: 10px;
    }
    .prov-box {
      height: 40px;
    }
  }
  .active {
    height: auto;
  }
  .listbg {
    background: #ffe088;
  }
}
.el-main {
  padding: 15px;
}
.main-top {
  .top-box {
    .comname-ipt {
      width: 165px;
      margin: 0 17px 0 7px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      padding: 0 15px;
      box-sizing: border-box;
      input {
        border: none;
        outline: none;
        height: 33px;
        line-height: 33px;
        width: calc(100% - 16px);
      }
    }
    .el-icon-edit {
      margin-right: 7px;
    }
    .lvclass {
      .wh(50px, 24px);
      text-align: center;
      line-height: 24px;
      display: inline-block;
      cursor: pointer;
    }
    .active {
      background: @buleColor;
      color: #fff;
    }
  }
  .table-box {
    .el-table /deep/ .serial-num {
      background: @titbgColor;
    }
  }
}
.el-form /deep/ .el-form-item {
  margin-bottom: 22px;
}
.main-bottom {
  max-height: calc(100vh - 432px);
  .tab-box {
    /deep/ .el-tabs__header {
      margin: 0;
    }
    /deep/ .el-tabs__item {
      color: @fontColor;
    }
    /deep/ .el-tabs__item.is-active {
      color: #409eff;
      font-weight: bold;
    }
  }
}
</style>

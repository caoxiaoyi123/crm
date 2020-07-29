<!-- 模型： DOM 结构 -->
<template>
    <div class="planSearch">
        <div class="top-box dfrcb">
            <div class="drc">
                <font class="fs13">起止时间</font>
                <el-date-picker
                    placeholder="请输入起止时间"
                    @change="timeClick"
                    v-model="timer"
                    :clearable="false"
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
                    <font class="fs13" style="margin-right:12px">计划类型</font>
                    <el-select
                        v-model="data.type"
                        placeholder="请选择"
                        size="small"
                        style="width:122px"
                        @change="typeChange"
                    >
                        <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </span>
            </div>
        </div>
        <div class="table-box">
            <el-table
                cell-class-name="fs13 table-h depart"
                header-cell-class-name="table-header table-h"
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
                border
                :row-key="getRowKey"
                :data="depData"
                height="calc(100vh - 135px)"
                style="width:300px;float:left"
                ref="depList"
                highlight-current-row
                @expand-change="expandedChange"
                @current-change="depSelectFn"
                v-loading="depLoad"
                element-loading-text="数据正在加载中"
                element-loading-spinner="el-icon-loading"
            >
                <el-table-column header-align="center" align="left" prop="depName" label="部门名称">
                    <template slot-scope="scope">
                        <div>
                            <template v-if="scope.row.name=='全部'">
                                <i class="left-icon el-icon-document"></i>
                                <span class="text-over" :title="scope.row.name">
                                    {{scope.row.name}}
                                </span>
                            </template>
                            <template v-else-if="scope.row.userId">
                                <!-- <i class="left-icon" el-icon-user :class="scope.row.selected? 'el-icon-folder-remove': 'el-icon-folder-add'"></i> -->
                                <i class="left-icon el-icon-document"></i>
                                <span class="text-over" :title="scope.row.name">
                                    {{scope.row.name}}
                                </span>
                            </template>
                            <template v-else>
                                <i class="left-icon" :class="scope.row.selected? 'el-icon-folder-remove': 'el-icon-folder-add'" v-if="scope.row.children&&scope.row.children.length>0"></i>
                                <i class="left-icon el-icon-document" v-else></i>
                                <span class="text-over" :title="scope.row.depName">
                                    {{scope.row.depName}}
                                </span>
                            </template>
                            
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                cell-class-name="fs13 table-h"
                header-cell-class-name="table-header table-h"
                border
                ref="list"
                height="calc(100vh - 135px)"
                :data="tableData"
                style="width:calc(100% - 310px);float:right"
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
                <el-table-column align="center" label="责任人" prop="responsibleName"></el-table-column>
                <el-table-column align="center" label="指派人" prop="designeeName"></el-table-column>
                <el-table-column align="center" label="计划类型">
                    <template slot-scope="scope">
                        {{ scope.row.type | planType }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="事项数量">
                    <template slot-scope="scope">
                        <span @click="seePlanDetail(scope.row)" class="cp draw-tit">{{scope.row.detailTotal}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支撑明细">
                    <template slot-scope="scope">
                        <span @click="seeBrace(scope.row)" class="cp draw-tit">查看</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="报表">
                    <template slot-scope="scope">
                        <span @click="upload(scope.row)" class="cp draw-tit">下载</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
        <v-drawer :title="'事项数量'" :drawer="drawer" :drawerW="'70vw'" :readOnly="true">
            <v-statistic :planid="planid" :responsibleId="responsibleId"></v-statistic>
            <div class="table-box mt10">
                <el-table
                    cell-class-name="fs13 table-h"
                    header-cell-class-name="table-header table-h"
                    border
                    height="calc(100vh - 225px)"
                    :data="list1"
                    style="width:100%"
                    v-loading="isajax1"
                    element-loading-text="数据正在加载中"
                    element-loading-spinner="el-icon-loading"
                >
                    <el-table-column align="center" class-name="serial-num" width="60" label="序号" type="index" :index="indexFn1"></el-table-column>
                    <el-table-column align="center" label="工作性质">
                        <template slot-scope="scope">
                            {{ scope.row.workNature == 1 ? "非量化" : "量化" }}
                        </template>
                    </el-table-column>
                    <el-table-column align="left" header-align="center" label="内容" prop="content"></el-table-column>
                    <el-table-column align="left" header-align="center" label="输出" prop="output"></el-table-column>
                    <el-table-column align="center" width="175" label="起止时间">
                        <template slot-scope="scope">
                            {{scope.row.startDate ? scope.row.startDate.replace(/-/g,'/') : ""}}-{{scope.row.endDate ? scope.row.endDate.replace(/-/g,'/') : ""}}
                        </template>
                    </el-table-column>
                    <el-table-column align="left" header-align="center" label="任务分解" prop="resolve">
                        <template slot-scope="scope">
                            <span v-html="returnResolve(scope.row.resolve)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column align="left" header-align="center" label="备注" prop="remark"></el-table-column>
                </el-table>
            </div>
            <div class="page-box dfrcb">
                <span class="fs13">
                显示{{ (data1.pageNo - 1) * data1.pageSize + 1 }}到{{
                    total1 > data1.pageNo * data1.pageSize
                    ? data1.pageNo * data1.pageSize
                    : total1
                }}，共{{ total1 }}条记录
                </span>
                <el-pagination
                @current-change="pageNoChange1"
                :current-page="data1.pageNo"
                :page-size="data1.pageSize"
                layout="prev,pager,next,jumper"
                :total="total1"
                ></el-pagination>
            </div>
        </v-drawer>
        <v-drawer :title="'支撑明细'" :drawer="drawer2" :drawerW="'70vw'" :readOnly="true" :type="2">
            <div class="dfrb">
                <div class="tab-box">
                    <span class="fs14 mr40 cp" :class="i==tabNum?'active':''" v-for="(item,i) of tabList" :key="i" @click="tabChange(i)">{{item}}</span>
                </div>
                <div class="drc fs12">
                    <template v-if="tabNum==0">
                        <b class="mr10">内部验收：<font class="red-txt">{{ summary["内部验收"] }}</font>张</b>
                        <b class="mr10">培训证明：<font class="red-txt">{{ summary["培训证明"] }}</font>张</b>
                        <b class="mr10">外部验收：<font class="red-txt">{{ summary["外部验收"] }}</font>张</b>
                        <b class="mr10">客户好评：<font class="red-txt">{{ summary["客户好评"] }}</font>个</b>
                        <b class="mr10">客户回访：<font class="red-txt">{{ summary["客户回访"] }}</font>次</b>
                        <b>硬件安装验收：<font class="red-txt">{{summary["硬件安装验收"]}}</font>张</b>
                    </template>
                    <template v-else>
                        <b class="mr10">回款金额：<font class="red-txt">{{ summary["回款"] }}</font>万</b>
                        <b class="mr10">甲方数量：<font class="red-txt">{{ summary["甲方数量"] }}</font>个</b>
                        <b>签约金额：<font class="red-txt">{{ summary["签约"] }}</font>万</b>
                    </template>
                </div>
            </div>
            <div class="table-box mt10">
                <el-table
                    cell-class-name="fs13 table-h"
                    header-cell-class-name="table-header table-h"
                    border
                    height="calc(100vh - 250px)"
                    :data="list2"
                    ref="list2"
                    style="width:100%"
                    v-loading="isajax2"
                    element-loading-text="数据正在加载中"
                    element-loading-spinner="el-icon-loading"
                >
                    <el-table-column align="center" class-name="serial-num" width="60" label="序号" type="index" :index="indexFn2"></el-table-column>
                    <el-table-column align="center" label="责任人姓名" width="100" prop="responsibleName"></el-table-column>
                    <el-table-column align="center" min-width="140" label="地区" prop="cityDetail">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.cityDetail?returnRegion(scope.row.cityDetail):''" placement="right">
                                <span class="text-over">
                                    {{ scope.row.cityDetail?returnRegion(scope.row.cityDetail):'' }}
                                </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" min-width="150" label="单位名称" show-overflow-tooltip prop="compName">
                        <!-- <template slot-scope="scope">
                            <el-tooltip :content="scope.row.compName" placement="right">
                                <span class="clamp-2">
                                    {{ scope.row.compName }}
                                </span>
                            </el-tooltip>
                        </template> -->
                    </el-table-column>
                    <el-table-column align="center" min-width="150" label="项目名称" show-overflow-tooltip prop="projName">
                        <!-- <template slot-scope="scope">
                            <el-tooltip :content="scope.row.projName" placement="right">
                                <span class="clamp-2">
                                    {{ scope.row.projName }}
                                </span>
                            </el-tooltip>
                        </template> -->
                    </el-table-column>
                    <el-table-column align="center" label="负责人" width="125" prop="comManager"></el-table-column>
                    <el-table-column align="center" label="手机" width="125" prop="comTel"></el-table-column>
                    <el-table-column align="center" label="可能意向产品" width="110" prop="intentProduct" v-if="tabNum==1"></el-table-column>
                    <el-table-column align="center" label="预估金额（万）" width="120" prop="gusAmount" v-if="tabNum==1"></el-table-column>
                    <el-table-column align="center" label="概率" width="125" prop="probability" v-if="tabNum==1"></el-table-column>
                    <el-table-column width="110" v-for="o in num" :key="o" align="center" :label="o + ''">
                        <template slot-scope="scope">
                            <el-tooltip placement="top" effect="light">
                                <div slot="content">
                                    <p class="fs14">阶段：{{ scope.row.arr[o - 1].param }}</p>
                                    <p class="fs14" v-if="scope.row.arr[o - 1].param == '签约'||scope.row.arr[o - 1].param == '回款'">
                                        金额：{{ scope.row.arr[o - 1].amount }}万
                                    </p>
                                    <p class="fs14">备注：{{ scope.row.arr[o - 1].remark }}</p>
                                </div>
                                <span class="cp fs14" @click="braceTap(scope.row.arr[o - 1], o)">{{ scope.row.arr[o - 1].param }}</span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="page-box dfrcb">
                <span class="fs13">
                显示{{ (data2.pageNo - 1) * data2.pageSize + 1 }}到{{
                    total2 > data2.pageNo * data2.pageSize
                    ? data2.pageNo * data2.pageSize
                    : total2
                }}，共{{ total2 }}条记录
                </span>
                <el-pagination
                @current-change="pageNoChange2"
                :current-page="data2.pageNo"
                :page-size="data2.pageSize"
                layout="prev,pager,next,jumper"
                :total="total2"
                ></el-pagination>
            </div>
        </v-drawer>
    </div>
</template>
<script>
import {
  baseUrl //引入baseUrl
} from "../../../config/env";
import statistic from "@/components/statistic";
export default {
    name: "planSearch", // 结构名称
    data() {
        return {
            // 数据模型a
            isajax: true,
            depLoad:true,
            timer:[],
            data: {
                type: 99,
                pageNo: 1,
                pageSize: 20,
                startDate: "",
                endDate: ""
            },
            depData: [],
            tableData: [],
            typeList: [
                {
                    label: "全部",
                    value: 99
                },
                {
                    label: "年计划",
                    value: 0
                },
                {
                    label: "月计划",
                    value: 1
                },
                {
                    label: "周计划",
                    value: 2
                }
            ],
            total: 0,
            /*事项数量*/
            planid:null,
            responsibleId:null,
            drawer: false,
            isajax1:true,
            list1:[],
            data1:{
                pageNo: 1,
                pageSize: 20,
            },
            total1:0,
            /*支撑明细*/
            drawer2:false,
            tabList:['服务支撑明细','销售支撑明细'],
            tabNum:0,
            summaryData:{},
            summary:{},
            isajax2:true,
            list2:[],
            data2:{
                pageNo: 1,
                pageSize: 20,
            },
            total2:0,
            num: 31,
        };
    },
    filters: {
        planType(val) {
            if (val == 0) {
                return "年计划";
            } else if (val == 1) {
                return "月计划";
            } else if (val == 2) {
                return "周计划";
            }
        }
    },
    components: {
        "v-statistic": statistic //支撑统计
    },
    watch: {
        // 监控集合
        data:{
            deep:true,
            handler(val){
                this.ajax()
            }
        },
        tabNum:{
            handler(val){
                setTimeout(()=>{
                    this.$refs.list2.doLayout()
                })
                
                this.getCount()
                this.ajax2()
            }
        }
    },
    props: {
        // 集成父级参数
    },
    beforeCreate() {
        // console.group('创建前状态  ===============》beforeCreate');
    },
    created() {
        // console.group('创建完毕状态===============》created');
        //默认起止时间为本月1号到当前时间
        this.typeChange(99)
    },
    beforeMount() {
        // console.group('挂载前状态  ===============》beforeMount');
    },
    mounted() {
        // console.group('挂载结束状态===============》mounted');
        this.getDepart();
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
        tabChange(i){
            this.tabNum=i;
            this.data2.pageNo=1;
        },
        typeChange(val){
            let now=new Date();
            let nowM=now.getMonth();
            let nowY=now.getFullYear();
            if(val==0){//年
                this.data.startDate=nowY+'-01-01';
                this.data.endDate=nowY+'-12-31';
            }else if(val==1||val==99){//月
                this.data.startDate=this.formatDate(new Date(nowY, nowM, 1))
                this.data.endDate=this.formatDate(new Date(nowY, nowM+1, 0))
            }else if(val==2){//周
                let nowDay=now.getDay();
                let nowDate=now.getDate();
                this.data.startDate=this.formatDate(new Date(nowY,nowM,nowDate-nowDay+1))
                this.data.endDate=this.formatDate(new Date(nowY,nowM,nowDate+(6-nowDay+1)))
            }
            this.data.pageNo=1;
            this.$set(this.timer,0,this.data.startDate);
            this.$set(this.timer,1,this.data.endDate);
        },
        indexFn(index) {
            let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
            return n;
        },
        getDepart() {
            //获取组织关系
            if(sessionStorage.getItem("depart")){
                let d = JSON.parse(sessionStorage.getItem("depart"));
                let c = d;
                c.unshift({ name: "全部", depId:'',children:[]});
                c.map(function(item,index){
                    item.index=index
                })
                this.depData =JSON.parse(JSON.stringify(c));
                this.depLoad=false;
            }else{
                this.$http({
                    method: "get",
                    url: "/common/depart"
                }).then(res => {
                    let c = this.toTree(res.data,'depCode','pid');
                    sessionStorage.setItem("depart", JSON.stringify(c));
                    c.unshift({ name: "全部", depId:'',children:[]});
                    c.map(function(item,index){
                        item.index=index
                    })
                    this.depData =JSON.parse(JSON.stringify(c));
                    this.depLoad=false;
                });
            }
            this.$refs.depList.setCurrentRow(this.depData[0]);
        },
        getRowKey(row) {
            
            if(row.userId){
                return row.userId+row.depId+row.name+row.index
            }
            return row.depId+row.depName+row.index;
        },
        depSelectFn(currentRow,oldRow) {
            //表格选中时
            if (currentRow) {
                let d=JSON.parse(JSON.stringify(this.data));
                if(currentRow.userId){//人员
                    d.userId=currentRow.userId;
                    d.depCode=null;
                }else if(currentRow.depCode){//组织
                    d.depCode=currentRow.depCode;
                }else{//全部
                    d.userId=null;
                    d.depCode=null;
                }
                d.pageNo=1;
                this.data=JSON.parse(JSON.stringify(d));
                // this.ajax();
                if((!currentRow.userId)&&currentRow.depCode){//如果是组织的情况
                    let nowRow=JSON.parse(JSON.stringify(currentRow));//查询组织下的人员
                    this.$http({
                        method: "get",
                        url: "/common/departConChildUser",
                        params: {
                            depCode: currentRow.depCode
                        }
                    }).then(res => {
                        if (res.succ) {
                            if(res.data.length>0){
                                for(let x in res.data){
                                    res.data[x].index=currentRow.index+'C'+x
                                }
                                if(!currentRow.children||currentRow.children.length==0){
                                    currentRow.children = res.data;
                                }else{
                                    if(currentRow.children[0].userId){
                                        currentRow.children = res.data;
                                    }else{
                                        currentRow.children=currentRow.children.concat(res.data);
                                    }
                                }
                                
                                this.$set(this.depData,currentRow.index,currentRow)
                            }
                        }
                    });
                }
            }
        },
        timeClick(val) {
            //时间监听
            this.data.startDate = val[0];
            this.data.endDate = val[1];
            this.data.pageNo=1;
        },
        expandedChange(row) {
            if (row.selected) {
                row.selected = !row.selected;
            } else {
                row.selected = true;
            }
        },
        pageNoChange(val) {
            this.data.pageNo = val;
        },
        ajax(){
            this.isajax = true;
            this.tableData.splice(0);
            let d = JSON.parse(JSON.stringify(this.data));
            this.$http({
                method:'get',
                url: "/sv/plan/search/list",
                params:d
            }).then(res=>{
                this.isajax = false;
                if(res.succ){
                    this.tableData=res.data.data
                    this.total=res.data.total
                }
            })
        },
        seePlanDetail(row){//查看计划明细
            this.planid=row.planId
            this.responsibleId=row.responsibleId;
            this.drawer=true;
            this.ajax1(row.planId)
        },
        seeBrace(row){//查看支撑明细
            this.drawer2=true
            this.summaryData={
                planId:row.planId,
                responsibleId:row.responsibleId,
            }
            if (row.type == 0) {
                this.num = 12;
            } else if (row.type == 1) {
                this.num = 31;
            } else if (row.type == 2) {
                this.num = 7;
            }
            this.getCount();
            this.ajax2()
        },
        upload(row){
            window.open(
                baseUrl + "/sv/plan/search/downloadReport?planId=" + row.planId+"&responsibleId="+row.responsibleId+"&responsibleName="+row.responsibleName,
                "_blank"
            );
        },
        /*事项数量start*/
        returnResolve(val) {
            if(val){
                return val.replace(/;/g, "<br>");
            }else{
                return ''
            }
            
        },
        indexFn1(index) {
            let n = (this.data1.pageNo - 1) * this.data1.pageSize + (index + 1);
            return n;
        },
        pageNoChange1(val){
            this.data1.pageNo = val;
            this.ajax1()
        },
        ajax1(id){
            this.isajax1 = true;
            this.list1.splice(0);
            let that = this;
            let d = this.data1;
            d.planId=id;
            this.$http({
                method: "get",
                params: d,
                url: "/sv/plan/detail/list"
            }).then(res => {
                if (res.succ) {
                    this.isajax1 = false;
                    this.list1 = res.data.data;
                    this.total1 = res.data.total;
                }
            });
        },
        /*事项数量end*/
        /*支撑明细*/
        pageNoChange2(val){
            this.data2.pageNo = val;
            this.ajax2()
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
        indexFn2(index) {
            let n = (this.data2.pageNo - 1) * this.data2.pageSize + (index + 1);
            return n;
        },
        getCount(){//统计
            let d=JSON.parse(JSON.stringify(this.summaryData));
            d.supType=this.tabNum;
            this.$http({
                method: "get",
                url: "/sv/plan/support/summary",
                params:d
            }).then(res => {
                if (res.succ) {
                    this.summary= res.data;
                }
            });
        },
        ajax2(){
            this.isajax2 = true;
            this.list2.splice(0);
            let that = this;
            let d = this.data2;
            d.planId=this.summaryData.planId;
            d.supType=this.tabNum;
            this.$http({
                method: "get",
                params: d,
                url: "/sv/plan/support/task/list"
            }).then(res => {
                this.isajax2 = false;
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
                    this.list2 = res.data.data;
                    this.total2 = res.data.total;
                }
            });
        },
    }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.planSearch {
    padding: 15px;
    .top-box {
        margin-bottom: 15px;
        .operate {
            i {
                margin-right: 5px;
            }
        }
    }
    .table-box {
        overflow: hidden;
        // display: flex;
        // justify-content: space-between;
        .left-icon {
            color: #f7aa12;
            font-size: 16px;
            margin-right: 10px;
        }
        .el-table /deep/ .depart .cell {
            display: flex;
            align-items: center;
            // justify-content: center;
            position: relative;
            & .el-table__expand-icon {
                position: absolute;
                right: 10px;
            }
        }
        .depart .cell>div{
            display: flex;
            align-items: center;
            overflow-x: auto;
            // width: 105px;
        }
        .el-table /deep/ .depart .el-table__placeholder{
            width: 0;
        }
    }
    .drawer /deep/ .el-drawer{
        min-width: 910px ;
    }
    // .el-drawer .el-table /deep/ .is-scrolling-left{
    //     height: 650px !important;
    // }
    .tab-box{
        span{
            display: inline-block;
            padding-bottom: 9px;
        }
        .active{
            color: #2796FF;
            position: relative;
            &::after{
                content: '';
                width: 100%;
                height: 3px;
                position: absolute;
                bottom: 0;
                background: #2796FF;
                left: 0;
            }
        }
    }
}
</style>

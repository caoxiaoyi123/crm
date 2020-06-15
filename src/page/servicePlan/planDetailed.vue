<!-- 模型： DOM 结构 -->
<template>
    <div class="planDetailed">
        <div class="top-box dfrcb">
            <div class="drc">
                <b class="tit-type mr20">{{typeTxt}}</b>
                <span class="drc cp mr20  hover-color" @click="creatFn">
                    <i class="icon iconfont iconxinjian"></i>
                    <font class="fs13">新建</font>
                </span>
                <span class="drc cp mr20  hover-color" @click="editFn" v-if="tableData && tableData.length > 0">
                    <i class="icon iconfont iconbianji"></i>
                    <font class="fs13">编辑</font>
                </span>
                <span class="drc cp mr20  hover-color" @click="deleteFn" v-if="tableData && tableData.length > 0 ">
                    <i class="el-icon-remove-outline"></i>
                    <font class="fs13">删除</font>
                </span>
                <span class="drc cp mr20  hover-color" @click="resolveFn" v-if="tableData && tableData.length > 0 ">
                    <i class="icon iconfont iconrenwufenjie"></i>
                    <font class="fs13">任务分解</font>
                </span>
                <span class="drc cp mr20  hover-color" @click="drawer3=true">
                    <i class="icon iconfont iconxiaoshourenwuzhicheng"></i>
                    <font class="fs13">销售任务支撑</font>
                </span>
                <span class="drc cp mr20  hover-color" @click="drawer2=true">
                    <i class="icon iconfont iconfuwurenwuzhicheng"></i>
                    <font class="fs13">服务任务支撑</font>
                </span>
            </div>
            <div class="drc fs13">
                <span class="mr10">回款金额：<font class="red-txt">{{count.receivedPayments}}</font>万</span>
                <span class="mr10">甲方数量：<font class="red-txt">{{count.total}}</font>万</span>
                <span>签约金额：<font class="red-txt">{{count.amount}}</font>万</span>
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
                height="calc(100vh - 175px)"
                :data="tableData"
                style="width:100%"
                v-loading="isajax"
                element-loading-text="数据正在加载中"
                element-loading-spinner="el-icon-loading"
            >
                <el-table-column align="center" class-name="serial-num" width="50" label="序号" type="index" :index="indexFn"></el-table-column>
                <el-table-column align="center" label="工作性质">
                    <template slot-scope="scope">
                        {{scope.row.workNature==1?'非量化':'量化'}}
                    </template>
                </el-table-column>
                <el-table-column align="left" header-align="center" label="内容" prop="content"></el-table-column>
                <el-table-column align="left" header-align="center" label="输出" prop="output"></el-table-column>
                <el-table-column align="center" label="起止时间">
                    <template slot-scope="scope">
                        {{scope.row.startDate?scope.row.startDate.replace('-','/'):''}}-{{scope.row.endDate?scope.row.endDate.replace('-','/'):''}}
                    </template>
                </el-table-column>
                <el-table-column align="left" header-align="center" label="任务分解" prop="resolve">
                    <template slot-scope="scope">
                        <span v-html="returnResolve(scope.row.resolve)"></span>
                    </template>
                </el-table-column>
                <el-table-column align="left" header-align="center" label="备注" prop="remark"></el-table-column>
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
        <v-drawer :title="title" :drawer="drawer" @submitFn="submitFn">
            <el-form :model="fromData" label-width="80px" class="plan" ref="fromData" size="medium" @submit.native.prevent>
                <el-form-item label="工作性质">
                    <el-select v-model="fromData.workNature" style="width:200px">
                        <el-option v-for="(x,i) of workNatureList" :key="i" :label="x.label" :value="x.value"></el-option>
                        <!-- <el-option label="量化" value="0"></el-option>
                        <el-option label="非量化" value="1"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" prop="content" :rules="{ required: true, message: '内容不得为空' }">
                    <el-input placeholder="请输入内容" v-model="fromData.content"></el-input>
                </el-form-item>
                <el-form-item label="输出" prop="output" :rules="{ required: true, message: '输出不得为空' }">
                    <el-input placeholder="请输入输出" v-model="fromData.output"></el-input>
                </el-form-item>
                <div class="drc">
                    <el-form-item label="任务分解">
                        <el-input placeholder="任务分解" v-model="fromData.resolve" style="position: relative;" :disabled="true"></el-input>
                        <button class="ml10 search-btn cp" @click.prevent="mask=true;">添加</button>
                        <div class="mask-box" v-if="mask">
                            <div class="dia-tit dfrcb">
                                <span class="color-fff">添加任务分解</span>
                                <i class="color-fff el-icon-close cp" @click="mask = false;"></i>
                            </div>
                            <v-decompose @closeFn="mask = false;" @submitFn="addResolve" :outTxt="fromData.output" :id="fromData.detailId" :list="fromFjList" :contentTxt="fromData.content"></v-decompose>
                        </div>
                    </el-form-item>
                </div>
                <el-form-item label="起止时间">
                    <template v-if="$route.query.type==2">
                        <el-date-picker
                            v-model="timeValue"
                            type="week"
                            format="yyyy 第 WW 周"
                            value-format="yyyy-MM-dd"
                            placeholder="选择周">
                        </el-date-picker>
                    </template>
                    <template v-else-if="$route.query.type==1">
                        <el-date-picker
                            v-model="timeValue"
                            type="month"
                            value-format="yyyy-MM-dd"
                            placeholder="选择月">
                        </el-date-picker>
                    </template>
                    <template v-else-if="$route.query.type==0">
                        <el-date-picker
                            v-model="timeValue"
                            type="year"
                            value-format="yyyy-MM-dd"
                            placeholder="选择年">
                        </el-date-picker>
                    </template>
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
            :destroy-on-close="true">
            <header>
                <font class="fs20 draw-tit">任务分解</font>
                <i class="el-icon-close cp" @click="drawer1 = false;"></i>
            </header>
            <section id="section-box">
                <v-decompose @closeFn="drawer1 = false;" :id="fromObj.detailId" @submitFn="resolveUpdate" :outTxt="fromObj.output" :list="FjList" :contentTxt="fromObj.content"></v-decompose>
            </section>
        </el-drawer>
        <v-drawer :title="'项目/单位支撑-服务'" :drawerW="'975px'" :drawer="drawer2"  :readOnly="true" :type="2">
            <v-braceService></v-braceService>
        </v-drawer>
        <v-drawer :title="'项目/单位支撑-销售'" :drawerW="'975px'" :drawer="drawer3" @submitFn="xsSaveFn" :type="3">
            <v-braceSell @returnList="receiveFn"></v-braceSell>
        </v-drawer>
    </div>
</template>
<script>
import braceService from "@/components/braceService";
import braceSell from "@/components/braceSell";
import decompose from "@/components/decompose";
export default {
    name: 'planDetailed', // 结构名称
    data() {
        return {
            // 数据模型a
            timeValue:'',
            typeTxt:'',
            tableData:[],
            count:{
                receivedPayments:100,
                total:12,
                amount:200
            },
            data:{
                pageNo:1,
                pageSize:30,
                planId:'',
            },
            total:0,
            isajax:true,
            title:"",
            drawer:false,
            drawer1:false,
            drawer2:false,
            drawer3:false,
            fromData:{},
            fromObj:{},
            workNatureList:[
                {
                    label:'量化',
                    value:0
                },{
                    label:'非量化',
                    value:1
                }
            ],
            mask:false,
            fromFjList:[],//表单内分解的list
            FjList:[],
            receiveList:[],
        }
    },
    watch: {
        // 监控集合
        timeValue(val,old){
            if(val){
                let start,end;
                let nowY=new Date(val).getFullYear();
                const oneD=86400000;
                if(this.$route.query.type==0){//年计划
                    start=val;
                    let nextY=nowY+1;
                    let nextStr=nextY+'-01-01';
                    let nextTime=new Date(nextStr).getTime()-oneD;
                    end=this.formatDate(nextTime)
                }else if(this.$route.query.type==1){//月计划
                    start=val;
                    let nextM=new Date(val).getMonth()+2;
                    if (nextM < 10) {
                        nextM = "0" + nextM;
                    }
                    let nextStr=nowY+'-'+nextM+'-01';
                    let nextTime=new Date(nextStr).getTime()-oneD;
                    end=this.formatDate(nextTime)
                }else if(this.$route.query.type==2){//周计划
                    let nowTimestr=new Date(val).getTime();
                    start=this.formatDate(nowTimestr-oneD);
                    let nextW=nowTimestr+5*oneD;
                    end=this.formatDate(nextW)
                }
                this.fromData.startDate=start;
                this.fromData.endDate=end
            }else{
                this.fromData.startDate=''
                this.fromData.endDate=''
            }
        }
    },
    components: {
        "v-decompose": decompose,//任务分解
        "v-braceService":braceService,//服务支撑
        "v-braceSell":braceSell,//销售支撑
    },
    props: {
        // 集成父级参数
    },
    beforeCreate() {
        // console.group('创建前状态  ===============》beforeCreate');
    },
    created() {
        // console.group('创建完毕状态===============》created');
        if(this.$route.query.type==0){
            this.typeTxt='年计划'
        }else if(this.$route.query.type==1){
            this.typeTxt='月计划'
        }else{
            this.typeTxt='周计划'
        }
        this.data.planId=this.$route.query.id;
        this.ajax()
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
        returnResolve(val){
            return val.replace(/;/g,'<br>');
        },
        indexFn(index) {
            let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
            return n;
        },
        resolveUpdate(){
            this.drawer1=false;
            this.ajax()
        },
        resolveFn(){
            this.$http({
                method:'get',
                url:'/sv/plan/resolve/list',
                params:{
                    detailId:this.fromObj.detailId
                }
            }).then(res=>{
                if(res.succ){
                    this.FjList=res.data;
                    this.drawer1=true;
                }
            })
        },
        creatFn(){
            let d= new Object();
            d.workNature=0;
            this.fromData=JSON.parse(JSON.stringify(d));
            this.fromFjList=[];
            this.timeValue='';
            this.drawer = true;
            this.title = "新建计划";
        },
        editFn(){
            this.$http({
                method:'get',
                url:'/sv/plan/resolve/list',
                params:{
                    detailId:this.fromObj.detailId
                }
            }).then(res=>{
                if(res.succ){
                    this.fromFjList=res.data
                }
            })
            this.fromData = JSON.parse(JSON.stringify(this.fromObj));
            this.timeValue=this.fromData.startDate
            this.drawer = true;
            this.title = "编辑计划";
        },
        deleteFn(){
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
                        detailId : this.fromObj.detailId,
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
                    let d=JSON.parse(JSON.stringify(this.fromData));
                    d.planId=this.$route.query.id;
                    if((!d.resolveIds)&&(!d.resolve)){
                        this.$message({
                            message:'任务分解不得为空',
                            type: "warning"
                        })
                        return false
                    }
                    for (let x in d) {
                        if (x == "resolve") {
                            delete d[x];
                        }
                    }
                    this.$http({
                        method:'post',
                        url:'/sv/plan/detail/update',
                        data:d
                    }).then(res=>{
                        if (res.succ) {
                            this.$message({
                                title: "成功",
                                message: res.data,
                                type: "success"
                            });
                            this.drawer = false;
                            this.ajax();
                        }
                    })
                }
            });
        },
        addResolve(p){
            let arr=[]
            for(let x of p.list){
                let str=x.name+','+x.output;
                arr.push(str)
            }
            this.fromFjList=JSON.parse(JSON.stringify(p.list));
            // let d=new Object();
            // d.resolve=arr.join(';');
            // d.resolveIds=p.resolveIds;
            this.fromData.resolve=arr.join(';');
            this.fromData.resolveIds=p.resolveIds;
            // this.fromData=Object.assign(d,this.fromData);
            this.mask=false;
        },
        tableSelectFn(currentRow, oldCurrentRow) {//表格选中时
            if(currentRow){
                let obj = JSON.parse(JSON.stringify(currentRow));
                this.fromObj=obj;
            }
        },
        pageNoChange(val) {
            this.data.pageNo = val;
            this.ajax();
        },
        ajax(){
            this.isajax = true;
            this.tableData.splice(0);
            let that = this;
            let d=this.data
            this.$http({
                method:'get',
                params:d,
                url:"/sv/plan/detail/list"
            }).then(res=>{
                if(res.succ){
                    this.isajax = false;
                    this.tableData = res.data.data;
                    this.total=res.data.total
                    this.$refs.list.setCurrentRow(this.tableData[0]);
                }
                
            })
        },
        receiveFn(p){
            this.receiveList=JSON.parse(JSON.stringify(p.list));
        },
        xsSaveFn(){
            let d=JSON.parse(JSON.stringify(this.receiveList));
            this.$http({
                method:'post',
                url:'/sv/plan/support/sell/save',
                data:d
            }).then(res=>{
                if (res.data) {
                    this.$message({
                        title: "成功",
                        message:'保存成功',
                        type: "success"
                    });
                    this.drawer3 = false;
                }else{
                    this.$message.error({
                        message:'保存失败',
                    });
                }
            })
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style  lang='less' scoped>
.planDetailed{
    .top-box{
        margin-bottom: 15px;
        .hover-color{
            i {
                margin-right: 5px;
            }
        }
        .tit-type{
            font-size: 16px;
            color: #2796FF;
            padding-left: 8px;
            position: relative;
            &::before{
                content: '';
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 3px;
                background: #2796FF;
                height: 14px;
                left: 0;
            }
        }
    }
    .mask-box{
        position: fixed;
        background: #fff;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 788px;
        // width: 760px;
        // height: 480px;
        height: 60vh;
        width: 50vw;
        // border:1px solid rgba(230,235,245,1);
        box-shadow:0px 3px 6px rgba(0,0,0,0.16);
        // box-shadow:0px 2px 5px rgba(223,228,237,0.44);
        z-index: 1;
        border-radius: 4px;
        .dia-tit{
            background: #1989FA;
            line-height: 40px;
            padding:0 20px;
            border-radius: 4px 4px 0 0;
        }
    }    
}
.search-btn {
    width: 58px;
    border: 1px solid #2796FF;
    color: #2796FF;
    line-height: 33px;
    text-align: center;
    outline: none;
    background: #fff;
    border-radius:4px;
}
.planDetailed /deep/ .el-drawer{
    overflow: inherit;
}
.planDetailed /deep/ #content-box{
    overflow-y: inherit;
}
.el-drawer{
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

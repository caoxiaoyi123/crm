<!-- 模型： DOM 结构 -->
<template>
    <div class="customers">
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
                    placeholder="请选择部门"
                    v-model="value"
                    :options="depList"
                    @change="departFn"
                    size="small"
                    :props="{ label: 'depName', value: 'depId'}"
                    :clearable="true"
                    ></el-cascader>
                    <!-- <el-select
                    v-model="data.state"
                    placeholder="请选择"
                    size="small"
                    style="width:122px"
                    >
                        <el-option
                            v-for="item in stateList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
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
                <span class="drc cp ml30 hover-color" @click="editFn" v-if="tableData && tableData.length > 0">
                    <i class="icon iconfont iconbianji"></i>
                    <font class="fs13">编辑</font>
                </span>
                <span class="drc cp operate ml30 hover-color" @click="exportFn" v-if="tableData && tableData.length > 0">
                    <i class="icon iconfont icondaochu"></i>
                    <font class="fs13">导出excel</font>
                </span>
            </div>
        </div>
        <div class="table-box">
            <el-table
                @current-change="tableSelectFn"
                highlight-current-row
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
                <el-table-column align="center" class-name="serial-num" width="50" label="序号" type="index" :index="indexFn"></el-table-column>
                <el-table-column align="center" label="姓名" prop="userName"></el-table-column>
                <el-table-column align="left" min-width="200" header-align="center" label="单位" prop="comName">
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.comName" placement="right">
                            <span class="text-over">{{ scope.row.comName }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="left" min-width="200" header-align="center" label="项目" prop="projName">
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.projName" placement="right">
                            <span class="text-over">{{ scope.row.projName }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="联系人" prop="manager"></el-table-column>
                <el-table-column align="left"  header-align="center" prop="oldPlan" label="原计划">
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.oldPlan" placement="right">
                            <span class="text-over">{{ scope.row.oldPlan }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="left"  header-align="center" prop="result" label="结果">
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.result" placement="right">
                            <span class="text-over">{{ scope.row.result }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="left" min-width="200" header-align="center" label="分析原因" prop="cause">
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.cause" placement="right">
                            <span class="text-over">{{ scope.row.cause }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="left" min-width="200" header-align="center" label="确认根本原因" prop="confirmCause">
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.confirmCause" placement="right">
                            <span class="text-over">{{ scope.row.confirmCause }}</span>
                        </el-tooltip>
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
        <v-drawer :title="'编辑'" :drawer="drawer" :drawerW="'50vw'" @submitFn="submitFn">
            <el-form :model="fromData" label-width="100px" ref="fromData" size="medium">
                <h4 class="bor-b tit-txt fs16">重点项目复盘</h4>
                <div class="dfrb">
                    <el-form-item label="原计划" prop="oldPlan" :rules="{ required: true, message: '原计划不得为空' }" class="text-line">
                        <el-input
                            placeholder="请输入原计划"
                            type="textarea"
                            resize="none"
                            v-model="fromData.oldPlan"
                            maxlength="50"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="结果" prop="result" :rules="{ required: true, message: '结果不得为空' }" class="text-line">
                        <el-input
                            placeholder="请输入结果"
                            type="textarea"
                            resize="none"
                            v-model="fromData.result"
                            maxlength="50"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="分析原因" prop="cause" :rules="{ required: true, message: '分析原因不得为空' }" class="text-line">
                        <el-input
                            placeholder="请输入分析原因"
                            type="textarea"
                            resize="none"
                            v-model="fromData.cause"
                            maxlength="50"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="确认根本原因" prop="confirmCause" :rules="{ required: true, message: '确认根本原因不得为空' }" class="text-line">
                        <el-input
                            placeholder="请输入确认根本原因"
                            type="textarea"
                            resize="none"
                            v-model="fromData.confirmCause"
                            maxlength="50"
                        ></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="重来一次" prop="again" :rules="{ required: true, message: '重来一次不得为空' }" class="text-line">
                    <el-input
                        placeholder="请输入重来一次"
                        type="textarea"
                        resize="none"
                        v-model="fromData.again"
                        maxlength="50"
                    ></el-input>
                </el-form-item>
            </el-form>
        </v-drawer>
    </div>
</template>
<script>
import {
  baseUrl //引入baseUrl
} from "../../../config/env";
export default {
    name: 'customers', // 结构名称
    data() {
        return {
            // 数据模型a
            value:'',
            isajax:true,
            total:0,
            timer:"",
            data:{
                pageNo:1,
                pageSize:20,
                userId:null,
                departId:null,
                start:null,
                end:null,
            },
            tableData:[],
            depList: [],
            perponList:[],
            drawer:false,
            fromData:{}
        }
    },
    watch: {
        // 监控集合
        data:{
            deep:true,
            handler(val,old){
                this.ajax()
            }
        },
        value(val,old){
            this.data.departId=val[val.length-1]
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
    },
    beforeMount() {
        // console.group('挂载前状态  ===============》beforeMount');
    },
    mounted() {
        // console.group('挂载结束状态===============》mounted');
        this.ajax()
        this.getDepart()
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
        ajax(){
            this.isajax = true;
            this.tableData.splice(0);
            let that = this;
            let d=this.data
            this.$http({
                method:'post',
                data:d,
                url:"/so/customer/report/list"
            }).then(res=>{
                this.isajax = false;
                if(res.succ){
                    this.tableData = res.data.data;
                    this.total=res.data.total;
                    this.$refs.list.setCurrentRow(this.tableData[0]);
                }
                
            })
        },
        timeClick(val) {
            //时间监听
            if(val){
                this.data.start = val[0];
                this.data.end = val[1];
            }else{
                this.data.start =null;
                this.data.end=null
            }
            this.data.pageNo=1;
        },
        indexFn(index) {
            let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
            return n;
        },
        exportFn() {//导出
            window.open(
                // baseUrl +
                // "/so/report/server/excel?departId=" +this.data.departId +
                // "&start=" +this.data.start+
                // "&userId=" +this.data.userId+
                // "&end=" +this.data.end,
                // "_blank"
                baseUrl +"/so/customer/report/excel","_blank"
            );
        },
        getDepart(){//获取组织关系
            let d = JSON.parse(sessionStorage.getItem('depart'));
            let c = this.getTreeDic('',d,1);
            this.depList=c;
        },
        departFn(val){
            this.data.userId=null;
            this.data.pageNo=1;
            this.perponList=[];
            let id
            if(val.length>0){
                id=val[val.length-1]
            }else{
                return false
            }
            this.$http({
                method:'get',
                url:'/common/departUser',
                params:{
                    depId:id
                }
            }).then(res=>{
                if(res.succ){
                    this.perponList=res.data
                }
            })
        },
        pageNoChange(val) {
            this.data.pageNo = val;
            this.ajax();
        },
        editFn(){
            this.drawer=true;
        },
        tableSelectFn(currentRow, oldCurrentRow) {//表格选中时
            if(currentRow){
                this.fromData=JSON.parse(JSON.stringify(currentRow))
            }
        },
        submitFn(){
            this.$refs.fromData.validate(valid => {
                if (valid) {
                    let d=JSON.parse(JSON.stringify(this.fromData));
                    for (let x in d) {
                        if (x == "resolve") {
                            delete d[x];
                        }
                        // if (x == "responsibleName") {
                        //     delete d[x];
                        // }
                        // if (x == "designeeName") {
                        //     delete d[x];
                        // }
                        // if (x == "pubFileEntity") {
                        //     delete d[x];
                        // }
                    }
                    this.$http({
                        method:'post',
                        url:'/so/customer/report/etid',
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
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style  lang='less' scoped>
.customers{
    .top-box{
        margin-bottom: 15px;
        .operate{
            i {
                margin-right: 5px;
            }
        }
    }
    .el-form /deep/ .dfrb .el-form-item{
        width:calc((100% - 20px)/2);
    }
}
</style>

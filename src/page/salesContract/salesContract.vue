<!-- 模型： DOM 结构 -->
<template>
    <div class="salesContract">
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
                <div class="comname-ipt" @keydown.13="keywordFn">
                    <input type="text" v-model="data.keyword" placeholder="请输入关键字"/>
                    <i class="el-icon-search cp" slot="append" @click="keywordFn" ></i>
                </div>
                <span class="drc cp mr20 operate" @click="creatFn">
                    <i class="el-icon-plus"></i>
                    <font class="fs13">新建</font>
                </span>
                <span class="drc cp mr20 operate" @click="editFn" v-if="tableData && tableData.length > 0">
                    <i class="icon iconfont iconbianji"></i>
                    <font class="fs13">编辑</font>
                </span>
                <span class="drc cp mr20 operate" @click="deleteFn" v-if="tableData && tableData.length > 0 ">
                    <i class="el-icon-remove-outline"></i>
                    <font class="fs13">删除</font>
                </span>
                <span class="drc cp operate" @click="exportFn" v-if="tableData && tableData.length > 0">
                    <i class="icon iconfont icondaochu"></i>
                    <font class="fs13">导出excel</font>
                </span>
            </div>
            <div class="drc fs13">
                <span class="mr10">合同数：<font class="red-txt">25</font>份</span>
                <span class="mr10">签约金额：<font class="red-txt">500</font>万</span>
                <span class="mr10">回款金额：<font class="red-txt">200</font>万</span>
                <span>待回款金额：<font class="red-txt">300</font>万</span>
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
                height="calc(100vh - 100px)"
                :data="tableData"
                style="width:100%"
            >
                <el-table-column align="center" class-name="serial-num" width="50" label="序号" type="index" ></el-table-column>
                <el-table-column align="center"  min-width="120" label="合同编号"></el-table-column>
                <el-table-column align="center"  min-width="70" label="地区">
                    <template slot-scope="scope">
                        <span class="text-over" :title="scope.row.city">{{scope.row.city}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center"  min-width="100" label="签订时间"></el-table-column>
                <el-table-column align="center"  min-width="100" label="销售姓名"></el-table-column>
                <el-table-column align="center"  min-width="120" label="收入类型"></el-table-column>
                <el-table-column align="left"  min-width="200" header-align="center" label="业主单位/甲方"></el-table-column>
                <el-table-column align="left"  min-width="200" header-align="center" label="项目名称"></el-table-column>
                <el-table-column align="left"  min-width="200" header-align="center" label="合同单位"></el-table-column>
                <el-table-column align="center"  min-width="100" label="金额"></el-table-column>
                <el-table-column align="center"  min-width="100" label="回款"></el-table-column>
                <el-table-column align="center"  min-width="100" label="是否开发票"></el-table-column>
                <el-table-column align="center"  min-width="50" label="合同"></el-table-column>
            </el-table>
        </div>
        <v-drawer :title="title" :drawer="drawer" @submitFn="submitFn">
            <el-form @submit.native.prevent :model="fromData" ref="fromData" label-width="82px" size="medium">
                <div class="dfrb">
                    <el-form-item label="合同编号" prop="depName" :rules="{ required: true, message: '合同编号不得为空' }">
                        <el-input placeholder="请输入合同编号" v-model="fromData.depName"></el-input>
                    </el-form-item>
                    <el-form-item label="签订时间" prop="time" :rules="{ required: true, message: '签订时间不得为空' }">
                        <el-date-picker
                            v-model="fromData.time"
                            type="date"
                            :editable="false"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="区域" prop="re" :rules="{ required: true, message: '区域不得为空' }">
                        <el-cascader
                            placeholder="请选择区域"
                            ref="cascader"
                            style="width:202px"
                            v-model="fromData.re"
                            :options="options"
                            @change="regionWacth"
                            :props="{label: 'areaName',value: 'areaId',checkStrictly: true}"
                            :separator="'-'"
                            :clearable="true"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="销售姓名" prop="projState" :rules="{ required: true, message: '销售姓名不得为空' }">
                        <el-select v-model="fromData.projState" placeholder="请选择销售姓名" style="width:202px">
                            <el-option
                                v-for="item in userList"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="收入类型" prop="projState" :rules="{ required: true, message: '收入类型不得为空' }">
                        <el-select v-model="fromData.projState" placeholder="请选择收入类型" style="width:202px">
                            <el-option
                                v-for="item in userList"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="业主单位" prop="contact" :rules="{ required: true, message: '业主单位不得为空' }">
                        <el-select v-model="fromData.contact" filterable placeholder="请选择业主单位">
                            <el-option
                                v-for="item in userList"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="项目名称" prop="projState" :rules="{ required: true, message: '项目名称不得为空' }">
                        <el-select v-model="fromData.projState" placeholder="请选择项目名称" style="width:202px">
                            <el-option
                                v-for="item in userList"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="合同单位" prop="depName" :rules="{ required: true, message: '合同单位不得为空' }">
                        <el-input placeholder="请输入合同单位" v-model="fromData.depName"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="金额(万)" prop="depName" :rules="
                        [{pattern: /^(([1-9]\d*)|0)(\.\d+)?$/,message: '金额必须为正数',
                        trigger: ['blur', 'change']},{ required: true, message: '金额不得为空' }]">
                        <el-input placeholder="请输入金额(万)" v-model="fromData.depName"></el-input>
                    </el-form-item>
                    <el-form-item label="回款(万)" prop="depName" :rules="{pattern: /^(([1-9]\d*)|0)(\.\d+)?$/,message: '回款必须为正数'}">
                        <el-input placeholder="请输入回款(万)" v-model="fromData.depName"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="是否开发票" prop="info_sex">
                        <el-select v-model="fromData.info_sex" style="width:202px">
                            <el-option label="是" value="是"></el-option>
                            <el-option label="否" value="否"></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item prop="fileid" label="上传合同">
                        <v-upload :fileData='fileData'></v-upload>
                    </el-form-item>
                </div> 
            </el-form>
        </v-drawer>
    </div>
</template>
<script>
import upload from "@/components/upload";
export default {
    name: 'salesContract', // 结构名称
    data() {
        return {
            // 数据模型a
            timer:"",
            data:{
                keyword:''
            },
            tableData:['1'],
            drawer:false,
            title:'',
            fromData:{
                time:new Date()
            },
            options: [],//承载地区数组
            userList:[],//销售人员数组
            fileData:{
                data: {
                    id: null,
                    type: 13,
                    uploadType: "server",
                    userId: null
                },
                list: []
            }
        }
    },
    components: {
        "v-upload": upload
    },
    watch: {
        // 监控集合
        fileData:{
            deep:true,
            handler(val,old){
                // if(val.id){
                this.fromData.fileid=val.id
                // }
            }
        },
    },
    props: {
        // 集成父级参数
    },
    beforeCreate() {
        // console.group('创建前状态  ===============》beforeCreate');
    },
    created() {
        // console.group('创建完毕状态===============》created');
        let city = JSON.parse(localStorage.getItem("cityAllTree"));
        this.options = city;
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
        timeClick(val) {
            //时间监听
            this.data.projStartime = val[0];
            this.data.projEndtime = val[1];
        },
        keywordFn(){

        },
        creatFn() {//新建
            this.title='新建合同';
            this.drawer=true;
        },
        editFn() {//编辑
            this.title='编辑合同';
            this.drawer=true;
        },
        exportFn() {//导出
            // window.open(
            //     baseUrl +
            //     "/so/user/export?comId=" +
            //     this.comid +
            //     "&comName=" +
            //     this.comName,
            //     "_blank"
            // );
        },
        deleteFn() {
            this.$confirm("您确定删除该项吗？", "提示", {
                confirmButtonText: "删除",
                showClose: false,
                distinguishCancelAndClose: true,
                confirmButtonClass: "red-btn",
                cancelButtonClass: "cancel-btn"
            }).then(() => {
                // this.$http({
                //     method: "post",
                //     data: {
                //         id: this.serverId
                //     },
                //     url: "/so/problem/del"
                // }).then(res => {
                //     if (res.succ) {
                //         this.$message({
                //             title: "成功",
                //             message: res.data,
                //             type: "success"
                //         });
                //         this.ajax();
                //     }
                // });
            });
        },
        tableSelectFn(currentRow, oldCurrentRow) {//表格选中时
        },
        submitFn(){
            this.$refs.fromData.validate(valid => {
                if (valid) {
                    if(!this.fromData.fileid){
                        this.$message({
                            message: "请上传合同文件",
                            type: "warning"
                        });
                        return false
                    }
                }
            });
        },
        regionWacth(p) {
            //监听地区组件返回的值
            this.$refs.cascader.dropDownVisible =false//选中后隐藏下拉框
            // let d = JSON.parse(JSON.stringify(this.fromData));
            // if(this.fromData.re&&this.fromData.re.length>0){
            //     d = this.fromData.re[this.fromData.re.length - 1];
            //     this.fromData.comRegion = d;
            // }else{
            //     let arr=this.fromData.comRegion.split('-');
            //     arr.pop();
            //     let arr1=[];
            //     let str=''
            //     arr.map(item=>{
            //         str=str+item+'-';
            //         arr1.push(str)
            //     })
            //     console.log(arr1);
            //     this.fromData.re=arr1;
            // }
        },
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style  lang='less' scoped>
.salesContract{
    padding: 15px;
    .top-box{
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
        .operate{
            i {
                margin-right: 5px;
            }
        }
        
    }
    
}
</style>

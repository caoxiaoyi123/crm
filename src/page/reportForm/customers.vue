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
                    <el-select
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
                    </el-select>
                </span>
                <span class="drc ml30">
                    <font class="fs13" style="margin-right:12px">人员</font>
                    <el-select
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
                height="calc(100vh - 135px)"
                :data="tableData"
                style="width:100%"
            >
                <el-table-column align="center" class-name="serial-num" width="50" label="序号" type="index" ></el-table-column>
                <el-table-column align="center" label="姓名"></el-table-column>
                <el-table-column align="left" min-width="200" header-align="center" label="单位"></el-table-column>
                <el-table-column align="left" min-width="200" header-align="center" label="项目" prop="projName"></el-table-column>
                <el-table-column align="center" label="联系人"></el-table-column>
                <el-table-column align="center" label="原计划"></el-table-column>
                <el-table-column align="center" label="结果"></el-table-column>
                <el-table-column align="left" min-width="200" header-align="center" label="分析原因" prop="projName"></el-table-column>
                <el-table-column align="left" min-width="200" header-align="center" label="确认根本原因" prop="projName"></el-table-column>
            </el-table>
        </div>
        <v-drawer :title="'编辑'" :drawer="drawer" @submitFn="submitFn">
            <el-form :model="fromData" label-width="100px" ref="fromData" size="medium">
                <h4 class="bor-b tit-txt fs16">重点项目复盘</h4>
                <div class="dfrb">
                    <el-form-item label="原计划" prop="depMemo" :rules="{ required: true, message: '原计划不得为空' }" class="text-line">
                        <el-input
                            placeholder="请输入原计划"
                            type="textarea"
                            resize="none"
                            v-model="fromData.depMemo"
                            maxlength="50"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="结果" prop="depMemo" :rules="{ required: true, message: '结果不得为空' }" class="text-line">
                        <el-input
                            placeholder="请输入结果"
                            type="textarea"
                            resize="none"
                            v-model="fromData.depMemo"
                            maxlength="50"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="分析原因" prop="depMemo" :rules="{ required: true, message: '分析原因不得为空' }" class="text-line">
                        <el-input
                            placeholder="请输入分析原因"
                            type="textarea"
                            resize="none"
                            v-model="fromData.depMemo"
                            maxlength="50"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="确认根本原因" prop="depMemo" :rules="{ required: true, message: '确认根本原因不得为空' }" class="text-line">
                        <el-input
                            placeholder="请输入确认根本原因"
                            type="textarea"
                            resize="none"
                            v-model="fromData.depMemo"
                            maxlength="50"
                        ></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="重来一次" prop="depMemo" :rules="{ required: true, message: '重来一次不得为空' }" class="text-line">
                        <el-input
                            placeholder="请输入重来一次"
                            type="textarea"
                            resize="none"
                            v-model="fromData.depMemo"
                            maxlength="50"
                        ></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </v-drawer>
    </div>
</template>
<script>
export default {
    name: 'customers', // 结构名称
    data() {
        return {
            // 数据模型a
            timer:"",
            data:{
                state:''
            },
            tableData:['1'],
            stateList: [
                {
                label: "在职",
                value: 0
                },
                {
                label: "离职",
                value: 1
                },
                {
                label: "长沙地铁",
                value: 2
                }
            ],
            drawer:false,
            fromData:{}
        }
    },
    watch: {
        // 监控集合
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
        this.$nextTick(function() {
            // console.log('执行完后，执行===============》mounted');
            this.$refs.list.setCurrentRow(this.tableData[0]);
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
        editFn(){
            this.drawer=true;
        },
        tableSelectFn(currentRow, oldCurrentRow) {
        //表格选中时
        },
        submitFn(){

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
}
</style>

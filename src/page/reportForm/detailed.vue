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
                <span class="drc cp operate ml30 hover-color" @click="exportFn" v-if="tableData && tableData.length > 0">
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
                height="calc(100vh - 135px)"
                :data="tableData"
                style="width:100%"
            >
                <el-table-column align="center" class-name="serial-num" width="50" label="序号" type="index" ></el-table-column>
                <el-table-column align="center" min-width="100" label="姓名"></el-table-column>
                <el-table-column align="left" min-width="200" header-align="center" label="单位"></el-table-column>
                <el-table-column align="left" min-width="200" header-align="center" label="项目" prop="projName"></el-table-column>
                <el-table-column align="center" min-width="100" label="销售人员"></el-table-column>
                <el-table-column align="center" min-width="100" label="客户联系人" prop="contact"></el-table-column>
                <el-table-column align="center" min-width="100" label="服务来源" prop="sourceFrom"></el-table-column>
                <el-table-column align="center" min-width="100" label="服务类型" prop="type"></el-table-column>
                <el-table-column align="center" min-width="110"  label="服务时间" prop="serverTime"></el-table-column>
                <el-table-column align="center" min-width="200"  label="服务内容" prop="description">
                    <template slot-scope="scope">
                        <span class="text-over" :title="scope.row.description">{{scope.row.description}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100"  label="处理阶段" prop="resStatus">
                    <template slot-scope="scope">
                        <span v-if="scope.row.resStatus == '未处理'" class="red-txt fs14">待处理</span>
                        <span v-else-if="scope.row.resStatus == '进行中'" class="yellow-txt fs14">处理中</span>
                        <span v-else class="green-txt fs14">{{ scope.row.resStatus }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="80"  label="反馈详情">
                    <template slot-scope="scope">
                        <span class="draw-tit cp fs14" @click="feedbackFn(scope.row)">查看</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <v-d :drawer="drawer1" :id="id" :from="rowFrom" :type="1"></v-d>
    </div>
</template>
<script>
import drawer1 from "@/components/drawer1";
export default {
    name: 'detailed', // 结构名称
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
            drawer1:false,
            id: "", //反馈问题id
            rowFrom: "", //反馈问题来源
        }
    },
    watch: {
        // 监控集合
    },
    components: {
        "v-d": drawer1,
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
        feedbackFn(row){
            this.drawer1=true;
            // this.id=row.id;
            // this.rowFrom = false;
            // if (row.sourceFrom == "工单" ||row.sourceFrom == "内部") {
            //     if (row.sourceFrom == "工单") {
            //         this.rowFrom = true;
            //     }
            // }
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style  lang='less' scoped>
.detailed{
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

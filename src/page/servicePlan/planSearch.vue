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
            </div>
        </div>
        <div class="table-box">
            <el-table
                cell-class-name="fs13 table-h"
                header-cell-class-name="table-header table-h"
                border
                row-key="id"
                :tree-props="{children:'children',hasChildren:'hasChildren'}"
                ref="list"
                height="calc(100vh - 135px)"
                :data="tableData"
                style="width:100%"
                @expand-change="expandedChange"
            >
                <el-table-column align="center" class-name="serial-num" width="50" label="序号" type="index" ></el-table-column>
                <el-table-column header-align="center" align="left" prop="comName" label="部门名称">
                    <template slot-scope="scope">
                        <i class="left-icon" :class="scope.row.selected?'el-icon-folder-remove':'el-icon-folder-add'" v-if="scope.row.children"></i>
                        <i class="left-icon el-icon-document" v-else></i>
                        {{scope.row.comName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="责任人"></el-table-column>
                <el-table-column align="center" label="指派人"></el-table-column>
                <el-table-column align="center" label="计划类型"></el-table-column>
                <el-table-column align="center" label="事项数量"></el-table-column>
                <el-table-column align="center" label="支撑明细"></el-table-column>
                <el-table-column align="center" label="报表"></el-table-column>
            </el-table>
        </div>
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
            tableData:[
                {
                    id: 2,
                    date: '2016-05-04',
                    comName: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                },{
                    id: 3,
                    date: '2016-05-04',
                    comName: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄',
                    children:[
                        {
                            id: 31,
                            date: '2016-05-01',
                            comName: '王小虎',
                            address: '上海市普陀区金沙江路 1519 弄'
                        },{
                            id: 32,
                            date: '2016-05-01',
                            comName: '王小虎',
                            address: '上海市普陀区金沙江路 1519 弄',
                            children:[
                                {
                                    id: 333,
                                    date: '2016-05-01',
                                    comName: '王小虎',
                                    address: '上海市普陀区金沙江路 1519 弄'
                                }
                            ]
                        }
                    ]
                },{
                    id: 4,
                    date: '2016-05-04',
                    comName: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }
            ],
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
        expandedChange(row){
            if(row.selected){
                row.selected=!row.selected
            }else{
                row.selected=true
            }
        }
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style  lang='less' scoped>
.planSearch{
    padding: 15px;
    .top-box{
        margin-bottom: 15px;
        .operate{
            i {
                margin-right: 5px;
            }
        }
    }
    .table-box{
        .left-icon {
            color: #f7aa12;
            font-size: 16px;
            margin-right: 10px;
        }
        .el-table /deep/ .cell{
            position: relative;
            & .el-table__expand-icon{
                position: absolute;
                right: 10px;
            }
        }

    }
}
</style>

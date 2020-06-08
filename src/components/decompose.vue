<!-- 模型： DOM 结构 -->
<template>
    <div class="decompose">
        <div class="top-box drc">
            <span class="mr40">计划内容：<font class="red-txt">签约</font></span>
            <span class="mr10">输出：<font class="red-txt">30</font>万</span>
        </div>
        <div class="table-box">
            <el-table
                cell-class-name="fs13 table-h"
                header-cell-class-name="table-header table-h"
                :tree-props="{children:'children',hasChildren:'hasChildren'}"
                @expand-change="expandedChange"
                border
                :data="tableData"
                height="calc(60vh - 160px)"
                ref="list"
                style="flex:1.2"
                highlight-current-row
                @current-change="tableSelectFn"
            >
                <el-table-column header-align="center" align="left" prop="depName" label="部门名称">
                    <template slot-scope="scope">
                        <div style="display:flex;align-items: center;max-width: calc(100% - 30px);">
                            <i class="left-icon" :class="scope.row.selected?'el-icon-folder-remove':'el-icon-folder-add'" v-if="scope.row.children"></i>
                            <i class="left-icon el-icon-document" v-else></i>
                            <span class="text-over" :title="scope.row.depName">{{scope.row.depName}}</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                cell-class-name="fs13 table-h"
                header-cell-class-name="table-header table-h"
                border
                row-key="id"
                :data="leftData"
                @selection-change="leftChange"
                @selection-all="leftAll"
                @select="leftRow"
                style="flex:0.8"
            >
                <el-table-column align="center" type="selection"></el-table-column>
                <el-table-column align="center" label="姓名" prop="name"></el-table-column>
            </el-table>
            <div class="left-or-right">
                <p class="transfer-btn mb20" @click="toRight" :class="leftList.length>0?'acitve':''">
                    <i class="icon el-icon-d-arrow-right fs16"></i>
                </p>
                <p class="transfer-btn" :class="rightList.length>0?'acitve':''">
                    <i class="icon el-icon-d-arrow-left fs16"></i>
                </p>
            </div>
            <el-table
                cell-class-name="fs13 table-h"
                header-cell-class-name="table-header table-h"
                border
                row-key="id"
                :data="rightData"
                @selection-change="rightChange"
                @selection-all="rightAll"
                @select="rightRow"
                style="flex:2"
            >
                <el-table-column align="center" class-name="serial-num" type="selection"></el-table-column>
                <el-table-column
                    align="center"
                    width="50"
                    label="序号"
                    type="index"
                ></el-table-column>
                <el-table-column align="center" label="姓名" prop="name"></el-table-column>
                <el-table-column align="center" label="输出标准">
                    
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    name: 'decompose', // 结构名称
    data() {
        return {
            // 数据模型a
            tableData:[],
            leftData:[],
            rightData:[],
            leftList:[],//左侧勾选承载数组
            rightList:[],//右侧勾选承载数组
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
        this.getDepart()
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
        expandedChange(row){
            if(row.selected){
                row.selected=!row.selected
            }else{
                row.selected=true
            }
        },
        toRight(){
            this.rightData=JSON.parse(JSON.stringify(this.leftList));
        },
        /*监听多选框*/
        leftChange(sele) {
            this.leftList=JSON.parse(JSON.stringify(sele));
            // if (sele.length > 0) {
            //     for (let x of sele) {
            //         x.isReadx = 1;
            //     }
            // } else {
            //     for (let x of this.tableData1) {
            //         x.isReadx = 0;
            //     }
            // }
        },
        leftRow(sele, row) {
            // this.list=JSON.parse(JSON.stringify(sele));
            // if (row.isReadx == 1) {
            //     row.isReadx = 0;
            // }
        },
        leftAll(sele) {
            // console.log(sele);
        },
        rightChange(sele) {
            this.rightList=JSON.parse(JSON.stringify(sele));
            // if (sele.length > 0) {
            //     for (let x of sele) {
            //         x.isReadx = 1;
            //     }
            // } else {
            //     for (let x of this.tableData1) {
            //         x.isReadx = 0;
            //     }
            // }
        },
        rightRow(sele, row) {
            console.log(row)
            // if (row.isReadx == 1) {
            //     row.isReadx = 0;
            // }
        },
        rightAll(sele) {
            // console.log(sele);
        },
        /**监听多选框end */
        getDepart(){//获取组织关系
            let d = JSON.parse(sessionStorage.getItem('depart'));
            let c = this.getTreeDic('039-011-',d,1);
            this.tableData=c;
            this.$refs.list.setCurrentRow(this.tableData[0]);
        },
        tableSelectFn(currentRow, oldCurrentRow) {
            //表格选中时
            if (currentRow) {
                this.$http({
                    method:'get',
                    url:'/common/departUser',
                    params:{
                        depId:currentRow.depId
                    }
                }).then(res=>{
                    if(res.succ){
                        this.leftData=res.data
                    }
                })
            }
        },
    }

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style  lang='less' scoped>
.decompose{
    padding: 15px;
    .table-box{
        display: flex;
        justify-content: space-between;
        .left-icon {
            color: #f7aa12;
            font-size: 16px;
            margin-right: 10px;
        }
        .el-table /deep/ .cell{
            display: flex;
            align-items: center;
            position: relative;
            & .el-table__expand-icon{
                position: absolute;
                right: 10px;
            }
        }
        .el-table /deep/ .is-center .cell{
            justify-content: center;
        }
        .left-or-right{
            align-self:center;
            margin: 0 30px;
            .transfer-btn{
                width: 40px;
                line-height: 28px;
                border-radius:4px;
                border: 1px solid  #DFE4ED;
                text-align: center;
                background: #fff;
                cursor: no-drop;
                .icon{
                    color: #BFC8D8
                }
            }
            .acitve{
                cursor: pointer;
                border-color:#2796FF;
                background:#2796FF;
                .icon{
                    color: #fff
                }
            }
        }
    }
}
</style>

<!-- 模型： DOM 结构 -->
<template>
    <div class="method">
        <div class="head-box drc">
            <span class="drc">
                <font class="fs13" style="margin-right:12px">单位/项目</font>
                <el-select v-model="data.projId" placeholder="请选择" size="mini" style="width:122px">
                    <el-option
                        v-for="item in projectList"
                        :key="item.projId"
                        :label="item.projName"
                        :value="item.projId"
                    ></el-option>
                </el-select>
            </span>
        </div>
        <div class="table-box">
            <el-table
                cell-class-name="fs13 table-h"
                header-cell-class-name="table-header table-h"
                border
                height="32vh"
                :data="tableData"
                style="width:100%"
            >
                <el-table-column
                    align="center"
                    class-name="serial-num"
                    width="50"
                    label="序号"
                    type="index"
                ></el-table-column>
                <el-table-column
                    header-align="center"
                    align="left"
                    label="名称"
                    min-width="195"
                    prop="stagename"
                ></el-table-column>
                <el-table-column align="center" label="关键约束条件" min-width="230" prop="standard"></el-table-column>
                <el-table-column align="center" label="要带资料" min-width="160" prop="filesdata"></el-table-column>
                <el-table-column align="center" label="总分" min-width="145" prop="score"></el-table-column>
                <el-table-column align="center" label="新建时间" min-width="170" prop="addtime"></el-table-column>
                <el-table-column align="center" label="计划开始时间" min-width="120" prop="planStartime"></el-table-column>
                <el-table-column align="center" label="计划完成时间" min-width="120" prop="planEndtime"></el-table-column>
                <el-table-column align="center" label="实际完成时间" min-width="120" prop="completeTime"></el-table-column>
                <el-table-column header-align="center" align="left" label="备注" min-width="182" prop="remarks">
                    <template slot-scope="scope">
                        <span class="text-over" :title="scope.row.remarks">{{scope.row.remarks}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    name: "method", // 结构名称
    data() {
        return {
            // 数据模型a
            projectList: [],
            tableData: [],
            data: {
                comId: "",
                projId: null
            }
        };
    },
    watch: {
        // 监控集合
        comid: function(val, old) {
            this.projectList = [];
            
            if (val != "") {
                // this.data.projId = null;
                this.data.projId=val;
                this.ajax();
                this.getProList();
            } else {
                this.tableData.splice(0);
            }
        },
        data: {
            deep: true,
            handler(val, old) {
                this.ajax();
            }
        }
    },
    props: {
        // 集成父级参数
        comid: {
            default: ""
        },
        comName: {
            default: ""
        }
    },
    beforeCreate() {
        // console.group('创建前状态  ===============》beforeCreate');
    },
    created() {
        // console.group('创建完毕状态===============》created');
        if (this.comid != "") {
            this.ajax();
            this.getProList();
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
        ajax() {
            let d = this.data;
            d.comId = this.comid;
            // d.comId='81730CF7-7556-406F-B7AB-7AB53BF619FD'
            // d.projId='81730CF7-7556-406F-B7AB-7AB53BF619FD'
            for (let x in d) {
                if (d[x] == null) {
                    delete d[x];
                }
            }
            this.$http({
                method: "post",
                data: d,
                url: "/so/filesAndCom/list"
            }).then(res => {
                this.tableData = res.data;
            });
        },
        getProList() {
            this.$http({
                method: "post",
                url: "/so/project/comPrject/list",
                data: {
                    comId: this.comid,
                    comName: this.comName,
                    type: "fileAndCom"
                }
            }).then(res => {
                this.projectList = res.data;
                // this.data.projId=res.data[0].projId;
                // this.projectList.unshift({ projName: "请选择", projId: null });
            });
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
</style>

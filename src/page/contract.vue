<!-- 模型： DOM 结构 -->
<template>
    <div class="contract">
        <div class="table-box">
            <el-table
                height="32vh"
                cell-class-name="fs13 table-h"
                header-cell-class-name="table-header table-h"
                border
                :data="tableData"
                style="width:100%"
            >
                <el-table-column
                    align="center"
                    class-name="serial-num"
                    width="50px"
                    label="序号"
                    type="index"
                ></el-table-column>
                <el-table-column align="center" label="合同编号" width="120" prop></el-table-column>
                <el-table-column align="center" label="签订时间" width="120" prop></el-table-column>
                <el-table-column align="center" label="区域" width="80" prop></el-table-column>
                <el-table-column align="center" label="销售姓名" width="90" prop></el-table-column>
                <el-table-column align="center" label="收入类型" width="125" prop></el-table-column>
                <el-table-column align="center" label="业主单位/甲方" width="235" prop></el-table-column>
                <el-table-column align="center" label="项目名称" width="220" prop></el-table-column>
                <el-table-column align="center" label="合同单位" width="230" prop></el-table-column>
                <el-table-column align="center" label="上传人" width="80" prop></el-table-column>
                <el-table-column align="center" label="金额" width="70" prop></el-table-column>
                <el-table-column align="center" label="回款" width="70" prop></el-table-column>
                <el-table-column align="center" label="是否开发票" width="120" prop></el-table-column>
                <el-table-column align="center" label="合同" width="90" prop></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    name: "contract", // 结构名称
    data() {
        return {
            // 数据模型a
            tableData: []
        };
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
    }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped></style>

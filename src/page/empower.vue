<!-- 模型： DOM 结构 -->
<template>
    <div class="empower">
        <div class="table-box">
            <el-table cell-class-name="fs13 table-h" header-cell-class-name="table-header table-h" border :data="tableData" style="width:100%">
                <el-table-column align="center" class-name="serial-num" width="50px" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="单位名称" prop=""></el-table-column>
                <el-table-column align="center" label="模板" prop=""></el-table-column>
                <el-table-column align="center" label="标准菜单授权" prop=""></el-table-column>
                <el-table-column align="center" label="自定义菜单授权" prop=""></el-table-column>
                <el-table-column align="center" label="二级域名" prop=""></el-table-column>
                <el-table-column align="center" label="预览"  prop=""></el-table-column>
                <el-table-column align="center" label="备注" prop=""></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    name: 'empower', // 结构名称
    data() {
        return {
            // 数据模型a
            tableData
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

}

</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style  lang='less' scoped>

</style>

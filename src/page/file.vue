<!-- 模型： DOM 结构 -->
<template>
    <div class="file">
        <div class="head-box drc">
            <span class="drc cp mr20">
                <i class="el-icon-upload"></i>
                <font class="fs13">上传</font>
            </span>
        </div>
        <div class="table-box">
            <el-table cell-class-name="fs13 table-h" header-cell-class-name="table-header table-h" border :data="tableData" style="width:100%">
                <el-table-column align="center" class-name="serial-num" width="50px" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="文档名称" prop=""></el-table-column>
                <el-table-column align="center" label="上传人" prop=""></el-table-column>
                <el-table-column align="center" label="上传时间" prop=""></el-table-column>
                <el-table-column align="center" label="预览" prop=""></el-table-column>
            </el-table>
        </div>
        <v-drawer :title="'上传'" :drawer="drawer">
            <el-form :model="fromData" label-width="80px" size="medium">
                <el-form-item label="文档名称" prop="name">
                    <el-input v-model="fromData.name"></el-input>
                </el-form-item>
                <el-form-item label="上传附件" prop="name">
                    <el-upload 
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :multiple="false"
                        :on-success="upLoadfn.uploadSucFn"
                        :on-error="upLoadfn.uploadErrFn"
                        :limit="1"
                        :on-exceed="upLoadfn.uploadExcFn"
                    >
                        <button class="upload-btn">点击上传</button>
                    </el-upload>
                </el-form-item>
            </el-form>
        </v-drawer>
    </div>
</template>
<script>
export default {
    name: 'file', // 结构名称
    data() {
        return {
            // 数据模型a
            drawer:false,
            tableData:[],
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
.head-box{
    height: 40px;
    i{
        margin-right: 5px;
    }
}
.el-form /deep/ .el-form-item__label{
    font-size: 13px;
    color: #5A5E66;
}
</style>

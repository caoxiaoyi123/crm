<!-- 模型： DOM 结构 -->
<template>
    <div class="service">
        <div class="head-box drc">
            <span class="drc mr20">
                <font class="fs13" style="margin-right:12px">项目名称</font>
                <el-select v-model="proName" placeholder="请选择" size="mini" style="width:122px">
                    <el-option
                    v-for="item in nameList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </span>
            <span class="drc cp mr20" @click="creatFn">
                <i class="el-icon-plus"></i>
                <font class="fs13">新建</font>
            </span>
            <span class="drc cp mr20" @click="editFn">
                <i class="el-icon-edit"></i>
                <font class="fs13">编辑</font>
            </span>
            <span class="drc cp">
                <i class="el-icon-remove-outline"></i>
                <font class="fs13">删除</font>
            </span>
        </div>
        <div class="table-box">
            <el-table cell-class-name="fs13 table-h" header-cell-class-name="table-header table-h" border :data="tableData" style="width:100%">
                <el-table-column align="center" class-name="serial-num" width="50px" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="项目名称" prop=""></el-table-column>
                <el-table-column align="center" label="销售人员" prop=""></el-table-column>
                <el-table-column align="center" label="客户联系人" prop=""></el-table-column>
                <el-table-column align="center" label="服务来源" prop=""></el-table-column>
                <el-table-column align="center" label="服务类型" prop=""></el-table-column>
                <el-table-column align="center" label="服务人员" prop=""></el-table-column>
                <el-table-column align="center" label="服务时间" prop=""></el-table-column>
                <el-table-column align="center" label="服务内容" prop=""></el-table-column>
                <el-table-column align="center" label="处理阶段" prop=""></el-table-column>
                <el-table-column align="center" label="操作" prop=""></el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
export default {
    name: 'service', // 结构名称
    data() {
        return {
            // 数据模型a
            proName:'',
            nameList:[],
            drawer:false,
            tableData:[]
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
        creatFn(){
            this.drawer=true;
            this.title='新建服务记录'
        },
        editFn(){
            this.drawer=true;
            this.title='编辑服务记录'
        }
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
</style>

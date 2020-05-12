<!-- 模型： DOM 结构 -->
<template>
    <div class="user">
        <div class="head-box drc">
            <span class="drc cp mr20" @click="creatFn">
                <i class="el-icon-plus"></i>
                <font class="fs13">新建</font>
            </span>
            <span class="drc cp mr20" @click="editFn">
                <i class="el-icon-edit"></i>
                <font class="fs13">编辑</font>
            </span>
            <span class="drc cp mr20">
                <i class="icon icon-daochu el-icon-upload2"></i>
                <font class="fs13">导出excel</font>
            </span>
            <span class="drc cp mr20">
                <i class="icon icon-daoru el-icon-download"></i>
                <font class="fs13">批量导入</font>
            </span>
            <span class="drc cp mr20">
                <i class="icon icon-yhmb"></i>
                <font class="fs13">用户模板</font>
            </span>
            <span class="drc">
                <font class="fs13" style="margin-right:12px">在职状态</font>
                <el-select v-model="state" placeholder="请选择" size="mini" style="width:122px">
                    <el-option
                    v-for="item in stateList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </span>
        </div>
        <div class="table-box">
            <el-table cell-class-name="fs13 table-h" header-cell-class-name="table-header table-h" border :data="tableData" style="width:100%">
                <el-table-column align="center" class-name="serial-num" width="50px" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="所属公司" prop=""></el-table-column>
                <el-table-column align="center" label="姓名" prop=""></el-table-column>
                <el-table-column align="center" label="用户名" prop=""></el-table-column>
                <el-table-column align="center" label="手机号码" prop=""></el-table-column>
                <el-table-column align="center" label="电子邮箱" prop=""></el-table-column>
                <el-table-column align="center" label="产品授权" prop=""></el-table-column>
                <el-table-column align="center" label="APP授权" prop=""></el-table-column>
                <el-table-column align="center" label="在职状态" prop=""></el-table-column>
                <el-table-column align="center" label="管理者" prop=""></el-table-column>
            </el-table>
        </div>
        <v-drawer :title="title" :drawer="drawer">
            <el-form :model="fromData" label-width="80px" size="medium">
                <h4 class="bor-b tit-txt fs16">用户信息</h4>
                <div class="dfrb">
                    <el-form-item label="用户名" prop="userName" :rules="{required:true,message:'用户名不得为空'}">
                        <el-input v-model="fromData.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="fzr">
                        <el-input v-model="fromData.name"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="密码" prop="password" :rules="{required:true,message:'密码不得为空'}">
                        <el-input v-model="fromData.password" show-password style="width:200px"></el-input>
                    </el-form-item>
                    <el-form-item label="确认密码" prop="password2" :rules="{required:true,message:'确认密码不得为空'}">
                        <el-input v-model="fromData.password2" show-password style="width:200px"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="单位" prop="dw">
                        <el-input v-model="fromData.dw" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="email">
                        <el-input v-model="fromData.email"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="手机号码" prop="phone">
                        <el-input v-model="fromData.phone" :rules="{required:true,message:'手机号码不得为空'}"></el-input>
                    </el-form-item>
                    <el-form-item label="职务" prop="zw">
                        <el-input v-model="fromData.zw"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="fromData.sex" style="width:200px">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年龄" prop="age">
                        <el-input v-model="fromData.age"></el-input>
                    </el-form-item>
                </div>
                <h4 class="bor-b tit-txt fs16">其他资料</h4>
                <div class="dfrb">
                    <el-form-item label="籍贯" prop="jg">
                        <el-input v-model="fromData.jg"></el-input>
                    </el-form-item>
                    <el-form-item label="毕业院校" prop="byyx">
                        <el-input v-model="fromData.byyx"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="学历" prop="xl">
                        <el-select v-model="fromData.xl" style="width:200px">
                            <el-option label="男" value="男"></el-option>
                            <el-option label="女" value="女"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="爱好" prop="like">
                        <el-input v-model="fromData.like"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="婚姻状况" prop="hyzk">
                        <el-input v-model="fromData.hyzk"></el-input>
                    </el-form-item>
                    <el-form-item label="工作经历" prop="byyx">
                        <el-input v-model="fromData.byyx"></el-input>
                    </el-form-item>
                </div>
            </el-form>
        </v-drawer>
    </div>
</template>
<script>
export default {
    name: 'user', // 结构名称
    data() {
        return {
            // 数据模型a
            tableData:[],
            drawer:false,
            title:"",
            fromData:{},
            state:'',
            stateList:[],
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
            this.title='新建用户'
        },
        editFn(){
            this.drawer=true;
            this.title='编辑用户'
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
.drawer /deep/ .el-form h4{
    height: 44px;
    line-height: 44px;
    margin-bottom: 15px;
}
.el-form /deep/ .el-form-item__label{
    font-size: 13px;
    color: #5A5E66;
}
</style>

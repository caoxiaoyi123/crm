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
                        :value="item.value"
                    ></el-option>
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
                <el-table-column header-align="center" align="left" label="项目名称" prop></el-table-column>
                <el-table-column align="center" label="销售人员" prop></el-table-column>
                <el-table-column align="center" label="客户联系人" prop></el-table-column>
                <el-table-column align="center" label="服务来源" prop></el-table-column>
                <el-table-column align="center" label="服务类型" prop></el-table-column>
                <el-table-column align="center" label="服务人员" prop></el-table-column>
                <el-table-column align="center" label="服务时间" prop></el-table-column>
                <el-table-column align="center" label="服务内容" prop></el-table-column>
                <el-table-column align="center" label="处理阶段" prop></el-table-column>
                <el-table-column align="center" label="操作" prop></el-table-column>
            </el-table>
        </div>
        <v-drawer :title="title" :drawer="drawer" :drawerW="drawerW" @submitFn="submitFn">
            <el-form :model="fromData" label-width="94px" ref="fromData" size="medium" >
                <div class="dfrb">
                    <el-form-item label="单位名称" prop="depName" :rules="{ required: true, message: '单位名称不得为空' }">
                        <el-input v-model="fromData.depName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="项目名称" prop="depName" :rules="{ required: true, message: '项目名称不得为空' }">
                        <el-select placeholder="请选择项目名称" v-model="fromData.depName"  style="width:202px">
                            <el-option
                                v-for="item in stateList"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="销售人员" prop="depName" :rules="{ required: true, message: '销售人员不得为空' }">
                        <el-input v-model="fromData.depName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="客户联系人" prop="depName" :rules="{ required: true, message: '客户联系人不得为空' }">
                        <el-select v-model="fromData.depName" placeholder="请选择客户联系人" style="width:202px">
                            <el-option
                                v-for="item in stateList"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="服务来源" prop="projState" :rules="{ required: true, message: '服务来源不得为空' }">
                        <el-select  placeholder="请选择服务来源" v-model="fromData.projState"  style="width:202px">
                            <el-option
                                v-for="item in stateList"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务类型" prop="depName" :rules="{ required: true, message: '服务类型不得为空' }">
                        <el-select  placeholder="请选择服务类型" v-model="fromData.projState"  style="width:202px">
                            <el-option
                                v-for="item in stateList"
                                :key="item"
                                :label="item"
                                :value="item"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="服务时间" prop="depName" :rules="{ required: true, message: '服务时间不得为空' }">
                    <el-date-picker
                    v-model="fromData.depName"
                    type="date"
                    placeholder="请选择服务时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="服务内容" prop="remake">
                    <el-input
                        placeholder="请输入服务内容"
                        type="textarea"
                        resize="none"
                        v-model="fromData.remake"
                        maxlength="50"
                    ></el-input>
                </el-form-item>
                <h4 class="bor-b mb20"></h4>
                <div class="dfrb">
                    <el-form-item label="内部验收单" label-width="115px">
                        <el-upload
                            ref="upload"
                            :action="baseUrl + '/so/file/upload'"
                            :show-file-list="false"
                            :multiple="false"
                            :on-success="sucFn"
                            :on-error="upLoadfn.uploadErrFn"
                            :limit="1"
                            :on-exceed="upLoadfn.uploadExcFn"
                            :data="fromData"
                        >
                            <button class="fs12 text-c cp upload-btn ml30">上传文件</button>
                        </el-upload>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="硬件安装验收单"  label-width="115px">
                        <el-upload
                            ref="upload"
                            :action="baseUrl + '/so/file/upload'"
                            :show-file-list="false"
                            :multiple="false"
                            :on-success="sucFn"
                            :on-error="upLoadfn.uploadErrFn"
                            :limit="1"
                            :on-exceed="upLoadfn.uploadExcFn"
                            :data="fromData"
                        >
                            <button class="fs12 text-c cp upload-btn ml30">上传文件</button>
                        </el-upload>
                    </el-form-item>
                </div>

            </el-form>
        </v-drawer>
    </div>
</template>
<script>
export default {
    name: "service", // 结构名称
    data() {
        return {
            // 数据模型a
            proName: "",
            nameList: [],
            drawer: false,
            tableData: [],
            drawerW: "764px",
            title: "",
            fromData:{},
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
        creatFn() {
            this.drawer = true;
            this.title = "新建服务记录";
            this.drawerW = "764px";
        },
        editFn() {
            this.drawer = true;
            this.title = "编辑服务记录";
            this.drawerW = "764px";
        },
        submitFn(){

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
.el-form /deep/ .el-form-item__label {
    font-size: 13px;
    color: #5a5e66;
}
.upload-btn {
    width: 68px;
    line-height: 23px;
    border: 1px solid #1989fa;
    background: #fff;
    color: #1989fa;
    outline: none;
    border-radius: 12px;
}
</style>

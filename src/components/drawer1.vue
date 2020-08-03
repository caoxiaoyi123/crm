<!-- 模型： DOM 结构 -->
<template>
    <div class="drawer">
        <el-drawer
            :close-on-press-escape="false"
            :wrapperClosable="false"
            :visible.sync="d"
            :modal-append-to-body="false"
            :size="drawerW"
            :show-close="true"
            :withHeader="false"
            :destroy-on-close="true"
            ref="drref"
        >
            <header>
                <font class="fs18 draw-tit">反馈详情</font>
                <i class="el-icon-close cp" @click="closeFn"></i>
            </header>
            <section>
                <div class="dfrb content">
                    <!-- 历史记录 -->
                    <div class="main" :class="type == 1 ? 'main-w' : ''">
                        <h5 class="tit-txt fs16 text-l">历史记录</h5>
                        <div class="box bor">
                            <p class="fs13 tit-txt" style="margin-bottom:17px">反馈记录</p>
                            <ul class="record">
                                <li class="mb10" v-for="(item, i) of recordList" :key="i">
                                    <div class="tit-txt fs13">
                                        <font
                                            class="mr10"
                                            :class="item.role == 'consumer' ? 'tr' : ''"
                                        >!</font>
                                        {{ item.createtime }}
                                        <b>[{{ item.status }}]</b>
                                        {{ item.userName }}添加了反馈
                                    </div>
                                    <p class="fs12">{{ item.description }}</p>
                                </li>
                            </ul>
                            <div class="btm-box bor-t pt20" v-if="!from">
                                <p class="fs13 tit-txt" style="margin-bottom:12px">相关文档</p>
                                <ul>
                                    <li
                                        v-for="(item, i) of fileList"
                                        :key="i"
                                        class="fs12 bule-txt cp"
                                        @click="previewFn(item)"
                                    >{{ item.fileName }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="main" v-if="type == 0">
                        <h5 class="tit-txt fs16 text-l">当前反馈</h5>
                        <div class="box bor">
                            <p class="fs13 required">我要反馈</p>
                            <textarea
                                placeholder="请详细填写反馈内容，该内容会同步展示给服务提出人，请谨慎填写！"
                                v-model="fromData.description"
                                class="fs13 bor mb10"
                                maxlength="200"
                            ></textarea>
                            <el-form @submit.native.prevent>
                                <div class="upload-box " v-if="!from">
                                    <div class="label fs13 required">相关文档</div>
                                    <v-upload :fileData="file" :limitNum="10000"></v-upload>
                                </div>
                                <!-- <el-form-item label="相关文档" label-width="65px" v-if="!from">
                                    <v-upload :fileData="file" :limitNum="10000"></v-upload>
                                </el-form-item> -->
                                <el-form-item class="required label-required" label="服务类型" label-width="65px" v-else>
                                    <el-select
                                        placeholder="请选择服务类型"
                                        v-model="fromData.type"
                                        style="width:250px"
                                    >
                                        <el-option
                                            v-for="item in typeList"
                                            :key="item"
                                            :label="item"
                                            :value="item"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="required label-required" label="处理阶段" label-width="65px">
                                    <span
                                        v-for="(item, i) of btnList"
                                        :key="i"
                                        class="status-btn fs12 mr10 cp"
                                        :class="item == btnTxt ? 'active' : ''"
                                        @click="btnTxt = item"
                                    >
                                        <span class="round"></span>
                                        {{ item }}
                                    </span>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <div class="btn-box mt30 text-r fix" :class="type == 1 ? 'fixed' : ''">
                    <template v-if="type == 1">
                        <button class="cancel-btn text-c fs14 cp" @click="closeFn">关闭</button>
                    </template>
                    <template v-else>
                        <button class="cancel-btn mr30 text-c fs14 cp" @click="closeFn">取消</button>
                        <button class="sure-btn text-c fs14 cp" @click="sumbitFn">保存</button>
                    </template>
                </div>
            </section>
        </el-drawer>
    </div>
</template>
<script>
import {
    baseUrl //引入baseUrl
} from "../../config/env";
import upload from "@/components/upload";
export default {
    name: "drawer", // 结构名称
    data() {
        return {
            // 数据模型
            drawerW: "915px",
            d: false,
            recordList: [],
            fileList: null,
            file: {
                data: {
                    id: null,
                    type: 13,
                    uploadType: "server",
                    userId: null
                },
                list: []
            },
            typeList: [
                "售前交流",
                "平台配置",
                "售后培训",
                "硬件安装",
                "bug反馈",
                "操作指导",
                "功能优化",
                "新加功能",
                "回访客户",
                "好评反馈",
                "其他类型"
            ],
            btnList: ["处理中", "已处理"],
            btnTxt: "处理中",
            fromData: {}
        };
    },
    components: {
        "v-upload": upload
    },
    watch: {
        // 监控集合
        drawer(val, old) {
            this.d = val;
            this.file.data.id = this.$parent.comid;
            if (sessionStorage.getItem("userid")) {
                this.file.data.userId = sessionStorage.getItem("userid");
            } else {
                this.file.data.userId = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
            }
            this.file.id = null;
            this.fromData = new Object();
            this.getDetail();
        },
        d(val, old) {
            this.$parent.drawer1 = val;
        }
    },
    props: {
        // 集成父级参数
        drawer: {
            default: false
        },
        id: {
            default: ""
        },
        from: {
            default: false
        },
        type: {
            default: 0
        }
    },
    beforeCreate() {
        // console.group('创建前状态  ===============》beforeCreate');
    },
    created() {
        // console.group('创建完毕状态===============》created');
        this.file.id = null;
        if (this.type == 1) {
            this.drawerW = "480px";
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
        closeFn() {
            // this.$parent.drawer=false
            this.file.id=null;
            this.file.list=[];
            this.$refs.drref.closeDrawer();
        },
        sumbitFn() {
            let d = JSON.parse(JSON.stringify(this.fromData));
            d.fileId = this.file.id;
            d.problemid = this.id;
            d.projId = this.recordList[0].projId;
            if (sessionStorage.getItem("userid")) {
                d.userid = sessionStorage.getItem("userid");
            } else {
                d.userid = "60C877AB-3B89-44A8-A4EA-0265002DC975"; //当前用户id
            }
            if(this.btnTxt=='处理中'){
                d.status = '进行中';
            }else{
                d.status=this.btnTxt
            }
            if(!this.from){
                if(!this.file.id||this.file.id==''){
                    this.$message({
                        message: "相关文档为必传",
                        type: "warning"
                    });
                    return false;
                }
            }
            if (!d.description || d.description == "") {
                this.$message({
                    message: "反馈内容为必填项",
                    type: "warning"
                });
                return false;
            }
            if (this.from) {
                if (!d.type || d.type == "") {
                    this.$message({
                        message: "服务类型为必填项",
                        type: "warning"
                    });
                    return false;
                }
            }
            this.$http({
                method: "post",
                url: "/so/problem/saveFeedback",
                data: d
            }).then(res => {
                if (res.succ) {
                    this.$message({
                        title: "成功",
                        message: res.data,
                        type: "success"
                    });
                    this.file.id=null;
                    this.file.list = []; //置空
                    this.d = false;
                    this.$parent.ajax();
                }
            });
        },
        previewFn(row) {
            if (row.servFileType == "company" || row.servFileType == "server") {
                if (
                    row.fileType.toLocaleLowerCase() == ".ppt" ||
                    row.fileType.toLocaleLowerCase() == ".pptx" ||
                    row.fileType.toLocaleLowerCase() == ".doc" ||
                    row.fileType.toLocaleLowerCase() == ".docx" ||
                    row.fileType.toLocaleLowerCase() == ".pdf"
                ) {
                    this.openPdf(
                        baseUrl +
                            "/so/file/view?fileId=" +
                            row.fileId +
                            "&fileName=" +
                            row.fileName
                    );
                } else {
                    this.openLink(
                        baseUrl + "/so/file/view?fileId=" + row.fileId
                    );
                }
            } else {
                this.openLink(row.fileAddress);
            }
        },
        getDetail() {
            this.$http({
                method: "post",
                url: "/so/problem/feedbackDetail",
                data: {
                    id: this.id
                }
            }).then(res => {
                if (res.succ) {
                    this.recordList = JSON.parse(JSON.stringify(res.data.list));
                    this.fileList = JSON.parse(
                        JSON.stringify(res.data.withDoc)
                    );
                }
            });
        }
    }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
header {
    padding: 20px;
    position: relative;
    i {
        position: absolute;
        top: 15px;
        right: 15px;
    }
}
section {
    max-height: calc(100vh - 140px);
    overflow-y: auto;
    padding: 0 35px;
    .btn-box {
        button {
            width: 62px;
            line-height: 32px;
            border: 1px solid #1989fa;
            border-radius: 4px;
            outline: none;
        }
        .cancel-btn {
            background: #fff;
            color: #1989fa;
        }
        .sure-btn {
            background: #1989fa;
            color: #fff;
        }
    }
    .content {
        .main {
            width: 47%;
            .box {
                padding: 15px;
                border-radius: 4px;
                margin-top: 5px;
                padding-bottom: 20px;
                .required{
                    position: relative;
                    &::before{
                        content: '*';
                        position: absolute;
                        top: 0;
                        left: -10px;
                        color: red;
                    }
                }
                .label-required{
                    &::before{
                        top: 10px;
                    }
                }
                .record {
                    font {
                        display: inline-block;
                        width: 15px;
                        line-height: 15px;
                        border-radius: 50%;
                        background: #1989fa;
                        color: #fff;
                        text-align: center;
                    }
                    .tr {
                        background: #f7aa12;
                        transform: rotateX(180deg);
                    }
                    p {
                        margin-top: 5px;
                        padding-left: 28px;
                    }
                }
                textarea {
                    padding: 10px;
                    width: 100%;
                    box-sizing: border-box;
                    height: 115px;
                    border-radius: 4px;
                    margin-top: 15px;
                    resize: none;
                    outline: none;
                }
                .status-btn {
                    display: inline-flex;
                    align-items: center;
                    .round {
                        display: inline-block;
                        width: 12px;
                        height: 12px;
                        border: 1px solid #b4bccc;
                        border-radius: 12px;
                        margin-right: 5px;
                    }
                }
                .active {
                    color: #1989fa;
                    .round {
                        border-color: #1989fa;
                        position: relative;
                        &::before {
                            position: absolute;
                            content: "";
                            width: 7px;
                            height: 7px;
                            background: #1989fa;
                            border-radius: 100%;
                            transform: translate(-50%, -50%);
                            left: 50%;
                            top: 50%;
                        }
                    }
                }
                .upload-box{
                    display: flex;
                    align-items: center;
                    .label{
                        width: 65px;
                    }
                }
                .upload-box /deep/ .upload{
                    width: calc(100% - 65px);
                }
            }
        }
        
        .main-w {
            width: 100%;
        }
    }
    .fix {
        position: fixed;
        bottom: 0;
        width: 803px;
        background: #fff;
        margin: 0;
        line-height: 74px;
        right: 0;
        padding-right: 35px;
        box-sizing: border-box;
    }
    .fixed {
        width: 480px;
    }
}
</style>

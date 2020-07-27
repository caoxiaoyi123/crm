<!-- 模型： DOM 结构 -->
<template>
    <div class="braceSell">
        <div class="top-box dfrcb">
            <div class="drc">
                <span class="drc cp mr20 operate hover-color" @click="creatFn">
                    <i class="icon iconfont iconxinjian"></i>
                    <font class="fs13">新建</font>
                </span>
                <span
                    class="drc cp mr20 operate hover-color"
                    @click="deleteFn"
                    v-if="tableData && tableData.length > 0"
                >
                    <i class="el-icon-remove-outline"></i>
                    <font class="fs13">删除</font>
                </span>
                <div class="comname-ipt" @keydown.13="keywordFn">
                    <input type="text" v-model="data.searchCompName" placeholder="请输入关键字" />
                    <i class="el-icon-search cp" slot="append" @click="keywordFn"></i>
                </div>
            </div>
            <div class="drc fs12">
                <b class="mr10">
                    回款金额：
                    <font class="red-txt">{{ summary["回款"] }}</font>万
                </b>
                <b class="mr10">
                    甲方数量：
                    <font class="red-txt">{{ summary["甲方数量"] }}</font>个
                </b>
                <b class="mr10">
                    签约金额：
                    <font class="red-txt">{{ summary["签约"] }}</font>万
                </b>
                <!-- <span class="mr10">回款金额：<font class="red-txt">{{count.total}}</font>万</span>
                <span class="mr10">甲方数量：<font class="red-txt">{{count.amount}}</font>个</span>
                <span>签约金额：<font class="red-txt">{{count.waitAmount}}</font>万</span>-->
            </div>
        </div>
        <div class="table-box">
            <el-table
                cell-class-name="fs13 table-h"
                @current-change="tableSelectFn"
                highlight-current-row
                header-cell-class-name="table-header table-h"
                border
                ref="list"
                height="calc(100vh - 250px)"
                :data="tableData"
                style="width:100%"
                v-loading="isajax"
                element-loading-text="数据正在加载中"
                element-loading-spinner="el-icon-loading"
            >
                <el-table-column
                    align="center"
                    class-name="serial-num"
                    width="60"
                    fixed
                    label="序号"
                    type="index"
                    :index="indexFn"
                ></el-table-column>
                <el-table-column align="center" label="责任人姓名" width="100" prop="responsibleName"></el-table-column>
                <el-table-column align="center" min-width="140" label="地区" prop="cityDetail">
                    <template slot-scope="scope">
                        <el-tooltip
                            :content="scope.row.cityDetail?returnRegion(scope.row.cityDetail):''"
                            placement="right"
                        >
                            <span
                                class="text-over"
                            >{{ scope.row.cityDetail?returnRegion(scope.row.cityDetail):'' }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    header-align="center"
                    min-width="150"
                    label="单位名称"
                    prop="compName"
                >
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.compName" placement="right">
                            <span class="clamp-2">{{ scope.row.compName }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column
                    align="left"
                    header-align="center"
                    min-width="150"
                    label="项目名称"
                    prop="projName"
                >
                    <template slot-scope="scope">
                        <el-tooltip :content="scope.row.projName" placement="right">
                            <span class="clamp-2">{{ scope.row.projName }}</span>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="负责人" prop="comManager"></el-table-column>
                <el-table-column align="center" label="手机" width="125" prop="comTel"></el-table-column>
                <el-table-column align="center" label="可能意向产品" width="110">
                    <template slot-scope="scope">
                        <el-cascader
                            placeholder="点击选择"
                            v-model="scope.row.intentProduct"
                            :options="options"
                            :show-all-levels="false"
                            @change="handleChange(scope.row)"
                            :props="{ label: 'label', value: 'label' }"
                        ></el-cascader>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="预估金额（万）" width="120">
                    <template slot-scope="scope">
                        <el-input
                            v-model="scope.row.gusAmount"
                            placeholder="点击输入"
                            :maxlength="50"
                            @input="gusAmountBlur(scope.row, 0)"
                        />
                    </template>
                </el-table-column>
                <el-table-column align="center" label="概率（%）"  width="100">
                    <template slot-scope="scope">
                        <el-input
                            type="number"
                            :maxlength="50"
                            v-model="scope.row.probability"
                            placeholder="点击输入"
                            @input="probabilityFn(scope.row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column v-for="o in num" :key="o" align="center" :label="o + ''">
                    <template slot-scope="scope">
                        <template v-if="scope.row.arr[o - 1].id">
                            <el-tooltip placement="top" effect="light">
                                <div slot="content">
                                    <p class="fs14">阶段：{{ scope.row.arr[o - 1].param }}</p>
                                    <p class="fs14" v-if=" scope.row.arr[o - 1].param == '签约' || scope.row.arr[o - 1].param == '回款'"
                                    >金额：{{ scope.row.arr[o - 1].amount }}万</p>
                                    <p class="fs14">备注：{{ scope.row.arr[o - 1].remark }}</p>
                                </div>
                                <span
                                    class="cp fs14"
                                    @click="braceTap(scope.row.arr[o - 1], o)"
                                >{{ scope.row.arr[o - 1].param }}</span>
                            </el-tooltip>
                        </template>
                        <template v-else>
                            <span class="draw-tit cp fs14" @click="braceTap(scope.row.arr[o - 1], o, scope.row)">点击选择</span>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-box dfrcb">
                <span class="fs13">
                    显示{{ (data.pageNo - 1) * data.pageSize + 1 }}到{{
                    total > data.pageNo * data.pageSize
                    ? data.pageNo * data.pageSize
                    : total
                    }}，共{{ total }}条记录
                </span>
                <el-pagination
                    @current-change="pageNoChange"
                    :current-page="data.pageNo"
                    :page-size="data.pageSize"
                    layout="prev,pager,next,jumper"
                    :total="total"
                ></el-pagination>
            </div>
        </div>
        <v-drawer :title="'新建支撑'" :drawerW="'885px'" :drawer="drawer" @submitFn="submitFn">
            <v-newBrace @returnAdd="addFn" :supType="1" :isload="drawer"></v-newBrace>
        </v-drawer>
        <el-dialog width="370px" :visible="isDialog"  :show-close="false" :append-to-body="true">
            <!-- 头部 -->
            <div class="dia-tit dfrcb" slot="title">
                <span class="color-fff">任务阶段</span>
                <i class="color-fff el-icon-close cp" @click="isDialog = false"></i>
            </div>
            <!-- 内容 -->
            <div class="main">
                <el-form v-model="fromData" label-width="60px" size="medium">
                    <el-form-item label="漏斗">
                        <el-select
                            v-model="fromData.param"
                            placeholder="请选择漏斗"
                            size="small"
                            style="width:100%"
                            @change="paramChange"
                        >
                            <el-option
                                v-for="item in funnelList"
                                :key="item.label"
                                :label="item.label"
                                :value="item.label"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item
                        label="金额(万)"
                        prop="amount"
                        v-if="fromData.param == '签约' || fromData.param == '回款'"
                    >
                        <el-input
                            placeholder="请输入金额(万)"
                            v-model="fromData.amount"
                            :maxlength="50"
                            @input="gusAmountBlur(fromData, 1)"
                        ></el-input>
                    </el-form-item>
                    <el-form-item
                        label="备注"
                        prop="remark"
                        class="text-line"
                        style="margin-bottom:12px"
                    >
                        <el-input
                            placeholder="请输入备注"
                            type="textarea"
                            resize="none"
                            v-model="fromData.remark"
                            maxlength="50"
                        ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 操作 -->
            <div slot="footer" class="btn-box text-r">
                <button class="cancel-btn text-c fs14 cp" @click="isDialog = false">取消</button>
                <button class="sure-btn text-c fs14 cp" @click="sumbitFn">保存</button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import newBrace from "@/components/newBrace";
export default {
    name: "braceSell", // 结构名称
    data() {
        return {
            // 数据模型a
            num: 31,
            isajax: true,
            userId: "", //当前用户id
            total: 0,
            data: {
                searchCompName: null,
                pageNo: 1,
                pageSize: 30,
                planId: null,
                supType: 1
            },
            options: [
                {
                    label: "项目周期项目产品",
                    children: [
                        {
                            label: "清单计量"
                        },
                        {
                            label: "养护计量"
                        }
                    ]
                },
                {
                    label: "智慧工地"
                }
            ],
            tableData: [],
            drawer: false,
            summary: {},
            addList: [],
            isDialog: false,
            funnelList: [
                {
                    label: "早期联系",
                    value: 1
                },
                {
                    label: "深度意向",
                    value: 2
                },
                {
                    label: "上会/培训",
                    value: 3
                },
                {
                    label: "签约",
                    value: 4
                },
                {
                    label: "回款",
                    value: 5
                },
                {
                    label: "复购",
                    value: 6
                },
                {
                    label: "无",
                }
            ],
            fromData: {},
            isSave:true,
            isSave1:true
        };
    },
    watch: {
        // 监控集合
        tableData: {
            deep: true,
            handler(val, old) {
                this.$emit("returnList", { list: val });
            }
        }
    },
    components: {
        "v-newBrace": newBrace
    },
    props: {
        // 集成父级参数
    },
    beforeCreate() {
        // console.group('创建前状态  ===============》beforeCreate');
    },
    created() {
        // console.group('创建完毕状态===============》created');
        if (sessionStorage.getItem("userid")) {
            this.userId = sessionStorage.getItem("userid");
        } else {
            this.userId = "3A27BD25-8567-479D-9D96-1BA7BBEC5F0E"; //当前用户id
        }
        if (this.$route.query.type == 0) {
            this.num = 12;
        } else if (this.$route.query.type == 1) {
            this.num = 31;
        } else if (this.$route.query.type == 2) {
            this.num = 7;
        }
        this.data.planId = this.$route.query.id;
        this.ajax();
        // this.getCount();
        this.count();
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
        count() {
            let d = {
                planId: this.data.planId,
                responsibleId: this.userId,
                supType: 1
            };
            this.$http({
                method: "get",
                url: "/sv/plan/support/summary",
                params: d
            }).then(res => {
                if (res.succ) {
                    this.summary = res.data;
                }
            });
        },
        addFn(p) {
            this.addList = JSON.parse(JSON.stringify(p.addlist));
        },
        indexFn(index) {
            let n = (this.data.pageNo - 1) * this.data.pageSize + (index + 1);
            return n;
        },
        keywordFn() {
            this.data.pageNo = 1;
            // this.total = 0;
            this.ajax();
            this.count();
        },
        creatFn() {
            //新建
            this.drawer = true;
        },
        deleteFn() {
            this.$confirm("您确定删除该项吗？", "提示", {
                confirmButtonText: "删除",
                showClose: false,
                distinguishCancelAndClose: true,
                confirmButtonClass: "red-btn",
                cancelButtonClass: "cancel-btn"
            }).then(() => {
                this.$http({
                    method: "get",
                    params: {
                        planId: this.$route.query.id,
                        supId: this.fromObj.supId,
                        userId: this.userId
                    },
                    url: "/sv/plan/support/task/delete"
                }).then(res => {
                    if (res.succ) {
                        this.$message({
                            title: "成功",
                            message: res.data,
                            type: "success"
                        });
                        this.ajax();
                        this.count();
                    }
                });
            });
        },
        tableSelectFn(currentRow, oldCurrentRow) {
            //表格选中时
            if (currentRow) {
                let obj = JSON.parse(JSON.stringify(currentRow));
                this.fromObj = obj;
            }
        },
        submitFn() {
            if(!this.isSave1){
                return false
            }
            this.isSave1=false
            let d = JSON.parse(JSON.stringify(this.addList));
            this.$http({
                method: "post",
                url: "/sv/plan/support/task/add",
                data: d
            }).then(res => {
                if (res.succ) {
                    this.drawer = false;
                    this.$children[2].$children[0].closeDrawer()
                    this.$message({
                        title: "成功",
                        message: res.data,
                        type: "success"
                    });
                    this.isSave1=true;
                    // this.addList=[];
                    this.ajax();
                    this.count();
                }else{
                    this.isSave1=true;
                }
            });
        },
        ajax() {
            this.isajax = true;
            this.tableData.splice(0);
            let that = this;
            let d = this.data;
            this.$http({
                method: "get",
                params: d,
                url: "/sv/plan/support/task/list"
            }).then(res => {
                this.isajax = false;
                if (res.succ) {
                    for (let o of res.data.data) {
                        o.arr = [];
                        for (let x = 0; x < this.num; x++) {
                            let d = {};
                            for (let y of o.exps) {
                                if (y.seq == x + 1) {
                                    d = Object.assign(d, y);
                                }
                            }
                            o.arr.push(d);
                        }
                    }
                    this.tableData = res.data.data;
                    this.total = res.data.total;
                    this.$refs.list.setCurrentRow(this.tableData[0]);
                }
            });
        },
        getCount() {
            // let that = this;
            // let d=this.data
            // this.$http({
            //     method:'post',
            //     url:'/so/contract/count',
            //     data:d,
            // }).then(res=>{
            //     this.count=res.data
            // })
        },
        pageNoChange(val) {
            this.data.pageNo = val;
            this.ajax();
            this.count();
        },
        returnRegion(row) {
            //地区过滤器
            let str = "";
            if (row.province) {
                str += row.province;
            }
            if (row.city) {
                str += "/" + row.city;
            }
            if (row.area) {
                str += "/" + row.area;
            }
            return str;
        },
        braceTap(row, i, rows) {
            if (row.id) {
                this.fromData = JSON.parse(JSON.stringify(row));
            } else {
                this.fromData = new Object();
                this.fromData.seq = i;
                this.fromData.supId = rows.supId;
                // this.fromData.param='早期联系'
            }
            this.isDialog = true;
        },
        sumbitFn() {
            
            if(!this.fromData.param){
                this.$message({
                    title: "消息",
                    message:'必须填写漏斗阶段',
                    type: "warning"
                });
                return false
            }
            if(this.fromData.param=='签约'||this.fromData.param=='回款'){
                if(!this.fromData.amount){
                    this.$message({
                        title: "消息",
                        message:'输入金额为必填',
                        type: "warning"
                    });
                    return false
                }
                if(this.fromData.amount==0){
                    this.$message({
                        title: "消息",
                        message:'输入金额必须大于0',
                        type: "warning"
                    });
                    return false
                }
            }
            let d = JSON.parse(JSON.stringify(this.fromData));
            if (d.amount) {
                d.amount = d.amount * 1;
            } else {
                d.amount = 0;
            }
            if(!this.isSave){
                return false
            }
            this.isSave=false
            this.$http({
                method: "post",
                url: "/sv/plan/support/task/expUpdate",
                data: d
            }).then(res => {
                if (res.data) {
                    this.isDialog = false;
                    this.$message({
                        title: "成功",
                        message: "保存成功",
                        type: "success"
                    });
                    this.isSave=true;
                    this.ajax();
                    this.count();
                } else {
                    this.isSave=true;
                    this.$message.error({
                        message: "保存失败"
                    });
                }
            });
        },
        handleChange(row) {
            row.intentProduct = row.intentProduct[row.intentProduct.length - 1];
        },
        gusAmountBlur(obj, type) {
            let t = /^\d{1,5}\.\d{1,2}$|^\d{1,5}$/,
                val;
            if (type == 0) {
                val = obj.gusAmount;
            } else if (type == 1) {
                val = obj.amount;
            }
            if (val == "") {
                return;
            }
            if (!t.test(val)) {
                this.$message({
                    type: "warning",
                    message: "请输入数字，且最多5位"
                });
                if (type == 0) {
                    obj.gusAmount = "";
                } else if (type == 1) {
                    obj.amount = "";
                }
            }
        },
        probabilityFn(row) {
            if (row.probability < 0) {
                row.probability = 0;
            }
            if (row.probability > 100) {
                row.probability = 100;
            }
        },
        paramChange(val){
            if(val=='签约'||val=='回款'){
                // this.$set(this.fromData,'amount',0)
            }
        }
    }
};
</script>
<!-- 增加 "scoped" 属性 限制 CSS 属于当前部分 -->
<style lang="less" scoped>
.braceSell {
    .top-box {
        margin-bottom: 15px;
        .comname-ipt {
            width: 165px;
            margin-right: 15px;
            border-radius: 4px;
            border: 1px solid #dcdfe6;
            padding: 0 15px;
            box-sizing: border-box;
            input {
                border: none;
                outline: none;
                height: 30px;
                line-height: 30px;
                width: calc(100% - 16px);
            }
        }
        .operate {
            i {
                margin-right: 5px;
            }
        }
    }
}
.el-table /deep/ .el-input__inner {
    border: none;
    background: transparent;
    padding: 0;
    text-align: center;
}
.el-table /deep/ .el-input__suffix {
    right: -8px;
}
.el-table /deep/ .el-input__inner::-webkit-input-placeholder {
    color: #2796ff;
}
.el-table /deep/ .el-input__inner::-moz-input-placeholder {
    color: #2796ff;
}
.el-table /deep/ .el-input__inner::-ms-input-placeholder {
    color: #2796ff;
}
/**dialog样式 */
.el-dialog__wrapper /deep/ .el-form .el-input {
    width: 100%;
}
.el-dialog__wrapper /deep/ .el-dialog__header {
    background: #1989fa;
    padding: 0 20px;
    line-height: 44px;
}
.el-dialog__wrapper /deep/ .el-dialog__body {
    padding: 15px 20px 0;
}
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
        margin-right: 15px;
    }
    .sure-btn {
        background: #1989fa;
        color: #fff;
    }
}
</style>

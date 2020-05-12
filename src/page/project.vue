<!-- 模型： DOM 结构 -->
<template>
    <div class="project">
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
        </div>
        <div class="table-box">
            <el-table cell-class-name="fs13 table-h" header-cell-class-name="table-header table-h" border :data="tableData" style="width:100%">
                <el-table-column align="center" class-name="serial-num" width="50px" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="项目名称" prop=""></el-table-column>
                <el-table-column align="center" label="业主名称" prop=""></el-table-column>
                <el-table-column align="center" label="省份" prop=""></el-table-column>
                <el-table-column align="center" label="服务人员" prop=""></el-table-column>
                <el-table-column align="center" label="授权用户" prop=""></el-table-column>
                <el-table-column align="center" label="是否关闭" prop=""></el-table-column>
                <el-table-column align="center" label="创建时间" prop=""></el-table-column>
            </el-table>
        </div>
        <div class="page-box dfcc">
            <el-pagination
                @size-change="pageSizeChange"
                @current-change="pageNoChange"
                :current-page="data.pageNo"
                :page-sizes="[30,50,100]"
                :page-size="30"
                layout="prev,pager,next,jumper,sizes"
                :total="total">
            </el-pagination>
        </div>
        <v-drawer :title="title" :drawer="drawer" :drawerW="'803px'" :type="1">
            <el-form :model="fromData" label-width="130px" size="medium">
                <h4 class="bor-b tit-txt fs16">基本信息</h4>
                <div class="dfrb">
                    <el-form-item label="编号" prop="projNo" :rules="{required:true,message:'编号不得为空'}">
                        <el-input v-model="fromData.projNo"></el-input>
                    </el-form-item>
                    <el-form-item label="项目名称" prop="projName" :rules="{required:true,message:'项目名称不得为空'}">
                        <el-input v-model="fromData.projName"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="项目状态" prop="projState" :rules="{required:true,message:'项目状态不得为空'}">
                        <el-select v-model="fromData.projState" placeholder="请选择" style="width:202px">
                            <el-option
                            v-for="item in stateList"
                            :key="item"
                            :label="item"
                            :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="拨款单位" prop="projFundcom" :rules="{required:true,message:'拨款单位不得为空'}">
                        <el-input v-model="fromData.projFundcom"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="技术等级" prop="projTechlevel">
                        <el-input v-model="fromData.projTechlevel"></el-input>
                    </el-form-item>
                    <el-form-item label="所属地区" prop="projRegion">
                        <v-region style="width:202px"></v-region>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="计划工期（月）" prop="projDuration">
                        <el-input v-model="fromData.projDuration"></el-input>
                    </el-form-item>
                    <el-form-item label="工期起止时间" prop="name" :rules="{required:true,message:'工期起止时间不得为空'}">
                        <el-date-picker
                            v-model="fromData.name"
                            type="daterange"
                            range-separator="至"
                            style="width:280px"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="总投资（万）" prop="projBudget">
                        <el-input v-model="fromData.projBudget"></el-input>
                    </el-form-item>
                    <el-form-item label="里程" prop="projDistance">
                        <el-input v-model="fromData.projDistance"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="起始桩号" prop="projStartstake">
                        <el-input v-model="fromData.projStartstake"></el-input>
                    </el-form-item>
                    <el-form-item label="终点桩号" prop="projEndstake">
                        <el-input v-model="fromData.projEndstake"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="计划类型" prop="projPlantype">
                        <el-select v-model="fromData.projPlantype" placeholder="请选择" style="width:202px" @change="planChange">
                            <el-option
                            v-for="item in planList"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="计划子类" prop="projPlanchildtype">
                        <el-select v-model="fromData.projPlanchildtype" placeholder="请选择" style="width:202px">
                            <el-option
                            v-for="item in planList1"
                            :key="item.id"
                            :label="item.value"
                            :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="监管层级" prop="projPlanInner">
                        <el-select v-model="fromData.projPlanInner" placeholder="请选择" style="width:202px">
                            <el-option
                            v-for="item in projectList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="项目类型" prop="projType" :rules="{required:true,message:'项目类型不得为空'}">
                        <el-select v-model="fromData.projType" placeholder="请选择" style="width:202px">
                            <el-option
                            v-for="item in typeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item label="建安费" prop="projConstruction">
                    <el-input v-model="fromData.projConstruction" style="width:202px"></el-input>
                </el-form-item>
                <el-form-item label="项目概况" prop="projMemo">
                    <el-input type="textarea" resize="none" v-model="fromData.projMemo"></el-input>
                </el-form-item>
                <!-- 分割线 -->
                <h4 class="bor-b tit-txt fs16">人事信息</h4>
                <div class="dfrb">
                    <el-form-item label="责任领导" prop="name">
                        <el-input v-model="fromData.responsibilityLeader"></el-input>
                    </el-form-item>
                    <el-form-item label="项目经理手机号码" prop="fzr">
                        <el-input v-model="fromData.projectManagerTel"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="项目经理" prop="projectManager">
                    <el-input v-model="fromData.projectManager"  style="width:202px"></el-input>
                </el-form-item>
                <!-- 分割线 -->
                <h4 class="bor-b tit-txt fs16">参建单位</h4>
                <div class="dfrb">
                    <el-form-item label="设计单位" prop="designUnit">
                        <el-input v-model="fromData.designUnit"></el-input>
                    </el-form-item>
                    <el-form-item label="施工单位" prop="projBuildcoms">
                        <el-input v-model="fromData.projBuildcoms"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="勘测单位" prop="surveyUnit">
                        <el-input v-model="fromData.surveyUnit"></el-input>
                    </el-form-item>
                    <el-form-item label="监理单位" prop="constructionControlUnit">
                        <el-input v-model="fromData.constructionControlUnit"></el-input>
                    </el-form-item>
                </div>
                <!-- 分割线 -->
                <h4 class="bor-b tit-txt fs16">招标单位</h4>
                <div class="dfrb">
                    <el-form-item label="招标单位" prop="bidUnit">
                        <el-input v-model="fromData.bidUnit"></el-input>
                    </el-form-item>
                    <el-form-item label="招标日期" prop="bidDate">
                        <el-date-picker
                            v-model="fromData.bidDate"
                            type="date"
                            style="width:202px"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="招标人" prop="tenderee">
                        <el-input v-model="fromData.tenderee"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="tendereePhone">
                        <el-input v-model="fromData.tendereePhone"></el-input>
                    </el-form-item>
                </div>
                <!-- 分割线 -->
                <h4 class="bor-b tit-txt fs16">竞争单位</h4>
                <div class="dfrb">
                    <el-form-item label="竞争单位" prop="competitiveUnit">
                        <el-input v-model="fromData.competitiveUnit"></el-input>
                    </el-form-item>
                    <el-form-item label="联系人" prop="competitiveUnitLinker">
                        <el-input v-model="fromData.competitiveUnitLinker"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="电话号码" prop="competitiveUnitPhone">
                        <el-input v-model="fromData.competitiveUnitPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="品牌名称" prop="competitiveUnitBrand">
                        <el-input v-model="fromData.competitiveUnitBrand"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="优缺点" prop="competitiveUnitInfo">
                    <el-input type="textarea" resize="none" v-model="fromData.competitiveUnitInfo"></el-input>
                </el-form-item>
                <!-- 分割线 -->
                <h4 class="bor-b tit-txt fs16">项目关系人</h4>
                <div class="dfrb">
                    <el-form-item label="项目关系人" prop="projRelateder">
                        <el-input v-model="fromData.projRelateder"></el-input>
                    </el-form-item>
                    <el-form-item label="项目关系人电话号码" prop="projRelatederPhone">
                        <el-input v-model="fromData.projRelatederPhone"></el-input>
                    </el-form-item>
                </div>
                <!-- 分割线 -->
                <h4 class="bor-b tit-txt fs16">内线人</h4>
                <div class="dfrb">
                    <el-form-item label="内线人" prop="projInsider">
                        <el-input v-model="fromData.projInsider"></el-input>
                    </el-form-item>
                    <el-form-item label="内线人电话号码" prop="projInsiderPhone">
                        <el-input v-model="fromData.projInsiderPhone"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="内线人职务" prop="projInsiderDuty">
                        <el-input v-model="fromData.projInsiderDuty"></el-input>
                    </el-form-item>
                    <el-form-item label="内线人性格" prop="projInsiderCharacter">
                        <el-input v-model="fromData.projInsiderCharacter"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="内线人年龄" prop="projInsiderAge">
                        <el-input v-model="fromData.projInsiderAge"></el-input>
                    </el-form-item>
                    <el-form-item label="内线人性别" prop="projInsiderSex">
                        <el-input v-model="fromData.projInsiderSex"></el-input>
                    </el-form-item>
                </div>
                <el-form-item label="其他信息" prop="remark">
                    <el-input type="textarea" resize="none" v-model="fromData.remark"></el-input>
                </el-form-item>
                <!-- 分割线 -->
                <h4 class="bor-b tit-txt fs16">决策人</h4>
                <div class="dfrb">
                    <el-form-item label="决策人" prop="projDecider">
                        <el-input v-model="fromData.projDecider"></el-input>
                    </el-form-item>
                    <el-form-item label="决策人电话号码" prop="projDeciderPhone">
                        <el-input v-model="fromData.projDeciderPhone"></el-input>
                    </el-form-item>
                </div>
                <div class="dfrb">
                    <el-form-item label="决策人职务" prop="projDeciderDuty">
                        <el-input v-model="fromData.projDeciderDuty"></el-input>
                    </el-form-item>
                    <el-form-item label="决策人性格" prop="projDeciderCharacter">
                        <el-input v-model="fromData.projDeciderCharacter"></el-input>
                    </el-form-item>
                </div>
                <!-- 分割线 -->
                <h4 class="bor-b tit-txt fs16">相关新闻</h4>
                <el-form-item label="相关新闻" prop="relatedNews">
                    <el-input type="textarea" resize="none" v-model="fromData.relatedNews"></el-input>
                </el-form-item>
            </el-form>
        </v-drawer>
    </div>
</template>
<script>
import region from '@/components/region'
export default {
    name: 'project', // 结构名称
    data() {
        return {
            // 数据模型a
            data:{
                comId:'',
                comName:'',
                pageNo:1,
                pageSize:30
            },
            total:0,
            drawer:"",
            tableData:[],
            drawer:false,
            title:"",
            fromData:{},
            projectList:[//监管层级
                {
                    label:'省监管计划内项目',
                    value:'1'
                },{
                    label:'计划外项目',
                    value:'0'
                },
            ],
            planList:[//计划类型
                {
                    "value":"建设",
                    "id":"js",
                    "data":[
                        {
                            "value":"通村沥青（水泥）路",
                            "id":"lqsnl"
                        },
                        {
                            "value":"撤并建制村通硬化路",
                            "id":"yhl"
                        },
                        {
                            "value":"县乡道改造",
                            "id":"xxdgz"
                        },
                        {
                            "value":"窄路面公路拓宽改造",
                            "id":"tkgz"
                        }
                    ]
                },{
                    "value":"养护",
                    "id":"yh",
                    "data":[
                    {
                        "value":"农村公路安保工程",
                        "id":"abgc"
                    },{
                        "value":"农村公路危桥改造",
                        "id":"wqgz"
                    },{
                        "value":"农村公路养路大中修改造",
                        "id":"dzxgz"
                    }
                    ]
                }
            ],
            planList1:[],//计划子类
            typeList:[//项目类型
                {
                    label:'高速公路',
                    value:'gsgl'
                },{
                    label:'国省干道',
                    value:'gsgd'
                },{
                    label:'农村路项目',
                    value:'ncl'
                },{
                    label:'市政项目',
                    value:'szxm'
                },{
                    label:'地铁项目',
                    value:'dtxm'
                },{
                    label:'房建项目',
                    value:'fjxm'
                },{
                    label:'水利项目',
                    value:'slxm'
                },{
                    label:'其他',
                    value:'qt'
                }
            ],
            stateList:['已成交','A','B','C','其他'],//项目状态
        }
    },
    watch: {
        // 监控集合
    },
    components:{
        'v-region':region
    },
    props: {
        // 集成父级参数
        comid:{
            default:''
        },
        comName:{
            default:""
        }
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
            this.title='新建项目'
        },
        editFn(){
            this.drawer=true;
            this.title='编辑项目'
        },
        planChange(){//计划类型联动
            // this.planList1=[];
            this.fromData.projPlanchildtype='';
            for(let x of this.planList){
                if(x.id==this.fromData.projPlantype){
                    this.planList1=x.data
                }
            }
        },
        pageNoChange(val){
            this.data.pageNo=val
            // this.ajax()
        },
        pageSizeChange(val){
            this.data.pageSize=val
            // this.ajax()
        },
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
.page-box{
    height: 44px;
    .el-pagination /deep/ .el-pagination__sizes{
        margin: 0 15px;
    }
}
</style>

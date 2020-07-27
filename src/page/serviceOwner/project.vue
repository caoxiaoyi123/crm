<!-- 模型： DOM 结构 -->
<template>
  <div class="project">
    <div class="head-box drc">
      <span class="drc cp mr20 hover-color" @click="creatFn" v-if="isshow">
        <i class="icon iconfont iconxinjian"></i>
        <font class="fs13">新建</font>
      </span>
      <span
        class="drc cp mr20 hover-color"
        @click="editFn"
        v-if="tableData && tableData.length > 0"
      >
        <i class="icon iconfont iconbianji"></i>
        <font class="fs13">编辑</font>
      </span>
      <span
        class="drc cp mr20 hover-color"
        @click="exportFn"
        v-if="tableData && tableData.length > 0"
      >
        <i class="icon iconfont icondaochu"></i>
        <font class="fs13">导出excel</font>
      </span>
    </div>
    <div class="table-box">
      <el-table
        cell-class-name="fs13 table-h"
        ref="ownList"
        highlight-current-row
        @current-change="tableSelectFn"
        header-cell-class-name="table-header table-h"
        border
        height="calc(65vh - 199px)"
        :data="tableData"
        style="width:100%"
      >
        <el-table-column
          align="center"
          class-name="serial-num"
          width="60"
          label="序号"
          type="index"
        ></el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          label="项目名称"
          prop="projName"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.projName" placement="right">
              <span class="clamp-2">
                {{ scope.row.projName }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          header-align="center"
          align="left"
          label="业主名称"
          prop="comName"
        >
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.comName" placement="right">
              <span class="clamp-2">
                {{ scope.row.comName }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="省份"
          prop="province"
        ></el-table-column>
        <el-table-column
          align="center"
          label="服务人员"
          prop="serviceUser"
        ></el-table-column>
        <el-table-column align="center" label="授权用户">
          <template slot-scope="scope">
            <span class="cp draw-tit" @click="getEmpower(scope.row)">授权</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否关闭" prop="isOpen">
          <template slot-scope="scope">
            <span class="cp red-font" @click="isOpenFn(scope.row)">{{
              scope.row.isOpen ? "否" : "是"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="创建时间"
          prop="projCreatime"
        ></el-table-column>
      </el-table>
    </div>
    <v-drawer
      :title="title"
      :drawer="drawer"
      :drawerW="'803px'"
      @submitFn="submitFn"
    >
      <el-form
        ref="fromData"
        :model="fromData"
        label-width="86px"
        size="medium"
      >
        <h4 class="bor-b tit-txt fs16">基本信息</h4>
        <div class="dfrb">
          <el-form-item
            label="编号"
            prop="projNo"
            :rules="{ required: true, message: '编号不得为空' }"
          >
            <el-input
              placeholder="请输入编号"
              v-model="fromData.projNo"
              :maxlength="25"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="项目名称"
            prop="projName"
            :maxlength="50"
            :rules="{ required: true, message: '项目名称不得为空' }"
          >
            <el-input
              placeholder="请输入项目名称"
              v-model="fromData.projName"
              :maxlength="50"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="项目状态"
            prop="projState"
            :rules="{ required: true, message: '项目状态不得为空' }"
          >
            <el-select
              v-model="fromData.projState"
              placeholder="请选择项目状态"
              style="width:202px"
            >
              <el-option
                v-for="item in stateList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="拨款单位"
            prop="projFundcom"
            :rules="{ required: true, message: '拨款单位不得为空' }"
          >
            <el-input
              placeholder="请输入拨款单位"
              v-model="fromData.projFundcom"
              :maxlength="50"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="技术等级" prop="projTechlevel">
            <el-input
              placeholder="请输入技术等级"
              v-model="fromData.projTechlevel"
              :maxlength="25"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="130px" label="所属地区" prop="projRegion">
            <v-region
              style="width:202px"
              :region="fromData.projRegion"
              @regionChange="regionWacth"
            ></v-region>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="计划工期(月)"
            prop="projDuration"
            :rules="{
              pattern: /^(([1-9]\d*)|0)(\.\d+)?$/,
              message: '计划工期必须为正数',
              trigger: ['blur', 'change']
            }"
          >
            <el-input
              placeholder="请输入计划工期"
              v-model="fromData.projDuration"
              :maxlength="8"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="工期起止时间"
            prop="timer"
            :rules="{ required: true, message: '工期起止时间不得为空' }"
          >
            <el-date-picker
              placeholder="请输入工期起止时间"
              @change="timeClick"
              v-model="fromData.timer"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              :editable="false"
              style="width:280px"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item
            label="总投资(万)"
            prop="projBudget"
            :rules="{
              pattern: /^(([1-9]\d*)|0)(\.\d+)?$/,
              message: '总投资必须为正数',
              trigger: ['blur', 'change']
            }"
          >
            <el-input
              placeholder="请输入总投资"
              v-model="fromData.projBudget"
              :maxlength="25"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="里程（km）"
            prop="projDistance"
            :rules="{
              pattern: /^(([1-9]\d*)|0)(\.\d+)?$/,
              message: '里程必须为正数',
              trigger: ['blur', 'change']
            }"
          >
            <el-input
              placeholder="请输入里程"
              v-model="fromData.projDistance"
              :maxlength="8"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="起始桩号" prop="projStartstake">
            <el-input
              placeholder="请输入起始桩号"
              v-model="fromData.projStartstake"
              :maxlength="25"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="终点桩号"
            prop="projEndstake"
          >
            <el-input
              placeholder="请输入终点桩号"
              v-model="fromData.projEndstake"
              :maxlength="25"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="计划类型" prop="projPlantype">
            <el-select
              v-model="fromData.projPlantype"
              placeholder="请选择计划类型"
              style="width:202px"
              @change="planChange"
            >
              <el-option
                v-for="item in planList"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="计划子类"
            prop="projPlanchildtype"
          >
            <el-select
              v-model="fromData.projPlanchildtype"
              placeholder="请选择计划子类"
              style="width:202px"
              @change="$forceUpdate()"
            >
              <el-option
                v-for="item in planList1"
                :key="item.id"
                :label="item.value"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="监管层级" prop="projPlanInner">
            <el-select
              v-model="fromData.projPlanInner"
              placeholder="请选择监管层级"
              style="width:202px"
            >
              <el-option
                v-for="item in projectList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="项目类型"
            prop="projType"
            :rules="{ required: true, message: '项目类型不得为空' }"
          >
            <el-select
              v-model="fromData.projType"
              placeholder="请选择项目类型"
              style="width:202px"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item
          label="建安费"
          prop="projConstruction"
        >
          <el-input
            placeholder="请输入建安费"
            v-model="fromData.projConstruction"
            style="width:202px"
            :maxlength="25"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目概况" prop="projMemo" class="text-line">
          <el-input
            placeholder="请输入项目概况"
            type="textarea"
            resize="none"
            maxlength="50"
            v-model="fromData.projMemo"
          ></el-input>
        </el-form-item>
        <!-- 分割线 -->
        <h4 class="bor-b tit-txt fs16">人事信息</h4>
        <div class="dfrb">
          <el-form-item label="责任领导" prop="responsibilityLeader">
            <el-input
              placeholder="请输入责任领导"
              v-model="fromData.responsibilityLeader"
              :maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="项目经理手机号码"
            prop="projectManagerTel"
            :rules="{
              pattern: /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147,145))\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: ['blur', 'change']
            }"
          >
            <el-input
              placeholder="请输入项目经理手机号码"
              v-model="fromData.projectManagerTel"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="项目经理" prop="projectManager">
          <el-input
            placeholder="请输入项目经理"
            v-model="fromData.projectManager"
            style="width:202px"
            :maxlength="15"
          ></el-input>
        </el-form-item>
        <!-- 分割线 -->
        <h4 class="bor-b tit-txt fs16">参建单位</h4>
        <div class="dfrb">
          <el-form-item label="设计单位" prop="designUnit">
            <el-input
              placeholder="请输入设计单位"
              v-model="fromData.designUnit"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="施工单位"
            prop="projBuildcoms"
          >
            <el-input
              placeholder="请输入施工单位"
              v-model="fromData.projBuildcoms"
              :maxlength="50"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="勘测单位" prop="surveyUnit">
            <el-input
              placeholder="请输入勘测单位"
              v-model="fromData.surveyUnit"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="监理单位"
            prop="constructionControlUnit"
          >
            <el-input
              placeholder="请输入监理单位"
              v-model="fromData.constructionControlUnit"
              :maxlength="50"
            ></el-input>
          </el-form-item>
        </div>
        <!-- 分割线 -->
        <h4 class="bor-b tit-txt fs16">招标单位</h4>
        <div class="dfrb">
          <el-form-item label="招标单位" prop="bidUnit">
            <el-input
              placeholder="请输入招标单位"
              v-model="fromData.bidUnit"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="130px" label="招标日期" prop="bidDate">
            <el-date-picker
              v-model="fromData.bidDate"
              type="date"
              :editable="false"
              style="width:202px"
              placeholder="请选择招标日期"
            ></el-date-picker>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="招标人" prop="tenderee">
            <el-input
              placeholder="请输入招标人"
              v-model="fromData.tenderee"
              :maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="手机号码"
            prop="tendereePhone"
            :rules="{
              pattern: /^((13[0-9])|(15[^4])|(166)|(17[0-8])|(18[0-9])|(19[8-9])|(147,145))\d{8}$/,
              message: '请输入正确的手机号码',
              trigger: ['blur', 'change']
            }"
          >
            <el-input
              placeholder="请输入手机号码"
              v-model="fromData.tendereePhone"
            ></el-input>
          </el-form-item>
        </div>
        <!-- 分割线 -->
        <h4 class="bor-b tit-txt fs16">中标单位</h4>
        <div class="dfrb">
          <el-form-item label="中标单位" prop="bidWinner">
            <el-input
              placeholder="请输入中标单位"
              v-model="fromData.bidWinner"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="招标代理机构"
            prop="bidAgency"
          >
            <el-input
              placeholder="请输入招标代理机构"
              v-model="fromData.bidAgency"
              :maxlength="50"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="代理人" prop="agent">
            <el-input
              placeholder="请输入代理人"
              v-model="fromData.agent"
              :maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="代理人电话"
            prop="agentPhone"
          >
            <el-input
              placeholder="请输入代理人电话"
              v-model="fromData.agentPhone"
              :maxlength="11"
            ></el-input>
          </el-form-item>
        </div>
        <!-- 分割线 -->
        <h4 class="bor-b tit-txt fs16">竞争单位</h4>
        <div class="dfrb">
          <el-form-item label="竞争单位" prop="competitiveUnit">
            <el-input
              placeholder="请输入竞争单位"
              v-model="fromData.competitiveUnit"
              :maxlength="50"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="联系人"
            prop="competitiveUnitLinker"
          >
            <el-input
              placeholder="请输入联系人"
              v-model="fromData.competitiveUnitLinker"
              :maxlength="15"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="电话号码" prop="competitiveUnitPhone">
            <el-input
              placeholder="请输入电话号码"
              v-model="fromData.competitiveUnitPhone"
              :maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="品牌名称"
            prop="competitiveUnitBrand"
          >
            <el-input
              placeholder="请输入品牌名称"
              v-model="fromData.competitiveUnitBrand"
              :maxlength="25"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item
          label="优缺点"
          prop="competitiveUnitInfo"
          class="text-line"
        >
          <el-input
            placeholder="请输入优缺点"
            type="textarea"
            resize="none"
            maxlength="500"
            v-model="fromData.competitiveUnitInfo"
          ></el-input>
        </el-form-item>
        <!-- 分割线 -->
        <h4 class="bor-b tit-txt fs16">项目关系人</h4>
        <div class="dfrb">
          <el-form-item label="项目关系人" prop="projRelateder">
            <el-input
              placeholder="请输入项目关系人"
              v-model="fromData.projRelateder"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="项目关系人电话号码"
            prop="projRelatederPhone"
          >
            <el-input
              placeholder="请输入项目关系人电话号码"
              v-model="fromData.projRelatederPhone"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </div>
        <!-- 分割线 -->
        <h4 class="bor-b tit-txt fs16">内线人</h4>
        <div class="dfrb">
          <el-form-item label="内线人" prop="projInsider">
            <el-input
              placeholder="请输入内线人"
              v-model="fromData.projInsider"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="内线人电话号码"
            prop="projInsiderPhone"
          >
            <el-input
              placeholder="请输入内线人电话号码"
              v-model="fromData.projInsiderPhone"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="内线人职务" prop="projInsiderDuty">
            <el-input
              placeholder="请输入内线人职务"
              v-model="fromData.projInsiderDuty"
              maxlength="25"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="内线人性格"
            prop="projInsiderCharacter"
          >
            <el-input
              placeholder="请输入内线人性格"
              v-model="fromData.projInsiderCharacter"
              maxlength="500"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="内线人年龄" prop="projInsiderAge">
            <el-input
              placeholder="请输入内线人年龄"
              v-model="fromData.projInsiderAge"
              maxlength="3"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="内线人性别"
            prop="projInsiderSex"
          >
            <el-input
              placeholder="请输入内线人性别"
              v-model="fromData.projInsiderSex"
              maxlength="3"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="其他信息" prop="projInsiderInfo" class="text-line">
          <el-input
            placeholder="请输入其他信息"
            type="textarea"
            maxlength="50"
            resize="none"
            v-model="fromData.projInsiderInfo"
          ></el-input>
        </el-form-item>
        <!-- 分割线 -->
        <h4 class="bor-b tit-txt fs16">决策人</h4>
        <div class="dfrb">
          <el-form-item label="决策人" prop="projDecider">
            <el-input
              placeholder="请输入决策人"
              v-model="fromData.projDecider"
              maxlength="15"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="决策人电话号码"
            prop="projDeciderPhone"
          >
            <el-input
              placeholder="请输入决策人电话号码"
              v-model="fromData.projDeciderPhone"
              maxlength="11"
            ></el-input>
          </el-form-item>
        </div>
        <div class="dfrb">
          <el-form-item label="决策人职务" prop="projDeciderDuty">
            <el-input
              placeholder="请输入决策人职务"
              v-model="fromData.projDeciderDuty"
              maxlength="25"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="130px"
            label="决策人性格"
            prop="projDeciderCharacter"
          >
            <el-input
              placeholder="请输入决策人性格"
              v-model="fromData.projDeciderCharacter"
              maxlength="500"
            ></el-input>
          </el-form-item>
        </div>
        <!-- 分割线 -->
        <h4 class="bor-b tit-txt fs16">相关新闻</h4>
        <el-form-item label="相关新闻" prop="relatedNews" class="text-line">
          <el-input
            placeholder="请输入相关新闻"
            type="textarea"
            resize="none"
            maxlength="50"
            v-model="fromData.relatedNews"
          ></el-input>
        </el-form-item>
      </el-form>
    </v-drawer>
    <el-dialog width="370px" :visible="isDialog" :show-close="false">
      <!-- 头部 -->
      <div class="dia-tit dfrcb" slot="title">
        <span class="color-fff">项目授权用户</span>
        <i
          class="color-fff el-icon-close cp"
          @click="
            isDialog = false;
            tableData1 = new Array();
          "
        ></i>
      </div>
      <!-- 内容 -->
      <div class="main">
        <el-table
          ref="userTable"
          :row-key="getRowKey"
          height="310px"
          cell-class-name="fs13 table-h"
          header-cell-class-name="table-header table-h"
          border
          @selection-change="selectChange"
          @selection-all="selectAll"
          @select="selectRow"
          :data="tableData1"
          style="width:100%"
        >
          <el-table-column
            align="center"
            width="60"
            label="序号"
            type="index"
          ></el-table-column>
          <el-table-column
            align="center"
            label="用户名"
            prop="userName"
          ></el-table-column>
          <el-table-column
            align="center"
            label="姓名"
            prop="userNickname"
          ></el-table-column>
          <el-table-column align="center" type="selection" :reserve-selection="true"></el-table-column>
        </el-table>
      </div>
      <!-- 操作 -->
      <div slot="footer" class="btn-box text-r">
        <button
          class="cancel-btn text-c fs14 cp"
          @click="
            isDialog = false;
            tableData1 = new Array();
          "
        >
          取消
        </button>
        <button class="sure-btn text-c fs14 cp" @click="sumbitFn">保存</button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import region from "@/components/region";
import {
  baseUrl //引入baseUrl
} from "../../../config/env";
export default {
  name: "project", // 结构名称
  data() {
    return {
      // 数据模型a
      data: {
        comId: "",
        comName: ""
      },
      projId: "",
      tableData: [],
      isshow: false,
      drawer: false,
      title: "",
      fromData: {
        projPlanchildtype: ""
      },
      fromObj: {},
      projectList: [
        //监管层级
        {
          label: "省监管计划内项目",
          value: "1"
        },
        {
          label: "计划外项目",
          value: "0"
        }
      ],
      planList: [
        //计划类型
        {
          value: "建设",
          id: "js",
          data: [
            {
              value: "通村沥青（水泥）路",
              id: "lqsnl"
            },
            {
              value: "撤并建制村通硬化路",
              id: "yhl"
            },
            {
              value: "县乡道改造",
              id: "xxdgz"
            },
            {
              value: "窄路面公路拓宽改造",
              id: "tkgz"
            }
          ]
        },
        {
          value: "养护",
          id: "yh",
          data: [
            {
              value: "农村公路安保工程",
              id: "abgc"
            },
            {
              value: "农村公路危桥改造",
              id: "wqgz"
            },
            {
              value: "农村公路养路大中修改造",
              id: "dzxgz"
            }
          ]
        }
      ],
      planList1: [], //计划子类
      typeList: [
        //项目类型
        {
          label: "高速公路",
          value: "gsgl"
        },
        {
          label: "国省干道",
          value: "gsgd"
        },
        {
          label: "农村路项目",
          value: "ncl"
        },
        {
          label: "市政项目",
          value: "szxm"
        },
        {
          label: "地铁项目",
          value: "dtxm"
        },
        {
          label: "房建项目",
          value: "fjxm"
        },
        {
          label: "水利项目",
          value: "slxm"
        },
        {
          label: "其他",
          value: "qt"
        }
      ],
      stateList: ["已成交", "A", "B", "C", "其他"], //项目状态
      tableData1: [], //某项目下授权用户的list
      isDialog: false
    };
  },
  watch: {
    // 监控集合
    comid: function(val, old) {
      if (val != "") {
        this.isshow = true;
        this.ajax();
      } else {
        this.isshow = false;
        this.tableData.splice(0);
      }
    },
    tableData(val) {
      //默认选中第一项
      this.$refs.ownList.setCurrentRow(this.tableData[0]);
    }
  },
  filters: {
    isOpen(val) {
      if (val) {
        return "否";
      } else {
        return "是";
      }
    }
  },
  components: {
    "v-region": region
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
      this.isshow = true;
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
    isOpenFn(row) {
      //是否关闭
      let str;
      if (row.isOpen) {
        str = "确定要关闭该项目所有用户关联?";
      } else {
        str = "确定要开启该项目所有用户关联?";
      }
      this.$confirm(str, "提示", {
        // confirmButtonText: "保存",
        showClose: false,
        distinguishCancelAndClose: true,
        confirmButtonClass: "white-font",
        cancelButtonClass: "cancel-btn"
      }).then(() => {
        this.$http({
          method: "post",
          url: "/so/project/operateAuth",
          data: {
            projId: row.projId,
            read: !row.isOpen
          }
        }).then(res => {
          if (res.succ) {
            this.$message({
              title: "成功",
              message: res.data,
              type: "success"
            });
            this.drawer = false;
            this.ajax();
          }
        });
      });
    },
    getRowKey(row) {
      return row.userId;
    },
    /*监听多选框*/
    selectChange(sele) {
      if (sele.length > 0) {
        for (let x of sele) {
          x.isReadx = 1;
        }
      } else {
        for (let x of this.tableData1) {
          x.isReadx = 0;
        }
      }
    },
    selectRow(sele, row) {
      if (row.isReadx == 1) {
        row.isReadx = 0;
      }
    },
    selectAll(sele) {
      console.log(sele);
    },
    /**监听多选框end */
    getEmpower(row) {
      //获取授权用户
      this.$http({
        method: "post",
        url: "/so/project/authUsers",
        data: {
          comId: row.comId,
          projId: row.projId
        }
      }).then(res => {
        this.tableData1 = JSON.parse(JSON.stringify(res.data));
        this.$nextTick(() => {
          let arr = [],
            arr1 = [];
          for (let x of this.tableData1) {
            if (x.isReadx == 1) {
              arr.push(x);
              // this.$refs.userTable.toggleRowSelection(x,true)
            } else {
              arr1.push(x);
            }
          }
          arr.forEach(row => {
            this.$refs.userTable.toggleRowSelection(row, true);
          });
          arr1.forEach(row => {
            this.$refs.userTable.toggleRowSelection(row, false);
          });
        });
        // let arr=[]

        // arr.forEach(row=>{
        //     this.$refs.userTable.toggleRowSelection(row,true)
        // })
      });
      this.isDialog = true;
    },
    sumbitFn() {
      //授权用户
      this.$http({
        method: "post",
        url: "/so/project/operateUserAuth",
        data: {
          projId: this.projId,
          json: JSON.stringify(this.tableData1)
        }
      }).then(res => {
        if (res.succ) {
          this.$message({
            title: "成功",
            message: res.data,
            type: "success"
          });
          this.isDialog = false;
          this.tableData1 = [];
          this.ajax();
        }
      });
    },
    timeClick(val) {
      //时间监听
      this.fromData.projStartime = val[0];
      this.fromData.projEndtime = val[1];
    },
    creatFn() {
      //创建
      this.fromData = new Object();
      this.drawer = true;
      this.title = "新建项目";
      if (this.$refs.fromData) {
        this.$refs.fromData.resetFields();
      }
    },
    editFn() {
      //编辑
      this.$http({
        method: "post",
        url: "/so/project/detail",
        data: {
          projId: this.projId
        }
      }).then(res => {
        if (res.data.projPlantype) {
          this.planChange1(res.data);
        }
        this.fromObj = JSON.parse(JSON.stringify(res.data));
        console.log(this.fromObj);
        if (this.fromObj.projStartime && this.fromObj.projEndtime) {
          this.fromObj.timer = [
            this.fromObj.projStartime,
            this.fromObj.projEndtime
          ];
        }
        console.log(this.fromObj);
        this.fromData = JSON.parse(JSON.stringify(this.fromObj));
        this.drawer = true;
        this.title = "编辑项目";
      });
    },
    exportFn() {
      //导出
      window.open(
        baseUrl + "/so/project/excel?comId=" + this.data.comId,
        "_blank"
      );
    },
    regionWacth(p) {
      //监听地区组件返回的值
      this.fromData.projRegion = p.regionVal;
    },
    submitFn() {
      //提交表单
      this.$refs.fromData.validate(valid => {
        if (valid) {
          let d = JSON.parse(JSON.stringify(this.fromData));
          if (this.title == "新建项目") {
            d.comId = this.data.comId;
          }
          for (let x in d) {
            if (d[x] == null) {
              delete d[x];
            }
            if (x == "timer") {
              delete d[x];
            }
            if (x == "isOpen") {
              delete d[x];
            }
            if (x == "projCreatime") {
              delete d[x];
            }
            if (x == "comName") {
              delete d[x];
            }
          }
          this.$http({
            method: "post",
            url: "/so/project/save/project",
            data: d
          }).then(res => {
            if (res.succ) {
              this.$message({
                title: "成功",
                message: res.data,
                type: "success"
              });
              this.drawer = false;
              this.ajax();
            }
          });
        }
      });
    },
    tableSelectFn(currentRow, oldCurrentRow) {
      //表格选中时
      let obj = JSON.parse(JSON.stringify(currentRow));
      this.projId = obj.projId;
      this.id = currentRow.comId;
    },
    planChange() {
      //计划类型联动
      // this.planList1=[];
      let d = JSON.parse(JSON.stringify(this.fromData));
      d.projPlanchildtype = "";
      for (let x of this.planList) {
        if (x.id == d.projPlantype) {
          this.planList1 = x.data;
        }
      }
    },
    planChange1(obj) {
      let d = JSON.parse(JSON.stringify(obj));
      d.projPlanchildtype = "";
      for (let x of this.planList) {
        if (x.id == d.projPlantype) {
          this.planList1 = x.data;
        }
      }
    },
    plan1Change() {
      // console.log(this.$event)
      this.$set(
        this.fromData,
        this.fromData.projPlanchildtype,
        this.fromData.projPlanchildtype
      );
    },
    ajax() {
      let d = this.data;
      d.comId = this.comid;
      d.comName = this.comName;
      for (let x in d) {
        if (d[x] == null) {
          delete d[x];
        }
      }
      this.$http({
        method: "post",
        url: "/so/project/list",
        data: d
      }).then(res => {
        this.tableData = res.data;
        // this.$refs.ownList.setCurrentRow(this.tableData[0])
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
.page-box {
  height: 44px;
  .el-pagination /deep/ .el-pagination__sizes {
    margin: 0 15px;
  }
}
.red-font {
  color: #fa5555;
}
/**dialog样式 */
.el-dialog__wrapper /deep/ .el-dialog__header {
  background: #1989fa;
  padding: 0 20px;
  line-height: 44px;
}
.el-dialog__wrapper /deep/ .el-dialog__body {
  padding: 15px 20px 20px;
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

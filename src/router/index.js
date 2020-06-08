import Vue from "vue";
import VueRouter from "vue-router";
/**服务业主 */
import serviceOwner from "../page/serviceOwner/serviceOwner"; //服务业主
import organize from "../page/serviceOwner/organize"; //组织
import user from "../page/serviceOwner/user"; //用户
import project from "../page/serviceOwner/project"; //项目
import supplier from "../page/serviceOwner/supplier"; //供应商
import method from "../page/serviceOwner/method"; //方法论
import record from "../page/serviceOwner/record"; //跟进记录
import service from "../page/serviceOwner/service"; //服务
import contract from "../page/serviceOwner/contract"; //合同
import file from "../page/serviceOwner/file"; //归档
import empower from "../page/serviceOwner/empower"; //单位授权
/**服务业主end */
import salesContract from "../page/salesContract/salesContract"; //销售合同
/*服务报表*/
import reportForm from "../page/reportForm/reportForm"
import daily from "../page/reportForm/daily"
import detailed from "../page/reportForm/detailed"
import customers from "../page/reportForm/customers"
/*计划查询*/
import planSearch from "../page/servicePlan/planSearch"
/*服务计划*/
import planList from "../page/servicePlan/planList"
import servicePlan from "../page/servicePlan/servicePlan"
import planDetailed from "../page/servicePlan/planDetailed"
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/serviceOwner"
  },
  {
    path: "/serviceOwner",
    name: "serviceOwner",
    component: serviceOwner,
    redirect: "/serviceOwner/organize",
    children: [
      {
        path: "organize",
        name: "organize",
        component: organize
      },
      {
        //用户
        path: "user",
        name: "user",
        component: user
      },
      {
        //项目
        path: "project",
        name: "project",
        component: project
      },
      {
        //供应商
        path: "supplier",
        name: "supplier",
        component: supplier
      },
      {
        //方法论
        path: "method",
        name: "method",
        component: method
      },
      {
        //跟进记录
        path: "record",
        name: "record",
        component: record
      },
      {
        //服务
        path: "service",
        name: "service",
        component: service
      },
      {
        //合同
        path: "contract",
        name: "contract",
        component: contract
      },
      {
        //归档
        path: "file",
        name: "file",
        component: file
      },
      {
        //单位授权
        path: "empower",
        name: "empower",
        component: empower
      }
    ]
  },
  {
    path: "/salesContract",
    name: "salesContract",
    component: salesContract
  },
  {
    path: "/reportForm",
    name: "reportForm",
    component: reportForm,
    redirect: "/reportForm/daily",
    children: [
      {//服务日报
        path:'daily',
        name:'daily',
        component:daily
      },
      {//服务明细
        path:'detailed',
        name:'detailed',
        component:detailed
      },
      {//重点客户复盘
        path:'customers',
        name:'customers',
        component:customers
      }
    ]
  },
  {
    path:'/planSearch',
    name:'planSearch',
    component:planSearch,
  },
  {
    path:'/planList',
    name:'planList',
    component:planList,
    redirect: "/planList/servicePlan",
    children:[
      {
        path:'servicePlan',
        name:'servicePlan',
        component:servicePlan
      },{
        path:'planDetailed',
        name:'planDetailed',
        component:planDetailed
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;

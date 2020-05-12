import Vue from "vue";
import VueRouter from "vue-router";
import organize from "../page/organize";//组织
import user from "../page/user";//用户
import project from "../page/project";//项目
import supplier from "../page/supplier";//供应商
import method from "../page/method";//方法论
import record from "../page/record";//跟进记录
import service from "../page/service";//服务
import contract from "../page/contract";//合同
import file from "../page/file";//归档
import empower from "../page/empower";//单位授权
Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/organize'
  },
  {
    path: "/organize",
    name: "organize",
    component: organize,
    meta:{
      comId:''
    }
  },{//用户
    path: "/user",
    name: "user",
    component: user
  },{//项目
    path: "/project",
    name: "project",
    component: project
  },{//供应商
    path: "/supplier",
    name: "supplier",
    component: supplier
  },{//方法论
    path: "/method",
    name: "method",
    component: method
  },{//跟进记录
    path: "/record",
    name: "record",
    component: record
  },{//服务
    path: "/service",
    name: "service",
    component: service
  },{//合同
    path: "/contract",
    name: "contract",
    component: contract
  },{//归档
    path: "/file",
    name: "file",
    component: file
  },{//单位授权
    path: "/empower",
    name: "empower",
    component: empower
  },
];

const router = new VueRouter({
  routes
});

export default router;

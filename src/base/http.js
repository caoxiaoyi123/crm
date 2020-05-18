import {
  baseUrl //引入baseUrl
} from "../../config/env";
import axios from "axios";
import Vue from "vue";
import { Message } from "element-ui";
Vue.prototype.$http = axios;
axios.defaults.retry = 4; //重复请求次数
axios.defaults.retryDelay = 1000; //重复请求间隔
axios.defaults.baseURL = baseUrl; //设置默认接口地址

axios.interceptors.request.use(
  function(config) {
    // 将token给到一个前后台约定好的key中，作为请求发送
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(function(response) {
  // ①10010 token过期（30天） ②10011 token无效
  if (response.data.succ == undefined) {
    return response.data;
  }
  if (!response.data.succ) {
    Message({
      title: "消息",
      message: response.data.msg,
      type: "warning"
    });
  }
  return response.data;
});

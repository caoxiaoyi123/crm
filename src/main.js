import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUI from "element-ui";
import { Message } from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./base/base.less";
import drawer from "@/components/drawer";

require("./base/http");
Vue.component("v-drawer", drawer);
Vue.use(ElementUI);

Vue.config.productionTip = false;

Vue.prototype.upLoadfn = (function() {
  return {
    uploadSucFn() {
      Message({
        message: "上传成功",
        type: "success"
      });
    },
    uploadErrFn() {
      Message.error({
        message: "上传失败"
      });
    },
    uploadExcFn() {
      Message({
        message: "最多只能上传一个文件",
        type: "warning"
      });
    }
  };
})();

new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");

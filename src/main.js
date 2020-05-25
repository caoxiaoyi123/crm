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

Vue.prototype.formatDate = function(param, type = null) {
  var a = new Date(param);
  var m = a.getMonth() + 1;
  if (m < 10) {
    m = "0" + m;
  }
  var d = a.getDate();
  if (d < 10) {
    d = "0" + d;
  }
  var b = a.getFullYear() + "-" + m + "-" + d;

  if (type != null) {
    var h = a.getHours();
    if (h < 10) {
      h = "0" + h;
    }
    var mm = a.getMinutes();
    if (mm < 10) {
      mm = "0" + mm;
    }
    var ss = a.getSeconds();
    if (ss < 10) {
      ss = "0" + ss;
    }
    b = b + " " + h + ":" + mm + ":" + ss;
  }
  return b;
};

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
        message: "最多只能上传一个文件（test）",
        type: "warning"
      });
    }
  };
})();

Vue.prototype.openLink = function(url) {
  //新开链接
  if (url && url != "") {
    window.open(url, "_blank");
  }
};

new Vue({
  router,
  render: function(h) {
    return h(App);
  }
}).$mount("#app");

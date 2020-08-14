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
//时间戳转字符串
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
//上传
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
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 20;
      if (!isLt2M) {
        Message({
          message: "上传附件大小不能超过 20MB!",
          type: "warning"
        });
        return false;
      }
      return isLt2M;
    }
  };
})();
//新开页
Vue.prototype.openLink = function(url) {
  //新开链接
  if (url && url != "") {
    window.open(url, "_blank");
  }
};
//打开pdf
Vue.prototype.openPdf = function(url) {
  window.open(
    "/static/pdf/web/viewer.html?file=" + encodeURIComponent(url) + "&.pdf"
  );
};
//根据pid获取树状图
Vue.prototype.toTree=function(data,id,pid) {
  // 删除 所有 children,以防止多次调用
  // data.forEach(function (item) {
  //   delete item.children;
  // });
  // 将数据存储为 以 id 为 KEY 的 map 索引数据列
  var map = {};
  data.forEach(function (item) {
    map[item[id]] = item;
  });
  var val = [];
  data.forEach(function (item,index) {
    // item.index=index;
    // 以当前遍历项的pid,去map对象中找到索引的id
    var parent = map[item[pid]];
    // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
    if (parent) {
      (parent.children || (parent.children = [])).push(item);
    } else {
      //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
      val.push(item);
    }
  });
  return val;
}
Vue.prototype.getTreeDic = function(pid, data, type = 0) {
  let result = [],temp;
  for (let x of data) {
    if (x.pid == pid) {
      result.push(x);
      if (type == 0) {
        temp = this.getTreeDic(x.areaId, data);
      } else {
        temp = this.getTreeDic(x.depCode, data, 1);
      }
      if (temp.length > 0) {
        x.children = temp;
      }
    }
  }
  return result;
};
  new Vue({
    router,
    render: function(h) {
      return h(App);
    }
  }).$mount("#app");

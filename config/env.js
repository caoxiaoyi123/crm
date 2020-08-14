let baseUrl = "";

if (process.env.NODE_ENV == "development") {
  baseUrl = "/api";
} else if (process.env.NODE_ENV == "production") {
  // baseUrl = "http://silita-api.natapp1.cc/crm/";
  // baseUrl = "http://192.168.88.192:7001/crm/";
  // baseUrl = 'http://apicrmslt.jizhibao.com.cn';
  // baseUrl = 'http://127.0.0.1:8001/crm/';
  baseUrl = "http://192.168.0.252:8001/crm/";
}

export {
  baseUrl //导出baseUrl
};

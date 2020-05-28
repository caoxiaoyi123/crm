let baseUrl = "";

if (process.env.NODE_ENV == "development") {
  baseUrl = "/api";
} else if (process.env.NODE_ENV == "production") {
  baseUrl = "http://silita-api.natapp1.cc/crm/";
  // baseUrl = "http://192.168.88.192:7001/crm/";
  // baseUrl = 'http://192.168.0.243:7001/crm/';
  // baseUrl = 'http://127.0.0.1:7001/crm/';
}

export {
  baseUrl //导出baseUrl
};

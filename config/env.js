let baseUrl = "";

if (process.env.NODE_ENV == "development") {
  baseUrl = "/api";
} else if (process.env.NODE_ENV == "production") {
  baseUrl = "http://192.168.88.192:7001/crm/";
  //baseUrl = '预发布地址';
  // baseUrl = '/';
}

export {
  baseUrl //导出baseUrl
};

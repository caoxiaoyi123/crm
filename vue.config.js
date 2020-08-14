const CompressionWebpackPlugin =require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
module.exports = {
  lintOnSave: false,
  publicPath: "./",
  configureWebpack: {
      plugins: [
          new CompressionWebpackPlugin({
              filename: '[path].gz[query]',
              algorithm: 'gzip',
              test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),//匹配文件名
              threshold: 10240,//对10K以上的数据进行压缩
              minRatio: 0.8,
              deleteOriginalAssets:false,//是否删除源文件
          })
      ]
  },
  // transpileDependencies: ['element-ui'],
  // chainWebpack(config) {
  //   // 在chainWebpack中添加下面的代码
  //   config.entry('main').add('babel-polyfill') // main是入口js文件
  // },
  devServer: {
    host: "0.0.0.0",
    port: "3000",
    open: false,
    proxy: {
      "/api": {
        // search为转发路径
        // target: "http://192.168.88.192:7001/crm/", // 目标地址
        // target: "http://192.168.88.254:7001/crm/", // 目标地址
        target: "http://192.168.88.126:7001/crm/",  // 目标地址
        ws: false, // 是否代理websockets
        changeOrigin: true, // 设置同源  默认false，是否需要改变原始主机头为目标URL,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },

  productionSourceMap: false
};

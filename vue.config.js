const path = require("path");
module.exports = {
  // 基本路径
  publicPath: process.env.NODE_ENV === "production" ? "" : "/",
  // 输出文件目录
  outputDir: process.env.NODE_ENV === "production" ? "dist" : "devdist",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  /**
   * webpack配置,see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
   **/
  chainWebpack: (config) => {
    const svgRule = config.module.rule("svg");
    svgRule.uses.clear();
    svgRule.use("svg-sprite-loader")
           .loader("svg-sprite-loader")
           .options({
             symbolId: "icon-[name]",
             include: ["./src/icons"]
           });
  },
  configureWebpack: config => {
    config.resolve = { // 配置解析别名
      extensions: ['.js', '.json', '.vue'], //自动添加文件名后缀
      alias: {
        'vue': 'vue/dist/vue.js',
        '@': path.resolve(__dirname, './src'),
        'public': path.resolve(__dirname, './public'),
        '@c': path.resolve(__dirname, './src/components'),
        // 'common': path.resolve(__dirname, './src/common'),
        // 'api': path.resolve(__dirname, './src/api'),
        // 'views': path.resolve(__dirname, './src/views'),
        // 'data': path.resolve(__dirname, './src/data')
      }
    }
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // css相关配置
  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      // 如发现 css.modules 报错，请查看这里：http://www.web-jshtml.cn/#/detailed?id=12
      sass: {
        // data: `@import "./src/style/main.scss";`
        prependData: `@import "./src/style/main.scss";`
      }
    },
    // 启用 CSS modules for all css / pre-processor files.
   // modules: false
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require("os").cpus().length > 1,
  /**
   *  PWA 插件相关配置,see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
   */
  pwa: {},
  // webpack-dev-server 相关配置
  devServer: {
    open: false, // 编译完成是否打开网页
    host: "0.0.0.0", // 指定使用地址，默认localhost,0.0.0.0代表可以被外界访问
    port: 8080, // 访问端口
    https: false, // 编译失败时刷新页面
    hot: true, // 开启热加载
    hotOnly: false,
    proxy: null,
    // 设置代理
    proxy: {
      '/devApi': {
        target:"http://www.web-jshtml.cn/productapi/token", // 你请求的第三方接口
        changeOrigin:true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite:{  // 路径重写，
          '^/devApi': ''  // 替换target中的请求地址，也就是说以后你在请求http://api.douban.com/v2/XXXXX这个地址的时候直接写成/api即可。
        }
      }
    },
    
    overlay: {
      // 全屏模式下是否显示脚本错误
      warnings: true,
      errors: true
    },
    before: app => {}
  },
  /**
   * 第三方插件配置
   */
  pluginOptions: {}
};

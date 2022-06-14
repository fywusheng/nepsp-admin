const path = require("path")
const CompressionWebpackPlugin = require("compression-webpack-plugin")

const isProd = process.env.NODE_ENV === "production"
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  transpileDependencies: ["vue2-editor"],
  publicPath: isProd ? "" : "/", //配置根路径
  // assetsRoot: path.resolve(__dirname, "../dist"),
  outputDir: "nepsp-admin", //构建输出目录
  assetsDir: "assets", //静态资源目录(js\css\img)
  lintOnSave: true, //是否开启eslint
  productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
  devServer: {
    open: true, //是否自动在浏览器打开
    host: "0.0.0.0", //真机测试 0.0.0.0
    port: 9082, //配置端口号
    https: false, //是否配置https
    hot: true,
    hotOnly: true, //是否热更新
    disableHostCheck: true,
    proxy: { //配置跨域
      "/proxy": {
        target: "http://192.168.1.187:10000", // 测试环境
        ws: true,
        changOrigin: true,
        pathRewrite: {
          "^/proxy": ""
        }
      },
      "/nepsp-api/": { // 图片上传代理
        target: "https://api.hpgjzlinfo.com", // 演示环境
        changeOrigin: true, // 是否改变源地址
        ws: false, // 代理websockets
        pathRewrite: {
          "^/nepsp-api": "/nepsp-api"
        }
      },
      "/nepsp-api-server/": {
        // target: "http://192.168.1.187:6666", // 测试环境
        target: "http://192.168.1.206:6666", // 开发环境
        changeOrigin: true, // 是否改变源地址
        ws: false, // 代理websockets
        pathRewrite: {
          "^/nepsp-api-server": "/"
        }
      },
      "/nepsp-cms-api/": {
        target: "http://192.168.1.187:7002", // 这里是目标服务器地址
        changeOrigin: true, // 是否改变源地址
        ws: false, // 代理websockets
        pathRewrite: {
          "^/nepsp-cms-api": "/"
        }
      }
    }
  },

  css: {
    // 是否使用css分离插件 ExtractTextPlugin
    //如果需要css热更新就设置为false,打包时候要改为true
    extract: false,
    // 开启 CSS source maps?
    sourceMap: true,
    // css预设器配置项
    loaderOptions: {
      sass: {
        // @/ is an alias to src/
        // so this assumes you have a file named `src/variables.scss`
        prependData: `@import "@/styles/variables.scss";`
      }
    }
  },
  pages: {
    index: {
      // page 的入口
      entry: "src/main.js",
      // 模板来源
      template: "public/index.html",
      // 在 dist/index.html 的输出
      filename: "index.html",
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: "首页标题",
      // 在这个页面中包含的块，默认情况下会包含
      // 提取出来的通用 chunk 和 vendor chunk。
      chunks: ["chunk-vendors", "chunk-common", "index"]
    }
  },
  configureWebpack: (config) => {
    if (isProd) {
      // 生产环境
      config.plugins.push(
        new CompressionWebpackPlugin({
          // 正在匹配需要压缩的文件后缀
          test: /\.(js|css|svg|woff|ttf|json|html)$/,
          // 大于10kb的会压缩
          threshold: 10240,
          deleteOriginalAssets: false
          // 其余配置查看compression-webpack-plugin
        })
      )
    }

  },
  chainWebpack: config => {
    config.entry.app = ["babel-polyfill", "./src/main.js"],
    // 修复HMR(热更新)失效
    config.resolve.symlinks(true)
    // 别名配置
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@utils", resolve("src/utils"))
      .set("@api", resolve("src/api"))
      .set("@components", resolve("src/components"))
      .set("@pic", resolve("src/assets/imgs"))
    config.resolve.extensions
      .clear()
      .merge([".js", ".vue", ".json"])
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end()
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end()

    // 图片限制 转为64base
    config.module
      .rule("images")
      .use("url-loader")
      .loader("url-loader")
      .tap(options => Object.assign(options, {
        limit: 20240
      }))
    // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
    config.plugin("define").tap(args => {
      args[0]["process.env"].BASE_URL = JSON.stringify(process.env.BASE_URL)
      return args
    })
    config.optimization.splitChunks({
      chunks: "all", // 控制webpack选择哪些代码块用于分割（其他类型代码块按默认方式打包）。有3个可选的值：initial、async和all。
      minSize: 30000, // 形成一个新代码块最小的体积
      maxSize: 0,
      minChunks: 2, // 在分割之前，这个代码块最小应该被引用的次数（默认配置的策略是不需要多次引用也可以被分割）
      maxAsyncRequests: 5, // 按需加载的代码块，最大数量应该小于或者等于5
      maxInitialRequests: 3, // 初始加载的代码块，最大数量应该小于或等于3
      automaticNameDelimiter: "~",
      name: true,
      cacheGroups: {
        libs: {
          name: "chunk-libs",
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: "initial" // only package third parties that are initially dependent
        },
        elementUI: {
          name: "chunk-elementUI", // split elementUI into a single package
          priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
        },
        commons: {
          name: "chunk-commons",
          test: resolve("src/components"), // can customize your rules
          minChunks: 3, //  minimum common number
          priority: 5,
          reuseExistingChunk: true
        }
      }
    })
    /*
						preload 和 Prefetch 链接将会消耗带宽。如果你的应用很大且有很多 async chunk，
						而用户主要使用的是对带宽较敏感的移动端，
						那么你可能需要关掉 prefetch 链接并手动选择要提前获取的代码区块。
						官方文件很坑爹的官网文档是错的要自己打印出来
						console.log(config)
						他改名字了
				*/
    config.plugins.delete("prefetch-index")
    config.plugins.delete("preload-index")
  },
  // 第三方插件配置
  pluginOptions: {}
}

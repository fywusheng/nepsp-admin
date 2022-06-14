import "babel-polyfill" // 兼容IE
import Vue from "vue"
import App from "@/App.vue"
import Router from "vue-router"
import router from "@/router"

import * as filters from "./filters" // 全局过滤器

// 自动注册全局的组件
import "@/components/index"
import { beforeEachToExample } from "@/router/before-each"
import afterEachHandler from "@/router/after-each"

import store from "@/store"
import "@/use"
// 引入基础样式
import "@/styles/index.scss" // global css
// 重置标准组UI规范，element主题
import "@/theme/index.css"
// 重置标准组UI规范
import "@/theme/reset.scss"
// 页面通用样式
import "@/styles/page.scss"
//引入字体样式
import "@/assets/fonts/iconfont.css"

// 引入icons
import "@/icons"
import "@/permission" // permission control
import SessionUtil from "@/utils/session-storage"
// 挂载工具
Vue.prototype.$sessionUtil = SessionUtil

import Vue2Editor from "vue2-editor"
Vue.use(Vue2Editor)

// 修改路由跳转报错的bug-start
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}
// 修改路由跳转报错的bug--end

if (process.env.NODE_ENV === "development" && eval(process.env.VUE_APP_ENABLE_MOCK)) {
  const { mockXHR } = require("../mock")
  mockXHR()
}
// 总线
var EventBus = new Vue()
Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function() {
      return EventBus
    }
  }
})
Vue.config.devtools = true
Vue.config.productionTip = false

// 注册全局过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

//替换演示页使用
router.beforeEach(beforeEachToExample)
// 登录用户信息校验
// router.beforeEach(beforeEachHandler)
//标题设置
router.afterEach(afterEachHandler)
// 页面局部热更新
if (module && module.hot) {
  module.hot.accept()
}
window.gvm = new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app")


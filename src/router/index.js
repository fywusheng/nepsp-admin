import Vue from "vue"
import Router from "vue-router"
Vue.use(Router)
import constantRoutes from "@/router/common"
//自动引入模块路由，路由为模块下index.js文件
export let routes = []
const routerContext = require.context("./", true, /index\.js$/)
routerContext.keys().forEach(route => {
  if (route.startsWith("./index")) {
    return
  }
  const routerModule = routerContext(route)
  routes = [...routes, ...(routerModule.default || routerModule)]
})

//如果开启权限测试 则只 注册 基本路由
const endRoutes = eval(process.env.VUE_APP_TEST_PERMISSION) ? constantRoutes : routes
const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  linkActiveClass: "active",
  routes: endRoutes
})
const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}
export default router

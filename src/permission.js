import router from "./router"
import store from "./store"
import { Message } from "element-ui"
import NProgress from "nprogress" // progress bar
import "nprogress/nprogress.css" // progress bar style
import { getToken } from "@/utils/auth" // get token from cookie
// import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ["/login"] // 不需要登录就可以访问的页面在这边配置路由

router.beforeEach(async(to, from, next) => {
  if (to.name === "redirect"){
    await store.dispatch("tagsView/delCachedView", from)
  }
  // start progress bar
  NProgress.start()
  // set page title
  //   document.title = getPageTitle(to.meta.title)
  // if (eval(process.env.VUE_APP_TEST_LOCAL)) {
  //   setToken(
  //     "!TQXZQxvtgVG-uZD_se7ROqkGoY-zl3B8IIcD8mVUo91jv1X313AzoKx2aJTDVUne-SepD_GTGz23TA8BnJxkVNhPi2juSN9SrUQXN3FtJqPGw159xrdDtduxKoXJrFeZyCpZyT5F254oXjLGiV-2VIfg=="
  //   )
  // }
  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === "/login") {
      // if is logged in, redirect to the home page
      next({ path: "/" })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          //如果启动权限测试，则走动态加载路由
          if (eval(process.env.VUE_APP_TEST_PERMISSION)) {
            await store.dispatch("user/reloadMenu")
            next({ ...to, replace: true })
          } else {
            if (!eval(process.env.VUE_APP_TEST_LOCAL)) {
              // get user info
              await store.dispatch("user/getInfo")
            }
            next()
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken")
          Message.error(error || "Has Error")
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar

  NProgress.done()
})

import Layout from "@/layout"
export default [
  {
    path: "/app-user-module",
    component: Layout,
    meta: {
      title: "app用户中心",
      icon: "dashboard"
    },
    children: [{
      path: "/app-user-module/citizen-user-manage",
      name: "appUserCitizenUserManage",
      meta: {
        title: "市民用户",
        icon: "dashboard"
      },
      component: () => import(/* webpackChunkName: "appUserModule" */"@/views/app-user-module/citizen-manage/citizen-user-manage")
    }]
  }
]
import Layout from "@/layout"
export default [
  {
    path: "/cms-module",
    component: Layout,
    redirect: "/cms-module/user-center",
    meta: {
      title: "系统管理",
      icon: "dashboard"
    },
    children: [{
      path: "/cms-module/interest-manage",
      name: "cmsInterestManage",
      component: () => import(/* webpackChunkName: "cmsModule" */"@/views/cms-module/interest-manage"),
      meta: {
        title: "权益管理",
        icon: "dashboard"
      }
    }]
  }
]
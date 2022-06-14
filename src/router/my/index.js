import Layout from "@/layout"
export default [
  {
    path: "/",
    component: Layout,
    meta: {
      title: "个人信息",
      icon: "dashboard"
    },
    children: [{
      path: "/my-module/personal-info",
      name: "myPersonalInfo",
      meta: {
        title: "个人信息",
        icon: "dashboard"
      },
      component: () => import(/* webpackChunkName: "myModule" */"@/views/my-module/personal-info")
    }]
  }
]
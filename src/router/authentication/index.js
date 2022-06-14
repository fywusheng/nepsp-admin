import Layout from "@/layout"
export default [
  {
    path: "/authentication-module",
    component: Layout,
    redirect: "/authentication-module/authentication-records",
    meta: {
      title: "认证中心",
      icon: "dashboard"
    },
    children: [
      {
        path: "/authentication-module/authentication-records",
        name: "authenticationRecords",
        component: () => import(/* webpackChunkName: "authenticationModule" */"@/views/authentication-module/authentication-records"),
        meta: {
          title: "认证记录",
          icon: "dashboard"
        }
      }
    ]
  }
]
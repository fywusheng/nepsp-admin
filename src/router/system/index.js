import Layout from "@/layout"
export default [
  {
    path: "/system-module",
    component: Layout,
    redirect: "/system-module/user-center",
    meta: {
      title: "系统管理",
      icon: "dashboard"
    },
    children: [{
      path: "/system-module/user-center",
      name: "systemUserCenter",
      component: () => import(/* webpackChunkName: "systemModule" */"@/views/system-module/user-center"),
      meta: {
        title: "用户管理",
        icon: "dashboard"
      }
    },
    {
      path: "/system-module/role-center",
      name: "systemRoleCenter",
      component: () => import(/* webpackChunkName: "systemModule" */"@/views/system-module/role-center"),
      meta: {
        title: "角色管理",
        icon: "dashboard"
      }
    },
    {
      path: "/system-module/dict-manage",
      name: "systemDictManage",
      component: () => import(/* webpackChunkName: "systemModule" */"@/views/system-module/dict-manage"),
      meta: {
        title: "字典管理",
        icon: "dashboard"
      }
    },    
    {
      path: "/system-module/menu-center",
      name: "systemMenuCenter",
      component: () => import(/* webpackChunkName: "systemModule" */"@/views/system-module/menu-center"),
      meta: {
        title: "菜单管理",
        icon: "dashboard"
      }
    }]
  }
]
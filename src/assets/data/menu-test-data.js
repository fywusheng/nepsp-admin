export default [
  {
    path: "/",
    title: "系统管理",
    icon: "dashboard",
    redirect: "/system-module/user-center",
    affix: true,
    noCache: false,
    alwaysShow: true,
    children: [
      {
        path: "/system-module/user-center",
        title: "用户管理",
        icon: "dashboard",
        name: "systemUserCenter",
        affix: true,
        noCache: false,
      },
      {
        path: "/system-module/role-center",
        title: "角色管理",
        icon: "dashboard",
        name: "systemRoleCenter",
        affix: true,
        noCache: false,
      },
      {
        path: "/system-module/menu-center",
        title: "菜单管理",
        icon: "dashboard",
        name: "systemMenuCenter",
        affix: false,
      },
    ]
  },
  {
    path: "/operating-module",
    title: "运营管理",
    icon: "dashboard",
    redirect: "/operating-module/users-manage",
    alwaysShow: true,
    children: [
      {
        path: "/operating-module/users-manage",
        title: "用户管理",
        icon: "dashboard",
        name: "operatingUsersManage",
        noCache: false,
      },
      // {
      //   path: "/operating-module/app-manage",
      //   title: "app管理",
      //   icon: "dashboard",
      //   name: "operatingAppManage",
      //   noCache: false,
      // },
    ]
  }
]

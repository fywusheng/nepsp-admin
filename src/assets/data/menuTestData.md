## 菜单数据测试

```js
export default [
  {
    path: "/system-module2",
    title: "系统管理",
    icon: "dashboard",
    menuItem: "system/user-center",
    children: [
      {
        path: "/system-module2/user-center",
        title: "用户管理",
        icon: "dashboard",
        menuItem: "system-module/user-center"
      },
      {
        path: "/system-module2/role-center",
        title: "角色管理",
        icon: "dashboard",
        menuItem: "system-module/role-center"
      },
      {
        path: "/system-module2/menu-center",
        title: "菜单管理",
        icon: "dashboard",
        menuItem: "system-module/menu-center"
      },
    ]
  },
  {
    path: "/system-module4",
    title: "系统管理",
    icon: "dashboard",
    menuItem: "system-module/user-center",
    children: [
      {
        path: "/system-module4/user-center",
        title: "用户管理",
        icon: "dashboard",
        menuItem: "system-module/user-center"
      },
      {
        path: "/system-module4/role-center",
        title: "角色管理",
        icon: "dashboard",
        menuItem: "system-module/role-center"
      },
      {
        path: "/system-module4/menu-center",
        title: "菜单管理",
        icon: "dashboard",
        menuItem: "system-module/menu-center"
      },
    ]
  }
]
```

## 根据menuItem转化为真正组件

```
menuItemFormat = {
	"system-module/user-center": () => import("@/views/system-module/user-center"),
	"system-module/role-center": () => import("@/views/system-module/role-center"),
    "system-module/role-center": () => import("@/views/system-module/menu-center"),
}
```


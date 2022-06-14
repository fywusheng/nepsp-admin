import Layout from "@/layout"
export default [
  {
    path: "/message-module",
    component: Layout,
    redirect: "/message-module/notice-manage",
    meta: {
      title: "消息中心",
      icon: "dashboard"
    },
    children: [
      {
        path: "/message-module/notice-manage",
        name: "messageNoticeManage",
        component: () => import(/* webpackChunkName: "messageModule" */"@/views/message-module/notice-manage"),
        meta: {
          title: "公告管理",
          icon: "dashboard"
        }
      },
      {
        path: "/message-module/short-message-manage",
        name: "messageShortMessageManage",
        component: () => import(/* webpackChunkName: "messageModule" */"@/views/message-module/short-message-manage"),
        meta: {
          title: "短信管理",
          icon: "dashboard"
        }
      },
      {
        path: "/message-module/inside-message-manage",
        name: "messageInsideMessageManage",
        component: () => import(/* webpackChunkName: "messageModule" */"@/views/message-module/inside-message-manage"),
        meta: {
          title: "站内消息管理",
          icon: "dashboard"
        }
      },
      {
        path: "/message-module/template-manage",
        name: "messageTemplateManage",
        component: () => import(/* webpackChunkName: "messageModule" */"@/views/message-module/template-manage"),
        meta: {
          title: "模板管理",
          icon: "dashboard"
        }
      },
      {
        path: "/message-module/system-remind",
        name: "systemRemindManage",
        component: () => import(/* webpackChunkName: "messageModule" */"@/views/message-module/system-remind"),
        meta: {
          title: "系统提醒",
          icon: "dashboard"
        }
      }
    ]
  }
]
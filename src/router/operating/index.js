const ContentManage = () =>
  import(
    /* webpackChunkName: "operating-module" */ "@/views/operating-module/content-manage"
  )
const ServiceManage = () =>
  import(
    /* webpackChunkName: "operating-module" */ "@/views/operating-module/service-manage"
  )
const ServiceExamine = () =>
  import(
    /* webpackChunkName: "operating-module" */ "@/views/operating-module/service-examine"
)
const VersionManage = () =>
  import(
    /* webpackChunkName: "operating-module" */ "@/views/operating-module/version-manage"
  )
const StartManage=() =>
  import(
    /* webpackChunkName: "operating-module" */ "@/views/operating-module/start-manage"
  )
const ServiceType=() =>
  import(
    /* webpackChunkName: "operating-module" */ "@/views/operating-module/service-type"
  )

const BannerManage=() =>
  import(
    /* webpackChunkName: "operating-module" */ "@/views/operating-module/banner-manage"
  )
const SpecialCategory=() =>
  import(
    /* webpackChunkName: "operating-module" */ "@/views/operating-module/special-category"
  )
const FeedbackManage=() =>
  import(
    /* webpackChunkName: "operating-module" */ "@/views/operating-module/feedback-manage"
  )
import Layout from "@/layout"

export default [
  {
    path: "/operating-module",
    component: Layout,
    redirect: "/operating-module/version-manage",
    meta: {
      title: "运营管理",
      icon: "dashboard"
    },
    children: [
      {
        path: "/operating-module/version-manage",
        name: "operatingVersionManage",
        component: VersionManage,
        meta: {
          title: "版本管理",
          icon: "user"
        }
      },
      {
        path: "/operating-module/start-manage",
        name: "operatingStartManage",
        component: StartManage,
        meta: {
          title: "启动管理",
          icon: "user"
        }
      },
      {
        path: "/operating-module/service-type",
        name: "operatingServiceTypeManage",
        component: ServiceType,
        meta: {
          title: "服务类别管理",
          icon: "user"
        }
      },
      {
        path: "/operating-module/service-manage",
        name: "operatingServiceManage",
        component: ServiceManage,
        meta: {
          title: "服务管理",
          icon: "user"
        }
      },
      {
        path: "/operating-module/service-examine",
        name: "operatingServiceExamine",
        component: ServiceExamine,
        meta: {
          title: "服务审核",
          icon: "user"
        }
      },
      {
        path: "/operating-module/banner-manage",
        name: "operatingBannerManage",
        component: BannerManage,
        meta: {
          title: "轮播图管理",
          icon: "user"
        }
      },
      {
        path: "/operating-module/special-category",
        name: "operatingSpecialCategory",
        component: SpecialCategory,
        meta: {
          title: "专题类别管理",
          icon: "user"
        }
      },

      {
        path: "/operating-module/content-manage",
        name: "operatingContentManage",
        component: ContentManage,
        meta: {
          title: "专题内容管理",
          icon: "user"
        }
      },
      
      {
        path: "/operating-module/thematic-content-management",
        name: "operatingThematicContentManagement",
        component: () => import(/* webpackChunkName: "operating-module" */"@/views/operating-module/thematic-content-management"),
        meta: {
          title: "专题内容管理",
          icon: "user"
        }
      },
      {
        path: "/operating-module/feedback-manage",
        name: "operatingFeedbackManage",
        component: FeedbackManage,
        meta: {
          title: "用户反馈管理",
          icon: "user"
        }
      }
    ]
  }
]

import Layout from "@/layout"

const commoRouter = [
  {
    path: "/login", //登录页
    name: "login",
    meta: {
      needLogin: false,
      title: "登录页"
    },
    component: () => import(/* webpackChunkName: "commonModule" */"@/views/login-module/login"),
    hidden: true
  },
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "redirect",
        meta: {
        },
        component: () => import(/* webpackChunkName: "commonModule" */"@/views/redirect/index")
      }
    ]
  },
  {
    path: "/error-module",
    component: Layout,
    hidden: true,
    redirect: "/error-module/401",
    children: [
      {
        path: "/error-module/401",
        name: "page401",
        component: () => import(/* webpackChunkName: "commonModule" */"@/views/error-page/401.vue"),
        meta: {
          title: "401页面",
          activeMenu: "/my-module/personal-info"
        }
      },
      {
        path: "/error-module/404",
        name: "page404",
        component: () => import(/* webpackChunkName: "commonModule" */"@/views/error-page/404.vue"),
        meta: {
          title: "404页面",
          activeMenu: "/my-module/personal-info"
        }
      }
    ]
  },
  {
    path: "/app-user-module",
    component: Layout,
    hidden: true,
    redirect: "/app-user-module/citizen-user-manage",
    children: [{
      path: "/app-user-module/citizen-user-detail/:psnId/:acctId",
      name: "appUserCitizenUserDetail",
      component: () => import(/* webpackChunkName: "appUserModule" */ "@/views/app-user-module/citizen-manage/citizen-user-detail"),
      meta: {
        title: "市民用户详情"
        // activeMenu: "/my-module/personal-info"
      }
    }]
  },
  // 商品二级页面
  {
    path: "/apps/commodity",
    component: Layout,
    children: [
      {
        path: ":id/attributeVal",
        component: () => import("@/views/commodity-module/attribute/attrval-list"),
        name: "AttributeVal",
        meta: { title: "属性值管理" }
      },
      {
        path: ":id/categoryAttribute",
        component: () => import("@/views/commodity-module/category/category-attribute"),
        name: "CategoryAttribute",
        meta: { title: "配置类目规格" }
      },
      {
        path: "salescategory-product/:id",
        component: () => import("@/views/commodity-module/salescategory/sales-category-product-list"),
        name: "SalesCategoryProduct",
        meta: { title: "关联商品列表 " }
      }
     
    ]
  },
  // 营销二级页面
  {
    path: "/apps/marketing/promotion",
    component: Layout,
    children: [
      {
        path: "coupon-template/:id",
        component: () => import("@/views/marketing-module/coupon/coupon-template"),
        name: "Coupon-Template",
        meta: { title: "优惠券信息" }
      },
      {
        path: "rules/:id",
        component: () => import("@/views/marketing-module/promotion/promotion-rules"),
        name: "Rules",
        meta: { title: "活动规则" }
      }
    ]
  },
  {
    path: "/apps",
    component: Layout,
    children: [
      {
        path: "supplier/:id",
        name: "edit-supplie",
        component: () => import("@/views/srm-module/supplier/edit-supplier"),
        meta: { title: "新增/编辑商家" }
      },
      {
        path: "topic/edit/:id",
        name: "topicEditor",
        component: () => import("@/views/topic-module/topic/editor/index"),
        meta: { title: "编辑" }
      },
      {
        path: "topic/pcEdit/:id",
        name: "topicPcEditor",
        component: () => import("@/views/topic-module/topic/pc-editor/index"),
        meta: { title: "编辑"}
      }
    ] 
  }
]

const personalRouter = {
  path: "/",
  alwaysShow: false,
  title: "个人信息",
  icon: "el-icon-user",
  redirect: "/my-module/personal-info",
  parentMenuId: "0",
  children: [{
    path: "/my-module/personal-info",
    name: "myPersonalInfo",
    title: "个人信息",
    icon: "el-icon-user",
    affix: true, 
    noCache: false,
    component: () => import(/* webpackChunkName: "commonModule" */ "@/views/my-module/personal-info")
  }]
}

const page404 = {
  path: "*",
  name: "page404",
  component: () => import(/* webpackChunkName: "commonModule" */ "@/views/error-page/404.vue")
}

if (!eval(process.env.VUE_APP_TEST_PERMISSION)) {
  commoRouter.push(personalRouter)
  commoRouter.push(page404)
}

export default commoRouter
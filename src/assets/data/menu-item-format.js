/*
    "systemUserCenter"  后台用户管理
    "systemRoleCenter"   角色管理
    "systemMenuCenter" 菜单管理

    "operatingUsersManage"  运营用户管理
    "operatingAppManage" app管理
    "operatingVersionManage" 版本管理
    "operatingStartManage"  启动管理
    "operatingServiceTypeManage"  服务类别管理
    "operatingServiceMange"  服务管理
    "operatingBannerManage"  banner管理
    "operatingSpecialCategory" 专题类别维护
    "operatingContentManage" 专题内容管理
    "operatingFeedbackManage"  用户反馈管理
    "operatingColumnManage"  栏目管理

    "messageNoticeManage"  公告管理
    "messageShortMessageManage" 短信管理
    "messageInsideMessageManage" 站内消息管理
    "messageTemplateManage"  模板管理
*/
export default {
  //layout外框
  "layout": () => import(/* webpackChunkName: "commonModule" */ "@/layout"),
  // 我的
  "myPersonalInfo": () => import(/* webpackChunkName: "commonModule" */ "@/views/my-module/personal-info"),
  //空壳子，当容器
  "emptyBox":  () => import(/* webpackChunkName: "commonModule" */"@/views/empty-box"),
  //系统设置
  "systemUserCenter": () => import(/* webpackChunkName: "systemModule" */ "@/views/system-module/user-center"),
  "systemRoleCenter": () => import(/* webpackChunkName: "systemModule" */ "@/views/system-module/role-center"),
  "systemMenuCenter": () => import(/* webpackChunkName: "systemModule" */ "@/views/system-module/menu-center"),
  "systemDictManage": () => import(/* webpackChunkName: "systemModule" */ "@/views/system-module/dict-manage"),
  //运营管理
  "operatingVersionManage": () => import(/* webpackChunkName: "operating-module" */ "@/views/operating-module/version-manage"),
  "operatingStartManage": () => import(/* webpackChunkName: "operating-module" */ "@/views/operating-module/start-manage"),
  "operatingServiceTypeManage": () => import(/* webpackChunkName: "operating-module" */ "@/views/operating-module/service-type"),
  "operatingServiceMange": () => import(/* webpackChunkName: "operating-module" */ "@/views/operating-module/service-manage"),
  "operatingBannerManage": () => import(/* webpackChunkName: "operating-module" */ "@/views/operating-module/banner-manage"),
  "operatingSpecialCategory": () => import(/* webpackChunkName: "operating-module" */ "@/views/operating-module/special-category"),
  "operatingContentManage": () => import(/* webpackChunkName: "operating-module" */ "@/views/operating-module/content-manage"),
  "operatingThematicContentManagement": () => import(/* webpackChunkName: "operating-module" */"@/views/operating-module/thematic-content-management"),
  "operatingFeedbackManage":  () => import(/* webpackChunkName: "operating-module" */ "@/views/operating-module/feedback-manage"),
  "operatingServiceExamine":  () => import(/* webpackChunkName: "operating-module" */ "@/views/operating-module/service-examine"),

  //消息中心
  "messageNoticeManage": () =>  import(/* webpackChunkName: "messageModule" */ "@/views/message-module/notice-manage"),
  "messageShortMessageManage": () => import(/* webpackChunkName: "messageModule" */"@/views/message-module/short-message-manage"),
  "messageInsideMessageManage": () => import(/* webpackChunkName: "messageModule" */"@/views/message-module/inside-message-manage"),
  "messageTemplateManage":  () => import(/* webpackChunkName: "messageModule" */"@/views/message-module/template-manage"),
  "systemRemindManage":  () => import(/* webpackChunkName: "messageModule" */"@/views/message-module/system-remind"),

  //cms中心
  "cmsInterestManage": () => import(/* webpackChunkName: "cmsModule" */"@/views/cms-module/interest-manage"),

  //app用户中心
  "appUserCitizenUserManage":  () => import(/* webpackChunkName: "appUserModule" */"@/views/app-user-module/citizen-manage/citizen-user-manage"),

  // 商品管理
  "productMagBrandMag": () => import("@/views/commodity-module/brand/list"),
  "productMagPresetPrps": () => import("@/views/commodity-module/attribute/attr-list"),
  "productMagBasicCategory": () => import('@/views/commodity-module/category/list'),
  "productMagBackCategory": () => import('@/views/commodity-module/salescategory/sales-category-list'),
  "productExamined": () => import('@/views/commodity-module/product/examined-list'),

  // 营销
  "MarketingCouponMag": () => import('@/views/marketing-module/coupon/coupon-list'),
  "MarketingActivityMag": () => import('@/views/marketing-module/promotion/promotion-list'),
  "MarkingCouponApprove": () => import('@/views/finance-module/promotion/coupon-list'),

  // 商家管理
  "businessMagBusinessList": () => import('@/views/srm-module/supplier/supplier-list'),
  "businessMagResidentAudit": () => import('@/views/srm-module/audit/audit-list'),

  // 内容管理
  "contentMagSpecialTemplate": () => import('@/views/topic-module/topic/index'),
  "contentMagOperationMag": () => import('@/views/topic-module/operation/OperatePositionTable'),
  "contentMagOperationContent": () => import('@/views/topic-module/operation/OperateContentTable'),

}

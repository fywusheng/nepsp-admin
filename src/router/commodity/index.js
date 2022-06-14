import Layout from "@/layout"
export default [
  {
    path: "/apps/commodity",
    component: Layout,
    redirect: "",
    meta: {
      title: "商品管理",
      icon: "dashboard"
    },
    children: [
      {
        path: "brand",
        component: () => import("@/views/commodity-module/brand/list"),
        name: "Brand",
        meta: { title: "品牌管理" }
      }
    //   {
    //     path: "category",
    //     component: () => import("@/views/commodity-module/category/list"),
    //     name: "Category",
    //     meta: { title: "商城 / 商品管理 / 基础类目" }
    //   },
    //   {
    //     path: ":id/categoryAttribute",
    //     component: () => import("@/views/commodity-module/category/category-attribute"),
    //     name: "CategoryAttribute",
    //     meta: { title: "商城 / 商品管理 / 配置类目规格" }
    //   },
    //   {
    //     path: "attribute",
    //     component: () => import("@/views/commodity-module/attribute/attr-list"),
    //     name: "Attribute",
    //     meta: { title: "商城 / 预置属性 / 属性管理" }
    //   },
    //   {
    //     path: ":id/attributeVal",
    //     component: () => import("@/views/commodity-module/attribute/attrval-list"),
    //     name: "AttributeVal",
    //     meta: { title: "商城 / 预置属性 / 属性值管理" }
    //   },
    //   {
    //     path: "product",
    //     component: () => import("@/views/commodity-module/product/list"),
    //     name: "Product",
    //     meta: { title: "商城 / 商品管理 / 商品信息" }
    //   },
    //   {
    //     path: "productAddPage/:id",
    //     component: () => import("@/views/commodity-module/product/product-template"),
    //     name: "ProductAddPage",
    //     meta: { title: "商城 / 商品管理 / 创建商品" }
    //   },
    //   {
    //     path: ":id/productDetails",
    //     component: () => import("@/views/commodity-module/product/product-details"),
    //     name: "ProductDetails",
    //     meta: { title: "商城 / 商品管理 / 商品详情" }
    //   },
    //   {
    //     path: "/skuListDetails/:id/:categoryNode",
    //     component: () => import("@/views/commodity-module/product/sku-list"),
    //     name: "SkuListDetails",
    //     meta: { title: "商城 / 商品管理 / 商品规格" }
    //   },
    //   {
    //     path: "product-inventory-batchupdate",
    //     component: () => import("@/views/commodity-module/product/inventory-price-list"),
    //     name: "Inventory-Batchupdate",
    //     meta: { title: "商城 / 商品管理 / 批量库存" }
    //   },
    //   {
    //     path: "product-price-batchupdate",
    //     component: () => import("@/views/commodity-module/product/inventory-price-list"),
    //     name: "Inventory-Batchupdate",
    //     meta: { title: "商城 / 商品管理 / 批量价格" }
    //   },
    //   {
    //     path: ":id/inventoryPriceDetails",
    //     component: () => import("@/views/commodity-module/product/inventory-price-item-list"),
    //     name: "InventoryPriceDetails",
    //     meta: { title: "商城 / 商品管理 / 价格、库存变更明细" }
    //   },
    //   {
    //     path: "salescategory",
    //     component: () => import("@/views/commodity-module/salescategory/sales-category-list"),
    //     name: "SalesCategory",
    //     meta: { title: "商城 / 商品运营 / 运营类目" }
    //   },
    //   {
    //     path: "salescategory-product/:id",
    //     component: () => import("@/views/commodity-module/salescategory/sales-category-product-list"),
    //     name: "SalesCategoryProduct",
    //     meta: { title: "商城 / 商品运营 / 运营类目 / 商品列表 " }
    //   },
    //   {
    //     path: "salesplanning",
    //     component: () => import("@/views/commodity-module/schedule/list"),
    //     name: "SalesPlanning",
    //     meta: { title: "商城 / 商品运营 / 卖场排期" }
    //   },
    //   {
    //     path: "salesplanning-item",
    //     component: () => import("@/views/commodity-module/schedule/list-item"),
    //     name: "SalesPlanningItem",
    //     meta: { title: "商城 / 商品运营 / 卖场明细" }
    //   }
    ]
  }
]
<template>
  <div class="container">
    <y-header></y-header>
    <y-banner-show :imgBannerSrcName='imgBannerSrcName' v-show="ifBanner" :imgDesName='titleCont'></y-banner-show>
    <div class="layout-box" :style='styleLayout'>
      <y-breadcrumb class="bread-crumb" :breadcrumbList='breadcrumbList' v-show='ifBread' :marginTop="ifBanner?'26':'43'"></y-breadcrumb>
      <!-- <y-title :content='titleCont' v-show='ifTitle' fontContSize='20' :moreType="moreType" backgroundColor="#1B65B9" colorCont='333' lineHeight='27' lineTop='7' lineLeft='-27'></y-title> -->
      <slot name="formBox">
      </slot>
    </div>
    <y-footer :marginTop='footerTop'></y-footer>
  </div>
</template>

<script>
import yBannerShow from "@components/global/y-banner-show"
import yFooter from "@components/global/y-footer"
import yHeader from "@components/global/y-header"
import yBreadcrumb from "@components/global/y-breadcrumb"
// import yTitle from "@components/global/y-title"

export default {
  name: "y-pagination",
  components: {
    "y-banner-show": yBannerShow,
    "y-header": yHeader,
    "y-breadcrumb": yBreadcrumb,
    "y-footer": yFooter
    // "y-title": yTitle
  },
  props: {
    ifBanner: {
      //是否展示banner
      type: Boolean,
      default: false
    },
    ifTitle: {
      //是否展示标题
      type: Boolean,
      default: true
    },
    ifBread: {
      //是否展示面包屑
      type: Boolean,
      default: true
    },
    // banner背景
    imgBannerSrcName: {
      type: String,
      default: "zhengwu@2x.png"
    },
    layoutWidth: {
      //框架内容宽度
      type: String,
      default: "1100"
    },
    // 面包屑
    breadcrumbList: {
      type: Array,
      default: function() {
        return [
          { path: "/", meta: { title: "首页" } }
        ]
      }
    },
    titleCont: {
      type: String,
      default: "个人修改密码"
    },
    moreType: {
      //是否必填
      type: Number, //默认不展示,默认1为链接,2为文字
      default: 2
    },
    footerTop: {
      type: String,
      default: "50"
    }
  },
  computed: {
    styleLayout() {
      return { width: this.layoutWidth + "px" }
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang='scss' scoped >
.container {
  // 中间部分宽度
  // .bread-crumb-wrap {
  //   background: #f2f6fc;
  //   .bread-crumb {
  //     width: 1100px;
  //     margin: 0 auto;
  //     ::v-deep.el-breadcrumb {
  //       line-height: 50px;
  //     }
  //   }
  // }
  .layout-box {
    // width: 1100px;
    margin: 0 auto;
  }
}
</style>


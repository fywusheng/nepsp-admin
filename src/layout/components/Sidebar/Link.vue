<template>
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from "@/utils/validate"

export default {
  props: {
    to: {
      type: String,
      required: true
    }
  },
  computed: {
    isExternal() {
      return isExternal(this.to)
    },
    type() {
      if (this.isExternal) {
        return "a"
      }
      return "router-link"
    }
  },
  methods: {
    linkProps(to) {
      //如果是完整外部网址链接 跳转外部窗口
      if (this.isExternal) {
        return {
          href: to,
          target: "_blank",
          rel: "noopener"
        }
      }
      return {
        //如果点击相同菜单，则跳转重定向路由 否则正常跳转
        to: this.$route.fullPath === to ? { name: "redirect", params: { path: to }} : to,
        replace: this.$route.fullPath === to
      }
    }
  }
}
</script>

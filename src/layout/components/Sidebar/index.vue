<template>
  <div :class="{'has-logo':showLogo}">
    <logo v-if="showLogo" :collapse="isCollapse" v-show='!showHeader' />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu :default-active="activeMenu" :collapse="isCollapse" :background-color="variables.menu_bg" :text-color="variables.menu_text" :unique-opened="false" :active-text-color="variables.menu_active_text" :collapse-transition="false" mode="vertical">
        <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Logo from "./Logo"
import SidebarItem from "./SidebarItem"
import variables from "@/styles/variables.scss"
import {getRouterList} from "@utils/getRouterList"
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebar"]),
    permission_routes() {
      const router = eval(process.env.VUE_APP_TEST_PERMISSION) ? getRouterList(this.$store.getters.menuList) : this.$router.options.routes
      // console.log("permission_routes -> router", router)
      return router
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo
    },
    showHeader() {
      return this.$store.state.settings.showHeader
    },
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

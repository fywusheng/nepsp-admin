<template>
  <section class="app-main" :class="{'header-app-main':showHeader}">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"  />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.path
    },
    showHeader() {
      return this.$store.state.settings.showHeader
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*50 = navbar  */
  background: #f4f6f9;
  min-height: calc(100vh - #{$navbar_height});
  width: 100%;
  position: relative;
  overflow: auto;
  &.header-app-main {
    min-height: calc(
      100vh - #{$navbar_height} - #{$header_height}
    );
  }
}
.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header + .app-main {
    padding-top: 84px;
  }
}
.el-submenu__title {
  height: 40px !important;
  line-height: 40px !important;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    // padding-right: 15px;
  }
}
</style>

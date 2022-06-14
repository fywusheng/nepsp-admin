<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">{{ title }} </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      logo: require("@pic/logo-new.png")
    }
  },
  computed: {
    title() {
      return this.$store.state.settings.title
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}
.left-logo .sidebar-logo-container{
  & .sidebar-logo-link {
    & .sidebar-title {
      font-size: $logo_ft_large;
    }
  }
}
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: $navbar_height;
  line-height: $navbar_height;
  background: $main_color;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    text-align: left;
    padding-left: 10px;

    & .sidebar-logo {
      width: 40px;
      height: 40px;
      vertical-align: middle;
      margin-right: 8px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: $navbar_height;
      font-size:  $logo_ft_small;
      //   font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
  &.top-header-box {
    //头部模块样式
    height: $header_height;
    line-height: $header_height;
    background: $main_color;
  }
}
</style>

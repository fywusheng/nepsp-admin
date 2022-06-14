<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu" v-show='!showHeader'>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper flex-c-s">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" v-if='avatar' class="user-avatar">
          <i v-else class="el-icon-user-solid user-avatar" />
          <span class='username'>{{$store.getters.name}}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Breadcrumb from "@/components/y-breadcrumb"
import Hamburger from "@/components/y-hamburger"

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
    showHeader() {
      return this.$store.state.settings.showHeader
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar")
    },
    async logout() {
      await this.$store.dispatch("user/logout")
      // this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      // 解决换号登录后 可能是没权限页面
      this.$router.push(`/login`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: $navbar_height;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    padding: 0px 8px 0 16px !important;
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 0;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: $second_text_color;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        height: $navbar_height;
        .username {
          position: relative;
          top: -1px;
          font-size: 14px;
          color: $main_text_color;
        }
        .user-avatar {
          cursor: pointer;
          margin-right: 8px;
          border-radius: 10px;
          font-size: 18px;
          position: relative;
          color: $main_text_color;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: calc(#{$navbar_height} / 2 - 10px);
          font-size: 16px;
          color: $fourth_text_color;
        }
      }
    }
  }
}
</style>

<template>
  <div class="navbar">
    <div class="left-logo">
      <logo />
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">

          <img :src="avatar+'?imageView2/1/w/80/h/80'" v-if='avatar' class="user-avatar">
          <i v-else class="el-icon-user-solid user-avatar" />
          <span class='username'>系统管理员</span>
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
import Logo from "@/layout/components/Sidebar/Logo"
export default {
  components: { Logo },
  computed: {
    ...mapGetters(["sidebar", "avatar"])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar")
    },
    async logout() {
      await this.$store.dispatch("user/logout")
      this.$router.push(`/login/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: $header_height;
  overflow: hidden;
  position: relative;
  background: $main_color;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  .sidebar-logo-container {
    width: 100%;
    height: $header_height;
    line-height: calc(#{$header_height} - 6px);
    background: $main_color;
    text-align: center;
    overflow: hidden;
  }
  .left-logo {
    float: left;
  }
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
    line-height: $header_height;

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
        margin-top: 5px;
        position: relative;
        top: -9px;
        height: $header_height;
        .username {
          position: relative;
          top: -1px;
          font-size: 14px;
          color: $white_color;
        }
        .user-avatar {
          cursor: pointer;
          margin-right: 8px;
          height: 40px;
          border-radius: 10px;
          font-size: 18px;
          position: relative;
          color: $white_color;
          top: 14px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: calc(#{$header_height} / 2 - 12px);
          font-size: 16px;
          color: $fourth_text_color;
        }
      }
    }
  }
}
</style>

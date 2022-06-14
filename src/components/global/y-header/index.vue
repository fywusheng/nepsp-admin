<template>
    <div class="header cf">
        <div class="layout clearfix">
            <div class="fl logo">
                <img :src="require('@pic/common/logo@2x.png')" class="logo-img" />
            </div>
            <a class="login-out fr">退出</a>
            <div class="login-btn-group fr">
                <!-- 未登录 -->
                <span class="link-login">
                    <img :src="require('@pic/login/zhanghao@2x.png')" class="img-login" />
                    <span v-if='loginStatus'>登录</span>
                    <span v-else>张**
                    </span>
                    <ul class="login-box-list">
                        <li>个人中心</li>
                        <li>我的消息</li>
                        <li>我的收藏</li>
                    </ul>
                </span>
            </div>
            <ul class="fr nav-list clearfix">
                <li v-for="(item,i) in list" :key='i' @click="activeMethod(i)">
                    <router-link :to="item.link">{{item.name}}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
export default {
  name: "y-header",
  props: {
    active: {
      // 设定哪一个内选择
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      // 是否登录
      loginStatus: false,
      // 索引
      // index: 0,
      list: [
        {
          link: "/",
          name: "首页"
        },
        {
          link: "/ServiceCatalog",
          name: "服务目录"
        },
        // {
        //   link: "/",
        //   name: "地方专区"
        // },
        {
          link: "/AnnouncementList",
          name: "政务中心"
        },
        {
          link: "/Communication",
          name: "互动交流"
        }
      ]
    }
  },
  created() {},
  methods: {
    activeMethod(i) {
      this.active = i
    }
  }
}
</script>

<style lang='scss' scoped>
.header {
    // overflow: hidden;
    height: 100px;
    width: 100%;
    box-shadow: 0px 7px 13px 0px rgba(0, 0, 0, 0.05);
    min-height: auto;
    .layout {
        width: 1260px;
        height: 100px;
        line-height: 100px;
        margin: 0 auto;
        .logo {
            display: inline;
            .logo-img {
                width: 338px;
                margin-top: 20px;
            }
        }
        .nav-list {
            line-height: 95px;
            margin-right: 60px;
            li {
                border-top: 5px solid transparent;
                float: left;
                font-size: 20px;
                margin-left: 48px;
                a {
                    color: #333;
                    font-weight: 600;
                }
                &.active a {
                    color: $main_color;
                }
                &.active {
                    border-top: 5px solid $main_color;
                }
                &:hover {
                    opacity: 0.7;
                    transition: all 0.3s linear;
                }
            }
        }
        .login-btn-group {
            position: relative;
            top: -2px;
            right: 9px;
            z-index: 99;
            margin-left: 52px;
            font-size: 13px;
            background: $white_color;
            color: $main_color;
            text-align: center;
            cursor: pointer;
            border-left: 1px solid transparent;
            border-right: 1px solid transparent;
            border-bottom: 1px solid transparent;
            &:hover {
                border-left: 1px solid rgba(235, 235, 235, 1);
                border-right: 1px solid rgba(235, 235, 235, 1);
                border-bottom: 1px solid rgba(235, 235, 235, 1);
                .login-box-list {
                    position: absolute;
                    left: -1px;
                    background: $white_color;
                    display: block !important;
                    border-left: 1px solid rgba(235, 235, 235, 1);
                    border-right: 1px solid rgba(235, 235, 235, 1);
                    border-bottom: 1px solid rgba(235, 235, 235, 1);
                    height: 120px;
                }
            }
            .link-login {
                border-top: 8px solid transparent;
                display: inline-block;
                &:hover {
                    border-top: 8px solid $main_color;
                }
                width: 90px;
                height: 100px;
                line-height: 81px;
                position: relative;
                //未登录
                font-size: 18px;
                .img-login {
                    position: relative;
                    top: 3px;
                    width: 20px;
                    margin-right: 10px;
                }
                .login-box-list {
                    display: none;
                    top: 53px;
                    z-index: 999;
                    li {
                        font-size: 14px;
                        color: $second_text_color;
                        width: 90px;
                        text-align: center;
                        height: 40px;
                        line-height: 40px;
                        &:hover {
                            color: $main_color;
                            background: $main_bg_color;
                        }
                    }
                }
            }

            // a {
            //   width: 50px;
            //   text-align: center;
            //   display: inline-block;
            //   color: #fff;
            //   &.login-btn {
            //     &::after {
            //       content: '';
            //       width: 1px;
            //       height: 13px;
            //       background-color: #fff;
            //       display: block;
            //       position: absolute;
            //       right: 0px;
            //       top: 11px;
            //       z-index: 1;
            //     }
            //   }
            // }
        }
        .login-out {
            font-size: 18px;
            margin-left: 20px;
            color: $main_color;
            line-height: 93px;
        }
    }
}
.title-box {
    font-size: 32px;
    line-height: 59px;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409eff;
}
.el-icon-arrow-down {
    font-size: 12px;
}
.box-menu {
    position: relative;
}
</style>
<style lang="css" scoped>
.header >>> .el-dropdown-menu {
    top: 39px;
    left: 19px;
}
</style>

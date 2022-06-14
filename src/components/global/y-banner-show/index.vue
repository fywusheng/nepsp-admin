<template>
  <div class="banner">
    <div class="des-box" :style='DesBoxStyle'>
      <div class="layout">
        <span class="banner-des" :style='BannerDesStyle'>{{imgDesName}}</span>
      </div>
    </div>
    <img :src="BannerImgSrcLink" class="banner-img" />
  </div>
</template>

<script>
export default {
  name: "y-bannershow",
  props: {
    bWidth: {//banner宽度
      type: String,
      default: "430"
    },
    bHeight: {//banner文字高度
      type: String,
      default: "40"
    },
    bMarginLeft: {//banner文字的左边距
      type: String,
      default: "0"
    },
    bFontSize: {//banner文字的大小
      type: String,
      default: "26"
    },
    imgDesName: {//描述图片的文字的图片
      type: String,
      default: ""
    },
    imgBannerSrcName: {//banner图片名称
      type: String,
      default: "list-icon-1.png"
    }

  },
  computed: {
    BannerImgSrcLink: function() {
      return ""
      // return require("@/assets/imgs/banner/" + this.imgBannerSrcName)
    },
    DesImgSrcLink: function() {
      return ""
      // return require("@/assets/imgs/banner/" + this.imgDesSrcName)
    },
    BannerDesStyle() {
      return {
        // width: (this.bWidth) + 'px',
        height: (this.bHeight) + "px",
        marginLeft: (this.bMarginLeft) + "px",
        fontSize: (this.bFontSize) + "px"
      }
    },
    DesBoxStyle() {
      return {
        height: (this.bHeight) + "px",
        marginTop: (-this.bHeight / 2) + "px"
      }
    }
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.banner {
  position: relative;
  .banner-img {
    width: 100%;
  }
  width: 100%;
  .des-box {
    width: 100%;
    height: 40px;
    position: absolute;
    top: 50%;
    margin-top: -20px;
  }
  .banner-des {
    color: #fff;
    // width: 430px;
    height: 26px;
    font-size: 26px;
    position: absolute;
    left: 0;
  }
  .layout {
    width: 1100px;
    margin: 0 auto;
    position: relative;
  }
}
</style>

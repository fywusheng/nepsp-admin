<template>
  <div class="footer" :style="footerStyle">
    <div class="cf cont clearfix">
      <img :src="require('@pic/common/footer-icon-office.png')" alt=" " class="fl jiguan ">
      <div class="text-block fl ">
        <p>
          <span class="first-line">国家医疗保障局&nbsp;&nbsp;|&nbsp;&nbsp;关于本网&nbsp;&nbsp;|&nbsp;&nbsp;网站声明&nbsp;&nbsp;|&nbsp;&nbsp;联系我们</span> <br />版权所有：国家医疗保障局 京ICP备8888888号-1<br />地址：北京市西城区月坛北小街2号</p>
      </div>
      <img :src="require('@pic/common/footer-icon-fault.png')" alt=" " class="search-fault ">
    </div>
  </div>
</template>
<script>
export default {
  name: "y-footer",
  props: {
    marginTop: {
      type: String,
      default: "50"
    }
  },
  computed: {
    footerStyle() {
      return {
        marginTop: (this.marginTop) + "px"
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.footer {
  border-top: 1px solid #dfe1e2; //门户版本
  margin-top: 50px;
  font-size: 15px;
  font-weight: 400;
  height: 154px;
  background: $main_text_color; //门户版本
  color: $third_text_color;
  text-align: left;
  line-height: 30px;
  min-height: auto;
  .cont {
    margin: 0 auto;
    padding-top: 30px;
    width: 855px;
  }
  .text-block {
    padding-right: 300px;
  }
  .jiguan {
    position: relative;
    top: 12px;
    margin-right: 27px;
    display: inline-block;
    width: 50px;
  }
  .search-fault {
    position: relative;
    top: 12px;
    width: 115px;
  }
}
</style>

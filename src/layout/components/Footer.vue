<template>
  <div class="footer-container">
    <span>Copyright@2020易联众民生（厦门）科技有限公司 闽ICP备 15XXXX89号</span>
  </div>
</template>
<script>
export default {

}
</script>
<style lang="scss" scoped>
.footer-container {
  height: $footer_height;
  background: $footer_bg_color;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    font-size: 14px;
    color: $third_text_color;
    line-height: 48px;
  }
}
</style>

<template>
  <div id="app">
    <!-- 页面切换容器 -->
    <router-view />
  </div>
</template>
<script>

export default {
  name: "app",
  data() {
    return {}
  }
}
</script>

<style lang="scss">
#app {
  height: 100%;
  .container-box {
    margin: 16px;
    background: #fff;
    padding: 16px;
    border-radius: 4px
  }
}
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
// 解决elementui表格头部与内容错位BUG
body .el-table th.gutter{
  display: table-cell!important;
}
</style>

<template>
  <div class="breadcrumb-container" :style='style'>
    <el-breadcrumb separator-class="el-icon-arrow-right" v-bind="$attrs" v-on="$listeners">
      <span class="fl pr-20 breadcrumb-tips">当前位置:</span>
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path" :to="{ path: item.path }" :class="index == breadcrumbList.length - 1?'current-breadcrumb':''">{{item.meta.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "y-breadcrumb",
  props: {
    breadcrumbList: {
      type: Array,
      default: function() {
        return [
          //面包屑数据格式
          { path: "/", meta: { title: "首页" } },
          { path: "/Title", meta: { title: "标题" } },
          { path: "", meta: { title: "信息展示" } }
        ]
      }
    },
    marginBottom: {
      type: String,
      default: "30"
    },
    marginTop: {
      type: String,
      default: "43"
    }
  },
  data() {
    return {}
  },
  watch: {},
  computed: {
    style() {
      return {
        marginBottom: this.marginBottom + "px",
        marginTop: this.marginTop + "px"
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss">
.breadcrumb-container.el-breadcrumb {
  display: inline-block;
  margin-left: 8px;
  min-height: auto;
  cursor: pointer;
}
.breadcrumb-container {
  .breadcrumb-tips {
    color: $third_text_color;
  }
}
.current-breadcrumb .el-breadcrumb__inner.is-link {
  color: $blue_color;
  cursor: text;
  padding-left: 10px;
}
.el-breadcrumb__inner a:hover,
.el-breadcrumb__inner.is-link:hover,
.el-breadcrumb__item:last-child .el-breadcrumb__inner,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a,
.el-breadcrumb__item:last-child .el-breadcrumb__inner a:hover,
.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
  color: $blue_color !important;
}
</style>

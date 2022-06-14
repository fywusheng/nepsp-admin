<template>
    <div class="gen-link-config mt-10">
        <div class="gen-link-config-head">
            当前通用链接
            <el-button v-if="selectable" size="small" class="mr10" @click="$emit('select')">选择</el-button>
        </div>
        <div class="gen-link-config-body">
            <el-tag type="primary" v-if="link && link.type">{{link.type | topicLinkType}}</el-tag>
            <el-tag v-else>未选择</el-tag>
            {{desc}}
        </div>
    </div>
</template>

<script>
import _ from "lodash"
export default {
  props: {
    link: Object,
    editable: Boolean,
    selectable: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      params: {}
    }
  },
  filters: {
    topicLinkType(value) {
      return ({
        item: "商品",
        topic: "专题",
        scheme: "协议",
        brand: "品牌",
        group: "商品组",
        url: "链接"
      })[value] || value
    }
  },
  methods: {

  },
  computed: {
    desc() {
      return _.get(this.link, "desc")
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
     @import "~@/styles/variables.scss";

.gen-link-config{
    position:relative;overflow:hidden;border:$border-base;font-size:12px;line-height:24px;
    &-head{
        overflow:hidden;padding:5px;border-bottom:$border-base;background:$color-light-gray;color:$border-color-hover;font-size:16px;
        .el-button{float:right;}
    }
    &-body{padding:10px;}

    .el-form-item{margin-bottom:10px;}
    .el-form-item__label{font-weight:bold;}
    .el-form-item__content{line-height:34px;}
    .el-form-item__content[style*="margin-left: 80px;"]{margin-left:80px!important;}
}
</style>

<template>
    <div></div>
</template>

<script>
import _ from "lodash"

export default {
  // content对象初始化的数据结构
  contentDefault: {},
  props: {
    value: Object
  },
  data() {
    return {
      content: null
    }
  },
  watch: {
    // 双向更新
    value: {
      deep: true,
      handler(value) {
        this.content = _.cloneDeep(value)
      }
    },
    content: {
      deep: true,
      handler(value) {
        if (JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit("input", value)
        }
      }
    }
  },
  created() {
    this.content = _.cloneDeep(this.value)
  }
}
</script>
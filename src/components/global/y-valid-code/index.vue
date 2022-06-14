<template>
  <div class="ValidCode disabled-select" :style="`width:${width}; height:${height}`" @click="refreshCode">
    <span v-for="(item, index) in codeList" :key="index" :style="getStyle(item)">{{item.code}}</span>
  </div>
</template>

<script>
export default {
  name: "y-valid-code",
  props: {
    width: {
      type: String,
      default: "120px"
    },
    height: {
      type: String,
      default: "50px"
    },
    length: {
      type: Number,
      default: 4
    },
    refresh: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      codeList: [],
      validCode: ""
    }
  },
  watch: {
    refresh(newVal, oldVal) {
      if (newVal) {
        this.refreshCode()
      }
    }
  },
  mounted() {
    this.createdCode()
  },
  methods: {
    refreshCode() {
      this.createdCode()
    },
    createdCode() {
      this.validCode = ""
      const len = this.length,
        codeList = [],
        chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789",
        charsLen = chars.length
      // 生成
      for (let i = 0; i < len; i++) {
        const rgb = [Math.round(Math.random() * 220), Math.round(Math.random() * 240), Math.round(Math.random() * 200)]
        const code = chars.charAt(Math.floor(Math.random() * charsLen))
        this.validCode += code
        codeList.push({
          code: code,
          color: `rgb(${rgb})`,
          fontSize: `2${[Math.floor(Math.random() * 10)]}px`,
          padding: `${[Math.floor(Math.random() * 10)]}px`,
          transform: `rotate(${Math.floor(Math.random() * 90) - Math.floor(Math.random() * 90)}deg)`
        })
      }
      // 指向
      this.codeList = codeList

      // 将当前数据派发出去
      this.$emit("validCodeChange", {"code": this.validCode, "refresh": false})
    },
    getStyle(data) {
      return `color: ${data.color}; font-size: ${data.fontSize}; padding: ${data.padding}; transform: ${data.transform}`
    }
  }
}
</script>

<style scoped lang="scss">
.ValidCode {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background: white;
  margin: 2px 0;
  span {
    display: inline-block;
  }
}
</style>
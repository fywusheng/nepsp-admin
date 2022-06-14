<template>
  <div class="ValidCode disabled-select" :style="`width:${width}; height:${height}`" @click="refreshCode">
    <img :src="codeImg" alt="">
  </div>
</template>

<script>
import { userApi } from "@/api"
export default {
  name: "y-validate-code",
  props: {
    width: {
      type: String,
      default: "110px"
    },
    height: {
      type: String,
      default: "48px"
    },
    refresh: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      codeImg: require("./icon-account-default-code.png"),
      isLoading: false //是否正在请求
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
      if (this.isLoading) { return }
      this.isLoading = true
      userApi.getCodeImage().then((res) => {
        this.isLoading = false
        this.codeImg = res.data.imgCode
        // 将当前数据派发出去
        this.$emit("validCodeChange", { "imgUid": res.data.imgUid, "refresh": false })
      }).catch(err => {
        this.isLoading = false
      })
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
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

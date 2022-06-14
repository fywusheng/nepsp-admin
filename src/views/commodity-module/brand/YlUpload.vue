<template>
    <div class="yl-upload">
        <el-upload
          class="avatar-uploader"
          :action="action"
          :file-list="fileList"
          :show-file-list="showFileList"
          :on-change="onChange"
          :on-success="handleImgAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :auto-upload="autoUpload">
          <slot></slot>
        </el-upload>
    </div>
</template>
<script>
import { clientUpload, clientFileUpload } from "@/api/pop/sys.js"
export default {
  name: "YlUpload",
  props: {
    fileType: {
      type: String,
      default: ""
    },
    action: {
      type: String,
      default: "/32423s"
    },
    showFileList: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    onSuccess: {
      type: Function,
      default: null
    },
    beforeUpload: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
          
    }
  },
  methods: {
    async onChange(file) {

      const fileName = file.name
      const fileExt = fileName.split(".").pop()

      if (fileExt == "xlsx") {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("fileName", fileName)
        formData.append("fileExt", fileExt)
        const result = await clientFileUpload(formData)
        if (result.code == 0) {
          this.$emit("on-success")
        } else {
          this.$emit("on-error")
        }
      } else {
        const base64String = await this.getBase64(file)
        const result = await clientUpload({
          base64String: base64String.split(",")[1],
          imageName: Date.now() + "." + fileName,
          imageExt: fileExt
        })
        if (result.code == 0) {
          this.onSuccess&&this.onSuccess(result, file)
        //   this.$emit("onSuccess", result, file)
        } else {
          this.$emit("on-error")
        }
      }
    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader()
        let imgResult = ""
        reader.readAsDataURL(file.raw)
        reader.onload = function() {
          imgResult = reader.result
        }
        reader.onerror = function(error) {
          reject(error)
        }
        reader.onloadend = function() {
          resolve(imgResult)
        }
      })
    },
    handleImgAvatarSuccess(response, file) {
      this.onSuccess&&this.onSuccess(response, file)
    },
    beforeAvatarUpload(file) {
      this.beforeUpload&&this.beforeUpload(file)
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
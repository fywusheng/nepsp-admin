<template>
<div>
  <el-upload
    v-bind="$attrs" v-on="$listeners"
    action="#"
    list-type="picture-card"
    :auto-upload="false">
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img
          class="el-upload-list__item-thumbnail"
          :src="file.url" alt=""
        >
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
  </el-upload>
  <el-dialog :visible.sync="dialogVisible" >
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
  </div>
</template>
<script>
export default {
  name: "uploadImg",
  props: {
    value: {
      default: []
    }
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false
    }
  },
  mounted() {
    this.$children[0].uploadFiles = this.value
    this.$emit("input", this.$children[0].uploadFiles)
  },
  methods: {
    handleRemove(file) {
      console.log(file)
      console.log(this.$children[0].uploadFiles)
      let removeIndex
      this.$children[0].uploadFiles.forEach((element, index) => {
        if (element.name === file.name){
          removeIndex = index
          return
        }
      })
      this.$children[0].uploadFiles.splice(removeIndex, 1)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload(file) {
      const filename = file.name
      const url = file.url
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")

      const aLink = document.createElement("a")
      aLink.download = filename
      aLink.style.display = "none"
      const img = new Image
      //设置跨域
      img.setAttribute("crossOrigin", "anonymous")
      img.src=url
      img.onload = function(){
        canvas.width = img.width
        canvas.height = img.height
        context.drawImage(img, 0, 0)
        aLink.href = canvas.toDataURL("image/jpeg")
        // 触发点击
        document.body.appendChild(aLink)
        aLink.click()
        // 然后移除
        document.body.removeChild(aLink)
      }
    }
  }
}
</script>
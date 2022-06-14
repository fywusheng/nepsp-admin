<template>
  <div :class="['box', imgLength < max ? '' : 'unUpload' ]">
     <el-upload ref="uploadImg" :file-list="imgList" :accept="accept" :action="uploadUrl" :on-change="imgChange" v-on="$listeners" v-bind="$attrs" list-type="picture-card" :auto-upload="autoUploadImg">
        <i slot="default" class="el-icon-plus"></i>
        <div slot="file" class="img-box" slot-scope="{file}">
          <img class="upload-img" :src="file.url" alt="图片" />
          <span class="el-upload-list__item-actions">
            <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
              <i class="el-icon-zoom-in"></i>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
              <i class="el-icon-download"></i>
            </span>
            <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
              <i class="el-icon-delete"></i>
            </span>
          </span>
        </div>
      </el-upload>
      <el-dialog append-to-body :visible.sync="dialogVisible" title="图片预览">
        <img class="preview-img" width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: "YUploadImg",
  props: {
    acceptTips: {
      type: String,
      default: "请上传正确格式图片"
    },
    accept: {
      type: String,
      default: "jpg,png,jpeg,gif"
    },
    max: {
      type: Number,
      default: 3
    },
    autoUploadImg: {
      type: Boolean,
      default: false
    },
    uploadUrl: {
      type: String,
      default: "#"
    },
    imgList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    imgList(val) {
      this.imgLength = val.length
    }
  },
  data() {
    return {
      dialogImageUrl: "", //图片URL
      dialogVisible: false, //预览图片
      disabled: false,
      imgLength: 0
    }
  },
  mounted() {
    this.imgLength = this.imgList.length
  },
  methods: {
    /**
     * @description: 移除图片
     * @param {*} file
     * @return {*}
     * @author: syx
     */
    handleRemove(file) {
      const fileList = this.$refs.uploadImg.uploadFiles
      let index = 0
      for (let i = 0; i< fileList.length; i++){
        const item = fileList[i]
        if (item.uid === file.uid) {
          index = i
          continue
        } 
      }
      this.$refs.uploadImg.uploadFiles.splice(index, 1)
      this.imgChange()
    },
    /**
     * @description: 预览图片
     * @param {*} file
     * @return {*}
     * @author: syx
     */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    /**
     * @description: 下载文件
     * @param {*} file
     * @return {*}
     * @author: syx
     */
    handleDownload(file) {
      this.downloadByUrl(file.url, file.name)
    },
    /**
     * @description: 图片改变
     * @param {*}
     * @return {*}
     * @author: syx
     */
    imgChange(file) {
      if (file&&file.name) {
        const nameArray = file.name.split(".")
        const suffix = nameArray[nameArray.length - 1]
        if (this.accept.indexOf(suffix) === -1) {
          this.handleRemove(file)
          this.$message.error(this.acceptTips)
        }
      }
      this.$nextTick(() => {
        this.imgLength = this.$refs.uploadImg.uploadFiles.length
        this.$emit("imgChange", this.imgLength)
      })
    },
    /**
     * @description: 获取图片列表
     * @param {*}
     * @return {*}
     * @author: syx
     */  
    getImgList(){
      return this.$refs.uploadImg.uploadFiles
    },
    /**
     * @description: 清空图片列表
     * @param {*}
     * @return {*}
     * @author: syx
     */  
    removeImgList() {
      if (this.$refs.uploadImg.uploadFiles.length === 0) { return }
      this.$refs.uploadImg.uploadFiles = []
      this.imgChange()
    },
    /**
     * @description: 通过URL下载图片
     * @param {*}
     * @return {*}
     * @author: syx
     */
    async downloadByUrl(url, name) {
      var base64Data = await this.convertUrlToBase64(url)
      this.downloadByBase64(base64Data, name)
    },
    /**
     * @description: 将URL转化为base64
     * @param {*} url
     * @return {*}
     * @author: syx
     */
    convertUrlToBase64(url) {
      return new Promise(function(resolve, reject) {
        var img = new Image()
        img.crossOrigin = "Anonymous"
        img.src = url
        img.onload = function() {
          var canvas = document.createElement("canvas")
          canvas.width = img.width
          canvas.height = img.height
          var ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0, img.width, img.height)
          var ext = img.src
            .substring(img.src.lastIndexOf(".") + 1)
            .toLowerCase()
          var dataURL = canvas.toDataURL("image/" + ext)
          resolve(dataURL)
        }
        img.onerror = function(e) {
          reject(e)
        }
      })
    },
    /**
     * @description: 通过base64下载图片
     * @param {*} base64Data
     * @param {*} name
     * @return {*}
     * @author: syx
     */
    downloadByBase64(base64Data, name) {
      var blob = this.convertBase64UrlToBlob(base64Data) // 转为blob对象
      // 下载
      if (this.myBrowser() === "IE") {
        window.navigator.msSaveBlob(blob, name)
      } else if (this.myBrowser() === "FF") {
        window.location.href = base64Data
      } else {
        var a = document.createElement("a")
        a.download = name
        a.href = URL.createObjectURL(blob)
        a.click()
      }
    },
    /**
     * @description: base64转化为 blob流
     * @param {*} base64
     * @return {*}
     * @author: syx
     */
    convertBase64UrlToBlob(base64) {
      var parts = base64.split(";base64,")
      var contentType = parts[0].split(":")[1]
      var raw = window.atob(parts[1])
      var rawLength = raw.length
      var uInt8Array = new Uint8Array(rawLength)
      for (var i = 0; i < rawLength; i++) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new Blob([uInt8Array], { type: contentType })
    },
    /**
     * @description: 浏览器判断
     * @param {*}
     * @return {*}
     * @author: syx
     */
    myBrowser() {
      var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
      if (userAgent.indexOf("OPR") > -1) {
        return "Opera"
      } //判断是否Opera浏览器 OPR/43.0.2442.991
      if (userAgent.indexOf("Firefox") > -1) {
        return "FF"
      } //判断是否Firefox浏览器  Firefox/51.0
      if (userAgent.indexOf("Trident") > -1) {
        return "IE"
      } //判断是否IE浏览器 Trident/7.0 rv:11.0
      if (userAgent.indexOf("Edge") > -1) {
        return "Edge"
      } //判断是否Edge浏览器 Edge/14.14393
      if (userAgent.indexOf("Chrome") > -1) {
        return "Chrome"
      } // Chrome/56.0.2924.87
      if (userAgent.indexOf("Safari") > -1) {
        return "Safari"
      } //判断是否Safari浏览器 AppleWebKit/534.57.2 Version/5.1.7 Safari/534.57.2
    }
  }
}
</script>

<style lang="scss" scoped>
//结果样本
.unUpload ::v-deep.el-upload--picture-card{
  display: none;
}
.img-box{
  width: 100%;
  height: 100%;
  position: relative;
  .upload-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    vertical-align: middle;
  }
}
.preview-img{
  width: 100%;
  max-height: calc(70vh - 40px);
  object-fit: contain;
}
</style>

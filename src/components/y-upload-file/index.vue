<template>
  <el-upload ref="uploadFile" :before-remove="beforeRemove" :accept="accept" v-on="$listeners" v-bind="$attrs" :file-list="fileList" class="upload-demo" action="#" :auto-upload="false" :on-remove="removeFile" :on-change="fileChange" :limit="max" :on-exceed="handleExceed">
    <el-button size="small"  :type="fileLength === max ? 'info' : 'primary'" @click="stopUpload">{{uploadText}}</el-button>
    <div slot="tip" class="el-upload__tip" v-show="tips">{{tips}}</div>
  </el-upload>
</template>
<script>
export default {
  name: "SyxUploadFile",
  props: {
    acceptTips: {
      type: String,
      default: "请上传符合要求的格式文件"
    },
    accept: {
      type: String,
      default: "*"
    },
    tips: {
      type: String,
      default: "请上传文件"
    },
    uploadText: {
      type: String,
      default: "点击上传"
    },
    max: {
      type: Number,
      default: 3
    },
    fileList: {
      type: Array,
      default: () => {
        return []
      }
    },
    deleteTips: {
      type: String,
      default: ""
    }
  },
  watch: {
    fileList(val) {
      this.fileLength = val.length
    }
  },
  data() {
    return {
      fileLength: 0
    }
  },
  created() {
    this.$nextTick(() => {
      this.fileLength = this.$refs.uploadFile.uploadFiles.length
    })
  },
  methods: {
    /**
     * @description: 文件个数更改
     * @param {*}
     * @return {*}
     * @author: syx
     */
    fileChange(file) {
      if (file&&file.name) {
        const nameArray = file.name.split(".")
        const suffix = nameArray[nameArray.length - 1]
        if (this.accept.indexOf(suffix) === -1) {
          const fileList = this.$refs.uploadFile.uploadFiles
          let index = 0
          for (let i = 0; i< fileList.length; i++){
            const item = fileList[i]
            if (item.uid === file.uid) {
              index = i
              continue
            } 
          }
          this.$refs.uploadFile.uploadFiles.splice(index, 1)
          this.fileChange()
          this.$message.error(this.acceptTips)
        }
      }
      this.$nextTick(() => {
        this.fileLength = this.$refs.uploadFile.uploadFiles.length
        this.$emit("fileChange", this.$refs.uploadFile.uploadFiles)
      })
    },
    /**
     * @description: 移除文件
     * @param {*}
     * @return {*}
     * @author: syx
     */
    removeFile(val){
      this.$nextTick(() => {
        this.fileLength = this.$refs.uploadFile.uploadFiles.length
        this.fileChange()
        this.$emit("remove", val)
      })
    },
    /**
     * @description: 数量够了 禁止下载
     * @param {*}
     * @return {*}
     * @author: syx
     */
    stopUpload() {
      if (this.max === this.fileLength) {
        //阻止冒泡
        if (event.stopPropagation) { 
          // 针对 Mozilla 和 Opera 
          event.stopPropagation()
        } else if (window.event) { 
          // 针对 IE 
          window.event.cancelBubble = true
        }
      }
    },
    /**
     * @description: 获取文件列表
     * @param {*}
     * @return {*}
     * @author: syx
     */  
    getFileList(){
      return this.$refs.uploadFile.uploadFiles
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择${this.max}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(this.deleteTips || `确定移除 ${ file.name }？`)
    }
  }
}
</script>


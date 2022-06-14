<template>
  <el-dialog
    class="dialog"
    :title="'批量导入卖场商品'"
    width="550px"
    :visible.sync="showDialog">
    <el-form
      class="data-form"
      :model="dataForm"
      ref="dataForm"
      label-width="150px"
      label-position="top"
      size="mini"
    >
      <div>
        <el-upload
        class="upload-demo"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-error="handleUploadFailure"
        multiple
        :limit="2"
        accept=".xlsx"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传.XLSX文件，且超过2M的文件会异步处理(约10分钟后导入)</div>
        </el-upload>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show(false)">取 消</el-button>
      <el-button type="success" :loading="sending" :disabled="sending" @click="save()">
        {{sending ?
        '正在保存...':'确 定'}}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { post } from "@/utils/http-client"

export default {
  name: "",
  data() {
    return {
      dialogTitle: "批量导入卖场商品",
      showDialog: false,
      sending: false,
      dialogVisible: false,
      fileList: [],
      dataForm: {
        planId: "",
        fileurl: ""
      }
    }
  },
  async mounted() {
  },
  methods: {
    show(flag, planId) {
      this.showDialog = flag
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      if (planId){
        this.dataForm.planId = planId
      }
      this.sending = false
    },
    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          const params = Object.assign({}, this.dataForm)
          const result = await post("/marketing/salesplanning/item.upload", params)
          //alert(JSON.stringify(this.dataForm))
          this.sending = false
          if (result.code === "200") {
            this.show(false)
            this.$message.success(result.msg)
            this.$parent.loadData()
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
    },
    handleAvatarSuccess(response, file, fileList) {
      if (response.code == 0){
        this.dataForm.fileurl = response.data.absoluteUrl
      }
    },
    handleUploadFailure(err, file, fileList){
      alert(1)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error("文件大小不能超过10MB!")
      }
      return isLt2M
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">

</style>

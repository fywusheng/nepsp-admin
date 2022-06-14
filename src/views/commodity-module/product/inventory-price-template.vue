<template>
  <el-dialog
    class="dialog"
    :title="dialogTitle"
    width="550px"
    :visible.sync="showDialog">
    <el-form
      class="data-form"
      :model="dataForm"
      :rules="dataRules"
      ref="dataForm"
      label-width="150px"
      label-position="top"
      size="mini"
    >
      <div>
          <el-form-item label="变更名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入本次变更名称..." style="width:100%"/>
          </el-form-item>
          <el-form-item label="变更描述" prop="description">
              <el-input v-model="dataForm.description" placeholder="请输入本次变更描述..." style="width:100%"/>
          </el-form-item>
          <el-form-item label="变更文件" prop="fileUrl">
            <el-upload
            class="upload-demo"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleUploadFailure"
            multiple
            :limit="1"
            accept=".xlsx"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传.XLSX文件，且超过2M的文件会异步处理(约10分钟后导入)</div>
            </el-upload>
          </el-form-item>
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
      dialogTitle: "导入批量库存",
      showDialog: false,
      sending: false,
      dialogVisible: false,
      fileList: [],
      dataForm: {
        name: "",
        description: "",
        bizType: "",
        fileName: "",
        fileUrl: ""
      },
      dataRules: {
        name: [{required: true, message: "变更申请名称不能为空，请完整输入！", trigger: "blur"}],
        fileUrl: [{required: true, message: "变更文件不能为空，请选择导入！", trigger: "blur"}]
      }
    }
  },
  async mounted() {
  },
  methods: {
    show(flag, bizType) {
      this.showDialog = flag
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      this.sending = false
      this.dataForm.name = ""
      this.dataForm.description = ""
      this.dataForm.fileUrl = ""
      this.dataForm.fileName = ""
      this.dataForm.bizType = bizType
      this.dialogTitle = "1000"== bizType?"导入批量库存":"2000"== bizType?"导入批量价格":""
    },
    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          const params = Object.assign({}, this.dataForm)
          const result = await post("/product/inventory-price-update.import", params)
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
        this.dataForm.fileUrl = response.data.absoluteUrl
        this.dataForm.fileName = file.name
      }
    },
    handleUploadFailure(err, file, fileList){

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

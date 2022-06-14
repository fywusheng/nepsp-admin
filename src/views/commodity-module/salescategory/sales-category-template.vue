<template>
  <el-dialog
    class="dialog"
    :title="dataForm.id ? '编辑展示类目':'创建展示类目'"
    width="600px"
    :visible.sync="showDialog"
  >
    <el-form
      class="data-form"
      :model="dataForm"
      :rules="dataRules"
      ref="dataForm"
      label-width="150px"
      label-position="top"
      size="small"
    >
      <el-form-item label="类目名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入展示类目名称..." style="width:100%" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="上级类目" prop="parentName">
        <el-input v-model="dataForm.parentName" disabled style="width:100%" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="类目LOGO" prop="iconUrl">
        <yl-upload
        class="avatar-uploader"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :auto-upload="false">
        <img v-if="dataForm.iconUrl" :src="dataForm.iconUrl" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </yl-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hideDialog()">取 消</el-button>
      <el-button type="success" :loading="sending" :disabled="sending" @click="save">
        {{sending ?
        '正在保存...':'确 定'}}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { fetch, post } from "@/utils/http-client"
export default {
  name: "",
  data() {
    return {
      dialogTitle: "新增类目",
      showDialog: false,
      sending: false,
      dialogVisible: false,
      disabled: false,
      dataForm: {
        name: "",
        parentId: 2,
        iconUrl: "",
        parentName: "展示类目",
        parentCode: "S"
      },
      dataRules: {
        name: [
          {
            required: true,
            message: "类目名称不能为空，请输入！",
            trigger: "blur"
          }
        ]
      }
    }
  },
  async mounted() {},
  methods: {
    showAdd(flag, data) {
      this.showDialog = flag
      if (data && data.id){
        this.dataForm.id = ""
        this.dataForm.name = ""
        this.dataForm.iconUrl = ""
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.name
        this.dataForm.parentCode = data.code
      } else {
        this.$nextTick(() => {
          this.dataForm.id = ""
          this.dataForm.name = ""
          this.dataForm.iconUrl = ""
          this.dataForm.parentId = 2
          this.dataForm.parentName = "展示类目"
          this.dataForm.parentCode = "S"
        })
      }
      this.$refs.dataForm.resetFields()
    },

    showEdit(flag, data){
      this.showDialog = flag
      if (flag && data && data.id) {
        this.loadData(data.id)
      } else {
        this.$message.error("请求参数错误！")
        this.showDialog = false
      }
      this.$refs.dataForm.resetFields()
    },

    hideDialog(){
      this.showDialog = false
    },

    async loadData(id) {
      const result = await fetch("/category/get.sales", { id: id })
      if (result.code === "200") {
        this.dataForm.id = result.data.id,
        this.dataForm.name = result.data.name,
        this.dataForm.code = result.data.code,
        this.dataForm.iconUrl = result.data.iconUrl,
        this.dataForm.parentId = result.data.parent.id,
        this.dataForm.parentName = result.data.parent.name,
        this.dataForm.parentCode = result.data.parent.code

      } else {
        this.$message.error(result.msg)
      }
    },
    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          const params = Object.assign({}, this.dataForm)
          const url = this.dataForm.id?"/category/update.sales":"/category/add.sales"
          const result = await post(url, params)
          this.sending = false
          if (result.code === "200") {
            this.hideDialog()
            this.$message.success(result.msg)
            this.$emit("change")
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
    },

    handleAvatarSuccess(response, file) {
      if (response.code != 0){
        return
      }
      this.dataForm.iconUrl = response.data.absoluteUrl
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === "image/jpeg"
      const isLt2M = file.size / 1024 / 1024 < 3
      // if (!isJPG) {
      //   this.$message.error("上传头像图片只能是 JPG 格式!")
      // }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 3MB!")
      }
      return isLt2M
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .avatar-uploader .el-upload {
    border: 0.5px dashed #5f5d5d;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #609df3;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 150px;
    display: block;
  }
</style>

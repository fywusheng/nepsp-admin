<template>
  <el-dialog
    class="dialog"
    :title="dataForm.id ? '编辑品牌信息':'创建品牌信息'"
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
      <el-form-item label="品牌名称(中文)" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入品牌中文名称..." style="width:100%" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="品牌名称(英文)" prop="nameEn">
        <el-input v-model="dataForm.nameEn" placeholder="请输入品牌英文名称..." style="width:100%" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="品牌描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="请输入品牌描述..." style="width:100%" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="品牌LOGO" prop="brandLogo">
        <yl-upload
          class="avatar-uploader"
          file-type="img"
          :show-file-list="false"
          :on-success="handleLogoAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :auto-upload="false">
          <img v-if="dataForm.brandLogo" :src="dataForm.brandLogo" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </yl-upload>
      </el-form-item>
      <el-form-item label="品牌形象图" prop="brandImage">
        <yl-upload
          class="avatar-uploader"
          :show-file-list="false"
          :on-success="handleImgAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :auto-upload="true">
          <img v-if="dataForm.brandImage" :src="dataForm.brandImage" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </yl-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="default" @click="show(false)">取 消</el-button>
      <el-button type="success" :loading="sending" :disabled="sending" @click="save">
        {{sending ?
        '正在保存...':'确 定'}}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import { fetch, post } from "@/utils/http-client"
// import YlUpload from "./YlUpload.vue"
export default {
  name: "",
  // components: { YlUpload },
  data() {
    return {
      dialogTitle: "新增品牌",
      showDialog: false,
      sending: false,
      disabled: false,
      dataForm: {
        name: "",
        nameEn: "",
        brandLogo: "",
        brandImage: "",
        description: ""
      },
      dataRules: {
        name: [
          {
            required: true,
            message: "品牌名称不能为空，请输入！",
            trigger: "blur"
          }
        ]
      }
    }
  },
  computed: {

  },
  async mounted() {
    if (this.$route.params.id) {
      //this.loadData()
    }
  },
  methods: {
    show(flag, data) {
      this.showDialog = flag
      if (flag && data) {
        this.loadData(data.id)
      }
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
        this.dataForm.id = ""
        this.dataForm.brandLogo = ""
        this.dataForm.brandImage = ""
      })
    },
    async loadData(id) {
      const result = await fetch("/brand/get", { id: id })
      if (result.code === "200") {
        const brand = {
          id: result.data.id,
          name: result.data.name,
          nameEn: result.data.nameEn,
          brandLogo: result.data.brandLogo,
          brandImage: result.data.brandImage,
          description: result.data.description
        }
        this.dataForm = brand
      } else {
        this.$message.error(result.msg)
      }
    },
    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          const params = Object.assign({}, this.dataForm)
          const url = this.dataForm.id?"/brand/update":"/brand/add"
          const result = await post(url, params)
          this.sending = false
          if (result.code === "200") {
            this.show(false)
            this.$message.success("创建品牌成功！")
            this.$parent.loadData()
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
    },

    handleLogoAvatarSuccess(response, file) {
      if (response.code != "0"){
        return
      }
      this.dataForm.brandLogo = response.data.absoluteUrl
    },
    handleImgAvatarSuccess(response, file) {
      if (response.code != "0"){
        return
      }
      this.dataForm.brandImage = response.data.absoluteUrl
    },
    beforeAvatarUpload(file) {
      const isJPEG = file.name.split(".")[1] === "jpeg"
      const isJPG = file.name.split(".")[1] === "jpg"
      const isPNG = file.name.split(".")[1] === "png"
      const isLt500K = file.size / 1024 / 2000 < 2
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error("上传图片只支持上传JPG/PNG格式!")
      }
      if (!isLt500K) {
        this.$message.error("单张图片大小不能超过2MB!")
      }
      return (isJPEG || isJPG || isPNG) && isLt500K
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.hide .el-upload--picture-card {
  display: none;
}

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

<template>
  <el-dialog
    class="dialog"
    :title="dataForm.id ? '编辑基础类目':'创建基础类目'"
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
        <el-input v-model="dataForm.name" placeholder="请输入基础类目名称..." style="width:100%" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="上级类目" prop="parentName">
        <el-input v-model="dataForm.parentName" disabled style="width:100%" maxlength="32"></el-input>
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
        parentId: 1,
        parentName: "基础类目",
        parentCode: "B"
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
  async mounted() {

  },
  methods: {
    showAdd(flag, data) {
      this.showDialog = flag
      if (data && data.id){
        this.dataForm.id = ""
        this.dataForm.name = ""
        this.dataForm.parentId = data.id
        this.dataForm.parentName = data.name
        this.dataForm.parentCode = data.code
      } else {
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
        })
      }
    },

    showEdit(flag, data){
      this.showDialog = flag
      if (flag && data && data.id) {
        this.loadData(data.id)
      } else {
        this.$message.error("请求参数错误！")
        this.showDialog = false
      }
    },

    hideDialog(){
      this.showDialog = false
    },

    async loadData(id) {
      const result = await fetch("/category/get", { id: id })
      if (result.code === "200") {
        this.dataForm.id = result.data.id,
        this.dataForm.name = result.data.name,
        this.dataForm.code = result.data.code,
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
          const url = this.dataForm.id?"/category/update":"/category/add"
          const result = await post(url, params)
          this.sending = false
          if (result.code === "200") {
            this.hideDialog()
            this.$message.success(result.msg)
            this.$emit("change", params)
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">

</style>

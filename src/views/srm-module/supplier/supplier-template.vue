<template>
  <el-dialog
    class="dialog"
    :title="dataForm.id ? '修改商家信息':'新增商家信息'"
    width="550px"
    :visible.sync="showDialog">
    <el-form
      class="data-form"
      :model="dataForm"
      :rules="dataRules"
      ref="dataForm"
      label-width="150px"
      label-position="top"
      size="small"
    >
      <el-form-item label="商家名称" prop="supplierName">
        <el-input v-model="dataForm.supplierName" placeholder="请输入商家名称..." maxlength="64" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="商家描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="请输入商家描述..." maxlength="60" type="textarea" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="dataForm.companyName" placeholder="请输入公司名称..." maxlength="64" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="公司电话" prop="companyPhone">
        <el-input v-model="dataForm.companyPhone" placeholder="请输入联系电话..."  maxlength="256" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="负责人" prop="companyOwner">
        <el-input v-model="dataForm.companyOwner" placeholder="请输入商家负责人..."  maxlength="256" style="width:100%"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show(false)">取 消</el-button>
      <el-button type="primary" :loading="sending" :disabled="sending" @click="save">
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
      dialogTitle: "新增商家",
      showDialog: false,
      sending: false,
      dialogVisible: false,
      dataForm: {
        supplierName: "",
        description: "",
        companyName: "",
        companyOwner: "",
        companyPhone: "",
        businessCertificatesNo: ""
      },
      dataRules: {
        supplierName: [{required: true, message: "商家名称不能为空，请输入！", trigger: "blur"}],
        companyName: [{required: true, message: "公司名称不能为空，请选择！", trigger: "blur"}],
        companyPhone: [{required: true, message: "联系电话不能为空，请选择！", trigger: "blur"}],
        companyOwner: [{required: true, message: "商家负责人不能为空，请输入！", trigger: "blur"}]
      }
    }
  },
  async mounted() {
  },
  methods: {
    show(flag, data) {
      this.showDialog = flag
      if (flag && data) {
        this.loadData(data.id)
      }
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
    },
    async loadData(id) {

    },
    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          const params = Object.assign({}, this.dataForm)
          const result = await post("/srm/supplier/add", params)
          this.sending = false
          if (result.code == 200) {
            this.show(false)
            this.$message.success("创建商家成功！")
            this.$parent.loadData()
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
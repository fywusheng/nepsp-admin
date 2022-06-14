<template>
  <el-dialog
    class="dialog"
    :title="dataForm.id ? '编辑属性':'创建属性'"
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
      <el-form-item label="属性名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入属性名称..." style="width:100%" maxlength="32"></el-input>
      </el-form-item>
      <el-form-item label="是否规格属性" prop="specsState">
        <template>
        <el-radio-group v-model="dataForm.specsState" :disabled="editState">
            <el-radio :label="0">普通属性</el-radio>
            <el-radio :label="1">销售规格</el-radio>
        </el-radio-group>
        </template>
      </el-form-item>
      <el-form-item label="属性类型" prop="type">
        <el-radio-group :disabled="editState" v-model="dataForm.type">
            <el-radio :label="0" :disabled="dataForm.specsState===1">单选</el-radio>
            <el-radio :label="1">多选</el-radio>
            <el-radio :label="2" :disabled="dataForm.specsState===1">文本</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show(false)">取 消</el-button>
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
      dialogTitle: "新增属性",
      showDialog: false,
      sending: false,
      dialogVisible: false,
      editState: false,
      dataForm: {
        name: "",
        type: "",
        specsState: ""
      },
      dataRules: {
        name: [
          {
            required: true,
            message: "属性名称不能为空，请输入！",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            message: "属性类型不能为空，请选择！",
            trigger: "blur"
          }
        ],
        specsState: [
          {
            required: true,
            message: "是否是规格属性不能为空，请选择！",
            trigger: "blur"
          }
        ]
      }
    }
  },
  async mounted() {
    if (this.$route.params.id) {
      //this.loadData()
    }
  },
  methods: {
    show(flag, data) {
      this.showDialog = flag
      if (flag && data && data.id) {
        this.loadData(data.id)
      } else {
        this.dataForm.id = ""
        this.editState = false
      }
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
    },
    async loadData(id) {
      const result = await fetch("/attr/getByPk", { id: id })
      if (result.code === "200") {
        const dataForm = {
          id: result.data.id,
          name: result.data.name,
          type: result.data.type,
          specsState: result.data.specsState
        }
        this.dataForm = dataForm
        if (this.dataForm.id){
          this.editState = true
        }
      } else {
        this.$message.error(result.msg)
      }
    },
    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          const params = Object.assign({}, this.dataForm)
          const url = this.dataForm.id ? "/attr/update" : "/attr/add"
          const result = await post(url, params)
          this.sending = false
          if (result.code === "200") {
            this.show(false)
            this.$message.success("保存属性信息成功！")
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

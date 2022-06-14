<template>
  <el-dialog
    class="dialog"
    :title="dataForm.id ? '编辑属性值':'创建属性值'"
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
      <el-form-item label="属性值" prop="val">
        <el-input v-model="dataForm.val" placeholder="请输入属性值..." style="width:100%" maxlength="32"></el-input>
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
      dialogTitle: "新增属性值",
      showDialog: false,
      sending: false,
      dialogVisible: false,
      disabled: false,
      dataForm: {
        val: "",
        attrId: ""
      },
      dataRules: {
        val: [
          {
            required: true,
            message: "属性值不能为空，请输入！",
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
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
      this.dataForm.attrId = data
    },
    async loadData(id) {
      const result = await fetch("/attr/getValByPK", { id: id })
      if (result.code === "200") {
        const dataForm = {
          id: result.data.id,
          val: result.data.val
        }
        this.dataForm = dataForm
      } else {
        this.$message.error(result.msg)
      }
    },
    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          const params = Object.assign({}, this.dataForm)
          const url = this.dataForm.id ? "/attr/updateAttrVal" : "/attr/addAttrVal"
          const result = await post(url, params)
          this.sending = false
          if (result.code === "200") {
            this.show(false)
            this.$message.success("保存属性值成功！")
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
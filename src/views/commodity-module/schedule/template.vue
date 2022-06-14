<template>
  <el-dialog
    class="dialog"
    :title="dataForm.id ? '编辑卖场信息':'创建卖场信息'"
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
      <el-form-item label="卖场名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入卖场名称..." maxlength="64" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="生效时间" prop="activityTime">
        <div>
            <el-date-picker
            type="datetimerange"
            size="small"
            v-model="dataForm.activityTime"
            :default-time="['00:00:00', '23:59:59']"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:100%"
            >
            </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="卖场描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="请输入卖场描述..."  maxlength="256" type="textarea" style="width:100%"></el-input>
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
      dialogTitle: "新增卖场信息",
      showDialog: false,
      sending: false,
      dialogVisible: false,
      dataForm: {
        id: "",
        name: "",
        activityTime: [],
        startTime: "",
        endTime: "",
        description: ""
      },
      dataRules: {
        name: [{required: true, message: "卖场名称不能为空，请输入！", trigger: "blur"}],
        activityTime: [{required: true, message: "卖场生效时间不能为空，请选择！", trigger: "blur"}]
      }
    }
  },
  async mounted() {
  },
  methods: {
    show(flag, data) {
      this.showDialog = flag
      if (flag && data && data.id) {
        this.loadData(data.id)
      } else {
        this.dataForm.id = ""
        this.dataForm.name = ""
        this.dataForm.activityTime = []
        this.dataForm.description = ""
        this.$nextTick(() => {
          this.$refs.dataForm.resetFields()
        })
      }
    },
    async loadData(id) {
      const result = await fetch("/marketing/salesplanning/get", {id: id})
      if (result&&result.code==200){
        this.dataForm.id = result.data.id
        this.dataForm.name = result.data.name
        if (result.data.startTime&&result.data.endTime){
          this.dataForm.activityTime.unshift(result.data.startTime)
          this.dataForm.activityTime.push(result.data.endTime)
        }
        this.dataForm.description = result.data.description
      } else {
        this.$message.error(result.msg)
      }
    },
    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.dataForm.startTime = this.dataForm.activityTime[0]
          this.dataForm.endTime = this.dataForm.activityTime[1]
          this.sending = true
          const params = Object.assign({}, this.dataForm)
          const url = this.dataForm.id?"/marketing/salesplanning/update":"/marketing/salesplanning/add"
          const result = await post(url, params)
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
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">

</style>

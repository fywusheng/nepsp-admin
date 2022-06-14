<template>
  <el-dialog
    class="dialog"
    :title="dataForm.id ? '编辑促销活动':'创建促销活动'"
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
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入活动名称..." maxlength="64" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="活动类型" prop="type">
        <template>
        <el-radio-group v-model="dataForm.type">
            <!-- <el-radio :label="0">平台促销</el-radio> -->
            <el-radio :label="1">优惠券</el-radio>
        </el-radio-group>
        </template>
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
      <el-form-item label="活动描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="请输入活动描述..."  maxlength="256" type="textarea" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="发起部门" prop="owner">
        <el-input v-model="dataForm.owner" placeholder="请输入活动所属部门..." maxlength="60" style="width:100%"></el-input>
      </el-form-item>
      <el-form-item label="活动用途" prop="purpose">
        <el-input v-model="dataForm.purpose" placeholder="请输入活动用途..." maxlength="120" style="width:100%"></el-input>
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
import { post } from "@/utils/http-client"

export default {
  name: "",
  data() {
    return {
      dialogTitle: "新增促销活动",
      showDialog: false,
      sending: false,
      dialogVisible: false,
      dataForm: {
        name: "",
        type: 1,
        activityTime: "",
        beginTime: "",
        endTime: "",
        description: "",
        owner: "",
        purpose: ""
      },
      dataRules: {
        name: [{required: true, message: "促销活动名称不能为空，请输入！", trigger: "blur"}],
        type: [{required: true, message: "活动类型不能为空，请选择！", trigger: "blur"}],
        activityTime: [{required: true, message: "活动生效时间不能为空，请选择！", trigger: "blur"}],
        owner: [{required: true, message: "活动发起部门不能为空，请输入！", trigger: "blur"}],
        purpose: [{required: true, message: "促销活动用途不能为空，请输入！", trigger: "blur"}]
      }
    }
  },
  async mounted() {},
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
          this.dataForm.beginTime = this.dataForm.activityTime[0]
          this.dataForm.endTime = this.dataForm.activityTime[1]
          this.sending = true
          const params = Object.assign({}, this.dataForm)
          const result = await post("/marketing/promotion/activity/add", params)
          this.sending = false
          if (result.code == 200) {
            this.show(false)
            this.$message.success("创建活动成功！")
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

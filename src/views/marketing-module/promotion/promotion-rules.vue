<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" content="活动规则配置"></el-page-header>
    <el-row style="height: 20px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-form
      class="data-form"
      :model="dataForm"
      :rules="dataRules"
      ref="dataForm"
      label-position="top"
      size="small"
    >
    <el-divider content-position="left" style="width:80%">
      <i class="el-icon-postcard"></i>&nbsp;基本信息
    </el-divider>
      <table width="100%">
        <tr>
          <td width="10%"></td>
          <td width="50%">
            <el-form-item label="活动名称:" prop="name">
              <el-input v-model="dataForm.name" placeholder="请输入活动名称..." :disabled="dataForm.auditState==1" maxlength="64" style="width:60%"></el-input>
            </el-form-item>
          </td>
          <td width="40%">
            <el-form-item label="活动编码:">
              <el-input v-model="dataForm.code" disabled placeholder="请输入活动编码..." maxlength="64" style="width:70%"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="10%"></td>
          <td width="50%">
            <el-form-item label="活动类型:" prop="type">
              {{dataForm.typeLabel}}
            </el-form-item>
          </td>
          <td width="40%">
            <el-form-item label="生效时间:" prop="activityTime">
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
                style="width:70%"
                :disabled="dataForm.auditState==1"
                >
                </el-date-picker>
            </div>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="10%"></td>
          <td width="50%">
            <el-form-item label="发放方式" prop="gettingMethod">
                <template>
                <el-radio-group v-model="dataForm.gettingMethod" :disabled="dataForm.auditState==1">
                    <el-radio :label="0">系统发放</el-radio>
                    <el-radio :label="1">会员领取</el-radio>
                </el-radio-group>
                </template>
            </el-form-item>
          </td>
          <td width="40%">
            <el-form-item label="发放(领取)时间" prop="sendTime">
              <div>
                  <el-date-picker
                  type="datetimerange"
                  size="small"
                  v-model="dataForm.sendTime"
                  :default-time="['00:00:00', '23:59:59']"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  style="width:70%"
                  :disabled="dataForm.auditState==1"
                  >
                  </el-date-picker>
              </div>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="10%"></td>
          <td width="50%">
            <el-form-item label="发起(成本)部门:" prop="owner">
              <el-input v-model="dataForm.owner" placeholder="请输入活动成本归属部门..." :disabled="dataForm.auditState==1" maxlength="64" style="width:60%"></el-input>
            </el-form-item>
          </td>
          <td width="40%">
            <el-form-item label="活动(目的)用途:" prop="purpose">
              <el-input v-model="dataForm.purpose" placeholder="请输入活动用途或目标..." :disabled="dataForm.auditState==1" maxlength="64" style="width:70%"></el-input>
            </el-form-item>
          </td>
        </tr>
      </table>
      <div>
      <el-divider content-position="left">
        <i class="el-icon-postcard"></i>&nbsp;关联优惠券
      </el-divider>
      <table width="100%">
        <tr>
          <td width="10%"></td>
          <td width="90%">
               <el-button type="default" size="mini" @click="addCoupons" :disabled="dataForm.auditState==1">导入优惠券</el-button>
          </td>
        </tr>
        <tr>
          <td width="10%"></td>
          <td width="90%">
            <el-divider content-position="left"></el-divider>
            <div>
            <el-table v-if="dataForm.activityCoupons" ref="couponList" :data="dataForm.activityCoupons" style="width:90%;font-size:12px">
              <el-table-column type="index" label="序号" align="center" width="100px"></el-table-column>
              <el-table-column prop="name" label="券名称"></el-table-column>
              <el-table-column prop="code" label="券编码"></el-table-column>
              <el-table-column prop="type" label="券类型" :formatter="formatCouponType"></el-table-column>
              <el-table-column prop="name" label="券面值"></el-table-column>
              <el-table-column prop="num" label="发放数量"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-link
                    icon="el-icon-view"
                    :underline="false"
                    @click="removeCoupon(scope.$index)"
                    :disabled="dataForm.auditState==1"
                    >移除</el-link>
                </template>
              </el-table-column>
            </el-table>
            </div>
          </td>
        </tr>
      </table>
      </div>
      <el-divider content-position="left">
        <i class="el-icon-postcard"></i>&nbsp;应用范围
      </el-divider>
      <table width="100%">
        <tr>
          <td width="10%"></td>
          <td width="25%">
            <el-form-item label="适用会员:" prop="usersScope">
            <template>
              <el-radio-group v-model="dataForm.usersScope">
                  <el-radio :label="0" :disabled="dataForm.gettingMethod==0" style="display:block;height:40px">所有会员适用</el-radio>
                  <el-radio :label="1" style="display:block;height:40px">指定会员适用</el-radio>
                  <el-radio :label="2" style="display:block;height:40px">指定会员禁用</el-radio>
              </el-radio-group>
            </template>
            </el-form-item>
          </td>
          <td width="65%" style="align:left">
            <template v-if="dataForm.usersScope===1">
              <el-link type="primary" @click="addUsers(1)"><i class="el-icon-circle-plus">&nbsp;&nbsp;导入适用会员列表</i></el-link>
            </template>
            <template v-if="dataForm.usersScope===2">
              <el-link type="primary" @click="addUsers(2)"><i class="el-icon-circle-plus">&nbsp;&nbsp;导入禁用会员列表</i></el-link>
            </template>
          </td>
        </tr>
      </table>
    <coupon-edit-template ref="coupontemplate" v-on:addCouponList="addCouponList"></coupon-edit-template>
    <user-edit-template ref="usertemplate"></user-edit-template>
    </el-form>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <el-row type="flex" style="height:30px;text-align:center">
        <el-col :span="24">
        <el-button @click="back2Prev">返回列表</el-button>
        <el-button
          v-if="dataForm.auditState!=1"
          type="success"
          :loading="sending"
          :disabled="sending"
          @click="save"
        >{{ sending ? '正在保存...' : '提交审核' }}</el-button>
        </el-col>
      </el-row>
  </div>
</template>
<script>
import { fetch, post } from "@/utils/http-client"
import CouponEditTemplate from "./promotion-coupon-list"
import UserEditTemplate from "./promotion-rules-users"

export default {
  components: {
    CouponEditTemplate,
    UserEditTemplate
  },
  name: "",
  data() {
    var validatorActivityCoupons = (rule, value, callback) => {
      if (this.activityCoupons.length==0){
        return callback(new Error("活动优惠券不能为空，请选择..."))
      } else {
        return callback()
      }
    }

    return {
      dialogTitle: "配置促销活动规则",
      sending: false,
      dataForm: {
        id: "",
        name: "",
        code: "",
        type: "",
        typeLabel: "",
        activityTime: [],
        sendTime: [],
        gettingMethod: 1,
        usersScope: "",
        owner: "",
        purpose: "",
        activityCoupons: []
      },
      dataRules: {
        name: [{required: true, message: "促销活动名称不能为空，请输入！", trigger: "blur"}],
        type: [{required: true, message: "活动类型不能为空，请选择！", trigger: "blur"}],
        activityTime: [{required: true, message: "活动生效时间不能为空，请选择！", trigger: "blur"}],
        owner: [{required: true, message: "活动发起部门不能为空，请输入！", trigger: "blur"}],
        purpose: [{required: true, message: "促销活动用途不能为空，请输入！", trigger: "blur"}],
        sendTime: [{required: true, message: "优惠券发放时间不能为空，请选择！", trigger: "blur"}],
        gettingMethod: [{required: true, message: "优惠券发放方式不能为空，请选择！", trigger: "blur"}],
        activityCoupons: [{required: true, validator: validatorActivityCoupons, trigger: "blur"}],
        usersScope: [{required: true, message: "优惠会员范围不能为空，请选择！", trigger: "blur"}]
      }
    }
  },
  async mounted() {
    this.loadData()
  },
  methods: {
    formatCouponType: function(row, column) {
      return row.type === 0 ? "满减券" : row.type === 1 ? "折扣券" : row.type === 2 ? "代金券" : "--"
    },

    changePage(pageNo) {
      this.pageNo = pageNo
      this.loadData()
    },
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.pageNo = 1
      this.loadData()
    },

    async loadData() {
      const result = await fetch("/marketing/promotion/activity/loading", {id: this.$route.params.id})
      if (result.code == 200) {
        this.dataForm.id = result.data.id,
        this.dataForm.name = result.data.name,
        this.dataForm.code = result.data.code,
        this.dataForm.type = result.data.type,
        this.dataForm.typeLabel= result.data.type === 0 ? "促销活动" : result.data.type === 1 ? "优惠券活动" : "--",
        this.dataForm.activityTime.push(result.data.beginTime),
        this.dataForm.activityTime.push(result.data.endTime),
        this.dataForm.usersScope = result.data.usersScope,
        this.dataForm.gettingMethod = result.data.gettingMethod,
        this.dataForm.owner = result.data.owner,
        this.dataForm.purpose = result.data.purpose
        if (result.data.sendBeginTime){
          this.dataForm.sendTime.push(result.data.sendBeginTime)
        }
        if (result.data.sendEndTime){
          this.dataForm.sendTime.push(result.data.sendEndTime)
        }
        this.dataForm.auditState = result.data.auditState,
        this.dataForm.activityCoupons = result.data.activityCoupons
      } else {
        this.$message.error(result.msg)
      }
    },

    async addCouponList(data) {
      this.dataForm.activityCoupons = data
    },

    async removeCoupon(index){
      this.dataForm.activityCoupons.splice(index, 1)
    },

    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.dataForm.beginTime = this.dataForm.activityTime[0]
          this.dataForm.endTime = this.dataForm.activityTime[1]
          this.dataForm.sendBeginTime = this.dataForm.sendTime[0]
          this.dataForm.sendEndTime = this.dataForm.sendTime[1]
          this.sending = true
          const params = Object.assign({}, this.dataForm)
          console.log(JSON.stringify(params))
          const result = await post("/marketing/promotion/activity/update", params)
          this.sending = false
          if (result.code == 200) {
            this.$message.success("促销规则操作成功！")
            //this.$parent.loadData();
            this.back2Prev()
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
    },

    addCoupons(){
      this.$refs.coupontemplate.show(true, this.$route.params.id, this.dataForm.activityCoupons)
    },

    addUsers(userScope) {
      this.$refs.usertemplate.show(true, this.$route.params.id, userScope)
    },

    back2Prev() {
      this.$router.back()
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .div-layout {
    padding: 16px;
    background: #ffffff;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
</style>

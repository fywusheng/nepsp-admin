<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input
            v-model="searchParams.orderCode"
            placeholder="请输入系统交易订单号..."
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="searchParams.paymentNo"
            placeholder="请输入第三方交易号..."
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData()" size="mini">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      class="custom-table"
      :data="dataList"
      :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
      size="mini"
      v-loading="loading"
    >
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
      <el-table-column prop="id" label="交易ID" width="60px" align="center"></el-table-column>
      <el-table-column prop="bizType" label="交易类型" :formatter="formatBizType" width="80px" align="center"></el-table-column>
      <el-table-column prop="paymentMethod" label="支付方式" :formatter="formatPaymentMethod" width="80px" align="center"></el-table-column>
      <el-table-column prop="paymentNo" label="第三方交易号" align="center"></el-table-column>
      <el-table-column prop="orderType" label="订单类型" :formatter="formatOrderType" width="80px" align="center"></el-table-column>
      <el-table-column prop="orderCode" label="订单号" width="160px" align="center"></el-table-column>
      <el-table-column prop="paymentAmounts" label="交易金额" width="80px" align="center"></el-table-column>
      <el-table-column prop="onlineAmounts" label="线上金额" width="80px" align="center"></el-table-column>
      <el-table-column prop="depositAmounts" label="余额金额" width="80px" align="center"></el-table-column>
      <el-table-column prop="paymentState" label="交易状态" :formatter="formatPaymentState" width="80px" align="center"></el-table-column>
      <el-table-column prop="paymentTime" label="交易时间" width="150px" align="center"></el-table-column>
    </el-table>
    <el-pagination
      background
      v-show="totalCount > 10"
      @size-change="changeSize"
      @current-change="changePage"
      :page-size="pageSize"
      layout="total, slot, jumper, prev, pager, next"
      :total="totalCount"
    >
    </el-pagination>
  </div>
</template>
<script>
import { post } from "@/utils/http-client"

export default {
  name: "",
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalCount: 20,
      loading: false,
      paymentMethodOptions: [{name: "待支付", code: "10"}, {name: "待发货", code: "20"}, {name: "待收货", code: "30"}, {name: "待评价", code: "50"}, {name: "交易完成", code: "40"}, {name: "已取消", code: "90"}],
      searchParams: {},
      dialogList: [],
      showDialog: false
    }
  },
  async mounted() {
    this.loadData()
  },
  methods: {
    formatBizType: function(row, column) {
      return row.bizType === 0 ? "付款流水" : row.bizType === 1 ? "退款流水" : "--"
    },
    formatPaymentMethod: function(row, column) {
      return row.paymentMethod === "alipayMobile" ? "支付宝" : row.paymentMethod === "wechatMobile" ? "微信支付" : row.paymentMethod === "cash_pay" ? "余额支付" : "--"
    },
    formatOrderType: function(row, column) {
      return row.orderType === 0 ? "商品订单" : row.orderType === 1 ? "充值订单" : "--"
    },
    formatPaymentState: function(row, column) {
      return row.paymentState === 0 ? "交易失败" : row.paymentState === 1 ? "交易成功" : "--"
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
      this.loading = true
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: this.searchParams
      }
      const result = await post("/payment/flow/listByPageNo", params)
      this.loading = false
      if (result.code == 200) {
        this.dataList = result.data.list
        this.totalCount = result.data.totalCount * 1
      } else {
        this.$message.error(result.msg)
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
</style>

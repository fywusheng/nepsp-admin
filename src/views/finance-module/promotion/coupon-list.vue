<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true" class="search-form clearfix" size="small">
        <el-form-item label="">
          <el-input
            v-model="searchParams.name"
            placeholder="请输入优惠活动名称..."
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="searchParams.code"
            placeholder="请输入优惠活动编码..."
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary" @click="loadData" >查询</el-button>
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
     
      <el-table-column type="index" label="序号" width="50px" align="center"> </el-table-column>
      <el-table-column type="expand" width="20px" align="center">
        <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="优惠券编码">
              <span>{{ props.row.code }}</span>
            </el-form-item>
            <el-form-item label="允许转赠">
              <span>{{ formatShareState(props.row) }}</span>
            </el-form-item>
            <el-form-item label="成本归属">
              <span>{{ props.row.costOwner }}</span>
            </el-form-item>
        </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="活动名称" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="type" label="活动类型" width="80px" :formatter="formatActivityType" align="center"></el-table-column>
      <!-- <el-table-column prop="denomination" label="面值(元)" width="80px" align="center"> </el-table-column>
      <el-table-column prop="num" label="发放数量" width="80px" align="center"> </el-table-column>
      <el-table-column prop="totalAmount" label="总费用(元)" :formatter="formatTotalAmount" align="center" width="120px"></el-table-column> -->
      <el-table-column prop="gettingMethod" label="发放方式" :formatter="formatGettingMethod" align="center" width="100px"></el-table-column>
      <el-table-column prop="beginTime" label="活动生效时间" :formatter="formatActivityTime" align="center" width="300px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="owner" label="发起(成本)部门" align="center" width="150px"></el-table-column>
      <el-table-column prop="approveState" label="审核状态" align="center" width="80px" :formatter="formatApproveState"></el-table-column>
      <el-table-column prop="modifier" label="审核人" align="center" width="80px"></el-table-column>
      <el-table-column prop="updatedTime" label="审核时间" align="center" width="150px"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.auditState!=0"
            icon="el-icon-success"
            @click="approveCoupon(scope.row)"
            size="mini"
            >审核</el-button>
        </template>
      </el-table-column>
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
import { fetch, post } from "@/utils/http-client"

export default {
  name: "MarkingCouponApprove",
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalCount: 20,
      loading: false,
      searchParams: {}
    }
  },

  async mounted() {
    this.loadData()
  },
  methods: {
    formatActivityTime: function(row, column) {
      return row.beginTime + " - " + row.endTime
    },
    formatSendTime: function(row, column) {
      return row.beginTime + " - " + row.endTime
    },
    formatActivityType: function(row, column){
      return row.type == 1 ? "优惠券" : "--"
    },
    formatCouponType: function(row, column) {
      return row.type == 0 ? "满减券" : row.type == 1 ? "折扣券" : row.type == 2 ? "代金券" : "--"
    },
    formatGettingMethod: function(row, column) {
      return row.gettingMethod == 0 ? "系统发放" : row.gettingMethod == 1 ? "会员领取" : "--"
    },
    formatTotalAmount: function(row, column) {
      return row.denomination * row.num
    },
    formatShareState: function(row, column) {
      return row.shareState == 0 ? "不支持" : row.shareState == 1 ? "支持" : "--"
    },
    formatApproveState: function(row, column) {
      return row.auditState === 0 ? "待审核" : row.auditState === 1 ? "审核通过" : row.auditState === -1 ? "草稿" : row.auditState === -2 ? "审核不通过" : "--"
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
      const result = await post("/finance/promotion/activity/list", params)
      this.loading = false
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    async approveCoupon(row){

      this.$confirm("确认通过该优惠活动的预算信息？否则请驳回！", "审核确认提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "通过",
        cancelButtonText: "驳回",
        type: "warning"
      })
        .then(async() => {
          const result = await fetch("/finance/promotion/activity/approve", {activityId: row.id})
          if (result.code==200){
            this.$message.success("审批操作成功！")
            this.loadData()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(async action => {
          if (action==="cancel"){
            // const result = await fetch("/finance/promotion/activity/reject", {activityId: row.id})
            // if (result.code==200){
            //   this.$message.success("审批操作成功！")
            //   this.loadData()
            // } else {
            //   this.$message.error(result.msg)
            // }
          }
        })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.main-content {
  padding: 16px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 120px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
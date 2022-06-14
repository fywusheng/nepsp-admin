<template>
  <el-dialog
    class="dialog"
    :title="'促销活动优惠券清单'"
    width="850px"
    :visible.sync="showDialog">
    <el-row>
      <el-form :inline="true" class="unset-height" size="small">
        <el-form-item label="">
          <el-input
            v-model="searchParams.name"
            placeholder="请输入优惠券名称..."
            clearable
            style="width:200px"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="searchParams.code"
            placeholder="请输入优惠券编码..."
            clearable
            style="width:200px"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData" >查询(Q)</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      ref="tableRef"
      class="custom-table"
      :data="dataList"
      :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
      size="mini"
      v-loading="loading"
      style="padding-top:0"
      @selection-change="handleSelectionChange"
    >
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="selection" width="50px" align="center"></el-table-column>
      <el-table-column prop="name" label="优惠券名称" show-overflow-tooltip-> </el-table-column>
      <el-table-column prop="code" label="优惠券编码" width="100px"> </el-table-column>
      <el-table-column prop="type" label="优惠券类型" width="100px" :formatter="formatCouponType"></el-table-column>
      <el-table-column prop="denomination" label="面值" width="80px"> </el-table-column>
      <el-table-column prop="num" label="发放数量" width="80px"> </el-table-column>
      <el-table-column prop="gettingMethod" label="发放方式" :formatter="formatGettingMethod" align="center" width="100px"></el-table-column>
      <el-table-column prop="shareState" label="允许转赠" :formatter="formatShareState" align="center" width="100px"></el-table-column>
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
    <el-divider content-position="left"></el-divider>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show(false)">取 消</el-button>
      <el-button type="success" :loading="sending" :disabled="sending" @click="saveSelection">
        {{sending ? '正在保存...':'关 联'}}
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
      sending: false,
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalCount: 20,
      loading: false,
      activityId: "",
      searchParams: {},
      showDialog: false,
      multipleSelection: []
    }
  },
  async mounted() {
    //this.loadData();
  },
  methods: {
    formatCouponType: function(row, column) {
      return row.type === 0 ? "满减券" : row.type === 1 ? "折扣券" : row.type === 2 ? "代金券" : "--"
    },
    formatGettingMethod: function(row, column) {
      return row.gettingMethod == 0 ? "系统发放" : row.gettingMethod == 1 ? "会员领取" : "--"
    },
    formatShareState: function(row, column) {
      return row.shareState == 0 ? "不支持" : row.shareState == 1 ? "支持" : "--"
    },
    formatApproveState: function(row, column) {
      return row.approveState === 0 ? "待审核" : row.approveState === 1 ? "审核通过" : row.approveState === -1 ? "草稿" : row.approveState === -2 ? "审核不通过" : "--"
    },

    show(flag, activityId, selectedCoupons) {
      this.showDialog = flag
      if (flag){
        this.pageNo = 1
        this.activityId = activityId
        this.dataList = []
        this.totalCount = 0
        this.multipleSelection = selectedCoupons
        this.loadData()
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
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
      this.searchParams.activityId = this.activityId
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: this.searchParams
      }
      const result = await post("/marketing/promotion/coupon/list", params)
      this.loading = false
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
          console.log(JSON.stringify(this.multipleSelection))
          this.multipleSelection.forEach(item => {
            this.$refs.tableRef.toggleRowSelection(item, true)
            console.log("JSON: " + JSON.stringify(item))
          })
        })
      } else {
        this.$message.error(result.msg)
      }
    },

    async saveSelection(){
      this.$emit("addCouponList", this.multipleSelection)
      this.show(false)
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.el-dialog__body .el-form.unset-height {
  min-height: unset;
}
</style>
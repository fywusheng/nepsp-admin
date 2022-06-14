<template>
  <div class="main-content" style="padding-top:0px;padding-bottom:0px">
    <el-tabs v-model="activeType" type="card" @tab-click="handleClick" style="padding-top:0">
        <el-tab-pane label="待审核" name="1" :disabled="disabled"></el-tab-pane>
        <el-tab-pane label="已驳回" name="2" :disabled="disabled"></el-tab-pane>
    </el-tabs>
    <el-form :inline="true">
    <el-row class="mb-2">
        <el-form-item label="">
          <el-input
            v-model="searchParams.name"
            placeholder="请输入商品名称..."
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="searchParams.id"
            placeholder="请输入商品ID..."
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input
            v-model="searchParams.code"
            placeholder="请输入商品编码..."
            clearable
            size="mini"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData" size="mini">查 询</el-button>
          <el-button type="default" v-if="activeType==1" icon="el-icon-circle-plus-outline" size="mini" @click="audit(0)">审 核</el-button>
        </el-form-item>
    </el-row>
    </el-form>
    <el-table
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
      <el-table-column type="selection" width="45px" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="45px" align="center"></el-table-column>
      <el-table-column label="LOGO" width="60px">
        <template slot-scope="scope">
          <img :src="scope.row.mainImgUrl" width="30px" height="30px"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="id" label="商品ID" width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="code" label="商品编码" width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="brandName" label="所属品牌" width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="categoryNode" label="所属类目" width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="merchantId" label="所属商户" width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="auditState" label="审核状态" width="100px" align="center" :formatter="formatAuditState"></el-table-column>
      <el-table-column prop="auditTimeTime" label="审核时间" width="150px" v-if="activeType==3" align="center"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="150px" align="center"></el-table-column>
      <el-table-column prop="updatedTime" v-if="activeType==1" label="提审时间" width="150px" align="center"></el-table-column>
      <el-table-column prop="updatedTime" v-if="activeType==2" label="审核时间" width="150px" align="center"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="280px">
        <template slot-scope="scope">
          <el-button size="mini" :disabled="scope.row.auditState===0" @click="forward2SpecPage(scope.row)">查看SKU</el-button>
          <el-button size="mini" v-if="activeType==1" icon="el-icon-success" @click="audit(1,scope.row)">审 核</el-button>
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
    <audit-template ref="audittemplate"></audit-template>
  </div>
</template>
<script>
import { post } from "@/utils/http-client"
import AuditTemplate from "./approval-pending-audit"

export default {
  name: "",
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      multipleSelection: [],
      totalCount: 20,
      loading: false,
      disabled: false,
      activeType: "1",
      searchParams: {
        queryType: 1,
        name: "",
        id: "",
        code: ""
      }
    }
  },
  components: {
    AuditTemplate
  },
  async mounted() {
    this.loadData()
  },
  methods: {
    formatAuditState: function(row, column) {
      return row.auditState === -1 ? "草稿中" : row.auditState === 0 ? "待审核" : row.auditState === -2 ? "审核不通过" : row.auditState === 1 ? "审核通过" : "--"
    },
    handleClick(tab, event) {
      this.dataList = []
      this.pageNo = 1
      this.searchParams = {}
      this.searchParams.queryType = this.activeType
      this.loadData()
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
        queryType: "product-audit",
        queryObject: this.searchParams
      }
      const result = await post("/product/listByPageNo", params)
      this.loading = false
      if (result.code === "200") {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
        })
      } else {
        this.$message.error(result.msg)
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    async audit(flag, data){
      var productList = []
      if (flag==1){
        productList.push(data)
      } else if (flag==0){
        productList = this.multipleSelection
      } else {
        this.$message.error("审核失败，不支持该操作类型！")
        return
      }
      if (productList.length==0){
        this.$message.error("审核失败，待审核商品记录不能为空，请选择！")
        return
      }
      this.$refs.audittemplate.show(true, productList)
    },

    back2Prev(){
      this.$router.back()
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .item .el-form-item__label{
      height: 35px;
  }
</style>
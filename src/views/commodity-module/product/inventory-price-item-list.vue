<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" content="商品库存/价格变更明细"></el-page-header>
    <el-row style="height: 30px"><el-col :span="24"></el-col></el-row>
    <el-row>
      <el-col>
        <el-form :inline="true">
          <el-form-item label="">
            <el-input
              v-model="searchParams.code"
              placeholder="请输入SKU ID..."
              clearable
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="loadData" size="mini"
              >查 询</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table
      class="custom-table"
      :data="dataList"
      :header-cell-style="{ background: '#F2F6FC', color: '#000000' }"
      size="mini"
      v-loading="loading"
    >
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column prop="id" label="明细ID" width="80px"> </el-table-column>
      <el-table-column prop="productName" label="商品名称" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="productId" label="商品ID" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="productCode" label="商品编码" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="classAttrName" label="SKU规格" width="100px"> </el-table-column>
      <el-table-column prop="skuId" label="SKU ID" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="skuCode" label="SKU编码" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="preStockBalance" label="原库存总量" width="80px"> </el-table-column>
      <el-table-column prop="stockBalance" label="库存变更量" width="80px"> </el-table-column>
      <el-table-column prop="preSupplierPrice" label="成本价" width="60px"></el-table-column>
      <el-table-column prop="preMarkOffPrice" label="市场价" width="60px"></el-table-column>
      <el-table-column prop="preSellingPrice" label="销售(原)价" width="80px"></el-table-column>
      <el-table-column prop="sellingPrice" label="销售(新)价" width="80px"></el-table-column>
      <el-table-column prop="resultStatus" label="处理状态" width="80px"></el-table-column>
      <el-table-column prop="resultMessage" label="处理结果" width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createdTime" label="处理时间" width="150px" align="center"></el-table-column>
    </el-table>
    <el-pagination
      background
      v-show="totalSize > 10"
      :page-size="pageSize"
      @size-change="changeSize"
      @current-change="changePage"
      layout="total, slot, jumper, prev, pager, next"
      :total="totalSize"
    >
    </el-pagination>
  </div>
</template>
<script>
import { post } from "@/utils/http-client"
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      loading: false,
      searchParams: {importId: this.$route.params.id},
      showDialog: false,
      bizName: "库存变更明细"
    }
  },
  async mounted() {
    this.loadData()
  },

  methods: {
    back2Prev() {
      this.$router.back()
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
      const result = await post("/product/inventory-price-item.list", params)
      this.loading = false
      if (result.code === "200") {
        this.$nextTick(() => {
          this.dataList = result.data.list
        })
      } else {
        this.$message.error(result.msg)
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.div-layout {
  padding: 10px 20px;
}
.td-colspan-label {
  text-align: right;
  font-size: 12px;
}
.td-colspan-value {
  text-align: left;
  font-size: 12px;
  font-weight: 550;
}
</style>
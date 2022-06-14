<template>
  <div class="div-layout">
    <el-row>
      <el-col>
        <el-form :inline="true">
          <el-form-item label="">
            <el-input
              v-model="searchParams.skuId"
              placeholder="请输入SKU ID..."
              clearable
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="loadData" size="mini"
              >查 询</el-button
            >
            <el-button type="default" icon="el-icon-circle-plus-outline" @click="add" size="mini"
              >新 增</el-button
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
      <el-table-column type="index" label="序号" width="50px" align="center"></el-table-column>
      <el-table-column type="expand" width="20px">
        <template slot-scope="props">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="文件名称">
              <span>{{ props.row.fileName }}</span>
          </el-form-item>
          <el-form-item label="文件URL">
              <span>{{ props.row.fileUrl }}</span>
          </el-form-item>
          <el-form-item label="变更描述">
              <span>{{ props.row.description }}</span>
          </el-form-item>
        </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="变更标题" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="batchNo" label="变更批次号" width="150px" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="auditState" label="审核状态" :formatter="formatAuditState" align="center" width="100px"> </el-table-column>
      <el-table-column prop="resultStatus" label="处理状态" :formatter="formatExeState" align="center" width="100px"> </el-table-column>
      <el-table-column prop="resultMessage" label="处理结果" width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="updatedTime" label="处理时间" width="150px" align="center"> </el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="150px" align="center"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="270px">
        <template slot-scope="scope">
          <el-button icon="el-icon-view" @click="forward2DetailsPage(scope.row)" size="mini">查看</el-button>
          <el-button icon="el-icon-success" :disabled="scope.row.auditState!==2" @click="audit(scope.row)" size="mini">审核</el-button>
          <el-button icon="el-icon-delete" :disabled="scope.row.auditState!==2" @click="del(scope.row)" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      v-show="totalCount > 10"
      :page-size="pageSize"
      @size-change="changeSize"
      @current-change="changePage"
      layout="total, slot, jumper, prev, pager, next"
      :total="totalCount"
    >
    </el-pagination>
    <edit-template ref="template"></edit-template>
  </div>
</template>
<script>
import { fetch, post } from "@/utils/http-client"
import EditTemplate from "./inventory-price-template"
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      totalCount: 20,
      dataList: [],
      loading: false,
      searchParams: {bizType: "1000"},
      showDialog: false
    }
  },
  components: {
    EditTemplate
  },
  async mounted() {
    this.loadData()
  },

  methods: {
    formatAuditState: function(row, column) {
      return row.auditState === 1 ? "待提交" : row.auditState === 2 ? "待审核" : row.auditState === 3 ? "审核不通过" : row.auditState === 4 ? "审核通过" : "--"
    },
    formatExeState: function(row, column) {
      //1:待导入临时表 2:待导入正式表。3:导入正式失败,4:导入成功，5:导入临时表失败,6:导入临时表部分失败,7:导入正式表部分失败,8:数据导入中
      return (row.resultStatus===1||row.resultStatus===2)? "待导入" : row.resultStatus === 8 ? "正在导入" : row.resultStatus === 4 ? "导入成功":"导入失败"
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
      const result = await post("/product/inventory-price-update.list", params)
      this.loading = false
      if (result.code === "200") {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    add() {
      this.$refs.template.show(true, this.searchParams.bizType)
    },
    async audit(row){
      const result = await fetch("/product/inventory-price-update.audit", {id: row.id})
      if (result.code === "200") {
        this.$message.success("批量库存变更申请审批通过！")
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }    
    },
    async del(row){
      const result = await fetch("/product/inventory-price-update.delete", {id: row.id})
      if (result.code === "200") {
        this.$message.success("批量库存变更申请删除成功！")
        this.loadData()
      } else {
        this.$message.error(result.msg)
      } 
    },
    forward2DetailsPage(row) {
      this.$router.push({ name: "InventoryPriceDetails", params: { id: row.id, bizType: row.bizType } })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.div-layout {
  padding: 10px 20px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
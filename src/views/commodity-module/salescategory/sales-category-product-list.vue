<template>
  <div class="main-content">
    <!-- <el-page-header
      @back="back2Prev"
      content="运营类目商品列表"
    ></el-page-header> -->
    <el-row style="height: 10px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-row class="mb-2">
      <el-form :inline="true" class="search-form clearfix" size="small">
        <el-form-item label="">
          <el-input
            v-model="searchParams.productId"
            placeholder="请输入商品ID..."
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item class="fr">
          <el-button type="primary"  @click="changePage(1)" >查询</el-button>
          <el-button type="default"  @click="add()">批量导入</el-button>
          <el-button type="default"  @click="remove()">批量移除</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      class="custom-table"
      height="450px"
      :data="dataList"
      :header-cell-style="{ background: '#F2F6FC', color: '#000000' }"
      size="mini"
      @selection-change="handleSelectionChange"
      v-loading="loading"
    >
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="selection" width="50px" align="center"></el-table-column>
      <el-table-column label="LOGO" width="80px">
        <template slot-scope="scope">
          <img :src="scope.row.mainImgUrl" width="30px" height="30px" />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="商品名称"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="id"
        label="商品ID"
        width="150px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="code"
        label="商品编码"
        width="100px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="brandId"
        label="所属品牌"
        width="100px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="categoryNode"
        label="所属类目"
        width="150px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="updatedTime"
        label="关联时间"
        width="150px"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop=""
        label="操作"
        align="center"
        width="100px"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button size="mini" @click="selectRow(scope.row)">移除</el-button>
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
    <edit-template ref="template"></edit-template>
  </div>
</template>

<script>
import { post } from "@/utils/http-client"
import EditTemplate from "./sales-category-product-template"

export default {
  name: "",
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalCount: 20,
      loading: false,
      searchParams: {
        categoryId: this.$route.params.id
      },
      dialogList: [],
      showDialog: false,
      selectedRows: []
    }
  },
  components: {
    EditTemplate
  },
  async mounted() {
    this.changePage(1)
  },
  methods: {
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
      const productIds = []
      if (this.searchParams.productId){
        productIds.push(this.searchParams.productId)
      }
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        categoryId: this.searchParams.categoryId,
        productIds: productIds
      }
      const result = await post("/category/list.product", params)
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

    add() {
      this.$refs.template.show(true, this.$route.params.id)
    },

    async remove(){
      if (this.selectedRows.length==0){
        alert("请选择需要解绑的商品!")
        return
      }
      const params ={
        categoryId: this.$route.params.id,
        productIds: this.selectedRows
      }
      const result = await post("/category/remove.product", params)
      if (result.code === "200") {
        this.$message.success("解绑成功！")
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }
    },

    selectRow(row){
      this.selectedRows = []
      if (row){
        this.selectedRows.push(row.id)
      }
      this.remove()
    },

    handleSelectionChange(val){
      this.selectedRows = []
      if (val&&val.length>0){
        for (const row of val){
          this.selectedRows.push(row.id)
        }
      }
    },

    back2Prev(){
      this.$router.back()
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.main-content {
  padding: 16px;
}
</style>
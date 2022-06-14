<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" content="卖场排期管理"></el-page-header>
    <el-row style="height: 30px"><el-col :span="24"></el-col></el-row>
    <el-row>
      <el-col>
        <el-form :inline="true">
          <el-form-item label="">
            <el-input
              v-model="searchParams.code"
              placeholder="请输入商品ID..."
              clearable
              size="mini"
            ></el-input>
          </el-form-item>
          <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData" size="mini">查 询</el-button>
          <el-button type="default" icon="el-icon-circle-plus-outline" @click="add" size="mini">新 增</el-button>
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
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column label="LOGO" width="80px">
        <template slot-scope="scope">
          <img :src="scope.row.mainImgUrl" width="30px" height="30px"/>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商品名称"> </el-table-column>
      <el-table-column prop="id" label="商品ID"> </el-table-column>
      <el-table-column prop="code" label="商品编码"> </el-table-column>
      <el-table-column prop="orderVal" label="排序"> </el-table-column>
      <el-table-column prop="" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-link
            icon="el-icon-delete"
            :underline="false"
            @click="remove(scope.row)"
            >移除&nbsp;&nbsp;</el-link
          >
        </template>
      </el-table-column>
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
    <edit-template ref="template"></edit-template>
  </div>
</template>
<script>
import EditTemplate from "./list-template"
import { post } from "@/utils/http-client"
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalSize: 20,
      loading: false,
      searchParams: {
        planId: this.$route.params.id
      },
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
      const result = await post("/marketing/salesplanning/listProductByPageNo", params)
      this.loading = false
      if (result.code === "200") {
        this.$nextTick(() => {
          this.dataList = result.data&&result.data.list
          this.totalSize = result.data?result.data.totalCount * 1:1
        })
      } else {
        this.$message.error(result.msg)
      }
    }, 
    add() {
      this.$refs.template.show(true, this.searchParams.planId)
    },
    async remove(row){
      const params = {
        planId: this.searchParams.planId,
        productId: row.id
      }

      const result = await post("/marketing/salesplanning/item.remove", params)
      if (result.code === "200"){
        this.$message.success("卖场商品移除成功！")
        this.changePage(1)
      } else { this.$message.error(result.msg) }
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
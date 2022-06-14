<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-input size="small" style="margin-bottom:5px" v-model="brandId" placeholder="品牌编码">
          <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
        </el-input>
      </el-col>
      <el-col :span="24">
        <el-input size="small" style="margin-bottom:5px" v-model="brandName" placeholder="名称">
          <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <el-table size="small" :data="list" highlight-current-row @row-click="onSelect" style="margin-bottom:5px"
              v-loading="loading">
      <el-table-column width="80px;" label="品牌ID" prop="id"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="Logo" width="100">
        <template slot-scope="scope"><img style="display:block;width:100%;" :src="scope.row.brandLogo">
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      small
      layout="pager"
      :current-page="pagination.current"
      :page-size="pagination.size"
      :total="pagination.total"
      @current-change="getList">
    </el-pagination>
  </div>
</template>

<script>
import { fetch } from "@/utils/http-client"

export default {
  data() {
    return {
      text: "",
      pagination: {
        size: 5,
        current: 1,
        total: 0
      },
      list: [],
      loading: false,
      brandId: "",
      brandName: ""
    }
  },
  methods: {
    async getList(page = 1) {
      this.pagination.current = page
      this.loading = true
      const params = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.size
      }
      if (this.brandId) {
        params.code = this.brandId
      }
      if (this.brandName) {
        params.name = this.brandName
      }
      this.loading = true
      this.list = []
      const result = await fetch("/brand/listByPageNo", params)
      if (result.code == 200) {
        this.list = result.data.list
        this.pagination.total = result.data.totalCount
      }
      this.loading = false
    },
    onSelect(row) {
      this.$emit("select", {
        type: "brand",
        label: "品牌",
        id: row.id,
        desc: row.name,
        meta: row
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

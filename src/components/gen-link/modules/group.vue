<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-input size="small" style="margin-bottom:5px" v-model="planId" placeholder="ID">
                    <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table size="small" :data="list" highlight-current-row @row-click="onSelect" style="margin-bottom:5px"
                  v-loading="loading">
            <el-table-column width="50px;" label="ID" prop="id"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
<!--            <el-table-column label="时间" prop="type">-->
<!--                <template slot-scope="scope">-->
<!--                    {{scope.row.startTime}}至{{scope.row.endTime}}-->
<!--                </template>-->
<!--            </el-table-column>-->
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
import { post } from "@/utils/http-client"

export default {
  data() {
    return {
      planName: "",
      list: [],
      pagination: {
        size: 10,
        current: 1,
        total: 0
      },
      loading: false,
      planId: ""
    }
  },
  filters: {

  },
  methods: {
    async getList(page = 1) {
      this.pagination.current = page
      this.loading = true
      const params = {
        pageNum: this.pagination.current,
        pageSize: this.pagination.size,
        queryObject: {}
      }
      // if (this.planName) {
      //     params.name = this.planName;
      // }
      if (this.planId) {
        params.queryObject.id = this.planId
      }
      const result = await post("/marketing/salesplanning/listByPageNo", params)
      if (result.code == 200) {
        this.list = result.data.list
        this.pagination.total = result.data.totalCount
      }
      this.loading = false
    },
    onSelect(row) {
      this.$emit("select", {
        type: "group",
        label: "商品组",
        id: row.id,
        desc: row.name,
        action: "GO_GROUP",
        meta: row
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

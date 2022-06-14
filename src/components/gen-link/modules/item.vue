<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-input size="small" style="margin-bottom:5px" v-model="name" placeholder="名称">
                    <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
                </el-input>
            </el-col>
        </el-row>
        <el-table size="small" :data="list" highlight-current-row @row-click="onSelect" style="margin-bottom:5px"
                  v-loading="loading">
            <el-table-column label="名称" prop="item_name">
                <template slot-scope="scope">
                    <p>{{scope.row.name}}</p>
                    {{scope.row.id}}
                </template>
            </el-table-column>
            <el-table-column label="图片" width="100">
                <template slot-scope="scope"><img style="display:block;width:100%;" :src="scope.row.mainImgUrl">
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                small
                layout="pager"
                @size-change="changeSize"
                @current-change="changePage"
                :page-size="pageSize"
                :total="totalSize">
        </el-pagination>
    </div>
</template>

<script>
import { post } from "@/utils/http-client"

export default {
  data() {
    return {
      id: "",
      name: "",
      list: [],
      pageFrom: 1,
      pageSize: 5,
      totalSize: 5,
      loading: false,
      manualId: "",
      brandList: [],
      brandIds: "",
      categoryList: [],
      dispId: "",
      attrs: []
    }
  },
  methods: {
    changePage(pageNo) {
      this.pageFrom = pageNo
      this.getList()
    },
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.pageFrom = 1
      this.getList()
    },
    async getList() {
      this.loading = true
      const params = {
        pageNum: this.pageFrom,
        pageSize: this.pageSize,
        queryObject: {
          queryType: 1,
          name: this.name || ""
        }
      }
      this.list = []
      const result = await post("/product/listByPageNo", params)
      this.loading = false
      if (result.code == 200) {
        this.list = result.data.list
        this.totalSize = result.data.totalCount * 1
      }
    },
    onSelect(row) {
      this.$emit("select", {
        type: "item",
        label: "商品",
        id: row.id,
        desc: row.name,
        action: "GO_DETAILS",
        meta: row
      })
    }
  },
  mounted() {
    this.getList()
  },
  filters: {
    tradeType(value) {
      return {
        1: "国内贸易",
        2: "跨境贸易"
      }[ value ] || ""
    }
  }
}
</script>

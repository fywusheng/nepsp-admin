<template>
    <div>
<!--        <el-input size="small" style="margin-bottom:5px" v-model="manualId" placeholder="手动输入优惠券ID">-->
<!--            <el-button slot="append" @click="confirm">确定</el-button>-->
<!--        </el-input>-->
<!--        <el-input size="small" style="margin-bottom:5px" v-model="key" placeholder="请输入关键字">-->
<!--            <el-button slot="append" icon="el-icon-search" @click="getList()"></el-button>-->
<!--        </el-input>-->
        <el-table size="small" :data="list"  highlight-current-row  @row-click="onSelect" :row-style="getRowStyle" style="margin:5px 0" v-loading="loading">
            <el-table-column label="名称/code/有效期">
                <template slot-scope="scope">
                    <p>
                        <small style="color:#999">{{scope.row.id}}</small>
                    </p>
                    <p>
                        {{scope.row.name}}
                    </p>
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
import _ from "lodash"
export default {
  data() {
    return {
      key: "",
      list: [],
      pageFrom: 1,
      pageSize: 5,
      totalSize: 5,
      loading: false,
      manualId: ""
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
    async getList(){
      this.loading = true
      const params = {
        pageNum: this.pageFrom,
        pageSize: this.pageSize,
        queryObject: {
          name: this.name || ""
        }
      }
      this.list = []
      const result = await post("/marketing/coupon/list", params)
      this.loading = false
      if (result.code == 200) {
        this.list = result.data.list
        this.totalSize = result.data.totalCount * 1
      }

    },
    onSelect(row){
      this.$emit("select", {
        type: "coupon",
        label: "优惠券",
        codes: row.id,
        desc: row.name,
        meta: row
      })
    },
    getRowStyle(row){
      return _.merge({
        height: "80px",
        cursor: "pointer"
      }, {
        1: {},
        2: {},
        3: {
          color: "#999",
          background: "#eee"
        },
        4: {
          color: "#999",
          background: "#eee"
        }
      }[row.status])
    }
  },
  mounted(){
    this.getList()
  },
  filters: {
    couponStatus(value){
      return {
        1: "未开始",
        2: "进行中",
        3: "已结束",
        4: "已失效"
      }[value]
    }
  }
}
</script>

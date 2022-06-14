<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true">
        <el-form-item label="">
          <el-input
            v-model="searchParams.name"
            placeholder="请输入销售排期名称..."
            clearable
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData" size="mini">查 询</el-button>
          <el-button type="default" icon="el-icon-circle-plus-outline" @click="add" size="mini">新 增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      class="custom-table"
      :data="dataList"
      :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
      size="mini"
      v-loading="loading"
    >
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="index" label="序号"> </el-table-column>
      <el-table-column prop="name" label="排期名称" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="id" label="排期ID" width="80px"> </el-table-column>
      <el-table-column prop="startTime" label="生效时间" :formatter="formatEffectiveTime" align="center" width="290px"> </el-table-column>
      <el-table-column prop="description" label="描述" width="200px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="modifier" label="修改人" width="80px"></el-table-column>
      <el-table-column prop="updatedTime" label="操作时间" align="center" width="150px"></el-table-column>
      <!-- <el-table-column prop="delFlag" label="状态" align="center" width="60px">
        <el-switch
            v-model="value1"
            active-color="#67C23A"
            inactive-color="#909399"
          >
          </el-switch>
      </el-table-column> -->
      <el-table-column prop="" label="操作" align="center" width="280px">
        <template slot-scope="scope">
        <el-button
          size="mini"
          icon="el-icon-view"
          @click="forward2PlanItemPage(scope.row)">明细</el-button>
        <el-button
          size="mini"
          icon="el-icon-edit"
          @click="edit(scope.row)">编辑</el-button>
        <el-button
          size="mini"
          icon="el-icon-delete"
          @click="del(scope.row)">删除</el-button>
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
import { post } from "@/utils/http-client"
import EditTemplate from "./template"

export default {
  name: "",
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalSize: 20,
      loading: false,
      searchParams: {},
      dialogList: [],
      showDialog: false,
      value1: false
    }
  },
  components: {
    EditTemplate
  },
  async mounted() {
    this.loadData()
  },
  methods: {
    formatEffectiveTime: function(row, column) {
      if (row.startTime&&row.endTime){
        return row.startTime + " - " + row.endTime
      } else {
        return " - "
      }
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
        queryObject: {
          name: this.searchParams.name
        }
      }

      const result = await post("/marketing/salesplanning/listByPageNo", params)
      this.loading = false
      if (result.code === "200") {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalSize = result.data.totalCount * 1
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    add() {
      this.$refs.template.show(true)
    },
    edit(row) {
      this.$refs.template.show(true, row)
    },
    del(row) {
      this.$confirm("确定要删除所选卖场吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          const result = await post("/marketing/salesplanning/delete", { id: row.id })
          if (result.code === "200") {
            this.$message.success(result.msg)
            this.loadData()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(() => {})
    },

    forward2PlanItemPage(row){
      this.$router.push({name: "SalesPlanningItem", params: { id: row.id }})
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
</style>
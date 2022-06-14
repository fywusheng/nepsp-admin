<template>
  <div class="div-layout">
    <!-- <el-page-header @back="back2Prev" content="属性值管理"></el-page-header>
    <el-row style="height: 30px"><el-col :span="24"></el-col></el-row> -->
    <el-row>
      <el-col>
        <el-form :inline="true" class="search-form clearfix" size="small">
          <el-form-item label="">
            <el-input
              v-model="searchParams.val"
              placeholder="请输入属性名称..."
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="searchParams.id"
              placeholder="请输入属性ID..."
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="fr">
            <el-button class="two-words" type="primary" @click="loadData">查询</el-button>
            <el-button class="two-words" type="success" @click="add">新增</el-button>
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
      <el-table-column type="index" label="序号" width="100px"> </el-table-column>
      <el-table-column prop="val" label="属性值"> </el-table-column>
      <el-table-column prop="id" label="属性值ID"> </el-table-column>
      <el-table-column
        prop="createdTime"
        label="创建时间"
        width="150px"
      ></el-table-column>
      <el-table-column prop="delFlag" label="启用状态" width="100px">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.delFlag"
            active-color="#67C23A"
            :active-value="0"
            inactive-color="#909399"
            :inactive-value="1"
            @change="resetting(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-link
            icon="el-icon-delete"
            :underline="false"
            @click="del(scope.row)"
            >删除&nbsp;&nbsp;</el-link
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
import { fetch, post } from "@/utils/http-client"
import EditTemplate from "./attrval-template.vue"

export default {
  data() {
    return {
      page: 1,
      pageSize: 20,
      dataList: [],
      totalSize: 20,
      loading: false,
      searchParams: {},
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
      this.page = pageNo
      this.loadData()
    },
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.page = 1
      this.loadData()
    },
    async loadData() {
      this.loading = true
      const params = {
        pageNum: this.page,
        pageSize: this.pageSize,
        attrId: this.$route.params.id
      }
      Object.keys(this.searchParams).forEach((key) => {
        params[key] = this.searchParams[key]
      })
      Object.keys(this.searchParams).forEach((key) => {
        if (this.searchParams[key] !== ""){
          params[key] = this.searchParams[key]
        }
       
      })
      const result = await fetch("/attr/listValByPageNo", params)
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
      this.$refs.template.show(true, this.$route.params.id)
    },
    async resetting(row) {
      const result = await post("/attr/resettingAttrVal", row)
      if (result.code === "200") {
        this.$message.success("重置启用状态成功!")
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }
    },
    del(row) {
      this.$confirm("确定要删除该属性值吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          const result = await post("/attr/deleteAttrVal", { id: row.id })
          if (result.code === "200") {
            this.$message.success("删除成功!")
            this.loadData()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(() => {})
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
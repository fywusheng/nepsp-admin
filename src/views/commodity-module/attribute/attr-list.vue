<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form class="search-form clearfix" :inline="true" size="small">
        <el-form-item label="">
          <el-input
            v-model="searchParams.name"
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
        <el-form-item label="">
          <el-select v-model="searchParams.specsState" collapse-tags filterable style="width:100%" placeholder="是否是规格属性...">
            <el-option
              v-for="item in specsStateOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="fr">
          <el-button class="two-words" type="primary" @click="loadData" >查询</el-button>
          <el-button class="two-words" type="success" @click="add" >新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      class="custom-table"
      :data="dataList"
      :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
      size="mini"
      height="450px"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="70px" align="center"></el-table-column>
      <el-table-column prop="name" label="属性名" align="center"></el-table-column>
      <el-table-column prop="id" label="属性ID" width="80px" align="center"></el-table-column>
      <el-table-column prop="specsState" label="是否是规格属性" :formatter="formatSpecsState" align="center" width="120px"></el-table-column>
      <el-table-column prop="type" label="属性类型" :formatter="formatType" align="center" width="120px"></el-table-column>
      <el-table-column prop="createdTime" label="创建时间" width="170px" align="center"></el-table-column>
      <el-table-column prop="updatedTime" label="修改时间" width="170px" align="center"></el-table-column>
      <el-table-column prop="delFlag" label="启用状态" width="80px" align="center">
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
      <el-table-column prop="" label="操作" align="center" width="200px">
        <template slot-scope="scope">
          <el-link type="primary" icon="el-icon-collection" :underline="false" @click="forward2AttributeValPage(scope.row)" :disabled="scope.row.type==2" style="font-size:13px"
            >属性值&nbsp;</el-link
          >
          <el-link type="primary" icon="el-icon-edit" :underline="false" style="font-size:13px" @click="edit(scope.row)"
            >编辑&nbsp;</el-link
          >
          <el-link type="primary" icon="el-icon-delete"
          :underline="false"
          @click="del(scope.row)"
          style="font-size:13px"
            >删除&nbsp;</el-link
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
import EditTemplate from "./attr-template"

export default {
  name: "productMagPresetPrps",
  data() {
    return {
      page: 1,
      pageSize: 20,
      dataList: [],
      totalSize: 20,
      loading: false,
      searchParams: {},
      showDialog: false,
      specsStateOptions: [{name: "普通属性", code: "0"}, {name: "销售规格", code: "1"}]
    }
  },
  components: {
    EditTemplate
  },
  async mounted() {
    this.loadData()
  },
  methods: {
    formatType: function(row, column) {
      return row.type === 0 ? "单选" : row.type === 1 ? "多选" : row.type === 2 ? "自定义文本" : "--"
    },
    formatSpecsState: function(row, column) {
      return row.specsState === 0 ? "普通属性" : row.specsState === 1 ? "销售规格" : "--"
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
        pageSize: this.pageSize
      }
      Object.keys(this.searchParams).forEach((key) => {
        params[key] = this.searchParams[key]
      })
      const result = await fetch("/attr/listByPageNo", params)
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
      this.$confirm("确定要删除该属性信息吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          const result = await post("/attr/delete", { id: row.id })
          if (result.code === "200") {
            this.$message.success("删除成功!")
            this.loadData()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(() => {})
    },
    async resetting(row) {
      const result = await post("/attr/resettingAttribute", row)
      if (result.code === "200") {
        this.$message.success("重置启用状态成功!")
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }
    },
    forward2AttributeValPage(row){
      this.$router.push({name: "AttributeVal", params: { id: row.id }})
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.main-content {
  padding: 16px;
}
</style>

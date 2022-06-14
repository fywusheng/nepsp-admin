<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true" class="search-form clearfix" size="small">
        <el-form-item label="">
          <el-input v-model="searchParams.name" placeholder="请输入品牌名称（中/英）..." clearable />
        </el-form-item>
        <!-- <el-form-item label="">
          <el-input
            v-model="searchParams.code"
            placeholder="请输入品牌编码...s"
            clearable
            size="small"
          ></el-input>
        </el-form-item> -->
        <el-form-item class="fr">
          <el-button class="two-words" type="primary" @click="loadData">查询</el-button>
          <el-button class="two-words" type="success" @click="add">新增</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table height="450px"  :data="dataList" v-loading="loading">
      <el-table-column type="index" label="序号" width="60px" align="center"/>
      <el-table-column prop="brandLogo" label="LOGO" width="100px" align="center"> 
        <template slot-scope="scope">
          <el-image :src="scope.row.brandLogo" style="height:28px;width:28px" fit="scale-down">
           <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="font-size:26px"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="中文名称" width="200px" align="center"/>
      <el-table-column prop="nameEn" label="英文名称" width="200px" align="center"/>
      <el-table-column prop="description" label="描述" show-overflow-tooltip align="center"/>
      <el-table-column prop="createdTime" label="创建时间" align="center" width="170px" />
      <el-table-column prop="updatedTime" label="修改时间" align="center" width="170px" />
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
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-link icon="el-icon-edit" 
          :underline="false"
          style="font-size:13px"
          @click="edit(scope.row)"
            >编辑&nbsp;&nbsp;</el-link
          >
          <el-link icon="el-icon-delete"
          :underline="false"
          style="font-size:13px"
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
    <edit-template ref="template" />
  </div>
</template>
<script>
import { post } from "@/utils/http-client"
import EditTemplate from "./template"
export default {
  name: "productMagBrandMag",
  data() {
    return {
      page: 1,
      pageSize: 15,
      dataList: [],
      totalSize: 20,
      loading: false,
      searchParams: {},
      dialogList: [],
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
        queryObject: this.searchParams
      }
      const result = await post("/brand/listByPageNo", params)
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
    async resetting(row) {
      const result = await post("/brand/resetting", row)
      if (result.code === "200") {
        this.$message.success("品牌启用状态重置成功!")
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }
    },
    async del(row) {
      const result = await post("/brand/delete", row)
      if (result.code === "200") {
        this.$message.success("品牌删除成功!")
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }
    },
    forward2AuthorizationPage(row){
      this.$router.push({name: "Authorization2Role", params: { id: row.id }})
    }
  }
}
</script>
<style lang="scss"  scoped>
.main-content {
  padding: 16px;
}
</style>

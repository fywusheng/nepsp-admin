<template>
  <el-dialog
    class="dialog"
    :title="'商品列表'"
    width="950px"
    :visible.sync="showDialog">
  <div>
    <el-row class="search">
      <el-form class="yl-form" :inline="true" size="small">
        <el-form-item label="">
          <el-input
            v-model="searchParams.id"
            placeholder="请输入商品ID..."
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData">查询</el-button>
          <el-button type="default" icon="el-icon-connection" @click="returnSelectionOptions">返回数据</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      class="custom-table"
      :data="dataList"
      :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
      size="mini"
      v-loading="loading"
      style="padding-top:0"
      @selection-change="handleSelectionChange"
    >
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="selection" width="45px" align="center"></el-table-column>
      <el-table-column type="index" label="序号" width="45px" align="center"></el-table-column>
      <el-table-column label="LOGO" width="60px">
        <template slot-scope="scope">
          <img :src="scope.row.mainImgUrl" width="30px" height="30px"/>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="商品ID" align="center" width="180px"> </el-table-column>
      <el-table-column prop="name" label="商品名称"> </el-table-column>
      <el-table-column prop="code" label="商品编码" width="180px"></el-table-column>
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
  </div>
  </el-dialog>
</template>
<script>
import { post } from "@/utils/http-client"

export default {
  name: "",
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      dataList: [],
      totalCount: 20,
      loading: false,
      showDialog: false,
      multipleSelection: [],
      searchParams: {
        queryType: 1,
        auditState: 4,
        id: ""
      }
    }
  },
  async mounted() {},
  methods: {
    show(flag) {
      this.searchParams.id = ""
      this.showDialog = flag
      this.dataList = []
      this.totalCount = 0
      if (flag){
        this.changePage(1)
      }
    },
    async changePage(pageNo) {
      this.pageNo = pageNo
      this.loadData()
    },
    async changeSize(pageSize) {
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
      const result = await post("/product/listByPageNo", params)
      this.loading = false
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
        })
      } else {
        this.$message.error(result.msg)
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    returnSelectionOptions(){
      if (this.multipleSelection.length==0){
        this.$message.error("返回商品不能为空，请选择！")
        return
      }
      this.$message.success("返回商品列表成功！")
      this.$emit("addGoodsList", this.multipleSelection)
      this.show(false)
    }
  }
}
</script>
<style lang="scss">
.el-dialog__body .el-form.yl-form{
  min-height: unset;
}
</style>
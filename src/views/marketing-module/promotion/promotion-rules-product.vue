<template>
  <el-dialog
    class="dialog"
    :title="'创建促销活动'"
    width="850px"
    :visible.sync="showDialog">
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true" class="unset-height" size="small">
        <el-form-item label="">
          <el-input
            v-model="searchParams.productId"
            placeholder="请输入商品ID..."
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">查询(Q)</el-button>
        </el-form-item>
        <el-form-item prop="fileUrl">
            <yl-upload
            class="upload-demo"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :on-error="handleUploadFailure"
            multiple
            :limit="1"
            accept=".xlsx"
            :file-list="fileList">
              <el-button size="small" type="default">导入商品</el-button>
            </yl-upload>
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
      <el-table-column prop="id" label="商品ID" align="center" width="150px"> </el-table-column>
      <el-table-column prop="name" label="商品名称"> </el-table-column>
      <el-table-column prop="code" label="商品编码" width="100px"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-link
            icon="el-icon-view"
            :underline="false"
            @click="forward2ProfilePage(scope.row)"
            >移除</el-link>
        </template>
      </el-table-column>
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
      activityId: "",
      productScope: "",
      dataList: [],
      totalCount: 20,
      loading: false,
      fileList: [],
      searchParams: {
        fileName: "",
        fileUrl: ""
      },
      showDialog: false
    }
  },
  async mounted() {
  },
  methods: {
    show(flag, activityId, productScope) {
      this.showDialog = flag
      this.pageNo = 1
      this.activityId = activityId
      this.productScope = productScope
      this.dataList = []
      this.totalCount = 0
      this.loadData()
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
        activityId: this.activityId,
        productScope: this.productScope
      }
      const result = await post("/marketing/promotion/activity/loading.product", params)
      this.loading = false
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
          //this.pageSize = result.data.limit;
        })
      } else {
        this.$message.error(result.msg)
      }
    },

    handleAvatarSuccess(response, file, fileList) {
      if (response.code == 0){
        this.searchParams.fileUrl = response.data.absoluteUrl
        this.searchParams.fileName = file.name
        this.fileList = [] 
        this.uploadProduct()
      } else {
        //this.$message.error("导入用户失败！");
      }
    },
    handleUploadFailure(err, file, fileList){

    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error("文件大小不能超过10MB!")
      }
      return isLt2M
    },

    async uploadProduct(){
      const params = {
        activityId: this.activityId,
        productScope: this.productScope,
        fileUrl: this.searchParams.fileUrl
      }
      this.loading = true
      const result = await post("/marketing/promotion/activity/import.product", params)
      if (result.code == 200) {
        this.$message.success(result.msg)
        //this.show(false,this.activityId,this.userScope)
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
.el-dialog__body .el-form.unset-height {
  min-height: unset;
}
</style>
<template>
  <el-dialog
    class="dialog"
    :title="'促销活动用户范围'"
    width="850px"
    :visible.sync="showDialog">
  <div class="main-content">
    <el-row class="mb-2">
      <el-form :inline="true" class="unset-height" size="small">
        <el-form-item label="">
          <el-input
            v-model="searchParams.memberId"
            placeholder="请输入用户ID..."
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="loadData">查询</el-button>
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
            <el-button type="default">导入会员</el-button>
            </yl-upload>
        </el-form-item>
        <el-form-item>
            <div>
              <el-link :underline="false" href="https://szyh-ecommerce-oss.oss-cn-zhangjiakou.aliyuncs.com/commerce/product/1633261417031.xlsx" target="_blank">下载模板</el-link>
            </div>
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
      <el-table-column prop="id" label="会员ID" align="center" width="80px"> </el-table-column>
      <el-table-column prop="nickName" label="会员名称"> </el-table-column>
      <el-table-column prop="mobile" label="会员手机"> </el-table-column>
      <el-table-column prop="level" label="会员等级" width="100px"></el-table-column>
      <el-table-column prop="" label="操作" align="center" width="150px">
        <template slot-scope="scope">
          <el-link
            icon="el-icon-view"
            :underline="false"
            @click="removeUser(scope.row)"
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
      userScope: "",
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
    show(flag, activityId, userScope) {
      this.showDialog = flag
      this.pageNo = 1
      this.activityId = activityId
      this.userScope = userScope
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
        userScope: this.userScope,
        userId: this.searchParams.memberId
      }
      const result = await post("/marketing/promotion/activity/loading.users", params)
      this.loading = false
      if (result.code == 200) {
        this.$nextTick(() => {
          this.dataList = result.data&&result.data.list
          this.totalCount = result.data&&result.data.totalCount * 1
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
        this.uploadUsers()
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

    async uploadUsers(){
      const params = {
        activityId: this.activityId,
        userScope: this.userScope,
        fileUrl: this.searchParams.fileUrl
      }
      this.loading = true
      const result = await post("/marketing/promotion/activity/import.users", params)
      if (result.code == 200) {
        this.$message.success(result.msg)
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }
    },
    async removeUser(row){
      const params = {
        activityId: this.activityId,
        userScope: this.userScope,
        userId: row.id
      }
      this.loading = true
      const result = await post("/marketing/promotion/activity/remove.users", params)
      if (result.code == 200) {
        this.$message.success(result.msg)
        this.loadData()
      } else {
        this.$message.error(result.msg)
      }
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
</style>
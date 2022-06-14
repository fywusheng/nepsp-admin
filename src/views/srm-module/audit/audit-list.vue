<template>
  <div class="main-content">
    <el-row class="mb-2">
      <el-form class="search-form" :inline="true" size="small">
        <el-col :span="24">
          <el-form-item label="商家名称">
            <el-input 
            v-model="searchParams.supplierName" 
            placeholder="请输入商家名称" 
            maxlength="50"
            clearable >
            </el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input
              v-model="searchParams.contactPerson"
              placeholder="请输入联系人"
              maxlength="50"
              clearable
            ></el-input>
          </el-form-item>
         <el-form-item label="联系电话">
          <el-input
            v-model="searchParams.mobile"
            placeholder="请输入联系电话"
            maxlength="15"
            clearable
          ></el-input>
        </el-form-item>
        </el-col>
        <el-col :span="24">
           <el-form-item label="是否敬老商户">
            <el-select v-model="searchParams.respectFlag" placeholder="请选择活动区域">
              <el-option label="是" value="1"></el-option>
              <el-option label="否" value="0"></el-option>
            </el-select>
        </el-form-item>
         <el-form-item label="所属合伙人">
          <el-input
            v-model="searchParams.respectName"
            placeholder="请输入所属合伙人"
            maxlength="50"
            clearable
          ></el-input>
        </el-form-item>
         <el-form-item class="fr">
          <el-button type="primary" @click="loadData">查询</el-button>
          <el-button type="default" @click="reset">重置</el-button>
        </el-form-item>
        </el-col>
      </el-form>
    </el-row>

     <div class="table-wrap">
     
    <el-table
      class="custom-table"
      height="450px"
      :data="dataList"
      :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
      size="mini"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="80px" align="center" />
      <el-table-column prop="supplierCode" label="商家编码" width="130px" align="center" />
      <el-table-column prop="supplierName" label="商家名称" width="150px" align="center" show-overflow-tooltip />
      <el-table-column prop="businessCertificatesImg" label="营业执照" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-image 
            style="width: 20px; height: 20px"
            :src="scope.row.businessCertificatesImg" 
            :preview-src-list="[scope.row.businessCertificatesImg]">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" style="font-size:20px"></i>
            </div>
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="respectFlag" label="是否为敬老商户" width="120px" align="center" show-overflow-tooltip>
        <template slot-scope="scope">
          {{scope.row.respectFlag == "1"?"是":"否"}}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="住所/经营场所" width="150px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="contactPerson" label="联系人" width="150px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="150px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="审核状态" width="180px" align="center">
        
        <template slot-scope="scope">
          <div v-if="scope.row.status === 1" style="display:inline-block">已注册</div>
          <div v-if="scope.row.status === 2" style="display: inline-block">待审核</div>
          <div v-if="scope.row.status === 3" style="display: inline-block">审核通过</div>
          <div v-if="scope.row.status === 4" style="display: inline-block">审核未通过</div>
          <div v-if="scope.row.status === 5" style="display: inline-block">关闭封号</div>
          <div v-if="scope.row.status === 6" style="display: inline-block">删除</div>
          <div v-if="scope.row.status === 7" style="display: inline-block">打回修改</div>
          <el-button v-if="scope.row.status === 4" type="text" size="mini" @click="lookReason(scope.row)">查看原因</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="respectName" label="所属合伙人" width="150px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createdTime" label="申请时间" width="170px" align="center"></el-table-column>
      <el-table-column prop="auditTime" label="审核时间" width="170px" align="center"></el-table-column>
      
      <el-table-column prop="" label="操作" align="center" width="100px" fixed="right" >
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.status === 2" size="mini" @click="forward2Audit(scope.row)">审核</el-button>
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
  </div>
</template>
<script>
import { post } from "@/utils/http-client"

export default {
  name: "businessMagResidentAudit",
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      totalCount: 20,
      loading: false,
      dataList: [],
      searchParams: {
        auditState: "2,3,4"
      }
    }
  },
  components: {
  },
  async mounted() {
    this.loadData()
  },
  activated() {
    this.loadData()
  },
  methods: {
    // 去审核
    forward2Audit(row) {
      this.$router.push({ 
        name: "edit-supplie",
        params: { 
          id: 0,
          pageStatus: row.id
        } 
      })
    },

    // 分页事件
    changePage(pageNo) {
      this.pageNo = pageNo
      this.loadData()
    },
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.pageNo = 1
      this.loadData()
    },

    // 重置
    reset() {
      Object.keys(this.searchParams).forEach((key) => {
        this.searchParams[key] = ""
      })
      this.searchParams.auditState = "2,3,4"
      this.loadData()
    },

    // 查看原因
    lookReason({auditRemark, supplierName}) {
      this.$alert(
        `<div style="color:black">商家名称：${supplierName}</div><div>审核不通过原因：${auditRemark}</div>`, 
        "查看审核不通过原因", 
        {
          dangerouslyUseHTMLString: true
        }
      )
    },
    
    // 加载数据
    async loadData() {
      this.loading = true
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: this.searchParams
      }
      Object.keys(this.searchParams).forEach((key) => {
        if (params.queryObject[key] === ""){
          delete params.queryObject[key]
        }
      })
      const result = await post("/srm/supplier/listByPageNo", params)
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
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.main-content{
  padding: 16px;
  .search-form{
    height: 120px;
  }
}
</style>

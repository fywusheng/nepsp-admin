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
            <el-select v-model="searchParams.respectFlag" placeholder="请选择">
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
      <div class="table-edit-box clearfix">
        <div class="table-btn-right">
          <el-button type="success" size="small" @click="forward2DetailsPage(false)">添加</el-button>
        </div>
      </div>
    <el-table
      class="custom-table"
      height="450px"
      :data="dataList"
      :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
      size="mini"
      v-loading="loading"
    >
      <el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
      <el-table-column prop="supplierCode" label="商家编码" width="130px" align="center" how-overflow-tooltip></el-table-column>
       <el-table-column prop="supplierName" label="商家名称" width="150px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="businessCertificatesImg" label="营业执照" align="center">
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
      <el-table-column prop="respectFlag" label="是否为敬老商户" width="120px" align="center">
        <template slot-scope="scope">
          {{scope.row.respectFlag == "1"?"是":"否"}}
        </template>
      </el-table-column>
      <el-table-column prop="address" label="住所/经营场所" width="150px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="contactPerson" label="联系人" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="mobile" label="联系电话" width="150px" align="center" show-overflow-tooltip></el-table-column>
      <el-table-column prop="respectName" label="所属合伙人" align="center" width="150px" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createdTime" label="申请时间" width="170px" align="center"></el-table-column>
      <el-table-column prop="auditTime" label="入驻时间" width="170px" align="center"></el-table-column>
      <!-- <el-table-column prop="status" label="启用状态" width="150px" align="center">
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.status"
              active-color="#67C23A"
              :active-value="0"
              inactive-color="#909399"
              :inactive-value="1"
              @change="resetting(scope.row)"
            >
            </el-switch>
        </template>
      </el-table-column> -->
      <el-table-column prop="" label="操作" align="center" width="100px" fixed="right">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="forward2DetailsPage(scope.row)">编辑</el-button>
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
    <edit-template ref="template"></edit-template>
  </div>
</template>
<script>
import { post } from "@/utils/http-client"
import EditTemplate from "./supplier-template"

export default {
  name: "businessMagBusinessList",
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      totalCount: 20,
      loading: false,
      orderStatusOptions: [{name: "待支付", code: "10"}, {name: "待发货", code: "20"}, {name: "待收货", code: "30"}, {name: "待评价", code: "50"}, {name: "交易完成", code: "40"}, {name: "已取消", code: "90"}],
      searchParams: {
        auditState: "3"
      },
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
  activated() {
    this.loadData()
  },
  methods: {
    forward2DetailsPage(row) {
      this.$router.push({ name: "edit-supplie", params: { id: row?row.id:-1 } })
    },
    formatSupplierStatus: function(row, column) {
      return row.status === 1 ? "已注册待提交" : row.status === 2 ? "待审核" : row.status === 3 ? "审核通过" : row.status === 4 ? "审核未通过" : row.status === 5 ? "已禁用" : row.status === 6 ? "已删除" : "--"
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
    reset() {
      Object.keys(this.searchParams).forEach((key) => {
        this.searchParams[key] = ""
      })
      this.loadData()
    },
    
    add() {
      this.$refs.template.show(true)
    },
    // 改变状态
    resetting(row) {
      // debugger
      console.log(row.delFlag)
    },
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

      params.queryObject.auditState = "3"

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

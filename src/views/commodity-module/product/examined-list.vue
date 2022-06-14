<template>
  <div class="main-content">
   <div class="y-tabs" v-if="countMap">
     <el-radio-group v-model="activeType" size="small" @change="handleClick">
      <el-radio-button label="2">待审核 ({{countMap[2].countNum}})</el-radio-button>
      <el-radio-button label="3">审核未通过 ({{countMap[3].countNum}})</el-radio-button>
      <el-radio-button label="4">审核通过 ({{countMap[4].countNum}})</el-radio-button>
    </el-radio-group>
   </div>
   
    <el-form :inline="true" size="small" class="search-form">
      <el-row class="mb-2">
         <el-form-item label="商品编码">
            <el-input
              v-model="searchParams.code"
              placeholder="请输入商品编码..."
              clearable
            ></el-input>
          </el-form-item>
           <el-form-item label="商品ID">
            <el-input
              v-model="searchParams.id"
              placeholder="请输入商品ID..."
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="商品名称">
            <el-input
              v-model="searchParams.name"
              placeholder="请输入商品名称..."
              maxlength="50"
              clearable
            ></el-input>
          </el-form-item>
           <el-form-item label="商家名称">
            <el-input
              v-model="searchParams.supplierName"
              placeholder="请输入商家名称..."
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="商品品牌">
            <el-select v-model="searchParams.brandId" collapse-tags filterable clearable placeholder="请选择所属品牌...">
              <el-option
                v-for="item in brandOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品类目">
            <el-cascader
                v-model="searchParams.categoryId"
                :options="categoryOptions"
                clearable
                placeholder="请选择所属基础类目..."
                :props="{value:'id',label:'name',leaf:'parentCode',children: 'children',expandTrigger: 'hover',emitPath:false}"
              ></el-cascader>
          </el-form-item>
          <el-form-item label="" v-if="activeType==44">
            <el-select
              v-model="searchParams.auditState"
              clearable
              placeholder="请选择审核状态...">
              <el-option value="1" label="草稿中"></el-option>
              <el-option value="2" label="待审核"></el-option>
              <el-option value="3" label="审核不通过"></el-option>
              <el-option value="4" label="审核通过"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="fr" style="background:#F2F6FC">
            <el-button type="primary" @click="loadData" >查询</el-button>
            <el-button type="default" @click="reset" >重置</el-button>
          </el-form-item>
      </el-row>
    </el-form>

    <div class="table-wrap">
      <div class="table-edit-box clearfix">
        <div class="table-btn-right">
          <el-button type="primary" size="small" @click="handleExamined(1)">批量审核</el-button>
        </div>
      </div>
      <el-table
        height="450px"
        :data="dataList"
        :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
        size="mini"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="45px" align="center" />
        <el-table-column prop="id" label="商品ID" width="120px" align="center" show-overflow-tooltip/>
        <el-table-column prop="code" label="商品编码" width="120px" align="center" show-overflow-tooltip/>
        <el-table-column label="商品主图" width="100px" align="center">
          <template slot-scope="scope">
            <el-image 
              style="width: 20px; height: 20px"
              :src="scope.row.mainImgUrl" 
              :preview-src-list="[scope.row.mainImgUrl]">
               <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
               </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" width="120px" align="center" show-overflow-tooltip/>
        <el-table-column prop="categoryNode" label="所属类目" width="150px" show-overflow-tooltip align="center">
           <template slot-scope="scope">
            <span >{{scope.row.categoryNode.split(',').join('>')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="brandName" label="所属品牌" width="150px" show-overflow-tooltip align="center"/>
        <!-- <el-table-column prop="supplierName" label="商家" width="120px" show-overflow-tooltip align="center" /> -->
        <el-table-column prop="auditState" label="审核状态" width="200px" align="center" >
           <template slot-scope="scope">
            <span v-if="scope.row.auditState === 2">待审核</span>
            <span v-if="scope.row.auditState === 3">审核未通过</span>
            <span v-if="scope.row.auditState === 4">审核通过</span>
            <el-button style="display:inline-block" v-if="scope.row.auditState === 3" size="small" type="text"  @click="lookReason(scope.row)">查看原因</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="createdTime" label="提交审核时间" width="170px" align="center" />
        <el-table-column prop="auditTime" label="审核时间" width="170px" align="center" />
       
        <el-table-column prop="" label="操作" align="center" width="170px" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" type="text" v-if="activeType==2" @click="handleExamined(0, scope.row)">审核</el-button>
            <el-button size="small" type="text"  @click="lookDetail(scope.row)">详情</el-button>
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

    <el-dialog
      class="dialog"
      :title="examinedType === 0?'审核':'批量审核'"
      width="550px"
      :visible.sync="showDialog">
      <el-form
        class="data-form"
        :model="dataForm"
        :rules="dataRules"
        ref="dataForm"
        label-width="150px"
        label-position="top"
        size="small"
      >
        <div>
            <el-form-item label="是否通过" prop="auditState">
                <el-radio v-model="dataForm.auditState" label="4">通过</el-radio>
                <el-radio v-model="dataForm.auditState" label="3">不通过</el-radio>
            </el-form-item>
            <el-form-item label="备注信息" prop="auditDesc">
                <el-input v-model="dataForm.auditDesc" type="textarea" maxlength="10" :rows="5" placeholder="请输入审核备注（120字以内）"/>
            </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="success" :loading="sending" :disabled="sending" @click="save()">
          {{sending ?
          '正在保存...':'确定'}}
        </el-button>
      </div>
    </el-dialog>

    <yl-detail ref="infoRef" :product-info="productInfo" />
    
  </div>
</template>
<script>
import { fetch, downloadByPost, post } from "@/utils/http-client"
import YlDetail from "./examined-product-detail.vue"

export default {
  name: "productExamined",
  components: { YlDetail },
  data() {
    return {
      pageNo: 1,
      pageSize: 15,
      dataList: [],
      showDialog: false,
      countMap: null,
      productInfo: {},
      dataForm: {
        auditState: "4",
        auditDesc: ""
      },
      dataRules: {
        auditState: [
          { required: true, message: "请选择是否通过", trigger: "blur" }
        ]
      },
      sending: false,
      examinedType: 0,
      multipleSelection: [],
      totalCount: 20,
      loading: false,
      disabled: false,
      activeType: "2",
      brandOptions: [],
      categoryOptions: [],
      searchParams: {
        auditState: 2,
        queryType: 4,
        name: "",
        id: "",
        code: "",
        brandId: "",
        categoryId: "",
        supplierName: ""
        //saleState:5
      }
    }
  },
  async mounted() {
    this.loadBrandOptions()
    this.loadCategoryOptions()
    this.loadData()
    this.loadCountAuditState()
  },
  methods: {
    formatSaleState: function(row, column) {
      return row.saleState === 5 ? "在售中" : row.saleState === 51 ? "上架中" : row.saleState === 6 ? "已停售" : row.saleState === 61 ? "下架中" : "--"
    },
    formatAuditState: function(row, column) {
      return row.auditState === 2 ? "待审核" : row.auditState === 3 ? "审核不通过" : row.auditState === 4 ? "审核通过" : "--"
    },
    reset() {
      Object.keys(this.searchParams).map(key => {
        if (!["auditState", "queryType"].includes(key)) {
          this.searchParams[key] = ""
        }
      })
      this.loadData()
    },
    lookReason({auditDesc, name}) {
      this.$alert(`<div style="color:black">商品名称：${name}</div><div>审核不通过原因：${auditDesc}</div>`, "查看审核不通过原因", {
        dangerouslyUseHTMLString: true
      })
    },
    handleClick(tab, event) {
      this.dataList = []
      this.pageNo = 1
      this.searchParams.auditState = this.activeType
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

    handleExamined(type, row) {
      this.examinedType = type
      this.currentRow = row
      if ((!this.multipleSelection||this.multipleSelection.length==0)&&type === 1){
        this.$message.error("请选择需要上架销售的商品！")
        return 
      }
      this.showDialog = true
    },

    // 审核
    async save() {

      if (this.dataForm.auditState === "3" && this.dataForm.auditDesc === ""){
        this.$message.error("请输入原因！")
        return
      }
      if (this.examinedType === 1){
        this.batchAudit()
        return
      }

      this.sending = true
      const params = {
        id: this.currentRow.id,
        ...this.dataForm
      }
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          const result = await post("/product/audit", params)
          this.sending = false
          if (result.code === "200") {
            this.$message.success("商品审核成功！")
            this.loadData()
            this.loadCountAuditState()
            this.showDialog = false
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
     
    },

    // 批量审核
    async batchAudit() {

      this.sending = true
      const batchAuditIds = this.multipleSelection.map(el => { 
        return el.id
      }).join(",")
      const params = {
        batchAuditIds,
        ...this.dataForm
      }
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          const result = await post("/product/batchAudit", params)
          this.sending = false
          if (result.code === "200") {
            this.$message.success("商品审核成功！")
            this.loadData()
            this.loadCountAuditState()
            this.showDialog = false
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
     
    },
    
    // 查看详情
    async lookDetail(row) {
      const result = await fetch("/product/getByPK", {productId: row.id})
      if (result.code === "200") {
        Object.keys(result.data).map(key => {
          if (!result.data[key]){
            result.data[key] = "--"
          }
        })
        this.productInfo = result.data
        this.$refs.infoRef.open()
      } else {
        this.$message.error(result.msg)
      }
    },

    async loadBrandOptions() {
      const result = await fetch("/brand/listAll", {})
      if (result.code === "200") {
        this.brandOptions = result.data
      } else {
        this.$message.error(result.msg)
      }
    },

    async loadCategoryOptions() {
      const result = await fetch("/category/list.basic", {})
      if (result.code === "200") {
        this.categoryOptions = result.data
      } else {
        this.$message.error(result.msg)
      }
    },

    async loadCountAuditState() {
      const result = await post("/product/countAuditState", {})
      if (result.code === "200") {
        this.countMap = {}
        const countMap = {}
        result.data.forEach((i) => {
          countMap[i.auditState] = {countNum: i.countNum}
        })
        this.countMap = countMap
      } else {
        this.$message.error(result.msg)
      }
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
      if (result.code === "200") {
        this.$nextTick(() => {
          this.dataList = result.data.list
          this.totalCount = result.data.totalCount * 1
          //this.pageSize = result.data.limit;
        })
      } else {
        this.$message.error(result.msg)
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    publishSingleSelection(row){
      this.multipleSelection = []
      this.multipleSelection.push(row)
      this.publishedSelling()
    },

    publishedSelling(){
      if (!this.multipleSelection||this.multipleSelection.length==0){
        this.$message.error("请选择需要上架销售的商品！")
        return 
      }
      this.$confirm("确定要上架销售所选中的商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          this.loading = true
          const result = await post("/product/published.selling", {publishType: "onsale", productList: this.multipleSelection})
          this.loading = false
          if (result.code === "200") {
            this.$nextTick(() => {
              this.activeType = "2"
              this.queryType = 2
              this.loadData()
            })
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(() => {})
    },

    stopSingleSelection(row){
      this.multipleSelection = []
      this.multipleSelection.push(row)
      this.stopedSelling()
    },

    stopedSelling(){
      if (!this.multipleSelection||this.multipleSelection.length==0){
        this.$message.error("请选择需要下架的商品！")
        return 
      }
      this.$confirm("确定要下架所选中的商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async() => {
          this.loading = true
          const result = await post("/product/published.selling", {publishType: "offsale", productList: this.multipleSelection})
          this.loading = false
          if (result.code === "200") {
            this.$nextTick(() => {
              this.activeType = "1"
              this.queryType = 1
              this.loadData()
            })
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(() => {})
    },

    audit(row){
      // var auditState = 4
      this.$confirm("该商品资料完整度是否满足销售规则，符合则通过否则请驳回?", "审核确认提示", {
        distinguishCancelAndClose: true,
        confirmButtonText: "通过",
        cancelButtonText: "驳回",
        type: "warning"
      })
        .then(async() => {
          this.loading = true
          const result = await post("/product/audit", {id: row.id, auditState: 4})
          this.loading = false
          if (result.code === "200") {
            this.$message.success("商品审核成功！")
            this.loadData()
          } else {
            this.$message.error(result.msg)
          }
        })
        .catch(async action => {
          if (action==="cancel"){
            this.loading = true
            const result = await post("/product/audit", {id: row.id, auditState: 3})
            this.loading = false
            if (result.code === "200") {
              this.$message.success("商品审核成功！")
              this.loadData()
            } else {
              this.$message.error(result.msg)
            }
          }
        })
    },

    forward2ProductAddPage(row) {
      if (row){
        this.$router.push({ name: "ProductAddPage", params: { id: row.id } })
      } else {
        this.$router.push({ name: "ProductAddPage", params: { id: -1} })
      }
    },
    forward2SpecPage(row) {
      this.$router.push({ name: "SkuListDetails", params: { categoryNode: row.categoryNode, id: row.id } })
    },

    async exportProduct(){
      this.loading = true
      const params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        queryObject: this.searchParams
      }
      await downloadByPost("/product/export", "商品列表.xlsx", params)
      this.loading = false
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  .main-content {
    padding: 16px;
    .y-tabs {
      & ::v-deep .el-radio-button__orig-radio:checked + .el-radio-button__inner{
        border-color: black;
        background-color: black;
      }
      & ::v-deep .el-radio-button{
        margin-right: 8px;
      }
      & ::v-deep .el-radio-button__inner{
        border-radius: 4px;
        border-left: 1px solid #b6b7b9;
      }
    }
    .search-form{
      margin-top: 10px;
    }
  }
</style>
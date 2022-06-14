<template>
<div class="div-layout">
  <el-page-header @back="back2Prev" content="商品审核"></el-page-header>
  <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
  <el-divider content-position="left"><i class="el-icon-postcard"></i>&nbsp;基本信息</el-divider>
  <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
  <table width="100%">
     <tr style="height:40px">
         <td width= "35%" rowspan="7" colspan="3" align="center" valian='middle'><el-image :src="mainImgUrl" style="height:270px;width:270px" :fit="scale-down"></el-image></td>
         <td width= "10%" class="td-colspan-label">商品名称：</td><td width= "20%" class="td-colspan-value">{{name}}</td>
         <td width= "10%" class="td-colspan-label">商品别名：</td><td width= "25%" class="td-colspan-value">{{subName}}</td>
     </tr>
     <tr style="height:40px">
         <td width= "10%" class="td-colspan-label">名称前缀：</td><td width= "20%" class="td-colspan-value">{{prefixName}}</td>
         <td width= "10%" class="td-colspan-label">名称后缀：</td><td width= "25%" class="td-colspan-value">{{suffixName}}</td>
     </tr>
     <tr style="height:40px">
         <td width= "10%" class="td-colspan-label">商品主键：</td><td width= "20%" class="td-colspan-value">{{id}}</td>
         <td width= "10%" class="td-colspan-label">商品编码：</td><td width= "25%" class="td-colspan-value">{{code}}</td>
     </tr>
     <tr style="height:40px">
         <td width= "10%" class="td-colspan-label">所属品牌：</td><td width= "20%" class="td-colspan-value">{{brandId}}</td>
         <td width= "10%" class="td-colspan-label">所属分类：</td><td width= "25%" class="td-colspan-value">{{categoryCode}}</td>
     </tr>
     <tr style="height:40px">
         <td width= "10%" class="td-colspan-label">计量单位：</td><td width= "20%" class="td-colspan-value">{{unitId}}</td>
         <td width= "10%" class="td-colspan-label">容积/重量：</td><td width= "25%" class="td-colspan-value">{{goodsWeight}}</td>
     </tr>
     <tr style="height:40px">
         <td width= "10%" class="td-colspan-label">经营方式：</td><td width= "20%" class="td-colspan-value">{{isProprietary}}</td>
         <td width= "10%" class="td-colspan-label">关税类型：</td><td width= "25%" class="td-colspan-value">{{tariffType}}</td>
     </tr>
     <tr style="height:40px">
         <td width= "10%" class="td-colspan-label">发货方式：</td><td width= "20%" class="td-colspan-value">{{deliveryType}}</td>
         <td width= "10%" class="td-colspan-label">发货地区：</td><td width= "25%" class="td-colspan-value">{{deliveryRegion}}</td>
     </tr>
     <tr style="height:40px">
         <td width= "5%"></td>
         <td width= "10%" class="td-colspan-label">发货时长：</td><td width= "20%" class="td-colspan-value">预计 {{deliveryMinDays}} 至 {{deliveryMaxDays}} 天可收货</td>
         <td width= "10%" class="td-colspan-label"></td><td width= "20%" class="td-colspan-value"></td>
         <td width= "10%" class="td-colspan-label">商品状态：</td><td width= "25%" class="td-colspan-value">{{delFlag}}</td>
     </tr>
     <tr style="height:40px">
         <td width= "5%"></td>
         <td width= "10%" class="td-colspan-label">创建时间：</td><td width= "20%" class="td-colspan-value">{{createdTime}}</td>
         <td width= "10%" class="td-colspan-label">更新时间：</td><td width= "20%" class="td-colspan-value">{{updatedTime}}</td>
         <td width= "10%" class="td-colspan-label">操作人：</td><td width= "25%" class="td-colspan-value">{{modifier}}</td>
     </tr>
  </table>
  <el-divider content-position="left"><i class="el-icon-wallet"></i>&nbsp;商家信息</el-divider>
  <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
  <table width="100%">
     <tr style="height:40px">
         <td width= "5%"></td>
         <td width= "10%" class="td-colspan-label">所属商家：</td><td width= "20%" class="td-colspan-value">{{supplierId}}</td>
         <td width= "10%" class="td-colspan-label">商家货号：</td><td width= "20%" class="td-colspan-value">{{goodsNo}}</td>
         <td width= "10%" class="td-colspan-label">商家款号：</td><td width= "25%" class="td-colspan-value">{{styleNo}}</td>
     </tr>
     <tr style="height:40px">
         <td width= "5%"></td>
         <td width= "10%" class="td-colspan-label">审核状态：</td><td width= "20%" class="td-colspan-value">{{auditState}}</td>
         <td width= "10%" class="td-colspan-label">审核时间：</td><td width= "20%" class="td-colspan-value">{{auditTime}}</td>
         <td width= "10%" class="td-colspan-label">审核人：</td><td width= "25%" class="td-colspan-value">{{auditor}}</td>
     </tr>
  </table>
  <el-divider content-position="left"><i class="el-icon-wallet"></i>&nbsp;销售信息</el-divider>
  <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
  <table width="100%">
     <tr style="height:40px">
         <td width= "5%"></td>
         <td width= "10%" class="td-colspan-label">销售状态：</td><td width= "20%" class="td-colspan-value">{{saleState}}</td>
         <td width= "10%" class="td-colspan-label">上架时间：</td><td width= "20%" class="td-colspan-value">{{saleOnlineTime}}</td>
         <td width= "10%" class="td-colspan-label">操作人：</td><td width= "25%" class="td-colspan-value">{{saleOnlineOperator}}</td>
     </tr>
     <tr style="height:40px">
         <td width= "5%"></td>
         <td width= "10%" class="td-colspan-label"></td><td width= "20%" class="td-colspan-value"></td>
         <td width= "10%" class="td-colspan-label">下架时间：</td><td width= "20%" class="td-colspan-value">{{saleStopTime}}</td>
         <td width= "10%" class="td-colspan-label">操作人：</td><td width= "25%" class="td-colspan-value">{{saleStopOperator}}</td>
     </tr>
  </table>
  <el-divider content-position="left"><i class="el-icon-wallet"></i>&nbsp;规格参数</el-divider>
  <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
  <table width="100%">
     <tr style="height:40px">
         <td width= "5%"></td>
         <td width= "10%" class="td-colspan-label">审核时间：</td><td width= "20%" class="td-colspan-value">{{auditTime}}</td>
         <td width= "10%" class="td-colspan-label">审核状态：</td><td width= "20%" class="td-colspan-value">{{auditState}}</td>
         <td width= "10%" class="td-colspan-label">审核人：</td><td width= "25%" class="td-colspan-value">{{auditor}}</td>
     </tr>
  </table>
  <el-divider content-position="left"><i class="el-icon-collection"></i>&nbsp;商品描述</el-divider>
  <el-row style="height:30px"><el-col :span="24"></el-col></el-row>
  <table width="100%">
     <tr>
        <td width= "15%"></td>
        <td align="center"><div v-html="productDetail"></div></td>
        <td width= "15%"></td>
     </tr>
  </table>
  <el-row style="height: 30px">
    <el-col :span="24"></el-col>
  </el-row>
  <el-row type="flex" style="height:30px;text-align:center">
    <el-col :span="24" style="align:center">
    <el-button @click="back2Prev">返回列表</el-button>
    <el-button @click="back2Prev">审批通过</el-button>
    <el-button
        v-if="saleState!=5"
        type="success"
        :loading="sending"
        :disabled="sending"
        @click="save"
    >{{ sending ? '正在保存...' : '驳回申请' }}</el-button>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { fetch } from "@/utils/http-client"
export default {
  async mounted() {
    this.$loading = true
    this.loadProductInfo(this.$route.params.id)
    this.$loading = false
  },

  methods: {
    back2Prev(){
      this.$router.back()
    },
    async loadProductInfo(id) {
      const result = await fetch("/product/getByPK", {productId: id})
      if (result.code === "200") {
        this.id = result.data.id
        this.name = result.data.name
        this.subName = result.data.subName
        this.prefixName = result.data.prefixName
        this.suffixName = result.data.suffixName
        this.code = result.data.code
        this.brandId = result.data.brandId
        this.categoryId = result.data.categoryId
        this.categoryCode = result.data.categoryCode
        this.unitId = result.data.unitId
        this.goodsWeight = result.data.goodsWeight
        this.isProprietary = result.data.isProprietary
        this.supplierId = result.data.supplierId
        this.goodsNo = result.data.goodsNo
        this.styleNo = result.data.styleNo
        this.deliveryType = result.data.deliveryType
        this.deliveryRegion = result.data.deliveryRegion
        this.deliveryMinDays = result.data.deliveryMinDays
        this.deliveryMaxDays = result.data.deliveryMaxDays
        this.tariffType = result.data.tariffType
        this.productDetail = result.data.productDetail
        this.mainImgUrl = result.data.mainImgUrl
        this.keywords = result.data.keywords
        this.auditState = result.data.auditState
        this.auditor = result.data.auditor
        this.auditTime = result.data.auditTime
        this.saleState = result.data.saleState
        this.saleOnlineOperator = result.data.saleOnlineOperator
        this.saleOnlineTime = result.data.saleOnlineTime
        this.saleStopOperator = result.data.saleStopOperator
        this.saleStopTime = result.data.saleStopTime
        this.creator = result.data.creator
        this.createdTime = result.data.createdTime
        this.modifier = result.data.modifier
        this.updatedTime = result.data.updatedTime
        this.delFlag = result.data.delFlag
      } else {
        this.$message.error(result.msg)
      }
    }
  },

  data() {
    return {
      id: "",
      name: "",
      subName: "",
      prefixName: "--",
      suffixName: "--",
      code: "",
      brandId: "",
      categoryId: "",
      categoryCode: "",
      unitId: "",
      goodsWeight: "",
      isProprietary: "",
      supplierId: "",
      goodsNo: "",
      styleNo: "",
      deliveryType: "",
      deliveryRegion: "",
      deliveryMinDays: "",
      deliveryMaxDays: "",
      tariffType: "",
      productDetail: "",
      mainImgUrl: "",
      keywords: "",
      auditState: "",
      auditor: "",
      auditTime: "",
      saleState: "",
      saleOnlineOperator: "",
      saleOnlineTime: "",
      saleStopOperator: "",
      saleStopTime: "",
      creator: "",
      createdTime: "",
      modifier: "",
      updatedTime: "",
      delFlag: ""
    }
  }
}
</script>
<style>
.div-layout{
  padding: 10px 20px;
}
.td-colspan-label {
   text-align:right;font-size:12px
}
.td-colspan-value {
  text-align:left;font-size:12px;font-weight:550;
}
</style>

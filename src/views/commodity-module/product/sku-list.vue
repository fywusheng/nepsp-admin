<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" content="商品SKU管理"></el-page-header>
    <el-row style="height: 30px"><el-col :span="24"></el-col></el-row>
    <el-row>
      <el-col>
        <el-form :inline="true">
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="loadData(productId)" size="mini"
              >查 询</el-button
            >
            <el-button type="default" icon="el-icon-circle-plus-outline" @click="add" size="mini" :disabled='saleState'
              >新 增</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-table
      class="custom-table"
      :data="specSkuList"
      :header-cell-style="{ background: '#F2F6FC', color: '#000000' }"
      size="mini"
      v-loading="loading"
    >
      <div slot="empty" class="empty-wrap">
        <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
      </div>
      <el-table-column type="index" label="序号" align="center" width="50px"> </el-table-column>
      <el-table-column prop="id" label="SKU ID" align="center" width="180px"> </el-table-column>
      <el-table-column prop="specs" label="SKU规格" align="center"> </el-table-column>
      <el-table-column prop="code" label="SKU编码" align="center" width="180px"> </el-table-column>
      <el-table-column prop="productId" label="商品ID" align="center" width="180px"> </el-table-column>
      <el-table-column prop="supplierCode" label="供应商货号" width="100px" show-overflow-tooltip> </el-table-column>
      <el-table-column label="总库存/预锁" align="center" width="100px">
        <template slot-scope="scope">
          {{scope.row.stockBalance}}/{{scope.row.stockPreCost}}
        </template>
      </el-table-column>
      <el-table-column prop="stockWarning" label="预警库存" align="center" width="80px">
      </el-table-column>
      <el-table-column prop="markOffPrice" label="市场价" align="center" width="60px">
      </el-table-column>
      <el-table-column prop="sellingPrice" label="销售价" align="center" width="60px">
      </el-table-column>
      <el-table-column
        prop="createdTime"
        label="创建时间"
        align="center"
        width="150px"
      ></el-table-column>
      <el-table-column prop="delFlag" label="是否启用" align="center" width="80px">
        <template slot-scope="scope">
        <el-switch
          v-model="scope.row.delFlag"
          active-color="#67C23A"
          :active-value="0"
          inactive-color="#909399"
          :inactive-value="1"
          @change="resetting(scope.row)"
          :disabled='scope.row.saleState==5'
        >
        </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" align="center" width="100px">
        <template slot-scope="scope">
          <el-link
            :disabled='scope.row.saleState==5'
            icon="el-icon-edit"
            :underline="false"
            @click="edit(scope.row)"
            >编辑&nbsp;&nbsp;</el-link
          >
        </template>
      </el-table-column>
    </el-table>
    <edit-template ref="template"></edit-template>
    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>

    <table width="100%">
      <tr>
        <td></td>
      </tr>
      <tr>
        <td>
          <el-table
            class="custom-table"
            :data="specImgList"
            :header-cell-style="{ background: '#F2F6FC', color: '#000000' }"
            size="mini"
            @row-click="selectedRadio"
            v-loading="loading"
          >
            <div slot="empty" class="empty-wrap">
              <i class="iconfont icon-tishi"></i><span>未查到商品规格图数据，上传</span>
            </div>
            <el-table-column label="选择" align="center" width="50px">
              <template slot-scope="scope">
                <el-radio v-model="selectedRadioValue" :label="scope.row.firstClassAttrId" :disabled='scope.row.saleState==5'></el-radio>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" align="center"> </el-table-column>
            <el-table-column prop="firstClassAttrId" label="主规格ID" align="center" width="100px"> </el-table-column>
            <el-table-column prop="firstClassAttrName" label="主规格名" width="150px"> </el-table-column>
            <el-table-column prop="" label="规格图片">
              <template slot-scope="scope">
              <el-upload
                list-type="picture-card"
                :limit="2"
                accept="image/*"
                :file-list="scope.row.specImgUrlList"
                :before-upload="beforeAvatarUpload"
                :on-remove="handleRemove"
                :on-success="handleChange"
                :class="{hide:scope.row.hideUploadCard}"
                :auto-upload="true"
                :disabled='scope.row.saleState==5||scope.row.firstClassAttrId!=selectedRadioValue'
              >
                <i slot="default" v-if="scope.row.saleState==6" class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
              </template>
            </el-table-column>
          </el-table>
        </td>
      </tr>
    </table>
    <div slot="tip" class="el-upload__tip">
      <FONT color="red">规则：每个规格限制两张，只支持上传JPG/PNG格式，且不超过2MB</FONT>
    </div>
  </div>
</template>
<script>
import { fetch, post } from "@/utils/http-client"
import EditTemplate from "./sku-template"
// import { Row } from "element-ui"
export default {
  data() {
    return {
      specSkuList: [],
      specImgList: [],
      loading: false,
      searchParams: {},
      productId: this.$route.params.id,
      saleState: false,
      rowSelectedData: {},
      selectedRadioValue: ""
    }
  },
  components: {
    EditTemplate
  },
  async mounted() {
    this.loadData(this.$route.params.id)
  },

  methods: {
    back2Prev() {
      this.$router.back()
    },

    async loadData(productId) {
      this.loading = true
      this.specImgList = []
      const result = await fetch("/product/sku/list", {productId: productId})
      this.loading = false
      if (result.code === "200") {
        if (result.data){
          this.specSkuList = []
          result.data.forEach(ele => {
            if (ele.skuAndPriceList){
              ele.skuAndPriceList.forEach(s => {
                s.specs = ele.firstClassAttrName + "/" + s.subClassAttrName
                s.saleState = ele.saleState
                this.saleState = ele.saleState == 5
                this.specSkuList.push(s)
              })
              if (ele.imgUrlList&&ele.imgUrlList.length>0){
                ele.specImgUrlList = []
                var index = 0
                ele.imgUrlList.forEach(img => {
                  ele.specImgUrlList.push({name: index++, url: img})
                })
              }
              ele.hideUploadCard = ele.imgUrlList&&ele.imgUrlList.length>=3 ? true : false
            }
          })
          this.specImgList = result.data
        }
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
      const result = await post("/product/sku/resetting", row)
      if (result.code === "200") {
        this.loadData(row.productId)
      } else {
        this.$message.error(result.msg)
      }
    },

    selectedRadio(row){
      this.rowSelectedData = row
      this.selectedRadioValue = row.firstClassAttrId
    },

    async handleRemove(file, fileList) {
      if (this.rowSelectedData&&file&&/^http/.test(file.url)){
        var params = {
          productId: this.$route.params.id,
          firstClassAttrId: this.rowSelectedData.firstClassAttrId,
          url: file.url
        }
        const result = await post("/product/sku/image/delete", params)
        if (result.code === "200") {
          this.loadData(params.productId)
        } else {
          this.$message.error(result.msg)
        }
      }
      // else{
      //   this.$message.warning("删除SKU规格图失败！")
      // }
      //this.hideUploadCard = fileList.length >= 3;
    },
    async handleChange(response, file, fileList) {
      console.log("Upload response: " + JSON.stringify(response))
      if (response.code != 0){
        this.$message.warning("图片上传失败！")
        return false
      }
      if (this.rowSelectedData&&response.code == 0){
        var params = {
          productId: this.$route.params.id,
          firstClassAttrId: this.rowSelectedData.firstClassAttrId,
          url: response.data.absoluteUrl
        }
        const result = await post("/product/sku/image/add", params)
        if (result.code === "200") {
          this.loadData(params.productId)
        } else {
          debugger
          this.$message.error(result.msg)
        }
      } else {
        this.$message.warning("上传SKU规格图失败！")
      }
      //this.hideUploadCard = fileList.length >= 3 //通过change方法来改变hideUploadCard值
    },

    beforeAvatarUpload(file) {
      const isJPEG = file.name.split(".")[1] === "jpeg"
      const isJPG = file.name.split(".")[1] === "jpg"
      const isPNG = file.name.split(".")[1] === "png"
      const isLt500K = file.size / 1024 / 2000 < 2
      if (!isJPG && !isJPEG && !isPNG) {
        this.$message.error("上传图片只支持上传JPG/PNG格式!")
        return false
      }
      if (!isLt500K) {
        this.$message.error("单张图片大小不能超过2MB!")
        return false
      }
      return true
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
.hide .el-upload--picture-card {
  display: none;
}
</style>

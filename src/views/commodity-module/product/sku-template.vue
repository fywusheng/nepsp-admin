<template>
  <el-dialog
    class="dialog"
    :title="dataForm.id ? '编辑SKU' : '创建SKU'"
    width="900px"
    :visible.sync="showDialog"
  >
    <el-form
      class="data-form"
      :model="dataForm"
      :rules="dataRules"
      ref="dataForm"
      label-width="150px"
      label-position="right"
    >
      <el-row type="flex">
        <el-col :span="2"></el-col>
        <el-col :span="22">
          <el-table
            ref="spec_mytable"
            :data="attr_tableData"
            style="width: 100%; font-size: 10px"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column
              prop="name"
              label="规格项"
              width="100px"
            ></el-table-column>
            <el-table-column label="规格参数值">
              <div slot-scope="scope">
                <el-radio-group
                  @change="checkSpec(scope.row)"
                  v-model="scope.row.attrValSelected"
                  :disabled="scope.row.isReadonly"
                  size="small"
                >
                  <el-radio-button
                    v-for="attrVal in scope.row.attrValList"
                    :label="attrVal.id"
                    :key="attrVal.id"
                    style="font-size:10px"
                    >{{ attrVal.val }}
                  </el-radio-button>
                </el-radio-group>
              </div>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-form-item label="" prop="skuSpecsMap"></el-form-item>
      <el-form-item label="供应商货号" prop="supplierCode">
          <el-input
          v-model="dataForm.supplierCode"
          placeholder="请输入商家的货号..."
          style="width:100%"
          maxlength="32"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="库存" prop="stockBalance">
        <el-input
          v-model="dataForm.stockBalance"
          placeholder="请输入库存数量..."
          style="width:100%"
          maxlength="32"
          size="small"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-col :span="8">
        <el-input
          v-model="dataForm.price.sellingPrice"
          placeholder="请输入商品的销售价..."
          maxlength="32"
          size="small"
          style="width:95%"
        ></el-input>
        </el-col>
        <el-col :span="8">
        <el-input
          v-model="dataForm.price.costPrice"
          placeholder="请输入商品的成本价..."
          maxlength="32"
          size="small"
          style="width:95%"
        ></el-input>
        </el-col>
        <el-col :span="8" style="align:left">
        <el-input
          v-model="dataForm.price.markOffPrice"
          placeholder="请输入商品的市场价..."
          maxlength="32"
          size="small"
          style="width:100%;"
        ></el-input>
        </el-col>
      </el-form-item>
      <!-- <el-form-item label="SKU图片" prop="images">
        <el-upload
          list-type="picture-card"
          :limit="3"
          :file-list="fileList"
          :before-upload="beforeAvatarUpload"
          :on-remove="handleRemove"
          :on-success="handleChange"
          :class="{hide:hideUploadCard}"
          :auto-upload="true"
        >
          <i slot="default" class="el-icon-plus avatar-uploader-icon"></i>
          <div slot="tip" class="el-upload__tip">
            <FONT color="red">规则：限制三张，只支持上传JPG/PNG格式，且不超过2MB</FONT>
          </div>
        </el-upload>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="show(false)" size="small">取 消</el-button>
      <el-button
        type="success"
        :loading="sending"
        :disabled="sending"
        @click="save"
        size="small"
        >{{ sending ? "正在保存..." : "确 定" }}
      </el-button>
    </div>
  </el-dialog>
</template>
<script>
import Vue from "vue"
import { fetch, post } from "@/utils/http-client"

export default {
  name: "",
  data() {
    var validatorSkuSpec = (rule, value, callback) => {
      if (this.dataForm.skuSpecsMap){
        if (this.dataForm.skuSpecsMap.length==0){
          return callback(new Error("SKU规格属性不能为空，请选择..."))
        } else {
          return callback()
        }
      } else {
        return callback(new Error("SKU规格属性不能为空，请选择..."))
      }
    }
    var validatorSkuPrice = (rule, value, callback) => {
      if (this.dataForm.price.sellingPrice.length==0 || this.dataForm.price.costPrice.length==0 || this.dataForm.price.markOffPrice.length==0){
        return callback(new Error("SKU价格不能为空，请输入..."))
      } else {
        return callback()
      }
    }
    return {
      dialogTitle: "创建SKU",
      showDialog: false,
      sending: false,
      attr_tableData: [],
      dialogImageUrl: "",
      disabled: false,
      dataForm: {
        productId: this.$route.params.id,
        skuSpecsMap: new Map,
        supplierCode: "",
        stockBalance: "",
        price: {
          markOffPrice: "",
          costPrice: "",
          sellingPrice: ""
        }
      },
      dataRules: {
        skuSpecsMap: [
          { required: true, validator: validatorSkuSpec, trigger: "blur" }
        ],
        stockBalance: [
          { required: true, message: "请输入商品库存数量...", trigger: "blur" }
        ],
        price: [
          { required: true, validator: validatorSkuPrice, trigger: "blur" }
        ]
      }
    }
  },

  async mounted() {
    if (this.$route.params.id) {
      this.loadCategorySpec(this.$route.params.categoryNode, this.$route.params.id)
    }
  },
  methods: {
    show(flag, data) {
      this.showDialog = flag
      if (flag && data) {
        this.loadData(data.id)
      } else {
        this.dataForm.id = ""
        this.dataForm.skuSpecsMap = new Map
        this.dataForm.supplierCode = ""
        this.dataForm.stockBalance = ""
        this.dataForm.price.markOffPrice = ""
        this.dataForm.price.sellingPrice = ""
        this.dataForm.price.costPrice = ""
        this.fileList = []
        if (this.attr_tableData){
          this.attr_tableData.forEach((ele) => {
            ele.attrValSelected = ""
            ele.isReadonly = false
          })
        }
      }
    },
    async loadData(id) {
      const result = await fetch("/product/sku/loading", {skuId: id})
      if (result.code === "200") {
        this.dataForm.id = result.data.id
        this.dataForm.skuSpecsMap = result.data.skuSpecsMap
        this.dataForm.supplierCode = result.data.supplierCode
        this.dataForm.stockBalance = result.data.stockBalance
        this.dataForm.price.markOffPrice = result.data.markOffPrice
        this.dataForm.price.sellingPrice = result.data.sellingPrice
        this.dataForm.price.costPrice = result.data.costPrice
        if (this.attr_tableData&&this.dataForm.skuSpecsMap){
          this.attr_tableData.forEach((ele) => {
            for (const [key, value] of Object.entries(this.dataForm.skuSpecsMap)) {
              if (ele.id==key){
                ele.attrValSelected = value
                ele.isReadonly = true
              }
            } 
          })
        }
      } else {
        this.$message.error(result.msg) 
      }
    },

    async loadCategorySpec(categoryNode, productId) {
      var data = {categoryNode: categoryNode, attrType: 1, productId: productId}
      const result = await fetch("/attr/getProductAttrListByCategoryId", data)
      if (result.code != 200) {
        this.$message.error(result.msg)
        return
      }
      const resultArr = result.data
      resultArr.forEach((ele) => {
        if (!ele.hasOwnProperty("checkAll")) {
          this.$set(ele, "checkAll", false)
        }
        if (!ele.hasOwnProperty("attrValSelected")) {
          this.$set(ele, "attrValSelected", [])
        }
        if (!ele.hasOwnProperty("attrValList")) {
          this.$set(ele, "attrValList", [])
        }
        if (!ele.hasOwnProperty("isIndeterminate")) {
          this.$set(ele, "isIndeterminate", true)
        }
        if (!ele.hasOwnProperty("isReadonly")) {
          this.$set(ele, "isReadonly", false)
        }
      })
      this.attr_tableData = resultArr
    },

    checkSpec(data) {
      Vue.set(this.dataForm.skuSpecsMap, data.id, data.attrValSelected)
    },

    async save() {
      //console.log("##############: " + JSON.stringify(this.dataForm.skuSpecsMap))
      this.$refs.dataForm.validate(async(valid) => {
        if (valid) {
          const params = Object.assign({}, this.dataForm)
          const url = this.dataForm.id ? "/product/sku/update":"/product/sku/add"
          const result = await post(url, params)
          this.sending = false
          if (result.code === "200") {
            this.$message.success("商品SKU信息保存成功！")
            this.showDialog = false
            this.$parent.loadData(this.dataForm.productId)
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">

</style>

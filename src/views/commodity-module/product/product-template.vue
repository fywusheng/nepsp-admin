<template>
  <div class="div-layout">
    <el-page-header @back="back2Prev" content="创建/修改商品信息"></el-page-header>
    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-form
      class="data-form"
      :model="dataForm"
      :rules="dataRules"
      :v-loading="loading"
      ref="dataForm"
      label-position="top"
      size="small"
    >
    <el-divider content-position="left" style="width:80%">
      <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
      <font style="color:blue">基本信息</font>
    </el-divider>
    <el-row style="height: 20px">
      <el-col :span="24"></el-col>
    </el-row>
      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="商品名称" prop="name" class="item">
              <el-input
                :disabled="dataForm.saleState==5"
                v-model="dataForm.name"
                placeholder="请输入商品名称..."
                maxlength="32"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </td>
          <td width="50%" rowspan="4" align="center" valian="middle">
            <table width="100%">
              <tr>
                <td width="10%"></td>
                <td>
                <el-form-item prop="mainImgUrl">
                <el-upload
                  :disabled="dataForm.saleState==5"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :auto-upload="true">
                    <img v-if="dataForm.mainImgUrl" :src="dataForm.mainImgUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="商品简称(短名)" prop="subName" class="item">
              <el-input
                v-model="dataForm.subName"
                placeholder="请输入商品简称..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="名称前缀" prop="prefixName" class="item">
              <el-input
                v-model="dataForm.prefixName"
                placeholder="请输入商品名称前缀..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="名称后缀" prop="suffixName" class="item">
              <el-input
                v-model="dataForm.suffixName"
                placeholder="请输入商品名称后缀..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="搜索关键字" prop="keywords" class="item">
              <el-input
                v-model="dataForm.keywords"
                placeholder="请输入商品搜索关键字，多关键字以','隔开..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="商品推荐语" prop="summarized" class="item">
              <el-input
                v-model="dataForm.summarized"
                placeholder="请输入商品推荐语或卖点，50个字以内..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="所属品牌" prop="brandId" class="item">
              <el-select v-model="dataForm.brandId" collapse-tags filterable style="width:80%" placeholder="请选择商品所属品牌信息..." :disabled="dataForm.saleState==5">
                <el-option
                  v-for="item in brandOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="基础类目" prop="categoryNode" class="item">
              <el-cascader
                v-model="dataForm.categoryNode"
                :options="categoryOptions"
                placeholder="请选择商品所属类目信息..."
                :disabled="dataForm.saleState==5"
                @change="categorySelectionOnChange"
                :props="{value:'id',label:'name',leaf:'parentCode',children: 'children',expandTrigger: 'hover'}"
                style="width:80%"
              ></el-cascader>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="计量单位" prop="valuationUnit" class="item">
              <el-select v-model="dataForm.valuationUnit" placeholder="请选择商品计量单位..." :disabled="dataForm.saleState==5" style="width:80%">
                <el-option
                  v-for="item in valuationUnitOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="计量值" prop="unitVal" class="item">
              <el-input
                v-model="dataForm.unitVal"
                placeholder="请输入商品计量值..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
      </table>
      <el-divider content-position="left">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">供货信息</font>
      </el-divider>
      <el-row style="height: 20px">
        <el-col :span="24"></el-col>
      </el-row>
      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="供货方式" prop="suppliedType" class="item">
              <el-select v-model="dataForm.suppliedType" placeholder="请选择商品供货方式..." :disabled="dataForm.saleState==5" style="width:80%">
                <el-option
                  v-for="item in SuppliedTypeOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="所属商家" prop="supplierId" class="item">
              <el-select collapse-tags style="width:80%" v-model="dataForm.supplierId" placeholder="请选择商品所属供货商..." :disabled="dataForm.saleState==5">
                <el-option
                  v-for="item in supplierOptions"
                  :key="item.id"
                  :label="item.supplierName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
        </tr>

        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="商家货号" prop="goodsCode" class="item">
              <el-input
                v-model="dataForm.goodsCode"
                placeholder="请输入商家货号..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="商家款号" prop="styleCode" class="item">
              <el-input
                v-model="dataForm.styleCode"
                placeholder="请输入商家款号..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </td>
        </tr>

        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="发货地类型" prop="deliveryType" class="item">
              <el-select v-model="dataForm.deliveryType" style="width:80%" placeholder="请选择商品发货地类型..." :disabled="dataForm.saleState==5">
                <el-option
                  v-for="item in DeliveryTypeOptions"
                  :key="item.key"
                  :label="item.label"
                  :value="item.key"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="发货地" prop="deliveryRegion" class="item">
              <el-input
                v-model="dataForm.deliveryRegion"
                placeholder="请输入商品发货地城市名称..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="发货时长(N1至N2天送达)" prop="deliveryMinDays" class="item">
              <el-col :span="9">
              <el-input
                v-model="dataForm.deliveryMinDays"
                placeholder="请输入最小送达天数..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
              </el-col>
              <el-col :span="3">
                至
              </el-col>
              <el-col :span="9">
              <el-input
                v-model="dataForm.deliveryMaxDays"
                placeholder="请输入最大送达天数..."
                :disabled="dataForm.saleState==5"
                maxlength="32"
                style="width:80%"
              ></el-input>
              </el-col>
            </el-form-item>
          </td>
          <td width="50%">

          </td>
        </tr>
      </table>
      <el-divider content-position="left">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">属性参数</font>
      </el-divider>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <table width="100%">
        <tr>
          <td align="center">
            <el-table ref="attr_mytable" :data="attr_tableData" style="width:90%;font-size:12px">
              <el-form-item prop="attributeMap">
              <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
              <el-table-column prop="name" label="属性项" width="150px"></el-table-column>
              <el-table-column label="属性值">
                <div slot-scope="scope">

                  <el-radio-group v-if="scope.row.type===0" v-model="scope.row.attrValSelected" @change="checkAttr(scope.row)">
                    <el-radio v-for="attrVal in scope.row.attrValList" :label="attrVal.id" :key="attrVal.id" style="font-size:10px;width:70px;height:25px">{{ attrVal.val }}</el-radio>
                  </el-radio-group>

                  <el-checkbox
                    v-if="scope.row.type===1"
                    :indeterminate="scope.row.isIndeterminate"
                    v-model="scope.row.checkAll"
                    @change="checkAllAttr(scope.row)"
                  >全选</el-checkbox>
                  <el-checkbox-group
                    v-if="scope.row.type===1"
                    @change="checkAttr(scope.row)"
                    v-model="scope.row.attrValSelected"
                  >
                    <el-checkbox
                      v-for="attrVal in scope.row.attrValList"
                      :label="attrVal.id"
                      :key="attrVal.id"
                      style="font-size:10px"
                    >{{ attrVal.val }}</el-checkbox>
                  </el-checkbox-group>

                  <el-input v-if="scope.row.type===2" v-model="scope.row.attrValSelected" @change="checkAttr(scope.row)" maxlength="32" style="width:90%" placeholder="请输入自定义属性值！"></el-input>
                </div>
              </el-table-column>
              </el-form-item>
            </el-table>
          </td>
        </tr>
      </table>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <el-divider content-position="left">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">商品详情</font>
      </el-divider>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <table width="100%">
        <tr>
          <td style="width:5%"></td>
          <td align="center">
            <el-form-item prop="productDetail">
            <editor
              class="editor"
              id="editor"
              @onInit="initEditor"
              apiKey="n6lxhfc42kw4ihomm7bg3sm81oxv33otyiwukx8y15x8ncbd"
              v-model="dataForm.productDetail"
              style="width:100%"
              :init="editorOptions"
            ></editor>
            </el-form-item>
          </td>
          <td style="width:5%"></td>
        </tr>
      </table>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <el-divider content-position="left" v-if="dataForm.saleState==5">
        <i class="el-icon-postcard" style="color:blue"></i>&nbsp;
        <font style="color:blue">商品状态</font>
      </el-divider>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <table width="100%" v-if="dataForm.saleState==5">
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="销售状态" prop="saleState" class="item">销售中(销售中商品不可编辑)</el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="数据状态" prop="delFlag" class="item">正常</el-form-item>
          </td>
        </tr>
      </table>
    </el-form>
      <el-row style="height: 30px">
        <el-col :span="24"></el-col>
      </el-row>
      <el-row type="flex" style="height:30px;text-align:center">
        <el-col :span="24" style="align:center">
        <el-button @click="back2Prev">返回列表</el-button>
        <el-button
          v-if="dataForm.saleState!=5"
          type="success"
          :loading="sending"
          :disabled="sending"
          @click="save"
        >{{ sending ? '正在保存...' : '保存信息' }}</el-button>
        </el-col>
      </el-row>
  </div>
</template>
<script>
import Vue from "vue"
import { fetch, post } from "@/utils/http-client"
import Editor from "@/components/Tinymce"

export default {
  name: "",
  data() {
    // const validateAttributes = (rule, value, callback) => {
    //   if (value.size == 0) {
    //     callback(new Error("商品属性参数不能为空，请选择！"))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      dialogTitle: "新增岗位",
      loading: false,
      sending: false,
      templateTitle: "创建商品",
      brandOptions: [],
      attr_tableData: [],
      categoryOptions: [],
      categoryAttrList: [],
      supplierOptions: [],
      valuationUnitOptions: [
        {key: 1, label: "件"},
        {key: 2, label: "重量"},
        {key: 3, label: "体积"}
      ],
      SuppliedTypeOptions: [
        { key: 0, label: "平台自营" },
        { key: 1, label: "商家供货" }
      ],
      DeliveryTypeOptions: [
        {key: 0, label: "国内发货"},
        {key: 1, label: "香港发货"},
        {key: 2, label: "海外发货"}
      ],
      dataForm: {
        id: "",
        name: "",
        subName: "",
        prefixName: "",
        suffixName: "",
        code: "",
        keywords: "",
        summarized: "",
        goodsCode: "",
        styleCode: "",
        brandId: "",
        categoryId: "",
        categoryNode: [],
        valuationUnit: "",
        unitVal: "",
        suppliedType: "",
        supplierId: "",
        deliveryType: "",
        deliveryRegion: "",
        deliveryMinDays: "",
        deliveryMaxDays: "",
        tariffType: "",
        productDetail: "",
        mainImgUrl: "",
        delFlag: "",
        saleState: "",
        attributeMap: new Map
      },
      dataRules: {
        name: [{required: true, message: "商品名称不能为空，请完整输入！", trigger: "blur"}],
        subName: [{required: true, message: "商品简称不能为空，请完整输入！", trigger: "blur"}],
        brandId: [{required: true, message: "商品品牌不能为空，请选择品牌！", trigger: "blur"}],
        categoryNode: [{required: true, message: "商品类目不能为空，请选择类目！", trigger: "blur"}],
        valuationUnit: [{required: true, message: "计量单位不能为空，请选择！", trigger: "blur"}],
        unitVal: [{required: true, message: "商品计量值不能为空，请完整输入！", trigger: "blur"}],
        suppliedType: [{required: true, message: "商品供货方式不能为空，请完整输入！", trigger: "blur"}],
        deliveryType: [{required: true, message: "发货地类型不能为空，请选择！", trigger: "blur"}],
        deliveryMinDays: [{required: true, message: "最小配送时常不能为空，请完整输入！", trigger: "blur"}],
        deliveryMaxDays: [{required: true, message: "最大配送时常不能为空，请完整输入！", trigger: "blur"}],
        //mainImgUrl: [{required: true,message: "商品主图不能为空，请上传商品图片！",trigger: "blur"}],
        productDetail: [{required: true, message: "商品详情不能为空，请编辑输入！", trigger: "blur"}]
        //attributeMap: [{required: true,trigger: "blur",validator: validateAttributes}]
      },
      uploading: false,
      editorOptions: {
        height: 500,
        language: "zh_CN",
        branding: false,
        menubar: false,
        elementpath: false,
        plugins:
          "searchreplace autolink directionality visualblocks visualchars fullscreen link table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists imagetools textpattern emoticons autosave formatpainter",
        toolbar:
          `undo redo restoredraft | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | \
                     styleselect formatselect fontselect fontsizeselect | bullist numlist | blockquote removeformat | table charmap emoticons hr pagebreak insertdatetime`,
        fontsize_formats: "12px 14px 16px 18px 24px 36px 48px 56px 72px",
        font_formats:
          "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;知乎配置=BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;小米配置=Helvetica Neue,Helvetica,Arial,Microsoft Yahei,Hiragino Sans GB,Heiti SC,WenQuanYi Micro Hei,sans-serif",
        template_cdate_format: "[CDATE: %m/%d/%Y : %H:%M:%S]",
        template_mdate_format: "[MDATE: %m/%d/%Y : %H:%M:%S]",
        autosave_ask_before_unload: false,
        toolbar_mode: "wrap"
      }
    }
  },
  components: {
    Editor
  },
  async mounted() {
    this.loadBrandOptions()
    this.loadCategoryOptions()
    this.loadSupplierOptions()
    if (this.$route.params.id){
      this.loadData(this.$route.params.id)
    }
  },

  methods: {
    beforeEditorUpload() {
      this.uploading = true
    },
    uploadEditorSuccess(res) {
      if (!res.code) {
        return false
      }
      this.uploading = false
      if (res.code === 200) {
        this.editor.insertContent(
          `<img class="wscnph" src="${res.data.url}" >`
        )
      } else {
        this.$message.error(res.msg)
      }
    },
    initEditor(e, obj) {
      this.editor = obj
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

    async loadSupplierOptions() {
      const params = {
        pageNum: 1,
        pageSize: 1000
      }
      const result = await post("/srm/supplier/listByPageNo?pageNum=1&pageSize=1000", params)
      if (result.code === "200") {
        this.supplierOptions = result.data.list
      } else {
        this.$message.error(result.msg)
      }
    },

    checkAttr(data) {
      //console.log(JSON.stringify(data));
      if (data.type===0){ //单选框
        Vue.set(this.dataForm.attributeMap, data.id, data.attrValSelected)
      } else if (data.type===1){ //复选框
        data.isIndeterminate = data.attrValSelected.length !== data.attrValList.length
        data.checkAll = !data.isIndeterminate
        Vue.set(this.dataForm.attributeMap, data.id, data.attrValSelected.join(","))
      } else if (data.type===2){ //输入框
        Vue.set(this.dataForm.attributeMap, data.id, data.attrValSelected)
      } else {
        console.warn("不支持改类型！")
      }
    },

    checkAllAttr(data) {
      if (data.checkAll){
        const ids = []
        data.attrValList.forEach(attr => {
          ids.push(attr.id)
        })
        data.attrValSelected = ids
        data.isIndeterminate = false
      } else {
        data.attrValSelected = []
        data.isIndeterminate = true
      }
      Vue.set(this.dataForm.attributeMap, data.id, data.attrValSelected.join(","))
    },

    async categorySelectionOnChange(val, attributes) {
      var data = { categoryNode: val.join(","), attrType: 2 }
      const result = await fetch("/attr/getProductAttrListByCategoryId", data)
      if (result.code != 200) {
        this.$message.error(result.msg)
        return
      }
      const resultArr = result.data
      resultArr.forEach(ele => {
        if (!ele.hasOwnProperty("checkAll")) {
          this.$set(ele, "checkAll", false)
        }
        if (!ele.hasOwnProperty("attrValSelected")) {
          if (ele.type===2||ele.type===0){
            this.$set(ele, "attrValSelected", "")
          } else {
            this.$set(ele, "attrValSelected", [])
          }
        }
        if (attributes){
          attributes.forEach(attr => {
            if (ele.id==attr.attrId){
              if (ele.type===0){
                ele.attrValSelected = Number(attr.attrValIds)
                Vue.set(this.dataForm.attributeMap, ele.id, ele.attrValSelected)
                console.log("radio value: " + attr.attrValIds)
              } else if (ele.type===1){
                var attrValSelected = []
                attr.attrValIds.split(",").forEach(valId => {
                  attrValSelected.push(Number(valId))
                })
                ele.attrValSelected = attrValSelected
                Vue.set(this.dataForm.attributeMap, ele.id, attrValSelected.join(","))
              } else if (ele.type===2){
                ele.attrValSelected = attr.attrValContent
                Vue.set(this.dataForm.attributeMap, ele.id, ele.attrValSelected)
              }
            }
          }) 
        } 
        if (!ele.hasOwnProperty("attrValList")) {
          this.$set(ele, "attrValList", [])
        }
        if (!ele.hasOwnProperty("isIndeterminate")) {
          this.$set(ele, "isIndeterminate", true)
        }
      })
      this.attr_tableData = resultArr
    },

    async loadData(productId) {
      if (productId&&productId==-1){
        return
      }
      this.loading = true
      const result = await fetch("/product/getByPK", {productId: productId})
      this.loading = false
      if (result.code === "200") {
        const dataForm = {
          id: result.data.id,
          name: result.data.name,
          subName: result.data.subName,
          prefixName: result.data.prefixName,
          suffixName: result.data.suffixName,
          code: result.data.code,
          keywords: result.data.keywords,
          summarized: result.data.summarized,
          goodsCode: result.data.goodsCode,
          styleCode: result.data.styleCode,
          brandId: result.data.brandId,
          categoryId: result.data.categoryId,
          categoryNode: result.data.categoryNode.split(",").splice(1, 3),
          valuationUnit: result.data.valuationUnit,
          unitVal: result.data.unitVal,
          suppliedType: result.data.suppliedType,
          supplierId: result.data.supplierId,
          deliveryType: result.data.deliveryType,
          deliveryRegion: result.data.deliveryRegion,
          deliveryMinDays: result.data.deliveryMinDays,
          deliveryMaxDays: result.data.deliveryMaxDays,
          tariffType: result.data.tariffType,
          productDetail: result.data.productDetail,
          mainImgUrl: result.data.mainImgUrl,
          delFlag: result.data.delFlag,
          attributes: result.data.attributes,
          saleState: result.data.saleState,
          attributeMap: new Map
        }
        this.dataForm = dataForm
        this.categorySelectionOnChange(dataForm.categoryNode, dataForm.attributes)
      } else {
        this.$message.error(result.msg)
      }
    },
    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          this.dataForm.categoryNode = "1," + this.dataForm.categoryNode.join(",")
          const params = Object.assign({}, this.dataForm)
          console.log(JSON.stringify(params))
          var url = this.dataForm.id?"/product/update":"/product/add"
          const result = await post(url, params)
          this.sending = false
          if (result.code === "200") {
            this.$message.success("商品信息保存成功！")
            this.back2Prev()
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
    },

    back2Prev() {
      this.$router.back()
    },

    handleAvatarSuccess(response, file) {
      if (response.code != 0){
        return
      }
      this.dataForm.mainImgUrl = file.response.data.absoluteUrl
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg"
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!")
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!")
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .div-layout {
    padding: 10px 20px;
  }
  .avatar-uploader .el-upload {
    border: 0.5px dashed #5f5d5d;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #609df3;
    width: 300px;
    height: 300px;
    line-height: 300px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height: 300px;
    display: block;
  }
  .item .el-form-item__label{
      height: 35px;
  }
</style>
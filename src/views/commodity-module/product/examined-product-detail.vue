<template>
    <el-dialog
      class="dialog"
      title="商品详情"
      width="70%"
      :visible.sync="visible"> 

      <div class="dialog-content">
        <el-row>
          <el-col :span="12">
            <el-descriptions title="基础信息" :column="1">
              <el-descriptions-item label="商品名称">{{productInfo.name}}</el-descriptions-item>
              <el-descriptions-item label="商品简称">{{productInfo.subName}}</el-descriptions-item>
              <el-descriptions-item label="名称前缀">{{productInfo.prefixName}}</el-descriptions-item>
              <el-descriptions-item label="名称后缀">{{productInfo.suffixName}}</el-descriptions-item>
              <el-descriptions-item label="搜索关键字">{{productInfo.keywords}}</el-descriptions-item>
              <el-descriptions-item label="商品推荐语">{{productInfo.summarized}}</el-descriptions-item>
              <el-descriptions-item label="所属品牌">{{productInfo.brandName}}</el-descriptions-item>
              <el-descriptions-item label="计量单位">
                <span v-if="productInfo.valuationUnit === 1">件</span>
                <span v-if="productInfo.valuationUnit === 2">重量</span>
                <span v-if="productInfo.valuationUnit === 3">体积</span>
              </el-descriptions-item>
              <el-descriptions-item label="计量值">{{productInfo.unitVal}}</el-descriptions-item>
            </el-descriptions>
          </el-col>
          <el-col :span="12">
            <div class="img-wrapper">
                <el-image style="width: 300px; height: 300px" :src="productInfo.mainImgUrl" fit="fit">
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline" style="font-size: 300px;"></i>
                  </div>
                </el-image>
            </div>
          </el-col>
        </el-row>

        <el-descriptions title="供货信息" :column="2">
            <el-descriptions-item label="供货方式">
              <span v-if="productInfo.suppliedType === 0">自营</span>
              <span v-else-if="productInfo.suppliedType === 1">商家</span>
              <span v-else>--</span>
            </el-descriptions-item>
            <el-descriptions-item label="所属商家">{{productInfo.supplierName}}</el-descriptions-item>
            <el-descriptions-item label="商家货号">{{productInfo.goodsCode}}</el-descriptions-item>
            <el-descriptions-item label="商家款号">{{productInfo.styleCode}}</el-descriptions-item>
            <el-descriptions-item label="发货地类型">
              <span v-if="productInfo.deliveryType === 0">国内发货</span>
              <span v-else-if="productInfo.deliveryType === 1">香港发货</span>
              <span v-else-if="productInfo.deliveryType === 2">海外发货</span>
              <span v-else>--</span>
              </el-descriptions-item>
            <el-descriptions-item label="发货地">{{productInfo.deliveryRegion}}</el-descriptions-item>
            <el-descriptions-item label="发货时长">{{productInfo.deliveryMinDays}} - {{productInfo.deliveryMinDays}}</el-descriptions-item>
        </el-descriptions>

        <el-descriptions title="属性参数" :column="2"></el-descriptions>
        <el-table
            :data="productInfo.attributes"
            :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
            size="mini"
          >
          <el-table-column type="index" label="序号" width="80px" align="center" />
          <el-table-column prop="attrName" label="属性项" align="center" show-overflow-tooltip/>
          <el-table-column prop="attrValContent" label="属性值" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span >{{scope.row.attrValContent.split(',').join(';')}}</span>
            </template>
          </el-table-column>
        </el-table>
        
        <el-descriptions title="商品详情" :column="1" :colon="false">
          <el-descriptions-item label=" ">
          <div v-html="productInfo.productDetail"></div> 
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible = false">关闭</el-button>
      </div>
    </el-dialog>
</template>
<script>

export default {
  name: "ProductDetail",
  props: {
    productInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false
    }
  },
  mounted() {
  },
  methods: {
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
  .dialog-content {
    height: 55vh;
    overflow: auto;
    .img-wrapper {
      width: 100%;
      height: 100%;
      margin-top: 42px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
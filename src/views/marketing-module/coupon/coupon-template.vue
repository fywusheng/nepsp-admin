<template>
  <div class="div-layout">
    <!-- <el-page-header @back="back2Prev" content="创建/修改优惠券"></el-page-header> -->
    <el-row style="height: 20px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-form
      class="data-form"
      :model="dataForm"
      :rules="dataRules"
      :v-loading="loading"
      ref="dataForm"
      label-width="150px"
      label-position="top"
      size="small"
    >
    <el-divider content-position="left" style="width:80%">
      <i class="el-icon-postcard" style="color:blue"></i>
      <font style="color:blue">基本信息</font>
    </el-divider>
    <el-row style="height: 20px">
      <el-col :span="24"></el-col>
    </el-row>
    <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="40%">
            <el-form-item label="优惠券名称" prop="name">
                <el-input v-model="dataForm.name" :disabled="dataForm.approveState==1" placeholder="请输入优惠券名称..." maxlength="64" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="优惠券类型" prop="type">
                <template>
                <el-radio-group v-model="dataForm.type" :disabled="dataForm.approveState==1">
                    <el-radio :label="0">满减券</el-radio>
                    <el-radio :label="1">折扣券</el-radio>
                    <!-- <el-radio :label="2">代金券</el-radio> -->
                </el-radio-group>
                </template>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="优惠券面额" prop="denomination">
                <el-input v-model="dataForm.denomination" :disabled="dataForm.approveState==1" placeholder="请输入优惠券面额..." maxlength="5" oninput="value=value.replace(/[^\d.]/g,'')" style="width:80%">
                  <template v-if="dataForm.type==0" slot="prepend">减</template>
                  <template v-if="dataForm.type==1" slot="prepend">打</template>
                  <template v-if="dataForm.type==0" slot="append">元</template>
                  <template v-if="dataForm.type==1" slot="append">折</template>
                </el-input>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="发放数量" prop="num">
                <el-input v-model="dataForm.num" :disabled="dataForm.approveState==1" placeholder="请输入优惠券发放数量..." maxlength="60" style="width:80%"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="使用门槛" prop="checkThreshold">
                <template>
                <el-radio-group v-model="dataForm.checkThreshold" :disabled="dataForm.approveState==1">
                    <el-radio :label="0" style="display:block;height:40px">无门槛</el-radio>
                    <el-radio :label="1" style="display:block;height:50px">订单满：
                    <span style="margin-top:0px">
                      <el-input :disabled="dataForm.checkThreshold==0 || dataForm.approveState==1" v-model="dataForm.thresholdValue" maxlength="6" style="width:80%"><template slot="append">元可用</template></el-input>
                    </span>
                    </el-radio>
                </el-radio-group>
                </template>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="优惠券规则" prop="description">
                <el-input v-model="dataForm.description" :disabled="dataForm.approveState==1" placeholder="请输入优惠券使用规则..."  maxlength="256" type="textarea" rows="3" style="width:80%"></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="发放方式" prop="gettingMethod">
                <template>
                <el-radio-group v-model="dataForm.gettingMethod" :disabled="dataForm.approveState==1">
                    <el-radio :label="2">系统发放</el-radio>
                    <el-radio :label="1">会员领取</el-radio>
                </el-radio-group>
                </template>
            </el-form-item>
          </td>
          <td width="50%">
            <!-- <el-form-item label="是否允许转赠" prop="shareState">
                <el-checkbox v-model="dataForm.shareState" :disabled="dataForm.approveState==1" :true-label=1 :false-label=0 border>允许转增好友</el-checkbox>
            </el-form-item> -->
          </td>
        </tr>
    </table>
    <el-row style="height: 10px">
      <el-col :span="24"></el-col>
    </el-row>
      <el-divider content-position="left">
      <i class="el-icon-postcard" style="color:blue"></i>
      <font style="color:blue">适用商品</font>
      </el-divider>
      <el-row style="height: 10px">
        <el-col :span="24"></el-col>
      </el-row>
      <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="" prop="goodsScope">
            <template>
                <el-radio-group v-model="dataForm.goodsScope" :disabled="dataForm.approveState==1" @change="goodsScopeOnchange" >
                    <el-radio :label="0">适用所有商品</el-radio>
                    <el-radio :label="1">适用指定商品</el-radio>
                    <el-radio :label="2">禁用指定商品</el-radio>
                </el-radio-group>
            </template>
            </el-form-item>
          </td>
          <td width="50%">
            <!-- <span v-if="dataForm.goodsScope===1">
              <el-link type="primary" @click="addProduct(1)"><i class="el-icon-circle-plus">&nbsp;&nbsp;导入适用商品列表</i></el-link>
            </span>
            <template v-if="dataForm.goodsScope===2">
              <el-link type="primary" @click="addProduct(2)"><i class="el-icon-circle-plus">&nbsp;&nbsp;导入禁用商品列表</i></el-link>
            </template> -->
          </td>
        </tr>
       <!-- <tr v-if="dataForm.goodsScope==1||dataForm.goodsScope==2">
          <td width="5%"></td>
          <td colspan="2">
                <el-form-item label="">
                  <el-input
                    placeholder="请输入商品ID..."
                    clearable
                    size="mini"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="el-icon-search" @click="loadData" size="mini">查询</el-button>
                </el-form-item>
          </td>
       </tr> -->
       <tr v-if="dataForm.goodsScope==1||dataForm.goodsScope==2">
          <td width="5%"></td>
          <td colspan="2">
          <el-table
            class="custom-table"
            :data="currentRecords"
            :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
            size="mini"
            v-loading="loading"
            style="width:100%"
          >
            <div slot="empty" class="empty-wrap">
              <i class="iconfont icon-tishi"></i><span>系统暂无数据</span>
            </div>
            <el-table-column type="index" label="序号" width="45px" align="center"></el-table-column>
            <el-table-column label="LOGO" align="center" width="60px">
              <template slot-scope="scope">
                <img :src="scope.row.mainImgUrl" width="30px" height="30px"/>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="商品ID" align="center" width="180px"> </el-table-column>
            <el-table-column prop="name" label="商品名称"> </el-table-column>
            <el-table-column prop="code" label="商品编码" align="center" width="180px"></el-table-column>
            <el-table-column align="center" width="350px">
              <template slot="header">
                <!-- <el-input v-model="product.id" size="mini" style="width:150px" placeholder="输入商品ID搜索"/>
                <el-button type="primary" icon="el-icon-search" @click="loadData" size="mini">查询</el-button> -->
                <el-button type="default" icon="el-icon-circle-plus-outline" @click="showGoodsList()" :disabled="dataForm.approveState==1" size="mini">导入</el-button>
              </template>
              <template slot-scope="scope">
                <el-link
                  icon="el-icon-view"
                  :underline="false"
                  @click="removeProduct(scope.row)"
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
            style="width:95%"
          >
          </el-pagination>
          </td>
        </tr>
      </table>
    <!-- <el-divider content-position="left" style="width:80%">
      <i class="el-icon-postcard" style="color:blue"></i>
      <font style="color:blue">成本归属</font>
    </el-divider>
    <el-row style="height: 20px">
      <el-col :span="24"></el-col>
    </el-row>
    <table width="100%">
        <tr>
          <td width="5%"></td>
          <td width="45%">
            <el-form-item label="成本部门" prop="costOwner">
                <el-input v-model="dataForm.costOwner" placeholder="请输入优惠券申请者(成本归属部门及申请人)..." maxlength="60" style="width:80%"></el-input>
            </el-form-item>
          </td>
          <td width="50%">
            <el-form-item label="优惠券用途" prop="purpose">
                <el-input v-model="dataForm.purpose" placeholder="请输入优惠券用途描述..." maxlength="120" style="width:80%"></el-input>
            </el-form-item>
          </td>
        </tr>
    </table> -->
    </el-form>
    <coupon-goods-template ref="goodsTemplate"  v-on:addGoodsList="addGoodsList"></coupon-goods-template>
    <el-row style="height: 30px">
      <el-col :span="24"></el-col>
    </el-row>

      <el-row type="flex" style="height:100px;text-align:center">
        <el-col :span="22">
        <el-button @click="back2Prev()">返 回</el-button>
        <el-button type="success" :loading="sending" :disabled="dataForm.approveState==1||sending" @click="save">
          {{sending ?
          '正在保存...':'提 交'}}
        </el-button>
        </el-col>
        <el-col :span="2"></el-col>
      </el-row>
  </div>
</template>
<script>
import { fetch, post } from "@/utils/http-client"
import CouponGoodsTemplate from "./coupon-goods"

export default {
  components: {
    CouponGoodsTemplate
  },
  name: "",
  data() {
    return {
      dialogTitle: "新增优惠券",
      loading: false,
      sending: false,
      dialogVisible: false,
      currentRecords: [],
      totalRecords: [],
      pageNo: 1,
      pageSize: 10,
      totalCount: 0,
      oldGoodsScope: "",
      product: {
        id: ""
      },
      dataForm: {
        name: "",
        type: 0,
        denomination: "",
        num: "",
        description: "",
        //costOwner: '',
        //purpose:'',
        checkThreshold: 0,
        thresholdValue: "",
        gettingMethod: 0,
        approveState: 0,
        approveStateLabel: "",
        shareState: 1,
        goodsScope: 0,
        productList: []
      },
      dataRules: {
        name: [{required: true, message: "优惠券名称不能为空，请输入！", trigger: "blur"}],
        type: [{required: true, message: "优惠券类型不能为空，请选择！", trigger: "blur"}],
        denomination: [{required: true, message: "优惠券面值不能为空，请输入！", trigger: "blur"}],
        num: [{required: true, message: "优惠券发放数量不能为空，请输入！", trigger: "blur"}],
        description: [{required: true, message: "优惠券使用规则不能为空，请输入！", trigger: "blur"}],
        //costOwner: [{required: true, message: "优惠券申请者(成本部门及申请人)不能为空，请输入！",trigger: "blur"}],
        //purpose: [{required: true, message: "优惠券用途描述不能为空，请输入！",trigger: "blur"}],
        gettingMethod: [{required: true, message: "优惠券发放方式不能为空，请选择！", trigger: "blur"}],
        checkThreshold: [{required: true, message: "优惠券使用门槛不能为空，请选择！", trigger: "blur"}]
      }
    }
  },

  async mounted() {
    if (this.$route.params.id==-1){
      this.dataForm.id = ""
    } else {
      this.loadData(this.$route.params.id)
    }
  },

  methods: {
    show(flag, data) {
      this.showDialog = flag
      if (flag && data) {
        this.loadData(data.id)
      } else {
        this.dataForm.id = ""
        this.dataForm.thresholdValue = ""
        this.dataForm.approveState = 0
      }
      this.$nextTick(() => {
        this.$refs.dataForm.resetFields()
      })
    },

    //设置当前页面数据，对数组操作的截取规则为[0~10],[10~20]...,
    setCurrentPageData() {
      const begin = (this.pageNo - 1) * this.pageSize
      const end = this.pageNo * this.pageSize
      this.currentRecords = this.totalRecords.slice(begin, end)
    },
    changePage(pageNo) {
      this.pageNo = pageNo
      this.setCurrentPageData()
    },
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.pageNo = 1
      this.setCurrentPageData()
    },

    formatApproveState: function(row, column) {
      return row.approveState === 0 ? "待审核" : row.approveState === 1 ? "审核通过" : row.approveState === -1 ? "草稿" : row.approveState === -2 ? "审核不通过" : "--"
    },
    async loadData(id) {
      this.loading = true
      const result = await fetch("/marketing/coupon/loading", {couponId: id})
      this.loading = false
      if (result.code == 200) {
        this.dataForm.id = result.data.id
        this.dataForm.name = result.data.name
        this.dataForm.type = result.data.type
        this.dataForm.denomination = result.data.denomination
        this.dataForm.num = result.data.num
        this.dataForm.description = result.data.description
        //this.dataForm.costOwner = result.data.costOwner
        //this.dataForm.purpose = result.data.purpose
        this.dataForm.checkThreshold = result.data.checkThreshold
        this.dataForm.thresholdValue = result.data.thresholdValue
        this.dataForm.gettingMethod = result.data.gettingMethod
        this.dataForm.shareState = result.data.shareState
        this.dataForm.approveState = result.data.approveState
        this.dataForm.goodsScope = result.data.goodsScope
        this.oldGoodsScope = result.data.goodsScope
        this.dataForm.approveStateLabel = this.formatApproveState(result.data, null)
        this.dataForm.productList = result.data.productList,
        this.addGoodsList(this.dataForm.productList)
      } else {
        this.$message.error(result.msg)
      }
    },

    goodsScopeOnchange(){
      this.totalRecords = []
      this.currentRecords = []
      this.totalCount = 0
      if (this.oldGoodsScope===this.dataForm.goodsScope){
        this.addGoodsList(this.dataForm.productList)
      }
    },
    showGoodsList() {
      this.$refs.goodsTemplate.show(true)
    },

    async addGoodsList(data) {
      if (!data) { return }
      let list = [...this.totalRecords, ...data]
      list = list.reduce((prev, item) => {
        const cur = prev.find(i => i.id === item.id)
        if (cur) {
          return prev
        }
        return [...prev, item]
      }, [])
      this.totalRecords= list
      this.totalCount = this.totalRecords.length
      this.changePage(1)
    },

    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          this.dataForm.productList = this.totalRecords
          const params = Object.assign({}, this.dataForm)
          const url = this.dataForm.id?"/marketing/coupon/update":"/marketing/coupon/add"
          const result = await post(url, params)
          this.sending = false
          if (result.code == 200) {
            this.$message.success("保存优惠券成功！")
            this.back2Prev()
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
    },

    async removeProduct(product){
      if (product){
        this.totalRecords.some((item, index) => {
          if (item.id==product.id){
            this.totalRecords.splice(index, 1)
            return true
          }
        })
        this.totalCount = this.totalRecords.length
        this.changePage(1)
        this.$message.success("商品移除成功，提交保存后生效！")
      } else {
        this.$message.error("商品移除失败，请刷新列表后重试！")
      }
    },

    back2Prev() {
      this.$router.back()
    }
  }
}
</script>
<style lang="scss" scoped>
  .div-layout {
    padding: 10px 20px;
    background: #ffffff;
  }
</style>

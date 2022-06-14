<template>
  <div class="div-layout">
    <el-form ref="dataForm" :model="dataForm" :rules="dataRules">
    <!-- <el-page-header @back="back2Prev" content="类目规格配置"></el-page-header> -->
    <!-- <el-row style="height:30px">
      <el-col :span="24"></el-col>
    </el-row> -->
    <el-divider content-position="left">
      <i class="el-icon-postcard"></i>&nbsp;类目规格参数
    </el-divider>
    <el-row style="height:30px">
      <el-col :span="24"></el-col>
    </el-row>
    <table width="100%">
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="30%">
          <el-form-item label="当前类目：">
            {{this.$route.params.name}}
          </el-form-item>
        </td>
        <td width="60%">
          <el-form-item label="请选择商品SKU规格参数：" prop="specIdsSelected">
          <el-select
            multiple
            v-model="dataForm.specIdsSelected"
            style="margin-left:10px;width:300px"
            @change="specSelectionOnChange"
            :multiple-limit="2"
            placeholder="请选择商品SKU规格项，必须选2个..."
          >
            <el-option v-for="item in filterSpecsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          </el-form-item>
        </td>
        <td width="5%"></td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td align="center" colspan="2"></td>
        <td width="5%"></td>
      </tr>
      <tr style="height:100px">
        <td width="5%"></td>
        <td align="center" colspan="2">
          <el-table
            ref="spec_mytable"
            :data="spec_tableData"
            style="width:100%;font-size:10px"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="规格项" width="150px"></el-table-column>
            <el-table-column label="规格参数值">
              <div slot-scope="scope">
                <el-checkbox :indeterminate="scope.row.isIndeterminate" v-model="scope.row.checkAll" @change="checkAllSpec(scope.row)">全选</el-checkbox>
                <el-checkbox-group @change="checkSpec(scope.row)" v-model="scope.row.attrValSelected">
                  <el-checkbox v-for="attrVal in scope.row.attrValList"
                               :label="attrVal.id"
                               :key="attrVal.id"
                               style="font-size:10px">{{ attrVal.val }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-table-column>
          </el-table>
        </td>
        <td width="5%"></td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td align="center" colspan="2"></td>
        <td width="5%"></td>
      </tr>
    </table>

    <el-row style="height:30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-divider content-position="left">
      <i class="el-icon-postcard"></i>&nbsp;类目属性参数
    </el-divider>
    <el-row style="height:30px">
      <el-col :span="24"></el-col>
    </el-row>
    <table width="100%">
      <tr style="height:40px">
        <td width="5%"></td>
        <td width="30%">
          <el-form-item label="当前类目：">
            {{this.$route.params.name}}
          </el-form-item>
          </td>
        <td width="60%">
          <el-form-item label="请选择商品普通属性参数：" prop="attrIdsSelected">
          <el-select
            multiple
            v-model="dataForm.attrIdsSelected"
            style="margin-left:10px;width:300px"
            @change="attrSelectionOnChange"
            :multiple-limit="10"
            placeholder="请选择商品普通属性项,最多10个..."
          >
            <el-option v-for="item in filterAttrsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          </el-form-item>
        </td>
        <td width="5%"></td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td align="center" colspan="2"></td>
        <td width="5%"></td>
      </tr>
      <tr style="height:100px">
        <td width="5%"></td>
        <td align="center" colspan="2">
          <el-table
            ref="attr_mytable"
            :data="attr_tableData"
            style="width:100%;font-size:10px"
          >
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column prop="name" label="属性项" width="150px"></el-table-column>
            <el-table-column label="属性参数值">
              <div slot-scope="scope">
                <el-checkbox :indeterminate="scope.row.isIndeterminate" v-model="scope.row.checkAll" @change="checkAllAttr(scope.row)">全选</el-checkbox>
                <el-checkbox-group @change="checkAttr(scope.row)"  v-model="scope.row.attrValSelected">
                  <el-checkbox v-for="attrVal in scope.row.attrValList"
                               :label="attrVal.id"
                               :key="attrVal.id"
                               style="font-size:10px">{{ attrVal.val }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </el-table-column>
          </el-table>
        </td>
        <td width="5%"></td>
      </tr>
      <tr style="height:40px">
        <td width="5%"></td>
        <td align="center" colspan="2"></td>
        <td width="5%"></td>
      </tr>
    </table>
    <el-row style="height:30px">
      <el-col :span="24"></el-col>
    </el-row>
    <el-row style="height:30px">
      <el-col :span="24"></el-col>
    </el-row>
    <table width="100%">
      <tr style="height:40px">
        <td width="5%"></td>
        <td align="center" colspan="2">
          <el-button @click="back2Prev">返回</el-button>
          <el-button type="success" :loading="sending" :disabled="sending" @click="save">
            {{ sending ? '正在保存...' : '保存' }}
          </el-button>
        </td>
        <td width="5%"></td>
      </tr>
    </table>
    <el-row style="height:30px">
      <el-col :span="24"></el-col>
    </el-row>
    </el-form>
  </div>
</template>

<script>
import { fetch, post } from "@/utils/http-client"

export default {
  data() {
    var validatorSpecSelected = (rule, value, callback) => {
      if (this.dataForm.specIdsSelected.length !== 2){
        return callback(new Error("商品规格不能为空,标准规格必须选中两个选项,请正确选择..."))
      } else {
        if (this.spec_tableData&&this.spec_tableData.length>0){
          this.spec_tableData.forEach(ele => {
            if (ele.attrValSelected.length>25){
              return callback(new Error("商品规格参数不能为空并且最大选中不能超过25个,请正确选择..."))
            } else {
              return callback()
            }
          })
        } else {
          return callback(new Error("商品规格参数不能为空,请配置后选择..."))
        }
      }
    }
    var validatorAttrSelected = (rule, value, callback) => {
      if (this.dataForm.attrIdsSelected.length===0||this.dataForm.attrIdsSelected.length>10){
        return callback(new Error("商品属性参数不能为空同时只支持最多十个参数选项，请正确选择..."))
      } else {
        if (this.attr_tableData&&this.attr_tableData.length>0){
          this.attr_tableData.forEach(ele => {
            if (ele.attrValSelected && ele.attrValSelected.length>50){
              return callback(new Error("商品属性参数不能为空并且最大选中不能超过50个,请正确选择..."))
            } else {
              return callback()
            }
          })
        } else {
          return callback(new Error("商品属性参数不能为空,请配置后选择..."))
        }
      }
    }
    return {
      attrList: [],
      specSelected: [],
      spec_tableData: [],
      attrSelected: [],
      attr_tableData: [],
      sending: false,
      space_color: true, //隔行变色
      dataForm: {
        specIdsSelected: [],
        attrIdsSelected: []
      },
      dataRules: {
        specIdsSelected: [
          {
            required: true,
            validator: validatorSpecSelected,
            trigger: "blur"
          }
        ],
        attrIdsSelected: [
          {
            required: true,
            validator: validatorAttrSelected,
            trigger: "blur"
          }
        ]
      }
      
    }
  },

  async mounted() {
    this.loadAttrListData()
    //确保方法在页面渲染后调用
    this.$nextTick(function() {
      this.tableRowClassName(this.$refs.spec_mytable)
    })
    this.$nextTick(function() {
      this.tableRowClassName(this.$refs.attr_mytable)
    })
  },

  computed: {
    filterSpecsList(){
      var filterAttrList = []
      if (this.attrList){
        filterAttrList = this.attrList.filter(attr => attr.specsState===1)
      }
      return filterAttrList
    },
    filterAttrsList(){
      var filterAttrList = []
      if (this.attrList){
        filterAttrList = this.attrList.filter(attr => attr.specsState===0)
      }
      return filterAttrList
    }
  },
  methods: {
    checkSpec(data) {
      data.isIndeterminate = data.attrValSelected.length !== data.attrValList.length
      data.checkAll = !data.isIndeterminate
    },
    checkAttr(data) {
      data.isIndeterminate = data.attrValSelected.length !== data.attrValList.length
      data.checkAll = !data.isIndeterminate
    },
    checkAllSpec(data) {
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
    },
    async loadAttrListData() {
      const result = await fetch("/attr/listByPageNo?pageNum=1&pageSize=1000", {})
      if (result.code === "200") {
        this.attrList = result.data.list
      } else {
        this.$message.error(result.msg)
      }
      this.loadCategoryAttrListData(1)
      this.loadCategoryAttrListData(2)
    },

    async loadCategoryAttrListData(type) {
      const result = await fetch("/attr/getAttrListByCategoryId?attrType=" + type + "&categoryId=" + this.$route.params.id, {})
      if (result.code === "200" && result.data!=null) {
        var resultArray = []
        if (1==type){
          this.specSelected = result.data
          // var resultArray = []
          this.specSelected.filter(function(item){
            resultArray.push(item.id)
          })
          this.dataForm.specIdsSelected = resultArray
          this.specSelectionOnChange(this.dataForm.specIdsSelected)
        } else if (2==type){
          this.attrSelected = result.data
          // var resultArray = []
          this.attrSelected.filter(function(item){
            resultArray.push(item.id)
          })
          this.dataForm.attrIdsSelected = resultArray
          this.attrSelectionOnChange(this.dataForm.attrIdsSelected)
        }
      } else {
        this.$message.error(result.msg)
      }
      //console.log("results:  " + JSON.stringify(result))
    },

    async specSelectionOnChange(val) {
      const resultArr = this.attrList.filter(ele => {
        const isFilter = val.some(item => {
          return item == ele.id
        })
        if (isFilter) {
          if (!ele.hasOwnProperty("checkAll")){
            this.$set(ele, "checkAll", false)
          }
          if (!ele.hasOwnProperty("attrValSelected")){
            this.$set(ele, "attrValSelected", [])
          }
          if (!ele.hasOwnProperty("attrValList")){
            this.$set(ele, "attrValList", [])
          }
          if (!ele.hasOwnProperty("isIndeterminate")){
            this.$set(ele, "isIndeterminate", true)
          }
          this.$nextTick(async() => {
            const result = await fetch("/attr/listValByAttrId?attrId=" + ele.id, {})
            ele.attrValList = result.data
          })
          this.specSelected.some(item => {
            if (item.id == ele.id){
              ele.attrValSelected = item.attrValSelected
            }
          })
          return true
        }
      })
      this.spec_tableData = resultArr
    },

    async attrSelectionOnChange(val) {
      const resultArr = this.attrList.filter(ele => {
        const isFilter = val.some(item => {
          return item == ele.id
        })
        if (isFilter) {
          if (!ele.hasOwnProperty("checkAll")){
            this.$set(ele, "checkAll", false)
          }
          if (!ele.hasOwnProperty("attrValSelected")){
            this.$set(ele, "attrValSelected", [])
          }
          if (!ele.hasOwnProperty("attrValList")){
            this.$set(ele, "attrValList", [])
          }
          if (!ele.hasOwnProperty("isIndeterminate")){
            this.$set(ele, "isIndeterminate", true)
          }
          this.$nextTick(async() => {
            const result = await fetch("/attr/listValByAttrId?attrId=" + ele.id, {})
            ele.attrValList = result.data
          })
          this.attrSelected.some(item => {
            if (item.id == ele.id){
              ele.attrValSelected = item.attrValSelected
            }
          })
          return true
        }
      })
      this.attr_tableData = resultArr
    },

    back2Prev() {
      this.$router.back()
    },

    //隔行变色
    tableRowClassName(tableObject) {
      //选取DOM节点
      var trs = tableObject.$el
        .getElementsByTagName("tbody")[0]
        .getElementsByTagName("tr")
      for (var i in trs) {
        if (i % 2 == 0) {
          //当隔行变色未true时改变颜色
          if (this.space_color) {
            trs[i].style.backgroundColor = "#f0f9eb"
          } else {
            trs[i].style.backgroundColor = ""
          }
        }
      }
    },

    async save() {
      this.$refs.dataForm.validate(async valid => {
        if (valid) {
          this.sending = true
          // var requestMapParams= new Map()
          // Vue.set(requestMapParams, 1, this.spec_tableData)
          // Vue.set(requestMapParams, 2, this.attr_tableData)
          const params = {
            categoryNode: this.$route.params.node, 
            categoryId: this.$route.params.id,
            categoryAttrMap: {
              1: this.spec_tableData,
              2: this.attr_tableData
            }
          }
          // if (this.spec_tableData.length || this.attr_tableData.length){
          //   params.categoryAttrMap = requestMapParams
          // }
          const result = await post("/attr/save.CategoryAttrs", params)
          this.sending = false
          if (result.code === "200") {
            this.$message.success("类目预置规格属性设置成功！")
            this.back2Prev()
          } else {
            this.$message.error(result.msg)
          }
        } else {
          return false
        }
      })
    }
  },
  watch: {
    space_color: function() {
      //监听数据变化
      this.$nextTick(function() {
        this.tableRowClassName(this.$refs.spec_mytable)
      })
    },
    spec_tableData: function() {
      //监听数据变化f
      this.$nextTick(function() {
        /////方法
        this.tableRowClassName(this.$refs.spec_mytable)
      })
    },
    attr_tableData: function() {
      //监听数据变化f
      this.$nextTick(function() {
        /////方法
        this.tableRowClassName(this.$refs.attr_mytable)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.div-layout {
  padding: 16px;
  background: #ffffff;
}

.td-colspan-label {
  text-align: center;
  font-size: 12px;
}

.td-colspan-value {
  text-align: left;
  font-size: 12px;
  font-weight: 550;
}
</style>

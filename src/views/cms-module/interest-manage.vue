<template>
  <div class="page-interest app-container">
    <div class="content">
      <div class="left">
        <y-com-tree ref="tree" maxLevel="1" :data="cityList" node-key="regnCode" :expand-on-click-node="false" default-expand-all :props="defaultProps" @node-click="handleNodeClick" />
      </div>
      <div class="right">
        <el-form ref="formSearch" :model="formSearch" :inline="true" class="search-form clearfix" size="small">
          <el-form-item label="权益标题" class="search-field fl" prop="droitName">
            <el-input v-model="formSearch.droitName" placeholder="请输入权益标题" clearable />
          </el-form-item>
          <el-form-item label="服务领域" class="search-field fl" prop="serTypeID">
            <el-select @change="handleSearch" v-model="formSearch.serTypeID" placeholder="请选择服务领域" clearable >
              <el-option  v-for="item in droitServList"  :value="item.serTypeID" :key="item.serTypeID" :label="item.servTypeName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权益状态" class="search-field fl" prop="droitFlag">
            <el-select @change="handleSearch" v-model="formSearch.droitFlag" placeholder="请选择权益状态" clearable >
              <el-option value="0" label="启用"></el-option>
              <el-option value="1" label="关闭"></el-option>
              <!-- <el-option value="2" label="有效期"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item class="fr">
            <el-button class="two-words" plain size="small" @click="onReset('formSearch')">重置</el-button>
            <el-button class="two-words" type="primary" size="small" @click="handleSearch">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="table-wrap">
          <div class="table-edit-box clearfix">
            <div class="table-btn-right">
              <el-button type="success" size="small" @click="addOrEdit()">添加</el-button>
            </div>
          </div>
          <el-table  ref="table" v-loading="listLoading" height="460px" :data="list" element-loading-text="加载中..."  fit highlight-current-row>
            <el-table-column label="序号" width="50" align="center">
              <template slot-scope="scope">
                {{ (scope.$index + 1 )+ (formSearch.pageNum - 1) * formSearch.pageSize }}
              </template>
            </el-table-column>
            <el-table-column label="权益标题" prop="droitName" show-overflow-tooltip />
            <el-table-column label="所属地区" prop="regnName" min-width="120"  align="center" show-overflow-tooltip/>
            <el-table-column label="服务领域" prop="droitServName" min-width="120"  align="center" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-tag type="success">{{scope.row.droitServName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="启用状态" show-overflow-tooltip >
              <template slot-scope="scope">
                <el-tag :type="scope.row.droitFlag | droitFlagTag">{{scope.row.droitFlag | droitFlagContent}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column align="center"  fixed="right" prop="created_at" label="操作" width="250">
              <template slot-scope="scope">
                <el-link type="primary" size="small" @click="addOrEdit(scope.row)">修改</el-link>
                <el-link v-if="scope.row.droitFlag !== '2'" :type="scope.row.droitFlag | droitFlagTag(true)" size="small" @click="changeInterest(scope.row)">{{scope.row.droitFlag | droitFlagContent(true)}}</el-link>
                <el-link type="danger" size="small" @click="handleDelete(scope.row.droitId)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <y-pagination v-show="total>0" @pagination="fetchData" class="pageBox" :total="total" :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize" />
        </div>
      </div>
    </div>

    <el-dialog :close-on-click-modal="false" :title="addFlag?'新增':'修改'"  :visible.sync="dialogFormVisible" width="600px" class="add-dialog">
      <el-form ref="formAdd" :model="formAdd"  :rules="formAddRule" label-width="130px" size="small">
        <el-form-item label="权益标题" prop="droitName">
          <el-input v-model="formAdd.droitName" :maxlength="50" clearable  placeholder="请输入权益标题"  />
        </el-form-item>
        <el-form-item label="服务领域" prop="serTypeID">
          <el-select v-model="formAdd.serTypeID" placeholder="请选择服务领域" @change="selectService" clearable >
            <el-option v-for="item in droitServList"  :value="item.serTypeID" :key="item.serTypeID" :label="item.servTypeName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属地区"  prop="regnCode">
          <y-cascader ref="yCascader" placeholder="请选择所属地区" maxLevel="1" :delChildren="true" :settings="{'checkStrictly': false,'level': 'admdvsLv','value':'regnCode','label':'regnName'}"  @change="handleChange" :data="cityList" clearable v-model="formAdd.regnCode" />
        </el-form-item>
        <el-form-item label="服务"  prop="droitServCode" v-show="formAdd.serTypeID && formAdd.regnCode">
          <el-select clearable v-model="serviceItem" @change="serviceItemChange" value-key="mattServId">
            <el-option v-for="item in serviceList"  :value="item" :key="item.mattServId" :label="item.servName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="设定依据" prop="droitDesignBasis">
          <el-input type="textarea" resize="none" :autosize="{minRows: 5, maxRows: 8}"  v-model="formAdd.droitDesignBasis"  clearable placeholder="请输入设定依据"  />
        </el-form-item>
        <el-form-item label="权益状态" prop="droitFlag">
          <el-select v-model="formAdd.droitFlag" placeholder="请选择权益状态" clearable >
            <el-option value="0" label="启用"></el-option>
            <el-option value="1" label="关闭"></el-option>
            <!-- <el-option value="2" label="有效期"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item v-show="formAdd.droitFlag === '2'" label="权益有效日期" prop="droitFlag">
           <el-date-picker value-format="yyyy-MM-dd" v-model="daterange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="享受条件" prop="droitCondition">
          <el-input type="textarea" resize="none" :autosize="{minRows: 5, maxRows: 8}"  v-model="formAdd.droitCondition"  clearable placeholder="请输入享受条件"  />
        </el-form-item>
        <el-form-item label="权益内容" prop="droitCont">
          <el-input  type="textarea" resize="none" :autosize="{minRows: 5, maxRows: 8}"  v-model="formAdd.droitCont" clearable placeholder="请输入权益内容"  />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="addEditMenu('formAdd')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {commonApi, cmsApi} from "@api"
import YComTree from "@/components/y-com-tree/index"
import YCascader from "@/components/y-cascader/index"
import elementIcons from "@/utils/element-icons"
export default {
  name: "cmsInterestManage",
  data(){
    return {
      daterange: null, //日期 区间
      serviceList: [], //服务列表
      selectCity: null, //选择的地区
      droitServList: [], //服务领域选择列表
      cityList: [], //地区列表
      defaultProps: {
        children: "children",
        label: "regnName",
        level: "admdvsLv"
      },
      filterText: "",
      listLoading: false,
      list: [],
      formSearch: {
        serTypeID: "", //服务类别代码
        regnCode: "", //区域代码
        droitFlag: "", //权益状态 
        droitName: "", //权益标题
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dialogFormVisible: false,
      serviceItem: null, //选中的服务
      formAdd: {
        droitId: null, //权益ID
        droitName: "", //权益名称
        serTypeID: "", //服务领域代码
        droitServCode: "", //服务代码
        droitServName: "", //服务名称
        regnCode: "", //地区编号
        regnName: "", //地区名称
        prntRegnCode: "", //父级地区编号
        droitDesignBasis: "", //设定依据
        droitFlag: "", //权益状态
        droitStart: null, //权益有效起期
        droitEnd: null, //权益有效止期
        droitCondition: "", //享受条件
        droitCont: "" //权益内容
      },
      addFlag: false,
      formAddRule: {
        droitName: [{ required: true, message: "请输入权益标题", trigger: "blur" }],
        serTypeID: [{ required: true, message: "请选择服务领域", trigger: "change" }],
        droitServCode: [{ required: true, message: "请选择服务", trigger: "change" }],
        droitFlag: [{ required: true, message: "请选择权益状态", trigger: "change" }],
        regnCode: [{ required: true, message: "请选择所属地区", trigger: "change" }],
        droitProvinceCode: [{ required: true, message: "请选择服务", trigger: "change" }]
      },
      elementIcons,
      dialogIconVisible: false,
      selectIconIndex: "-1", // 选中的图标索引
      selectIcon: "" // 选中的图标
    }
  },
  watch: {
    dialogFormVisible(val){
      if (!val){
        this.formAdd = {
          droitId: null, //权益ID
          droitName: "", //权益名称
          serTypeID: "", //服务领域代码
          droitServCode: "", //服务代码
          droitServName: "", //服务名称
          regnCode: "", //地区编号
          regnName: "", //地区名称
          prntRegnCode: "", //父级地区编号
          droitDesignBasis: "", //设定依据
          droitFlag: "", //权益状态
          droitStart: null, //权益有效起期
          droitEnd: null, //权益有效止期
          droitCondition: "", //享受条件
          droitCont: "" //权益内容
        }
        this.serviceList = []
        this.serviceItem = {
          mattServId: "",
          servName: ""
        }
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    }
  },
  components: {
    YComTree,
    YCascader
  },
  filters: {
    droitFlagTag(val, reverse = false) {
      if (reverse) {
        return val === "0" ? "danger" : val === "1" ? "success" : "warning"
      }
      return val === "0" ? "success" : val === "1" ? "danger" : "warning"
    },
    droitFlagContent(val, reverse = false){
      if (reverse){
        return val === "0" ? "关闭" : val === "1" ? "启用" : "有效期"
      }
      return val === "0" ? "启用" : val === "1" ? "关闭" : "有效期"
    }
  },
  created(){
    //获取城市列表
    this.getRegnAreaTree()

    //获取所有服务类型
    this.getAllServiceType()

    //获取数据
    this.handleSearch()
  },
  methods: {
    /**
     * @description: 选择的服务改变
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    serviceItemChange(val){
      this.formAdd.droitServCode = val&&val.mattServId || ""
      this.formAdd.droitServName = val&&val.servName || ""
      if (val){
        this.$refs.formAdd&&this.$refs.formAdd.clearValidate("droitServCode") 
      } 
    },
    /**
     * @description: 重置搜索
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    onReset(formName) {
      this.$refs.tree.setCurrentKey(null)
      this.formSearch.regnCode = ""
      this.$refs[formName].resetFields()
      this.handleSearch()
    },
    /**
     * @description: 获取所有服务类型
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getAllServiceType(){
      cmsApi.getAllServiceType().then(data => {
        this.droitServList = data.data
      })
    },
    /**
     * @description: 搜索数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleSearch(){
      this.formSearch.pageNum = 1
      this.fetchData()
    },
    /**
     * @description: 获取数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    fetchData() {
      this.listLoading = true
      cmsApi.getInterestList(this.formSearch).then(data => {
        this.listLoading = false
        if (data.data){
          this.list = data.data.list || []
          this.total = data.data.total || 0
        } else {
          this.list = []
          this.total = 0
        }
      }).catch(err => {
        this.listLoading = false
        this.list = []
        this.total = 0
      })
    },
    /**
     * @description: 更新状态
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    changeInterest(data){
      const droitId = data.droitId
      const droitFlag = data.droitFlag === "0" ? "1" : "0"
      cmsApi.changeInterest({droitId, droitFlag}).then(data => {
        this.handleSearch()
      })
    },
    /**
     * @description: 展示弹框
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    async addOrEdit(data = {}){
      this.addFlag = !data.droitId
      if (data.droitId){
        this.formAdd = {
          droitId: data.droitId, //权益ID
          droitName: data.droitName, //权益名称
          serTypeID: data.serTypeID, //服务领域代码
          droitServCode: data.droitServCode, //服务代码
          droitServName: data.droitServName, //服务名称
          regnCode: data.regnCode, //地区编号
          regnName: data.regnName, //地区名称
          prntRegnCode: data.prntRegnCode, //父级城市编号
          droitDesignBasis: data.droitDesignBasis, //设定依据
          droitFlag: data.droitFlag, //权益状态
          droitStart: data.droitStart, //权益有效起期
          droitEnd: data.droitEnd, //权益有效止期
          droitCondition: data.droitCondition, //享受条件
          droitCont: data.droitCont //权益内容
        }
        await this.selectService()
        this.serviceItem = {
          mattServId: data.droitServCode,
          servName: data.droitServName
        }
      }
      this.dialogFormVisible = true
    },
    /**
     * @description: 新增或者编辑
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    addEditMenu(formName){
      this.$refs[formName].validate(valid => {
        if (valid){
          const msg = !this.addFlag ? "编辑成功" : "新增成功"
          cmsApi.addOrEditInterest(this.formAdd).then(data => {
            this.dialogFormVisible = false
            this.$message.success(msg)
            this.handleSearch()
          })
        }
      })
    },
    /**
     * @description: 获取所有地区
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getRegnAreaTree(){
      this.selectmenuList = []
      commonApi.getRegnAreaTree().then(data => {
        this.cityList = data.data
      })
    },
    /**
     * @description: 弹框城市改变事件
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleChange(val){
      const dataMap = this.$refs.yCascader.getDataMap()
      const value = dataMap[val]
      this.formAdd.regnCode = value&&value.regnCode || ""
      this.formAdd.regnName = value&&value.regnName || ""
      this.formAdd.prntRegnCode = value&&value.prntRegnCode || ""
      if (value) {
        this.$refs.formAdd&&this.$refs.formAdd.clearValidate("regnCode")
      }
      this.selectService()
    },
    /**
     * @description:  搜索服务
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    selectService(){
      //服务下拉列表清空，选项也清空,表单数据也清空
      this.serviceList = []
      this.serviceItem = {
        mattServId: "",
        servName: ""
      }
      this.formAdd.droitServCode = ""
      this.formAdd.droitServName = ""
      this.$refs.formAdd&&this.$refs.formAdd.clearValidate("droitServCode")
      if (this.formAdd.serTypeID && this.formAdd.regnCode){
        cmsApi.webqueryList({servFather: this.formAdd.serTypeID, servCity: this.formAdd.regnCode}).then(data => {
          this.serviceList = data.data
        })
      }
    },
    /**
     * @description: 点击编辑
     * @param {type}
     * @return {type}
     * @author: syx
     */
    handleEdit(info){
      this.dialogFormVisible = true
    },
    /**
     * @description: 点击节点
     * @param {type}
     * @return {type}
     * @author: syx
     */
    handleNodeClick(val){
      this.formSearch.regnCode = val.regnCode
      this.handleSearch()
    },

    /**
     * @description: 过滤筛选
     * @param {type}
     * @return {type}
     * @author: syx
     */
    filterNode(value, data) {
      if (!value) { return true }
      return data.label.indexOf(value) !== -1
    },
    /**
     * @description: 删除权益
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleDelete(droitId){
      this.$alert("是否确认删除", "提示", {
        confirmButtonText: "确定",
        customClass: "icon",
        type: "warning",
        callback: action => {
          if (action === "confirm"){
            //谨慎操作
            cmsApi.deleteInterest({key: droitId}).then(data => {
              this.$message.success("删除权益成功")
              this.handleSearch()
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-interest{
  padding-top: 0;
  ::v-deep .el-tabs__item{
    padding: 0 20px !important;
  }
  .content{
    height: 706px;
    padding: 0;
    margin: 0;
    margin-top: 16px;
    overflow: hidden;
    position: relative;
    .left{
      position: absolute;
      width: 250px;
      height:100%;
      top: 0;
      left: 0;
    }
    .right{
      height:100%;
      margin-left: 266px;
      .search-field{
        width: 33.33%;
      }
      .table-wrap{
        height: 580px;
      }
    }
  }
}
</style>
<template>
<div class="app-container">
  <el-form class="template-search-box-body search-form clearfix" v-show="showSearchBox" :inline="true" size="small">
    <el-form-item label="模板类型：" label-width="110px" class="search-field fl">
      <el-select v-model="searchData.tmplType" placeholder="请选择模板类型" clearable>
        <el-option label="短信" value="1"></el-option>
        <el-option label="系统消息" value="3"></el-option>
        <el-option label="站内信息" value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="模板标题：" label-width="110px" class="search-field fl">
      <el-input v-model="searchData.tmplTtl" placeholder="请输入模板标题" clearable />
    </el-form-item>
    <el-form-item label="模板内容：" label-width="110px" class="search-field fl">
      <el-input v-model="searchData.tmplCont" placeholder="请输入模板内容" clearable />
    </el-form-item>
    <el-form-item class="fr">
      <el-button class="two-words" plain size="small" @click="onClickReset">重置</el-button>
      <el-button class="two-words" type="primary" size="small" @click="onClickSearch">查询</el-button>
    </el-form-item>
  </el-form>

  <div class="table-wrap">
    <div class="table-edit-box flex-c-b">
      <div class="table-edit-box-title"></div>
      <div class="table-edit-box-operator">
        <el-button class="head-item" type="primary" @click="onClickAddTemplate">添加</el-button>
      </div>
    </div>

    <el-table ref="templateTable" v-loading="listLoading" :data="templateList" element-loading-text="加载中..." border highlight-current-row>
      <el-table-column type="index" label="编号" width="60"></el-table-column>
      <el-table-column label="模板标题" align="center" prop="tmplTtl"></el-table-column>
      <el-table-column label="模板类型" align="center" prop="tmplType">
        <template slot-scope="scope">
          <!-- {{ handleTempTypeStr(scope.row.tmplType) }}       -->
          {{ scope.row.tmplType}}      
        </template>
      </el-table-column>
      <el-table-column label="模板内容" align="center" prop="tmplCont"></el-table-column>
      <el-table-column label="模板说明" align="center" prop="tmplDscr"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-link type="primary" :underline="false" size="small" @click="onClickEdit(scope.row)">修改</el-link>
          <el-link type="primary" :underline="false" size="small" @click="onClickDelete(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <y-pagination v-show="total > 0" class="pageBox" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" @pagination="handlePagination" />
  
    <el-dialog class="template-dialog" :close-on-click-modal="false" title="发送短信" :visible.sync="dialogFormVisible" width="650px">
      <el-form ref="templateDialogForm" :model="templateInfo" :rules="dialogRule" label-width="100px" size="small">
        <el-form-item label="模板标题" prop="tmplTtl">
          <el-input v-model="templateInfo.tmplTtl" placeholder="请输入模板标题" />
        </el-form-item>
        <el-form-item label="模板类型" prop="tmplType">
          <el-select v-model="templateInfo.tmplType" placeholder="请选择模板类型" clearable>
            <el-option label="短信" value="1"></el-option>
            <el-option label="系统消息" value="3"></el-option>
            <el-option label="站内信息" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板说明" prop="tmplDscr">
          <el-input v-model="templateInfo.tmplDscr" placeholder="请输入模板说明" />
        </el-form-item>
        <el-form-item label="模板内容" prop="tmplCont">
          <el-input type="textarea" v-model="templateInfo.tmplCont" placeholder="请输入模板内容" :autosize="{ minRows: 6, maxRows: 6 }" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false ">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</div>
</template>
<script>
import { msgManageApi as msgApi } from "@/api"

// 模板类型字典
const TEMPLATE_DICT = {
  1: { label: "短信", value: 1 },
  2: { label: "站内信息", value: 2 },
  3: { label: "系统消息", value: 3 }
}

export default {
  name: "messageTemplateManage",
  data() {
    return {
      listLoading: false, // 表格loading效果
      searchData: {
        pageNum: 1, // 当前页码
        pageSize: 10 // 当前页面最大显示条数
      }, // 分页器数据
      total: 0, // 数据总条数
      showSearchBox: true, // 是否展开筛选器
      dialogTitle: "", // 弹窗标题
      templateTitle: "", // 模板标题
      templateList: [], // 模板数据列表
      templateInfo: {}, // 模板数据
      dialogFormVisible: false, // 弹窗是否显示
      isEdit: false, // 是否是编辑操作
      dialogRule: {
        tmplTtl: [{ required: true, message: "请输入模板标题", trigger: "blur" }],
        tmplType: [{ required: true, message: "请选择模板类型", trigger: ["change", "blur"] }],
        tmplDscr: [{ required: true, message: "请输入模板说明", trigger: "blur" }],
        tmplCont: [{ required: true, message: "请输入模板内容", trigger: "blur" }]
      } // 弹窗内表单规则
    }
  },
  created() {
    this.loadTemplateList()
  },
  watch: {
    // 监听弹窗隐藏与显示, 隐藏时清除校验结果
    dialogFormVisible(newVal) {
      if (!newVal) {
        this.$refs.templateDialogForm.clearValidate()
        this.templateInfo = {}
      }
    }
  },
  methods: {
    /**
     * @description: 分页器事件
     * @param {type} page Number 
     * @author: chenwz
     */  
    handlePagination({ page, limit }) {
      this.searchData.pageNum = page
      this.searchData.pageSize = limit
      this.loadTemplateList()
    },
    /**
     * @description: 点击查询时重置页数
     * @author: chenwz
     */
    onClickSearch() {
      this.searchData.pageNum = 1
      this.loadTemplateList()
    },
    /**
     * @description: 点击筛选器重置事件
     * @author: chenwz
     */
    onClickReset() {
      this.searchData = {
        pageNum: 1,
        pageSize: 10
      }
      this.loadTemplateList()
    },
    handleTempTypeStr(type = 1) {
      return TEMPLATE_DICT[type].label
    },
    /**
     * @description: 点击编辑事件
     * @param {type} row Object 点击行的数据
     * @author: chenwz
     */
    onClickEdit(row) {
      this.isEdit = true
      this.dialogFormVisible = true
      this.templateInfo = row
    },
    /**
     * @description: 加载模板数据列表
     * @author: chenwz
     */
    async loadTemplateList() {
      this.listLoading = true
      try {
        const { type, data } = await msgApi.getTemplateList(this.searchData)
        if (type === "success") {
          this.templateList = data.list
          this.total = data.total
        }
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },
    /**
     * @description: 新增模板
     * @author: chenwz
     */
    onClickAddTemplate() {
      this.isEdit = false
      this.dialogFormVisible = true
      this.noticeInfo = {}
    },
    /**
     * @description: 处理提交模板事件
     * @author: chenwz
     */
    handleSubmit() {
      // 提交前校验
      this.$refs.templateDialogForm.validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.handleAddOrEditTemplate()
        }
      })
    },
    /**
     * @description: 添加或编辑模板
     * @author: chenwz
     */
    async handleAddOrEditTemplate() {
      try {
        const { type } = await msgApi.addOrEditTemplate(this.templateInfo)
        // 操作成功后提示并关闭弹窗, 同时重新加载数据
        if (type === "success") {
          this.$message({
            type: "success",
            message: "操作成功!"
          })
          this.dialogFormVisible = false
          this.loadTemplateList()
        }
      } catch (e) {
        this.$message({
          type: "error",
          message: "操作失败!"
        })
      }
    },
    /**
     * @description: 删除模板确认
     * @param {type} row Object 删除模板的数据
     * @author: chenwz
     */    
    onClickDelete(row) {
      this.$confirm("是否删除该模板", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.handleDeleteTemplate(row.tmplId)
      }).catch(() => { })
    },
    async handleDeleteTemplate(id) {
      this.listLoading = true
      try {
        const { type } = await msgApi.deleteTemplate({ tmplId: id })
        if (type === "success") {
          this.$message({
            type: "success",
            message: "删除成功!"
          })
          this.loadTemplateList()
        }
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-edit-box {
  background-color: #ffffff;
  &-title {
    display: flex;
    margin-left: 5px;
    font-size: 18px;   
    align-items: center;
  }
  &-operator {
    display: flex;
    .head-item {
      margin-right: 10px;
    }
    .head-item:last-child {
      margin-right: 0;  
    }
    .head-item-selector {
      width: 120px;
    }
  }
}

.template-dialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      height: 400px;
      overflow: hidden;
      overflow-y: auto;
      .form-item {
        .el-form-item__content {
          display: flex;
          flex-wrap: wrap;
          .form-item-content {
            margin-right: 20px;
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="app-container">
    <el-form ref="formSearch" :model="formSearch" :inline="true" class="search-form clearfix" size="small">
      <el-form-item class="search-field fl" label="角色名称" prop="roleName">
        <el-input v-model="formSearch.roleName" placeholder="请输入角色名称" clearable />
      </el-form-item>
      <el-form-item  class="fr">
        <el-button class="two-words" plain size="small" @click="onReset('formSearch')">重置</el-button>
        <el-button class="two-words" type="primary" size="small" @click="handleSearch()">查询</el-button>
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
        <!-- <el-table-column align="center" label="ID" prop="roleId" show-overflow-tooltip></el-table-column> -->
        <el-table-column label="角色名称" prop="roleName" show-overflow-tooltip />
        <el-table-column label="状态" min-width="120" width="220" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag :type="scope.row.roleStas ? 'success' : 'danger'">{{ scope.row.roleStas ? "开启" : "关闭"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="crterName" show-overflow-tooltip />
        <el-table-column label="创建时间" prop="crterTime" show-overflow-tooltip />
        <el-table-column align="center"  fixed="right" prop="created_at" label="操作" width="250">
          <template slot-scope="scope">
            <el-link :title="$store.getters.roleIdList.includes(scope.row.roleId) ? '不可修改自身拥有的角色' : ''" :disabled="$store.getters.roleIdList.includes(scope.row.roleId)" type="primary" size="small" @click="addOrEdit(scope.row)">修改</el-link>
            <el-link :title="$store.getters.roleIdList.includes(scope.row.roleId) ? '不可设置自身拥有的角色权限' : ''" :disabled="$store.getters.roleIdList.includes(scope.row.roleId)" size="small" @click="handleMenuList(scope.row.roleId)">权限</el-link>
            <el-link :title="$store.getters.roleIdList.includes(scope.row.roleId) ? '不可删除自身拥有的角色' : ''" :disabled="$store.getters.roleIdList.includes(scope.row.roleId)" type="danger" size="small" @click="handleDelete(scope.row.roleId)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <y-pagination v-show="total>0"  @pagination="fetchData" class="pageBox" :total="total" :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize" />
    </div>
    <!-- 弹窗新增 -->
    <el-dialog :close-on-click-modal="false" :title="addFlag ? '新增' : '修改'" :visible.sync="dialogFormVisible" width="600px" class="add-dialog">
      <el-form ref="formAdd" :model="formAdd" :rules="formAddRule" :label-width="formLabelWidth" size="small">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formAdd.roleName" clearable :maxlength="50" autocomplete="off" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="排序号" prop="srt">
          <el-input-number v-model="formAdd.srt" :min="1" :max="999" ></el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="roleStas">
          <el-radio v-model="formAdd.roleStas"  :label="true">启用</el-radio>
          <el-radio v-model="formAdd.roleStas" :label="false">停用</el-radio>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input type="textarea" resize="none" :autosize="{minRows: 5, maxRows: 8}" v-model="formAdd.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseRole">取 消</el-button>
        <el-button type="primary" size="small" @click="handleAddEditRole('formAdd')">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="角色权限" :visible.sync="dialogFormPreviewVisible" width="600px">
      <div class="btn-box">
        <el-button type="primary" size="small"  @click="foldOrCollapse">{{!isExpand ? "全部展开" : "全部折叠" }}</el-button>
        <el-button type="danger" size="small"  @click="selectAllOrReversal">{{!isSelectAll ? "全部选中" : "全部不选" }}</el-button>
        <el-button type="warning" size="small"  @click="toggleSelect">全部反选</el-button>
      </div>
      <y-tree ref="tree" show-checkbox node-key="menuId" @expandChange="expandChange" @check-change="checkChange" :settings="defaultProps"  class="tree-warp" :data="menuList"></y-tree>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseMenue">取 消</el-button>
        <el-button type="primary" size="small" @click="handleauthorize">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {systemApi } from "@/api"
import YTree from "@/components/y-tree"
export default {
  name: "systemRoleCenter",
  data() {
    return {
      // 搜索
      formSearch: {
        roleName: "",
        pageNum: 1,
        pageSize: 10
      },
      addFlag: true,
      // 新增表单
      formAdd: {
        roleId: null, //角色ID
        roleName: "", //角色名称
        srt: "", //排序
        roleStas: true, //角色状态
        roleDesc: "" //角色描述
      },
      formAddRule: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        srt: [
          { required: true, message: "请输入排序号", trigger: "blur" }
        ],
        roleStas: [
          { required: true, message: "请选择状态", trigger: "blur" }
        ],
        plaf: [
          { required: true, message: "请选择所属平台", trigger: "change" }
        ]
      },
      isExpand: false, //是否展开权限
      isSelectAll: false, //是否全选
      // 角色权限
      menuList: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      // 表格
      list: [],
      listLoading: false, // 表格加载
      // 分页
      total: 10,
      dialogFormVisible: false, // 是否展示新增弹窗
      dialogFormPreviewVisible: false, // 是否展示预览弹窗
      // 新增弹窗，表单标签的宽度
      formLabelWidth: "100px",
      selectRoleId: null //选择的角色ID
    }
  },
  components: {
    YTree
  },
  watch: {
    dialogFormVisible(val){
      if (!val){
        this.formAdd = {
          roleId: null,
          roleName: "",
          srt: "",
          roleStas: true,
          roleDesc: ""
        }
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    },
    dialogFormPreviewVisible(val){
      if (!val){
        this.selectRoleId = null
        this.$refs.tree.getTree().setCheckedKeys([])
        this.$refs.tree.foldAll()
        this.isExpand = false
      }
    }
  },
  created() {
    //触发搜索
    this.fetchData()
    //获取菜单树
    this.getAllMenuList()
  },
  methods: {
    /**
     * @description: 当前节点选中状态变化时
     * @param {*}
     * @return {*}
     * @author: syx
     */
    checkChange(val){
      setTimeout(() => {
        //如果是全选状态，即文字显示 全部不选  则判断是否已经全部未选中
        if (this.isSelectAll) {
          const isUnSelectAll = this.$refs.tree.judgeUnSelectAll()
          if (isUnSelectAll) {
            this.isSelectAll = false
          }
        } else { //如果是未全选状态，即文字显示 全部选中  则判断是否已经全部选中
          const isSelectAll = this.$refs.tree.judgeSelectAll()
          if (isSelectAll) {
            this.isSelectAll = true
          } 
        }
      }, 300)
    },
    /**
     * @description: 全部反选
     * @param {*}
     * @return {*}
     * @author: syx
     */
    toggleSelect() {
      this.$refs.tree.toggleSelectAll()
    },
    /**
     * @description: 全选或者全不选
     * @param {*}
     * @return {*}
     * @author: syx
     */
    selectAllOrReversal() {
      if (this.isSelectAll) {
        this.$refs.tree.unSelectAll()
        this.isSelectAll = false
      } else {
        this.$refs.tree.selectAll()
        this.isSelectAll = true
      }
    },
    /**
     * @description: 权限选项展开或者折叠时事件
     * @param {*}
     * @return {*}
     * @author: syx
     */
    expandChange(){
      setTimeout(() => {
        if (this.isExpand) {
          const isFoldAllFirstLevel = this.$refs.tree.judgeFoldAllFirstLevel() //是否折叠所有一级树
          if (isFoldAllFirstLevel) {
            this.isExpand = false
          }
        } else {
          const isExpandAllFirstLevel = this.$refs.tree.judgeExpandAllFirstLevel() //是否展开所有一级树
          if (isExpandAllFirstLevel) {
            this.isExpand = true
          }
        }
      }, 100)
    },
    /**
     * @description: 获取所有菜单树
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getAllMenuList(){
      systemApi.getAllMenuList().then(data => {
        this.menuList = data.data
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
     * @description: 关闭新增弹框
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleCloseRole() {
      this.dialogFormVisible = false
    },
    /**
     * @description: 关闭角色弹框
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleCloseMenue() {
      this.dialogFormPreviewVisible = false
    },

    /**
     * @description: 重置搜索
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.handleSearch()
    },
    /**
     * @description: 获取数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    fetchData() {
      this.listLoading = true
      systemApi.getRoles(this.formSearch).then(data => {
        this.listLoading = false
        const res = data.data
        this.total = res.total
        this.list = res.list
      })
    },
    /**
     * @description: 展示弹框
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    addOrEdit(data = {}) {
      this.addFlag = !data.roleId
      if (data.roleId) {
        systemApi.getRoleInfo({roleId: data.roleId}).then(res => {
          for (const key in this.formAdd) {
            this.formAdd[key] = res.data[key] || this.formAdd[key]
          }
        })
      }
      this.dialogFormVisible = true
    },
    /**
     * @description: 新增或者编辑
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    handleAddEditRole(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const msg = !this.addFlag ? "编辑成功" : "新增成功"
          systemApi.addEditRole(this.formAdd).then(data => {
            this.$message.success(msg)
            this.handleSearch()
            this.dialogFormVisible = false
          })
        }
      })
    },
    /**
     * @description: 删除角色请求
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    fnRoleDelete(roleId) {
      systemApi.delRole({roleId}).then(data => {
        this.$message.success("删除角色成功")
        this.handleSearch()
      })
    },
    /**
     * @description: 点击删除角色
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    // 删除
    handleDelete(roleId) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        this.fnRoleDelete(roleId)
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        })
      })
    },
    // 获取所有权限id
    getMenuId(data) {
      if (!data) {
        return
      }
      let arr = []
      for (const item of data) {
        // let item = data[index]
        const child = item.childList
        if (child && child.length) {
          arr = arr.concat(this.getMenuId(child))
        } else {
          arr.push(item.menuId)
        }
      }
      return arr
    },

    /**
     * @description: 展示配置某角色权限菜单
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    handleMenuList(roleId) {
      this.dialogFormPreviewVisible = true
      this.selectRoleId = roleId
      systemApi.getRoleMenus({roleId}).then(data => {
        this.$refs.tree.getTree().setCheckedKeys([...data.data])
      })
    },
    /**
     * @description: 为角色设置权限
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleauthorize() {
      const menuIdList = this.$refs.tree.getTree().getCheckedKeys()
      if (!menuIdList.length) {
        this.$message({
          type: "warning",
          message: "请先选择角色权限"
        })
        return
      }
      systemApi.configMenu({roleId: this.selectRoleId, menuIdList}).then(data => {
        this.$message({
          type: "success",
          message: "设置权限成功"
        })
        this.dialogFormPreviewVisible = false
        //刷新菜单列表
        this.$store.dispatch("user/reloadMenu")
      })
    },
    /**
     * @description: 点击展开或收起
     * @param {*}
     * @return {*}
     * @author: syx
     */  
    foldOrCollapse() {
      if (this.isExpand) {
        this.$refs.tree.foldAll()
        this.isExpand = false
      } else {
        this.$refs.tree.expandAll()
        this.isExpand = true
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.line {
  text-align: center;
}
.add-dialog {
  .btn-choose {
    margin-left: 0px !important;
  }
  .el-upload__tip {
    line-height: 20px !important;
  }
  .el-select {
    width: 100%;
  }
}
.tree-warp {
  height: 400px;
  width: 100%;
  overflow-y: auto;
}

.btn-box{
  margin-bottom: 16px;
}
</style>


<template>
  <div class="page-menu app-container">
    <div class="content">
      <div class="left">
        <y-com-tree ref="tree" :render-content="renderContent" :data="menuList" node-key="menuId" :expand-on-click-node="false" default-expand-all :props="defaultProps" @node-click="handleNodeClick" />
      </div>
      <div class="right">
        <div class="table-wrap">
          <div class="table-edit-box clearfix">
            <div class="table-btn-right">
              <el-button v-show="formSearch.menuId !== '0'" type="primary" size="small" @click="searchRoot()">一级菜单</el-button>
              <el-button class="two-words" type="success" size="small" @click="addOrEdit()">添加</el-button>
            </div>
          </div>
          <el-table  ref="table" v-loading="listLoading" height="460px" :data="list" element-loading-text="加载中..."  fit highlight-current-row>
            <el-table-column label="序号" width="50" align="center">
              <template slot-scope="scope">
                {{ (scope.$index + 1 )+ (formSearch.pageNum - 1) * formSearch.pageSize }}
              </template>
            </el-table-column>
            <el-table-column label="菜单名称" prop="title" show-overflow-tooltip />
            <el-table-column label="菜单URL" prop="path" min-width="120"  align="center" show-overflow-tooltip/>
            <el-table-column label="菜单图标" show-overflow-tooltip width="80" >
              <template slot-scope="scope">
                <i v-if="scope.row.icon" :class="scope.row.icon" class="table-icon" />
                <span v-else>无</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" show-overflow-tooltip  width="100">
              <template slot-scope="scope">
                <el-tag :type="scope.row.status ? 'success' : 'danger'">{{scope.row.status ? "已启用" : "已停用"}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="最后更新人" prop="opterName"  width="120" show-overflow-tooltip />
            <el-table-column align="center"  fixed="right" prop="created_at" label="操作" width="200">
              <template slot-scope="scope">
                <el-link type="primary" size="small" @click="addOrEdit(scope.row)">修改</el-link>
                <el-link :title="scope.row.isSystemMenu ? '系统菜单不可停用' : ''" :disabled="scope.row.isSystemMenu" :type="scope.row.status ? 'warning' : 'success'" size="small" @click="updateMenuStas(scope.row)">{{scope.row.status ? "停用" : "启用"}}</el-link>
                <el-link :title="scope.row.isSystemMenu ? '系统菜单不可删除' : ''" :disabled="scope.row.isSystemMenu" type="danger" size="small" @click="handleDelete(scope.row)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <y-pagination v-show="total>0" class="pageBox" :total="total" :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize"  @pagination="getChildMenuList(true)" />
        </div>
      </div>
    </div>

    <el-dialog :close-on-click-modal="false" :title="addFlag?'新增':'修改'"  :visible.sync="dialogFormVisible" width="600px" class="add-dialog">
      <el-form ref="formAdd" :model="formAdd"  :rules="formAddRule" label-width="130px" size="small">
        <el-form-item label="所属父菜单" prop="parentMenuId">
          <y-cascader :key="formAdd.menuId" :delValue="formAdd.menuId" :settings="{'value':'menuId','label':'title'}"  :data="selectmenuList" clearable v-model="formAdd.parentMenuId"/>
        </el-form-item>
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="formAdd.title" :maxlength="50" clearable  placeholder="请输入菜单名称"  />
        </el-form-item>
        <el-form-item label="菜单URL" prop="path">
          <el-input v-model="formAdd.path" :maxlength="50" clearable placeholder="请输入菜单URL"  />
        </el-form-item>
        <el-form-item label="重定向菜单"  prop="isRedirect">
          <el-switch v-model="isRedirect" active-color="#e7562c"></el-switch>
        </el-form-item>
        <el-form-item label="重定向菜单URL" v-show="isRedirect" :rules="isRedirect ? { required: true, message: '请选择重定向地址', trigger: 'change' } : []"  prop="redirect">
          <el-select v-model="formAdd.redirect" filterable :maxlength="50" clearable placeholder="请选择重定向菜单URL"  >
            <el-option :key="item" v-for="item in allMenuUrl" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <div class="clearfix">
            <span class="menu-icon fl $ft-32">
              <i :class="formAdd.icon" />
              <i class="el-icon-error clear-icon" @click="handdleDeleteIcon" />
            </span>
            <el-button class="fl btn-choose" type="primary" icon="el-icon-edit" size="small" @click="handleAddIcon">{{ formAdd.icon?'重新选择':'添加图标' }}</el-button>
          </div>
        </el-form-item>
        <el-form-item label="排序号" prop="srt">
          <el-input-number v-model="formAdd.srt" :min="1" :max="999" ></el-input-number>
        </el-form-item>
        <el-form-item label="菜单状态" prop="status" v-show="!formAdd.isSystemMenu">
          <el-radio v-model="formAdd.status" :label="true">启用</el-radio>
          <el-radio v-model="formAdd.status" :label="false" >停用</el-radio>
        </el-form-item>
        <el-form-item label="菜单组件标识" prop="name">
          <el-select v-model="formAdd.name" filterable :maxlength="50" clearable placeholder="请选择菜单组件标识"  >
            <el-option :key="item.value" v-for="item in menuComponentList" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否一直展示"  prop="alwaysShow">
          <el-switch v-model="formAdd.alwaysShow" active-color="#e7562c" ></el-switch>
        </el-form-item>
        <el-form-item label="是否固定在标签栏" v-show="!isRedirect" prop="affix">
          <el-switch v-model="formAdd.affix" active-color="#e7562c" ></el-switch>
        </el-form-item>
        <el-form-item label="页面不缓存" v-show="!isRedirect" prop="noCache">
          <el-switch v-model="formAdd.noCache" active-color="#e7562c" ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="addEditMenu('formAdd')">保 存</el-button>
      </div>
    </el-dialog>

    <!-- 图标弹窗 -->
    <el-dialog :close-on-click-modal="false" title="选择图标" :visible.sync="dialogIconVisible" width="600px" height="700px" class="icon-dialog clearfix">
      <div class="clearfix icon-wrap">
        <div v-for="(item,index) of elementIcons" :key="item" class="icon-item" :class="selectIconIndex==index?'active':''" @click="handleSelectIcon(item,index)">
          <i :class="'el-icon-' + item" />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSelect">选 择</el-button>
        <el-button size="small" @click="()=>{selectIconIndex = '-1';dialogIconVisible=false}">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {systemApi} from "@api"
import menuComponentList from "@/assets/data/menu-component-data"
import YComTree from "@/components/y-com-tree/index"
import YCascader from "@/components/y-cascader/index"
import elementIcons from "@/utils/element-icons"
export default {
  name: "systemMenuCenter",
  data(){
    return {
      allMenuUrl: [], //所有菜单URL
      menuComponentList, //菜单标识数据选项
      menuList: [],
      selectmenuList: [],
      defaultProps: {
        children: "children",
        label: "title"
      },
      filterText: "",
      listLoading: false,
      list: [],
      formSearch: {
        menuId: "0",
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      dialogFormVisible: false,
      formAdd: {
        menuId: null, //菜单ID
        isSystemMenu: false, //是否是系统菜单
        parentMenuId: "0", //所属父菜单ID
        title: "", //菜单名称
        path: "", //菜单路径
        redirect: "", //重定向菜单
        icon: "", //菜单图标
        name: "", //组件标识
        type: 1, //类型 1 菜单
        srt: null, //排序号
        status: true, //菜单启用还是关闭
        affix: false, //是否固定展示在页签
        noCache: false, //是否不缓存
        alwaysShow: true //是否一直展示在菜单栏
      },
      isRedirect: false, // 是否重定向
      addFlag: false,
      formAddRule: {
        parentMenuId: [{ required: true, message: "请选择所属父菜单", trigger: "change" }],
        title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        path: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        name: [{ required: true, message: "请选择菜单组件标识", trigger: "change" }]
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
        this.isRedirect = false
        this.formAdd = {
          menuId: null, //菜单ID
          isSystemMenu: false, //是否是系统菜单
          parentMenuId: this.formSearch.menuId || "0", //所属父菜单ID
          title: "", //菜单名称
          path: "", //菜单路径
          redirect: "", //重定向菜单
          icon: "", //菜单图标
          name: "", //组件标识
          type: 1, //类型 1 菜单
          srt: null, //排序号
          status: true, //菜单启用还是关闭
          affix: false, //是否固定展示在页签
          noCache: false, //是否不缓存
          alwaysShow: true //是否一直展示在菜单栏
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
  created(){
    //初始化
    this.init()
  },
  methods: {
    /**
     * @description: 查询根菜单
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    searchRoot(){
      this.$refs.tree.setCurrentKey(null)
      this.formSearch.menuId = "0"
      this.getChildMenuList()
    },
    /**
     * @description: 初始化
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    init(){
      //获取所有菜单树
      this.getAllMenuList()
      //获取根目录子菜单数据
      this.getChildMenuList()
      //获取所有菜单URL
      this.getAllLeavesNodePath()
    },
    /**
     * @description: 更新状态
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    updateMenuStas(data){
      const resMsg = data.status ? `停用${data.title}菜单成功` : `启用${data.title}菜单成功`
      const reqMsg = data.status ? `是否确认停用${data.title}菜单` : `是否确认启用${data.title}菜单`
      this.$confirm(reqMsg, "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        //谨慎操作
        systemApi.updateMenuStas({menuId: data.menuId}).then(() => {
          this.$message.success(resMsg)
          this.init()
          //刷新菜单列表
          this.$store.dispatch("user/reloadMenu")
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        })
      })
    },
    /**
     * @description: 展示弹框
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    addOrEdit(data = {}){
      //阻止冒泡，解决点击编辑后默认父菜单为自己本身的bug
      if (event.stopPropagation) { 
        // 针对 Mozilla 和 Opera 
        event.stopPropagation()
      } else if (window.event) { 
        // 针对 IE 
        window.event.cancelBubble = true
      } 
      this.addFlag = !data.menuId
      if (data.menuId){
        for (const key in this.formAdd) {
          this.formAdd[key] = data[key] || this.formAdd[key]
        }
        this.isRedirect = data.redirect ? true : false
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
          //重定向时 将affix、noCache设置为false  重定向为false时 将 redirect设置为空
          this.formAdd.affix = this.isRedirect ? false : this.formAdd.affix
          this.formAdd.noCache = this.isRedirect ? false : this.formAdd.noCache
          this.formAdd.redirect = this.isRedirect ? this.formAdd.redirect : ""
          const msg = !this.addFlag ? "编辑成功" : "新增成功"
          systemApi.addEditMenu(this.formAdd).then(data => {
            this.dialogFormVisible = false
            this.$message.success(msg)
            this.init()
            //解决添加完菜单,所属父菜单下拉选项为空的bug
            this.formAdd.menuId = null
            this.$store.dispatch("user/reloadMenu")
          })
        }
      })
    },
    /**
     * @description: 获取所有菜单URL
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getAllLeavesNodePath(){
      systemApi.getAllLeavesNodePath().then(data => {
        this.allMenuUrl = data.data
      })
    },
    /**
     * @description: 根据菜单id获取子菜单列表
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getChildMenuList(isNotInit){
      if (!isNotInit) {
        this.formSearch.pageNum = 1
      }
      this.listLoading = true
      systemApi.getChildMenuByMenuId(this.formSearch).then(data => {
        this.listLoading = false
        const res = data.data
        this.total = res.total
        this.list = res.list
      })
    },
    /**
     * @description: 获取所有菜单树
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getAllMenuList(){
      this.selectmenuList = []
      systemApi.getAllMenuList().then(data => {
        this.menuList = data.data
        const rootItem = {
          menuId: "0",
          title: "根目录",
          children: data.data
        }
        this.selectmenuList.push(rootItem)
      })
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
     * @description: 删除图标
     * @param {type}
     * @return {type}
     * @author: syx
     */
    handdleDeleteIcon(){
      this.formAdd.icon = ""
      this.$forceUpdate()
    },
    /**
     * @description: 打开选择图标弹框
     * @param {type}
     * @return {type}
     * @author: syx
     */
    handleAddIcon() {
      this.dialogIconVisible = true
    },
    /**
     * @description: 选择图标
     * @param {type}
     * @return {type}
     * @author: syx
     */
    handleSelectIcon(item, index) {
      this.selectIconIndex = index
      this.selectIcon = `el-icon-${item}`
    },
    /**
     * @description: 点击节点
     * @param {type}
     * @return {type}
     * @author: syx
     */
    handleNodeClick(val){
      this.formSearch.menuId = val.menuId
      this.formAdd.parentMenuId = val.menuId
      this.getChildMenuList()
    },
    /**
     * @description: 选择图标
     * @param {type}
     * @return {type}
     * @author: syx
     */
    handleSelect() {
      if (this.selectIconIndex === "-1") {
        this.$message({
          type: "warning",
          message: "请先选择图标"
        })
        return
      }
      this.dialogIconVisible = false
      this.selectIconIndex = "-1"
      this.formAdd.icon = this.selectIcon
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
     * @description: 操作树形菜单
     * @param {type}
     * @Author: zhuxiaodong
     */
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node flex-c-s">
          <span class="title flex-grow">{node.label}</span>
          <span class="custom-tree-handle flex-shrink">
            <i
              class="el-icon-edit"
              title="修改"
              style="color:#E6A23C"
              on-click={() => this.addOrEdit(data)}
            ></i>
            <i
              class={data.isSystemMenu ? "el-icon-delete not-allow" : "el-icon-delete"}
              title="删除"
              style="margin-left:5px;color:#F56C6C"
              on-click={() => this.handleDelete(data)}
            ></i>
          </span>
        </span>
      )
    },
    /**
     * @description: 删除菜单
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleDelete(data){
      //阻止冒泡，解决点击编辑后默认父菜单为自己本身的bug
      if (event.stopPropagation) { 
        // 针对 Mozilla 和 Opera 
        event.stopPropagation()
      } else if (window.event) { 
        // 针对 IE 
        window.event.cancelBubble = true
      } 
      this.$confirm("是否确认删除?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        //谨慎操作
        systemApi.delMenu({menuId: data.menuId}).then(() => {
          this.$message.success("删除菜单成功")
          this.init()
          this.$store.dispatch("user/reloadMenu")
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page-menu{
  padding-top: 0;
  ::v-deep .el-tabs__item{
    padding: 0 20px !important;
  }
  .content{
    height: 596px;
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
      background: #fff;
    }
  }
}

  .menu-icon {
    font-size: 32px;
    margin-right: 20px;
    position: relative;
    .clear-icon {
      font-size: 18px;
      position: absolute;
      right: -10px;
      top: -10px;
      color: $blue_color;
      cursor: pointer;
      display: none;
    }
    &:hover {
      .clear-icon {
        display: block;
      }
    }
  }

.icon-dialog {
  .icon-wrap {
    max-height: 400px;
    overflow-y: scroll;
    .icon-item {
      margin: 10px;
      height: 50px;
      width: 50px;
      line-height: 50px;
      text-align: center;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
      &.active {
        background: $menu_active_text;
        color: #fff;
      }
    }
  }
}
</style>

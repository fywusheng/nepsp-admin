<template>
  <div class="app-container">
    <el-form ref="formSearch" :model="formSearch" :inline="true" class="search-form clearfix" size="small">
      <el-form-item label="账户名称" class="search-field fl" prop="acct">
        <el-input v-model="formSearch.acct" placeholder="请输入账户名称" clearable />
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
      <el-table ref="table" v-loading="listLoading" :data="list" height="450px" element-loading-text="加载中..."  fit highlight-current-row>
        <el-table-column align="center" type="index" label="序号" width="50">
          <template slot-scope="scope">{{ (scope.$index + 1 )+ (formSearch.pageNum - 1) * formSearch.pageSize }}</template>
        </el-table-column>
        <el-table-column label="姓名" prop="name" min-width="150"/>
        <el-table-column label="手机号" prop="acct"  min-width="150" />
        <el-table-column label="创建人" prop="crteAcct"  min-width="150" />
        <!-- <el-table-column label="账号状态" prop="crteAcct"  min-width="250">
          <template slot-scope="scope">
            <el-tag :type="scope.row.accountStatus | accountStatusFilter">{{scope.row.accountStatus | accountStatusFilterName}}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column label="最后登录时间" prop="crteTime"  min-width="150" >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.crteTime | parseTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" prop="created_at"  label="操作" width="250">
          <template slot-scope="scope">
            <el-link type="primary" size="small"  @click="addOrEdit(scope.row)">修改</el-link>
            <!-- <el-link :type="scope.row.accountStatus | accountStatusFilter('reverse')" size="small" @click="handleUpdate(scope.row.menuId)">{{scope.row.accountStatus | accountStatusFilterName('reverse')}}</el-link> -->
            <el-link type="danger" :title="scope.row.acctId === $store.getters.id ? '不可删除自己的账号' : ''" :disabled="scope.row.acctId === $store.getters.id" size="small" @click="remove(scope.row.acctId)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <y-pagination v-show="total>0" @pagination="fetchData" class="pageBox" :total="total" :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize"  />
    </div>
    <!-- 弹窗新增 -->
    <el-dialog :close-on-click-modal="false" :title="addFlag ? '新增' : '修改'" :visible.sync="dialogFormVisible" width="600px" class="add-dialog">
      <el-form ref="formAdd" :validate-on-rule-change="true" :model="formAdd" :rules="formAddRule" :label-width="formLabelWidth" size="small">
        <el-form-item label="姓名" prop="name">
          <el-input v-model="formAdd.name" clearable autocomplete="off" placeholder="请输入姓名" maxlength="11"  />
        </el-form-item>
        <el-form-item label="手机号" prop="acct">
          <el-input v-model="formAdd.acct" clearable autocomplete="off" placeholder="请输入手机号" maxlength="11"  />
        </el-form-item>
        <!-- <el-form-item label="联系电话" prop="tel">
          <el-input v-model="formAdd.tel" clearable autocomplete="off" placeholder="请输入联系电话" maxlength="11"  />
        </el-form-item> -->
        <el-form-item label="角色" prop="roles" v-show="formAdd.acctId !== '1'">
          <el-select :disabled="formAdd.acctId === $store.getters.id" v-model="formAdd.roles" filterable clearable placeholder="请选择角色" collapse-tags multiple size="small">
            <el-option v-for="item in rolesList" :key="item.roleId" :label="item.roleName" :value="item.roleId" />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="账号状态" prop="status">
          <el-radio v-model="formAdd.accountStatus"  label="1">启用</el-radio>
          <el-radio v-model="formAdd.accountStatus" label="2">停用</el-radio>
        </el-form-item> -->
        <el-form-item label="修改密码" v-if="!addFlag">
          <el-switch v-model="isEditPwd" active-color="#e7562c"></el-switch>
        </el-form-item>
        <el-form-item label="密码" v-show="addFlag || isEditPwd" :rules="isEditPwd ? [{ required: true, validator: validatePass, trigger: 'blur' }] : {}" prop="pwd">
          <el-input v-model="formAdd.pwd" clearable type="password" autocomplete="off" placeholder="请输入8-20包含数字、字母、特殊符号任意两种组合" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="()=>{dialogFormVisible=false; this.listLoading = false;}">取 消</el-button>
        <el-button type="primary" size="small" @click="submit('formAdd')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import md5 from "js-md5"
import { systemApi } from "@/api"
export default {
  name: "systemUserCenter",
  data() {
    // 密码校验
    var validatePass = (rule, value, callback) => {
      if (!value) {
        callback(
          new Error(
            "请输入由数字、字母、特殊符号两种以上组成的8-20位字符串的密码"
          )
        )
      } else {
        // 特殊 字符 为~!@#$%^&*其中之一
        const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(
            new Error(
              "密码是由数字、字母、特殊符号两种以上组成的8-20位字符串"
            )
          )
        }
      }
    }
    return {
      validatePass,
      addFlag: true, //是否是添加用户
      isEditPwd: false, //是否修改密码
      formLabelWidth: "100px",
      formSearch: {
        acct: "",
        pageNum: 1,
        pageSize: 10
      },
      listLoading: false,
      list: [],
      total: 10,
      dialogFormVisible: false,
      formAdd: {
        acctId: null,
        name: "",
        acct: "",
        roles: "",
        pwd: ""
      },
      formAddRule: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        acct: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^[1][3,4,5,7,8,9][0-9]{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur"
          }
        ],
        roles: [
          { required: true, message: "请选择用户角色", trigger: "change" }
        ]
      },
      rolesList: []
    }
  },
  filters: {
    accountStatusFilter(val, reverse){
      const obj = {
        "1": "success",
        "2": "danger",
        "3": "danger",
        "4": "success"
      }
      if (reverse){
        val = Number(val) + 2
      }
      return obj[val]
    },
    accountStatusFilterName(val, reverse){
      const obj = {
        "1": "启用",
        "2": "停用",
        "3": "停用",
        "4": "启用"
      }
      if (reverse){
        val = Number(val) + 2
      }
      return obj[val]
    }
  },
  watch: {
    dialogFormVisible(val){
      if (!val){
        this.formAdd = {
          acctId: null,
          name: "",
          acct: "",
          roles: []
        }
        this.isEditPwd = false
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    }
  },
  created() {
    this.handleSearch()
    this.getAllRoleList()
  },
  methods: {
    /**
     * @description: 获取所有角色
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getAllRoleList(){
      systemApi.getAllRoles().then(data => {
        this.rolesList = data.data
      })
    },
    /**
     * @description: 展示弹框
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    async addOrEdit(data = {}) {
      this.addFlag = !data.acctId
      if (data.acctId){
        const resData = await systemApi.getAcctById({queryId: data.acctId})
        const res = resData.data
        for (const key in this.formAdd) {
          this.formAdd[key] = res[key] || this.formAdd[key]
        }
      } else {
        this.isEditPwd = true
      }
      this.dialogFormVisible = true
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
     * @description: 提交
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    submit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid){
          const msg = this.addFlag ? "新增完成" : "修改完成"
          this.formAdd.pwd = this.formAdd.pwd&&md5(this.formAdd.pwd)
          systemApi.addOrEditAccount(this.formAdd).then(data => {
            this.$message.success(msg)
            this.handleSearch()
            this.dialogFormVisible = false
          })
        }
      })
    },
    /**
     * @description: 触发搜索
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleSearch(){
      this.formSearch.pageNum = 1
      this.fetchData()
    },
    /**
     * @description:  删除账号
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    remove(acctId){
      this.$confirm("是否确认删除账号？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        //谨慎操作
        systemApi.delectAccount({acctId}).then(data => {
          this.$message.success("删除成功")
          this.handleSearch()
        })
      })
    },
    /**
     * @description: 请求数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */  
    fetchData(){
      this.listLoading = true
      systemApi.getMyAddAccts(this.formSearch).then(data => {
        const res = data.data
        this.list = res.list
        this.total = res.total
        this.listLoading = false
      })
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
// 树样式重新定义
.com-tree {
  width: 550px;
  height: 350px;
  margin-bottom: 50px;
}
.com-tree:after {
  width: 0;
}

// 机构弹窗
.origin-dialog {
  ::v-deep.el-scrollbar{
    height: auto !important;
    min-height: 360px !important;
    &__wrap{
     margin-bottom: 8px !important; 
    }
  }
  ::v-deep.com-tree {
    margin: 0;
    width: 590px;
    padding: 0px !important;
  }
}
</style>


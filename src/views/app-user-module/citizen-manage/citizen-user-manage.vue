<template>
  <div class="page-citien-user app-container">
    <!-- 查询条件区开始 -->
    <el-form ref="formSearch" :model="formSearch" :inline="true" class="search-form clearfix" size="small">
      <el-form-item  class="search-field fl" label="所在地市" prop="uactAttribution">
        <y-united-select maxLevel="1" :delChildren="true" :settings="{'value':'regnCode','label':'regnName'}"  @codeChange="handdleSearch" :data="cityList" clearable v-model="formSearch.uactAttribution"></y-united-select>
      </el-form-item>
      <el-form-item  class="search-field fl" label="领卡状态" prop="eleCradStas">
        <el-select @change="handdleSearch" clearable v-model="formSearch.eleCradStas" placeholder="请选择领卡状态">
            <el-option value="0" label="未领取"></el-option>
            <el-option value="1" label="已领取"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item  class="search-field fl" label="认证状态" prop="crtfStas">
          <el-select @change="handdleSearch" clearable v-model="formSearch.crtfStas" placeholder="请选择认证状态">
            <el-option value="0" label="未认证"></el-option>
            <el-option value="2" label="已认证"></el-option>
          </el-select>
      </el-form-item>
      <el-form-item  class="search-field fl" label="手机号" prop="mobile">
          <el-input clearable v-model="formSearch.mobile" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item  class="search-field fl" label="认证日期" prop="startDate">
        <el-date-picker value-format="yyyy-MM-dd" @change="dateChange" v-model="daterange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item class="fr">
        <el-button   class="two-words" plain size="small" @click="onReset('formSearch')">重置</el-button>
        <el-button  class="two-words" type="primary"  size="small" @click="onSubmit('formSearch')">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 查询条件区结束 -->

    <!-- 查询结果区开始 -->
    <div class="table-wrap ">
      <el-table ref="table" v-loading="listLoading" height="446px" :data="list" element-loading-text="加载中..."   highlight-current-row>
        <el-table-column align="center" label="序号" prop="id" min-width="75">
          <template slot-scope="scope">
          {{ (scope.$index + 1 )+ (formSearch.pageNum - 1) * formSearch.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="psnName" show-overflow-tooltip />
        <el-table-column label="身份证号" prop="idCard"  show-overflow-tooltip />
        <el-table-column label="所在地" prop="uactAttributionName" show-overflow-tooltip />
        <el-table-column label="手机号" prop="uact" show-overflow-tooltip />
        <el-table-column label="领卡状态" prop="eleCradStas" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag :type="scope.row.eleCradStas === '0' ? 'info' : 'success'" size="small">{{scope.row.eleCradStas === "0" ? "未领取" : "已领取" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="领卡状态" prop="crtfStas" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag :type="scope.row.crtfStas === '0' ? 'info' : 'success'" size="small">{{scope.row.crtfStas === "0" ? "未认证" : "已认证" }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" prop="crteTime"  show-overflow-tooltip width="180">
          <template slot-scope="scope">
            {{scope.row.crteTime | parseTimeFilter }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="created_at" fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-link type="primary" size="small" @click="goDetail(scope.row)">详情</el-link>
            <el-link type="warning" size="small" @click="resetPwd(scope.row.uactId)">重置密码</el-link>
            <!-- <el-link type="warning" v-if="false" size="small" @click="goDetail(scope.row)">禁用</el-link> -->
            <el-link  type="danger" size="small" @click="deleteAccount(scope.row.uactId)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
        <!-- 分页 -->
      <y-pagination v-show="total>0" class="pageBox" :total="total" :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize" @pagination="fetchData" />
      <!-- 查询结果区结束 -->
    </div>
  </div>
</template>

<script>
import {appUserManageApi, commonApi} from "@/api"
import YUnitedSelect from "@/components/y-united-select/index"
export default {
  data(){
    return {
      showDetail: false, //展示详情
      cityList: [], //城市列表
      daterange: "", //选择的日期范围
      activateState: "", //激活状态
      formSearch: { //查询表单
        name: "", //昵称
        account: "", //手机号
        activateState: "", //实名认证
        startDate: "", //开始日期
        endDate: "", //截止日期
        pageNum: 1,
        pageSize: 10
      },
      // 分页
      total: 0,
      // 表格
      list: [],
      isFirstLoadTable: true,
      listLoading: false, // 表格加载
      rfidDict: []
    }
  },
  components: {
    YUnitedSelect
  },
  created(){
    //查询数据
    this.handdleSearch()
    //获取城市列表
    this.getCityList()
  },
  methods: {
    /**
     * @description: 重置密码
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    resetPwd(uactId){
      this.$confirm("是否确认重置密码？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        //谨慎操作
        appUserManageApi.resetPwd({uactId}).then(data => {
          this.$message.success("重置密码成功")
          console.log("resetPwd -> data", data)
        })
      })
    },
    /**
     * @description: 删除用户
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    deleteAccount(uactId){
      this.$confirm("是否确认删除？", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        //谨慎操作
        appUserManageApi.deleteUser({uactId}).then(data => {
          this.$message.success("删除用户成功")
          this.handdleSearch()
        })
      })
    },
    /**
     * @description: 获取城市列表
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getCityList(){
      commonApi.getRegnAreaTree().then(data => {
        this.cityList = data.data
      })
    },
    /**
     * @description: 搜索日期改变事件
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    dateChange(val) {
      this.formSearch.startDate = val&&val[0] || ""
      this.formSearch.endDate = val&&val[1] || ""
      this.handdleSearch()
    },
    // 前往用户详情
    goDetail(data){
      const psnId = data.soucId
      console.log("goDetail -> psnId", psnId)
      const acctId = data.uactId
      console.log("goDetail -> acctId", acctId)
      this.$router.push({name: "appUserCitizenUserDetail", params: {psnId: psnId, acctId: acctId}})
    },
    // 重置表单
    onReset(formName){
      // this.formSearch.startDate = "" 让resetFields清除
      this.formSearch.endDate = ""
      this.daterange = ""
      this.$refs[formName].resetFields()
      this.handdleSearch()
    },
    /**
     * @description: 触发搜索
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handdleSearch(){
      this.formSearch.pageNum = 1
      this.fetchData()
    },
    // 查询
    onSubmit(forName){
      this.handdleSearch()
    },
    /**
     * @description: 获取数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    fetchData(){
      this.listLoading = true
      appUserManageApi.findUserPage(this.formSearch).then(data => {
        this.listLoading = false
        if (data.data){
          this.list = data.data.list || []
          this.total = data.data.total || 0
        } else {
          this.list = []
          this.total = 0
        }
      })
    }
  }

}
</script>

<style lang="scss" scoped>
.content-box{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .content{
        overflow: hidden;
        text-overflow: ellipsis;
    }
    img{
        margin-left: 12px;
    }
}
</style>
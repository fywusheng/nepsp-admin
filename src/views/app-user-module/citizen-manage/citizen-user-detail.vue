<template>
  <div class="page-user-detail app-container">
    <!-- 用户信息开始 -->
    <div class="user-info  clearfix">
        <div class="left-info flex-c-s flex-col">
          <img class="imgs" :src="info.userIcon" alt="">
          <h3 class="name">{{info.psnName}}</h3>
          <div class="status">{{info.crtfStas === "0" ? "未认证" : "已认证"}}</div>
        </div>
        <div class="right-info clearfix">
          <div class="block fl clearfix" v-for="(item,index) in fiedlList" :key="index" >
            <div class="field fl">{{item.value}}</div>
            <div class="content">{{info[item.key] || "--"}}</div>
          </div>
        </div>
    </div>
    <!-- 用户信息结束 -->
    <!-- 查询结果区开始 -->
    <div class="table-wrap ">
      <el-table ref="table" v-loading="listLoading" height="446px" :data="list" element-loading-text="加载中..."   highlight-current-row>
        <el-table-column align="center" label="序号" prop="id" min-width="75">
            <template slot-scope="scope">
            {{ (scope.$index + 1 )+ (formSearch.pageNum - 1) * formSearch.pageSize }}
            </template>
        </el-table-column>
        <el-table-column label="操作类别" prop="code_biz_info" show-overflow-tooltip />
        <el-table-column label="操作对象" prop="opter_name"  show-overflow-tooltip />
        <el-table-column label="操作地点" prop="org_location" show-overflow-tooltip />
        <el-table-column label="操作时间" prop="create_time"  show-overflow-tooltip />
      </el-table>
      <!-- 分页 -->
      <y-pagination v-show="total>0" class="pageBox" :total="total" :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize" @pagination="fetchData" />
    </div>
    <!-- 查询结果区结束 -->
  </div>
</template>

<script>
import { getAllArr} from "@utils/getRouterList"
import {appUserManageApi} from "@/api"
export default {
  name: "",
  props: {
    psnId: {
      type: String,
      require: true
    }
  },
  data(){
    return {
      info: {}, //用户信息
      fiedlList: [
        {
          key: "psnName",
          value: "姓名"
        },
        {
          key: "idCard",
          value: "证件号码"
        },
        {
          key: "tel",
          value: "绑定手机"
        },
        {
          key: "gend",
          value: "性别"
        },
        {
          key: "brdy",
          value: "出生年月"
        },
        {
          key: "hsregAddr",
          value: "常住地址"
        },
        {
          key: "email",
          value: "邮箱"
        }
      ],
      listLoading: false,
      list: [],
      formSearch: {
        psnId: "",
        pageNum: 1,
        pageSize: 10
      },
      acctId: "", //用户ID
      total: 0
    }
  },
  computed: {
    permissionAllMenuNameList(){
      const copyArr = JSON.parse(JSON.stringify(this.$store.getters.menuTree))
      const nameArr = getAllArr(copyArr, {wantField: "name"})
      return nameArr
    }
  },
  async created() {
    await this.checkPermission()
    this.acctId = this.$route.params.acctId
    this.formSearch.psnId = this.$route.params.psnId
    const len = (14 - this.fiedlList.length) > 0 ? (14 - this.fiedlList.length) : 0
    console.log("created -> len", len)
    for (let i = 0; i < len; i++){
      const obj = {key: "", value: ""}
      this.fiedlList.push(obj)
    }

    //查询扫码记录
    this.handleSearch()

    //获取用户详情
    this.getUserDetail()
  },
  methods: {
    /**
     * @description: 查询是否有市民列表权限
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    checkPermission(){
      if (!this.permissionAllMenuNameList.includes("appUserCitizenUserManage")){
        const view = this.$route
        //去除市民详情 菜单页签
        this.$store.dispatch("tagsView/delView", view).then(() => {
          this.$router.replace({name: "page401"})
        })
      }
    },
    /**
     * @description: 获取用户详情
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getUserDetail(){
      appUserManageApi.userDetail({acctId: this.acctId}).then(data => {
        this.info = data.data&&data.data.userDetail
        this.info.gend = this.info.gend === "1" ? "男" : "女"
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
     * @description: 搜索
     * @param {type} 
     * @return {type} 
     * @author: syx
     */  
    fetchData(){
      this.listLoading = true
      appUserManageApi.userDetailScanList(this.formSearch).then(data => {
        this.listLoading = false
        if (data.data){
          this.list = data.data.ecUserList && data.data.ecUserList.list || []
          this.total = data.data.ecUserList && data.data.ecUserList.total || 0
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
.page-user-detail{
  width: 100%;
  .user-info{
    width: 100%;
    height: 300px;
    background: #fff;
    margin-bottom: 10px;
    padding: 10px;
    .left-info{
      float:left;
      width: 300px;
      height: 100%;
      border: 1px solid $border_color;
      .imgs{
        width: 160px;
        height: 160px;
        border-radius: 50%;
        margin-top: 10px;
      }
      .name{
        line-height: 24px;
        font-size: 18px;
      }
      .status{
        padding: 0 16px;
        height: 26px;
        line-height: 26px;
        border-radius: 8px;
        font-size: 14px;
        color: #fff;
        background: $main_color;
      }
    }
    .right-info {
      height:100%;
      margin-left: 300px;
      // background: yellow;
       border-top: 1px solid $border_color;
      .block{
        width: 50%;
        height: 40px;
        font-size: 14px;
        border-bottom: 1px solid $border_color;
        border-right: 1px solid $border_color;
        .field{
          width: 120px;
          height: 100%;
          border-right: 1px solid $border_color;
          line-height: 40px;
          text-align: right;
          padding-right: 14px;
          background: $second_bg_color;
          color: $second_text_color;
        }
        .content{
          line-height: 40px;
          margin-left: 120px;
          padding-left: 10px;
          height: 100%;
        }
      }
    }
  }
}
</style>
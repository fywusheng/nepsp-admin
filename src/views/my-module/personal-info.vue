<template>
  <div class="user-info app-container">
    <div class="info-wrap">
      <y-title content="基础信息" mBottom='0' />
      <div class="btn-wrap">
        <el-button size="small" v-if='editFlag' @click="editFlag=false">取消</el-button>
        <el-button type="primary" size="small" @click="handleEdit('formEdit')">{{editFlag?'保存':'修改'}}</el-button>
      </div>
       <el-form label-width="96px" :model="formEdit" ref="formEdit" :rules="formEditRule" size="small">
        <el-form-item label="用户名：" >
          <span>{{$store.getters.uact}}</span>
        </el-form-item>
        <el-form-item label="昵称：" prop="userNknm">
          <el-input v-show="editFlag" clearable v-model="formEdit.userNknm" :maxlength="20" autocomplete="off" placeholder="请输入昵称" />
          <span v-show="!editFlag">{{$store.getters.name || '--'}}</span>
        </el-form-item>
       </el-form>
    </div>
    <div class="info-wrap">
      <y-title content="我的权限" mBottom='0' />
      <div class="content">
        <div class="permission-list">
          <div class="list-item clearfix" v-for="item in menuList" :key="item.menuId">
            <span class="label fl">{{item.title}}</span>
            <div class="value clearfix fl">
              <span class='value-item fl' v-for="items in item.children" :key="items.menuId"><img :src="checkedImg(items.menuId)" class="check-i" alt="">{{items.title}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { systemApi } from "@/api"
import { myApi } from "@/api"
import { getAllArr} from "@utils/getRouterList"
export default {
  name: "myPersonalInfo",
  data() {
    return {
      menuList: [],
      formEdit: {
        uactId: this.$store.getters.id,
        userNknm: this.$store.getters.name
      },
      editFlag: false,
      formEditRule: {
        userNknm: [
          { required: true, message: "请输入昵称", trigger: "change" }
        ]
      }
    }
  },
  computed: {
    permissionMenuIdList(){
      const copyArr = JSON.parse(JSON.stringify(this.$store.getters.menuTree))
      const idArr = getAllArr(copyArr)
      return idArr
    }
  },
  watch: {
    editFlag(val){
      if (!val) {
        this.formEdit.userNknm = this.$store.getters.name
      }
      this.$nextTick(() => {
        this.$refs.formEdit.clearValidate()
      })
    }
  },
  created() {
    //获取菜单树
    this.getAllMenuList()
  },
  methods: {
    /**
     * @description: 判断图片
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    checkedImg(menuId){
      return this.permissionMenuIdList.includes(menuId) ? require("@pic/common/checked_icon@2x.png") : require("@pic/common/Checkbox_icon@2x.png")
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
     * @description: 点击修改/保存
     * @param {type} 
     * @return {type} 
     * @author: syx
     */  
    handleEdit(formName) {
      if (!this.editFlag) {
        this.editFlag = true
        return
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          myApi.modifyOperateAcct(this.formEdit).then(data => {
            this.$store.dispatch("user/setName", this.formEdit.userNknm)
            this.$message.success("修改用户名成功")
            this.editFlag = false
          })
        }
      })
     
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';
.user-info {
  .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
    margin-bottom: 4px;
  }
  .info-wrap{
    background: #fff;
    padding-top: 5px;
    padding-bottom: 15px;
    margin-bottom: 12px;
    position: relative;
    &:last-child{
      margin-bottom: 0;
      padding-bottom: 0;
    }
    .el-input{
      width: 300px;
    }
    .btn-wrap{
      position: absolute;
      top: 16px;
      right: 12px;
      line-height: 32px;
    }
  }
  .content{
    padding: 10px;
    min-height: 400px;
    .title{
      margin-left: 9px;
      margin-bottom: 10px;
    }
    .permission-list{
      font-size: 14px;
      border: 1px  solid $third_border_color;
      .list-item{
        border-bottom: 1px  solid $third_border_color;
        line-height: 20px;
        background: #fff;
        overflow: hidden;
        &:last-child{
          border-bottom: none;
        }
      }
      .label{
        width: 140px;
        padding-right: 16px ;
        text-align: right;
        background: $second_bg_color;
        color: $main_text_color;
        padding-bottom: 999px;
        margin-bottom: -989px;
        line-height: 24px;
        padding-top: 10px;
        display: inline-block;
      }
      .value{
        width: calc(100% - 140px);
        padding: 10px 0 10px 16px ;
        color: $main_text_color;
        background: #fff;
        .value-item{
          display: flex;
          align-items: center;
          margin-right: 20px;
          line-height: 24px;
          .check-i{
            width: 16px;
            height: 16px;
            margin-right: 8px;
          }
        }
      }
    }
  }
}
</style>
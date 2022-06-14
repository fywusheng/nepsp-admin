<template>
  <div class="app-container short-msg-container">
    <el-form class="short-msg-search-box-body search-form clearfix" v-show="showSearchBox" :inline="true" size="small">
      <el-form-item label="关键词：" label-width="110px" class="search-field fl" prop="keyword">
        <el-input v-model="searchData.keyword" placeholder="请输入关键词" clearable />
      </el-form-item>
      <el-form-item label="发布人员：" label-width="110px" class="search-field fl" prop="sender">
        <el-input v-model="searchData.sender" placeholder="请输入发布人员" clearable />
      </el-form-item>
      <el-form-item label="发送时间：" label-width="110px" class="search-field fl" prop="time">
        <el-date-picker
         v-model="searchData.time"
         type="daterange"
         range-separator="-"
         value-format="timestamp"
         start-placeholder="开始日期"
         end-placeholder="结束日期"
         clearable
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="fr">
        <el-button class="two-words" plain size="small" @click="onClickReset">重置</el-button>
        <el-button class="two-words" type="primary" size="small" @click="onClickSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <div class="short-msg-center">
      <div class="short-msg-center-head flex-c-b">
        <div class="short-msg-center-head-left"></div>
        <div class="short-msg-center-head-right">
          <el-button class="head-item" type="success" @click="dialogFormVisible = true">发送短信</el-button>
        </div>
      </div>

      <div class="short-msg-center-body" v-if="messageList && messageList.length > 0" v-loading="loading">
        <div class="short-msg-center-body-item" v-for="(item, index) in messageList" :key="item.pshId">
          <div class="short-msg-item-index">{{ index + 1 }}</div>
          <div class="short-msg-item-head flex-c-b">
            <div class="short-msg-item-head-left">
              <div>发布人员: <span style="color: #999999;margin-right: 15px;">{{ item.sender }}</span></div>
              <div>发送时间: <span style="color: #999999;margin-right: 15px;"> {{ handleSendDate(item.actSendTime) }}</span></div>
              <div>接受对象: <span style="text-decoration:underline;color:#0066FF;">{{ item.recerList ? item.recerList.split(",").length : 0 }}</span>人</div>
            </div>
            <div class="short-msg-item-head-right">
              <el-button type="text" @click="onClickDeleteMsg(item)">删除</el-button>
            </div>
          </div>
          <div class="short-msg-item-body">
            {{ item.smsTmplCont }}
          </div>
        </div>
      </div>

      <div class="no-result-container flex-c-c" v-else>
        暂无数据
      </div>

      <y-pagination
       v-show="total > 0"
       class="pageBox short-msg-pager"
       @pagination="handlePagination"
       :total="total"
       :page.sync="searchData.pageNum"
       :limit.sync="searchData.pageSize"
      />
    </div>

    <el-dialog class="send-msg-dialog" :close-on-click-modal="false" title="发送短信" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="messageDialogForm" :model="messageInfo" :rules="dialogRule" label-width="100px" size="small">
        <el-form-item label="发送对象" prop="mobile">
          <el-input v-model="messageInfo.mobile" placeholder="输入用户手机号码，多个号码请用逗号隔开" />
        </el-form-item>
        <el-form-item label="短信内容" prop="content" style="margin-bottom: 10px;">
          <el-input
           type="textarea"
           v-model="messageInfo.content"
           :autosize="{ minRows: 4, maxRows: 4}"
           :maxlength="500"
           placeholder="请输入短信内容"
          />
        </el-form-item>
        <el-form-item label="">
          <div class="form-item-tips">
            内容上限不能超过
            <span style="color:#F04844;">500</span>字，
            当前已输入<span style="color:#F04844;">{{ messageInfo.content ? messageInfo.content.length : 0 }}</span>字，
            将作为<span style="color:#F04844;">{{ messageInfo.mobile ? messageInfo.mobile.split(",").length : 0 }}</span>条发送
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false ">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { msgManageApi as msgApi } from "@/api"
import { parseTime } from "@/utils/index.js"

export default {
  name: "messageShortMessageManage",
  data() {
    /**
     * @description: 校验 dialog 的发送对象字段规则
     * @param {type} rule 校验规则
     * @param {type} value 输入内容
     * @param {type} callback 回调函数
     */
    const validatePhone = (rule, value, callback) => {
      if (value.indexOf("，") > -1) {
        callback(new Error("请用英文逗号"))
      } else {
        let flag = true
        value.split(",").forEach(val => {
          if (!(/^(1)[0-9]{10}$/.test(val))) {
            flag = false
          }
        })
        if (flag) {
          callback()
        } else {
          callback(new Error("请输入正确的手机号码"))
        }
      }
    }
    return {
      showSearchBox: true, // 是否显示筛选器
      loading: false, // 表格loading效果
      searchData: {
        pageNum: 1, // 当前页码
        pageSize: 10 // 当前页面最大显示条数
      }, // 筛选器数据
      messageInfo: {}, // 短信数据
      messageList: [], // 短信列表
      total: 0, // 短信总条数
      dialogFormVisible: false, // 弹窗是否显示
      dialogRule: {
        mobile: [
          { required: true, message: "请输入用户手机号码", trigger: "blur" },
          { validator: validatePhone, trigger: "blur" }
        ],
        content: [{ required: true, message: "请输入发送内容", trigger: "blur" }]
      } // 弹窗表格校验规则
    }
  },
  created() {
    this.loadShortMessageList()
  },
  methods: {
    /**
     * @description: 点击查询时重置页数
     */
    onClickSearch() {
      this.searchData.pageNum = 1
      this.loadShortMessageList()
    },
    /**
     * @description: 点击筛选器重置事件
     */
    onClickReset() {
      this.searchData = {
        pageNum: 1,
        pageSize: 10
      }
      this.loadShortMessageList()
    },
    /**
     * @description: 分页器点击操作
     * @param {type} page 当前点击页数
     * @param {type} limit 当前页码
     */
    handlePagination({ page, limit }) {
      this.searchData.pageNum = page
      this.searchData.pageSize = limit
      this.loadShortMessageList()
    },
    /**
     * @description: 处理发送时间
     */
    handleSendDate(time) {
      return time ? parseTime(time, "{y}-{m}-{d} {h}:{i}:{s}") : ""
    },
    /**
     * @description: 加载短信列表
     */
    async loadShortMessageList() {
      this.loading = true
      try {
        const { type, data } = await msgApi.getShortMessageList(this.searchData)
        if (type === "success") {
          this.messageList = data.list
          this.total = data.total
        }
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },
    /**
     * @description: 点击删除短信操作
     * @param {type} msg Object 短信信息
     */
    onClickDeleteMsg(msg) {
      this.$confirm("确认删除该数据吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.handleDeleteMsg(msg.pshId)
      }).catch(() => { })
    },
    /**
     * @description: 处理删除短信操作
     * @param {type} id String
     */
    async handleDeleteMsg(id) {
      this.loading = true
      try {
        const { type } = await msgApi.deleteShortMessage({ pshId: id })
        if (type === "success") {
          this.$message({
            type: "success",
            message: "删除成功!"
          })
          this.loadShortMessageList()
        }
      } catch (e) {
        this.loading = false
      }
    },
    /**
     * @description: 发送短信按钮点击校验
     */
    handleSubmit() {
      this.$refs.messageDialogForm.validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.handleSendMessage()
        }
      })
    },
    /**
     * @description: 处理发送短信操作
     */
    async handleSendMessage() {
      try {
        const { type } = await msgApi.addShortMessage(this.messageInfo)
        if (type === "success") {
          this.dialogFormVisible = false
          this.$message({
            type: "success",
            message: "短信发送成功!"
          })
          this.loadShortMessageList()
          this.messageInfo = {
            mobile: "",
            content: ""
          }
        }
      } catch (e) {
        this.$message({
          type: "error",
          message: "短信发送失败!"
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.short-msg-container {
  .short-msg-center {
    width: 100%;
    &-head {
      padding: 15px 30px;
      background-color: #ffffff;
      &-left {
        display: flex;
        font-size: 18px;
        align-items: center;
      }
      &-right {
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

    &-body {
      width: 100%;
      &-item {
        background-color: #ffffff;
        position: relative;
        font-size: 15px;
        margin-top: 10px;
        .short-msg-item-index {
          position: absolute;
          top: 12px;
          left: 15px;
        }
        .short-msg-item-head {
          height: 45px;
          margin-left: 45px;
          border-bottom: 1px solid #f3f3f3;
          font-size: 14px;
          &-left {
            display: flex;
          }
          &-right {
            margin-right: 20px;
          }
        }
        .short-msg-item-body {
          margin-left: 45px;
          padding: 15px 30px 15px 0;
        }
      }
    }
    .short-msg-pager {
      height: 60px;
      margin-top: 10px;
      padding-right: 20px;
      justify-content: flex-end;
      display: flex;
    }
    .no-result-container {
      width: 100%;
      min-height: 500px;
      background-color: #ffffff;
      font-size: 24px;
      color: #999;
    }
  }

  .send-msg-dialog {
    .el-dialog {
      .el-dialog__footer {
        padding: 10px 20px 20px;
      }
    }
    .form-item-tips {
      font-size: 12px;
      text-align: left;
      line-height: 18px;
      color:#999999;
    }
    .dialog-footer {
      border-top: 1px solid #e3e3e3;
    }
  }
}

</style>

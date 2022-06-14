<template>
  <div class="app-container">
    <el-form class="search-form clearfix" v-show="showSearchBox" :inline="true" size="small">
      <el-form-item label="标题：" label-width="110px" class="search-field fl" prop="ttl">
        <el-input v-model="searchData.ttl" placeholder="请输入标题" clearable />
      </el-form-item>
      <el-form-item label="内容：" label-width="110px" class="search-field fl" prop="cont">
        <el-input v-model="searchData.cont" placeholder="请输入内容" clearable />
      </el-form-item>
      <el-form-item label="发送人：" label-width="110px" class="search-field fl" prop="sender">
        <el-input v-model="searchData.sender" placeholder="请输入发送人" clearable />
      </el-form-item>
      <el-form-item label="接收人号码：" label-width="110px" class="search-field fl" prop="recerMobile">
        <el-input v-model="searchData.recerMobile" placeholder="请输入接收人号码" clearable />
      </el-form-item>
      <el-form-item label="阅读状态：" label-width="110px" class="search-field fl" prop="readStas">
        <el-select v-model="searchData.readStas" placeholder="请选择阅读状态" clearable>
          <el-option label="未读" value="0"></el-option>
          <el-option label="已读" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间：" label-width="110px" class="search-field fl" prop="sendDate">
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

    <div class="table-wrap">
      <div class="table-edit-box flex-c-b">
        <div class="table-edit-box-title"></div>
        <div class="table-edit-box-operator">
          <el-button class="head-item" type="success" @click="dialogFormVisible = true">发送站内信息</el-button>
        </div>
      </div>

      <el-table
        ref="insideMsgTable"
        v-loading="listLoading"
        :data="insideMsgList"
        element-loading-text="加载中..."
        border
        highlight-current-row
      >
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column label="消息标题" align="center" prop="ttl"></el-table-column>
        <el-table-column label="公告内容" align="center" prop="cont"></el-table-column>
        <el-table-column label="发布人" align="center" prop="sender"></el-table-column>
        <el-table-column label="接收人号码" align="center" prop="recerMobile"></el-table-column>
        <el-table-column label="发送时间" align="center" prop="sendTime">
          <template slot-scope="scope">
            {{ handleSendDate(scope.row.sendTime) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="250">
          <template slot-scope="scope">
            <span v-if="scope.row.readStas === 1" style="color: #0066ff">已读</span>
            <span v-else style="color: #fa8536">未读</span>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <y-pagination
        v-show="total > 0"
        class="pageBox"
        :total="total"
        :page.sync="searchData.pageNum"
        :limit.sync="searchData.pageSize"
        @pagination="handlePagination"
      />
    </div>

    <el-dialog class="send-msg-dialog" :close-on-click-modal="false" title="发送站内信息" :visible.sync="dialogFormVisible" width="600px">
      <el-form ref="insideMsgDialogForm" :model="messageInfo" :rules="dialogRule" label-width="100px" size="small">
        <el-form-item label="消息标题" prop="ttl">
          <el-input v-model="messageInfo.ttl" placeholder="请输入消息标题" />
        </el-form-item>
        <el-form-item label="接收人号码" prop="recerMobile">
          <el-input v-model="messageInfo.recerMobile" placeholder="输入接收人号码" />
        </el-form-item>
        <el-form-item label="重定向地址" prop="rediAddr">
          <el-input v-model="messageInfo.rediAddr" placeholder="请输入重定向地址" />
        </el-form-item>
        <el-form-item label="消息内容" prop="cont">
          <el-input type="textarea" v-model="messageInfo.cont" :autosize="{ minRows: 4, maxRows: 4 }" :maxlength="500" placeholder="请输入消息内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { msgManageApi as msgApi } from "@/api"
import { parseTime } from "@/utils/index.js"

export default {
  name: "MessageInsideMessageManage",
  data() {
    return {
      showSearchBox: true, // 是否显示筛选器
      searchData: {
        pageNum: 1, // 当前页码
        pageSize: 10 // 当前页面最大显示条数
      }, // 筛选器数据
      listLoading: false, // 表格 loading 效果
      insideMsgList: [], // 站内消息列表
      total: 0, // 站内消息列表条数
      messageInfo: {}, // 站内消息详情
      dialogFormVisible: false, // 是否显示 dialog
      dialogRule: {
        ttl: [{ required: true, message: "请输入消息标题", trigger: "blur" }],
        recerMobile: [
          { required: true, message: "请输入接收人号码", trigger: "blur" },
          { pattern: /^1[3456789]\d{9}$/, message: "请输入正确的手机号码" }
        ],
        cont: [
          { required: true, message: "请输入消息内容", trigger: "blur" }
        ]
      }
    } // dialog 表单校验规则
  },
  created() {
    // 加载站内消息列表
    this.loadInsideMessageList()
  },
  watch: {
    // 监听 dialog 的隐藏时清空表单内容
    dialogFormVisible(newVal) {
      if (!newVal) {
        setTimeout(() => {
          this.$refs.insideMsgDialogForm.resetFields()
        })
      }
    }
  },
  methods: {
    /**
     * @description: 点击筛选器搜索事件
     * @author: chenwz
     */
    onClickSearch() {
      this.searchData.pageNum = 1
      this.loadInsideMessageList()
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
      this.loadInsideMessageList()
    },
    /**
     * @description: 分页器事件
     * @author: chenwz
     */
    handlePagination({ page, limit }) {
      this.searchData.pageNum = page
      this.searchData.pageSize = limit
      this.loadInsideMessageList()
    },
    /**
     * @description: 处理发送时间
     * @author: chenwz
     */
    handleSendDate(time) {
      return time ? parseTime(time, "{y}-{m}-{d} {h}:{i}:{s}") : ""
    },
    /**
     * @description: 加载站内消息列表
     * @author: chenwz
     */
    async loadInsideMessageList() {
      this.listLoading = true
      const params = { ...this.searchData, msgType: 1 }
      try {
        const { type, data } = await msgApi.getInsideMsgList(params)
        if (type === "success") {
          this.insideMsgList = data.list
          this.total = data.total
        }
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },
    /**
     * @description: 发送消息前校验输入内容
     * @author: chenwz
     */
    handleSubmit() {
      this.$refs.insideMsgDialogForm.validate((valid) => {
        if (!valid) {
          return false
        } else {
          this.handleSendMessage()
        }
      })
    },
    /**
     * @description: 处理发送消息事件
     * @author: chenwz
     */
    async handleSendMessage() {
      const params = {
        ...this.messageInfo,
        sender: this.$store.state.user.id ? this.$store.state.user.id : "admin",
        msgType: 1
      }
      try {
        const { type } = await msgApi.sendMessage(params)
        if (type === "success") {
          this.$message({
            type: "success",
            message: "发送成功!"
          })
          this.dialogFormVisible = false
          this.loadInsideMessageList()
        }
      } catch (e) {
        this.$message({
          type: "success",
          message: "发送失败!"
        })
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

.msg-info-dialog {
  ::v-deep .el-dialog {
    .el-dialog__body {
      // height: 300px;
      .msg-info-center {
        padding-bottom: 5px;
        .msg-info-center-head {
          display: flex;
          flex-direction: column;
          .msg-title {
            font-size: 18px;
            color: #666666;
            margin-bottom: 10px;
          }
          .msg-date {
            font-size: 14px;
            color: #999999;
          }
        }
        .msg-info-center-body {
          min-height: 200px;
          background: #f3f3f3;
          border-radius: 3px;
          padding: 10px;
        }
      }
    }
  }
}
</style>

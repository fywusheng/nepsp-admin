<template>
  <div class="app-container">
    <el-form class="system-manage-search-box-body search-form clearfix" v-show="showSearchBox" :inline="true" size="small">
      <el-form-item label="接收人ID" label-width="110px" class="search-field fl">
        <el-input v-model="searchData.recer" placeholder="请输入接收人ID" clearable />
      </el-form-item>
      <el-form-item label="消息类型" label-width="110px" class="search-field fl">
        <el-select v-model="searchData.messageType" placeholder="请选择消息类型" clearable>
          <el-option v-for="item in messageTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间：" label-width="110px" class="search-field fl">
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
      </div>

      <el-table ref="remindTable" v-loading="listLoading" :data="remindList" element-loading-text="加载中..." border highlight-current-row>
        <el-table-column label="发送帐号" align="center" prop="sender"></el-table-column>
        <el-table-column label="发送时间" align="center" prop="sendTime">
          <template slot-scope="scope">
            {{ handleSendDate(scope.row.sendTime) }}
          </template>
        </el-table-column>
        <el-table-column label="消息类型" align="center" prop="tmplTtl"></el-table-column>
        <el-table-column label="发送内容" align="center" prop="cont"></el-table-column>
      </el-table>

      <!-- 分页 -->
      <y-pagination v-show="total > 0" class="pageBox" :total="total" :page.sync="searchData.pageNum" :limit.sync="searchData.pageSize" @pagination="handlePagination" />
    </div>
  </div>
</template>

<script>
import { msgManageApi as msgApi } from "@/api"
import { parseTime } from "@/utils/index.js"

export default {
  name: "messageSystemRemind",
  data() {
    return {
      listLoading: false, // loading 效果
      showSearchBox: true, // 是否展示搜索框
      searchData: {
        pageNum: 1, // 当前页码
        pageSize: 20 // 当前页面最大显示条数
      }, // 筛选器内容
      messageTypeList: [], // 系统消息列表
      remindList: [], // 系统提示列表
      total: 0 // 系统提示列表总数
    }
  },
  created() {
    this.loadMessageTypeList()
    this.loadRemindList()
  },
  methods: {
    /**
     * @description: 点击查询时重置页数
     * @author: chenwz
     */
    onClickSearch() {
      this.searchData.pageNum = 1
      this.loadRemindList()
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
      this.loadRemindList()
    },
    /**
     * @description: 处理发送时间
     * @author: chenwz
     */
    handleSendDate(time) {
      return time ? parseTime(time, "{y}-{m}-{d} {h}:{i}:{s}") : ""
    },
    /**
     * @description: 分页器事件
     * @param {type} page Number 当前页
     * @author: chenwz
     */    
    handlePagination({ page, limit }) {
      this.searchData.pageNum = page
      this.searchData.pageSize = limit
      this.loadNoticeList()
    },
    /**
     * @description: 加载系统消息类型
     * @author: chenwz
     */
    async loadMessageTypeList() {
      try {
        const { type, data } = await msgApi.getMessageTypeList({ tmplType: 3 })
        if (type === "success") {
          this.messageTypeList = data
        }
      } catch (e) {
        this.listLoading = false
      }
    },
    /**
     * @description: 加载系统提醒
     * @author: chenwz
     */
    async loadRemindList() {
      this.listLoading = true
      const params = { ...this.searchData, msgType: 2 }
      try {
        const { type, data } = await msgApi.getInsideMsgList(params)
        if (type === "success") {
          this.remindList = data.list
          this.total = data.total
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
</style>
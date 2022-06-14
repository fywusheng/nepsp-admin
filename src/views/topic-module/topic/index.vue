<template>
  <div class="main-content">
      <el-form :inline="true" label-width="100px" :model="searchParam">
        <el-form-item label="">
          <el-input v-model="searchParam.page_id" @keyup.native.enter="changeSize(pageSize)" placeholder="请输入专题页面标识..." clearable size="small"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input v-model="searchParam.page_name" @keyup.native.enter="changeSize(pageSize)" placeholder="请输入专题页面名称..." clearable size="small"></el-input>
        </el-form-item>
        <el-form-item class="form-item-btns">
          <el-button type="primary" @click="changeSize(pageSize)">查询</el-button>
          <el-button class="mb-10" type="default" @click="showModal()">添加专题</el-button>
        </el-form-item>
      </el-form>
    <el-table
      :data="dataList"
      :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
      size="mini"
      v-loading="loading"
    >
      <div slot="empty" class="empty-wrap"><i class="iconfont icon-tishi"></i><span>尚未添加专题</span>
      </div>
      <el-table-column
        label="专题标识"
        prop="page_id"
        width="200px">
      </el-table-column>
      <el-table-column
        prop="page_name"
        label="专题名称"
        width="120px">
      </el-table-column>
      <el-table-column
        prop="url"
        label="专题链接"
        width="350px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="online(scope.row)">{{ scope.row.url }}</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="category"
        label="类型"
        width="120px">
        <template slot-scope="scope">
          {{ scope.row.category | cateText }}
        </template>
      </el-table-column>
      <el-table-column
        label="创建人" width="100px">
        <template slot-scope="scope">
          {{ scope.row.operator && scope.row.operator.create && scope.row.operator.create.userName }}
        </template>
      </el-table-column>
      <el-table-column
        label="发布人" width="100px">
        <template slot-scope="scope">
          {{ scope.row.operator && scope.row.operator.publish && scope.row.operator.publish.userName }}
        </template>
      </el-table-column>
      <el-table-column
        width="220px;"
        label="操作"
        align="center">
        <template slot-scope="scope">
          <el-link class="ml-10" type="primary" @click="edit(scope.row)">编辑</el-link>
          <el-link class="ml-10" type="primary" @click="showModal(scope.row, 'modal', true)">复制</el-link>
          <!--<el-button type="primary" :plain="true" size="small" @click="fetch(scope.row)">同步</el-button>-->
          <el-link class="ml-10" type="danger" @click="remove(scope.row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background v-show="totalSize > 10"
      :page-size="pageSize"
      :current-page="pageFrom"
      @size-change="changeSize"
      @current-change="changePage"
      layout="total, slot, jumper, prev, pager, next"
      :total="totalSize">
    </el-pagination>

    <edit-modal ref="modal" :current="curTopic" :origin="srcTopic" @close="close" @save-done="loadData"></edit-modal>
  </div>
</template>
<script>
import topicApi from "@/api/pop/topic"
import EditModal from "./edit-modal"

const defTopic = {
  page_title: "",
  page_name: "",
  page_type: "m",
  category: "h5"
}
export default {
  name: "contentMagSpecialTemplate",
  data() {
    return {
      pageFrom: 1,
      pageSize: 15,
      dataList: [],
      totalSize: 10,
      loading: false,
      searchParam: {},
      curTopic: Object.assign({}, defTopic),
      srcTopic: {},
      maps: {},
      checkedIds: []
    }
  },
  components: {
    EditModal
  },
  async mounted() {
    this.loadData()
  },
  filters: {
    cateText(key) {
      return {
        h5: "移动端",
        pc: "PC"
      }[key] || ""
    }
  },
  methods: {
    changePage(pageNo) {
      this.pageFrom = pageNo
      this.loadData()
    },
    changeSize(pageSize) {
      this.pageSize = pageSize
      this.pageFrom = 1
      this.loadData()
    },
    async loadData() {
      this.loading = true
      const params = {
        pageFrom: this.pageFrom,
        pageSize: this.pageSize
      }
      const { data: result } = await topicApi.list(Object.assign(params, this.searchParam))
      this.loading = false
      if (result.code === 200) {
        this.$nextTick(() => {
          this.dataList = result.data.rows
          this.totalSize = result.data.total
        })
      } else {
        this.$message.error(result.msg)
      }
    },
    close() {
      this.srcTopic = {}
      this.curTopic = {}
    },
    showModal(data, refName = "modal", isCopy) {
      if (isCopy) {
        this.srcTopic = data || {}
        this.curTopic = Object.assign({}, defTopic)
        this.curTopic.page_name = data.page_name + "-copy"
      } else {
        this.srcTopic = {}
        this.curTopic = data || Object.assign({}, defTopic)
      }
      this.$refs[refName].show(true)
      if (this.curTopic.page_id) {
        this.$refs[refName].setEdit(true)
      }
    },
    edit(data) {
      if (data.category === "pc") {
        // window.open(`#/apps/topic/pcEdit/${data.page_id}`)
        this.$router.push({name: "topicPcEditor", params: {id: data.page_id}})
      } else {
        this.$router.push({name: "topicEditor", params: {id: data.page_id}})
        // window.open(`#/apps/topic/edit/${data.page_id}`)
      }
    },
    online(data) {
      window.open(data.url)
    },
    async fetch(data) {
      const {data: result} = await topicApi.fetch(data.page_id)
      if (result.code === 200) {
        this.$message.success("同步成功")
      } else {
        this.$message.error(result.msg)
      }
    },
    remove(data) {
      this.$confirm("是否删除该专题", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async() => {
        const {data: result} = await topicApi.remove(data.page_id)
        if (result.code === 200) {
          this.$message.success("删除成功")
          this.changeSize(this.pageSize)
        } else {
          this.$message.error(result.msg)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped rel="stylesheet/scss">
.main-content {
  padding: 16px;
}
</style>

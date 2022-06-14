<template>
  <div class="main-content">
      <el-form :inline="true" label-width="120px" :model="search">

        <el-form-item label="">
          <el-input v-model="search.name" @keyup.native.enter="changeSize(pageSize)" placeholder="请输入运营位名称..." clearable size="small"></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="search.code" @keyup.native.enter="changeSize(pageSize)" placeholder="请输入运营位别名..." clearable size="small"></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-select clearable @change="changeSize(pageSize)" v-model="search.status" placeholder="请选择运营位状态..." size="small">
            <el-option label="全部" value=""></el-option>
            <el-option label="启用中" value="1"></el-option>
            <el-option label="失效中" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="form-item-btns">
          <el-button type="primary" @click="changeSize(pageSize)">查询</el-button>
          <el-button type="default" @click="showModal" icon="plus">添加运营位</el-button>
        </el-form-item>
      </el-form>
    <!-- 表格 -->
    <el-table
      class="custom-table"
      :data="dataList"
      :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
      size="mini"
      v-loading="loading"
    >

      <el-table-column label="运营位名称" prop="name">
        <template slot-scope="scope">
          <a href="javascript:;" class="el-button--text"
             @click.stop="getOperateContentsBy(scope.row.id)">{{ scope.row.name }}</a>
        </template>
      </el-table-column>

      <el-table-column label="别名" prop="code"></el-table-column>

      <el-table-column label="平台" prop="app_type" width="80">
        <template slot-scope="scope">
          {{ scope.row.app_type | appTypeText }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="类型" prop="type" width="80">
        <template slot-scope="scope">
          {{ scope.row.type | typeText }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="100">
        <template slot-scope="scope">
          {{ scope.row.status | statusText }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作人" prop="user.userName" width="100px"></el-table-column>

      <el-table-column align="center" label="操作时间" prop="createTime" width="250px"></el-table-column>

      <el-table-column align="center" label="操作" width="200px">
        <template slot-scope="scope">
          <el-link type="primary" @click.stop="showEditModal(scope.row)">编辑</el-link>
          <el-link class="ml-10" type="primary" @click.stop="setStatusForRow(scope.row, scope.row.status)">
            {{ scope.row.status | statusBtnText }}
          </el-link>
          <el-link class="ml-10" type="danger" @click.stop="remove(scope.row)">删除</el-link>
        </template>
      </el-table-column>

    </el-table>

    <el-pagination
      background v-show="totalSize > 10"
      :page-size="pageSize"
      @size-change="changeSize"
      @current-change="changePage"
      layout="total, slot, jumper, prev, pager, next"
      :total="totalSize">
    </el-pagination>
    <operate-position-modal :operate-id="posCurrentRowId" ref="operatePosModal"
                            @reload-table="changeSize(pageSize)"></operate-position-modal>
  </div>
</template>

<script>
import operateMixin from "./operateMixin"
import OperatePositionModal from "./OperatePositionModal"
import Bus from "@/utils/eventbus"
import operationApi from "@/api/pop/operation"

export default {
  name: "contentMagOperationMag",
  mixins: [operateMixin],
  data() {
    return {
      search: {},
      pageFrom: 1,
      pageSize: 20,
      dataList: [],
      totalSize: 10,
      loading: false,
      checkedIds: [], // 选择行的id
      posCurrentRowId: ""
    }
  },
  components: {
    OperatePositionModal
  },
  methods: {
    reset() {
      this.search = {}
      this.changeSize(this.pageSize)
    },
    showModal() {
      this.$refs.operatePosModal.show(true)
    },
    showEditModal(row) {
      this.posCurrentRowId = row.id
      this.showModal()
    },
    remove(data) {
      this.$confirm("是否删除该数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async() => {
        const {data: result} = await operationApi.remove(data.id)
        if (result.code == 200) {
          this.$message.success("删除成功")
          this.changeSize(this.pageSize)
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    async setStatusForRow(data, status) {
      this.loading = true
      const {data: result} = await operationApi.update(Object.assign(data, {
        status: status === 1 ? 0 : 1
      }))
      this.loading = false
      if (result.code === 200) {
        this.$message.success(status === 1 ? "失效成功" : "启用成功")
      } else {
        this.$message.error(result.msg)
      }
    },
    getOperateContentsBy(resource_id) {
      window.open(`#/apps/operation/content?resource_id=${resource_id}`)
    },
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
      const {data: result} = await operationApi.list(Object.assign(params, this.search))
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
    reload() {
      this.changeSize(this.pageSize)
    }
  },
  created() {
    console.info("2222222")
    Bus.$on("reload-postable", () => {
      this.changeSize(this.pageSize)
    })
    this.changeSize(this.pageSize)
  }
}
</script>
<style lang="scss" scoped rel="stylesheet/scss">
.main-content {
  padding: 16px;
}
</style>

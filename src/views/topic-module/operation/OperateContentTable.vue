<template>
    <div class="operate-con-table mt-20 ml-10">
            <el-form :inline="true" label-width="100px" :model="search">

                <el-form-item label="">
                    <el-input v-model="search.name" @keyup.native.enter="changeSize(pageSize)" placeholder="请输入内容名称..." clearable size="small"></el-input>
                </el-form-item>

                <el-form-item label="">
                    <el-input class="input-pos" v-model="resource_name" readonly
                              @click.native="showModal('operatePosSelectModal', 'searchbar')"
                              suffix-icon="close" placeholder="请输入运营位ID..." clearable size="small"></el-input>
                </el-form-item>

                <el-form-item label="">
                    <el-select clearable v-model="search.status" placeholder="请选择启用状态..." size="small">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="启用中" value="1"></el-option>
                        <el-option label="失效中" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="form-item-btns">
                    <el-button type="primary" @click="changeSize(pageSize)">查询</el-button>
                  <el-button type="default" @click="showModal('operateConModal')" icon="plus">添加内容</el-button>
                </el-form-item>
            </el-form>
        <el-table :data="dataList"
            :default-sort="{prop: 'id', order: 'descending'}"
            :row-class-name="getRowClassName"
            :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
            size="mini"
            v-loading="loading"
        >
            <el-table-column align="center" width="140px;" label="内容名称" prop="name">
                <template slot-scope="scope">
                    <a href="javascript:;" class="el-button--text" @click.stop="showEditModal(scope.row)">{{scope.row.name}}</a>
                </template>
            </el-table-column>

            <el-table-column align="center" label="内容" width="200">
                <template slot-scope="scope">
                    <img v-if="scope.row.resource_type == 1 || scope.row.resource_type == 3" class="operate-con-img" :src="scope.row.image_url"
                         v-show="scope.row.image_url"/>
                    <p v-else class="text-content" v-html="getContentByType(scope.row)"></p>
                </template>
            </el-table-column>
            <el-table-column align="center" label="排序" prop="weight" width="100" sortable></el-table-column>

            <el-table-column align="center" label="运营位">
                <template slot-scope="scope">
                    {{scope.row.resource_type | typeText}}：{{scope.row.resource_name}}
                </template>
            </el-table-column>

            <!--<el-table-column align="center" prop="start_time" label="持续时间" width="110" sortable>-->
                <!--<template slot-scope="scope">-->
                    <!--<div class="datetime-cell">-->
                        <!--<p>{{scope.row.start_time}}</p>-->
                        <!--<p>{{scope.row.end_time}}</p>-->
                    <!--</div>-->
                <!--</template>-->
            <!--</el-table-column>-->

            <el-table-column align="center" label="状态" width="80">
                <template slot-scope="scope">
                    <div class="status-cell">
                        {{scope.row.status | statusText}}
                    </div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作人" width="140" prop="gmt_modified" sortable>
                <template slot-scope="scope">
                    <div>{{scope.row.operator}}</div>
                    <div>{{scope.row.gmt_modified}}</div>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="250">
                <template slot-scope="scope">
                    <el-link type="primary" @click.stop="showEditModal(scope.row)">编辑</el-link>
                    <el-link class="ml-10" type="primary" @click.stop="setStatusForRow(scope.row, scope.row.status)">
                        {{scope.row.status | statusBtnText}}
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
        <operate-pos-select-modal ref="operatePosSelectModal" :select-pos-for="selectPosFor"></operate-pos-select-modal>
        <operate-content-modal :operate-id="currentRowId" ref="operateConModal"
                               @choose-operate-pos="showModal('operatePosSelectModal', 'modal')"
                               @reload-table="changeSize(pageSize)"></operate-content-modal>
    </div>
</template>

<script>
import operateMixin from "./operateMixin"
import OperatePosSelectModal from "./OperatePosSelectModal"
import OperateContentModal from "./OperateContentModal"
import operationContentApi from "@/api/pop/operationContent"
import Bus from "@/utils/eventbus"
import operationApi from "@/api/pop/operation"

export default {
  name: "contentMagOperationContent",
  mixins: [operateMixin],
  data() {
    return {
      search: {
        resource_id: ""
      },
      resource_name: "",
      pageFrom: 1,
      pageSize: 10,
      dataList: [],
      totalSize: 10,
      loading: false,
      checkedIds: [], // 选择行的id
      currentRowId: "",
      selectPosFor: "modal"
    }
  },
  components: {
    OperatePosSelectModal,
    OperateContentModal
  },
  methods: {
    remove(data){
      this.$confirm("是否删除该数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async() => {
        const { data: result } = await operationContentApi.remove(data.id)
        if (result.code == 200) {
          this.$message.success("删除成功")
          this.changeSize(this.pageSize)
        } else {
          this.$message.error(result.msg)
        }
      })
    },
    showModal(name, target) {
      if (name === "operatePosSelectModal") {
        this.selectPosFor = target
      } else {
        this.currentRowId = ""
      }
      this.$refs[name].show(true)
    },
    reset() {
      this.search = {}
      this.changeSize(this.pageSize)
    },
    getContentByType(row) {
      const type = row.resource_type - 0
      let ret = ""
      // types = ['', '图片', '商品', '专题', '品购', 'webview'];
      switch (type) {
      case 2:
        ret = `${row.resource_id} - ${row.resource_name}`
        break
      case 3:
        ret = `${row.resource_name} <br/> ${row.topic_id}`
        break
      case 4:
        ret = row.target_url
        break
      case 5:
        ret = row.target_url
      }

      return ret
    },
    getRowClassName(row) {
      const className = []

      const now = Date.now()
      if (+new Date(row.end_time) < now) {
        className.push("outdate")
      }

      if (row.status === 0) {
        className.push("non-active")
      }

      return className.join(" ")
    },
    showEditModal(row) {
      this.currentRowId = row.id
      this.$refs.operateConModal.show(true)
    },
    async setStatusForRow(data, status) {
      this.loading = true
      const { data: result } = await operationContentApi.update(Object.assign(data, {
        status: status === 1 ? 0 : 1
      }))
      this.loading = false
      if (result.code === 200) {
        this.$message.success(status === 1 ? "取消激活成功" : "激活成功")
      } else {
        this.$message.error(result.msg)
      }
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
      const { data: result } = await operationContentApi.list(Object.assign(params, this.search))
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
    async autoFillOperatePos(id) {
      const {data: result} = await operationApi.get(id)
      if (result.code === 200) {
        Bus.$emit("pick-operate-pos", result.data)
      } else {
        this.$message.error(result.msg)
      }
    }
  },
  async mounted() {
    Bus.$on("pick-operate-pos", data => {
      this.search.resource_id = data.id
      this.resource_name = data.name
      this.changeSize(this.pageSize)
    })
    if (this.$route.query.resource_id){
      this.autoFillOperatePos(this.$route.query.resource_id)
    } else {
      this.changeSize(this.pageSize)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .operate-con-table {
        padding: 16px;
        .outdate {
            background: #eee;
            color: #999;

            .datetime-cell {
                color: #f00
            }
        }

        .non-active {
            background: #eee;
            color: #999;

            .status-cell {
                color: #f00
            }
        }

        .operate-con-img {
            display: block;
            width: 100%;
        }
    }
</style>

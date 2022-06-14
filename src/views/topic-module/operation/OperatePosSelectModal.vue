<template>
  <div class="main-content">
        <el-dialog title="选择运营位" :visible.sync="visible" width="1200px">
                <el-form :inline="true" size="small" label-width="80px" :model="search">

                    <el-form-item label="">
                        <el-input v-model="search.name" @keyup.native.enter="changeSize(pageSize)" placeholder="请输入运营位名称..." clearable size="small"></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <el-input v-model="search.code" @keyup.native.enter="changeSize(pageSize)" placeholder="请输入运营位别名..." clearable size="small"></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <el-select clearable v-model="search.status" placeholder="请选择运营位状态...">
                            <el-option label="全部" value=""></el-option>
                            <el-option label="启用中" value="1"></el-option>
                            <el-option label="失效中" value="0"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item class="form-item-btns">
                        <el-button type="primary" @click="changeSize(pageSize)">查询</el-button>
                        <el-button type="default" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>

            <el-table class="custom-table"
            :data="dataList"
            v-if="dataList.length"
            :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
            size="mini"
            v-loading="loading"
            >

                <el-table-column align="center" label="运营位名称" prop="name">
                    <template slot-scope="scope">
                        <el-button type="text" @click.stop="selectOperatePos(scope.row)">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="别名" prop="code"></el-table-column>

                <el-table-column align="center" label="平台" prop="app_type" width="80">
                    <template slot-scope="scope">
                        {{scope.row.app_type | appTypeText}}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="类型" prop="type" width="80">
                    <template slot-scope="scope">
                        {{scope.row.type | typeText}}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="状态" width="100">
                    <template slot-scope="scope">
                        {{scope.row.status | statusText}}
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作人" prop="user.userName" width="150"></el-table-column>

                <el-table-column align="center" label="操作时间" prop="createTime"></el-table-column>

            </el-table>

            <el-pagination
                    background v-show="totalSize > 10"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    @size-change="changeSize"
                    @current-change="changePage"
                    layout="total, sizes, slot, jumper, prev, pager, next"
                    :total="totalSize">
            </el-pagination>

            <div class="dialog-footer under-pagination" slot="footer">
                <el-button @click="show(false)">取消</el-button>
            </div>

        </el-dialog>
    </div>
</template>

<script>
import operateMixin from "./operateMixin"
import operationApi from "@/api/pop/operation"

import {
  deepClone,
  defPosSearch
} from "./operateData"
import Bus from "@/utils/eventbus"

export default {
  name: "OperatePosSelectModal",
  mixins: [operateMixin],
  props: ["selectPosFor"],
  data() {
    return {
      search: deepClone(defPosSearch),
      visible: false,
      pageFrom: 1,
      pageSize: 10,
      dataList: [],
      totalSize: 10,
      loading: false
    }
  },
  methods: {
    show(isShow) {
      this.visible = isShow
    },
    reset(){
      this.search = {}
      this.changeSize(this.pageSize)
    },
    selectOperatePos(row) {
      switch (this.selectPosFor) {
      case "searchbar":
        Bus.$emit("pick-operate-pos", row)
        break
      case "modal":
        Bus.$emit("select-operate-pos", row)
        break
      }

      this.show(false)
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
      if (this.search.app_type){
        this.search.app_type = parseInt(this.search.app_type)
      }
      if (this.search.status || this.search.status === 0){
        this.search.status = parseInt(this.search.status)
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
    }
  },
  components: {
  },
  created() {
    this.changeSize(this.pageSize)
  }
}
</script>

<style lang="scss">
    .operate-pos-modal {
        .searchbar {
            padding-bottom: 25px;

            .el-form-item {
                margin-top: 10px
            }
        }

        .form-item-btns {
            margin-left: 35px;

            .el-button + .el-button {
                margin-left: 20px;
            }
        }
    }
</style>

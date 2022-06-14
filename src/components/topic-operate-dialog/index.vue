<template>
    <div class="operate">
        <div class="operate-name">
            <template v-if="content.code">
                <p class="operate-name-1">{{content.name}}</p>
                <p class="operate-name-2">{{content.code}}</p>
            </template>
            <template v-else>请选择运营位</template>
        </div>
        <div class="operate-buttons">
            <el-button icon="el-icon-search" @click="openOperateDialog()"></el-button>
            <el-button icon="el-icon-edit-outline" @click="gotoOperateContent(content.id)"
                       :disabled="!content.id"></el-button>
            <slot name="buttons"></slot>
        </div>

        <el-dialog :visible.sync="visible" width="1000px">
            <div class="searchbar">
                <el-form :inline="true" size="small" label-width="100px" :model="search">

                    <el-form-item label="运营位名称">
                        <el-input v-model="search.name" @keyup.native.enter="changeSize(pageSize)"></el-input>
                    </el-form-item>

                    <el-form-item label="别名:">
                        <el-input v-model="search.code" @keyup.native.enter="changeSize(pageSize)"></el-input>
                    </el-form-item>

                    <el-form-item class="form-item-btns">
                        <el-button type="primary" @click="changeSize(pageSize)">查询</el-button>
                        <el-button type="primary" @click="reset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>

            <el-table stripe :data="dataList" @row-click="onSelect" :row-style="{cursor:'pointer'}"
                      v-if="dataList.length">

                <el-table-column align="center" label="运营位名称" prop="name">
                    <template slot-scope="scope">
                        <el-button type="text">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="别名" prop="code"></el-table-column>
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
        </el-dialog>
    </div>
</template>

<script>
import operationApi from "@/api/pop/operation"

const OPERATE = {
  TYPE: {
    IMAGE: 1,
    IMAGE_LIST: 3,
    NEW_TOPIC: 5
  },
  STATUS: {
    NOT_ACTIVE: 0,
    ACTIVE: 1
  },
  APP_TYPE: {
    PC: 1,
    H5: 2
  }
}
export default {
  props: {
    content: Object,
    opStyle: String,
    type: String,
    app_type: String
  },
  data() {
    return {
      search: {},
      pageFrom: 1,
      pageSize: 10,
      dataList: [],
      totalSize: 10,
      loading: false,
      visible: false
    }
  },
  methods: {
    reset() {
      this.search = {}
      this.changeSize(this.pageSize)
    },
    gotoOperateContent(id) {
      window.open(location.origin + location.pathname + "#/apps/operation/content?resource_id=" + id)
    },
    openOperateDialog() {
      this.visible = true
      this.changeSize(this.pageSize)
    },
    onSelect(row) {
      this.visible = false
      this.$emit("select", row)
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
      const typeSetted = OPERATE.TYPE[this.type.toUpperCase()]
      if (!typeSetted) {
        this.$message({
          message: "不存在的运营位类型:" + this.type,
          type: "warning"
        })
        this.visible = false
        return
      }
      this.loading = true
      const params = {
        pageFrom: this.pageFrom,
        pageSize: this.pageSize,
        type: typeSetted,
        status: OPERATE.STATUS.ACTIVE,
        app_type: OPERATE.APP_TYPE[this.app_type]
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
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
@import "~@/styles/variables.scss";

    .operate {
        display: flex;

        &-name {
            overflow: hidden;
            flex: 1;
            height: 30px;
            font-size: 14px;
            line-height: 30px;
            margin-right: 10px;

            &-1 {
                overflow: hidden;
                height: 16px;
                font-size: 14px;
                line-height: 16px;
            }

            &-2 {
                overflow: hidden;
                height: 14px;
                font-size: 12px;
                line-height: 14px;
                color: #999;
            }
        }
    }
</style>

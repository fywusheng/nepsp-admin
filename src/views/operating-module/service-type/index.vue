<template>
  <div class="app-container">
    <el-form
      ref="formSearch"
      :model="formSearch"
      :inline="true"
      class="search-form clearfix"
      size="small"
    >
      <el-form-item
        class="search-field fl"
        label="服务类别"
        prop="servTypeName"
      >
        <el-input v-model="formSearch.servTypeName" placeholder="请输入服务类别" clearable />
      </el-form-item>
      <el-form-item class="search-field fl" label="是否禁用" prop="dispFlag">
        <el-select v-model="formSearch.dispFlag" placeholder="全部">
          <el-option
            v-for="item in usedOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-field fl" label="时间" prop="selectedDate">
        <el-date-picker
          v-model="formSearch.selectedDate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item class="fr">
        <el-button
          class="two-words"
          plain
          size="small"
          @click="onReset('formSearch')"
          >重置</el-button
        >
        <el-button
          class="two-words"
          type="primary"
          size="small"
          @click="fetchData(1)"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <div class="table-edit-box clearfix">
        <div class="table-btn-right">
          <el-button type="success" size="small" @click="handleEditor"
            >添加</el-button
          >
        </div>
      </div>
      <el-table
        ref="table"
        v-loading="listLoading"
        height="460px"
        :data="formData"
        element-loading-text="加载中..."
        border
        fit
        highlight-current-row
      >
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            {{
              scope.$index + 1 + (formSearch.pageNum - 1) * formSearch.pageSize
            }}
          </template>
        </el-table-column>
        <el-table-column
          label="服务类别名称"
          prop="servTypeName"
          show-overflow-tooltip
          min-width="110px"
        />
        <el-table-column
          label="服务类别描述"
          prop="typeDscr"
          show-overflow-tooltip
          min-width="110px"
        >
        </el-table-column>
        <el-table-column label="发布时间" prop="crteTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.crteTime | toCrteTime }}
          </template>
        </el-table-column>
        <el-table-column label="展示顺序" prop="srt" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="是否启用" prop="dispFlag" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.dispFlag | toFlag }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="created_at"
          fixed="right"
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <!-- <el-link
              type="primary"
              size="small"
              :disabled="scope.$index == 0"
              @click="moveUpward(scope.row, scope.$index)"
            >
              上移
            </el-link>
            <el-link
              type="primary"
              size="small"
              :disabled="scope.$index + 1 === formData.length"
              @click="moveDown(scope.row, scope.$index)"
            >
              下移
            </el-link> -->
            <el-link
              type="primary"
              size="small"
              @click="handleEditor(scope.row)"
              >编辑</el-link
            >

            <el-link type="danger" size="small" @click="handleDelete(scope.row)"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
      <y-pagination
        v-show="total > 0"
        class="pageBox"
        :total="total"
        :page.sync="formSearch.pageNum"
        :limit.sync="formSearch.pageSize"
        @pagination="fetchData"
      />
    </div>
    <el-dialog
      :title="addFlag ? '添加服务类别' : '编辑服务类别'"
      :visible.sync="editVisible"
      width="600px"
      class="add-dialog"
    >
      <el-form
        ref="formAdd"
        :model="formAdd"
        :label-width="formLabelWidth"
        :rules="formAddRule"
        size="small"
      >
        <el-form-item label="服务类别名称:" prop="servTypeName">
          <el-input
            v-model="formAdd.servTypeName"
            placeholder="请输入服务类别名称"
            size="small"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="服务类别描述:" prop="typeDscr">
          <el-input
            v-model="formAdd.typeDscr"
            size="small"
            type="textarea"
          ></el-input>
        </el-form-item>
        <el-form-item label="展示顺序" prop="srt">
          <el-row>
            <el-col :span="12">
              <el-select v-model="formAdd.srt" placeholder="全部" size="small">
                <el-option
                  v-for="item in order"
                  :key="item.value"
                  :label="item.value"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="是否启用:" prop="dispFlag">
          <el-radio-group v-model="formAdd.dispFlag">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit('formAdd')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { operatingApi } from "@/api"
import { parseTime } from "@/utils/index.js"
const {
  selectSerTypeForPrintIdByPage,
  insertOrUpdateSerType,
  deleteSerType
} = operatingApi.serviceTypeApi

export default {
  name: "operatingServiceTypeManage",
  data() {
    return {
      /* 服务类别 */
      // serviceTypeNameOptions: [
      //   { value: "医疗健康" },
      //   { value: "养老服务" },
      //   { value: "文化旅游" },
      //   { value: "便捷出行" },
      // ],
      /* 是否启用 */
      usedOptions: [
        { label: "启用", value: true },
        { label: "禁用", value: false }
      ],
      /* 查询依赖 */
      formSearch: {
        pageNum: 1,
        pageSize: 10,
        servTypeName: "",
        dispFlag: undefined,
        selectedDate: ""
      },
      listLoading: false,
      order: [{ value: 1 }, { value: 2 }, { value: 3 }],
      formData: [],
      /* 表单依赖 */
      formAdd: {
        dispFlag: undefined,
        typeDscr: "",
        servTypeName: "",
        srt: ""
      },
      /* 表单验证 */
      formAddRule: {
        servTypeName: [
          { required: true, message: "请输入服务类别名称", trigger: "blur" }
        ],
        dispFlag: [
          { required: true, message: "选择是否启用", trigger: "change" }
        ]
      },
      total: 10,
      editVisible: false,
      addFlag: false,
      formLabelWidth: "120px"
    }
  },
  methods: {
    /**
     * @description: 重置
     * @param {type}
     * @return {type}
     * @author: camus
     */
    onReset(refsName) {
      this.$refs[refsName].resetFields()
      this.formSearch = {
        ...this.formSearch,
        startTime: "",
        endTime: "",
        current: 1
      }
      this._selectSerTypeForPrintIdByPage()
    },
    /**
     * @description: 查询
     * @param {type}
     * @return {type}
     * @author: camus
     */
    fetchData(val) {
      if (val === 1) {
        const { selectedDate } = this.formSearch
        this.formSearch.pageSize = 10
        this.formSearch.pageNum = 1
        this.formSearch = {
          ...this.formSearch,
          startTime: selectedDate[0],
          endTime: selectedDate[1]
        }
      }
      this._selectSerTypeForPrintIdByPage()
    },
    // moveUpward(row, index) {
    //   if (index > 0) {
    //     let upData = this.formData[index - 1];
    //     this.formData.splice(index - 1, 1);
    //     this.formData.splice(index, 0, upData);
    //   } else {
    //     this.$message({
    //       message: "已经是第一条，上移失败",
    //       type: "warning",
    //     });
    //   }
    // },
    // moveDown(row, index) {
    //   if (index + 1 == this.formData.length) {
    //     this.$message({
    //       message: "已经是最后一条，下移失败",
    //       type: "warning",
    //     });
    //   } else {
    //     let downData = this.formData[index + 1];
    //     this.formData.splice(index + 1, 1);
    //     this.formData.splice(index, 0, downData);
    //   }
    // },

    /**
     * @description: 编辑
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleEditor(row = {}) {
      this.addFlag = !row.serTypeID
      if (row.serTypeID) {
        this.formAdd = row
      }
      this.editVisible = true
    },
    /**
     * @description: 删除
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async handleDelete(value) {
      try {
        const { serTypeID } = value
        await this.$confirm("此操作将永久删除该服务类别, 是否继续?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        await this._deleteSerType(serTypeID)
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消"
        })
      }
    },
    /**
     * @description: 表单提交
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleSubmit(refName) {
      this.$refs[refName].validate((valid) => {
        if (valid) {
          this._insertOrUpdateSerType(this.formAdd)
          this.editVisible = false
        }
      })
    },
    /**
     * @description: 时间获取
     * @param {type}
     * @return {type}
     * @author: camus
     */
    getCurrentData() {
      const date = new Date()
      const toTime = parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}")
      this.formAdd.releaserTime = toTime
      return toTime
    },
    /**
     * @description: 查询请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _selectSerTypeForPrintIdByPage() {
      try {
        this.listLoading = true
        const { data } = await selectSerTypeForPrintIdByPage(this.formSearch)
        this.formData = data.list
        this.total = data.total
        data.total &&
          (this.order = Array.from({ length: data.total + 1 }, (v, k) => {
            return { value: k + 1 }
          }))
      } catch (error) {
        this.formData = []
        this.total = 0
        this.$message("未查询到相关数据")
      }
      this.listLoading = false
    },
    /**
     * @description: 添加、更新请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _insertOrUpdateSerType(data) {
      const msg = !this.addFlag ? "编辑成功" : "新增成功"
      try {
        await insertOrUpdateSerType(data)
        await this._selectSerTypeForPrintIdByPage()
        this.$message.success(msg)
      } catch (error) {
        this.$message("数据未添加")
      }
    },
    /**
     * @description: 删除请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _deleteSerType(data) {
      try {
        await deleteSerType(data)
        await this._selectSerTypeForPrintIdByPage()
        this.$message.success("删除成功")
      } catch (error) {
        this.$message("数据删除未成功")
      }
    }
  },
  filters: {
    /**
     * @description: 时间过滤
     * @param {type}
     * @return {type}
     * @author: camus
     */
    toCrteTime: (time) => {
      if (!time) {
        return ""
      }
      return time ? parseTime(time, "{y}-{m}-{d}") : ""
    },
    /**
     * @description: 启用状态过滤
     * @param {type}
     * @return {type}
     * @author: camus
     */
    toFlag: (stas) => {
      return stas ? "启用" : "禁用"
    }
  },
  watch: {
    editVisible(val) {
      if (!val) {
        this.formAdd = {
          dispFlag: undefined,
          typeDscr: "",
          servTypeName: ""
        }
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    }
  },
  mounted() {
    this._selectSerTypeForPrintIdByPage()
  }
}
</script>
<style>
</style>

<template>
  <div class="app-container">
    <el-form
      ref="formSearch"
      :model="formSearch"
      :inline="true"
      size="small"
      class="search-form clearfix"
    >
      <el-form-item class="search-field fl" label="系统类型:" prop="sysType">
        <el-select v-model="formSearch.sysType" placeholder="全部">
          <el-option
            v-for="item in systemOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-field fl" label="版本号:" prop="ver">
        <el-input
          v-model="formSearch.ver"
          placeholder="请输入版本号"
          clearable
        />
      </el-form-item>
      <el-form-item
        class="search-field fl"
        label="版本更新内容:"
        prop="contDscr"
      >
        <el-input
          v-model="formSearch.contDscr"
          placeholder="请输入版本更新内容"
          clearable
        />
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
        ref="versionTableRef"
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
        <el-table-column label="版本号" prop="ver" show-overflow-tooltip />
        <el-table-column label="系统类型" prop="sysType" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="下载地址" prop="verUrl" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="文件大小" prop="verSize" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="更新状态" prop="updtStas" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.updtStas | toUpdateStatus }}
          </template>
        </el-table-column>
        <el-table-column
          label="版本更新内容"
          prop="contDscr"
          min-width="110px"
          show-overflow-tooltip
        />
        <el-table-column
          label="发布人"
          prop="opterName"
          show-overflow-tooltip
        />
        <el-table-column label="发布状态" prop="stas" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.stas | toStas }}
          </template>
        </el-table-column>

        <el-table-column label="发布日期" prop="crteTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.crteTime | toCrteTime }}
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
            <el-link size="small" @click="handlePreview(scope.row)"
              >查看</el-link
            >
            <el-link
              type="primary"
              size="small"
              @click="handleEditor(scope.row)"
              >修改</el-link
            >
            <el-link type="danger" size="small" @click="handleDelete(scope.row)"
              >删除</el-link
            >
            <el-link type="primary" size="small" @click="release(scope.row)"
              >发布</el-link
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
      <el-dialog
        class="add-dialog"
        :title="addFlag ? '新增版本' : '编辑版本'"
        :visible.sync="editVisible"
        width="680px"
      >
        <el-form
          :model="formAdd"
          ref="formAdd"
          :validate-on-rule-change="true"
          :rules="formAddRule"
          size="small"
          :disabled="preview"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="系统类型:"
                label-width="100px"
                prop="sysType"
              >
                <el-radio-group v-model="formAdd.sysType">
                  <el-radio label="ios">苹果</el-radio>
                  <el-radio label="android">安卓</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="版本号:" label-width="100px" prop="ver">
                <el-input
                  size="small"
                  v-model="formAdd.ver"
                  clearable
                  autocomplete="off"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item
                label="下载地址:"
                label-width="100px"
                size="small"
                prop="verUrl"
              >
                <el-input v-model="formAdd.verUrl" placeholder="" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col>
              <el-form-item
                label="更新状态:"
                label-width="100px"
                prop="updtStas"
              >
                <el-radio-group v-model="formAdd.updtStas">
                  <el-radio label="1">非强制更新</el-radio>
                  <el-radio label="2">强制更新</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="24">
              <el-form-item
                label="版本更新内容:"
                label-width="100px"
                prop="contDscr"
              >
                <el-input
                  v-model="formAdd.contDscr"
                  type="textarea"
                  :autosize="{ minRows: 4, maxRows: 4 }"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="创建人:">
                <span>{{ formAdd.crterName }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="创建时间:">
                <span>{{ getCurrentData() }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('formAdd')"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { operatingApi } from "@/api"
import { parseTime } from "@/utils/index.js"
const {
  getVersionList,
  addVersion,
  updateVersion,
  delVersion
} = operatingApi.versionApi
export default {
  name: "operatingVersionManage",
  data() {
    return {
      /* 系统类型 */
      systemOptions: [
        { label: "苹果", value: "ios" },
        { label: "安卓", value: "android" }
      ],
      /* 查询依赖 */
      formSearch: {
        pageNum: 1,
        pageSize: 10,
        sysType: "",
        ver: "",
        contDscr: ""
      },
      /* 加载 */
      listLoading: false,
      /* 表格数据 */
      formData: [],
      /* 表单依赖 */
      formAdd: {
        sysType: "",
        verUrl: "",
        ver: "",
        updtStas: "",
        contDscr: "",
        verSize: "1",
        crterName: this.$store.getters.name,
        crterId: this.$store.getters.id
      },
      /* 表单验证 */
      formAddRule: {
        ver: [{ required: true, message: "请输入版本号", trigger: "blur" }],
        sysType: [
          { required: true, message: "请选择系统类型", trigger: "change" }
        ],
        verUrl: [
          { required: true, message: "请输入下载地址", trigger: "blur" }
        ],
        contDscr: [
          { required: true, message: "请输入版本更新内容", trigger: "blur" }
        ],
        updtStas: [
          { required: true, message: "请选择更新状态", trigger: "change" }
        ]
      },
      /* 数据数 */
      total: 10,
      addEditTitle: "新增",
      addFlag: false,
      editVisible: false,
      /* 查看标志位 */
      preview: false
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
      this.formSearch.current = 1
      this._getVersionList()
    },
    /**
     * @description: 查询
     * @param {type}
     * @return {type}
     * @author: camus
     */
    fetchData(val) {
      if (val === 1) {
        this.formSearch.pageSize = 10
        this.formSearch.pageNum = 1
      }
      this._getVersionList()
    },
    /**
     * @description: 编辑
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleEditor(row) {
      this.addFlag = !row.verPkId
      if (row.verPkId) {
        this.formAdd = row
      }
      this.editVisible = true
    },
    /**
     * @description: 查看
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handlePreview(row) {
      this.preview = true
      if (row.verPkId) {
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
        const { verPkId } = value
        await this.$confirm("此操作将永久删除该版本, 是否继续?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        await this._delVersion(verPkId)
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消"
        })
      }
    },
    /**
     * @description: 发布
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async release(row) {
      try {
        const params = {
          rid: row.rid,
          stas: 1,
          opterId: this.$store.getters.id,
          opterName: this.$store.getters.name
        }
        await this.$confirm("是否发布该版本?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        await this._updateVersion(params)
        await this.$message.success("发布版本成功")
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
          delete this.formAdd.crteTime
          delete this.formAdd.optTime
          delete this.formAdd.verSize
          if (this.addFlag) {
            this._addVersion(this.formAdd)
          } else {
            this._updateVersion(this.formAdd)
          }
          this.editVisible = false
        }
      })
    },
    /**
     * @description: 查询请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _getVersionList() {
      try {
        this.listLoading = true
        const { data } = await getVersionList(this.formSearch)
        this.formData = data.list
        this.total = data.total
      } catch (error) {
        this.$message("未查询到相关数据")
        this.formData = []
        this.total = 0
      }
      this.listLoading = false
    },
    /**
     * @description: 添加请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _addVersion(data) {
      try {
        await addVersion(data)
        await this._getVersionList()
        this.$message.success("新增版本成功")
      } catch (error) {
        this.$message("数据未添加")
      }
    },
    /**
     * @description: 更新请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _updateVersion(data) {
      try {
        await updateVersion(data)
        await this._getVersionList()
        this.$message.success("版本编辑成功")
      } catch (error) {
        this.$message("数据未更新")
      }
    },
    /**
     * @description: 删除请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _delVersion(data) {
      try {
        await delVersion(data)
        await this._getVersionList()
        this.$message.success("删除成功")
      } catch (error) {
        this.$message("数据删除未成功")
      }
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
      this.formAdd.crteTime = toTime
      return toTime
    }
  },
  watch: {
    editVisible(val) {
      if (!val) {
        this.formAdd = {
          sysType: "",
          verUrl: "",
          ver: "",
          updtStas: "",
          contDscr: "",
          verSize: "1",
          crterName: this.$store.getters.name,
          crterId: this.$store.getters.id
        }
        this.preview = false
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
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
     * @description: 发布状态过滤
     * @param {type}
     * @return {type}
     * @author: camus
     */
    toStas: (stas) => {
      if (!stas) {
        return ""
      }
      return stas === "0" ? "未发布" : "已发布"
    },
    /**
     * @description: 更新状态过滤
     * @param {type}
     * @return {type}
     * @author: camus
     */
    toUpdateStatus: (status) => {
      if (!status) {
        return ""
      }
      return status === "1" ? "非强制更新" : "强制更新"
    }
  },
  created() {
    this._getVersionList()
  }
}
</script>
<style lang="scss" scoped>
.version-manage-dialog {
  ::v-deep .el-form {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>

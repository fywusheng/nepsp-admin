<template>
  <div class="app-container">
    <el-form
      ref="formSearch"
      :model="formSearch"
      :inline="true"
      class="search-form clearfix"
      size="small"
    >
      <el-form-item class="search-field fl" label="专题类别" prop="colName">
        <el-select v-model="formSearch.colName" placeholder="全部">
          <el-option
            v-for="item in serviceTypeName"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-field fl" label="是否启用" prop="dispFlag">
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
      <el-form-item
        class="search-field fl"
        label="发布时间:"
        prop="selectedDate"
        label-width="100px"
      >
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
          label="专题名称"
          prop="colName"
          show-overflow-tooltip
        />
        <el-table-column label="排列顺序" prop="srt" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="阅读数" prop="clikCnt" show-overflow-tooltip />
        <el-table-column label="发布时间" prop="optTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.optTime | toCrteTime }}
          </template>
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
            <el-link
              type="primary"
              size="small"
              @click="handleEditor(scope.row)"
              >修改</el-link
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
      :title="addFlag ? '新增专题类别' : '编辑专题类别'"
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
        <el-form-item
          label="专题类别名称:"
          prop="colName"
          clearable
          autocomplete="off"
        >
          <el-input
            v-model="formAdd.colName"
            placeholder="请输入专题类别名称"
            size="small"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="排列顺序" prop="srt">
          <el-select v-model="formAdd.srt" placeholder="全部" size="small">
            <el-option
              v-for="item in order"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件" prop="absoluteUrl">
          <el-upload
            class="upload-demo"
            action="#"
            multiple
            :on-change="handleUpLoadChange"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="文件缩略图">
          <img :src="formAdd.absoluteUrl" alt="" style="width: 100px" />
        </el-form-item>
        <el-form-item
          label="是否启用:"
          :label-width="formLabelWidth"
          prop="dispFlag"
        >
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
  selectCmsColByDTO,
  insertOrUpdateCmsCol,
  deleteCmsCol
} = operatingApi.specialCategoryApi
export default {
  name: "operatingSpecialCategory",
  data() {
    return {
      /* 是否启用 */
      usedOptions: [
        { label: "启用", value: true },
        { label: "禁用", value: false }
      ],
      /* 专题类别 */
      serviceTypeName: [
        { value: "医疗健康" },
        { value: "养老服务" },
        { value: "文化旅游" },
        { value: "便捷出行" }
      ],
      order: [{ value: 1 }, { value: 2 }, { value: 3 }],
      /* 查询依赖 */
      formSearch: {
        pageNum: 1,
        pageSize: 10,
        selectedDate: "",
        colName: "",
        dispFlag: undefined
      },
      listLoading: false,
      /* 表格数据 */
      formData: [],
      /* 表单依赖 */
      formAdd: {
        colName: "",
        colDscr: "",
        srt: "",
        dispFlag: undefined,
        selectType: "",
        colCodg: "",
        region: "",
        absoluteUrl: ""
      },
      /* 表单验证 */
      formAddRule: {
        colName: [
          { required: true, message: "请输入专题类别名称", trigger: "blur" }
        ],
        srt: [{ required: true, message: "请选择专题排序", trigger: "change" }],
        absoluteUrl: [
          { required: true, message: "请上传文件", trigger: "change" }
        ],
        dispFlag: [
          { required: true, message: "请选择是否启用状态", trigger: "change" }
        ]
      },
      total: 10,
      editVisible: false,
      formLabelWidth: "120px",
      addFlag: false
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
      this._selectCmsColByDTO()
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
      this._selectCmsColByDTO()
    },
    /**
     * @description: 编辑
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleEditor(row) {
      this.addFlag = !row.colId
      if (row.colId) {
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
        const { colId } = value
        await this.$confirm("此操作将永久删除该服务类别, 是否继续?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        this._deleteCmsCol(colId)
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
          this._insertOrUpdateCmsCol(this.formAdd)
          this.editVisible = false
        }
      })
    },
    /**
     * @description: 图片上传
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleUpLoadChange(file) {
      const url = URL.createObjectURL(file.raw)
      this.$forceUpdate()
      this.formAdd.absoluteUrl = url
      this.formAdd.bannerSize =
        Math.floor((file.size / (1024 * 1024)) * 100) / 100
      /* 转base64 */
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        this.formAdd.base64String = reader.result.replace(
          /^data:image\/\w+;base64,/,
          ""
        )
      }
      const { name: fileName } = file
      this.formAdd.imageName = fileName
      this.formAdd.imageExt = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length
      )
    },
    /**
     * @description: 查询请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _selectCmsColByDTO() {
      try {
        this.listLoading = true
        const { data } = await selectCmsColByDTO(this.formSearch)
        this.formData = data.list
        this.total = data.total
      } catch (error) {
        this.formData = []
        this.total = 0
        this.$message("未查询到相关数据")
      }
      this.listLoading = false
    },
    /**
     * @description: 添加，更新请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _insertOrUpdateCmsCol(data) {
      const msg = !this.addFlag ? "编辑成功" : "新增成功"
      try {
        await insertOrUpdateCmsCol(data)
        this._selectCmsColByDTO()
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
    async _deleteCmsCol(key) {
      try {
        await deleteCmsCol(key)
        this._selectCmsColByDTO()
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
          colName: "",
          colDscr: "",
          srt: "",
          dispFlag: undefined,
          selectType: "",
          colCodg: "",
          region: "",
          absoluteUrl: ""
        }
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    },
    "formAdd.absoluteUrl": {
      handler(newVal) {
        if (newVal) {
          this.$refs.formAdd.clearValidate("absoluteUrl")
        }
      }
    }
  },
  mounted() {
    this._selectCmsColByDTO()
  }
}
</script>
<style>
</style>

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
        label="启动页名称:"
        prop="startPageName"
      >
        <el-input
          v-model="formSearch.startPageName"
          placeholder="请输入启动页名称"
          clearable
        />
      </el-form-item>
      <el-form-item
        class="search-field fl"
        label="展示周期"
        prop="remainTempTime"
      >
        <el-select v-model="formSearch.remainTempTime" placeholder="请选择展示周期">
          <el-option
            v-for="item in stayOptions"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-field fl" label="时间:" prop="selectedDate">
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
            >新增</el-button
          >
        </div>
      </div>
      <el-table
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
            {{ scope.$index + 1 + (formSearch.current - 1) * formSearch.size }}
          </template>
        </el-table-column>
        <el-table-column label="启动页名称" prop="startPageName" min-width="110px" show-overflow-tooltip />
        <el-table-column label="缩略图" prop="img" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link type="primary" @click="handleImg(scope.row)">缩略图</el-link>
          </template>
        </el-table-column>
        <el-table-column label="展示周期" prop="remainTempTime" show-overflow-tooltip min-width="110px" />
        <el-table-column label="展示倒计时" prop="daoJiShi" show-overflow-tooltip min-width="110px" />
        <el-table-column label="发布人" prop="releaser" show-overflow-tooltip />
        <el-table-column label="发布状态" prop="startPageStatus" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.startPageStatus | toStas }}
          </template>
        </el-table-column>
        <el-table-column label="发布日期" prop="releaserTime" show-overflow-tooltip />
        <el-table-column align="center" prop="created_at" fixed="right" label="操作" width="250">
          <template slot-scope="scope">
            <el-link size="small" @click="onClickCheck(scope.row)">查看</el-link>
            <el-link
              type="primary"
              size="small"
              @click="handleEditor(scope.row)"
              >修改</el-link
            >
            <el-link size="small" v-if="scope.row.startPageStatus === '1'" @click="handleRelease(scope.row, 0)">禁用</el-link>
            <el-link size="small" v-if="scope.row.startPageStatus === '0'" @click="handleRelease(scope.row, 1)">启用</el-link>
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
        :page.sync="formSearch.current"
        :limit.sync="formSearch.size"
        @pagination="fetchData"
      />

      <el-dialog :visible.sync="imgPreviewVisible">
        <img width="100%" :src="dialogImageUrl" alt="缩略图" />
      </el-dialog>

      <el-dialog class="add-dialog" :title="addFlag ? '新增启动页' : '编辑启动页'" :visible.sync="editVisible" @closed="onClosedDialog" width="800px">
        <el-form ref="formAdd" :model="formAdd" :disabled="isCheckForm" :label-width="formLabelWidth" :rules="formAddRule">
          <el-row>
            <el-col :span="12">
              <el-form-item label="启动页名称:" prop="startPageName">
                <el-input
                  v-model="formAdd.startPageName"
                  placeholder="请输入启动页名称"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="文件:" prop="startPageUrl">
                <el-upload
                  class="upload-demo"
                  ref="upLoadRef"
                  action="#"
                  multiple
                  :on-change="handleUpLoadChange"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="formAdd.startPageUrl">
            <el-col>
              <el-form-item label="">
                <img :src="formAdd.startPageUrl" alt="" style="width: 100px" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item
                label="展示周期"
                label-width="110px"
                prop="remainTempTime"
              >
                <el-select
                  v-model="formAdd.remainTempTime"
                  placeholder="请选择展示周期"
                  size="small"
                >
                  <el-option
                    v-for="item in stayOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="展示倒计时" prop="daoJiShi">
                <el-select v-model="formAdd.daoJiShi" placeholder="请选择展示周期" size="small">
                  <el-option label="3" value="3"></el-option>
                  <el-option label="4" value="4"></el-option>
                  <el-option label="5" value="5"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="14">
              <el-form-item label="跳转形式">
                <el-radio-group v-model="formAdd.jumpWay" size="small">
                  <el-radio :label="0">不跳转</el-radio>
                  <el-radio :label="1">URL地址</el-radio>
                  <el-radio :label="2">文本</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="formAdd.jumpWay === 1">
            <el-col :span="14">
              <el-form-item label="URL地址:" prop="jumpUrl">
                <el-input v-model="formAdd.jumpUrl" placeholder="请输入URL地址" size="small" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row v-if="formAdd.jumpWay === 2">
            <el-col :span="22">
              <el-form-item label="正文内容:" prop="jumpText">
                <el-input
                 type="textarea"
                 placeholder="请输入正文内容"
                 v-model="formAdd.jumpText"
                 :autosize="{ minRows: 4, maxRows: 4}"
                 :maxlength="500" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-row>
            <el-col :span="12">
              <el-form-item label="发布人:">
                <span>{{ formAdd.releaser }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="发布状态:"
                prop="startPageStatus"
                label-width="110px"
              >
                <el-radio-group v-model="formAdd.startPageStatus">
                  <el-radio label="1">发布</el-radio>
                  <el-radio label="0">未发布</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="发布日期:">
                <span>{{ getCurrentData() }}</span>
              </el-form-item>
            </el-col>
          </el-row> -->

        </el-form>
        <div slot="footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSubmit('formAdd')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { operatingApi } from "@/api"
import { parseTime } from "@/utils/index.js"

const {
  qryStartPageForPage,
  addStartPageInfo,
  deleteStartPageInfo,
  updateStartPageInfo
} = operatingApi.startApi

export default {
  name: "operatingStartManage",
  data() {
    return {
      /* 暂定停留时间 */
      stayOptions: [
        { value: "长期有效" },
        { value: "一个月" },
        { value: "一周" },
        { value: "一天" }
      ],
      /* 查询依赖 */
      formSearch: {
        current: 1,
        size: 10,
        remainTempTime: "",
        startPageName: "",
        selectedDate: ""
      },
      listLoading: false,
      /* 表格数据 */
      formData: [],
      isCheckForm: false, // 是否是查看数据操作
      /* 表单依赖 */
      formAdd: {
        startPageName: "",
        base64String: "",
        fileName: "",
        fileExt: "",
        startPageSize: "",
        startPageLocal: "",
        remainTempTime: "",
        remainFactTime: "",
        releaser: this.$store.getters.name,
        startPageStatus: "",
        releaserTime: "",
        startPageUrl: ""
      },
      /* 表单验证 */
      formAddRule: {
        startPageName: [
          { required: true, message: "请输入启动页名称", trigger: "blur" }
        ],
        remainTempTime: [
          { required: true, message: "请选择展示周期", trigger: "change" }
        ],
        daoJiShi: [
          { required: true, message: "请选择展示倒计时", trigger: "change" }
        ],
        startPageUrl: [
          { required: true, message: "请选择上传文件", trigger: "change" }
        ],
        jumpUrl: [
          { required: true, message: "请输入跳转地址", trigger: "change" }
        ],
        jumpText: [
          { required: true, message: "请输入跳转文本", trigger: "change" }
        ]
      },
      total: 10,
      addEditTitle: "新增",
      selectedStay: "",
      imgPreviewVisible: false,
      dialogImageUrl: "",
      editVisible: false,
      addFlag: false,
      /* 图片依赖 */
      fileList: [],
      selectedFile: "",
      /* 表单输入长度 */
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
      this._qryStartPageForPage()
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
      this._qryStartPageForPage()
    },
    /**
     * @description: 编辑
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleEditor(row = {}) {
      this.addFlag = !row.startPageId
      if (row.startPageId) {
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
    onClickCheck(row = {}) {
      this.isCheckForm = true
      if (row.startPageId) {
        this.formAdd = row
        this.editVisible = true
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
          if (this.addFlag) {
            this._addStartPageInfo(Object.assign({}, this.formAdd, { releaser: this.$store.getters.name ? this.$store.getters.name : "admin" }))
          } else {
            this._updateStartPageInfo(this.formAdd)
          }
          this.editVisible = false
        }
      })
    },
    /**
     * @description: 关闭弹窗时操作
     * @param {type}
     * @return {type}
     * @author: camus
     */
    onClosedDialog() {
      this.isCheckForm = false
    },
    /**
     * @description: 发布
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async handleRelease(row, status) {
      try {
        const data = Object.assign({}, row, { startPageStatus: status })
        await this.$confirm(`是否${status ? "启用" : "禁用" }?`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        await this._updateStartPageInfo(data)
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消"
        })
      }
    },
    /**
     * @description: 删除
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async handleDelete(row) {
      try {
        const { startPageId } = row
        await this.$confirm("此操作将永久删除该数据, 是否继续?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        await this._deleteStartPageInfo(startPageId)
        this.$message.success("删除成功")
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消"
        })
      }
    },
    /**
     * @description: 查询请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _qryStartPageForPage() {
      try {
        this.listLoading = true
        const { data } = await qryStartPageForPage(this.formSearch)
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
    async _addStartPageInfo(data) {
      try {
        await addStartPageInfo(data)
        await this._qryStartPageForPage()
        this.$message.success("新增成功")
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
    async _deleteStartPageInfo(startPageId) {
      try {
        await deleteStartPageInfo(startPageId)
        await this._qryStartPageForPage()
        this.$message.success("删除成功")
      } catch (error) {
        this.$message("数据删除未成功")
      }
    },
    /**
     * @description: 更新数据
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _updateStartPageInfo(data) {
      try {
        await updateStartPageInfo(Object.assign({}, data, { releaser: this.$store.getters.name ? this.$store.getters.name : "admin" }))
        await this._qryStartPageForPage()
        this.$message.success("编辑成功")
      } catch (error) {
        this.$message.success("数据未更新")
      }
    },
    /**
     * @description: 打开缩略图
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleImg(row) {
      const { startPageUrl = "" } = row
      this.imgPreviewVisible = true
      this.dialogImageUrl = startPageUrl
    },
    /**
     * @description: 图片上传
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleUpLoadChange(file, fileList) {
      const url = URL.createObjectURL(file.raw)
      this.$forceUpdate()
      this.formAdd.startPageUrl = url
      this.formAdd.startPageSize =
        Math.floor((file.size / (1024 * 1024)) * 100) / 100
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        this.formAdd.base64String = reader.result.replace(
          /^data:image\/\w+;base64,/,
          ""
        )
      }
      const { name: fileName } = file
      this.formAdd.fileName = fileName
      this.formAdd.fileExt = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length
      )
    },
    /**
     * @description: 获取日期
     * @param {type}
     * @return {type}
     * @author: camus
     */
    getCurrentData() {
      const date = new Date()
      const toTime = parseTime(date, "{y}-{m}-{d} {h}:{i}:{s}")
      this.formAdd.releaserTime = toTime
      return toTime
    }
  },
  created() {
    this._qryStartPageForPage()
  },
  filters: {
    /**
     * @description: 发布状态过滤
     * @param {type}
     * @return {type}
     * @author: camus
     */
    toStas: (startPageStatus) => {
      if (!startPageStatus) {
        return ""
      }
      return startPageStatus === "0" ? "禁用" : "启用"
    },
    /**
     * @description: size过滤
     * @param {type}
     * @return {type}
     * @author: camus
     */
    toSize: (startPageSize) => {
      if (!startPageSize) {
        return ""
      }
      return `${startPageSize} M`
    }
  },
  watch: {
    editVisible(val) {
      if (!val) {
        this.formAdd = {
          startPageName: "",
          base64String: "",
          fileName: "",
          fileExt: "",
          startPageSize: "",
          startPageLocal: "",
          remainTempTime: "",
          remainFactTime: "",
          jumpWay: 0,
          jumpUrl: "",
          jumpText: "",
          daoJiShi: "",
          releaser: this.$store.getters.name,
          startPageStatus: "",
          releaserTime: "",
          startPageUrl: ""
        }
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    },
    "formAdd.startPageUrl": {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(() => {
            this.$refs.formAdd.clearValidate("startPageUrl")
          })
        }
      }
    }
  }
}
</script>
<style lang='scss' scoped>
.app-container {
  .search-start {
    background-color: red;
  }

  .right-label {
    color: #303133;
    font-weight: normal;
    margin-right: 10px;
  }
  .start-manage-dialog {
    ::v-deep .el-form {
      .el-form-item {
        margin-bottom: 10px;
      }
    }
  }
}
</style>

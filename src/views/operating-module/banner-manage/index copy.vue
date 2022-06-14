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
        label="轮播图名称"
        prop="bannerName"
      >
        <el-input
          v-model="formSearch.bannerName"
          placeholder="请输入启动页名称"
          clearable
        />
      </el-form-item>
      <el-form-item
        label="暂定停留时间"
        class="search-field fl"
        prop="remainTempTime"
      >
        <el-select v-model="formSearch.remainTempTime" placeholder="长期">
          <el-option
            v-for="item in stayOptions"
            :key="item.value"
            :label="item.value"
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
        <el-table-column
          label="轮播图名称"
          prop="bannerName"
          show-overflow-tooltip
          min-width="110px"
        />
        <el-table-column
          label="文件地址"
          prop="bannerUrl"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="缩略图" prop="img" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link type="primary" @click="handleImg(scope.row)"
              >缩略图</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          label="暂定停留时间"
          prop="remainTempTime"
          show-overflow-tooltip
          min-width="110px"
        />
        <el-table-column
          label="实际停留时间"
          prop="remainFactTime"
          show-overflow-tooltip
          min-width="110px"
        >
          <template slot-scope="scope">
            <span
              >{{ scope.row.actualStay ? `${scope.row.actualStay}天` : "" }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="发布人" prop="releaser" show-overflow-tooltip />
        <el-table-column
          label="发布状态"
          prop="bannerStatus"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.bannerStatus | toStas }}
          </template>
        </el-table-column>
        <el-table-column
          label="发布日期"
          prop="releaserTime"
          show-overflow-tooltip
        />
        <el-table-column
          align="center"
          prop="created_at"
          fixed="right"
          label="操作"
          width="250"
        >
          <template slot-scope="scope">
            <el-link
              size="small"
              type="primary"
              @click="handleMenuList(scope.row)"
              >查看</el-link
            >

            <el-link
              type="primary"
              size="small"
              @click="handleEditor(scope.row)"
              >修改</el-link
            >

            <el-link
              type="primary"
              size="small"
              @click="handleDelete(scope.row)"
              >删除</el-link
            >
            <el-link
              size="small"
              type="primary"
              @click="handleRelease(scope.row)"
              >发布</el-link
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
      <el-dialog
        :title="addFlag ? '新增banner' : '编辑banner'"
        class="add-dialog"
        :visible.sync="editVisible"
        width="800px"
      >
        <el-form
          ref="formAdd"
          :model="formAdd"
          :label-width="formLabelWidth"
          :rules="formAddRule"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="banner名称" prop="bannerName">
                <el-input
                  v-model="formAdd.bannerName"
                  placeholder="请输入轮播图名称"
                  size="small"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="文件" prop="bannerUrl">
                <el-upload
                  class="upload-demo"
                  action="#"
                  multiple
                  :file-list="fileList"
                  :on-change="handleUpLoadChange"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="banner顺序"
                prop="bannerLocal"
                :label-width="formLabelWidth"
              >
                <el-radio-group
                  class="radio-group"
                  v-model="formAdd.bannerLocal"
                >
                  <el-radio class="radio-group-item" label="top">置顶</el-radio>
                  <el-radio class="radio-group-item" label="center"
                    >居中</el-radio
                  >
                  <el-radio class="radio-group-item" label="bottom"
                    >末尾</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="文件缩略图">
                <img :src="formAdd.bannerUrl" alt="" style="width: 100px" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item label="文件大小" :label-width="formLabelWidth">
                <span>{{ formAdd.bannerSize }}</span>
              </el-form-item>
            </el-col> -->
          </el-row>
          <el-form-item label="内容形式">
            <el-radio-group
              v-model="formAdd.contTypeName"
              @change="handleContentType"
            >
              <el-radio label="0">图文</el-radio>
              <el-radio label="1">URL地址</el-radio>
            </el-radio-group>
          </el-form-item>
              <el-form-item label="URL地址" prop="url"

              >
                <el-input
                  v-model="formAdd.url"
                  placeholder="请输入跳转地址"
                  size="small"
                  disabled
                />
              </el-form-item>
            <!-- <el-col :span="12">
              <el-form-item
                label="暂定停留时间"
                :label-width="formLabelWidth"
                prop="remainTempTime"
              >
                <el-select
                  v-model="formAdd.remainTempTime"
                  placeholder="长期有效"
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
              <el-row>
                <el-col :span="12">
                  <el-form-item
                    label="实际停留时间"
                    :label-width="formLabelWidth"
                    prop="remainFactTime"
                  >
                    <span>{{ formAdd.remainFactTime }}</span>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col> -->

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="发布人">
                <span>{{ formAdd.releaser }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="发布状态"
                prop="bannerStatus"
                :label-width="formLabelWidth"
              >
                <el-radio-group v-model="formAdd.bannerStatus">
                  <el-radio label="1">发布</el-radio>
                  <el-radio label="0">未发布</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="发布日期" prop="releaserTime">
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
  qryBannerForPage,
  addBannerInfo,
  deleteBannerInfo,
  updateBannerInfo
} = operatingApi.bannerApi

export default {
  name: "operatingBannerManage",
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
        bannerName: "",
        remainTempTime: "",
        selectedDate: ""
      },
      listLoading: false,
      /* 表格数据 */
      formData: [],
      /* 表单依赖 */
      formAdd: {
        bannerName: "",
        base64String: "",
        fileName: "",
        fileExt: "",
        remainTempTime: "",
        remainFactTime: "",
        releaser: this.$store.getters.name,
        bannerStatus: "",
        releaserTime: "",
        bannerLocal: "",
        bannerSize: "",
        bannerUrl: "",
        contTypeName: "1"
      },
      /* 表单验证 */
      formAddRule: {
        bannerName: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ],
        bannerLocal: [
          { required: true, message: "请选择banner顺序", trigger: "change" }
        ],
        bannerUrl: [
          { required: true, message: "请上传文件", trigger: "change" }
        ],
        remainTempTime: [
          { required: true, message: "请选择暂定停留时间", trigger: "change" }
        ],
        bannerStatus: [
          { required: true, message: "请选择发布状态", trigger: "change" }
        ]
      },
      total: 10,
      selectedStay: "",
      imgPreviewVisible: false,
      dialogImageUrl: "",
      editVisible: false,
      addFlag: false,
      fileList: [],
      selectedFile: "",
      formLabelWidth: "110px"
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
      this._qryBannerForPage()
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
      this._qryBannerForPage()
    },
    /**
     * @description: 编辑
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleEditor(row = {}) {
      this.addFlag = !row.bannerId
      if (row.bannerId) {
        this.formAdd = row
      }
      this.editVisible = true
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
            this._addBannerInfo(this.formAdd)
          } else {
            this._updateBannerInfo(this.formAdd)
          }
          this.editVisible = false
        }
      })
    },
    /**
     * @description: 删除
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async handleDelete(value) {
      const { bannerId } = value
      try {
        await this.$confirm("此操作将永久删除该数据, 是否继续?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        this._deleteBannerInfo(bannerId)
        this.$message.success("删除成功")
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消"
        })
      }
    },
    /**
     * @description:查询请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _qryBannerForPage() {
      try {
        this.listLoading = true
        const { data } = await qryBannerForPage(this.formSearch)
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
    async _addBannerInfo(data) {
      try {
        await addBannerInfo(data)
        await this._qryBannerForPage()
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
    async _deleteBannerInfo(data) {
      try {
        await deleteBannerInfo(data)
        await this._qryBannerForPage()
        this.$message.success("删除成功")
      } catch (error) {
        this.$message("数据删除未成功")
      }
    },
    /**
     * @description:数据更新
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _updateBannerInfo(data) {
      try {
        await updateBannerInfo(data)
        await this._qryBannerForPage()
        this.$message.success("编辑成功")
      } catch (error) {
        this.$message("数据未更新")
      }
    },
    /**
     * @description: 缩略图预览
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleImg(row) {
      const { bannerUrl = "" } = row
      this.imgPreviewVisible = true
      this.dialogImageUrl = bannerUrl
    },
    /**
     * @description: 文件上传
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleUpLoadChange(file) {
      const url = URL.createObjectURL(file.raw)
      this.$forceUpdate()
      this.formAdd.bannerUrl = url
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
      this.formAdd.fileName = fileName
      this.formAdd.fileExt = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length
      )
    },
    /**
     * @description: 动态添加验证
     * @param {*}
     * @return {*}
     * @author: camus
     */
    handleContentType(value) {
      if (value === "0") {
        this.formAdd.cont = ""
        this.formAddRule.cont[0].required = true
        this.formAddRule.jumpUrl[0].required = false
      } else {
        this.formAdd.jumpUrl = ""
        this.formAddRule.cont[0].required = false
        this.formAddRule.jumpUrl[0].required = true
      }
    },
    /**
     * @description: 发布时间
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
     * @description: 发布
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async handleRelease(row) {
      const { bannerId } = row
      try {
        this.formAdd = {
          ...this.formAdd,
          bannerId,
          bannerStatus: 1
        }
        await this.$confirm("是否发布?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        await this._updateBannerInfo(this.formAdd)
        await this.$message.success("发布成功")
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消"
        })
      }
    }
  },
  filters: {
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
    }
  },
  watch: {
    editVisible(val) {
      if (!val) {
        this.formAdd = {
          bannerName: "",
          base64String: "",
          fileName: "",
          fileExt: "",
          remainTempTime: "",
          remainFactTime: "",
          releaser: this.$store.getters.name,
          bannerStatus: "",
          releaserTime: "",
          bannerLocal: "",
          url: "",
          bannerSize: "",
          bannerUrl: ""
        }
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    },
    "formAdd.bannerUrl": {
      handler(newVal) {
        if (newVal) {
          this.$refs.formAdd.clearValidate("bannerUrl")
        }
      }
    }
  },

  created() {
    this._qryBannerForPage()
  }
}
</script>
<style lang='scss' scoped>
.app-container {
  .right-label {
    color: #303133;
    font-weight: normal;
    margin-right: 10px;
  }
  .banner-dialog {
    ::v-deep .el-dialog {
      .el-dialog__body {
        .el-form {
          .el-form-item {
            margin-bottom: 10px;
            .radio-group .radio-group-item {
              margin-right: 15px;
              .el-radio__label {
                padding-left: 5px;
              }
            }
          }
        }
      }
    }
  }
}
</style>

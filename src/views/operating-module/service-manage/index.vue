<template>
  <div class="app-container">
    <el-form
      ref="formSearch"
      :model="formSearch"
      :inline="true"
      class="search-form clearfix"
      size="small"
    >
      <el-form-item label="服务名称" class="search-field fl">
        <el-input
          v-model="formSearch.servName"
          placeholder="请输入服务名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="服务类型" class="search-field fl">
        <el-select v-model="formSearch.servFather" placeholder="请选择服务类型">
          <el-option
            v-for="item in serviceType"
            :key="item.serTypeID"
            :label="item.servTypeName"
            :value="item.serTypeID"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务状态" class="search-field fl">
        <el-select v-model="formSearch.servFlag" placeholder="请选择服务状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="fr">
        <el-button class="two-words" plain size="small" @click="onClickReset"
          >重置</el-button
        >
        <el-button
          class="two-words"
          type="primary"
          size="small"
          @click="onClickSearch"
          >查询</el-button
        >
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <div class="table-edit-box clearfix">
        <div class="table-btn-right">
          <el-button type="success" size="small" @click="onAdd">添加</el-button>
        </div>
      </div>
      <el-table ref="table" v-loading="listLoading" height="460px" :data="formData" element-loading-text="加载中..." fit highlight-current-row>
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            {{
              scope.$index + 1 + (formSearch.pageNum - 1) * formSearch.pageSize
            }}
          </template>
        </el-table-column>
        <el-table-column label="服务名称" prop="servName" show-overflow-tooltip />
        <el-table-column label="服务类型" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag type="success">{{ scope.row.servFname }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="服务区域" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.servShe ? `${ proObj[scope.row.servShe] } - ${ cityObj[scope.row.servCity] }` : `` }}
          </template>
        </el-table-column>
        <el-table-column label="跳转链接" prop="servTagUrl" show-overflow-tooltip />
        <el-table-column label="服务描述" prop="servDscr" show-overflow-tooltip />
        <el-table-column label="发布时间" prop="crteTime" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ handleSendDate(scope.row.crteTime) }}
          </template>
        </el-table-column>
        <el-table-column align="center" width="250" fixed="right" prop="created_at" label="操作">
          <template slot-scope="scope">
            <el-link type="primary" size="small" @click="handleEditor(scope.row)">修改</el-link>
            <el-link type="primary" size="small" @click="handleSetTop(scope.row)">置顶</el-link>
            <!-- <el-link type="primary" size="small" v-if="scope.row.servFlag === '2'" @click="handleServiceStatus(scope.row, 1)">启用</el-link>
            <el-link type="primary" size="small" v-if="scope.row.servFlag === '1'" @click="handleServiceStatus(scope.row, 2)">禁用</el-link> -->
            <el-link type="danger" size="small" @click="handleDeleteService(scope.row)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <y-pagination
        v-show="total > 0"
        class="pageBox"
        :total="total"
        :page.sync="formSearch.pageNum"
        :limit.sync="formSearch.pageSize"
        @pagination="handlePagination"
      />
    </div>

    <!-- 弹框开始 -->
    <el-dialog :close-on-click-modal="false" :title="editTitle" :visible.sync="dialogFormVisible" width="600px" class="add-dialog">
      <el-form
        ref="addOrEditForm"
        class="Form"
        v-loading="formLoding"
        :model="formAdd"
        :rules="formAddRule"
        label-width="110px"
        size="small"
      >
        <el-form-item label="服务类型" prop="servFather">
          <el-select v-model="formAdd.servFather" placeholder="请选择服务类型">
            <el-option
              v-for="item in serviceType"
              :key="item.serTypeID"
              :label="item.servTypeName"
              :value="item.serTypeID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务名称" prop="servName">
          <el-input v-model="formAdd.servName" placeholder="请输入服务名称" clearable />
        </el-form-item>
        <el-form-item label="服务列表图标" prop="servUrl">
          <el-upload
            ref="uploadImg"
            class="upload-demo"
            action="#"
            list-type="picture"
            :before-remove="beforeImgRemove"
            :multiple="false"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleUpLoadChange"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="" prop="servUrl">
          <el-image
            v-if="formAdd.servUrl"
            :style="{ width: '100px', height: '100px' }"
            :src="formAdd.servUrl"
            fit="cover"
          ></el-image>
        </el-form-item>
        <el-form-item label="是否启用" prop="servFlag">
          <el-radio-group v-model="formAdd.servFlag">
            <el-radio label="1">启用</el-radio>
            <el-radio label="2">不启用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务区域" prop="servSop">
          <el-radio-group v-model="formAdd.servSop">
            <el-radio label="0">全国</el-radio>
            <el-radio label="1">地方</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="" v-if="formAdd.servSop === '1'">
          <el-cascader :options="cityList" :props="cascaderProps" @change="onChangeUnited" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="链接地址" prop="servTagUrl">
          <el-input v-model="formAdd.servTagUrl" placeholder="请输入链接地址" clearable />
        </el-form-item>
        <el-form-item label="服务描述" prop="servDscr">
          <el-input type="textarea" v-model="formAdd.servDscr" placeholder="请输入服务描述" :autosize="{ minRows: 4, maxRows: 4 }" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="() => { dialogFormVisible = false; this.listLoading = false; } ">取 消</el-button>
        <el-button type="primary" size="small" @click="submit">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 弹框结束 -->
  </div>
</template>
<script>
import { parseTime } from "@/utils/index.js"
import { operatingApi, commonApi } from "@/api"
const {
  getServiceManage,
  getServiceType,
  editServiceStatus,
  deleteService,
  updateServiceResrt,
  uploadImage,
  editService,
  addService
} = operatingApi.serviceApi

export default {
  name: "operatingServiceManage",
  data() {
    return {
      formLoding: false, // form 的 loading 效果
      cascaderProps: {
        value: "regnCode",
        label: "regnName",
        checkStrictly: false
      }, // 联级选择器设置
      isEdit: false, // 是否处于编辑状态
      formSearch: {
        pageNum: 1, // 当前页码
        pageSize: 10 // 当前页面最大显示条数
      },
      serviceType: [
        {
          serTypeID: "11",
          servTypeName: "测试1"
        },
        {
          serTypeID: "3",
          servTypeName: "测试"
        }
      ], // 服务类型列表
      formData: [], // 表格数据列表
      total: 10, // 服务管理列表数据总条数
      listLoading: false, // 表格 loading 效果
      dialogFormVisible: false, // dialog 是否显示
      editTitle: "新增服务", // 弹窗标题
      formAdd: {
        servFather: "", // 服务类型
        servName: "", // 服务名称
        servUrl: "", // 服务类别图标地址
        servFlag: "", // 服务是否启用
        servSop: "0", // 服务范围
        servTagUrl: "", // 链接地址
        servDscr: "", // 服务描述
        servShe: "", // 选择的省份
        servCity: "" // 选择的城市
      }, // 添加服务的数据
      cityList: [], // 城市列表
      proObj: {},
      cityObj: {},
      formAddRule: {
        servFather: [
          {
            required: true,
            message: "请选择服务类型",
            trigger: ["blur", "change"]
          }
        ],
        servName: [
          { required: true, message: "请输入服务名称", trigger: "blur" }
        ],
        servUrl: [
          {
            required: true,
            message: "请选择服务类别图标",
            trigger: ["blur", "change"]
          }
        ],
        servFlag: [
          {
            required: true,
            message: "请选择是否启用",
            trigger: ["blur", "change"]
          }
        ],
        servSop: [
          {
            required: true,
            message: "请选择服务范围",
            trigger: ["blur", "change"]
          }
        ],
        servTagUrl: [
          { required: true, message: "请输入链接地址", trigger: "blur" }
        ]
      } // 弹窗表单内容校验规则
    }
  },
  created() {
    this.getCityList()
  },
  mounted() {
    this._getServiceType()
    this._getServiceManage()
  },
  watch: {
    // 监听 dialog 显示情况, 隐藏时清空弹窗表格内容与校验结果
    dialogFormVisible(newVal) {
      if (!newVal) {
        this.$refs.addOrEditForm.resetFields()
        this.$refs.uploadImg.clearFiles()
      }
    },
    // 监听服务类别图标地址
    "formAdd.servUrl": {
      async handler(newVal) {
        await this.$nextTick()
        if (newVal) {
          this.$refs.addOrEditForm.clearValidate("servUrl")
        }
      }
    }
  },
  methods: {
    /**
     * @description: 省市联级选择器选中事件
     * @param {type} data Object 选中的数据
     * @author: chenwz
     */
    onChangeUnited(data) {
      this.formAdd.servShe = data[0] ? data[0] : ""
      this.formAdd.servCity = data[1] ? data[1] : ""
    },
    /**
     * @description: 点击查询时重置页数
     * @author: chenwz
     */
    onClickSearch() {
      this.formSearch.pageNum = 1
      this._getServiceManage()
    },
    /**
     * @description: 点击筛选器重置事件
     * @author: chenwz
     */
    onClickReset() {
      this.formSearch = {
        pageNum: 1,
        pageSize: 10
      }
      this._getServiceManage()
    },
    /**
     * @description: 分页器事件
     * @param {type} page Number 当前页
     * @author: chenwz
     */
    handlePagination({ page, limit }) {
      this.formSearch.pageNum = page
      this.formSearch.pageSize = limit
      this._getServiceManage()
    },
    /**
     * @description: 移除图片前的处理事件
     * @param {type} file Object 上传的图片信息
     * @author: chenwz
     */
    beforeImgRemove(file) {
      this.$confirm(`确定移除${file.name}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.formAdd.servUrl = ""
      }).catch(() => {})
    },
    /**
     * @description: 文件上传前处理操作, 将图片转成base64格式
     * @param {type} file Object 上传的图片信息
     * @author: chenwz
     */
    async handleUpLoadChange(file) {
      this.formLoding = true
      this.$refs.uploadImg.clearFiles()
      const url = URL.createObjectURL(file.raw)
      const reader = new FileReader()
      reader.readAsDataURL(file.raw)
      reader.onload = () => {
        const params = {
          base64String: reader.result.replace(/^data:image\/\w+;base64,/, ""),
          imageName: file.name,
          imageExt: file.name.substring(
            file.name.lastIndexOf(".") + 1,
            file.name.length
          )
        }
        // 执行文件上传方法
        this.handleUploadImage(params, url)
      }
    },
    /**
     * @description: 文件上传
     * @param {type} params Object 上传的图片信息
     * @param {type} url Object 本地图片地址
     * @author: chenwz
     */
    async handleUploadImage(params, url) {
      try {
        const { type, data, message } = await uploadImage(params)
        if (type === "success") {
          this.$nextTick(() => {
            this.$set(this.formAdd, "servUrl", data.absoluteUrl)
          })
        } else {
          this.$message.error(message)
          this.$set(this.formAdd, "servUrl", url)
        }
        this.formLoding = false
      } catch (e) {
        this.formLoding = false
        this.$message.error(e)
      }
    },
    /**
     * @description: 置顶操作处理
     * @param {type} row Object 置顶行数据
     * @author: chenwz
     */
    handleSetTop(row) {
      this.$confirm("确定将该项置顶?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.setTopService({ mattServIdList: [row.mattServId], moveFlag: "setTop" })
      }).catch(() => {})
    },
    /**
     * @description: 置顶操作
     * @author: chenwz
     */
    async setTopService(params = {}) {
      this.listLoading = true
      try {
        const { type } = await updateServiceResrt(params)
        if (type === "success") {
          this.listLoading = false
          this._getServiceManage()
          this.$message({
            message: "置顶成功",
            type: "success"
          })
        }
      } catch (e) {
        this.listLoading = false
      }
    },
    /**
     * @description: 加载服务类型列表事件
     * @author: chenwz
     */
    async _getServiceType() {
      const { type, data } = await getServiceType()
      if (type === "success") {
        this.serviceType = data
      } else {
        this.serviceType = []
      }
    },
    /**
     * @description: 获取城市列表
     * @param {type}
     * @return {type}
     * @author: chenwz
     */
    getCityList() {
      commonApi.getRegnAreaTree().then((data) => {
        this.cityList = data.data
        // 清空区县选项
        this.cityList.forEach((pro) => {
          this.proObj[pro.regnCode] = pro.regnName // 各省编码对应字段
          pro.children.forEach((item) => {
            this.cityObj[item.regnCode] = item.regnName // 各市编码对应字段
            delete item.children
          })
        })
      })
    },
    /**
     * @description: 处理发送时间
     * @author: chenwz
     */
    handleSendDate(time) {
      return time ? parseTime(time, "{y}-{m}-{d} {h}:{i}:{s}") : ""
    },
    /**
     * @description: 加载服务列表事件
     * @author: chenwz
     */
    async _getServiceManage() {
      this.listLoading = true
      try {
        const { type, data } = await getServiceManage(this.formSearch)
        if (type === "success") {
          this.formData = data.list
          this.total = data.total
        }
        this.listLoading = false
      } catch (e) {
        this.listLoading = false
      }
    },

    /**
     * @description: 展示弹框
     * @param {type}
     * @return {type}
     * @author: syx
     * @author: chenwz
     */
    onAdd() {
      this.dialogFormVisible = true
      this.isEdit = false
      this.editTitle = "新增服务"
      this.formAdd = {}
    },
    /**
     * @description: 处理编辑事件
     * @param {type} row Object 操作行的数据
     * @author: chenwz
     */
    handleEditor(row) {
      this.dialogFormVisible = true
      this.isEdit = true
      this.editTitle = "修改服务"
      this.formAdd = {
        ...this.formAdd,
        ...row
      }
    },
    /**
     * @description: 处理操作服务状态事件
     * @param {type} row Object 操作行的数据
     * @param {type} status String 操作状态
     * @author: chenwz
     */
    handleServiceStatus(row, status) {
      this.$confirm(
        row.servFlag === "1" ? "确认禁用该服务吗?" : "确认启用该服务吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this._editServiceStatus(row.mattServId, status)
        })
        .catch(() => {})
    },
    /**
     * @description: 编辑服务状态事件
     * @param {type} id String 服务id
     * @param {type} status String 服务状态
     * @author: chenwz
     */
    async _editServiceStatus(id, status) {
      const { type } = await editServiceStatus({
        mattServId: id,
        servFlag: status
      })
      if (type === "success") {
        this.$message({
          type: "success",
          message: "操作成功!"
        })
        this._getServiceManage()
      }
    },
    /**
     * @description: 删除服务操作
     * @param {type} row Object 删除列的数据
     * @author: chenwz
     */
    handleDeleteService(row) {
      this.$confirm("确认删除该服务吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteService(row.mattServId)
        })
        .catch(() => {})
    },
    /**
     * @description: 删除服务事件
     * @author: chenwz
     */
    async _deleteService(id) {
      const { type } = await deleteService({ mattServId: id })
      if (type === "success") {
        this.$message({
          type: "success",
          message: "删除成功!"
        })
        this._getServiceManage()
      }
    },
    /**
     * @description: 弹窗提交事件
     * @param {type}
     * @return {type}
     * @author: chenwz
     */
    submit() {
      this.$refs.addOrEditForm.validate((valid) => {
        if (!valid) {
          return false
        } else {
          if (this.formAdd.servSop === "1" && !this.formAdd.servCity) {
            this.$message({
              type: "warning",
              message: "请选择完整省市!"
            })
          } else {
            this.isEdit ? this.handleEditForm() : this.handleAddForm()
          }
        }
      })
    },
    /**
     * @description: 添加服务事件
     * @author: chenwz
     */
    async handleAddForm() {
      const params = {
        ...this.formAdd,
        crter: this.$store.state.user.id,
        crterName: this.$store.state.user.name,
        crteTime: new Date().getTime()
      }
      const { type } = await addService(params)
      if (type === "success") {
        this.$message({
          type: "warning",
          message: "添加成功"
        })
        this.dialogFormVisible = false
        this._getServiceManage()
      }
    },
    /**
     * @description: 编辑服务事件
     * @author: chenwz
     */
    async handleEditForm() {
      const { type } = await editService(this.formAdd)
      if (type === "success") {
        this.$message({
          type: "warning",
          message: "编辑成功"
        })
        this.dialogFormVisible = false
        this._getServiceManage()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.margin-bottom {
  margin-bottom: 10px;
}
.half {
  width: 50%;
  float: left;
}
.full {
  width: 100%;
  float: left;
}
::v-deep.edit-table .el-table__empty-block {
  min-height: unset;
  .el-table__empty-text {
    padding-top: 100px;
  }
}
.Form {
  ::v-deep .el-form .el-form-item {
    margin-bottom: 0 !important;
  }

}
</style>

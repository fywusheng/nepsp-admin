<template>
  <div class="app-container">
    <el-form
      ref="formSearch"
      :model="formSearch"
      :inline="true"
      class="search-form clearfix"
      size="small"
    >
      <el-form-item class="search-field fl" label="专题类别" prop="printName">
        <el-select v-model="formSearch.printName" placeholder="全部">
          <el-option
            v-for="item in categoryTypeOPt"
            :key="item.value"
            :label="item.label"
            :value="item.label"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="search-field fl" label="类型:" prop="contTypeName">
        <el-select v-model="formSearch.contTypeName" placeholder="全部">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
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
      <el-form-item label="内容查找" prop="cont" class="search-field fl">
        <el-input
          v-model="formSearch.cont"
          placeholder="请输入查找内容"
          clearable
        />
      </el-form-item>
      <el-form-item label="所属城市查找" prop="region" class="search-field fl">
        <el-cascader
          v-model="formSearch.cityCodg"
          :options="cityList"
          :props="cascaderProps"
          @change="handleRegionSearch"
          size="small"
          clearable
        ></el-cascader>
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
        ref="dragTable"
        v-loading="listLoading"
        :data="formData"
        row-key="title"
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
          align="center"
          label="所属专题"
          prop="printName"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="内容标题"
          prop="ttl"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="跳转类型"
          prop="contTypeName"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.contTypeName | toContentType }}
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="所属地市"
          prop="region"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="所属机构"
          prop="clikCnt"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          align="center"
          label="发布时间"
          prop="crteTime"
          show-overflow-tooltip
        >
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
            <el-link
              type="primary"
              size="small"
              @click="handleEditor(scope.row)"
              >修改</el-link
            >
            <el-link
              type="primary"
              size="small"
              @click="handleTop(scope.row)"
              >{{ scope.row.moveFlag === "setTop" ? "取消" : "置顶" }}</el-link
            >
            <el-link type="danger" size="small" @click="handleDelete(scope.row)"
              >删除</el-link
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <y-pagination
      v-show="total > 0"
      class="pageBox"
      :total="total"
      :page.sync="formSearch.pageNum"
      :limit.sync="formSearch.pageSize"
      @pagination="fetchData"
    />
    <el-dialog
      :title="addFlag ? '新增专题内容' : '编辑专题内容'"
      class="add-dialog"
      :visible.sync="editVisiable"
      width="800px"
    >
      <el-form
        :model="formAdd"
        ref="formAdd"
        :label-width="formLabelWidth"
        :rules="formAddRule"
      >
        <el-form-item label="文档封面" prop="ttlImgUrl">
          <el-upload
            class="upload-demo"
            action="#"
            multiple
            :on-change="handleUpLoadChange"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item label="封面缩略图">
          <img :src="formAdd.ttlImgUrl" alt="" style="width: 100px" />
        </el-form-item>
        <el-form-item label="文档标题" :label-width="formLabelWidth" prop="ttl">
          <el-input
            v-model="formAdd.ttl"
            autocomplete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="副标题"
          :label-width="formLabelWidth"
          prop="subTtl"
        >
          <el-input
            v-model="formAdd.subTtl"
            type="textarea"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <div class="selectRow">
          <el-form-item
            label="所属专栏"
            :label-width="formLabelWidth"
            prop="printId"
          >
            <el-select
              v-model="formAdd.printId"
              placeholder="全部"
              size="small"
            >
              <el-option
                v-for="item in categoryTypeOPt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="所属地市"
              :label-width="formLabelWidth"
              prop="cityCodg"
            >
              <el-cascader
                ref="regionRef"
                v-model="formAdd.cityCodg"
                :options="cityList"
                :props="cascaderProps"
                @change="onChangeUnited"
                size="small"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item
          label="内容标签"
          :label-width="formLabelWidth"
          size="small"
          prop="tagNameArr"
        >
          <el-tag
            :key="tag"
            v-for="tag in formAdd.tagNameArr"
            closable
            type="warning"
            size="small"
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible"
            v-model="inputValue"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm"
            @blur="handleInputConfirm"
          >
          </el-input>
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
            >+ 新标签</el-button
          >
        </el-form-item>
        <el-form-item label="内容形式">
          <el-radio-group
            v-model="formAdd.contTypeName"
            @change="handleContentType"
          >
            <el-radio label="0">图文</el-radio>
            <el-radio label="1">URL地址</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="链接URL"
          :label-width="formLabelWidth"
          v-if="formAdd.contTypeName === '1'"
          prop="jumpUrl"
        >
          <el-input
            v-model="formAdd.jumpUrl"
            autocomplete="off"
            size="small"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="富文本"
          :label-width="formLabelWidth"
          prop="cont"
          v-if="formAdd.contTypeName === '0'"
        >
          <vue-editor v-model="formAdd.cont"> </vue-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmit('formAdd')"
          >提交</el-button
        >
        <el-button @click="editVisiable = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/index.js"
import { operatingApi } from "@/api"

const { selectCmsColByDTO } = operatingApi.specialCategoryApi
const {
  selectCmsContByDTO,
  insertOrUpdateCmsCont,
  deleteCmsCont,
  getRegnAreaTree,
  updateResrt
} = operatingApi.contentApi

export default {
  name: "operatingFeedbackManage",
  data() {
    return {
      /* 类型 */
      typeOptions: [
        {
          label: "图文",
          value: "0"
        },
        {
          label: "URL",
          value: "1"
        }
      ],
      /* 查询依赖 */
      formSearch: {
        pageNum: 1,
        pageSize: 10,
        selectedType: "",
        contTypeName: "",
        printName: "",
        selectedDate: "",
        cont: ""
      },
      /*地区传参 */
      cascaderProps: {
        value: "regnCode",
        label: "regnName",
        checkStrictly: false
      },
      total: 10 /* 总条数 */,
      listLoading: false,
      sortable: null,
      /* 表单依赖 */
      formAdd: {
        printId: "",
        contTypeName: "0",
        ttl: "",
        cont: "",
        contSouc: "",
        srt: "",
        srtLv: "",
        jumpUrl: "",
        subTtl: "",
        region: "",
        ttlImgUrl: "",
        base64String: "",
        provinceCodg: "",
        cityCodg: "",
        tagNameArr: [],
        account: this.$store.getters.name,
        accountId: this.$store.getters.id
      },
      /* 表格数据 */
      formData: [],
      /* 表单验证 */
      formAddRule: {
        ttl: [{ required: true, message: "请输入文章标题", trigger: "blur" }],
        contTypeName: [
          { required: true, message: "选择内容类型", trigger: "change" }
        ],

        printId: [
          { required: true, message: "请选择关联专栏", trigger: "change" }
        ],
        cityCodg: [
          { required: true, message: "请选择内容关联地区", trigger: "change" }
        ],
        ttlImgUrl: [
          { required: true, message: "请上传封面", trigger: "change" }
        ],
        subTtl: [{ required: true, message: "请输入副标题", trigger: "blur" }],
        cont: [{ required: true, message: "请输入富文本", trigger: "blur" }],
        jumpUrl: [
          { required: false, message: "请输入跳转链接", trigger: "blur" }
        ]
      },
      editVisiable: false /*模态框状态 */,
      addFlag: false /* 是否是新增 */,
      formLabelWidth: "120px" /* 输入框大小 */,
      cityList: [],
      categoryTypeOPt: [],
      inputVisible: false,
      inputValue: ""
    }
  },

  methods: {
    /**
     * @description: 重置查询
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
        current: 1,
        provinceCodg: "",
        cityCodg: ""
      }
      this._selectCmsContByDTO()
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
      this._selectCmsContByDTO()
    },
    /**
     * @description: 表单提交
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleSubmit(refName) {
      const regionStr = this.$refs["regionRef"].inputValue
      const region = regionStr ? regionStr.replace("/", "-") : ""
      this.formAdd.region = region
      this.$refs[refName].validate((valid) => {
        if (valid) {
          this._insertOrUpdateCmsCont(this.formAdd)
          this.editVisiable = false
        }
      })
    },
    /**
     * @description: 编辑
     * @param {type}
     * @return {type}
     * @author: camus
     */
    handleEditor(row = {}) {
      this.addFlag = !row.contId
      if (row.contId) {
        this.formAdd = {
          ...row,
          account: this.$store.getters.name,
          accountId: this.$store.getters.id
        }
      }
      this.editVisiable = true
    },
    /**
     * @description: 标签删除
     * @param {*} tag
     * @return {*}
     * @author: camus
     */
    handleClose(tag) {
      this.formAdd.tagNameArr.splice(this.formAdd.tagNameArr.indexOf(tag), 1)
    },
    /**
     * @description: 标签变换输入
     * @param {*}
     * @return {*}
     * @author: camus
     */
    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    /**
     * @description: 标签输入确定
     * @param {*}
     * @return {*}
     * @author: camus
     */
    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue && this.formAdd.tagNameArr.indexOf(inputValue) < 0) {
        this.formAdd.tagNameArr.push(inputValue)
        this.inputVisible = false
        this.inputValue = ""
      } else if (inputValue === "") {
        this.inputVisible = false
        this.inputValue = ""
      } else {
        this.$message.warning("请填入不同标签")
      }
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
     * @description:
     * @param {*}
     */
    handleTop(value) {
      const { contId, moveFlag } = value
      if (moveFlag !== "setTop") {
        this._updateResrt({
          moveFlag: "setTop",
          contIdList: [contId]
        })
      } else {
        this._updateResrt({
          moveFlag: "cancel",
          contIdList: [contId]
        })
      }
    },
    /**
     * @description: 删除
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async handleDelete(value) {
      const { contId } = value
      const data = {
        key: contId,
        account: this.$store.getters.name,
        accountId: this.$store.getters.id
      }
      try {
        await this.$confirm("此操作将永久删除该数据, 是否继续?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        await this._deleteCmsCont(data)
      } catch (error) {
        this.$message({
          type: "info",
          message: "已取消"
        })
      }
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
      const fileExt = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length
      )
      this.formAdd.imageExt = fileExt
      this.formAdd.ttlImgUrl = url
    },
    /**
     * @description: 弹窗选择地区
     * @param {type}
     * @return {type}
     * @author: camus
     */
    onChangeUnited(data) {
      this.formAdd.provinceCodg = data[0] ? data[0] : ""
      this.formAdd.cityCodg = data[1] ? data[1] : ""
    },
    /**
     * @description: 搜索选择地址
     * @param {*}
     * @return {*}
     * @author: camus
     */
    handleRegionSearch(data) {
      this.formSearch.provinceCodg = data[0] ? data[0] : ""
      this.formSearch.cityCodg = data[1] ? data[1] : ""
    },
    /**
     * @description: 查询请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _selectCmsContByDTO() {
      try {
        this.listLoading = true
        const { data = {} } = await selectCmsContByDTO(this.formSearch)
        this.formData = data.list.map((item) => {
          return {
            ...item,
            tagNameArr: item.tagNameArr ? item.tagNameArr : []
          }
        })
        this.total = data.total
      } catch (error) {
        this.$message("未查询到相关数据")
        this.formData = []
        this.total = 0
      }
      this.listLoading = false
    },
    /**
     * @description: 添加,更新请求
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _insertOrUpdateCmsCont(data) {
      try {
        const msg = !this.addFlag ? "编辑成功" : "新增成功"
        await insertOrUpdateCmsCont(data)
        await this._selectCmsContByDTO()
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
    async _deleteCmsCont(data) {
      try {
        await deleteCmsCont(data)
        await this._selectCmsContByDTO()
        this.$message.success("删除成功")
      } catch (error) {
        this.$message("数据删除未成功")
      }
    },
    /**
     * @description: 专栏信息获取
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _selectCmsColByDTO() {
      try {
        const { data } = await selectCmsColByDTO(this.formSearch)
        this.categoryTypeOPt = data.list.map((item) => {
          return {
            label: item.colName,
            value: item.colId
          }
        })
      } catch (error) {
        this.$message("专栏类别数据无法获取")
      }
    },
    /**
     * @description: 专栏信息获取
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _updateResrt(data) {
      try {
        await updateResrt(data)
        this._selectCmsContByDTO()
      } catch (error) {
        this.$message("置顶失败")
      }
    },
    /**
     * @description: 城市获取
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async _getRegnAreaTree() {
      const { data } = await getRegnAreaTree()
      this.cityList = data
      data &&
        this.cityList.forEach((item) => {
          item.children.forEach((item) => {
            delete item.children
          })
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
     * @description: 内容过滤
     * @param {type}
     * @return {type}
     * @author: camus
     */
    toContentType: (value) => {
      if (!value) {
        return ""
      }
      return value === "0" ? "富文本" : "链接"
    }
  },
  watch: {
    editVisiable(val) {
      if (!val) {
        this.formAdd = {
          printId: "",
          contTypeName: "0",
          ttl: "",
          cont: "",
          contSouc: "",
          srt: "",
          srtLv: "",
          jumpUrl: "",
          subTtl: "",
          region: "",
          base64String: "",
          provinceCodg: "",
          cityCodg: "",
          ttlImgUrl: "",
          tagNameArr: [],
          account: this.$store.getters.name,
          accountId: this.$store.getters.id
        }
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    },
    "formAdd.ttlImgUrl": {
      handler(newVal) {
        if (newVal) {
          this.$refs.formAdd.clearValidate("ttlImgUrl")
        }
      }
    }
  },
  created() {
    this._selectCmsContByDTO()
    this._selectCmsColByDTO()
    this._getRegnAreaTree()
  }
}
</script>

<style>
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #42b983 !important;
}
</style>

<style lang="scss" scoped>
.icon-star {
  margin-right: 2px;
}
.drag-handler {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.show-d {
  margin-top: 15px;
}
::v-deep .el-tag + .el-tag {
  margin-left: 10px;
}
::v-deep .button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
  border-radius: 4px;
}
::v-deep .input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

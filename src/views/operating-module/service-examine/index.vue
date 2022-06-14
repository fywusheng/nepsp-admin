<!--
 * @Author: chenwz
 * @Date: 2020-11-16 10:50:37
 * @LastEditTime: 2020-11-24 13:47:33
 * @LastEditors: camus
 * @Description:
 * @FilePath: \nepsp-admin\src\views\operating-module\service-examine\index.vue
-->
<template>
  <div class="app-container">
    <el-form
      class="notice-search-box-body search-form clearfix"
      :inline="true"
      size="small"
      ref="formSearch"
      :model="searchData"
    >
      <el-form-item
        label="审批状态"
        label-width="110px"
        class="search-field fl"
        prop="checkStas"
      >
        <el-select v-model="searchData.checkStas" placeholder="全部">
          <el-option
            v-for="item in checkStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务区域" prop="region" class="search-field fl">
        <el-cascader
          v-model="searchData.cityCodg"
          :options="cityList"
          :props="cascaderProps"
          @change="handleRegionSearch"
          size="small"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item
        label="服务类型"
        label-width="110px"
        class="search-field fl"
        prop="servFather"
      >
        <el-select v-model="searchData.servFather" placeholder="全部">
          <el-option
            v-for="item in serveTypeOptions"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="服务名称"
        label-width="110px"
        class="search-field fl"
        prop="servName"
      >
        <el-input
          v-model="searchData.servName"
          placeholder="请输入服务名称"
        ></el-input>
      </el-form-item>
      <el-form-item class="fr">
        <el-button
          class="two-words"
          plain
          size="small"
          @click="onClickReset('formSearch')"
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
      <el-table
        ref="noticeTable"
        v-loading="listLoading"
        :data="examineList"
        element-loading-text="加载中..."
        border
        highlight-current-row
      >
        <el-table-column type="index" label="编号" width="60"></el-table-column>
        <el-table-column
          label="服务名称"
          align="center"
          prop="servName"
        ></el-table-column>
        <el-table-column
          label="服务类型"
          align="center"
          prop="servFname"
        ></el-table-column>
        <el-table-column
          label="服务区域"
          align="center"
          prop="address"
        ></el-table-column>
        <el-table-column label="链接" align="center" prop="servTagUrl">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              size="small"
              @click="onClickLink(scope.row)"
              >跳转查看</el-link
            >
          </template>
        </el-table-column>
        <el-table-column
          label="申请机构"
          align="center"
          prop="crteOptinsName"
        ></el-table-column>
        <el-table-column
          label="申请时间"
          align="center"
          prop="crteTime"
        ></el-table-column>
        <el-table-column label="审批状态" align="center" prop="checkStas">
          <template slot-scope="scope">
            {{ scope.row.checkStas | toStatus }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              size="small"
              @click="handleServiceOperate(scope.row)"
              >{{ checked(scope.row) ? "查看" : "审批" }}</el-link
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <y-pagination
        v-show="total > 0"
        class="pageBox"
        :total="total"
        :page.sync="searchData.pageNum"
        :limit.sync="searchData.pageSize"
        @pagination="fetchData"
      />
    </div>

    <el-dialog
      :close-on-click-modal="false"
      title="服务审批"
      :visible.sync="showDialog"
      width="600px"
      class="add-notice-dialog"
    >
      <el-form
        ref="noticeDialogForm"
        :model="examineInfo"
        :rules="dialogRule"
        label-width="140px"
        size="small"
      >
        <el-form-item label="服务名称：" prop="notcTtl">
          <el-input
            v-model="examineInfo.servName"
            placeholder="请输入服务名称"
            disabled
          />
        </el-form-item>
        <el-form-item label="服务类别：" prop="msgType">
          <el-select
            v-model="examineInfo.servFname"
            placeholder="请选择服务类别型"
            disabled
          >
            <el-option
              v-for="item in serviceType"
              :key="item.serTypeID"
              :label="item.servTypeName"
              :value="item.serTypeID"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务简介" prop="servDscr">
          <el-input
            v-model="examineInfo.servDscr"
            placeholder=""
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3 }"
            disabled
          />
        </el-form-item>
        <el-form-item label="所属城市" prop="notcTtl">
          <el-input
            v-model="examineInfo.address"
            placeholder="请选择所属城市"
            disabled
          />
          <!-- <el-cascader :options="cityList" :props="cascaderProps" @change="onChangeUnited" clearable></el-cascader> -->
        </el-form-item>
        <el-form-item label="服务链接" prop="notcTtl">
          <el-input
            v-model="examineInfo.servTagUrl"
            placeholder="请输入服务链接"
            disabled
          />
        </el-form-item>
        <el-form-item label="服务图标" prop="servUrl">
          <el-image
            :style="{ width: '100px', height: '100px' }"
            :src="examineInfo.servUrl"
            fit="cover"
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          size="small"
          :disabled="checked(examineInfo)"
          @click="
            () => {
              retortVisiable = true;
            }
          "
          >驳 回</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="handleEditServiceExamine('2')"
          :disabled="checked(examineInfo)"
          >通 过</el-button
        >
      </div>
    </el-dialog>
    <el-dialog :visible.sync="retortVisiable" width="600px" class="add-dialog">
      <el-form :model="retort" :rules="formRule" ref="formRetort">
        <el-form-item label="驳回信息" label-width="120px" prop="retortMessage">
          <el-input
            v-model="retort.retortMessage"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 3 }"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="retortVisiable = false">取 消</el-button>
        <el-button type="primary" @click="handleEditServiceExamine('3')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { operatingApi } from "@/api"
import { randomStr } from "@utils/str-util"
const {
  getServiceExamine,
  editServiceExamine
} = operatingApi.serviceExamineApi
const { getRegnAreaTree } = operatingApi.contentApi

export default {
  name: "serviceExamineManage",
  data() {
    return {
      isCheck: true, // 是否为查看
      listLoading: false, // loading 效果
      /* 查询依赖 */
      searchData: {
        pageNum: 1, // 当前页码
        pageSize: 10, // 当前页面最大显示条数
        servShe: "",
        servCity: "",
        checkStas: "",
        servFather: ""
      },
      serviceType: [],
      cityList: [],
      proObj: {},
      cityObj: {},
      examineList: [],
      examineInfo: {},
      showDialog: false,
      dialogRule: {},
      total: 10,
      /*地区传参 */
      cascaderProps: {
        value: "regnCode",
        label: "regnName",
        checkStrictly: false
      },
      retortVisiable: false,
      retort: {
        retortMessage: ""
      },
      /* 驳回验证依赖 */
      formRule: {
        retortMessage: [
          { required: true, message: "请输入驳回原因", trigger: "blur" }
        ]
      },
      /* 审批状态查询 */
      checkStatusOptions: [
        {
          label: "未提交",
          value: "0"
        },
        {
          label: "待审批",
          value: "1"
        },
        {
          label: "已通过",
          value: "2"
        },
        {
          label: "已驳回",
          value: "3"
        }
      ],
      /* 服务类型 */
      serveTypeOptions: []
    }
  },
  created() {
    this._getRegnAreaTree()
    this.loadServiceExamine()
  },
  methods: {
    /**
     * @description: 查询
     * @param {type}
     * @return {type}
     * @author: camus
     */
    fetchData(val) {
      if (val === 1) {
        this.searchData.pageSize = 10
        this.searchData.pageNum = 1
      }
      this.loadServiceExamine()
    },
    /**
     * @description: 重置查询
     * @param {*} refsName
     * @return {*}
     * @author: camus
     */
    onClickReset(refsName) {
      this.$refs[refsName].resetFields()
      this.searchData = {
        ...this.searchData,
        servShe: "",
        servCity: ""
      }
      this.loadServiceExamine()
    },
    /**
     * @description: 搜索选择地址
     * @param {*}
     * @return {*}
     * @author: camus
     */
    handleRegionSearch(data) {
      this.searchData.servShe = data[0] ? data[0] : ""
      this.searchData.servCity = data[1] ? data[1] : ""
    },
    /**
     * FIXME: link 字段对接
     * @description: 加载服务类型列表事件
     * @author: chenwz
     */
    onClickLink(row) {
      if (row.servUrl) {
        window.open(row.servUrl)
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
    },
    /**
     * @description: 加载服务类型列表事件
     * @author: chenwz
     */
    async loadServiceExamine() {
      try {
        this.listLoading = true
        const { data } = await getServiceExamine(this.searchData)
        this.examineList = data.list
        this.total = data.total
        this.serveTypeOptions = data.list.map((item) => {
          return {
            value: item.servFather,
            label: item.servFname,
            key: randomStr()
          }
        })
      } catch (error) {
        this.$message("未查询到相关数据")
        this.examineList = []
        this.total = 0
      }
      this.listLoading = false
    },
    /**
     * @description: 审批弹窗打开
     * @param {*}
     * @return {*}
     * @author: camus
     */
    async handleServiceOperate(row) {
      row.mattServId && (this.examineInfo = row)
      this.showDialog = true
    },
    /**
     * @description: 审批编辑方法
     * @param {*}
     * @return {*}
     * @author: camus
     */
    async handleEditServiceExamine(checkStas) {
      const { mattServId } = this.examineInfo
      const data = {
        mattServId,
        checkStas
      }
      if (checkStas === "3") {
        this.$refs["formRetort"].validate((valid) => {
          if (valid) {
            this.retortVisiable = false
            this.showDialog = false
            this._editServiceExamine({
              ...data,
              refuseDetail: this.retort.retortMessage
            })
          }
        })
      } else if (checkStas === "2") {
        this.showDialog = false
        this._editServiceExamine(data)
      }
    },
    /**
     * @description: 审批编辑
     * @param {*}
     * @return {*}
     * @author: camus
     */
    async _editServiceExamine(data) {
      try {
        await editServiceExamine(data)
        this.loadServiceExamine()
        this.$message({
          type: "success",
          message: "审批完成"
        })
      } catch (error) {
        this.$message({
          type: "info",
          message: "审批未完成"
        })
      }
    },
    /**
     * @description: 是否已审批
     * @param {*} row
     * @return {*}
     * @author: camus
     */
    checked(row) {
      if (row.checkStas === "2" || row.checkStas === "3") {
        return true
      } else if (row.checkStas === "0" || row.checkStas === "1") {
        return false
      }
    }
  },
  filters: {
    /**
     * @description: 审批状态过滤
     * @param {*}
     * @return {*}
     * @author: camus
     */
    toStatus: (status) => {
      switch (status) {
      case "0":
        return "未提交"
      case "1":
        return "待审核"
      case "2":
        return "已通过"
      case "3":
        return "已驳回"
      default:
        break
      }
    }
  },
  watch: {
    retortVisiable(val) {
      if (!val) {
        this.retort.retortMessage = ""
      }
      this.$nextTick(() => {
        this.$refs.formRetort.clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.avatar-uploader .el-upload {
  border: 1px dashed #dddddd;
  border-radius: 4px;
  cursor: pointer;
  background: #f5f5f5;
  position: relative;
  overflow: hidden;
}
::v-deep.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 104px;
  height: 104px;
  line-height: 104px;
  text-align: center;
}
.avatar {
  width: 104px;
  height: 104px;
  display: block;
  margin-top: -104px;
}
</style>

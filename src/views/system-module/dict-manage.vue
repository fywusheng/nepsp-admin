<template>
  <div class="app-container">
    <el-form ref="formSearch" :model="formSearch" :inline="true" class="search-form clearfix" size="small">
      <el-form-item class="search-field fl" label="字典名称" prop="dictName">
        <el-input v-model="formSearch.dictName" placeholder="请输入字典名称" clearable />
      </el-form-item>
      <el-form-item class="search-field fl" label="字典类型" prop="dictType">
        <el-input v-model="formSearch.dictType" placeholder="请输入字典类型" clearable />
      </el-form-item>
      <el-form-item class="search-field fl" label="字典状态" prop="status">
        <el-select v-model="formSearch.status" @change="handleSearch()" placeholder="请选择字典状态" clearable >
          <el-option value="0" label="启用"></el-option>
          <el-option value="1" label="停用"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item  class="fr">
        <el-button class="two-words" plain size="small" @click="onReset('formSearch')">重置</el-button>
        <el-button class="two-words" type="primary" size="small" @click="handleSearch()">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="table-wrap">
      <div class="table-edit-box clearfix">
        <div class="table-btn-right">
          <el-button type="success" size="small" @click="addOrEdit()">添加</el-button>
        </div>
      </div>
      <el-table  ref="table" v-loading="listLoading" height="460px" :data="list" element-loading-text="加载中..."  fit highlight-current-row>
        <el-table-column label="序号" width="50" align="center">
          <template slot-scope="scope">
            {{ (scope.$index + 1 )+ (formSearch.pageNum - 1) * formSearch.pageSize }}
          </template>
        </el-table-column>
        <el-table-column label="字典名称" prop="dictName" show-overflow-tooltip />
        <el-table-column label="字典代码" prop="dictType" show-overflow-tooltip />
        <el-table-column label="字典项" prop="dictLabelConcat" show-overflow-tooltip />
        <el-table-column label="字典状态" min-width="120" width="220" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">{{ scope.row.status === '0' ? "开启" : "关闭"}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center"  fixed="right" prop="created_at" label="操作" width="250">
          <template slot-scope="scope">
            <el-link type="primary" size="small" @click="addOrEdit(scope.row)">修改</el-link>
            <el-link :type="scope.row.status === '0' ? 'danger' : 'primary'" size="small" @click="handleUpdate(scope.row)">{{scope.row.status === '0' ? "停用" : "启用"}}</el-link>
            <el-link type="danger" size="small" @click="handleDelete(scope.row.dictId)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <y-pagination v-show="total>0"  @pagination="fetchData" class="pageBox" :total="total" :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize" />
    </div>
    <!-- 弹窗新增 -->
    <el-dialog :close-on-click-modal="false" :title="addFlag ? '新增' : '修改'" :visible.sync="dialogFormVisible" width="900px" class="add-dialog">
      <el-form ref="formAdd" :model="formAdd" :rules="formAddRule" :label-width="formLabelWidth" size="small">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="formAdd.dictName" clearable :maxlength="50" autocomplete="off" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典代码" prop="dictType">
          <el-input v-model="formAdd.dictType" clearable :maxlength="50" autocomplete="off" placeholder="请输入字典代码" />
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-radio v-model="formAdd.status" label="0">启用</el-radio>
          <el-radio v-model="formAdd.status" label="1">停用</el-radio>
        </el-form-item>
        <el-form-item label="是否关联图标" prop="isimages">
          <el-radio v-model="formAdd.isimages" :disabled="formAdd.sysDictDataDTOList.length > 0" label="Y">启用</el-radio>
          <el-radio v-model="formAdd.isimages" :disabled="formAdd.sysDictDataDTOList.length > 0" label="N">停用</el-radio>
        </el-form-item>
        <y-title class="title" content="" fontWeight="bold" backgroundColor="linear-gradient(135deg, #FF8800 0%, #FF5000 100%)">
          <div class="flex-c-b">
            <div class="left">字典项</div>
            <el-link @click="addDictData" type="primary" :underline="false" icon="el-icon-plus" class="right" >新增参数</el-link>
          </div>
        </y-title>
        <el-table  ref="table" v-loading="listLoading"  :data="formAdd.sysDictDataDTOList" element-loading-text="加载中..."  fit highlight-current-row>
          <el-table-column label="数据名称" prop="dictLabel" show-overflow-tooltip />
          <el-table-column label="值" prop="dictValue" show-overflow-tooltip />
          <el-table-column label="图标" prop="crterName" show-overflow-tooltip >
            <template slot-scope="scope">
              <img v-if="formAdd.isimages === 'Y'" class="dict-icon" :src="scope.row.dictValue" />
              <span v-if="formAdd.isimages === 'N'" >--</span>
            </template>
          </el-table-column>
          <el-table-column label="排序" prop="dictSort" show-overflow-tooltip />
          <el-table-column label="启用状态" min-width="120" width="80" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '0' ? 'success' : 'danger'">{{ scope.row.status === "0" ? "开启" : "关闭"}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center"  fixed="right" prop="created_at" label="操作" width="150">
            <template slot-scope="scope">
              <el-link type="primary" size="small" @click="editDict(scope.row, scope.$index)">修改</el-link>
              <el-link type="danger" size="small" @click="handleDeleteDict(scope.row.dictCode, scope.$index)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleAddEditDict('formAdd')">保 存</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="addDictFlag ? '新增字典项' : '修改字典项'" :visible.sync="dialogFormPreviewVisible" width="600px">
      <el-form ref="dictFormAdd" :model="dictFormAdd" :rules="formAddRule" :label-width="formLabelWidth" size="small">
        <el-form-item label="数据名称" prop="dictLabel">
          <el-input v-model="dictFormAdd.dictLabel" clearable :maxlength="50" autocomplete="off" placeholder="请输入数据名称" />
        </el-form-item>
        <el-form-item label="值" v-show="this.formAdd.isimages === 'N'" prop="dictValue">
          <el-input v-model="dictFormAdd.dictValue" clearable :maxlength="50" autocomplete="off" placeholder="请输入值" />
        </el-form-item>
        <el-form-item label="字典图标" prop="dictValue" v-show="this.formAdd.isimages === 'Y'">
          <y-upload-img ref="uploadImg" :img-list="imgList" :autoUploadImg="true" :http-request="uploadImgReq" :max="1"></y-upload-img>
        </el-form-item>
        <el-form-item label="排序号" prop="dictSort">
          <el-input-number v-model="dictFormAdd.dictSort" :min="1" :max="999" ></el-input-number>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-radio v-model="dictFormAdd.status" label="0">启用</el-radio>
          <el-radio v-model="dictFormAdd.status" label="1">停用</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormPreviewVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="submitDictForm('dictFormAdd')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {systemApi, commonApi } from "@/api"
import YUploadImg from "@components/y-upload-img"
export default {
  name: "systemDictManage",
  components: {
    YUploadImg
  },
  data() {
    return {
      imgList: [],
      // 搜索
      formSearch: {
        dictName: "",
        dictType: "",
        status: "",
        pageNum: 1,
        pageSize: 10
      },
      addFlag: true,
      addDictFlag: true,
      editDictIndex: null, //编辑的选项的索引
      // 新增表单
      formAdd: {
        dictId: null, //字典id
        dictName: "", //字典名称
        dictType: "", //字典类型
        status: "0", //启用状态
        isimages: "N", //是否启用照片
        sysDictDataDTOList: [] //字典数据
      },
      formAddRule: {
        dictName: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
        dictType: [{ required: true, message: "请输入字典类型", trigger: "blur"}],
        status: [{ required: true, message: "请选择启用状态", trigger: "change" }],
        isimages: [{ required: true, message: "请选择是否启用照片", trigger: "change" }],
        //字典值的校验
        dictLabel: [{ required: true, message: "请输入数据名称", trigger: "blur" }],
        dictValue: [{ required: true, message: "请输入数据值", trigger: "blur" }],
        dictSort: [{ required: true, message: "请输入排序", trigger: "blur" }]
      },
      dictFormAdd: {
        isDefault: "N",
        dictLabel: "",
        dictValue: "",
        dictSort: "",
        status: "0"
      },

      // 表格
      list: [],
      listLoading: false, // 表格加载
      // 分页
      total: 0,
      dialogFormVisible: false, // 是否展示新增弹窗
      dialogFormPreviewVisible: false, // 是否展示预览弹窗
      // 新增弹窗，表单标签的宽度
      formLabelWidth: "120px"
    }
  },
  watch: {
    dialogFormVisible(val){
      if (!val){
        this.formAdd = {
          dictId: null,
          dictName: "", //字典名称
          dictType: "", //字典类型
          status: "0", //启用状态
          isimages: "N", //是否启用照片
          sysDictDataDTOList: [] //字典数据
        }
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    },
    dialogFormPreviewVisible(val){
      if (!val){
        this.dictFormAdd = {
          isDefault: "N",
          dictLabel: "",
          dictValue: "",
          dictSort: "",
          status: "0"
        }
        this.$refs.uploadImg.uploadFiles = []
        this.imgList = []
        this.addDictFlag = true
      }
      this.$nextTick(() => {
        this.$refs.dictFormAdd.clearValidate()
      })
    }
  },
  created() {
    //触发搜索
    this.fetchData()
  },
  methods: {
    /**
     * @description: 上传图片
     * @param {*} options
     * @return {*}
     * @author: syx
     */
    uploadImgReq(options) {
      var _this = this
      var reader = new FileReader()
      reader.readAsDataURL(options.file)
      reader.onload = function(){
        console.log(event) //获取到base64格式图片
        const index = options.file.name.indexOf(".")
        const length = options.file.name.length
        const params = {
          base64String: reader.result.toString().substring(reader.result.indexOf(",") + 1),
          imageName: options.file.name,
          imageExt: options.file.name.substr(index + 1, length)
        }
        commonApi.uploadFile(params).then(data => {
          _this.dictFormAdd.dictValue = data.data.absoluteUrl
        })
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || file.type === "image/png"
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 或 PNG 格式!")
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!")
      }
      return isJPG && isLt2M
    },
    /**
     * @description: 删除数据字典
     * @param {*}
     * @return {*}
     * @author: syx
     */
    handleDeleteDict(dictCode, index) {
      console.log("handleDeleteDict -> dictCode", dictCode)
      this.$confirm("此操作将永久删除该字典数据, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(async() => {
        if (dictCode) {
          await systemApi.delDictData({dictCode: dictCode })
        }
        this.formAdd.sysDictDataDTOList.splice(index, 1)
        this.$message.success("删除字典数据成功")
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        })
      })
      
    },
    /**
     * @description: 编辑字典数据
     * @param {*}
     * @return {*}
     * @author: syx
     */
    editDict(data, index) {
      this.editDictIndex = index
      data.updateBy = this.$store.getters.name
      this.imgList = [{
        url: data.dictValue,
        name: ""
      }]
      Object.assign(this.dictFormAdd, data)
      this.addDictFlag = false
      this.dialogFormPreviewVisible = true
    },
    /**
     * @description: 点击新增数据
     * @param {*}
     * @return {*}
     * @author: syx
     */
    addDictData() {
      this.dialogFormPreviewVisible = true
      this.dictFormAdd.createBy = this.$store.getters.name
      this.dictFormAdd.dictSort = this.formAdd.sysDictDataDTOList.length + 1
    },
    /**
     * @description: 停用或启用
     * @param {*}
     * @return {*}
     * @author: syx
     */
    handleUpdate(data) {
      const msg = data.status === "0" ? "停用成功" : "启用成功"
      const status = data.status === "0" ? "1" : "0"
      const params = {
        dictId: data.dictId,
        status: status
      }
      systemApi.updateDictTypeStatus(params).then(data => {
        this.$message.success(msg)
        this.fetchData()
      })

    },
    /**
     * @description: 搜索数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleSearch(){
      this.formSearch.pageNum = 1
      this.fetchData()
    },
    /**
     * @description: 重置搜索
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.handleSearch()
    },
    /**
     * @description: 获取数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    fetchData() {
      this.listLoading = true
      systemApi.selectDictList(this.formSearch).then(data => {
        this.listLoading = false
        const res = data.data
        this.total = res.total
        this.list = res.list
      })
    },
    /**
     * @description: 展示弹框
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    addOrEdit(data = {}) {
      this.addFlag = !data.dictId
      if (data.dictId) {
        systemApi.dictDetail({dictId: data.dictId}).then(data => {
          const res = data.data
          for (const key in this.formAdd) {
            this.formAdd[key] = res[key] || this.formAdd[key]
          }
          this.formAdd.rid = res.rid
          this.formAdd.updateBy = this.$store.getters.name //更新者
        })
      }
      this.formAdd.createBy = this.$store.getters.name
      this.dialogFormVisible = true
    },
    /**
     * @description: 新增或者编辑
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    handleAddEditDict(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formAdd.sysDictDataDTOList.length === 0){
            this.$message.error("请添加字典项")
            return
          }
          const msg = !this.addFlag ? "编辑成功" : "新增成功"

          for (let i = 0; i < this.formAdd.sysDictDataDTOList.length; i++) {
            const item = this.formAdd.sysDictDataDTOList[i]
            item.dictType = this.formAdd.dictType
          }

          console.log(JSON.stringify(this.formAdd))
          systemApi.insertOrUpdateDict(this.formAdd).then(data => {
            this.$message.success(msg)
            this.handleSearch()
            this.dialogFormVisible = false
          })
        }
      })
    },
    /**
     * @description: 点击删除字典数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    handleDelete(dictId) {
      this.$confirm("此操作将永久删除该字典类型, 是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        systemApi.delDictTypeCascade({dictId}).then(data => {
          this.$message.success("删除字典类型成功")
          this.handleSearch()
        })
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消"
        })
      })
    },
    /**
     * @description: 添加数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    submitDictForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addDictFlag) {
            this.formAdd.sysDictDataDTOList.push(this.dictFormAdd)
          } else if (this.editDictIndex !== null){
            Object.assign(this.formAdd.sysDictDataDTOList[this.editDictIndex], this.dictFormAdd)
          }
          this.dialogFormPreviewVisible = false
          this.$forceUpdate()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.dict-icon{
  height: 36px;
  vertical-align: middle;
}
.line {
  text-align: center;
}
.add-dialog {
  .btn-choose {
    margin-left: 0px !important;
  }
  .el-upload__tip {
    line-height: 20px !important;
  }
  .el-select {
    width: 100%;
  }
}
.tree-warp {
  height: 400px;
  width: 100%;
  overflow-y: auto;
}

  .menu-icon {
    font-size: 32px;
    margin-right: 20px;
    position: relative;
    .clear-icon {
      font-size: 18px;
      position: absolute;
      right: -10px;
      top: -10px;
      color: $blue_color;
      cursor: pointer;
      display: none;
    }
    &:hover {
      .clear-icon {
        display: block;
      }
    }
  }

.icon-dialog {
  .icon-wrap {
    max-height: 400px;
    overflow-y: scroll;
    .icon-item {
      margin: 10px;
      height: 50px;
      width: 50px;
      line-height: 50px;
      text-align: center;
      float: left;
      font-size: 30px;
      color: #24292e;
      cursor: pointer;
      &.active {
        background: $menu_active_text;
        color: #fff;
      }
    }
  }
}

.unUpload ::v-deep.el-upload--picture-card{
  display: none;
}

.avatar-uploader ::v-deep .el-upload {
    border: 1px dashed $border_color !important;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>


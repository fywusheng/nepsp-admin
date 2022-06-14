<!--
 * @Description: 专题内容管理
 * @Version: //
 * @Autor: syx
 * @Date: 2021-06-30 11:04:08
 * @LastEditors: syx
 * @LastEditTime: 2021-08-06 15:28:38
-->
<template>
  <div class="page-interest app-container">
    <div class="content">
      <el-form ref="formSearch" :model="formSearch" :inline="true" class="search-form clearfix" size="small">
        <el-form-item label="所属栏目" class="search-field fl" prop="printId">
          <el-select v-model="formSearch.printId" @change="handleSearch" clearable placeholder="全部" >
            <el-option v-for="item in categoryTypeOPt" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="起止日期" class="search-field fl" prop="startTime">
          <el-date-picker v-model="time" :picker-options="pickerOptions" @change="dateChange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
        <el-form-item label="标题查找" class="search-field fl" prop="ttl">
          <el-input v-model="formSearch.ttl" placeholder="请输入标题查找" clearable />
        </el-form-item>
        <el-form-item label="所属地区"  class="search-field fl"  prop="region">
          <y-cascader ref="yCascaderArea" placeholder="请选择所属地区" maxLevel="1" :delChildren="true" :settings="{'checkStrictly': false,'level': 'admdvsLv','value':'regnCode','label':'regnName'}"  @change="cityChange" :data="cityList" clearable v-model="city" />
        </el-form-item>
        <el-form-item class="fr">
          <el-button class="two-words" plain size="small" @click="onReset('formSearch')">重置</el-button>
          <el-button class="two-words" type="primary" size="small" @click="handleSearch">查询</el-button>
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
          <el-table-column label="内容标题" prop="ttl" min-width="120"  show-overflow-tooltip />
          <el-table-column label="所属专栏" prop="printName" min-width="120"  align="center" show-overflow-tooltip/>
          <el-table-column label="所属城市" prop="region" min-width="120"  align="center" show-overflow-tooltip/>
          <el-table-column label="文章状态" prop="chkStas" min-width="120"  align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.chkStas | chkStasFilter}}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="crteTime" min-width="120"  align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.crteTime | dayFormat("date")}}
            </template>
          </el-table-column>
          <el-table-column label="发布时间" prop="rlsTime" min-width="120"  align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.rlsTime | dayFormat("date")}}
            </template>
          </el-table-column>
          <el-table-column align="center"  fixed="right" prop="created_at" label="操作" width="250">
            <template slot-scope="scope">
              <el-link type="primary" size="small" v-if="scope.row.chkStas === '0' || scope.row.chkStas ==='-1'" @click="addOrEdit(scope.row)">修改</el-link>
              <el-link type="warning" size="small" v-if="scope.row.chkStas === '0' || scope.row.chkStas ==='-1'" @click="submitExamine(scope.row.contId)">提交审核</el-link>
              <el-link type="warning" size="small" v-if="scope.row.chkStas === '1'" @click="examine(scope.row)">审核</el-link>
              <el-link type="danger" size="small" v-if="scope.row.chkStas !== '1'" @click="handleDelete(scope.row.contId)">删除</el-link>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <y-pagination v-show="total>0" @pagination="fetchData" class="pageBox" :total="total" :page.sync="formSearch.pageNum" :limit.sync="formSearch.pageSize" />
      </div>
    </div>

    <!-- 审核弹框 -->
    <el-dialog :close-on-click-modal="false" title="审核"  :visible.sync="dialogExamine" width="750px" class="examine-dialog add-dialog">
      <div class="mobiel flex-c-s flex-col">
        <div class="title">{{detailInfo.ttl}}</div>
        <audio refs="audio" v-if="detailInfo.artiType === '0'" controls="controls" :src="detailInfo.mediaUrl">您的浏览器不支持 audio 标签。</audio>
        <video refs="video" v-if="detailInfo.artiType === '1'" style="width: 100%;" :src="detailInfo.mediaUrl" controls="controls">您的浏览器不支持 video 标签。</video>
        <div class="edit-box" v-html="detailInfo.cont"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="fail(detailInfo.contId)">审核不通过</el-button>
        <el-button size="small" @click="sendInTime(detailInfo.contId)">定时发布</el-button>
        <el-button type="primary" size="small" @click="sendRightNow(detailInfo.contId)">立即发布</el-button>
      </div>
    </el-dialog>

    <!-- 选择日期弹框 -->
    <el-dialog :close-on-click-modal="false" title="定时发布"  :visible.sync="dialogTime" width="400px" class="time-dialog add-dialog">
      <el-form ref="timeForm" :model="inTimeParams" size="small">
        <el-form-item label="选择定时发布的时间" class="all" prop="releaseDate" :rules="[{required: true, message: '请选择定时发布的时间', trigger: 'change' }]">
          <el-date-picker v-model="inTimeParams.releaseDate" format="yyyy-MM-dd HH:mm" :picker-options="timePickerOptions" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="请选择定时发布的时间"></el-date-picker>
          <div class="tips" v-show="inTimeParams.releaseDate">本文章将于 <span class="time">{{inTimeParams.releaseDate}}</span> 发布</div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogTime = false">取消</el-button>
        <el-button type="primary" size="small" @click="confirmSendinTime('timeForm')">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新增或编辑 -->
    <el-dialog :close-on-click-modal="false" :title="addFlag?'新增':'修改'"  :visible.sync="dialogFormVisible" width="1250px" class="add-dialog">
      <el-form ref="formAdd" :model="formAdd"  :rules="formAddRule" label-width="130px" size="small">
        <el-form-item label="内容类型" class="half" prop="artiType">
          <el-radio v-model="formAdd.artiType" @change="articleImgChange('typeChange')" v-for="(item, index) in artiTypeList" :key="index" :label="item.value" >{{item.label}}</el-radio>
        </el-form-item>
        <el-form-item :label="formAdd.artiType === '0' ? '文章标题' : '视频标题'" class="half" prop="ttl">
          <el-input v-model="formAdd.ttl" :maxlength="30" clearable show-word-limit placeholder="请输入文章标题(5-30个字)"  />
        </el-form-item>
        <el-form-item label="所属栏目" class="half" prop="printId">
          <el-select v-model="formAdd.printId" clearable placeholder="请选择所属栏目" >
            <el-option v-for="item in categoryTypeOPt" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否置顶" class="half" prop="moveFlag" v-show="formAdd.artiType === '0'">
          <el-radio v-model="formAdd.moveFlag" v-for="(item, index) in moveFlagList" :key="index" :label="item.value" >{{item.label}}</el-radio>
        </el-form-item>
        <el-form-item label="是否热点" class="half" prop="recomFlag" v-show="formAdd.artiType === '0'">
          <el-radio v-model="formAdd.recomFlag" v-for="(item, index) in moveFlagList" :key="index" :label="item.value" >{{item.label}}</el-radio>
        </el-form-item>
        <el-form-item v-show="formAdd.artiType === '0'" label="展示封面" class="upload-img" prop="picList">
          <el-radio v-model="formAdd.tempType" @change="tempTypeChange" v-for="(item, index) in tempTypeList" :key="index" :label="item.value" >{{item.label}}</el-radio>
          <y-upload-img ref="articleImg" :imgList="artImgList" accept=".jpg,.jpeg,.png" @imgChange="articleImgChange" v-show="formAdd.tempType !== '0'" :max="(formAdd.tempType === '1' || formAdd.tempType === '3') ? 1 : 3"></y-upload-img>
          <span class="tips" v-show="formAdd.tempType !== '0'">优质的封面有利于推荐，格式支持JPEG、PNG</span>
        </el-form-item>
        <el-form-item v-show="formAdd.artiType === '1'"  label="视频封面" class="upload-img" prop="picList">
          <y-upload-img ref="vedioImg" :imgList="videoImgList" :max="1" accept=".jpg,.png" @imgChange="articleImgChange"></y-upload-img>
          <span class="tips">优质的封面有利于推荐，格式支持JPEG、PNG</span>
        </el-form-item>
        <el-form-item label="所属城市" class="half" prop="cityCodg">
          <y-cascader ref="yCascaderFormAdd" @change="formAddCityChange" :data="cityList" clearable v-model="formAdd.cityCodg" placeholder="请选择所属城市" maxLevel="1" :delChildren="true" :settings="{'checkStrictly': false,'level': 'admdvsLv','value':'regnCode','label':'regnName'}" />
        </el-form-item>
        <el-form-item label="内容标签" class="half" size="small" prop="tagNameArr">
          <el-tag :key="tag" v-for="tag in formAdd.tagNameArr" closable type="warning" size="small" :disable-transitions="false" @close="handleClose(tag)" >
            {{ tag }}
          </el-tag>
          <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm"></el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput" >+ 新标签</el-button>
        </el-form-item>
        <el-form-item label="文章语音" class="half" prop="voiceFlag" v-show="formAdd.artiType === '0'">
          <el-radio v-model="formAdd.voiceFlag" @change="$refs.formAdd.clearValidate('voiceFlag')" v-for="(item, index) in voiceFlagList" :key="index" :label="item.value" >{{item.label}}</el-radio>
          <y-upload-file deleteTips="删除后不可恢复，是否删除？" ref="audioFile" :max="1" @fileChange="$refs.formAdd.validateField('voiceFlag')" :fileList="audioFileList" v-show="formAdd.voiceFlag === '1'" tips="" accept=".mp3"></y-upload-file>
        </el-form-item>
        <el-form-item label="视频文件" class="half" prop="mediaUrl" v-show="formAdd.artiType === '1'">
          <y-upload-file deleteTips="删除后不可恢复，是否删除？" ref="vedioFile" :max="1" tips="" accept=".mp4"></y-upload-file>
        </el-form-item>
        <el-form-item label="文章内容" prop="cont" :rules="formAdd.artiType === '0' ? [{ required: true, message: '正文内容不能为空', trigger: 'blur'}, { validator: handleJudgeCont, trigger: 'blur'}] : []" v-show="formAdd.artiType === '0'">
          <vue-editor @image-added="handleImageAdded" useCustomImageHandler v-model="formAdd.cont"></vue-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="saveContent('formAdd')">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {commonApi, operationApi} from "@api"
import YCascader from "@/components/y-cascader/index"
import YUploadImg from "@components/y-upload-img"
import YUploadFile from "@components/y-upload-file"
import {convertUrlToBase64, fileToBase64} from "@/utils/downloadImg"
const chkStasList = [
  {
    label: "待提交",
    value: "0"
  },
  {
    label: "待审核",
    value: "1"
  },
  {
    label: "审核通过，待发布",
    value: "2"
  },
  {
    label: "审核不通过",
    value: "-1"
  },
  {
    label: "已发布",
    value: "3"
  }
]
const artiTypeList = [
  {
    label: "音频（文章）",
    value: "0"
  },
  {
    label: "视频",
    value: "1"
  }
]
const moveFlagList = [
  {
    label: "是",
    value: "1"
  },
  {
    label: "否",
    value: "0"
  }
]
const voiceFlagList = [
  {
    label: "文字转语音",
    value: "0"
  },
  {
    label: "录制",
    value: "1"
  }
]

const tempTypeList = [
  {
    label: "无封面",
    value: "0"
  },
  {
    label: "单图",
    value: "1"
  },
  {
    label: "三图",
    value: "2"
  }
]

export default {
  name: "cmsInterestManage",
  components: {
    YCascader,
    YUploadImg,
    YUploadFile
  },
  data(){
    const judgeTtl = (rule, value, callback) => {
      if ((/[\u4E00-\u9FA5]{1,}/g).test(value)) {
        return callback()
      } else {
        return callback(new Error("标题输入格式不正确，不能输入全英文/外文或特殊字符"))
      }
    }

    const handleJudgepicList = (rule, value, callback) => {
      if (this.formAdd.artiType === "0") { //展示封面
        if (this.formAdd.tempType === "0") {
          return callback()
        } else {
          if (this.formAdd.picList.length === 0) {
            return callback(new Error("请上传展示封面"))
          } else {
            if (this.formAdd.tempType === "2" && this.formAdd.picList.length !== 3) {
              return callback(new Error("请上传三张展示封面！"))
            }
            return callback()
          }
        }
      } else { //视频封面
        if (this.formAdd.picList.length === 0) {
          return callback(new Error("请上传视频封面"))
        } else {
          return callback()
        }
      }
    }
    const handleJudgeVoice = (rule, value, callback) => {
      const audioFileList = this.$refs.audioFile.getFileList()
      if (this.formAdd.artiType === "0" && value === "1" && audioFileList.length === 0) {
        return callback(new Error("请上传录音文件"))
      }
      callback()
    }

    const handleJudgemediaUrl = (rule, value, callback) => {
      const vedioFileList = this.$refs.vedioFile.getFileList()
      if (this.formAdd.artiType === "1" && vedioFileList.length === 0) {
        return callback(new Error("请上传视频文件"))
      }
      callback()
    }

    const handleJudgeCont = (rule, value, callback) => {
      if ((/[\u4E00-\u9FA5]{1,}/g).test(value)) {
        return callback()
      } else {
        return callback(new Error("正文至少输入1个汉字"))
      }
    }
    return {
      handleJudgeCont,
      cityList: [], //地区列表
      categoryTypeOPt: [], //栏目列表
      time: null, //搜索框时间
      city: null, //搜索城市
      formSearch: {
        printId: "", //专栏id
        startTime: "", //开始时间
        endTime: "", //结束时间
        ttl: "", //标题
        pageNum: 1,
        pageSize: 10
      },
      list: [], //表格数据
      total: 0, //表格数据总数
      //日期限制
      pickerOptions: {
        disabledDate: time => {
          return time.getTime() > Date.now()
        }
      },
      //审核状态字典数据
      chkStasList,
      dialogExamine: false, //审核弹框
      detailInfo: {
        contId: "", //内容id
        ttl: "", //标题
        artiType: "", //“0”：音频（文章）“1”：”视频”
        mediaUrl: "", //音频或视频url
        cont: "" //展示内容
      },
      inTimeParams: { //定时发布
        contId: "", //文章id
        releaseDate: "", //定时发布时间
        account: this.$store.getters.uact,
        accountId: this.$store.getters.id
      },
      dialogTime: false, //定时发布弹框显示
      timePickerOptions: { //时间选择限制
        disabledDate: time => {
          return time.getTime() < Date.now()
        }
      },
      artiTypeList, //文章类型
      moveFlagList, //置顶 非置顶  热点  非热点
      voiceFlagList,
      formAdd: {
        contId: "", //文章id
        artiType: "0", //“0”：音频（文章），“1”：视频
        ttl: "", //标题
        subTtl: "", //副标题
        printId: "", //栏目id
        moveFlag: "1", //置顶标志 （‘0’：非置顶 ‘1’：置顶）
        recomFlag: "1", //热点标志（“0”：非热点，”1”:热点）
        voiceFlag: "0", //只有在文章中才对这个字段赋值“0”：文字转语音，“1”：录制
        tempType: "0", //模板类型（“0”：文章无图，“1”：文章一张图，“2”：文章三张图，“3”：视频截图）
        region: "全国", //所属地市
        cityCodg: "000000", //城市编码
        tagNameArr: [], //标签
        cont: "", //文章内容
        picList: [], //封面列表
        mediaUrl: "", //视频/音频链接
  
        contTypeName: "随便", //内容类型名称（可随意传一个)
        account: this.$store.getters.uact, //用户账号
        accountId: this.$store.getters.id //用户id
      },
      copyFormAdd: {}, //复制初始form
      formAddRule: {
        ttl: [
          { required: true, message: "标题不能为空", trigger: "blur" },
          { min: 5, max: 30, message: "标题长度应该在5-30字之间", trigger: "blur" },
          { validator: judgeTtl, trigger: "blur" }
        ],
        printId: [{ required: true, message: "请选择所属栏目", trigger: "change" }],
        cityCodg: [{ required: true, message: "请选择城市", trigger: "change" }],
        picList: [{ required: true, validator: handleJudgepicList, trigger: "change" }],
        tagNameArr: [{ required: true, message: "请添加内容标签", trigger: "change" }],
        voiceFlag: [{required: true, validator: handleJudgeVoice, trigger: "change" }],
        mediaUrl: [{required: true, validator: handleJudgemediaUrl, trigger: "change" }]
      },
      artImgList: [], //点击编辑后的图片列表展示
      videoImgList: [], //视频封面
      audioFileList: [], //录音文件列表
      videoFileList: [], //视频文件列表
      addFlag: false, //是否新增
      tempTypeList, //模板类型（“0”：文章无图，“1”：文章一张图，“2”：文章三张图，“3”：视频截图）

      listLoading: false,
      
      dialogFormVisible: false,

      inputVisible: false, //内容标签相关
      inputValue: "" //内容标签相关
    }
  },
  filters: {
    chkStasFilter(val) {
      const item = chkStasList.find(item => { return item.value === val })

      return item&&item.label || ""
    }
  },
  watch: {
    //审核弹框
    dialogExamine(val) {
      if (!val) { //如果关闭弹框  关闭音乐或者视频
        this.detailInfo = {
          contId: "", //内容id
          ttl: "", //标题
          artiType: "", //“0”：音频（文章）“1”：”视频”
          mediaUrl: "", //音频或视频url
          cont: "" //展示内容
        }
      }
    },
    //日期选择弹框
    dialogTime(val) {
      if (!val) {
        this.inTimeParams.contId = ""
        this.inTimeParams.releaseDate = ""
      }
      this.$nextTick(() => {
        this.$refs.timeForm.clearValidate()
      })
    },
    //新增或编辑弹框
    dialogFormVisible(val){
      if (!val){
        this.artImgList = [] //点击编辑后的图片列表展示
        this.videoImgList = [] //视频封面
        this.audioFileList = [] //录音文件列表
        this.videoFileList = [], //视频文件列表
        this.formAdd = JSON.parse(JSON.stringify(this.copyFormAdd))
      }
      this.$nextTick(() => {
        this.$refs.formAdd.clearValidate()
      })
    }
  },
  created(){
    //复制初始formadd数据
    this.copyFormAdd = JSON.parse(JSON.stringify(this.formAdd))
    //获取城市列表
    this.getRegnAreaTree()

    //获取专栏列表
    this.selectCmsColByDTO()

    //获取数据
    this.handleSearch()
  },
  methods: {
    /**
     * @description: 将文件转化为base64
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    fileToBase64String(file) {
      return new Promise((resolve, reject) => {
        if (file&&file.length > 0&&file[0].raw) {
          const item = file[0]
          const nameArray = item.name.split(".")
          const suffix = nameArray[nameArray.length - 1]
          const params = {
            file: item.raw,
            fileExt: suffix,
            fileName: item.name.replace("." + suffix, "")
          }
          const formData = new FormData()
          for (const key in params) {
            formData.append(key, params[key])
          }
          operationApi.singleFileUpload(formData, {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout: 120000
          }).then(data => {
            resolve(data.data.absoluteUrl)
          }).catch(err => {
            reject(err)
          })
        } else {
          resolve("")
        }
      })
    },  
    /**
     * @description: 文章封面改变事件
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    async articleImgChange(type){
      //文章类型转到视频 或者 视频 转到 文章
      if (type && type === "typeChange") {
        this.formAdd.base64String = ""
        this.formAdd.fileName = ""
        this.formAdd.fileExt = ""
      }
      const files = this.formAdd.artiType === "0" ? this.$refs.articleImg.getImgList() : this.$refs.vedioImg.getImgList()
      const arr = []
      for (let i = 0; i < files.length; i++) {
        const item = files[i]
        let base64
        if (item.raw) {
          base64 = await fileToBase64(item.raw)
        } else if (item.url) {
          base64 = await convertUrlToBase64(item.url)
        }
        
        const nameArray = item.name.split(".")
        const suffix = nameArray[nameArray.length - 1]
        const obj = {
          base64String: base64.split(";base64,")[1],
          imageName: item.name.replace("." + suffix, ""),
          imageExt: suffix,
          srt: i + 1
        }
        arr.push(obj)
      }
      this.formAdd.picList = arr
      this.$nextTick(() => {
        //封面的校验
        this.$refs.formAdd.validateField("picList")
      })
    },
    /**
     * @description: 封面 类型 改变事件
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    tempTypeChange(val) {
      const length = this.$refs.articleImg.getImgList().length
      if (val === "1" && length > 0) {
        this.$refs.articleImg.$refs.uploadImg.uploadFiles = [this.$refs.articleImg.getImgList()[0]]
        this.$refs.articleImg.imgChange()
      } else {
        this.$nextTick(() => {
          //封面的校验
          this.$refs.formAdd.clearValidate("picList")
        })
      }
    },
    /**
     * @description: 新增或编辑弹框  城市改变事件
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    formAddCityChange(val){
      if (!val) {
        this.formAdd.region = ""
      } else {
        const dataMap = this.$refs.yCascaderArea.getDataMap()
        const value = dataMap[val]
        this.formAdd.region = value.regnName
      }
    },
    /**
     * @description: 提交审核
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    submitExamine(contId) {
      var _this = this
      _this.$confirm("是否确认提交审核？", "提示", {
        confirmButtonText: "确定",
        customClass: "icon",
        type: "warning",
        callback: action => {
          if (action === "confirm"){  
            const params = {
              contId,
              account: _this.$store.getters.uact,
              accountId: _this.$store.getters.id
            }
            operationApi.updateContToAudit(params).then(data => {
              _this.$message.success("提交审核成功")
              _this.handleSearch()
            })
          }
        }
      })
    },
    /**
     * @description: 审核不通过
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    fail(contId) {
      var _this = this
      _this.$confirm("是否确认审核不通过？", "提示", {
        confirmButtonText: "确定",
        customClass: "icon",
        type: "warning",
        callback: action => {
          if (action === "confirm"){
            const params = {
              contId,
              account: _this.$store.getters.uact,
              accountId: _this.$store.getters.id
            }
            operationApi.updateContAuditNoPass(params).then(data => {
              _this.$message.success("审核不通过成功")
              _this.dialogExamine = false
              _this.handleSearch()
            })
          }
        }
      })
    },
    /**
     * @description: 确认定时发布
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    confirmSendinTime(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          operationApi.updateRegRelease(this.inTimeParams).then(data => {
            this.$message.success("定时发布成功，文章将于" + this.inTimeParams.releaseDate + "发布！")
            this.dialogTime = false
            this.dialogExamine = false
            this.handleSearch()
          })
        }
      })
    },
    /**
     * @description: 定时发布
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    sendInTime(contId) {
      this.inTimeParams.contId = contId
      this.dialogTime = true
    },
    /**
     * @description: 立即发布
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    sendRightNow(contId) {
      const params = {
        contId,
        account: this.$store.getters.uact,
        accountId: this.$store.getters.id
      }
      operationApi.updateImmediaAuditPass(params).then(data => {
        console.log("🚀 ~ file: index.vue ~ line 332 ~ operationApi.insertOrUpdateCmsCont ~ data", data)
        this.$message.success("发布成功")
        this.dialogExamine = false
        this.handleSearch()
      })
    },
    /**
     * @description: 审核弹框
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    examine(data) {
      for (const key in this.detailInfo) {
        this.detailInfo[key] = data[key]
      }
      this.dialogExamine = true
    },
    /**
     * @description: 搜索城市改变
     * @param {*}
     * @return {*}
     * @author: syx
     */    
    cityChange(val) {
      if (!val) {
        this.formSearch.region = ""
      } else {
        const dataMap = this.$refs.yCascaderArea.getDataMap()
        const value = dataMap[val]
        this.formSearch.region = value.regnName
      }
      this.handleSearch()
    },
    /**
     * @description: 搜索日期改变事件
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    dateChange(val) {
      this.formSearch.startTime = val&&val[0] || ""
      this.formSearch.endTime = val&&val[1] || ""
      this.handleSearch()
    },
    /**
     * @description: 删除内容
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    handleDelete(id){
      const params = {
        key: id,
        account: this.$store.getters.uact,
        accountId: this.$store.getters.id
      }
      this.$alert("是否确认删除", "提示", {
        confirmButtonText: "确定",
        customClass: "icon",
        type: "warning",
        callback: action => {
          if (action === "confirm"){
            //谨慎操作
            operationApi.deleteCmsCont(params).then(data => {
              this.$message.success("删除专题内容成功")
              this.handleSearch()
            })
          }
        }
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
     * @description: 获取数据
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    fetchData() {
      this.listLoading = true
      operationApi.selectCmsContByDTO(this.formSearch).then(data => {
        this.listLoading = false
        if (data.data){
          this.list = data.data.list || []
          this.total = data.data.total || 0
        } else {
          this.list = []
          this.total = 0
        }
      }).catch(err => {
        this.listLoading = false
        this.list = []
        this.total = 0
      })
    },
    /**
     * @description: 标签删除
     * @param {*} tag
     * @return {*}
     * @author: camus
     */
    handleClose(tag) {
      this.formAdd.tagNameArr.splice(this.formAdd.tagNameArr.indexOf(tag), 1)
      this.$refs.formAdd.validateField("tagNameArr")
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
        this.$refs.formAdd.validateField("tagNameArr")
      } else if (inputValue === "") {
        this.inputVisible = false
        this.inputValue = ""
      } else {
        this.$message.warning("请填入不同标签")
      }
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
     * @description: 专栏信息获取
     * @param {type}
     * @return {type}
     * @author: camus
     */
    async selectCmsColByDTO() {
      const { data } = await operationApi.selectCmsColByDTO(this.formSearch)
      this.categoryTypeOPt = data.list.map((item) => {
        return {
          label: item.colName,
          value: item.colId
        }
      })
    },

    /**
     * @description: 重置搜索
     * @param {type} 
     * @return {type} 
     * @author: syx
     */    
    onReset(formName) {
      this.formSearch.regnCode = ""
      this.$refs[formName].resetFields()
      this.handleSearch()
    },
    /**
     * @description: 富文本编辑器图片上传
     * @param {type}
     * @return {type}
     * @author: cdh
     */
    async handleImageAdded(file, Editor, cursorLocation, resetUploader) {
      const mineType = ["image/jpeg", "image/png"]
      if (!mineType.includes(file.type)) {
        this.$message.error("请选择 jpeg、png格式图片上传")
        return false
      }
      const lt10M = file.size / 1024 / 1024 < 10
      if (!lt10M) {
        this.$message.error("请选择小于10M图片")
        return false
      }
      /* 转base64 */
      const base64String = await this.fileToBase64(file)
      const { name: fileName } = file
      const imageExt = fileName.substring(
        fileName.lastIndexOf(".") + 1,
        fileName.length
      )
      const { absoluteUrl } = await this._uploadBase64(base64String, imageExt)
      if (absoluteUrl) {
        Editor.insertEmbed(cursorLocation, "image", absoluteUrl)
        resetUploader()
      }
    },
    fileToBase64(file) {
      return new Promise(resolve => {
        const fd = new FileReader()
        fd.readAsDataURL(file)
        fd.onloadend = e => {
          const base64Str = e.target.result.replace(
            /^data:image\/\w+;base64,/,
            ""
          )
          resolve(base64Str)
        }
      })
    },
    /**
     * @description: 上传图片Base64
     * @param {type}
     * @return {type}
     * @author: cdh
     */
    async _uploadBase64(base64, fileExt) {
      const { data } = await operationApi.uploadImage({
        base64String: base64,
        imageExt: fileExt
      })
      return data
    },
    
    /**
     * @description: 展示弹框
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    async addOrEdit(data = {}){
      this.addFlag = !data.contId
      if (data.contId){
        const whiteKeyList = ["picList", "fileExt", "account", "accountId", "fileName", "base64String"]
        for (const key in this.formAdd) {
          if (whiteKeyList.includes(key)) {
            continue
          }
          this.formAdd[key] = data[key] || ""
        }
        //标签没值时 需要返回 数组
        this.formAdd.tagNameArr = this.formAdd.tagNameArr || []
        
        if (data.mediaUrl) {
          //录音文件 或者 视频文件
          const mediaNameArr = data.mediaUrl&&data.mediaUrl.split("/")
          const mediaName = mediaNameArr[mediaNameArr.length - 1]
          const medialist = [{
            name: mediaName,
            url: data.mediaUrl
          }]
          //显示录音文件或者视频文件
          if (data.artiType === "0" && data.voiceFlag === "1") {
            this.audioFileList = medialist
          } else if (data.artiType === "1") {
            this.videoFileList = medialist
          }
        }
    
        //显示图片
        const list = data.imgs.map(item => {
          const nameArr = item.split("/")
          const name = nameArr[nameArr.length - 1]
          return {
            name,
            url: item
          }
        })
        if (data.artiType === "0") { //文章封面
          this.artImgList = list
        } else { //视频封面
          this.videoImgList = list
        }
        //渲染 formAdd.picList
        this.$nextTick(() => {
          this.articleImgChange()
        })
      }
      this.dialogFormVisible = true
    },
    /**
     * @description: 新增或者编辑
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    saveContent(formName){

      this.$refs[formName].validate(async(valid) => {
        if (valid){

          if (!(this.formAdd.voiceFlag === "0" && this.formAdd.artiType === "0")) { //非文章类型且非文字转语音 是 上传 文件
            const files = this.formAdd.artiType === "0" ? this.$refs.audioFile.getFileList() : this.$refs.vedioFile.getFileList()
            //渲染base64String
            const mediaUrl = await this.fileToBase64String(files)
            console.log("🚀 ~ file: index.vue ~ line 953 ~ this.$refs[formName].validate ~ mediaUrl", mediaUrl)
            this.formAdd.mediaUrl = mediaUrl
          }
          
          this.formAdd.tempType = this.formAdd.artiType === "1" ? "3" : this.formAdd.tempType //模板类型（“0”：文章无图，“1”：文章一张图，“2”：文章三张图，“3”：视频截图
          if (this.formAdd.tempType === "0") {
            this.formAdd.picList = []
          }
          this.formAdd.subTtl = this.formAdd.ttl
          const msg = !this.addFlag ? "编辑成功" : "新增成功"
          console.log(JSON.stringify(this.formAdd))
          operationApi.insertOrUpdateCmsCont(this.formAdd).then(data => {
            this.$message.success(msg)
            this.dialogFormVisible = false
            this.handleSearch()
          })
        }
      })
    },
    /**
     * @description: 获取所有地区
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getRegnAreaTree(){
      this.selectmenuList = []
      commonApi.getRegnAreaTree().then(data => {
        const cityList = data.data
        cityList.unshift({
          admdvsLv: "0",
          children: [],
          regnCode: "000000",
          regnName: "全国"
        })
        this.cityList = cityList
      })
    },
 
    /**
     * @description: 点击编辑
     * @param {type}
     * @return {type}
     * @author: syx
     */
    handleEdit(info){
      this.dialogFormVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.page-interest{
  padding-top: 0;
  ::v-deep .el-tabs__item{
    padding: 0 20px !important;
  }
  .content{
    height: 706px;
    padding: 0;
    margin: 0;
    margin-top: 16px;
    overflow: hidden;
    position: relative;
    .left{
      position: absolute;
      width: 250px;
      height:100%;
      top: 0;
      left: 0;
    }
    .right{
      height:100%;
      margin-left: 266px;
      .search-field{
        width: 33.33%;
      }
      .table-wrap{
        height: 580px;
      }
    }
  }
  .half{
    width: 50%;
  }

  .upload-img {
    .el-form-item__content {
      .box{
        height: 148px;
      }
      .tips{
        // color: #f56c6c;
      }
    }
  }

  ::v-deep.el-tag {
    margin-right: 10px;
  }
  ::v-deep .button-new-tag {
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
    border-radius: 4px;
  }
  ::v-deep .input-new-tag {
    width: 90px;
    vertical-align: bottom;
  }

  .examine-dialog{
    ::v-deep .el-dialog{
      margin-top: 10vh !important;
      .mobiel {
        width: 375px;
        height: 667px;
        margin: 0 auto;
        border: 1px solid #eee;
        overflow-y: auto;
        .title{
          padding: 12px 20px;
          font-size: 20px;
          font-weight: bold;
          line-height: 24px;
        }
        .edit-box {
          width: 100%;
          padding: 0 20px;
          margin-top: 12px;
          img {
            width: 100%;
            max-width: 100%; 
            height: auto;
          }
        }
      }
    }
  }

  .time-dialog{
    ::v-deep .el-dialog{
      // margin-top: 50% !important;
      .el-form{
        height: 100px;
        min-height: unset;
        .el-form-item__content{
          .el-date-editor{
            width: 100%;
          }
        }
        .tips{
          font-size: 14px;
          color: #999;
          .time{
            color: #333;
          }
        }
      }
    }
  }
}
</style>
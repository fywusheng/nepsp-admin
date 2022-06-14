<template>
    <div class="operate-content-modal">
        <el-dialog :title="title" :visible.sync="visible" class="dialog-wrapper-md">
            <el-form :model="opInfo" size="small" label-width="180px" v-loading="loading">

                <el-form-item label="内容名称" required>
                    <el-input v-model="opInfo.name"></el-input>
                </el-form-item>

                <el-form-item label="选择运营位" required>
                    <el-input v-if="!isEdit" v-model="operatePosName" readonly class="modal-trigger"
                              @click.native="chooseOperatePos">
                        <template slot="append">
                            <el-button icon="search">选择</el-button>
                        </template>
                    </el-input>
                    <p v-else>{{operatePosName}}</p>
                </el-form-item>

                <el-form-item label="排序" required>
                    <el-input v-model="opInfo.weight"></el-input>
                </el-form-item>

                <template v-if="opInfo.resource_type == positionTypes.IMAGE">
                    <el-form-item label="选择图片" required>
                        <yl-upload v-if="visible" list-type="picture"
                                   :on-success="handleUploaded" :before-upload="beforeUpload" class="pic-uploader"
                                   :show-file-list="false">
                            <img v-if="opInfo.image_url" :src="opInfo.image_url" class="upload-pic"/>
                            <i v-else class="el-icon-plus pic-uploader-icon"></i>
                        </yl-upload>
                    </el-form-item>

                    <el-form-item label="文案">
                        <el-input v-model="opInfo.text"></el-input>
                    </el-form-item>

                    <el-form-item label="图片链接">
                        <div>
                            <el-button icon="edit" @click="genLinkDialogVisible = true">选择</el-button>
                            <el-button icon="delete2" @click="onClearTopicLink()">清空</el-button>
                        </div>

                        <gen-link-config :editable="!topicLinkFormatted.oldOperationWarning"
                                         :link="topicLinkFormatted || {}" @change="onSelectLink"></gen-link-config>
                    </el-form-item>

                </template>

                <template v-if="opInfo.resource_type == positionTypes.IMAGE_LIST">
                    <el-form-item label="选择图片" required>
                        <yl-upload v-if="visible" list-type="picture"
                                   :on-success="handleUploaded" :before-upload="beforeUpload" class="pic-uploader"
                                   :show-file-list="false">
                            <img v-if="opInfo.image_url" :src="opInfo.image_url" class="upload-pic"/>
                            <i v-else class="el-icon-plus pic-uploader-icon"></i>
                        </yl-upload>
                    </el-form-item>
                  <el-form-item label="文案">
                    <el-input v-model="opInfo.text"></el-input>
                  </el-form-item>
                    <el-form-item label="图片链接">
                        <div class="mb-10">
                            <el-button icon="edit" @click="genLinkDialogVisible = true">选择</el-button>
                            <el-button icon="delete2" @click="onClearTopicLink()">清空</el-button>
                        </div>

                        <gen-link-config :editable="!topicLinkFormatted.oldOperationWarning"
                                         :link="topicLinkFormatted || {}" @change="onSelectLink"></gen-link-config>
                    </el-form-item>
                </template>

                <template v-if="opInfo.resource_type == positionTypes.NEW_TOPIC">

                    <el-form-item label="专题链接">
                        <div>
                            <el-button icon="edit" @click="genLinkDialogVisible = true">选择</el-button>
                            <el-button icon="delete2" @click="onClearTopicLink()">清空</el-button>
                        </div>

                        <gen-link-config :editable="!topicLinkFormatted.oldOperationWarning"
                                         :link="topicLinkFormatted || {}" @change="onSelectLink"></gen-link-config>
                    </el-form-item>
                </template>

                <el-form-item label="类型" required v-if="opInfo.resource_type">
                    <p>{{opInfo.resource_type | typeText}}</p>
                </el-form-item>

                <!--<el-form-item class="flex" label="开始-结束时间" required>-->
                <!--<el-date-picker format="yyyy-MM-dd HH:mm:ss" type="datetime" v-model="opInfo.start_time"-->
                <!--@change="dateChange($event, 'start_time')"></el-date-picker>-->
                <!--<span class="ml-10 mr-10">至</span>-->
                <!--<el-date-picker format="yyyy-MM-dd HH:mm:ss" type="datetime" v-model="opInfo.end_time"-->
                <!--@change="dateChange($event, 'end_time')"></el-date-picker>-->
                <!--</el-form-item>-->
                <el-form-item label="状态" required>
                    <el-radio v-model="opInfo.status" name="status" :label="1">激活</el-radio>
                    <el-radio v-model="opInfo.status" name="status" :label="0">未激活</el-radio>
                </el-form-item>

                <el-form-item label="备注">
                    <el-input type="textarea" :rows="3" v-model="opInfo.remark"></el-input>
                </el-form-item>

            </el-form>
            <div class="dialog-footer" slot="footer">
                <el-button type="primary" @click="save">确定</el-button>
                <el-button @click="show(false)">取消</el-button>
            </div>
        </el-dialog>

        <el-dialog title="选择" :visible.sync="genLinkDialogVisible">
            <gen-link v-if="genLinkDialogVisible" @select="onSelectLink" :tabs="genLinkTabs"></gen-link>
        </el-dialog>
    </div>
</template>

<script>
import {
  newOperateCon,
  deepClone,
  positionTypes
} from "./operateData"
import operateMixin from "./operateMixin"
import Bus from "@/utils/eventbus"
import operationContentApi from "@/api/pop/operationContent"
import operationApi from "@/api/pop/operation"
import genLinkConfig from "@/components/gen-link/config"
import _ from "lodash"

export default {
  name: "OperateContentModal",
  mixins: [operateMixin],
  props: ["operateId"],
  data() {
    return {
      loading: false,
      selected_character: [],
      visible: false,
      opInfo: deepClone(newOperateCon),
      count: 0,
      protocols: [],
      protocolParams: [],
      imgOperatePos: {
        img_width: "",
        img_height: ""
      },
      isAllClients: false,
      genLinkDialogVisible: false,
      topicLinkFormatted: "",
      positionTypes,
      sending: false
    }
  },
  computed: {
    isEdit() {
      return !!this.operateId
    },
    title() {
      const action = this.isEdit ? "编辑" : "录入"
      return `${action}运营内容`
    },
    operatePosName() {
      return this.opInfo.resource_id ? `${this.opInfo.resource_name}` : ""
    },
    genLinkTabs() {
      return ({
        // 新专题
        [positionTypes.NEW_TOPIC]: [
          {label: "专题", value: "topic"}
        ]
      })[this.opInfo.resource_type]
    }
  },
  methods: {
    show(isShow) {
      this.visible = isShow
    },
    chooseOperatePos() {
      this.$emit("choose-operate-pos")
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.warning("上传图片大小不能超过1M~")
      }
      return isLt1M
    },
    handleUploaded(res) {
      this.opInfo.image_url = res.data.absoluteUrl
    },
    checkEmpty(field, tips) {
      if (!this.opInfo[field]) {
        throw new Error(tips)
      }
    },
    validateForm() {
      try {
        this.checkEmpty("name", "请输入运营位内容名称")
        this.checkEmpty("resource_id", "请选择运营位")
        this.checkEmpty("weight", "请选择排序权重")
        this.checkEmpty("resource_type", "请选择类型")
        // this.checkEmpty('start_time', '请选择开始时间');
        // this.checkEmpty('end_time', '请选择结束时间');
      } catch (err) {
        this.$message.warning(err.message)
        return
      }

      const type = this.opInfo.resource_type - 0

      try {
        switch (type) {
        case positionTypes.IMAGE:
          this.checkEmpty("image_url", "请上传图片")
          // this.checkEmpty('text', '请填写文案');
          // this.checkEmpty('forward_code', '请选择伪协议');
          break
        case positionTypes.GOODS:
          this.checkEmpty("item_group_id", "请选择商品组")
          break
        case positionTypes.IMAGE_LIST:
          // this.checkEmpty('topic_id', '请选择专题');
          this.checkEmpty("image_url", "请上传图片")
          break
        case positionTypes.COUPON:
          this.checkEmpty("topic_link", "请选择优惠券")
          break
        }
      } catch (error) {
        this.$message.warning(error.message)
        return
      }

      return true
    },
    async save() {
      if (!this.validateForm()) {
        return
      }

      const data = Object.assign(this.opInfo)
      data.forward_code = data.forward_code || "URL"
      data.weight = data.weight - 0
      this.sending = true
      const {data: result} = await operationContentApi[this.isEdit ? "update" : "add"](data)
      this.sending = false
      if (result.code === 200) {
        this.$emit("reload-table")
        this.show(false)
        this.$message.success(this.isEdit ? "修改成功" : "录入成功")
      } else {
        this.$message.error(result.msg)
      }
      // this.axios.post(getApi('/resource/save_data.do'), getPostData()).then(HP.successHandler(data => {
      //     // reloadTable
      //     this.$emit('reload-table');
      //     this.show(false);
      // }, this.isEdit ? '修改成功' : '录入成功'));

    },
    async autoFillOperatePos(id) {
      const {data: result} = await operationApi.get(id)
      if (result.code === 200) {
        Bus.$emit("select-operate-pos", result.data)
      } else {
        this.$message.error(result.msg)
      }
    },
    async onSelectLink(link) {
      this.genLinkDialogVisible = false
      this.opInfo.topic_link = _.chain(link).cloneDeep().omit("meta").value()
      this.topicLinkFormatted = this.opInfo.topic_link
    },
    onClearTopicLink() {
      this.opInfo.topic_link = ""
      this.topicLinkFormatted = ""
    }
  },
  components: {
    genLinkConfig
  },
  watch: {
    async visible() { // 显示弹窗时，重置opInfo
      if (this.isEdit) {
        if (this.visible) {
          this.opInfo.ios_diverters = []
          this.opInfo.android_diverters = []
          this.opInfo.wap_diverters = []
          this.opInfo.miniapp_diverters = []
          this.loading = true
          const {data: result} = await operationContentApi.get(this.operateId)
          this.loading = false
          if (result.code === 200) {
            this.opInfo = result.data
            this.topicLinkFormatted = this.opInfo.topic_link
          } else {
            this.$message.error(result.msg)
          }
        }
      } else { // create
        this.opInfo = deepClone(newOperateCon)
        // reset
        this.topicLinkFormatted = ""
        // 带resource_id, 则自动填充运营位输入框
        const resourceId = this.$route.query.resource_id
        if (resourceId) {
          this.autoFillOperatePos(resourceId)
        }
      }
    },
    // opInfo                : 'getProtocolParams',
    // 'opInfo.forward_code' : 'getProtocolParams',
    protocolParams: {
      deep: true,
      handler() { // 更新 upInfo.forward_param
        // WS.log('--> ', this.protocolParams);
        var query = {}
        this.protocolParams.forEach(param => {
          query[param.name] = param.value
        })
        // this.opInfo.forward_param = TT.query.stringify(query, true)
      }
    }
  },
  created() {
    Bus.$on("select-operate-pos", data => {
      this.opInfo.resource_id = data.id
      this.opInfo.resource_name = data.name
      this.opInfo.resource_type = data.type
    })
  },
  filters: {

  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .operate-content-modal {
        .el-form-item__label:after {
            content: ':';
        }

        .modal-trigger {

            .el-input__inner {
                cursor: pointer;
            }

        }

        .el-dialog__body {
            //max-height: 600px;
            overflow: auto;
        }

        .pic-uploader .el-upload {
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            width: 200px;
        }

        .pic-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
            border: 1px dashed #d9d9d9;
        }

        .upload-pic {
            display: block;
            width: 100%;
        }

        /* .upload-pic {
            max-height: 100px;
        } */

        .el-dialog__body {
            padding-right: 80px;
        }

        .params-table {
            margin-top: 10px;
        }

        .user-platform-inner {
            width: 90%;
            margin-left: 20px;

            .line {
                position: relative;
                display: flex;
                flex-flow: row nowrap;
                margin-bottom: 20px;

                .line-label {
                    width: 120px;
                    /* position: absolute;
                    top: 0;
                    left: 0; */
                }

                .line-con {
                    flex: 1;
                    display: none;
                }

                &.checked {

                    .line-con {
                        display: block;
                    }

                }

            }

            .ctrl-group {
                margin: 10px 0;

                .label {
                    display: inline-block;
                    width: 80px;
                    padding-right: 10px;
                    text-align: right;
                }

                .el-input {
                    width: 80%;
                }

            }
        }

        .article-image {
            width: auto;
            height: 120px;
        }

        .coupon-times {
            line-height: 1.5;
            color: #888;
        }

        .green {
            color: #13ce66;
        }

        .topic-id-input {
            width: 50%;
        }

        .el-dialog {
            min-width: 1200px;
        }

        .coupon-corner-tag {
            width: 200px;
        }
    }
</style>

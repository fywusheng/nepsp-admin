<template>
    <div class="topic-banner">
        <el-button @click="toAdd" class="btn-block mb-10" type="primary">上传图片</el-button>
        <el-table
                :data="list"
                size="small"
                style="width: 100%">
            <el-table-column
                    label="图片">
                <template slot-scope="scope">
                    <div class="container">
                        <div class="img"><img :src="scope.row.image"></div>
                        <div class="button-list">
                            <el-button size="small" @click="toEdit(scope.row, scope.$index)" type="primary">编辑</el-button>
                            <el-button size="small" @click="toRemove(scope.row)" type="danger">删除</el-button>
                        </div>
                    </div>
                    <div class="link-desc">{{scope.row.link | link}}</div>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog class="banner-dialog" title="添加图片" :visible.sync="addDialog">
            <yl-upload
                    class="topic-image-upload"
                    ref="upload"
                    accept="image/jpeg,image/png,image/gif"
                    :max-size="2"
                    :show-file-list="false"
                    :before-upload="() => {loading = true; return true;}"
                    :on-success="onUploadImage">
                <img v-if="dataForm.image" :src="dataForm.image" class="image">
                <i v-loading="loading" v-else class="el-icon-plus uploader-icon"></i>
            </yl-upload>
            <div class="topic-image-picker">
                链接填选项<span>({{dataForm.link | link}})</span>
            </div>
            <gen-link @select="onSetLink" :tabs="tabs"></gen-link>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="closeAddDialog">取 消</el-button>
                <el-button size="small" type="primary" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import base from "../base"
import _ from "lodash"
export default {
  extends: base,
  contentDefault: {
    list: [],
    color: "#000000"
  },
  data() {
    return {
      loading: false,
      addDialog: false,
      tabs: [
        { label: "商品组", value: "group" },
        { label: "商品", value: "item" },
        { label: "专题", value: "topic" },
        { label: "协议", value: "scheme" }
        // { label: '品牌', value: 'brand' },
        // { label: '分类', value: 'category' },
      ],
      dataForm: {
        image: "",
        link: {}
      }
    }
  },
  computed: {
    list() {
      var list = _.get(this, "content.list")
      if (list) {
        return list
      } else {
        return []
      }
    }
  },
  filters: {
    link(data) {
      if (!data.type) {
        return ""
      }
      return "已选:" + data.label + (data.id ? "," : "") + (data.id || "") + (data.desc ? "," : "") + data.desc
    }
  },
  methods: {
    closeAddDialog() {
      this.addDialog = false
    },
    toRemove(data) {
      this.list.splice(this.list.indexOf(data), 1)
    },
    toEdit(data, index) {
      this.currentData = data
      this.currentIndex = index
      this.dataForm = Object.assign({}, data)
      this.isEdit = true
      this.addDialog = true
    },
    toAdd() {
      this.isEdit = false
      this.dataForm = {
        image: "",
        link: {}
      }
      this.addDialog = true
    },
    onSetLink(link) {
      this.dataForm.link = link
    },
    async onUploadImage(res, file) {
      if (res.code != 0) {
        this.$message({
          message: `[${res.code}]${res.msg}`,
          type: "warning"
        })
        return
      }
      const image = new Image()
      image.onload = function(e) {
        this.dataForm.width = 750
        this.dataForm.height = e.target.naturalHeight/e.target.naturalWidth*750
      }.bind(this)
      image.src = res.data.absoluteUrl
      this.dataForm.image = res.data.absoluteUrl
    },
    confirm() {
      if (!this.dataForm.image) {
        this.$message.warning("请上传图片")
        return false
      }
      this.closeAddDialog()
      if (this.isEdit) {
        this.currentData = Object.assign(this.currentData, this.dataForm)
        this.list.splice(this.currentIndex, 1, this.currentData)
      } else {
        this.list.push(Object.assign({}, this.dataForm))
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .topic-banner {
        .container {
            display: flex;
            align-items: center;
            .img {
                width: 65%;
                img {
                    display: block;
                    width: 100%;
                }
            }
            .button-list {
                margin-left: 10px;
            }
        }
        // .link-desc {
        // }
        .topic-image-upload {
            .image {
                display: block;
                width: 100%;
            }
            .uploader-icon {
                width: 200px;
                height: 200px;
                line-height: 200px;
                border: 1px solid $border-base;
                font-size: 50px;
            }
        }
        .topic-image-picker {
            padding-top: 10px;
            padding-bottom: 10px;
        }
    }

</style>
<style lang="scss" rel="stylesheet/scss">
    .topic-banner {
        .banner-dialog {
            .el-dialog__body {
                padding-top: 10px;
            }
        }
    }
    .el-loading-spinner {
        top: auto!important;
        margin-top: auto!important;
    }
</style>

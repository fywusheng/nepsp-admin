<template>
    <div class="fixed-image">
        <yl-upload
                class="fixed-image-upload"
                ref="upload"
                accept="image/jpeg,image/png,image/gif"
                :max-size="5"
                :show-file-list="false"
                :before-upload="() => {loading = true; return true;}"
                :on-success="onUploadImage">

            <el-button class="btn-block" type="primary" :loading="loading">上传单图</el-button>
        </yl-upload>

        <div class="fixed-image-info">
            <div class="name">{{linkName}}</div>
            <div class="desc">{{linkDesc}}</div>
            <div class="data">{{linkData}}</div>
            <div class="del el-icon-delete" @click="onResetLink()"></div>
        </div>

        <div class="fixed-image-picker">链接填选项</div>
        <gen-link @select="onSetLink" :tabs="tabs"></gen-link>
    </div>
</template>

<script>
import base from "../base"
import _ from "lodash"
export default {
  extends: base,
  contentDefault: {
    image: "",
    link: {}
  },
  data() {
    return {
      tabs: [
        { label: "商品", value: "item" },
        { label: "优惠券", value: "coupon" },
        { label: "专题", value: "topic" },
        { label: "协议", value: "scheme" }
        // { label: '品牌', value: 'brand' },
        // { label: '分类', value: 'category' }
      ],
      loading: false
    }
  },
  computed: {
    image() {
      var url = _.get(this, "content.image")
      if (url) {
        return `url(${url})`
      } else {
        return ""
      }
    },
    linkName() {
      return this.content.link.label || "未填链接"
    },
    linkData() {
      switch (this.content.link.type) {
      case "url":
        return this.content.link.url || ""
      case "coupon":
        return this.content.link.codes || ""
      case "package":
        return this.content.link.code || ""
      default:
        return this.content.link.id || ""
      }
    },
    linkDesc() {
      if (this.content.link.type) {
        return this.content.link.desc || ""
      } else {
        return ""
      }
    }
  },
  methods: {
    onSetLink(link) {
      this.content.link = link
    },
    onResetLink() {
      this.content.link = {}
    },
    async onUploadImage(res, file) {
      this.loading = false
      if (res.code != 0) {
        this.$message({
          message: `[${res.code}]${res.msg}`,
          type: "warning"
        })
        return
      }
      this.content.image = res.data.absoluteUrl
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .fixed-image-info {
        position: relative;
        overflow: hidden;
        height: 62px;
        padding-bottom: 10px;
        margin: 5px 0;
        border: $border-base;
        font-size: 12px;

        .name {
            position: relative;
            overflow: hidden;
            height: 26px;
            padding: 0 5px;
            margin-bottom: 3px;
            font-size: 14px;
            line-height: 26px;
            border-bottom: $border-base;
        }
        .desc {
            position: relative;
            overflow: hidden;
            height: 16px;
            padding: 0 5px;
            line-height: 16px;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .data {
            position: relative;
            overflow: hidden;
            height: 16px;
            padding: 0 5px;
            line-height: 16px;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: #999;
        }
        .del {
            position: absolute;
            top: 0;
            right: 0;
            padding: 7px;
            border-left: $border-base;
            background: #fff;
            cursor: pointer;
            &:hover {
                background: $color-base-silver;
                color: #fff;
            }
        }
    }

    .fixed-image-picker {
        line-height: 40px;
        text-align: center;
        background: $color-base-gray;
        color: $border-color-hover;
    }
</style>

<style>
    .fixed-image-upload > .el-upload {
        width: 100%;
    }
</style>

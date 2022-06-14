<template>
    <div class="topic-banner">
        <el-form class="data-form"  size="small" label-width="90px" label-suffix=" : ">
            <el-form-item label="商品组标题">
                <el-input v-model="content.title"></el-input>
            </el-form-item>
        </el-form>
        <div class="topic-info">
            <div class="name">{{linkName}}</div>
            <div class="del el-icon-delete" @click="onResetLink()"></div>
            <div class="layout">
                <div class="desc" v-if="linkData">ID:{{linkData}}, 名称:{{linkDesc}}</div>
                <!--<div class="data">ID:{{linkData}}</div>-->
            </div>
        </div>
        <div class="topic-image-picker">链接填选项</div>
        <gen-link @select="onSetLink" :tabs="tabs"></gen-link>

    </div>
</template>

<script>
import base from "../base"

export default {
  extends: base,
  contentDefault: {
    title: "",
    link: {}
  },
  data() {
    return {
      loading: false,
      addDialog: false,
      tabs: [
        { label: "商品组", value: "group" }
      ]
    }
  },
  computed: {
    linkName() {
      return (this.content.link && this.content.link.label) || "未填链接"
    },
    linkData() {
      if (!this.content.link){
        return ""
      }
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
      if (!this.content.link){
        return ""
      }
      if (this.content.link.type) {
        return this.content.link.desc || ""
      } else {
        return ""
      }
    }
  },
  methods: {
    onSetLink(link) {
      console.info(link)
      this.content.link = link
    },
    onResetLink() {
      this.content.link = {}
    }
  },
  mounted() {
    //this.getList();
    if (!this.content.link){
      this.content = Object.assign(this.content, this.contentDefault)
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .topic-banner {
        .data-form {
            padding-right: 30px;
        }
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
        .link-desc {
        }
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
      @import "~@/styles/variables.scss";

    .topic-banner {
        .banner-dialog {
            .el-dialog__body {
                padding-top: 10px;
            }
        }
    }
    .topic-info {
        position: relative;
        overflow: hidden;
        min-height: 62px;
        padding-bottom: 10px;
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
        .del {
            position: absolute;
            top: 0;
            right: 0;
            padding: 0 7px;
            border-left: $border-base;
            line-height: 26px;
            background: #fff;
            cursor: pointer;
            &:hover {
                background: $color-base-silver;
                color: #fff;
            }
        }
        .layout {
            padding: 0 5px;
        }
        .desc {
            overflow: hidden;
            height: 16px;
            line-height: 16px;
        }
        .data {
            overflow: hidden;
            height: 16px;
            line-height: 16px;
            color: #999;
            margin-bottom: 5px
        }
    }
</style>

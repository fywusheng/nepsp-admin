<template>
    <div class="pingou">
        <div class="pingou-info">
            <div class="pingou-info-base">
                <yl-upload
                        ref="upload"
                        accept="image/jpeg,image/png,image/gif"
                        :max-size="5"
                        :show-file-list="false"
                        :before-upload="() => {loading = true; return true}"
                        :on-success="onUploadImage"
                        :disabled="loading">
                    <el-button icon="plus" :loading="loading">上传底图</el-button>
                </yl-upload>
                <!--<el-checkbox v-model="content.useItemCartArea" :disabled="!canUseItemCartArea">使用商品右下购物车(临时)-->
                <!--</el-checkbox>-->
                <p>总热区数：{{contentAreaLength}}</p>
            </div>
            <div class="pingou-info-selected" v-if="selectedAreaIndex !== -1">
                <div class="name">{{selectedAreaName}}</div>
                <div class="del el-icon-delete" @click="removeArea()">移除当前热区</div>
                <div class="layout">
                    <div class="desc">{{selectedAreaDesc}}</div>
                    <div class="data">{{selectedAreaData}}</div>
                    <div class="options">
                        <template v-if="selectedAreaLink.type === 'item'">
                            <label style="margin-right:10px">点击类型</label>
                            <el-radio-group v-model="selectedAreaLink.action">
                                <el-radio label="GO_DETAILS">到详情页</el-radio>
                                <!--<el-radio label="ADD_TO_CART">加购物车</el-radio>-->
                            </el-radio-group>
                        </template>
                    </div>
                </div>
            </div>
            <div class="pingou-info-selected" v-else unselected></div>
        </div>

        <div class="pingou-picker">热区填选项</div>
        <gen-link @select="onSetAreaLink" :tabs="tabs"></gen-link>
    </div>
</template>

<script>
import base from "../base"
import _ from "lodash"
export default {
  extends: base,
  contentDefault: {
    area: [],
    bg: {
      cell_height: 200,
      image: "",
      total_height: 0,
      total_width: 0
    },
    useItemCartArea: false
  },
  data() {
    return {
      tabs: [
        { label: "商品组", value: "group" },
        { label: "商品", value: "item" },
        { label: "优惠券", value: "coupon" },
        { label: "专题", value: "topic" },
        { label: "协议", value: "scheme" }
        // { label: '品牌', value: 'brand' },
        // { label: '分类', value: 'category' }
      ],
      selectedAreaIndex: -1,
      loading: false
    }
  },
  computed: {
    contentBg() {
      var url = _.get(this, "content.bg.image")
      if (url) {
        return `url(${url})`
      } else {
        return ""
      }
    },
    contentAreaLength() {
      return _.get(this, "content.area.length")
    },
    selectedArea() {
      return _.get(this, `content.area.${this.selectedAreaIndex}`, {})
    },
    selectedAreaLink() {
      return _.get(this, `content.area.${this.selectedAreaIndex}.link`, {})
    },
    selectedAreaName() {
      return (this.selectedAreaIndex + 1) + "#" + (this.selectedAreaLink.label || "")
    },
    selectedAreaData() {
      switch (this.selectedAreaLink.type) {
      case "url":
        return this.selectedAreaLink.url || ""
      case "coupon":
        return this.selectedAreaLink.codes || ""
      default:
        return this.selectedAreaLink.id || ""
      }
    },
    selectedAreaDesc() {
      if (this.selectedAreaLink.type) {
        return this.selectedAreaLink.desc || ""
      } else {
        return ""
      }
    },
    canUseItemCartArea() {
      return _.isBoolean(this.content.useItemCartArea)
    }
  },
  methods: {
    custom({ type, value }) {
      switch (type) {
      case "createArea":
        this.content.area = this.content.area.concat(value.rect.map(rect => {
          return {
            link: {
              type: "none",
              label: "",
              desc: ""
            },
            rect
          }
        }))
        this.selectedAreaIndex = this.content.area.length
        break
      case "selectArea":
        this.selectedAreaIndex = value.index
        break
      case "changeArea":
        this.content.area[ value.index ].rect = value.rect
        break
      }
    },
    removeArea() {
      this.content.area.splice(this.selectedAreaIndex, 1)
    },
    onSetAreaLink(link) {
      if (this.selectedAreaIndex !== -1) {
        this.content.area[ this.selectedAreaIndex ].link = _.omit(link, "meta")
      } else {
        this.$message({
          message: "请选择热区",
          type: "warning"
        })
      }
    },
    async onUploadImage(res, file) {
      if (res.code != 0) {
        this.$message({
          message: `[${res.code}]${res.msg}`,
          type: "warning"
        })
        this.loading = false
        return
      }
      var imageData = await new Promise(resolve => {
        var image = new Image()
        image.onload = () => resolve({
          image: image.absoluteUrl,
          total_width: 1200,
          total_height: image.height/image.width*1200,
          image_width: image.width
        })
        image.src = res.data.absoluteUrl
      })
      if (imageData.image_width < 750){
        this.$message({
          message: "上传图片宽度不能小于1200px",
          type: "warning"
        })
        return false
      }
      this.content.bg = _.merge(this.content.bg, imageData)
      this.loading = false
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .pingou-info {
        margin-bottom: 15px;

        .pingou-info-base {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
        }
        .pingou-info-selected {
            position: relative;
            overflow: hidden;
            min-height: 62px;
            padding-bottom: 10px;
            border: $border-base;
            font-size: 12px;

            &::before {
                content: 'SELECTED';
                position: absolute;
                bottom: -6px;
                right: 2px;
                font-weight: bold;
                font-size: 20px;
                line-height: 20px;
                color: #d8d8d8;
            }

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

            &[unselected]::before {
                content: none
            }
            &[unselected]::after {
                content: '未选择热区';
                display: block;
                color: $color-extra-light-silver;
                padding-top: 10px;
                font-size: 30px;
                line-height: 54px;
                text-align: center;
            }
        }
    }

    .pingou-picker {
        line-height: 40px;
        text-align: center;
        background: $color-base-gray;
        color: $border-color-hover;
    }
</style>

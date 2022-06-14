<template>
    <div class="navbar">
        <!--
            <el-upload
                ref="upload"
                accept="image/jpeg,image/png,image/gif"
                style="display:flex;flex-flow:column;margin-bottom:5px"
                :max-size="5"
                :show-file-list="false"
                :on-success="onUploadImage">

                <div class="navbar-bg" :style="{backgroundImage:image}">
                    <div v-show="!image" class="el-icon-plus"></div>
                </div>
            </el-upload>
            #4ad0b9
            -->
        <div class="line">
            <label for="">Tab类型:</label>
            <el-radio-group v-model="content.tabType">
                <el-radio label="text">纯文本</el-radio>
                <el-radio label="logo">带logo</el-radio>
            </el-radio-group>
        </div>
        <el-input v-model="content.bgcolor" placeholder="#ffffff" style="margin-bottom:5px;">
            <p slot="prepend">背景色</p>
        </el-input>
        <el-input v-model="content.color" placeholder="#000000" style="margin-bottom:5px;">
            <p slot="prepend">高亮色</p>
        </el-input>

        <div class="navbar-link">
            <p class="tips">注: 导航条tab最少设置2个, 大于4个会可横向滚动</p>
            <div class="navbar-link-title">导航条Tabs设置</div>
            <div class="navbar-link-item" v-for="(item, index) in content.area" :key="index">
                <div class="navbar-link-item-index">{{'tab' + (index + 1)}}</div>

                <div class="navbar-link-item-input">
                    <el-input v-model="content.area[index].link.text">
                        <p slot="prepend">文案</p>
                    </el-input>
                </div>

                <div class="navbar-link-item-input">
                    <el-input v-model="content.area[index].link.name" placeholder="name">
                        <p slot="prepend">锚点</p>
                    </el-input>
                </div>

                <div class="navbar-link-item-input" v-show="content.tabType === 'logo'">
                    <div class="el-input el-input-group el-input-group--prepend">
                        <div class="el-input-group__prepend"><p>图标</p></div>
                        <yl-upload
                                ref="upload"
                                accept="image/jpeg,image/png,image/gif"
                                class="icon-upload-div"
                                :style="'background-image: url(' + item.link.icon + ')'"
                                :max-size="5"
                                :show-file-list="false"
                                :on-success="onSuccess(item)">

                            <div class="navbar-tab-icon">
                                <div v-show="!item.link.icon">添加</div>
                            </div>
                        </yl-upload>
                    </div>
                </div>

                <el-button icon="el-icon-delete" @click="content.area.splice(index, 1)"></el-button>
            </div>

            <el-button class="navbar-link-add" icon="el-icon-plus" @click="addArea()">添加导航</el-button>
        </div>
    </div>
</template>

<script>
import base from "../base"
import _ from "lodash"
export default {
  extends: base,
  contentDefault: {
    image: "",
    color: "",
    bgcolor: "",
    tabType: "text",
    area: []
  },
  data() {
    return {
      selectedAreaIndex: -1
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
    }
  },
  methods: {
    addArea() {
      this.content.area.push({
        link: {
          type: "anchor",
          text: "",
          name: "",
          icon: ""
        }
      })
    },
    onSuccess(area) {
      return async(res, file) => {
        await this.onUploadImage(res, file, area)
      }
    },
    async onUploadImage(res, file, area) {
      if (res.code != 0) {
        this.$message({
          message: `[${res.code}]${res.msg}`,
          type: "warning"
        })
        return
      }
      area.link.icon = res.data.absoluteUrl
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .navbar {
        .navbar-bg {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 60px;
            border: 2px dashed $border-color-base;
            box-sizing: border-box;
            border-radius: 4px;
            color: $color-extra-light-silver;
            background: no-repeat center / contain;
        }

        .navbar-link {
            padding: 0 2px;
            border: 1px solid $color-base-gray;

            .navbar-link-title {
                margin: 0 -2px;
                line-height: 40px;
                text-align: center;
                background: $color-base-gray;
                color: $border-color-hover;
            }

            .navbar-link-item {
                display: flex;
                justify-content: space-between;
                margin: 2px 0;

                .navbar-link-item-index {
                    border: 1px solid rgb(191, 217, 215);
                    border-radius: 4px;
                    min-width: 42px;
                    line-height: 34px;
                    text-align: center;
                    color: rgb(151, 190, 190)
                }

                .navbar-link-item-input {
                    flex: 1;
                    margin: 0 2px;
                }

                // .el-button {
                // }

            }

            .navbar-link-add {
                display: block;
                width: 100%;
                margin: 2px 0;
            }
        }

        .icon-upload-div {
            height: 30px;
            line-height: 30px;
            border: 1px solid rgb(191, 217, 215);
            border-radius: 0 4px 4px 0;
            text-align: center;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center center;
        }

        .tips {
            color: #e37017;
            padding: 10px 20px;
        }

        .line {
            font-size: 13px;
            line-height: 3;

            label {
                margin-right: 5px;
            }

        }
    }
</style>

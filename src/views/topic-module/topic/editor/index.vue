<template>
    <div class="topic-editor" @click.self="selectedIndex = -1" v-loading="loading">
        <div class="topic-editor-head">
            <el-form class="pt-20" :inline="true" size="small" label-width="70px">
                <el-form-item label="页面名称">
                    <el-input v-model="core.page_name"></el-input>
                </el-form-item>
                <el-form-item label="页面标题">
                    <el-input v-model="core.page_title" placeholder="CMS专题"></el-input>
                </el-form-item>
                <el-form-item label="背景色">
                    <el-color-picker v-model="core.background"></el-color-picker>
                </el-form-item>
                <el-form-item style="margin-left: 100px;">
                    <el-button @click="$router.push('/apps/topic/list')">专题列表</el-button>
                </el-form-item>
                <el-form-item>
                    <el-dropdown @command="confirmRollback($event, $route.params.id)"
                                 v-show="core.versions && core.versions.length">
                        <el-button type="primary" style="width:80px">回滚 <i
                                class="el-icon-caret-bottom el-icon-right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="v in core.versions" :class="{active: v.active}" :command="v.mtime"
                                              :key="v.mtime">{{v.mtime | datetime}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </el-form-item>
            </el-form>

            <!--<el-form style="width:580px" size="small" label-width="70px">-->
                <!--<el-form-item label="分享">-->
                    <!--<div class="topic-editor-share">-->
                        <!--<div class="topic-editor-share-top">-->
                            <!--<el-checkbox v-model="core.share_enable">启用</el-checkbox>-->
                            <!--<el-input v-model="core.share_url" placeholder="默认本页" :disabled="!core.share_enable"><p-->
                                    <!--slot="prepend">分享链接</p></el-input>-->
                        <!--</div>-->
                        <!--<el-upload-->
                                <!--class="topic-editor-share-left"-->
                                <!--ref="upload"-->
                                <!--accept="image/jpeg,image/png,image/gif"-->
                                <!--:show-file-list="false"-->
                                <!--:on-success="res => shareIcon = res.data.url">-->

                            <!--<div class="topic-editor-share-icon" :style="{backgroundImage:`url(${shareIcon})`}"></div>-->
                        <!--</el-upload>-->
                        <!--<div class="topic-editor-share-right">-->
                            <!--<el-input v-model="core.share_title" :disabled="!core.share_enable"-->
                                      <!--placeholder="分享标题(默认页面标题)"></el-input>-->
                            <!--<el-input class="mt-10"  v-model="core.share_text" :disabled="!core.share_enable" type="textarea"-->
                                      <!--resize="none" :rows="2" placeholder="分享文案"></el-input>-->
                        <!--</div>-->
                    <!--</div>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
        </div>

        <div class="topic-editor-main" @click.self="selectedIndex = -1">
            <list-panel class="topic-editor-list"
                        ref="list"
                        @drag="onPickupComponent"
                        @click.native.self="selectedIndex = -1">
            </list-panel>

            <view-panel class="topic-editor-view"
                        ref="view"
                        :core="core"
                        :dragging="dragging"
                        :selectedIndex="selectedIndex"
                        @select="index => selectedIndex = index"
                        @drop="onDropComponent"
                        @custom="onCustomCell"
                        @click.native.self="selectedIndex = -1">
                {{core.page_title || '专题'}}
            </view-panel>

            <prop-panel class="topic-editor-prop"
                        ref="prop"
                        :key="selectedCell ? selectedCell.instance_id : 'page'"
                        :cell="selectedCell"
                        :index="selectedIndex"
                        :coreLength="core.layout && core.layout.length"
                        @remove="onRemoveCell"
                        @moveup="onMoveupCell"
                        @movedown="onMovedownCell"
                        @update-common="onUpdateCellCommon"
                        @update-content="onUpdateCellContent"
                        @click.native.self="selectedIndex = -1">
                <div class="topic-editor-prop-page" slot="page">
                    <div class="topic-editor-prop-page-buttons">
                        <el-button size="small" type="primary" @click="save()">保存</el-button>
                        <el-button size="small" @click="preview()">预览链接</el-button>
                        <el-button size="small" type="danger" @click="publish()" :loading="publishing">发布</el-button>
                        <el-button size="small" @click="onlineView()">正式链接</el-button>
                    </div>
                </div>
            </prop-panel>
        </div>

        <!--<itemgroup-modal ref="itemgroupModal" @select-itemgroup="onSelectItemgroup"></itemgroup-modal>-->
    </div>
</template>

<script>
import ShareIconDefault from "./share-icon.png"
import ListPanel from "./list-panel"
import ViewPanel from "./view-panel"
import PropPanel from "./prop-panel"
import topicApi from "@/api/pop/topic"
import _ from "lodash"
export default {
  name: "Editor",
  data() {
    return {
      loading: true,
      page: "",
      core: {},
      dragging: false,
      selectedIndex: -1,
      selectedComponent: null,
      saving: false,
      publishing: false,
      coreInit: {
        page_name: "",
        page_title: "",
        background: "",
        share_enable: true,
        share_title: "",
        share_text: "",
        share_icon: "",
        share_url: "",
        wx_header_disabled: false,
        layout: []
      }
    }
  },
  computed: {
    selectedCell() {
      return _.get(this.core, "layout." + this.selectedIndex)
    },
    shareIcon: {
      get() {
        return this.core.share_icon || ShareIconDefault
      },
      set(value) {
        this.core.share_icon = value
      }
    },
    isShowProducts: {
      get() {
        return this.core.rel_itemgroup ? !!this.core.rel_itemgroup.group_id : false
      },
      set(isShow) {
        //if (isShow) {
        //    this.showModal('itemgroupModal');
        //} else {
        //    this.core.rel_itemgroup.group_id = '';
        //    this.core.rel_itemgroup.group_name = '';
        //}
      }
    }
  },
  components: {
    listPanel: ListPanel,
    viewPanel: ViewPanel,
    propPanel: PropPanel
    //ItemgroupModal
  },
  watch: {
    async [ "$route" ]() {
      //var loading = Loading.service()
      this.core = _.merge({}, this.coreInit)
      try {
        await this.getCore()
      } catch (e) {
        console.log(e)
      }
      //loading.close()
    }
  },
  methods: {
    // 布局系列
    onPickupComponent(component) {
      this.selectedComponent = component
      this.dragging = true
      this.selectedIndex = -1
    },
    onDropComponent(index) {
      if (index !== null && index >= 0) {
        this.core.layout.splice(index, 0, this.$refs.prop.createCell(this.selectedComponent))
      }
      this.selectedComponent = null
      this.dragging = false
    },
    onRemoveCell() {
      this.core.layout.splice(this.selectedIndex, 1)
      this.selectedIndex = -1
    },
    onMoveupCell() {
      if (this.selectedIndex <= 0) { return }
      var target = this.core.layout[ this.selectedIndex ]
      var destination = this.core.layout[ this.selectedIndex - 1 ]
      this.core.layout.splice(this.selectedIndex - 1, 2, target, destination)
      this.selectedIndex--
    },
    onMovedownCell() {
      if (this.selectedIndex === -1 && this.selectedIndex >= this.core.layout.length - 1) { return }
      var target = this.core.layout[ this.selectedIndex ]
      var destination = this.core.layout[ this.selectedIndex + 1 ]
      this.core.layout.splice(this.selectedIndex, 2, destination, target)
      this.selectedIndex++
    },
    // 格子系列
    onUpdateCellContent(content) { // 配置面板组件通知本组件更新配置数据，-> 触发deep watch core 回调 -> 传递新的core给子页面
      this.selectedCell.content = content
      this.$refs.view.coreUpdate()
    },
    onUpdateCellCommon(common) {
      this.selectedCell.common = common
      this.$refs.view.coreUpdate()
    },
    onCustomCell(data) {
      this.$refs.prop.custom(data)
    },
    async getCore() {
      this.loading = true
      const {data: result} = await topicApi.get(this.$route.params.id)
      this.loading = false
      if (result.code === 200) {
        this.core = _.merge({}, this.coreInit, result.data)
      } else {
        this.$message({
          message: result.msg,
          type: "warning"
        })
      }
    },
    async save() {
      this.saving = true
      const {data: result} = await topicApi.update(this.$route.params.id, this.core)
      this.saving = false
      if (result.code === 200) {
        this.$message.success("保存成功")
      } else {
        this.$message.error(result.msg)
      }
    },
    async publish() {
      this.$confirm("确定发布该专题?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async() => {
        this.publishing = true
        const {data: result} = await topicApi.publish(this.$route.params.id)
        if (result.code === 200) {
          this.$message.success("发布成功")
        } else {
          this.$message.error(result.msg)
        }
        this.publishing = false
      })
    },
    preview() {
      console.info(this.core)
      window.open(`${process.env.VUE_APP_ASSET}/index${this.core.category === "pc" ? "-pc":"-h5"}.html?v=${Date.now()}&id=${this.$route.params.id}`)
    },
    onlineView() {
      window.open(_.get(this.core, "url", ""))
    },
    async confirmRollback(mtime, id) {
      try {
        await this.$confirm(`确认回滚到 ${mtime} ?`, "提示", { type: "info" })
      } catch (e) {
        return
      }
      const {data: result} = await topicApi.rollback(id, {
        version: mtime
      })
      if (result.code === 200) {
        this.$message.success("回滚成功")
      } else {
        this.$message.error(result.msg)
      }
    },
    onSelectItemgroup(row) {
      this.core.rel_itemgroup.group_id = row.item_group_info.id
      this.core.rel_itemgroup.group_name = row.item_group_info.name
    },
    showModal(refName) {
      this.$refs[ refName ].show(true)
    }
  },
  filters: {
    datetime(dt) {
      return dt.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, function(match, y, m, d, h, i, s) {
        return [y, m, d].join("-") + " " + [h, i, s].join(":")
      })
    }
  },
  mounted() {
    this.getCore()
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
  @import "~@/styles/variables.scss";

    .topic-editor {
        min-width: 1370px + 18px;
        height: 100%;
        padding: 15px;
        .topic-editor-head {
            display: flex;
            width: 1360px;
            margin-left: auto;
            margin-right: auto;
            padding: 5px 5px 0;
            margin-bottom: 10px;
            border: 1px solid $border-color-base;
            line-height: 36px;

            .el-form-item {
                margin-bottom: 10px
            }
        }

        .topic-editor-share {
            display: flex;
            flex-flow: wrap;

            .topic-editor-share-left {
                height: 84px;
            }
            .topic-editor-share-right {
                flex: 1;
                margin-left: 10px
            }
            .topic-editor-share-top {
                width: 100%;
                margin-bottom: 10px;
                .el-input {
                    float: right;
                    width: 403px;
                }
            }
            .topic-editor-share-icon {
                width: 95px;
                height: 95px;
                border: 1px dashed $border-color-base;
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
        }

        .topic-editor-main {
            display: flex;
            margin-left: auto;
            margin-right: auto;
            width: 1360px;
            align-items: stretch;
            min-height: 700px;
        }

        .topic-editor-list {
            position: relative;
            z-index: 1;
            overflow-x: hidden;
            overflow-y: auto;
            width: 450px;
            max-height: 800px;
            margin-right: 1px;
            border: 1px solid $border-color-base;
            box-sizing: border-box;
        }

        .topic-editor-view {
            overflow-x: hidden;
            overflow-y: auto;
            width: 450px;
            max-height: 800px;
            margin: 0 21px;
            border: 1px solid $border-color-base;
            box-sizing: border-box;
        }

        .topic-editor-prop {
            overflow-x: hidden;
            overflow-y: auto;
            width: 460px;
            max-height: 800px;
            border: 1px solid $border-color-base;
            box-sizing: border-box;

            .topic-editor-prop-page-buttons {
                display: flex;
                padding: 5px 0 5px 5px;
                border-bottom: $border-base;
                .el-button {
                    flex: 1;
                    margin-right: 5px;
                    min-width: auto;
                }
            }
        }
    }
</style>

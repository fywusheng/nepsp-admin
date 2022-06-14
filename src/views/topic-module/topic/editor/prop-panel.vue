<template>
    <div class="topic-editor-prop">
        <section class="topic-editor-prop-page">
            <div>
                <slot name="page"></slot>
            </div>
        </section>

        <template v-if="cell">
            <section class="topic-editor-prop-common">
                <div class="topic-editor-prop-title">基础属性</div>
                <div class="topic-editor-prop-body">
                    <div class="topic-editor-prop-common-header">
                        <div class="topic-editor-prop-common-header-floor">
                            <div class="topic-editor-prop-common-header-floor-index">{{index + 1}}</div>
                            <div class="topic-editor-prop-common-header-floor-title">{{cell.title}}</div>
                            <div class="topic-editor-prop-common-header-floor-name">{{cell.name}}</div>
                        </div>
                        <div class="topic-editor-prop-common-header-buttons">
                            <el-button size="small" icon="el-icon-caret-top" :disabled="index === 0"
                                       @click="onMoveup()"></el-button>
                            <el-button size="small" icon="el-icon-caret-bottom" :disabled="index === coreLength - 1"
                                       @click="onMovedown()"></el-button>
                            <el-button size="small" icon="el-icon-delete" @click="onRemove()"></el-button>
                        </div>
                    </div>
                    <div class="topic-editor-prop-common-section">
                        <el-input size="small" v-model="common.name" placeholder="默认(字母数字)">
                            <div slot="prepend">楼层名</div>
                        </el-input>
                    </div>
                </div>
            </section>

            <section class="topic-editor-prop-content">
                <div class="topic-editor-prop-title">内容属性</div>
                <div class="topic-editor-prop-body">
                    <component
                            v-if="propContentName"
                            ref="content"
                            :is="`c-${propContentName}`"
                            :value="cell.content"
                            @input="onUpdateContent">
                    </component>
                    <div v-else style="padding:50px 0;text-align:center">没启用的组件</div>
                </div>
            </section>
        </template>
    </div>
</template>

<script>
import propComponents from "../../topic-prop-components"
import _ from "lodash"
const componentList = {}
propComponents.forEach(propComponent => {
  propComponent.children.forEach(component => {
    componentList[ "c-" + component.name ] = component.component
  })
})
export default {
  props: {
    cell: Object, // 组件数据
    index: Number, // 当前选中组件的index
    coreLength: Number
  },
  data() {
    return {
      common: {
        name: ""
      }
    }
  },
  watch: {
    common: {
      deep: true,
      handler(value) {
        this.onUpdateCommon(value)
      }
    }
  },
  computed: {
    propContentName() { // 配置面板对应当前组件的content组件
      if (this.cell) {
        return _.get(this.getComponentProp(this.cell.name), "name")
      } else {
        return null
      }
    }
  },
  methods: {
    getComponentProp(name) {
      let current
      propComponents.some(propComponent => {
        return propComponent.children.some(component => {
          current = component
          return component.name === name
        })
      })
      return current
    },
    onRemove() {
      this.$emit("remove")
    },
    onMoveup() {
      this.$emit("moveup")
    },
    onMovedown() {
      this.$emit("movedown")
    },
    onUpdateCommon(common) {
      this.$emit("update-common", common)
    },
    onUpdateContent(content) {
      this.$emit("update-content", content)
    },
    // 提供给view-prop使用的custom方法, 用于更新custom数据
    custom(data) {
      _.invoke(this, "$refs.content.custom", data)
    },
    // 生成楼层
    createCell(component) {
      return {
        instance_id: `${Date.now()}${_.random(1000, 9999)}`,
        title: component.title,
        name: component.name,
        common: {
          name: ""
        },
        content: component.component.contentDefault || {}
      }
    }
  },
  mounted() {
    if (this.cell) {
      this.common = _.cloneDeep(this.cell.common)
    }
  },
  components: componentList
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .topic-editor-prop {
        .topic-editor-prop-title {
            font-size: 16px;
            line-height: 30px;
            text-align: center;
            color: #fff;
            background: $color-base-silver;
        }
        .topic-editor-prop-body {
            min-height: 20px;
            border-bottom: $border-base;
        }

        .topic-editor-prop-page {
        }

        .topic-editor-prop-common {
            .topic-editor-prop-common-header {
                display: flex;
                justify-content: space-between;
                overflow: hidden;
                height: 40px;
                padding: 5px;
                line-height: 30px;

                .topic-editor-prop-common-header-floor {
                    overflow: hidden;
                    width: 240px;
                    height: 30px;
                    margin-right: 5px;
                    white-space: nowrap;
                    text-overflow: ellipsis;

                    .topic-editor-prop-common-header-floor-index {
                        float: left;
                        height: 30px;
                        min-width: 30px;
                        margin-right: 10px;
                        border-right: $border-base;
                        font-size: 14px;
                        line-height: 30px;
                        color: #333;
                        text-align: center;
                    }
                    .topic-editor-prop-common-header-floor-title {
                        overflow: hidden;
                        height: 16px;
                        line-height: 16px;
                        font-size: 14px;
                        color: #333;
                    }
                    .topic-editor-prop-common-header-floor-name {
                        overflow: hidden;
                        height: 14px;
                        line-height: 14px;
                        font-size: 12px;
                        color: #aaa;
                    }
                }
                .topic-editor-prop-common-header-buttons {
                    display: flex;
                    button {
                        width: 30px;
                        height: 30px;
                        line-height: 30px;
                        padding: 0;
                        min-width: auto;
                        font-size: 20px;
                        font-weight: bold;
                    }
                }
            }

            .topic-editor-prop-common-section {
                padding: 5px;
                border-top: $border-base;
            }
        }

        &-content {
            .topic-editor-prop-body {
                padding: 5px;
            }
        }
    }
</style>

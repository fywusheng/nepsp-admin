<template>
    <div class="topic-editor-view">
        <div class="topic-editor-view-title">
            <el-button icon="close" size="small" class="topic-editor-view-title-left"></el-button>
            <slot></slot>
            <el-button icon="more" size="small" class="topic-editor-view-title-right"></el-button>
        </div>
        <iframe ref="topic" :src="page" :disabled="dragging"></iframe>
    </div>
</template>

<script>
import _ from "lodash"
export default {
  props: {
    core: Object,
    dragging: Boolean,
    selectedIndex: Number
  },
  data() {
    return {
      events: {
        topicInit: "onTopicInit",
        topicCellInsert: "onTopicCellInsert",
        topicCellInsertEnd: "onTopicCellInsertEnd",
        topicCellSelect: "onTopicCellSelect",
        topicCellCustom: "onTopicCellCustom"
      },
      inbox: false,
      index: null,
      page: `${process.env.VUE_APP_ASSET}/topic-pc-frame.html?v=${Date.now()}`
    }
  },
  watch: {
    dragging(value) {
      if (value) { // 监听父组件拖拽新组件
        window.addEventListener("mousemove", this.onMove)
        window.addEventListener("mouseup", this.onDrop)
        this.index = null
      }
    },
    core: { // 深度监听core的变化
      deep: true,
      handler(value) {
        this.coreUpdate()
      }
    },
    selectedIndex(value) { // 通知子页面选中组件的index
      this.$topicEmit("cellSelect", value)
    }
  },
  methods: {
    $topicEmit(type, data) { // post message to iframe
      if (!this.$refs.topic) { return }
      this.$refs.topic.contentWindow.postMessage({
        name: "topic",
        type,
        data
      }, "*")
    },
    onMessage(e) { // get message from iframe
      if (e.data.name === "topic") {
        _.invoke(this, _.get(this, `events.${e.data.type}`), e.data.data)
      }
    },
    coreUpdate() { // 把core传递给子页面
      this.$topicEmit("coreUpdate", this.core)
    },
    onMove(e) {
      var { clientX: mx, clientY: my } = e
      var rect = this.$refs.topic.getBoundingClientRect()
      this.inbox = _.inRange(mx, rect.left, rect.right) && _.inRange(my, rect.top, rect.bottom)
      if (this.inbox) { // 在预览面板内移动
        this.$topicEmit("cellInsertPreview", my - rect.top)
      } else {
        this.$topicEmit("cellInsertPreviewOut")
      }
    },
    onDrop(e) {
      window.removeEventListener("mousemove", this.onMove)
      window.removeEventListener("mouseup", this.onDrop)
      if (this.inbox) { // 在预览面板内释放新组件，子页面稍后返回CellInsertEnd, 触发onTopicCellInsertEnd
        this.$topicEmit("cellInsert")
      } else {
        this.$emit("drop", null)
      }
      this.inbox = false
    },
    onTopicInit() { // 子页面挂载后，触发onTopicInit, 将core传给子页面
      this.coreUpdate()
    },
    onTopicCellInsert(index) { // 从子页面收到新加组件的index，并暂存
      this.index = index
    },
    onTopicCellInsertEnd() { // 通知父组件 新加组件的index
      this.$emit("drop", _.isNull(this.index) ? this.core.layout.length : this.index)
    },
    onTopicCellSelect(index) { // 从子页面接受到选中组件的index, 再把它同步给父组件, 父组件的props.selectedIndex再同步给本组件，本组件又通知子页面
      this.$emit("select", index)
    },
    onTopicCellCustom(data) {
      this.$emit("custom", data)
    }
  },
  mounted() {
    window.addEventListener("message", this.onMessage)
  },
  beforeDestory() {
    window.removeEventListener("message", this.onMessage)
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .topic-editor-view {
        display: flex;
        flex-flow: column;

        .topic-editor-view-title {
            $w: 40px;
            position: relative;
            overflow: hidden;
            height: $w;
            font-size: 16px;
            line-height: $w;
            text-align: center;
            color: #fff;
            background: #4d4d4d;

            .el-button {
                position: absolute;
                top: 0;
                padding: 0;
                border: none;
                width: $w;
                line-height: $w;
                text-align: center;
                color: #fff;
                background: none;
                pointer-events: none;
            }
            &-left {
                left: 0;
                font-size: 12px;
            }
            &-right {
                right: 0;
                font-size: 16px;
            }
        }

        iframe {
            flex: 1;
            border: none;
            outline: none;

            &[disabled] {
                pointer-events: none;
            }
        }
    }
</style>

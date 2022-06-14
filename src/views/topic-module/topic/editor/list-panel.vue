<template>
    <div class="topic-editor-list">
        <div class="category">
            <div class="category-block" v-for="cat in categoryList" :key="cat.title">
                <div class="category-block-title" v-if="cat.title">{{cat.title}}</div>
                <ul>
                    <li class="grid" v-for="item in cat.children" :key="item.name"
                        @mousedown="e => onDrag(e, item)">
                        <span class="grid-title">{{item.title}}</span>
                        <span class="grid-name">{{item.name}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="grid prey"
             v-show="prey.el"
             :style="{
                transform : `translate(${prey.mx-prey.ox-1}px, ${prey.my-prey.oy-1}px)`
            }">
            <template v-if="prey.el">
                <span class="grid-title">{{prey.el.title}}</span>
                <span class="grid-name">{{prey.el.name}}</span>
            </template>
        </div>
    </div>
</template>

<script>
import categoryList from "../../topic-prop-components"
import _ from "lodash"
export default {
  data() {
    return {
      categoryList: categoryList,
      prey: {
        el: null,
        // 偏移坐标
        ox: 0,
        oy: 0,
        // 位移坐标
        mx: 0,
        my: 0
      }
    }
  },
  methods: {
    getComponentByName(name) {
      return _.find(this.list, { name })
    },
    onDrag(e, item) {
      this.prey = {
        el: item,
        ox: e.offsetX,
        oy: e.offsetY,
        mx: e.clientX,
        my: e.clientY
      }
      window.addEventListener("mousemove", this.onMove)
      window.addEventListener("mouseup", this.onDrop)
      document.body.style.cssText = "-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;cursor:pointer;"
      this.$emit("drag", item)
    },
    onMove(e) {
      this.prey.mx = e.clientX
      this.prey.my = e.clientY
    },
    onDrop(e) {
      document.body.style.cssText = ""
      window.removeEventListener("mousemove", this.onMove)
      window.removeEventListener("mouseup", this.onDrop)
      this.prey.el = null
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .topic-editor-list {
        overflow-x: hidden;
        overflow-y: auto;
        max-height: 800px;
        .category {
            .category-block {
                margin-bottom: 10px;

                .category-block-title {
                    overflow: hidden;
                    padding: 0 5px;
                    height: 30px;
                    font-size: 14px;
                    line-height: 30px;
                    background: $color-base-silver;
                    color: #fff;
                }
                ul {
                    display: flex;
                    flex-flow: wrap; /* justify-content:center; */
                    justify-content: space-between;
                    padding: 5px;
                    list-style: none;
                }
            }
        }

        .grid {
            /* width:120px; */
            width: 130px;
            height: 50px;
            padding: 5px;
            margin: 5px;
            border: $border-base;
            text-align: center;
            white-space: nowrap;
            background: #fff;
            cursor: pointer;

            .grid-title {
                display: block;
                overflow: hidden;
                height: 24px;
                font-size: 14px;
                line-height: 24px;
                color: #333;
                pointer-events: none;
            }
            .grid-name {
                display: block;
                overflow: hidden;
                height: 16px;
                font-size: 12px;
                line-height: 16px;
                color: #aaa;
                pointer-events: none;
            }
        }
        .prey {
            position: fixed;
            top: 0;
            left: 0;
            margin: 0;
            pointer-events: none;
            background: rgba(0, 0, 0, 0.5);

            .grid-title {
                color: #fff;
            }
            .grid-name {
                color: #ccc;
            }
        }
    }

    .topic-editor-list .el-tabs--border-card > .el-tabs__content {
        padding: 0;
    }
</style>

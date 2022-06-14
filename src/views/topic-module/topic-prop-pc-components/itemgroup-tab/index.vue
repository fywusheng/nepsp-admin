<template>
    <div class="itemgroup">
        <div class="itemgroup-body">
            <div class="itemgroup-body-title">商品组</div>
            <div class="tips">注: 只有1个tab且标题为空时，隐藏标题栏</div>
            <div class="itemgroup-body-item" v-for="(item, index) in content.group" :key="index">
                <div class="itemgroup-body-item-input">
                    <el-input v-model="item.title" :disabled="content.header !== 'TAB' && index !== 0">
                        <p slot="prepend">Tab{{index+1}}标题:</p>
                    </el-input>
                </div>

                <el-button class="itemgroup-body-item-search" icon="search" @click="showModal(index)"
                           :disabled="content.header !== 'TAB' && index !== 0">
                    <span v-if="item.id" style="overflow:hidden;display:block;max-height:30px;">
                        {{item.id + ' - ' + item.name}}
                    </span>
                    <span v-else>选择商品组</span>
                </el-button>

                <el-button icon="delete" @click="content.group.splice(index, 1)"></el-button>
            </div>

            <el-button class="itemgroup-body-add" icon="plus" @click="addGroup()"></el-button>
        </div>

        <el-form label-width="80px" label-suffix=" : ">
            <el-form-item label="列表">
                <el-radio-group v-model="content.style">
                    <el-radio label="COLUMN1">单列</el-radio>
                    <el-radio label="COLUMN2">双列</el-radio>
                    <el-radio label="COLUMN3">三列</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="背景色">
                <el-input v-model="content.bg_color" :maxlength="7" placeholder="#ffffff">
                    <div slot="prepend"
                         :style="{background:content.bg_color, width:'34px', height:'34px', margin:'-11px -10px', borderRadius:'4px 0 0 4px'}"></div>
                </el-input>
            </el-form-item>
            <el-form-item label="右下按钮">
                <el-radio-group v-model="content.action">
                    <el-radio label="GO_DETAILS">不显示</el-radio>
                    <el-radio label="ADD_TO_CART">加购物车</el-radio>
                    <el-radio label="QUICK_BUY" disabled>敬请期待</el-radio><!--立即购买-->
                </el-radio-group>
            </el-form-item>
            <el-form-item label="头部栏" v-show="false">
                <el-radio-group v-model="content.header">
                    <el-radio label="NONE" disabled>隐藏</el-radio>
                    <el-radio label="TITLE" disabled>大标题</el-radio>
                    <el-radio label="TAB">Tab</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <itemgroup-modal ref="itemgroupModal" @select-itemgroup="onSelect"></itemgroup-modal>
    </div>
</template>

<script>
import base from "../base"
import ItemgroupModal from "root/views/operation/position/ItemgroupModal"

export default {
  extends: base,
  contentDefault: {
    bg_color: "#ffffff",
    action: "ADD_TO_CART",
    header: "TAB",
    style: "COLUMN1",
    group: [
      {
        id: null,
        name: "",
        title: ""
      }
    ]
  },
  data() {
    return {
      selectedIndex: null
    }
  },
  methods: {
    showModal(index) {
      this.$refs[ "itemgroupModal" ].show(true)
      this.selectedIndex = index
    },
    onSelect(row) {
      var g = this.content.group[ this.selectedIndex ]
      g.id = row.item_group_info.id
      g.name = row.item_group_info.name
    },
    addGroup() {
      this.content.group.push({
        id: null,
        name: "",
        title: ""
      })
    }
  },
  components: {
    ItemgroupModal
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
      @import "~@/styles/variables.scss";

    .itemgroup {
        .itemgroup-body {
            padding: 0 2px;
            border: 1px solid #d1e5e4;

            .itemgroup-body-title {
                margin: 0 -2px;
                line-height: 40px;
                text-align: center;
                background: $color-base-gray;
                color: $border-color-hover;
            }

            .itemgroup-body-item {
                display: flex;
                justify-content: space-between;
                margin: 2px 0;

                .itemgroup-body-item-input {
                    width: 160px;
                    margin-right: 10px;
                }
                .itemgroup-body-item-search {
                    flex: 1;
                    max-width: 202px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    height: 36px;
                    padding: 0 15px;
                    line-height: 15px;
                    white-space: normal;
                    word-break: break-all;
                }
            }

            .itemgroup-body-add {
                display: block;
                width: 100%;
                margin: 2px 0;
            }
        }

        .el-form-item {
            margin-bottom: 5px;
        }
    }
</style>

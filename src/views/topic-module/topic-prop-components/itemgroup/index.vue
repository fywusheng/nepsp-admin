<template>
    <div class="itemgroup">
        <el-form label-width="120px" label-suffix=" : ">
            <el-form-item label="商品组标题">
                <el-input v-model="content.title"></el-input>
            </el-form-item>

            <!-- 滑动商品组不能设置背景色  -->
            <el-form-item label="背景色" v-if="!isHscroll">
                <el-input v-model="content.bg_color" :maxlength="7" placeholder="#ffffff">
                    <div slot="prepend" :style="{background:content.bg_color, width:'34px', height:'34px', margin:'-11px -10px', borderRadius:'4px 0 0 4px'}"></div>
                </el-input>
            </el-form-item>
            <div class="hscroll-inputs" v-if="isHscroll">
                <el-form-item label="价格文案">
                    <el-input v-model="content.price_prefix" placeholder="比如: 超品价:"></el-input>
                </el-form-item>
                <el-form-item label="查看更多落地专题">
                    <el-input :value="content.topic_url" :disabled="true">
                        <el-button slot="append" icon="search" @click="showModal('topicModal')"></el-button>
                    </el-input>
                </el-form-item>
            </div>

            <el-form-item label="商品组">
                <el-input :value="content.group_id + ' - ' + (content.group_name || '无')" :disabled="true">
                    <el-button slot="append" icon="search" @click="showModal('itemgroupModal')"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="商品点击类型">
                <el-radio-group v-model="content.action">
                    <el-radio label="GO_DETAILS">到详情页</el-radio>
                    <el-radio label="ADD_TO_CART">加购物车</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>

        <itemgroup-modal ref="itemgroupModal" @select-itemgroup="onSelectItemgroup"></itemgroup-modal>
        <topic-modal ref="topicModal" @select="onSelectTopic"></topic-modal>
    </div>
</template>

<script>
import base from "../base"
import ItemgroupModal from "root/views/operation/position/ItemgroupModal"
import TopicModal from "root/views/operation/position/SpecialNewModal"

export default {
  name: "ItemgroupPanel",
  extends: base,
  contentDefault: {
    group_id: "",
    group_name: "",
    bg_color: "#ffffff",
    title: "",
    action: "GO_DETAILS"
  },
  computed: {
    isHscroll() { // 是否水平滑动商品组
      return this.$parent.propContentName === "itemgroupHscroll"
    }
  },
  methods: {
    showModal(refName) {
      this.$refs[refName].show(true)
    },
    onSelectItemgroup(row) {
      this.content.group_id = row.item_group_info.id
      this.content.group_name = row.item_group_info.name
    },
    onSelectTopic(h5Url, page_id) {
      this.content.topic_url = h5Url
    }
  },
  components: {
    ItemgroupModal,
    TopicModal
  },
  created() {
    if (this.isHscroll) {
      this.content.price_prefix == null && this.$set(this.content, "price_prefix", "")
      this.content.topic_url == null && this.$set(this.content, "topic_url", "")
    }
  }
}
</script>

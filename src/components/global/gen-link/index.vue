<template>
    <div class="gen-link">
        <el-tabs v-model="selectedConfigTab" type="border-card" style="box-shadow:none">
            <el-tab-pane v-for="item in tabsUsed" :key="item.value" :label="item.label" :name="item.value">
                <component v-if="selectedConfigTab === item.value" :is="item.value" @select="onSelect"
                           :params="item.params || {}"></component>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import item from "@/components/gen-link/modules/item"
import brand from "@/components/gen-link/modules/brand"
import topic from "@/components/gen-link/modules/topic"
import group from "@/components/gen-link/modules/group"
import coupon from "@/components/gen-link/modules/coupon"
import scheme from "@/components/gen-link/modules/scheme"
import category from "@/components/gen-link/modules/category"
import _ from "lodash"
export default {
  name: "gen-link",
  props: {
    tabs: Array,
    defaultSelected: String
  },
  data() {
    return {
      selectedConfigTab: null,
      tabsDefault: [
        { label: "商品组", value: "group" },
        { label: "商品", value: "item" },
        { label: "优惠券", value: "coupon" },
        { label: "专题", value: "topic" },
        { label: "协议", value: "scheme" }
        // { label: '品牌', value: 'brand' },
        // { label: '分类', value: 'category' },
      ]
    }
  },
  computed: {
    tabsUsed() {
      return this.tabs || this.tabsDefault
    }
  },
  methods: {
    onSelect(item) {
      this.$emit("select", item)
    }
  },
  mounted() {
    this.selectedConfigTab = _.get(this.tabsUsed, "0.value")
  },
  components: {
    item: item,
    brand: brand,
    topic: topic,
    group: group,
    coupon: coupon,
    scheme: scheme,
    category: category
  }
}
</script>
<style lang="scss" scoped rel="stylesheet/scss">
     @import "~@/styles/variables.scss";
    .el-tabs {
        margin-top: 0;
        padding-top: 0;
    }
</style>

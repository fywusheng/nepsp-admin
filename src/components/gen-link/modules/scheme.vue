<template>
    <div>
        <el-input size="small" suffix-icon="search" v-model="url" @keyup.native.enter="useCustomItem()" placeholder="自定义链接">
            <el-button slot="append" @click="useCustomItem()">使用</el-button>
        </el-input>

        <el-table size="small"  :data="list"  highlight-current-row  @row-click="onSelect" :row-style="{cursor:'pointer'}" style="margin-top:5px">
            <el-table-column label="名称" width="120" prop="name"></el-table-column>
            <el-table-column label="协议" prop="type"></el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  data() {
    return {
      url: "",
      list: [
        {
          name: "首页",
          type: "home"
        },
        {
          name: "购物车",
          type: "cart"
        },
        {
          name: "分类页",
          type: "category"
        },
        {
          name: "领券中心",
          type: "couponCenter"
        },
        {
          name: "个人中心",
          type: "userCenter"
        }
      ]
    }
  },
  methods: {
    useCustomItem(){
      this.$emit("select", {
        type: "url",
        label: "自定义",
        desc: "自定义",
        url: this.url
      })
    },
    onSelect(row){
      this.$emit("select", {
        type: row.type,
        label: row.name,
        desc: row.name,
        meta: row
      })
    }
  }
}
</script>

<template>
  <el-tree ref="tree" v-bind="$attrs" v-on="$listeners" :data="options" :props="props" @node-collapse="expandChange" @node-expand="expandChange">
    <template slot-scope="{ data, node }">
      <div class="all" @click.prevent="change(data,node)">
        <span>{{ data[props.label] }}</span>
      </div>
    </template>
  </el-tree>
</template>

<script>
export default {
  name: "YTree",
  props: {
    maxLevel: {
      type: String,
      default: ""
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    settings: {
      type: Object,
      default: () => {
        return {
          level: "level",
          children: "children",
          label: "label"
        }
      }
    }
  },
  data() {
    return {
      options: [],
      props: {
        level: "level",
        children: "children",
        label: "label"
      }
    }
  },
  watch: {
    data: {
      handler(val){
        //深拷贝
        var value = JSON.parse(JSON.stringify(val))
        if (this.maxLevel){ //如果需要限制层级
          this.limitLevel(value, this.maxLevel)
        }
        this.options = value 
      },
      immediate: true
    }
  },
  created() {
    Object.assign(this.props, this.settings)
  },
  methods: {
    /**
     * @description: 展开与折叠事件
     * @param {*}
     * @return {*}
     * @author: syx
   */  
    expandChange() {
      this.$emit("expandChange")
    },
    /**
     * @description: 限制层级
     * @param {type} 
     * @return {type} 
     * @author: syx
   */
    limitLevel(list, level){
      if (!list) {
        return
      }
      for (var i = 0; i < list.length; i++) {
        var item = list[i]
        if (item[this.props.children] && item[this.props.children].length > 0) {
          if (item[this.props.level] === level){
            delete item[this.props.children]
          } else {
            this.limitLevel(item[this.props.children], level)
          }
        }
      }
    },
    /**
     * @description: 点击选项
     * @param {*} data
     * @param {*} node
     * @return {*}
     * @author: syx
     */
    change(data, node) {
      if (data[this.props.children]) {
        return
      }
      this.$refs.tree.setChecked(data, !node.checked)
    },
    /**
     * @description: 全选中
     * @param {*}
     * @return {*}
     * @author: syx
     */
    selectAll() {
      const self = this
      for (const keys in self.$refs.tree.store.nodesMap){
        const item = self.$refs.tree.store.nodesMap[keys]
        item.checked = true
        //解决拥有子节点的样式不变化 的问题
        item.indeterminate = false
      }
    },
    /**
     * @description: 全不选
     * @param {*}
     * @return {*}
     * @author: syx
     */
    unSelectAll() {
      const self = this
      for (const keys in self.$refs.tree.store.nodesMap){
        const item = self.$refs.tree.store.nodesMap[keys]
        item.checked = false
        //解决拥有子节点的样式不变化 的问题
        item.indeterminate = false
      }
    },
    /**
     * @description: 判断是否全选
     * @param {*}
     * @return {*}
     * @author: syx
     */
    judgeSelectAll() {
      const self = this
      let isSelectAll = true
      for (const keys in self.$refs.tree.store.nodesMap){
        const item = self.$refs.tree.store.nodesMap[keys]
        if (item.checked === false) {
          isSelectAll = false
          continue
        }
      }
      return isSelectAll
    },
    /**
     * @description: 判断是否全不选
     * @param {*}
     * @return {*}
     * @author: syx
     */
    judgeUnSelectAll() {
      const self = this
      let isUnSelectAll = true
      for (const keys in self.$refs.tree.store.nodesMap){
        const item = self.$refs.tree.store.nodesMap[keys]
        if (item.checked === true) {
          isUnSelectAll = false
          continue
        }
      }
      return isUnSelectAll
    },
    /**
     * @description: 全反选
     * @param {*}
     * @return {*}
     * @author: syx
     */
    toggleSelectAll() {
      const self = this
      for (const keys in self.$refs.tree.store.nodesMap){
        const item = self.$refs.tree.store.nodesMap[keys]
        item.checked = !item.checked
      }
    },
    /**
     * @description: 全部展开
     * @param {*}
     * @return {*}
     * @author: syx
     */
    expandAll() {
      const self = this
      for (const keys in self.$refs.tree.store.nodesMap){
        const item = self.$refs.tree.store.nodesMap[keys]
        item.expanded = true
      }
    },
    /**
     * @description: 全部展开一级树
     * @param {*}
     * @return {*}
     * @author: syx
     */
    expandAllFirstLevel() {
      const self = this
      // 将没有转换成树的原数据
      const list = this.options
      for (let i = 0; i < list.length; i++) {
        // 将没有转换成树的原数据设置key为... 的展开
        self.$refs.tree.store.nodesMap[list[i][self.$attrs["node-key"]]].expanded = true
      }
    },
    /**
     * @description: 全部折叠
     * @param {*}
     * @return {*}
     * @author: syx
     */
    foldAll() {
      const self = this
      for (const keys in self.$refs.tree.store.nodesMap){
        const item = self.$refs.tree.store.nodesMap[keys]
        item.expanded = false
      }
    },
    /**
     * @description: 一级树全部折叠
     * @param {*}
     * @return {*}
     * @author: syx
     */
    foldAllFirstLevel() {
      const self = this
      // 将没有转换成树的原数据
      const list = this.options
      for (let i = 0; i < list.length; i++) {
        // 将没有转换成树的原数据设置key为... 的展开
        self.$refs.tree.store.nodesMap[list[i][self.$attrs["node-key"]]].expanded = false
      }
    },
    /**
     * @description: 判断是否全部折叠
     * @param {*}
     * @return {*}
     * @author: syx
     */
    judgeFoldAll() {
      const self = this
      let isFoldAll = true //默认折叠全部
      for (const keys in self.$refs.tree.store.nodesMap){
        const item = self.$refs.tree.store.nodesMap[keys]
        if (item.expanded === true){
          isFoldAll = false
          continue
        }
      }
      return isFoldAll
    },
    /**
     * @description: 判断一级树是否全部折叠
     * @param {*}
     * @return {*}
     * @author: syx
     */
    judgeFoldAllFirstLevel() {
      const self = this
      let isFoldAllFirstLevel = true //默认折叠全部一级树
      // 将没有转换成树的原数据
      const list = this.options
      for (let i = 0; i < list.length; i++) {
        const item = self.$refs.tree.store.nodesMap[list[i][self.$attrs["node-key"]]]
        if (item.expanded === true){
          isFoldAllFirstLevel = false
          continue
        }
      }
      return isFoldAllFirstLevel
    },
    /**
     * @description: 判断是否全部展开
     * @param {*}
     * @return {*}
     * @author: syx
     */
    judgeExpandAll() {
      const self = this
      let isExpandAll = true //默认展开全部
      for (const keys in self.$refs.tree.store.nodesMap){
        const item = self.$refs.tree.store.nodesMap[keys]
        if (item.expanded === false){
          isExpandAll = false
          continue
        }
      }
      return isExpandAll
    },
    /**
     * @description: 判断一级树是否全部展开
     * @param {*}
     * @return {*}
     * @author: syx
     */
    judgeExpandAllFirstLevel() {
      const self = this
      let isExpandAllFirstLevel = true //默认展开全部一级树
      // 将没有转换成树的原数据
      const list = this.options
      for (let i = 0; i < list.length; i++) {
        const item = self.$refs.tree.store.nodesMap[list[i][self.$attrs["node-key"]]]
        if (item.expanded === false){
          isExpandAllFirstLevel = false
          continue
        }
      }
      return isExpandAllFirstLevel
    },
    /**
     * @description: 返回树实例
     * @param {*}
     * @return {*}
     * @author: syx
     */ 
    getTree() {
      return this.$refs.tree
    }
  }
}
</script>

<style scoped>
.all {
  width: 100%;
}
</style>

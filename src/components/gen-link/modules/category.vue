<template>
  <div>
    <el-table
      :data="tableData"
      :header-cell-style="{background:'#F2F6FC',color:'#000000'}"
      size="mini"
      row-key="id"
      lazy
      v-loading="loading"
      :load="load"
      @row-click="onSelect"
      :highlight-current-row="false"
      :default-expand-all="false"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column
        label=""
        type=""
        width="20px">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetch } from "@/utils/http-client"

export default {
  data() {
    return {
      list: [],
      loading: false,
      tableData: [],
      categoryMap: {}
    }
  },
  methods: {
    load(tree, treeNode, resolve) {
      if (this.categoryMap[tree.id]){
        const dataList = []
        this.categoryMap[tree.id].forEach(child => {
          const category = {
            name: child.name,
            code: child.name,
            id: child.id,
            level: child.level,
            node: child.node,
            creator: child.creator,
            updatedTime: child.updatedTime,
            children: [],
            hasChildren: child.children
          }
          dataList.push(category)
          this.categoryMap[child.id] = child.children
        })
        resolve(dataList)
        return
      }
      this.allDataList.some(data => {
        if (data.id === tree.id){
          const dataList = []
          data.children.forEach(child => {
            const category = {
              name: child.name,
              code: child.name,
              id: child.id,
              level: child.level,
              node: child.node,
              creator: child.creator,
              updatedTime: child.updatedTime,
              children: [],
              hasChildren: child.children
            }
            dataList.push(category)
            this.categoryMap[child.id] = child.children
          })
          resolve(dataList)
          this.categoryMap[data.id] = data.children
          return true
        }
      })
    },
    async getList() {
      this.loading = true
      const result = await fetch("/category/list.tree", {})
      this.loading = false
      if (result.code == 200) {
        this.allDataList = result.data
        const dataList = []
        result.data.forEach(data => {
          const category = {
            name: data.name,
            code: data.code,
            id: data.id,
            level: data.level,
            node: data.node,
            creator: data.creator,
            updatedTime: data.updatedTime,
            children: [],
            hasChildren: data.children
          }
          dataList.push(category)
        })
        this.tableData = dataList
      } else {
        this.$message.error(result.msg)
      }
    },
    onSelect(row) {
      console.info(row)
      this.$emit("select", {
        type: "category",
        label: "分类",
        id: row.id,
        desc: row.name,
        meta: row
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

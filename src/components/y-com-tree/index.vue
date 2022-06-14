<template>
  <div class="com-tree">
    <el-input v-model="filterText" placeholder="输入关键字进行过滤" size="small" prefix-icon="el-icon-search" />
    <el-scrollbar >
      <el-tree ref="ComTree" class="filter-tree" :default-expand-all="false" :data="options" :filter-node-method="filterNode" highlight-current v-bind="$attrs" v-on="$listeners" />
    </el-scrollbar>
  </div>
</template>
<script>
export default {
  props: {
    //最大层级  1 最大2层  2  最大3层
    maxLevel: {
      type: String,
      default: ""
    },
    height: {
      type: Number,
      default: 446
    },

    // showCheckbox: {
    //   type:Boolean,
    //   default:false,
    // },
    data: {
      // required: true,
      type: Array,
      default() {
        return [
          {
            id: 1,
            label: "一级 1",
            children: [
              {
                id: 4,
                label: "二级 1-1",
                children: [
                  {
                    id: 9,
                    label: "三级 1-1-1"
                  },
                  {
                    id: 10,
                    label: "三级 1-1-2"
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            label: "一级 2",
            children: [
              {
                id: 5,
                label: "二级 2-1"
              },
              {
                id: 6,
                label: "二级 2-2"
              }
            ]
          },
          {
            id: 3,
            label: "一级 3",
            children: [
              {
                id: 7,
                label: "二级 3-1"
              },
              {
                id: 8,
                label: "二级 3-2"
              }
            ]
          }
        ]
      }
    }
  },
  data() {
    return {
      filterText: "",
      options: []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.ComTree.filter(val)
    },
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
  methods: {
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
        if (item[this.$attrs.props.children] && item[this.$attrs.props.children].length > 0) {
          if (item[this.$attrs.props.level] === level){
            delete item[this.$attrs.props.children]
          } else {
            this.limitLevel(item[this.$attrs.props.children], level)
          }
        }
      }
    },
    /**
     * @description: 通过 key 设置某个节点的当前选中状态，使用此方法必须设置 node-key 属性
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    setCurrentKey(key) {
      this.$refs.ComTree.setCurrentKey(key)
    },
    /**
     * @description: 获取当前被选中节点的 data，若没有节点被选中则返回 null 
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getCurrentKey(){
      return this.$refs.ComTree.getCurrentKey()
    },
    // 过滤节点
    filterNode(value, data) {
      if (!value) { return true }
      return data[this.$refs.ComTree.props.label].indexOf(value) !== -1
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tree{
  border: none !important;
}
.com-tree .el-scrollbar {
  width: calc(100% - 20px);
  height: calc(100% - 62px);
  position: absolute;
  top: 52px;
  ::v-deep .el-scrollbar__wrap {
    overflow-x: hidden;
    overflow-y: auto;
    width: 100%;
  }
}
.com-tree .el-tree > .el-tree-node {
  min-width: 100%;
  display: block;
}
.com-tree .el-tree-node :nth-child(2) {
  padding: 1px;
  overflow: visible;
}
.com-tree .el-scrollbar .el-scrollbar__wrap .el-scrollbar__view {
  white-space: nowrap;
}
.com-tree {
  width: 250px;
  height: 100%;
  box-sizing: border-box;
  padding: 10px 10px 0 10px;
  position: relative;
  border: none;
  ::v-deep .el-input{
    width: calc(100% - 20px);
    position: absolute;
    top: 16px;
  }
}

  ::v-deep .custom-tree-node {
    font-size: 14px;
    max-width: calc(100% - 30px);
    overflow: hidden;
    .title{
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  ::v-deep .custom-tree-handle {
    margin-left: 5px;
    display: none;
  }

  ::v-deep .el-tree-node__content:hover {
    .custom-tree-handle {
      margin-left: 5px;
      display: inline;
      .not-allow{
        display: none;
      }
    }
  }

</style>

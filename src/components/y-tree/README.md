# 基于el-tree的y-tree组件使用说明书

**使用**

组件引入部分    略

页面上使用（**需要设置node-key属性**）

```vue
<template>
	<y-tree ref="tree" show-checkbox node-key="menuId" :settings="defaultProps"  default-expand-all class="tree-warp" :data="menuList"></y-tree>
</template>

<script>
export default {
    data() {
		return {
            menuList: [],
            defaultProps: {
                children: "children",
                label: "title"
            },
        }
	}
}
</script>

```

**接受el-tree所有参数及事件**

## 调用el-tree的方法

调用el-tree的方法使用规则如下

```js
this.$refs.tree.getTree().setCheckedKeys([])
```

先使用 getTree() 方法 获取 el-tree的实例，然后再调用el-tree拥有的方法

## 新增方法

|          方法名          |                  使用方式                  |                           作用说明                           |
| :----------------------: | :----------------------------------------: | :----------------------------------------------------------: |
|        expandAll         |        this.$refs.tree.expandAll()         |                         展开所有选项                         |
|         foldAll          |         this.$refs.tree.foldAll()          |                         折叠所有选项                         |
|   expandAllFirstLevel    |   this.$refs.tree.expandAllFirstLevel()    |                        展开所有一级树                        |
|    foldAllFirstLevel     |    this.$refs.tree.foldAllFirstLevel()     |                        折叠所有一级树                        |
|      judgeExpandAll      |      this.$refs.tree.judgeExpandAll()      |   判断是否展开全部  <br />是的话 返回 true，否则返回false    |
|       judgeFoldAll       |       this.$refs.tree.judgeFoldAll()       |   判断是否折叠全部  <br />是的话 返回 true，否则返回false    |
| judgeExpandAllFirstLevel | this.$refs.tree.judgeExpandAllFirstLevel() | 判断是否展开全部一级树  <br />是的话 返回 true，否则返回false<br /> |
|  judgeFoldAllFirstLevel  |  this.$refs.tree.judgeFoldAllFirstLevel()  | 判断是否折叠全部一级树  <br />是的话 返回 true，否则返回false<br /> |
|        selectAll         |        this.$refs.tree.selectAll()         |                       复选框模式下全选                       |
|       unSelectAll        |       this.$refs.tree.unSelectAll()        |                      复选框模式下全不选                      |
|     toggleSelectAll      |     this.$refs.tree.toggleSelectAll()      |                       复选框模式下反选                       |
|      judgeSelectAll      |      this.$refs.tree.judgeSelectAll()      |   判断是否全选<br />是的话 返回 true，否则返回false<br />    |
|     judgeUnSelectAll     |     this.$refs.tree.judgeUnSelectAll()     |  判断是否全不选<br />是的话 返回 true，否则返回false<br />   |

**注意：** judgeExpandAll，judgeFoldAll，judgeExpandAllFirstLevel，judgeFoldAllFirstLevel，judgeSelectAll，judgeUnSelectAll

这四个方法 一般配合 expandChange 事件使用，需再添加定时器 ，否则有bug，如

```js
<y-tree ref="tree" show-checkbox node-key="id" @expandChange="expandChange" @check-change="checkChange" />
	expandChange(){
      setTimeout(() => {
        if (this.isExpand) {
          const isFoldAllFirstLevel = this.$refs.tree.judgeFoldAllFirstLevel() //是否折叠所有一级树
          if (isFoldAllFirstLevel) {
            this.isExpand = false
          }
        } else {
          const isExpandAllFirstLevel = this.$refs.tree.judgeExpandAllFirstLevel() //是否展开所有一级树
          if (isExpandAllFirstLevel) {
            this.isExpand = true
          }
        }
      }, 100)
    },
```

## 新增属性

|   参数   | 说明                                                         |  类型  |                        默认值                        |
| :------: | :----------------------------------------------------------- | :----: | :--------------------------------------------------: |
|   data   | 树的数据                                                     | Array  |              树数据的示例，太长在这不写              |
| settings | 设置                                                         | Object | {level: "level",children: "children",label: "label"} |
| maxLevel | 限制最大层级<br />“1” 表示 最大层级为2层  <br />“2” 表示 最大层级为 3层 ... <br /> 默认值为""，不限制层级 | String |                          ""                          |

## 新增事件

|   事件名称   | 事件说明                   | 备注                                                         |
| :----------: | -------------------------- | ------------------------------------------------------------ |
| expandChange | 折叠或展开时触发，无返回值 | **折叠状态改变 可能比 上面的 判断方法执行的慢，导致判断不准确，因此需要再上述判断方法添加  延时** |

## 解决bug

1. 解决了点击非复选框时无法选中的问题

## 注意

如有bug，请微信联系   **syx365night**   沈小布
# 基于el-cascader组件升级y-cascader组件

## el-cascader的不足

1. 选择任意一级选项时  点击选项不会触发选中，只有点击单选框才可以y
2. 当需求要去除某个或某些选项时无法轻松做到
3. 当后端数据childre为[] 不符合需求，后端又不改时,无法轻松完成
4. 当后端接口数据为3层，但是需求只要展示2层时 无法做到限制层级



## y-cascader使用方法

### 属性配置

组件接收element所有属性，props与options属性分别替换为 settings 和 data属性

|    参数     |                   说明                   |        类型        |       默认值       |
| :---------: | :--------------------------------------: | :----------------: | :----------------: |
|  settings   |                 属性设置                 |       Object       | 看后面具体参数配置 |
|    data     |               联级选项数据               |       Array        |    一些选项示例    |
|  maxLevel   | 限制到哪一层级（**数据需要又层级标志**） |       String       |         “”         |
|  delValue   |    需要去除的部分选项，子级会一同去除    | String 或者  Array |         “”         |
| delChildren |         是否需要去除空 children          |      Boolean       |       false        |
| showLength  |            是否展示子级数据量            |      Boolean       |       false        |

#### settings属性配置表

|     参数      |                             说明                             |  类型   |  默认值  |
| :-----------: | :----------------------------------------------------------: | :-----: | :------: |
|     level     |                       限制层级的字段名                       | String  |  level   |
|     value     |              指定选项的值为选项对象的某个属性值              | String  |  value   |
|     label     |              指定选项的值为选项对象的某个属性值              | String  |  label   |
|   children    |              指定选项的值为选项对象的某个属性值              | String  | children |
|     leaf      |       指定选项的叶子节点的标志位为选项对象的某个属性值       | String  |   leaf   |
| expandTrigger |        次级菜单的展开方式，可选值  "hover" 与 ”click“        | String  |  hover   |
|   multiple    |                           是否多选                           | Boolean |  false   |
| checkStrictly |               是否严格的遵守父子节点不互相关联               | Boolean |   true   |
|   emitPath    | 在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值 | Boolean |  false   |
|     lazy      |        是否动态加载子节点，需与 lazyLoad 方法结合使用        | Boolean |  false   |
|   disabled    |             指定选项的禁用为选项对象的某个属性值             | String  | disabled |

## 新增方法

|   方法名    |          作用           |                  说明                   |
| :---------: | :---------------------: | :-------------------------------------: |
| getCascader | 返回el-cascader组件实例 | 使用此方法后可调用el-cascader组件的方法 |
| getDataList |   返回树形数据的数组    |    使用此方法可返回所有树形数据列表     |
| getDataMap  |     返回数据map对象     |               value: data               |


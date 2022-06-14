<template>
  <div>
    <div class="param-form">
      <el-form ref="paramForm" :model="formData">
        <el-table
          :data="formData[paramsArrayName]"
          border
          :empty-text="emptyText"
          row-key="id"
          default-expand-all
          :tree-props="{ children: 'children' }"
        >
          <el-table-column label="字段名" width="150px">
            <template slot-scope="scope">
              <el-form-item :id="scope.row.id" :show-message="false">
                <span v-if="!isEdit">{{ scope.row[paramName] }}</span>
                <el-input
                  v-else
                  size="small"
                  @blur="checkvalid(scope.row)"
                  v-model="scope.row[paramName]"
                  :readonly="!isEdit"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            label="字段类型"
            width="120px"
            :show-overflow-tooltip="!isEdit"
          >
            <template slot-scope="scope">
              <el-form-item :show-message="false">
                <!-- <span v-if="!isEdit">{{formateType(scope.row[paramType])}}</span> -->
                <el-select
                  :disabled="!isEdit"
                  v-model="scope.row[paramType]"
                  placeholder="请选择字段类型"
                >
                  <el-option
                    v-for="item in paramsArray"
                    :key="item.dicCode"
                    :label="item.dicCodeName"
                    :value="item.dicCode"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="必填" align="center" width="50">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row[required]"
                :disabled="!isEdit"
              ></el-checkbox>
            </template>
          </el-table-column>
          <!-- 测试isTest true 时可以输入 -->
          <el-table-column label="字段值" v-if="isTest" width="120px">
            <template slot-scope="scope">
              <el-input
                size="small"
                v-model="scope.row[paramValue]"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="描述"
            width="120px"
            :show-overflow-tooltip="!isEdit"
          >
            <template slot-scope="scope">
              <span v-if="!isEdit">{{ scope.row[desc] }}</span>
              <el-input
                v-else
                size="small"
                v-model="scope.row[desc]"
                :readonly="!isEdit"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="示例"
            width="120px"
            :show-overflow-tooltip="!isEdit"
          >
            <template slot-scope="scope">
              <span v-if="!isEdit">{{ scope.row[example] }}</span>
              <el-input
                v-else
                size="small"
                v-model="scope.row[example]"
                :readonly="!isEdit"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120px" v-if="isEdit">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="增加子节点"
                placement="top"
              >
                <el-button
                  v-if="
                    scope.row[paramType] === '2' || scope.row[paramType] === '3'
                  "
                  type="primary"
                  class="handle-btn"
                  plain
                  icon="el-icon-plus"
                  size="mini"
                  @click="addChildParam(scope.row, scope.$index)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除节点"
                placement="top-start"
              >
                <el-button
                  type="danger"
                  class="handle-btn"
                  plain
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteParam(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div class="btn-wrap">
        <el-tooltip
          class="item"
          effect="dark"
          content="增加父节点"
          placement="top-start"
        >
          <el-button
            plain
            type="primary"
            class="param-btn"
            size="small"
            @click="addParam"
            v-if="isEdit"
            icon="el-icon-plus"
          ></el-button>
        </el-tooltip>
        <el-tooltip
          class="item"
          effect="dark"
          content="查看参数详情"
          placement="top-start"
        >
          <el-button
            style="margin-top: 10px"
            plain
            type="warning"
            size="small"
            icon="el-icon-view"
            @click="viewParam"
          ></el-button>
        </el-tooltip>
      </div>
    </div>
    <el-dialog
      :visible.sync="isShowViewParam"
      width="960px"
      :close-on-click-modal="false"
      title="查看参数详情"
      append-to-body
      center
      close-on-press-escape
    >
      <div>
        <pre>{{ viewJson }}</pre>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { DebounceBy } from "@/utils/debounce"

export default {
  name: "params",
  model: {
    prop: "formData",
    event: "change"
  },
  props: {
    formData: {
      // 表单数据
      required: true,
      type: Object,
      default: () => {
        // paramsArray 参数数组
        return { [this.paramsArrayName]: [] }
      }
    },
    isTest: {
      // 是否是测试
      type: Boolean,
      default: false
    },
    isEdit: {
      // 是否可以编辑
      type: Boolean,
      default: true
    },
    paramsArray: {
      type: Array,
      default: () => []
    },
    paramNull: {
      // 参数是否可以为空
      type: Boolean,
      default: true
    },
    warnMessage: {
      // 组件为空提示语
      type: String,
      default: "参数不能为空！"
    },
    paramsArrayName: {
      // 参数数组名
      type: String,
      default: "paramsArray"
    },
    paramName: {
      // ”字段名“字段名
      type: String,
      default: "paramName"
    },
    paramValue: {
      // ”字段名“字段名
      type: String,
      default: "paramValue"
    },
    paramType: {
      // ”字段类型“字段名
      type: String,
      default: "paramType"
    },
    // childrenParam: {
    //   type: {},
    //   default: false
    // },
    required: {
      // ”必填“字段名
      type: String,
      default: "required"
    },
    desc: {
      // "描述"字段名
      type: String,
      default: "desc"
    },
    example: {
      // "示例"字段名
      type: String,
      default: "example"
    },
    emptyText: {
      // "参数为空"显示字段
      type: String,
      default: "暂无参数"
    }
  },

  data() {
    return {
      isShowViewParam: false,
      viewJson: null
    }
  },
  watch: {
    formData(val) {
      this.$emit("change", val)
    }
  },
  mounted() {
    console.log("this", this.paramsArray)
  },
  methods: {
    /**
     * @description: 添加出参和入参 + 设置防抖
     */
    addParam: DebounceBy(function() {
      var timestamp = Date.parse(new Date())
      const param = {
        id: String(timestamp),
        [this.paramName]: "",
        [this.paramType]: "String",
        [this.required]: false,
        [this.desc]: "",
        [this.paramValue]: "",
        [this.example]: "",
        children: []
      }
      // const paramsArrayName = this.paramsArrayName

      this.formData[this.paramsArrayName].push(param)
    }, 1000),

    /**
     * @description: 增加子节点
     * @param {row}: 单行数据
     */
    addChildParam: DebounceBy(function(item, index) {
      var timestamp = Date.parse(new Date())
      const param = {
        id: String(timestamp),
        [this.paramName]: "",
        [this.paramType]: "String",
        [this.required]: false,
        [this.desc]: "",
        [this.paramValue]: "",
        [this.example]: "",
        children: []
      }
      if (item["paramType"] && item["paramName"]) {
        if (item["paramType"] === "2" || item["paramType"] === "3") {
          item.children.push(param)
        }
      } else {
        this.$message.error("请完善参数")
      }
    }, 1000),

    /**
     * @description: 删除参数
     * @param {row}: 单行数据
     */
    deleteParam(row) {
      this.$confirm("即将删除此参数, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        closeOnPressEscape: false,
        type: "warning"
      })
        .then(() => {
          const id = row.id
          const treeList = this.formData[this.paramsArrayName]
          this.delTree(treeList, id)
          // this.formData[this.paramsArrayName].splice(index, 1)
        })
        .catch(() => {
          this.$message.info("已取消！")
        })
    },
    /**
     * @description: 删除树id
     * @param {treeList, id}: tree,id
     */
    delTree(treeList, id) {
      function removeTreeListItem(treeList, id) {
        // 根据id属性从数组（树结构）中移除元素
        if (!treeList || !treeList.length) {
          return
        }
        for (let i = 0; i < treeList.length; i++) {
          if (treeList[i].id === id) {
            treeList.splice(i, 1)
            break
          }
          removeTreeListItem(treeList[i].children, id)
        }
      }
      removeTreeListItem(treeList, id)
    },

    /**
     * @description: 查看+转换成可视化的json
     */
    viewParam() {
      const params = this.formData[this.paramsArrayName]
      let json = {}
      json = this.format(params, "2")
      this.viewJson = json
      this.isShowViewParam = true // 开启弹框
    },
    format(data, flag) {
      const type = new Map([
        ["String", ""],
        ["Int", ""],
        ["0", ""],
        ["1", ""],
        ["2", {}],
        ["3", []],
        ["4", null],
        ["5", null]
      ])
      let json = ""
      if (flag === "2") {
        json = {}
        data.map((item) => {
          json[item.paramName] = item.paramValue
            ? item.paramValue
            : item.example || type.get(item.paramType)
          if (item.children.length) {
            json[item.paramName] = this.format(item.children, item.paramType)
          }
        })
      } else if (flag === "3") {
        json = []
        data.map((item, index) => {
          item.paramValue
            ? json.push((item.paramName = item.paramValue))
            : json.push((item.paramName = item.example))
          if (item.children.length) {
            json[index] = this.format(item.children, item.paramType)
          }
        })
      }
      return json
    },

    getViewJson() {
      // debugger
      const params = this.formData[this.paramsArrayName]
      let json = {}
      json = this.format(params, "2")
      console.log(json)
      return json
    },
    /**
     * @description: 校验表单
     * @param {type}
     */

    checkForm() {
      const treeList = this.formData[this.paramsArrayName]
      const that = this
      function maptree(treeList) {
        for (let i = 0; i < treeList.length; i++) {
          if (!that.checkvalid(treeList[i])) {
            return false
            // break
          }
          // 判断有子元素,并且子元素的长度大于0就再次调用自身

          if (treeList[i].children.length >= 1) {
            maptree(treeList[i].children)
          }
          maptree(treeList[i].children)
        }

        return true
      }
      return maptree(treeList)
    },
    /**
     * @description: 校验表单
     * @param {type}
     */
    checkvalid(item, kind) {
      const id = item.id
      if (kind === 0) {
        if (item.paramName === "") {
          // this.$refs.
          document.getElementById(id).classList.add("is-error")
          // this.$message.warning('请填写字段名称')
          return false
        }
      }
      if (this.isTest) {
        // 测试接口必填 + 没写值报错
        if (item.required && item.paramValue === "") {
          // this.$refs.
          document.getElementById(id).classList.add("is-error")
          // this.$message.warning('请填写字段名称')
          return false
        }
      }

      document.getElementById(id).classList.remove("is-error")
      return true
    }
    /**
     * @description: 转换字段类型
     * @param {val}
     */
    // formateType (val) {
    //   let item = this.paramsArray.filter(item => {
    //     if (item.dicCode === val) {
    //       return item
    //     }
    //   })
    //   return item[0].dicCodeName
    // }
  }
}
</script>

<style lang="scss" scoped>
input[readonly] {
  background-color: #f5f7fa;
}

.param-form {
  display: flex;
  flex-direction: row;
  ::v-deep.el-table .cell {
    display: flex !important;
    align-items: center;
  }

  ::v-deep .el-table--border {
    border-bottom: 1px solid #f0f2f5 !important;
  }
  ::v-deep .el-form .el-form-item {
    margin-bottom: 0 !important;
  }
  ::v-deep .el-table__empty-block {
    min-height: 0vh !important;
  }
  ::v-deep.el-table__empty-text {
    display: none;
  }
  ::v-deep .el-table td {
    padding: 0px 0;
  }
  ::v-deep .el-table th {
    padding: 0;
  }
}
::v-deep.el-dialog__header {
  text-align: left;
}
::v-deep.el-select .el-input__inner {
  height: 32px !important;
}
.item {
  margin-left: 10px;
}
::v-deep .el-form {
  min-height: 0 !important;
}
// .btn-wrap {
//   display: flex;
//   align-items: flex-start;
//   margin: 0 6px;
// }
</style>

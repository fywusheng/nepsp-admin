<template>
  <el-cascader ref="cascader" :options="options" :props="props" v-on="$listeners" v-bind="$attrs">
    <template slot-scope="{ data, node }">
      <div @click.prevent="selectItem(data, node)">
        <span>{{ data[props.label] }}</span>
        <span v-if="data[props.children] && showLength"> ({{ data[props.children].length }}) </span>
      </div>
    </template>
  </el-cascader>
</template>

<script>
export default {
  name: "YCascader",
  props: {
    //最大层级  1 最大2层  2  最大3层
    maxLevel: {
      type: String,
      default: ""
    },
    delValue: {
      default: ""
    },
    delChildren: {
      type: Boolean,
      default: false
    },
    showLength: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default(){
        return [{
          id: 1,
          value: "zhinan",
          label: "指南",
          children: [{
            id: 2,
            value: "shejiyuanze",
            label: "设计原则",
            children: [{
              id: 3,
              value: "yizhi",
              label: "一致"
            }, {
              id: 4,
              value: "fankui",
              label: "反馈"
            }, {
              id: 5,
              value: "xiaolv",
              label: "效率"
            }, {
              id: 6,
              value: "kekong",
              label: "可控"
            }]
          }, {
            id: 7,
            value: "daohang",
            label: "导航",
            children: [{
              id: 8,
              value: "cexiangdaohang",
              label: "侧向导航"
            }, {
              id: 9,
              value: "dingbudaohang",
              label: "顶部导航"
            }]
          }]
        }, {
          id: 10,
          value: "zujian",
          label: "组件",
          children: [{
            id: 11,
            value: "basic",
            label: "Basic",
            children: [{
              id: 12,
              value: "layout",
              label: "Layout 布局"
            }, {
              id: 13,
              value: "color",
              label: "Color 色彩"
            }, {
              id: 14,
              value: "typography",
              label: "Typography 字体"
            }, {
              id: 15,
              value: "icon",
              label: "Icon 图标"
            }, {
              id: 16,
              value: "button",
              label: "Button 按钮"
            }]
          }, {
            id: 17,
            value: "form",
            label: "Form",
            children: [{
              value: "radio",
              label: "Radio 单选框"
            }, {
              id: 18,
              value: "checkbox",
              label: "Checkbox 多选框"
            }, {
              id: 19,
              value: "input",
              label: "Input 输入框"
            }, {
              id: 20,
              value: "input-number",
              label: "InputNumber 计数器"
            }, {
              id: 21,
              value: "select",
              label: "Select 选择器"
            }, {
              id: 22,
              value: "cascader",
              label: "Cascader 级联选择器"
            }, {
              id: 23,
              value: "switch",
              label: "Switch 开关"
            }, {
              id: 24,
              value: "slider",
              label: "Slider 滑块"
            }, {
              id: 25,
              value: "time-picker",
              label: "TimePicker 时间选择器"
            }, {
              id: 26,
              value: "date-picker",
              label: "DatePicker 日期选择器"
            }, {
              id: 27,
              value: "datetime-picker",
              label: "DateTimePicker 日期时间选择器"
            }, {
              id: 28,
              value: "upload",
              label: "Upload 上传"
            }, {
              id: 29,
              value: "rate",
              label: "Rate 评分"
            }, {
              id: 30,
              value: "form",
              label: "Form 表单"
            }]
          }, {
            id: 31,
            value: "data",
            label: "Data",
            children: [{
              id: 32,
              value: "table",
              label: "Table 表格"
            }, {
              id: 33,
              value: "tag",
              label: "Tag 标签"
            }, {
              id: 34,
              value: "progress",
              label: "Progress 进度条"
            }, {
              id: 35,
              value: "tree",
              label: "Tree 树形控件"
            }, {
              id: 36,
              value: "pagination",
              label: "Pagination 分页"
            }, {
              id: 37,
              value: "badge",
              label: "Badge 标记"
            }]
          }, {
            id: 38,
            value: "notice",
            label: "Notice",
            children: [{
              id: 39,
              value: "alert",
              label: "Alert 警告"
            }, {
              id: 40,
              value: "loading",
              label: "Loading 加载"
            }, {
              id: 41,
              value: "message",
              label: "Message 消息提示"
            }, {
              id: 42,
              value: "message-box",
              label: "MessageBox 弹框"
            }, {
              id: 43,
              value: "notification",
              label: "Notification 通知"
            }]
          }, {
            id: 44,
            value: "navigation",
            label: "Navigation",
            children: [{
              id: 45,
              value: "menu",
              label: "NavMenu 导航菜单"
            }, {
              id: 46,
              value: "tabs",
              label: "Tabs 标签页"
            }, {
              id: 47,
              value: "breadcrumb",
              label: "Breadcrumb 面包屑"
            }, {
              id: 48,
              value: "dropdown",
              label: "Dropdown 下拉菜单"
            }, {
              id: 49,
              value: "steps",
              label: "Steps 步骤条"
            }]
          }, {
            id: 50,
            value: "others",
            label: "Others",
            children: [{
              id: 51,
              value: "dialog",
              label: "Dialog 对话框"
            }, {
              id: 52,
              value: "tooltip",
              label: "Tooltip 文字提示"
            }, {
              id: 53,
              value: "popover",
              label: "Popover 弹出框"
            }, {
              id: 54,
              value: "card",
              label: "Card 卡片"
            }, {
              id: 55,
              value: "carousel",
              label: "Carousel 走马灯"
            }, {
              id: 56,
              value: "collapse",
              label: "Collapse 折叠面板"
            }]
          }]
        }, {
          id: 57,
          value: "ziyuan",
          label: "资源",
          children: [{
            id: 58,
            value: "axure",
            label: "Axure Components"
          }, {
            id: 59,
            value: "sketch",
            label: "Sketch Templates"
          }, {
            id: 60,
            value: "jiaohu",
            label: "组件交互文档"
          }]
        }]
      }
    },
    settings: {
      type: Object,
      default(){
        return {
          level: "level",
          expandTrigger: "hover", //次级菜单的展开方式
          multiple: false, //是否多选
          checkStrictly: true, // 是否严格的遵守父子节点不互相关联
          emitPath: false, //在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
          lazy: false, //是否动态加载子节点，需与 lazyLoad 方法结合使用
          value: "value", //指定选项的值为选项对象的某个属性值
          label: "label", //指定选项的值为选项对象的某个属性值
          children: "children", //指定选项的值为选项对象的某个属性值
          disabled: "disabled", //"指定选项的禁用为选项对象的某个属性值
          leaf: "leaf" //指定选项的叶子节点的标志位为选项对象的某个属性值
        }
      }
    }
  },
  data() {
    return {
      options: [],
      props: {
        level: "level",
        expandTrigger: "hover", //次级菜单的展开方式
        multiple: false, //是否多选
        checkStrictly: true, // 是否严格的遵守父子节点不互相关联
        emitPath: false, //在选中节点改变时，是否返回由该节点所在的各级菜单的值所组成的数组，若设置 false，则只返回该节点的值
        lazy: false, //是否动态加载子节点，需与 lazyLoad 方法结合使用
        value: "value", //指定选项的值为选项对象的某个属性值
        label: "label", //指定选项的值为选项对象的某个属性值
        children: "children", //指定选项的值为选项对象的某个属性值
        disabled: "disabled", //指定选项的禁用为选项对象的某个属性值
        leaf: "leaf" //指定选项的叶子节点的标志位为选项对象的某个属性值
      },
      list: [] //存储树所有数据
    }
  },
  watch: {
    data: {
      handler(val){
        //解决比 监听 delValue 先执行 导致 数据 没改变的bug
        setTimeout(() => {
          //如果需要删除某部分节点 不走这里
          if (!this.delValue) {
            //深拷贝
            var value = JSON.parse(JSON.stringify(val))
            if (this.maxLevel){ //如果需要限制层级
              this.limitLevel(value, this.maxLevel)
            }
            if (this.delChildren) { //如果需要删除空子元素
              this.clearChildrenField(value)
            }
            this.options = value 
          }
          //深拷贝
          const options = JSON.parse(JSON.stringify(this.options))
          //获取所有元素列表
          this.list = this.getChildren(options)
        }, 300)
      },
      immediate: true
    },
    delValue: {
      handler(val){
        if (!val) {
          //解决bug 点击编辑某个菜单时，下拉选项会去除该菜单数据，关闭弹窗后，再点新增，该下拉选项未变回来。
          this.options = JSON.parse(JSON.stringify(this.data))
          return 
        }
        //深拷贝
        let arr = JSON.parse(JSON.stringify(this.data))
        this.delOneItemById(arr, val)
        arr = this.removeEmptyArrayEle(arr)
        if (this.maxLevel){ //如果需要限制层级
          this.limitLevel(arr, this.maxLevel)
        }
        if (this.delChildren) {
          this.clearChildrenField(arr)
        }
        this.options = arr 
      },
      immediate: true
    }
  },
  created() {
    Object.assign(this.props, this.settings)
  },
  methods: {
    /**
     * @description: 点击触发
     * @param {*} data
     * @param {*} node
     * @return {*}
     * @author: syx
     */
    selectItem(data, node){
      const props = this.props
      // expandTrigger: "hover", //次级菜单的展开方式
      // multiple: false, //是否多选
      // checkStrictly: true, // 是否严格的遵守父子节点不互相关联

      // 如果 配置的是 点击触发
      if (props.expandTrigger === "click") {
        //如果不是叶子节点
        if (data[props.children]) {
          return
        } else { //如果是叶子节点
          this.doneSomeThing(props, data, node)
        }
      } else if (props.expandTrigger === "hover") { // 如果 配置的是 悬浮触发
        //如果不是叶子节点
        if (data[props.children]) {
          //如果严格遵守父子节点互相关联
          if (!props.checkStrictly) {
            this.doneSomeThing(props, data, node)
          } else { //如果非叶子节点可选
            this.doneSomeThing(props, data, node)
          }
        } else { //如果是叶子节点
          this.doneSomeThing(props, data, node)
        }
      }
    },
    doneSomeThing(props, data, node){
      //如果是单选
      if (!props.multiple) {
        if (!props.checkStrictly) {
          return
        }
        if (props.emitPath) {
          this.$emit("input", node.path)
          this.$emit("change", node.path)
        } else {
          this.$emit("input", data[props.value])
          this.$emit("change", data[props.value])
        }
        this.$refs.cascader.dropDownVisible = false
      } else { //多选
        const clickDom = this.judgeClickDOm(event.target)
        clickDom.previousElementSibling.children[0].children[1].click()
      }
    },
    /**
     * @description: 判断点击的元素
     * @param {*} dom
     * @return {*}
     * @author: syx
     */
    judgeClickDOm(dom){
      if (dom.className.indexOf("el-cascader-node__label") > -1){
        return dom
      } else {
        return this.judgeClickDOm(dom.parentNode)
      }
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
      const props = Object.assign(this.props, this.settings)
      for (var i = 0; i < list.length; i++) {
        var item = list[i]
        if (item[props.children] && item[props.children].length > 0) {
          if (item[props.level] === level || item[props.level] === Number(level)){
            delete item[props.children]
          } else {
            this.limitLevel(item[props.children], level)
          }
        }
      }
    },
    /**
     * @description: 删除叶子节点的children字段
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    clearChildrenField(list){
      const props = this.props
      if (!list){
        return
      }
      // 循环遍历列表
      for (let i = 0;i < list.length;i++) {
        //如果没有children 
        if (!list[i][props.children]) {
          continue 
        } else if (list[i][props.children].length > 0) {
          this.clearChildrenField(list[i][props.children])
        } else {
          delete list[i][props.children]
        }
      }
    },
    /**
     * @description: 返回数据类型
     * @param {*} obj
     * @return {*}
     * @author: syx
     */
    getType(obj){
      //tostring会返回对应不同的标签的构造函数
      var toString = Object.prototype.toString
      var map = {
        "[object Boolean]": "boolean", 
        "[object Number]": "number", 
        "[object String]": "string", 
        "[object Function]": "function", 
        "[object Array]": "array", 
        "[object Date]": "date", 
        "[object RegExp]": "regExp", 
        "[object Undefined]": "undefined",
        "[object Null]": "null", 
        "[object Object]": "object"
      }
      if (obj instanceof Element) {
        return "element"
      }
      return map[toString.call(obj)]
    },
    /**
     * @description: 删除某节点
     * @param {type} item 数据对象 id 删除的标识
     * @return {type} 
     * @author: syx
     */    
    delOneItemById(list, delValue){
      const type = this.getType(delValue)
      //比created更早执行
      const props = Object.assign(this.props, this.settings)
      if ((!list || list.length === 0) || (type === "string" && !delValue) || (type === "array" && delValue && delValue.length === 0)){
        return
      }
      // 循环遍历列表
      for (let i = 0;i < list.length;i++) {
        // 如果找到该菜单，则直接删除
        if ((type === "string" && list[i][props.value] === delValue) || (type === "array" && delValue.includes(list[i][props.value]))) {
          //先将该项设置为 "" 然后再删除 空选项
          list[i] = ""
        } else {
          // 如果该菜单的子菜单不为空，则遍历继续删除
          if (list[i][props.children] && list[i][props.children].length > 0) {
            this.delOneItemById(list[i][props.children], delValue)
          }
        }
      }
    },
    /**
     * @description: 去除空的元素
     * @param {*} arr
     * @return {*}
     * @author: syx
     */
    removeEmptyArrayEle(arr){    
      //比created更早执行
      const props = Object.assign(this.props, this.settings)
      for (var i = 0; i < arr.length; i++) {
        if (!arr[i]) {
          arr.splice(i, 1)
          i = i - 1 // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
          // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
        } else if (arr[i][props.children] && arr[i][props.children].length > 0) {
          arr[i][props.children] = this.removeEmptyArrayEle(arr[i][props.children])
        }
      }
      return arr
    },
    /**
     * @description: 获取所有叶子节点
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getChildren(nodes){
      const props = this.props
      var r=[]
      if (Array.isArray(nodes)) {
        for (var i=0, l=nodes.length; i<l; i++) {
          const item = nodes[i]
          r.push(item) // 取每项数据放入一个新数组
          if (Array.isArray(item[props.children])&&item[props.children].length>0){
          // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
            r = r.concat(this.getChildren(item[props.children])) 
            item[props.children] = [] //最后有children的 不可点击
          }
          // delete item[props.children]  注释掉此行代码 把children字段保留 用于 后面判断是否是最后一级
        }
      }
      return r
    },
    /**
     * @description: 返回数据列表
     * @param {*}
     * @return {*}
     * @author: syx
     */
    getDataList() {
      return this.list
    },
    /**
     * @description: 
     * @param {*}
     * @return {*}
     * @author: syx
     */
    getDataMap() {
      const dataMap = {}
      const props = Object.assign(this.props, this.settings)
      for (let i = 0; i < this.list.length; i++){
        dataMap[this.list[i][props.value]] = this.list[i]
      }
      return dataMap
    },
    /**
     * @description: 返回实例
     * @param {*}
     * @return {*}
     * @author: syx
     */ 
    getCascader() {
      return this.$refs.cascader
    }

  }
}
</script>

<style>
</style>

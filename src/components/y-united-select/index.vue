<template>
  <el-cascader ref="select" class="united-select-component" size="small" :props="props" v-on="$listeners" :options="options" v-bind="$attrs" @change="change">
    <template slot-scope="{ data }">
      <div :class="{'united-select-component-span':true, 'disabled': data.disabled}" @click.prevent="change(data[props.value])">
        <span>{{ data[props.label] }}</span>
        <!-- <span v-if="data[props.children]"> ({{ data[props.children].length }}) </span> -->
      </div>
    </template>
  </el-cascader>
</template>

<script>
// import { deepClone } from "@utils/deep-copy"
export default {
  name: "united-select",
  props: {
    //最大层级  1 最大2层  2  最大3层
    maxLevel: {
      type: String,
      default: ""
    },
    delId: {
      type: String,
      default: ""
    },
    delChildren: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default(){
        return []
      }
    },
    settings: {
      type: Object,
      default(){
        return {}
      }
    },
    defaultSettings: {
      type: Object,
      default() {
        return {
          level: "level",
          expandTrigger: "hover",
          checkStrictly: true,
          children: "children",
          emitPath: false,
          label: "label",
          value: "value",
          placeholder: "请选择"
        }
      }
    },
    keyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      props: "",
      list: [] //存储树所有数据
    }
  },
  computed: {},
  watch: {
    data: {
      handler(val){
        //解决比 监听 delId 先执行 导致 数据 没改变的bug
        setTimeout(() => {
          //深拷贝
          var value = JSON.parse(JSON.stringify(val))
          //如果需要删除某部分节点 不走这里
          if (!this.delId) {

            console.log("没有delId，渲染数据")
            if (this.maxLevel){ //如果需要限制层级
              this.limitLevel(value, this.maxLevel)
            }
            if (this.delChildren) { //如果需要删除空子元素
              this.clearChildrenField(value)
            }
            this.options = value 
          }
          //深拷贝
          const options = JSON.parse(JSON.stringify(value))
          //获取所有元素列表
          this.list = this.getChildren(options)
        }, 300)
      },
      immediate: true
    },
    delId: {
      handler(val){
        if (!val) {
          console.log("delID为空，返回")
          //解决bug 点击编辑某个菜单时，下拉选项会去除该菜单数据，关闭弹窗后，再点新增，该下拉选项未变回来。
          this.options = JSON.parse(JSON.stringify(this.data))
          return 
        }
        //深拷贝
        const arr = JSON.parse(JSON.stringify(this.data))
        // const arr = deepClone(this.data)
        this.clearSelfMenu(arr, val)
        if (this.delChildren) {
          this.clearChildrenField(arr)
        }
        this.options = arr 
      },
      immediate: true
    }
  },
  created() {
    const props = Object.assign(this.defaultSettings, this.settings)
    this.props = props
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
      const props = Object.assign(this.defaultSettings, this.settings)
      for (var i = 0; i < list.length; i++) {
        var item = list[i]
        if (item[props.children] && item[props.children].length > 0) {
          if (item[props.level] === level){
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
      const props = Object.assign(this.defaultSettings, this.settings)
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
     * @description: 删除某节点
     * @param {type} item 数据对象 id 删除的标识
     * @return {type} 
     * @author: syx
     */    
    clearSelfMenu(list, menuId){
      const props = Object.assign(this.defaultSettings, this.settings)
      if (!list || !menuId){
        return
      }
      // 循环遍历列表
      for (let i = 0;i < list.length;i++) {
        // 如果找到该菜单，则直接删除
        if (list[i][props.value] === menuId) {
          list.splice(i, 1)
        } else {
          // 如果该菜单的子菜单不为空，则遍历继续删除
          if (list[i][props.children] && list[i][props.children].length > 0) {
            this.clearSelfMenu(list[i][props.children], menuId)
          }
        }
      }
    },
    /**
     * @description: 获取所有叶子节点
     * @param {type} 
     * @return {type} 
     * @author: syx
     */
    getChildren(nodes){
      const props = Object.assign(this.defaultSettings, this.settings)
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
    change(val){
      const props = Object.assign(this.defaultSettings, this.settings)
      const item = this.list.find(item => { return item[this.props.value] === val })
      if (item[props.children] && !props.checkStrictly) {
        event.preventDefault()
        return 
      }
      const callbackData = this.keyValue ? item : val
      this.$emit("input", val)
      this.$emit("codeChange", callbackData)
      this.$refs.select.dropDownVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.disabled{
  cursor: not-allowed;
}
</style>

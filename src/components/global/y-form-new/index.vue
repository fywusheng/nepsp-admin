<template>
  <div>
    <el-form ref="generateForm" label-suffix="" :size="data.config.size" :model="models" :rules="rules" :label-position="data.config.labelPosition" :label-width="data.config.labelWidth + 'px'">
      <template v-for="item in data.list">
        <template v-if="item.type == 'title'">
           <y-title :key="item.type" :content="item.options.title" class="form-title"></y-title>
        </template>
        <template v-else-if="item.type == 'button'">
          <div :style="setButtonPosition(item.options)" :key="item.key">
            <el-button :style="setButtonStyle(item.options)" :key="item.icon" :class="item.options.icon" :type="item.options.type" @click="buttonClick(item.options.btnClick)">{{item.options.title}}</el-button>
          </div>
        </template>
        <template v-else-if="item.type == 'grid'">
          <el-row :key="item.key" type="flex" :gutter="item.options.gutter ? item.options.gutter : 0" :justify="item.options.justify" :align="item.options.align">
            <el-col v-for="(col, colIndex) in item.columns" :key="colIndex" :span="col.span">
              <template v-for="citem in col.list">
                <el-form-item v-if="citem.type=='blank'" :label="citem.name" :prop="citem.model" :key="citem.key">
                  <slot :name="citem.model" :model="models"></slot>
                </el-form-item>
                <template v-else-if="citem.type == 'button'">
                  <div :style="setButtonPosition(citem.options)" :key="citem.key"  v-show="!citem.options.hidden">
                    <el-button :style="setButtonStyle(citem.options)" :key="citem.icon" :class="citem.options.icon" :type="citem.options.type" @click="buttonClick(citem.options.btnClick)">{{citem.options.title}}</el-button>
                  </div>
                </template>
                <genetate-form-item  @change="eventChange"  v-show="!citem.options.hidden" v-else :key="citem.key" :models.sync="models" :remote="remote" :rules="rules" :widget="citem" @input-change="onInputChange">
                </genetate-form-item>
              </template>
            </el-col>
          </el-row>
        </template>

        <template v-else-if="item.type == 'blank'">
          <el-form-item :label="item.name" :prop="item.model" :key="item.key">
            <slot :name="item.model" :model="models"></slot>
          </el-form-item>
        </template>

        <template v-else>
          <genetate-form-item @change="eventChange"  v-show="!item.options.hidden" :key="item.key" :models.sync="models" :rules="rules" :widget="item" @input-change="onInputChange" :remote="remote">
          </genetate-form-item>
        </template>

      </template>
    </el-form>
  </div>
</template>

<script>
import GenetateFormItem from "./componenets/GenerateFormItem"
export default {
  name: "y-form",
  components: {
    GenetateFormItem
  },
  props: ["data", "remote", "value", "insite"],
  data() {
    return {
      models: {},
      rules: {},
      presonalChange: false//是否是人为改变
    }
  },
  computed: {

  },
  created() {
    this.generateModle(this.data.list)
  },
  mounted() {
  },
  methods: {
    eventChange(val){
      if (val.changeEvent){
        this.$emit(val.changeEvent, val.val)
      }
    },
    /**
     * @description: 设置按钮位置
     * @param {type} 
     * @return: 
     * @author: syx
     */        
    setButtonPosition(val) {
      const buttonPosition = val.buttonPosition
      let buttonStyle = {}
      switch (buttonPosition) {
      case "左对齐":
        buttonStyle = {
          "text-align": "left"
        }
        break
      case "居中":
        buttonStyle = {
          "text-align": "center"
        }
        break
      case "右对齐":
        buttonStyle = {
          "text-align": "right"
        }
        break
      default:
        break
      }
      return buttonStyle
    },
    /**
     * @description:  // 设置按钮左右边距
     * @param {type} 
     * @return: 
     * @author: syx
     */
    setButtonStyle(val) {
      return {
        "margin-left": val.marginLeft + "px",
        "margin-right": val.marginRight + "px"
      }
    },
    buttonClick(btnClick) {
      alert(btnClick)
      this.$emit(btnClick)
    },
    /**
     * @description: 生成models，用于数据绑定
     * @param {type} 
     * @return: 
     * @author: syx
     */
    generateModle(genList) {
      //解决当改变hiden状态时，选项变成默认值的bug
      if (this.presonalChange){
        return
      }
      this.presonalChange = false

      for (let i = 0; i < genList.length; i++) {
        //如果是栅格，进去后在递归
        if (genList[i].type === "grid") {
          genList[i].columns.forEach(item => {
            this.generateModle(item.list)
          })
        } else {
          //如果存在默认值，设置该值为默认值
          if (this.value && Object.keys(this.value).indexOf(genList[i].model) >= 0) {
            this.models[genList[i].model] = this.value[genList[i].model]
          } else {
            if (genList[i].type === "blank") {
              this.$set(this.models, genList[i].model, genList[i].options.defaultType === "String" ? "" : (genList[i].options.defaultType === "Object" ? {} : []))
            } else {
              this.models[genList[i].model] = genList[i].options.defaultValue
            }
          }

          if (this.rules[genList[i].model]) {

            this.rules[genList[i].model] = [...this.rules[genList[i].model], ...genList[i].rules.map(item => {
              if (item.pattern) {
                return { ...item, pattern: eval(item.pattern) }
              } else {
                return { ...item }
              }
            })]
          } else {

            this.rules[genList[i].model] = [...genList[i].rules.map(item => {
              if (item.pattern) {
                return { ...item, pattern: eval(item.pattern) }
              } else {
                return { ...item }
              }
            })]
          }
        }
      }
    },
    getData() {
      delete this.models.title
      delete this.models.button
      return new Promise((resolve, reject) => {
        this.$refs.generateForm.validate(valid => {
          if (valid) {
            resolve(this.models)
          } else {
            reject(new Error(this.$t("fm.message.validError")).message)
          }
        })
      })
    },
    reset() {
      this.$refs.generateForm.resetFields()
    },
    onInputChange(value, field) {
      this.$emit("on-change", field, value, this.models)
    },
    refresh() {

    },
    /**
     * @description: 改变数据方法
     * @param {type} type：改变数据的属性  arr  需要改变的表单数组  yesOrNo 设置为true 或 false
     * @return: 
     * @author: syx
     */
    changeData(type, arr, yesOrNo){
      const list = this.data.list
      for (let i = 0, len = arr.length; i < len; i++){
        const arrItem = arr[i]
        const showItem = list.find(item => { return item.model === arrItem })
        showItem.options[type] = yesOrNo
        console.log("changeData ->  showItem.options[type]", showItem.options[type])
        this.presonalChange = true
      }
    },
    /**
     * @description: 隐藏
     * @param {type} 
     * @return: 
     * @author: syx
     */
    hide(arr){
      this.changeData("hidden", arr, true)
    },
    /**
     * @description: 展示
     * @param {type} 
     * @return: 
     * @author: syx
     */
    show(arr){
      this.changeData("hidden", arr, false)
    },
    /**
     * @description: 禁用或取消禁用
     * @param {type} 
     * @return: 
     * @author: syx
     */
    disabled(arr, yesOrNo){
      this.changeData("disabled", arr, yesOrNo)
    },
    /**
     * @description: 设置数据方法
     * @param {type} 
     * @return: 
     * @author: syx
     */
    setData(obj){
      console.log("setData -> this.models", this.models)
      Object.assign(this.models, obj)
    }
  },
  watch: {
    data: {
      deep: true,
      handler(val) {
        this.generateModle(val.list)
      }
    },
    value: {
      deep: true,
      handler(val) {
        console.log(JSON.stringify(val))
        this.models = { ...this.models, ...val }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '../styles/cover.scss';
.form-title {
  font-size: 15px;
  font-weight: bold;
  padding: 10px 0;
  border-bottom: 1px solid #f1f1f1;
  margin-bottom: 16px;
}
::v-deep .el-radio{
  line-height: 28px;
}
</style>

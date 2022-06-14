<template>
  <el-form-item :label="widget.name" :prop="widget.model">
    <template v-if="widget.type == 'input'">
      <el-input v-if="widget.options.dataType == 'number' || widget.options.dataType == 'integer' || widget.options.dataType == 'float'" type="number" v-model.number="dataModel" :placeholder="widget.options.placeholder" :style="{width: widget.options.width}" :disabled="widget.options.disabled"></el-input>
      <el-input v-else  @change="selectChange" :readonly="widget.options.readonly" :type="widget.options.dataType" :clearable="widget.options.clearable" v-model="dataModel" :disabled="widget.options.disabled" :placeholder="widget.options.placeholder" :style="{width: widget.options.width}"></el-input>
    </template>

    <template v-if="widget.type == 'password'">
      <el-input v-model="dataModel" :style="{width: widget.options.width}" :disabled="widget.options.disabled" :type="passwordType" :placeholder="widget.options.placeholder" name="password" tabindex="2" auto-complete="on" />
      <span class="show-pwd" @click="showPwd">
        <i :class="[passwordType === 'password' ? 'iconfont icon-hidden' : 'el-icon-view' ]"></i>
      </span>
    </template>

    <template v-if="widget.type == 'textarea'">
      <el-input type="textarea"  @change="selectChange" :readonly="widget.options.readonly" :resize="widget.options.resize" :rows="widget.options.rows" v-model="dataModel" :clearable="widget.options.clearable" :disabled="widget.options.disabled" :placeholder="widget.options.placeholder" :style="{width: widget.options.width}"></el-input>
    </template>

    <template v-if="widget.type == 'number'">
      <el-input-number v-model="dataModel"  @change="selectChange" :style="{width: widget.options.width}" :step="widget.options.step" controls-position="right" :disabled="widget.options.disabled"></el-input-number>
    </template>

    <template v-if="widget.type == 'radio'">
      <el-radio-group v-model="dataModel"  @change="selectChange" :style="{width: widget.options.width}" :disabled="widget.options.disabled">
        <el-radio :style="{display: widget.options.inline ? 'inline-block' : 'block'}" :label="item.value" v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="index">
          <template v-if="widget.options.remote">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="widget.type == 'checkbox'">
      <el-checkbox-group  @change="selectChange" v-model="dataModel" :style="{width: widget.options.width}" :disabled="widget.options.disabled">
        <el-checkbox :style="{display: widget.options.inline ? 'inline-block' : 'block'}" :label="item.value" v-for="(item, index) in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="index">
          <template v-if="widget.options.remote">{{item.label}}</template>
          <template v-else>{{widget.options.showLabel ? item.label : item.value}}</template>
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="widget.type == 'time'">
      <el-time-picker v-model="dataModel"  @change="selectChange" range-separator="至" :is-range="widget.options.isRange" :placeholder="widget.options.placeholder" :start-placeholder="widget.options.startPlaceholder" :end-placeholder="widget.options.endPlaceholder" :readonly="widget.options.readonly" :disabled="widget.options.disabled" :editable="widget.options.editable" :clearable="widget.options.clearable" :arrowControl="widget.options.arrowControl" :value-format="widget.options.format" :style="{width: widget.options.width}">
      </el-time-picker>
    </template>

    <template v-if="widget.type=='date'">
      <el-date-picker v-model="dataModel"  @change="selectChange" range-separator="至" :type="widget.options.type" :placeholder="widget.options.placeholder" :start-placeholder="widget.options.startPlaceholder" :end-placeholder="widget.options.endPlaceholder" :readonly="widget.options.readonly" :disabled="widget.options.disabled" :editable="widget.options.editable" :clearable="widget.options.clearable" :value-format="widget.options.timestamp ? 'timestamp' : widget.options.format" :format="widget.options.format" :style="{width: widget.options.width}">
      </el-date-picker>
    </template>

    <template v-if="widget.type =='rate'">
      <el-rate v-model="dataModel"  @change="selectChange" :max="widget.options.max" :disabled="widget.options.disabled" :allow-half="widget.options.allowHalf"></el-rate>
    </template>

    <template v-if="widget.type == 'color'">
      <el-color-picker v-model="dataModel"  @change="selectChange" :disabled="widget.options.disabled" :show-alpha="widget.options.showAlpha"></el-color-picker>
    </template>

    <template v-if="widget.type == 'select'">
      <el-select v-model="dataModel"  @change="selectChange"  :disabled="widget.options.disabled" :multiple="widget.options.multiple" :clearable="widget.options.clearable" :placeholder="widget.options.placeholder" :style="{width: widget.options.width}" :filterable="widget.options.filterable">
        <el-option v-for="item in (widget.options.remote ? widget.options.remoteOptions : widget.options.options)" :key="item.value" :value="item.value" :label="widget.options.showLabel || widget.options.remote?item.label:item.value"></el-option>
      </el-select>
    </template>

    <template v-if="widget.type=='switch'">
      <el-switch  @change="selectChange" v-model="dataModel" :disabled="widget.options.disabled">
      </el-switch>
    </template>

    <template v-if="widget.type=='slider'">
      <el-slider v-model="dataModel"  @change="selectChange" :min="widget.options.min" :max="widget.options.max" :disabled="widget.options.disabled" :step="widget.options.step" :show-input="widget.options.showInput" :range="widget.options.range" :style="{width: widget.options.width}"></el-slider>
    </template>

    <template v-if="widget.type=='imgupload'">
      <uploadImg  v-model="dataModel"></uploadImg>
      <!-- <el-upload v-model="dataModel" :disabled="widget.options.disabled" :style="{'width': widget.options.width}" :width="widget.options.size.width" :height="widget.options.size.height" token="xxx" domain="xxx"> -->
      <!-- </el-upload> -->
    </template>

    <template v-if="widget.type == 'editor'">
      <vue-editor v-model="dataModel" :style="{width: widget.options.width}">
      </vue-editor>
    </template>

    <template v-if="widget.type == 'cascader'">
      <el-cascader v-model="dataModel"  @change="selectChange" :props="widget.options.configs" collapse-tags :disabled="widget.options.disabled" :clearable="widget.options.clearable" :placeholder="widget.options.placeholder" :style="{width: widget.options.width}" :options="widget.options.remoteOptions">
      </el-cascader>
    </template>

    <template v-if="widget.type == 'text'">
      <div v-if="widget.options.html" v-html="dataModel"></div>
      <span v-else v-text="dataModel"></span>
    </template>
  </el-form-item>
</template>

<script>
import uploadImg from "./components/uploadImg"
export default {
  name: "genetate-form-item",
  props: ["widget", "models", "rules", "remote"],
  components: {
    uploadImg
  },
  data() {
    return {
      passwordType: "password",
      dataModel: this.models[this.widget.model]
    }
  },
  created() {
    if (this.widget.options.remote && this.remote[this.widget.options.remoteFunc]) {
      this.remote[this.widget.options.remoteFunc]((data) => {
        console.log("created -> data", data)
        this.widget.options.remoteOptions = this.deepCopy(data)  
        console.log("created -> this.widget.options.remoteOptions", this.widget.options.remoteOptions)
      })
    }

    if (this.widget.type === "imgupload" && this.widget.options.isQiniu) {
      this.remote[this.widget.options.tokenFunc]((data) => {
        this.widget.options.token = data
      })
    }
  },
  methods: {
    deepCopy(data){
      if (!data || data.length === 0){
        return 
      }
      return data.map(item => {
        return {
          value: item[this.widget.options.props.value],
          label: item[this.widget.options.props.label],
          children: this.deepCopy(item[this.widget.options.props.children])
        }
      })
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = ""
      } else {
        this.passwordType = "password"
      }
    },
    selectChange(val){
      const value = {
        changeEvent: this.widget.options.changeEvent,
        val
      }
      this.$emit("change", value)
    }
  },
  watch: {
    dataModel: {
      deep: true,
      handler(val) {
        this.models[this.widget.model] = val
        this.$emit("update:models", {
          ...this.models,
          [this.widget.model]: val
        })
        this.$emit("input-change", val, this.widget.model)
      }
    },
    models: {
      deep: true,
      handler(val) {
        this.dataModel = val[this.widget.model]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.show-pwd {
  position: absolute;
  right: 10px;
  font-size: 16px;
  cursor: pointer;
  user-select: none;
}
::v-deep .el-rate__item{
  line-height: 20px;
}
</style>

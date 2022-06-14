<template>
    <div>
        <el-form size="small"  label-width="70px">
            <el-form-item label="底色">
                <el-color-picker v-model="content.color"></el-color-picker>
            </el-form-item>
        </el-form>

        <editor class="richtext-editor" v-model="content.text" :height="590" 
            :style="{
                width : '407px',
                margin: '0 auto',
                backgroundColor: content.color
            }">
        </editor>
    </div>
</template>

<script>
import base from "../base"

export default {
  extends: base,
  contentDefault: {
    text: "",
    color: ""
  },
  methods: {}
}
</script>
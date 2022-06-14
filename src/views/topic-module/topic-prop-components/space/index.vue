<template>
    <div>
        <el-form size="small"  label-width="70px">
            <el-form-item label="高度">
                <el-input v-model="content.height" placeholder="750设计稿的单位像素"></el-input>
            </el-form-item>
            <el-form-item label="颜色">
                <el-color-picker v-model="content.color"></el-color-picker>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import base from "../base"

export default {
  extends: base,
  contentDefault: {
    height: null,
    color: "#f8f8f8"
  }
}
</script>
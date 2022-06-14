<template>
    <div>
        <el-form size="small" label-width="70px">
            <el-form-item label="文本">
                <el-input v-model="content.text"></el-input>
            </el-form-item>
            <el-form-item label="字号">
                <el-input v-model="content.size"></el-input>
            </el-form-item>
            <el-form-item label="文字颜色">
                <el-color-picker v-model="content.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="背景色">
                <el-color-picker v-model="content.bg_color"></el-color-picker>
            </el-form-item>
            <el-form-item label="位置">
                <el-radio-group v-model="content.align">
                    <el-radio label="left">左</el-radio>
                    <el-radio label="center">中</el-radio>
                    <el-radio label="right">右</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="间距">
                <el-input style="width: 80px;" v-model="content.top" placeholder="上"></el-input>
                <el-input style="width: 80px;" v-model="content.right" placeholder="右"></el-input>
                <el-input style="width: 80px;" v-model="content.bottom" placeholder="下"></el-input>
                <el-input style="width: 80px;" v-model="content.left" placeholder="左"></el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import base from "../base"

export default {
  extends: base,
  contentDefault: {
    text: "",
    size: 16,
    color: "#000000",
    bg_color: "#ffffff",
    align: "left"
  }
}
</script>
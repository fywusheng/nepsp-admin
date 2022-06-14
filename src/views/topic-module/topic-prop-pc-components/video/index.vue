<template>
    <div>
        <el-form size="small"  label-width="70px">
            <el-form-item label="视频">
                <el-radio-group v-model="content.type">
                    <el-radio label="qcloud">腾讯云</el-radio>
                    <el-radio label="normal">普通</el-radio>
                </el-radio-group>
                <el-row v-if="content.type === 'qcloud'" type="flex">
                    <el-col :span="18">
                        <el-input v-model="content.video">
                            <div slot="prepend">视频id</div>
                        </el-input>
                    </el-col>
                    <el-col :span="6">
                        <el-button style="float:right;" @click="goUpload()">去上传</el-button>
                    </el-col>
                </el-row>
                <el-input v-if="content.type === 'normal'" v-model="content.video">
                    <div slot="prepend">视频链接</div>
                </el-input>
            </el-form-item>
            <el-form-item label="背景色">
                <el-input size="small"  v-model="content.color" placeholder="#ffffff" :maxlength="7">
                    <div slot="prepend" :style="{background:content.color, width:'34px', height:'34px', margin:'-11px -10px', borderRadius:'4px 0 0 4px'}"></div>
                </el-input>
            </el-form-item>
            <el-form-item label="左右空白">
                <el-input v-model="content.padding">
                    <div slot="append">px</div>
                </el-input>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import base from "../base"

export default {
  extends: base,
  contentDefault: {
    type: "qcloud",
    video: "",
    color: "",
    padding: 15
  },
  methods: {
    goUpload(){
      window.open("https://console.qcloud.com/video/videolist")
    }
  }
}
</script>
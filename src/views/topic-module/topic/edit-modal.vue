<template>
    <div class="create-topic-modal">
        <el-dialog @close="afterClose" :visible.sync="visible" :title="title">
            <el-form label-position="right" label-width="100px" label-suffix=" : ">
                <el-form-item label="专题ID">
                    <el-input v-model="current.page_id" :disabled="isEdit" placeholder="由字母和数字组成, 不填则自动生成"></el-input>
                </el-form-item>
                <el-form-item label="专题名称">
                    <el-input v-model="current.page_name"></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-radio-group v-model="current.category">
                        <el-radio label="h5">移动端</el-radio>
                        <el-radio label="pc">PC</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="show(false)">取消</el-button>
                <el-button type="primary" :loading="sending" :disabled="sending" @click="save">{{sending ?
                    '正在提交...' : saveBtnText}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import topicApi from "@/api/pop/topic"

export default {
  name: "CreateTopicModal",
  props: {
    current: Object,
    origin: Object
  },
  data() {
    return {
      visible: false,
      sending: false,
      isEdit: false
    }
  },
  computed: {
    isCopy(){
      return !!this.origin.page_id
    },
    title() {
      return this.isCopy ? `复制专题 - ${this.origin.page_name}` : this.isEdit ? "编辑专题" : "创建专题"
    },
    saveBtnText() {
      return this.isCopy ? "复制" : this.isEdit ? "保存" : "创建"
    }
  },
  methods: {
    show(visible) {
      this.visible = visible
    },
    setEdit(edit){
      this.isEdit = edit
    },
    save() {
      this.isCopy ? this.copy() : this.isEdit ? this.update() : this.create()
    },
    afterClose() {
      this.$emit("close")
    },
    afterSave() {
      this.$emit("save-done")
      this.show(false)
    },
    async copy() {
      this.sending = true
      const {data: result} = await topicApi.copy(this.origin.page_id, this.current)
      this.sending = false
      if (result.code === 200) {
        this.$message.success("复制成功!")
        this.afterSave()
      } else {
        this.$message.error(result.msg)
      }
    },
    update() {
      //WS.axiosPost(`updateTopic?id=${this.current.page_id}`, this.current, res => {
      //    this.$message.success('专题修改成功!');
      //    this.afterSave();
      //});
    },
    async create() {
      this.sending = true
      const {data: result} = await topicApi.add(this.current)
      this.sending = false
      if (result.code === 200) {
        this.$message.success("专题创建成功!")
        this.afterSave()
      } else {
        this.$message.error(result.msg)
      }
    }
  }
}
</script>

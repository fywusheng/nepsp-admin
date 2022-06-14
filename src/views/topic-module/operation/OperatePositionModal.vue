<template>
  <div class="operate-position-modal">
    <el-dialog :title="title" :visible.sync="visible">

      <el-form label-width="180px" :model="opInfo">

        <el-form-item label="运营位名称" required>
          <el-input v-model="opInfo.name"></el-input>
        </el-form-item>

        <el-form-item label="运营位别名" required>
          <el-input v-model="opInfo.code"></el-input>
          <p class="block-tips">唯一的英文字母或数字组合</p>
        </el-form-item>

        <el-form-item label="平台" required>
          <el-radio name="appType" v-model="opInfo.app_type" :label="1">PC</el-radio>
          <el-radio name="appType" v-model="opInfo.app_type" :label="2">H5</el-radio>
        </el-form-item>

        <el-form-item label="类型" required>
          <el-radio-group v-model="opInfo.type">
            <el-radio :label="positionTypes.IMAGE">图片</el-radio>
            <el-radio :label="positionTypes.IMAGE_LIST">图片列表</el-radio>
            <el-radio :label="positionTypes.NEW_TOPIC">专题</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="[positionTypes.IMAGE, positionTypes.IMAGE_LIST].includes(opInfo.type - 0)">

          <el-form-item label="样式" required>
            <el-radio name="style" v-model="opInfo.style" label="column1">单列</el-radio>
            <el-radio name="style" v-model="opInfo.style" label="column2">双列</el-radio>
            <el-radio name="style" v-model="opInfo.style" label="column3">三格</el-radio>
            <el-radio name="style" v-model="opInfo.style" label="column4">四格</el-radio>
            <el-radio name="style" v-model="opInfo.style" label="column5">5格导航</el-radio>
            <el-radio name="style" v-model="opInfo.style" label="banner">banner</el-radio>
          </el-form-item>
          <el-form-item label="图片间距" required>
            <el-input v-model="opInfo.space_height"></el-input>
          </el-form-item>
          <!--<el-form-item label="间距颜色" required>-->
          <!--<el-input v-model="opInfo.space_color"></el-input>-->
          <!--</el-form-item>-->
        </template>

        <el-form-item label="状态" required>
          <el-radio name="status" v-model="opInfo.status" :label="1">激活</el-radio>
          <el-radio name="status" v-model="opInfo.status" :label="0">未激活</el-radio>
        </el-form-item>

      </el-form>

      <div class="dialog-footer" slot="footer">
        <el-button @click="show(false)">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
import {
  newOperatePos,
  deepClone,
  positionTypes
} from "./operateData"
import operationApi from "@/api/pop/operation"

export default {
  name: "OperatePosModal",
  props: ["operateId"],
  data() {
    return {
      visible: false,
      opInfo: deepClone(newOperatePos),
      positionTypes
    }
  },
  computed: {
    isEdit() {
      return !!this.operateId
    },
    title() {
      const action = this.isEdit ? "编辑" : "录入"
      return `${action}运营位`
    }
  },
  methods: {
    show(isShow) {
      this.visible = isShow
    },
    checkEmpty(field, tips) {
      if (this.opInfo[field] == null || this.opInfo[field] === "") {
        throw new Error(tips)
      }
    },
    validateForm() {
      try {
        this.checkEmpty("name", "请输入运营位名称")
        this.checkEmpty("code", "请输入运营位别名")
        this.checkEmpty("app_type", "请选择平台")
        this.checkEmpty("type", "请选择类型")
        this.checkEmpty("space_height", "请输入间距")
        this.checkEmpty("space_color", "请输入颜色")
        // this.checkEmpty('max_size', '请输入最大展示张数');
        this.checkEmpty("status", "请选择状态")
      } catch (error) {
        this.$message.warning(error.message)
        return
      }

      // const type = this.opInfo.type - 0; // 1 goods, 2 itemgroup, 3 topic
      // try {
      //     if ([positionTypes.IMAGE, positionTypes.IMAGE_LIST].includes(type)) {
      //         this.checkEmpty('img_width', '请输入图片宽度');
      //         this.checkEmpty('img_height', '请输入图片高度');
      //     }
      //
      //     if ([positionTypes.IMAGE, positionTypes.GOODS].includes(type)) {
      //         this.checkEmpty('style', '请选择样式');
      //     }
      // } catch (error) {
      //     this.$message.warning(error.message);
      // }

      return true
    },
    async save() {
      if (!this.validateForm()) {
        return
      }
      const { data: result } = await operationApi[this.isEdit ? "update" : "add"](this.opInfo)
      if (result.code === 200) {
        // reloadTable
        this.$emit("reload-table")
        this.show(false)
        this.$message.success(this.isEdit ? "修改成功" : "录入成功")
      } else {
        this.$message.error(result.msg)
      }
    }

  },
  watch: {
    async operateId() {
      if (this.isEdit) {
        const { data: result } = await operationApi.get(this.operateId)
        if (result.code === 200) {
          const keys = Object.keys(this.opInfo)
          keys.push("id")
          this.opInfo = Object.assign({
            space_height: 30,
            space_color: "#fff"
          }, result.data)

        } else {
          this.$message.error(result.msg)
        }
      } else {
        this.opInfo = Object.assign({
          space_height: 30,
          space_color: "#fff"
        }, deepClone(newOperatePos))
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
.operate-position-modal {
  .el-form-item__label:after {
    content: ':';
  }

  .el-dialog__body {
    max-height: 600px;
    overflow: auto;
  }

  .input-maxsize {
    width: 210px;
  }

  .row-with-two-inputs {
    i {
      font-style: normal;
      margin: 0 10px;
    }

    .el-input {
      width: 120px;
    }
  }

  .mr20 {
    margin-right: 20px;
  }

  .el-dialog__body {
    padding-right: 80px;
  }
}
</style>

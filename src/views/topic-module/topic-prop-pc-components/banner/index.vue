<template>
    <div>
        <operate :content="content" type="image_list" app_type="PC" op-style="banner" @select="onSelect"></operate>
    </div>
</template>

<script>
import base from "../base"
import operate from "@/components/topic-operate-dialog"
import _ from "lodash"
export default {
  extends: base,
  contentDefault: {
    id: null,
    name: "",
    code: ""
  },
  methods: {
    onSelect(item){
      _.assign(this.content, {
        id: item.id,
        name: item.name,
        code: item.code
      })
    }
  },
  components: {
    operate
  }
}
</script>

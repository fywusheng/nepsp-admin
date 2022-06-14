<template>
    <div>
        <!--<el-input size="small" v-if="!params.customItemDisabled" v-model="url" @keyup.native.enter="useCustomItem()"-->
                  <!--placeholder="自定义链接" style="margin-bottom:5px">-->
            <!--<el-button slot="append" @click="useCustomItem()">使用</el-button>-->
        <!--</el-input>-->

        <el-input size="small" suffix-icon="search" v-model="text" placeholder="请输入名称">
            <el-button slot="append" icon="el-icon-search" @click="getList()"></el-button>
        </el-input>

        <el-table size="small" :data="list"  highlight-current-row   @row-click="onSelect" :row-style="getRowStyle" style="margin:5px 0" v-loading="loading">
            <el-table-column label="名称/ID">
                <template slot-scope="scope">
                    <p>
                        <a :href="'#/apps/topic/' + scope.row.page_id" target="_blank" @click.stop style="color:#333">{{scope.row.page_name}}</a>
                    </p>
                    <p>
                        <small style="color:#999">{{scope.row.page_id}}</small>
                    </p>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                small
                layout="pager"
                :current-page="pagination.current"
                :page-size="pagination.size"
                :total="pagination.total"
                @current-change="getList">
        </el-pagination>
    </div>
</template>

<script>
import topicApi from "@/api/pop/topic"

export default {
  props: {
    params: Object,
    default() {
      return {
        customItemDisabled: false
      }
    }
  },
  data() {
    return {
      url: "",
      text: "",
      pagination: {
        size: 5,
        current: 1,
        total: 0
      },
      list: [],
      loading: false
    }
  },
  methods: {
    async getList(page = 1) {
      this.pagination.current = page
      this.loading = true
      const params = {
        page_name: this.text,
        pageFrom: this.pagination.current,
        pageSize: this.pagination.size
      }
      if (this.$route.name === "topicEditor"){
        params.category = "h5"
      } else if (this.$route.name === "topicPcEditor"){
        params.category = "pc"
      }
      const {data: result} = await topicApi.list(params)
      this.loading = false
      if (result.code === 200) {
        this.list = result.data.rows
        this.pagination.total = result.data.total
      }
    },
    onSelect(row) {
      this.$emit("select", {
        type: "topic",
        label: "专题",
        id: row.page_id,
        desc: row.page_name
        //meta: row
      })
    },
    getRowStyle(row) {
      return {
        height: "60px",
        cursor: "pointer"
      }
    },
    useCustomItem() {
      this.$emit("select", {
        type: "url",
        label: "自定义",
        desc: "自定义",
        url: this.url
      })
    }
  },
  mounted() {
    this.getList()
  }
}
</script>

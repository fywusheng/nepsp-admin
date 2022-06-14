<script>
import {systemApi} from "@/api"
export default {
  created() {
    const { fullPath } = this.$route
    systemApi.getAllLeavesNodePath().then(data => {
      const name = data.data.includes(fullPath) ? "page401" : "page404"
      this.$router.replace({name})
    })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
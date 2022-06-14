module.exports = {
  vueTemplate: compoenntName => {
    return `<template>
<div class="${compoenntName}">${compoenntName}组件</div>
</template>
<script>
export default {
  name: '${compoenntName}',
  data(){
    return{

    }
  },
  computed: {
  },
  mounted () {
  },
  created(){

  },
  methods:{
    
  },
 
}
</script>
<style lang="scss" scoped>
.${compoenntName} {

}
</style>`
  },
  entryTemplate: `import Main from './main.vue' 
  export default Main`
}

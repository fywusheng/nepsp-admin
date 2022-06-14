import yloadingPlus from "./index.vue"
const obj = {}

obj.install = function(Vue) {
  // 1、创建组件构造器
  const yloadingPlusConstructor = Vue.extend(yloadingPlus)
  // 2、根据构造器通过new的方式可以创建出一个组件实例
  const _yloadingPlus = new yloadingPlusConstructor()
  // 3、将组件对象手动挂载到某一个元素上采用$mount
  _yloadingPlus.$mount(document.createElement("div"))
  // 4、_yloadingPlus.$el对应的就是这个div，将它添加到body中
  document.body.appendChild(_yloadingPlus.$el)
  // 5、绑定到vue的原型链上
  Vue.prototype.$Loading = _yloadingPlus
}

export default obj
// 运营位内容页公共的方法和Vue资源

export default {
  filters: {
    typeText(i) {
      var types = ["", "图片", "商品", "图片列表", "新专题"]
      return types[i] || ""
    },
    statusText(i) {
      var statuses = ["失效中", "启用中"]
      return statuses[i] || ""
    },
    appTypeText(i) {
      return ["PC", "H5"][i-1]
    },
    statusBtnText(i) {
      const btnTextes = ["启用", "失效"]
      return btnTextes[i] || ""
    }
  }
}

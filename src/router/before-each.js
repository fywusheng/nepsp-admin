// 演示替换到维修升级页面
function beforeEachToExample(to, from, next) {
  const pathMap = {
    "/home": "/exception?page=1&noheader=true"
  }
  if (pathMap[to.path]) {
    next(pathMap[to.path])
  } else {
    next()
  }
}
export {
  beforeEachToExample
}

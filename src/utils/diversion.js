import eventBus from './eventbus'

const defaultConfig = {
  count: 3, // 每次最多执行条数 必须>0
  time: 100, // 每次执行间隔
  maxClearLevel: 0 // 等级大于0的不会被清除
}
var fns = []
var count = 0
var hasTimeout = false
// 发布函数
function release () {
  if (defaultConfig.count < 0) return console.error('defaultConfig.count不合法') // 防止死循环

  if (count < defaultConfig.count) {
    // 取下队列第一个
    let fn = fns.shift()
    if (!fn) return
    // 判断当前请求是否可以发送
    let canSend = getCanSend(fn)
    if (canSend) {
      count++
      send(fn)
    }
    release()
  } else if (!hasTimeout) {
    hasTimeout = true
    setTimeout(() => {
      hasTimeout = false
      count = 0
      release()
    }, defaultConfig.time)
  }
}

function send (fn) {
  return fn && fn.req().then(fn.resolve).catch(fn.reject)
}

// 防抖函数
function diversion (req) {
  let result = new Promise((resolve, reject) => {
    setTimeout(() => {
      let {href} = window.location
      // 储存请求
      let level = result.level || 0
      fns.push({req, resolve, reject, href, level})
      fns.sort((a, b) => {
        return b.level - a.level
      })
      // 发布请求
      setTimeout(release, 100)
    })
  })
  result.setLevel = function (level) {
    result.level = level
    return result
  }
  return result
}

// 判断请求是否可以发送
function getCanSend ({req, resolve, reject, href, level}) {
  if (level > defaultConfig.maxClearLevel) return true
  let {href: currentHref} = window.location
  return currentHref.indexOf(href) === 0
}

export default diversion

export const cancelDiversion = function () {
  fns = []
}

eventBus.$on('accessTokenExpire', () => {
  cancelDiversion()
})

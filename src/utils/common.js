import Cookies from 'js-cookie'


/**
 * @msg: 存取token
 * @param {string} token
 */

let cookieExpires = 1 //天数
export const TOKEN_KEY = 'token'
export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: cookieExpires || 1
  })
}
export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) {
    return token
  } else {
    return false
  }
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = (url) => {
  const keyValueArr = url.split('?')[1].split('&')
  let paramObj = {}
  keyValueArr.forEach(item => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const hasKey = (obj, key) => {
  if (key) {
    return key in obj
  } else {
    const keysArr = Object.keys(obj)
    return keysArr.length
  }
}

/**
 * @param {string} str 时间格式 具体看代码
 * @return: string
 * 将一个字符串转换为数组
 * 传入参数为string，返回一个数组
 */
export const toArr = (str) => {
  var patrn = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;
  var arr = str.split(patrn);
  var srr = [];
  for (let index = 0; index < arr.length; index++) {
    srr.push(arr[index]);
  }
  return srr;
}


/**
 * @msg: 获取系统当前时间
 * @param {string} fmt 时间格式 具体看代码
 * @return: string
 */
export const getDate = (fmt) => {
  let time = ''
  const date = new Date()
  const o = {
    "M+": date.getMonth() + 1, // 月份 
    "d+": date.getDate(), // 日 
    "H+": date.getHours(), // 小时 
    "m+": date.getMinutes(), // 分 
    "s+": date.getSeconds(), // 秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度 
    "S": date.getMilliseconds() // 毫秒 
  }
  if (/(y+)/.test(fmt)) {
    time = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      time = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }
  return time
}

/**
 * @msg: 获取系统当前时间
 * @param {string} date 时间
 * @param {string} fmt 时间格式
 * @return: string
 */
export const formatDate = (date, fmt) => {
  let time = ''
  const o = {
    "M+": date.getMonth() + 1, // 月份 
    "d+": date.getDate(), // 日 
    "H+": date.getHours(), // 小时 
    "m+": date.getMinutes(), // 分 
    "s+": date.getSeconds(), // 秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), // 季度 
    "S": date.getMilliseconds() // 毫秒 
  }
  if (/(y+)/.test(fmt)) {
    time = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      time = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)))
    }
  }
  return time
}

/**
 * 校验手机号是否正确
 * @param phone 手机号
 */

export const verifyPhone = (phone) => {
  const reg = /^1[34578][0-9]{9}$/
  const _phone = phone.toString().trim()
  let toastStr = _phone === '' ? '手机号不能为空~' : !reg.test(_phone) && '请输入正确手机号~'
  return {
    errMsg: toastStr,
    done: !toastStr,
    value: _phone
  }
}

export const verifyStr = (str, text) => {
  const _str = str.toString().trim()
  const toastStr = _str.length ? false : `请填写${text}～`
  return {
    errMsg: toastStr,
    done: !toastStr,
    value: _str
  }
}

// 截取字符串
export const sliceStr = (str, sliceLen) => {
  if (!str) {
    return ''
  }
  let realLength = 0
  const len = str.length
  let charCode = -1
  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i)
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1
    } else {
      realLength += 2
    }
    if (realLength > sliceLen) {
      return `${str.slice(0, i)}...`
    }
  }

  return str
}


/**
 * JSON 克隆
 * @param {Object | Json} jsonObj json对象
 * @return {Object | Json} 新的json对象
 */
export function objClone(jsonObj) {
  let buf
  if (jsonObj instanceof Array) {
    buf = []
    let i = jsonObj.length
    while (i--) {
      buf[i] = objClone(jsonObj[i])
    }
    return buf
  } else if (jsonObj instanceof Object) {
    buf = {}
    for (let k in jsonObj) {
      buf[k] = objClone(jsonObj[k])
    }
    return buf
  } else {
    return jsonObj
  }
}
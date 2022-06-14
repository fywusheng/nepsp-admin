import axios from "axios"
import { getRefreshToken, getToken, setRefreshToken, setToken } from "@/utils/auth"
import { message } from "@utils/resetMessage"
import { MessageBox } from "element-ui"
import {refresh} from "@api/modules/user"
import store from "@/store"
const CLIENT_TIMEOUT = process.env.VUE_APP_TIMEOUT || 8000//链接时间
// const API_BASEURL = (process.env.NODE_ENV === "development" && eval(process.env.VUE_APP_ENABLE_MOCK)) ? "/mock" : process.env.BASE_URL //基础请求路径
const API_BASEURL = (process.env.NODE_ENV === "development" && eval(process.env.VUE_APP_ENABLE_MOCK)) ? "/mock" : process.env.BASE_URL //基础请求路径

const service = axios.create({
  baseURL: API_BASEURL,
  timeout: CLIENT_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    "tsf-metadata": ""
  },
  transformRequest: eval(!process.env.VUE_APP_TEST_LOCAL) ? [function(data){ return JSON.stringify(data) }] : [function(data) {
    //如果是form-data 方式 直接返回data
    if (data instanceof FormData) {
      return data
    }
    // 对 data 进行任意转换处理
    return JSON.stringify({
      data: data || {}
    })
  }]
})

//请求
service.interceptors.request.use(config => {
  const token = getToken()
  if (token) {
    config.headers["accesstoken"] = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

//响应拦截
service.interceptors.response.use(response => {
  const res = response.data
  // if the custom code is not 200, it is judged as an error.
  if (response.status !== 200) {
    message({
      message: res.message || "Error",
      type: "error",
      duration: 5 * 1000
    })
    return Promise.reject(new Error(res.message || "Error"))
  } else {
    if (res.code === 600003) { // token过期  使用refreshtoken去刷新token
      message.warning("登录凭证已过期")
      const refreshToken = getRefreshToken()
      refresh({refreshToken}).then(data => {
        const responseData = data.data
        if (responseData.code === 0) {
          setToken(responseData.accessToken)
          setRefreshToken(responseData.refreshToken)
          window.location.reload()
        }
      })
    } else if (res.code === 600009 || res.code === 600002 || res.code === 600016){ // 600009,"刷新token已无效" 600002, token格式错误 600016有其他设备已登录，请重新登录
      const msgList = {
        600009: "登录已失效，请重新登录",
        600002: "登录已失效，请重新登录",
        600016: "用户在其他设备登录，请重新登录"
      }
      const msg = msgList[res.code]
      MessageBox.alert(msg, "提示", {
        confirmButtonText: "确定",
        showClose: false,
        type: "error",
        callback: action => {
          // 二次刷新token失败以后，或者token格式错误的时候直接重新登陆
          store.dispatch("user/resetToken")
          window.location.reload()
        }
      })
    } else if (res.code !== 0){
      message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000
      })
      return Promise.reject(new Error(response.data.message || "Error"))
    } else {
      return res
    }
  }
}, error => {
  return Promise.reject(error)
})
export default service

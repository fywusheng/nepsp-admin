/*
 * @Description: 封装全局请求方法
 * @Version: //
 * @Autor: syx
 * @Date: 2021-01-04 10:26:35
 * @LastEditors: syx
 * @LastEditTime: 2021-01-04 18:47:24
 */
import axiosRequest from "./common-axios"
const GLOBAL_REQUEST_OBJ = {}
function request(name, params) {
  return new Promise((resolve, reject) => {
    if (GLOBAL_REQUEST_OBJ[name] && GLOBAL_REQUEST_OBJ[name] !== "ready") {
      return
    }
    GLOBAL_REQUEST_OBJ[name] = "requesting"
    axiosRequest(params).then(result => {
      GLOBAL_REQUEST_OBJ[name] = "ready"
      resolve(result)
    }).catch(err => {
      GLOBAL_REQUEST_OBJ[name] = "ready"
      reject(err)
    })
  })
}

["get", "post"].forEach(type => {
  request[type] = (name, ...params) => {
    return new Promise((resolve, reject) => {
      if (GLOBAL_REQUEST_OBJ[name] && GLOBAL_REQUEST_OBJ[name] !== "ready") {
        return
      }
      GLOBAL_REQUEST_OBJ[name] = "requesting"
      axiosRequest[type].apply(this, params).then(result => {
        GLOBAL_REQUEST_OBJ[name] = "ready"
        resolve(result)
      }).catch(err => {
        GLOBAL_REQUEST_OBJ[name] = "ready"
        reject(err)
      })
    })
  }
})

export default request
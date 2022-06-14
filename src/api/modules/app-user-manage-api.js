import request from "../common-axios"
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"

/**
 * @description: 查看市民用户详情
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function userDetail(params = {}, options = {}) {
  return request.post(path + "/nun/api/userWeb/userDetail", params, options).then(result => {
    return result
  })
}

/**
 * @description: 获取用户扫码记录
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function userDetailScanList(params = {}, options = {}) {
  return request.post(path + "/nun/api/userWeb/userDetailScanList", params, options).then(result => {
    return result
  })
}

/**
 * @description: 查看市民用户列表数据，分页查询接口
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function findUserPage(params = {}, options = {}) {
  return request.post(path + "/nun/api/userWeb/findUserPage", params, options).then(result => {
    return result
  })
}

/**
 * @description: 重置密码
 * @param {type} 
 * @return {type} 
 * @author: syx
 */

export function resetPwd(params = {}, options = {}) {
  return request.post(path + "/nun/api/userWeb/alterLoginPwd", params, options).then(result => {
    return result
  })
}

/**
 * @description: 删除用户
 * @param {type} 
 * @return {type} 
 * @author: syx
 */

export function deleteUser(params = {}, options = {}) {
  return request.post(path + "/nun/api/userWeb/deleteUser", params, options).then(result => {
    return result
  })
}
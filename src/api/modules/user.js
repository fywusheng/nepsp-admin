import yRequest from "../request"
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "api/common" : "/nepsp-api/common"

/**
 * @description: 登录
 * @param {type}
 * @return {type}
 * @author: syx
 */
export function login(data = {}, config = {}) {
  const options = Object.assign({
    method: "post",
    url: path + "/web/acct/login",
    data
  }, config)
  return yRequest("userLogin", options)
}

/**
 * @description: 登录
 * @param {type}
 * @return {type}
 * @author: syx
 */
export function refresh(data = {}, config = {}) {
  return yRequest.post("userRefresh", path + "/web/acct/refresh", data, config)
}

/**
 * @description: 获取验证码
 * @param {type}
 * @return {type}
 * @author: syx
 */
export function getCodeImage(data = {}, config = {}) {
  return yRequest.post("userGetCodeImage", path + "/web/acct/codeImage", data, config)
}

/**
 * @description: 获取用户信息
 * @param {type}
 * @return {type}
 * @author: syx
 */
export function getInfo(data = {}, config = {}) {
  return yRequest.post("userGetInfo", path + "/api/operate/acct/getAcctByToken", data, config)
}

/**
 * @description: 登出
 * @param {type}
 * @return {type}
 * @author: syx
 */
export function logout(data = {}, config = {}) {
  return yRequest.post("userLogout", path + "/web/acct/logout", data, config)
}


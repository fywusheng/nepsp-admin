import commonApi from "../common-axios"
/**
 * 获取用户信息
 *
 * @param {*} params
 * @param {*} options
 * @returns
 */
export function getUserInfo(params = {}, options = {}) {
  return commonApi.post("/usc/api/userAccount/getCurrentUser", {
    data: params
  }, options).then(result => {
    return result.data
  })
}
import yRequest from "../request"
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api/common" : "/nepsp-api/common"
/**
 * 修改我的信息
 *
 * @param {*} params
 * @param {*} options
 * @returns
 */
export function modifyOperateAcct(data = {}, config = {}) {
  return yRequest.post("myModifyOperateAcct", path + "/api/operate/acct/modifyOperateAcct", data, config)
}
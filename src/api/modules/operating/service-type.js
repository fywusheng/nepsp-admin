import request from "../../common-axios"
/**
 * @description: 环境判断
 * @param {*}
 * @return {*}
 * @author: camus
 */
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"
/**
 * @description: 服务类别查询api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function selectSerTypeForPrintIdByPage(data) {
  return request({
    url: path + "/cms/iep/web/cms/itemServType/selectServTypeForPrintIdByPage",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 服务类别更新，新增api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function insertOrUpdateSerType(data) {
  return request({
    url: path + "/cms/iep/web/cms/itemServType/insertOrUpdateServType",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 服务类别删除api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function deleteSerType(key) {
  return request({
    url: path + "/cms/iep/web/cms/itemServType/deleteServType",
    method: "post",
    useMock: false,
    data: {
      key
    }
  })
}


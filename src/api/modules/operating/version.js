import request from "../../common-axios"
/**
 * @description: 环境判断
 * @param {*}
 * @return {*}
 * @author: camus
 */
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"
/**
 * @description: 版本列表查询api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function getVersionList(data) {
  return request({
    url: path+ "/common/app/appVersion/pageList",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 版本列表添加api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function addVersion(data) {
  return request({
    url: path+ "/common/app/appVersion/add",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 版本列表更新api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function updateVersion(data) {
  return request({
    url: path+ "/common/app/appVersion/update",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 版本列表删除api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function delVersion(verPkId) {
  return request({
    url: path+ "/common/app/appVersion/delete",
    method: "post",
    useMock: false,
    data: {
      verPkId
    }
  })
}

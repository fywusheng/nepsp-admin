import request from "../../common-axios"
/**
 * @description: 环境判断
 * @param {*}
 * @return {*}
 * @author: camus
 */
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"
/**
 * @description: 启动页查询api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function qryStartPageForPage(data) {
  return request({
    url: path + "/common/app/qryStartPageForPage",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 启动页添加api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function addStartPageInfo(data) {
  return request({
    url: path + "/common/app/addStartPageInfo",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 启动页删除api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function deleteStartPageInfo(startPageId) {
  return request({
    url: path + "/common/app/deleteStartPageInfo",
    method: "post",
    useMock: false,
    data: {
      startPageId
    }
  })
}
/**
 * @description: 启动页更新api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function updateStartPageInfo(data) {
  return request({
    url: path + "/common/app/updateStartPageInfo",
    method: "post",
    useMock: false,
    data
  })
}

import request from "../../common-axios"
/**
 * @description: 环境判断
 * @param {*}
 * @return {*}
 * @author: camus
 */
const path = eval(process.env.VUE_APP_TEST_LOCAL)
  ? "/api/cms"
  : "/nepsp-api/cms"
/**
 * @description: 专题分类查询api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function selectCmsColByDTO(data) {
  return request({
    url: path + "/iep/web/cms/cmscol/selectCmsColByDTO",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 专题分类更新，添加api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function insertOrUpdateCmsCol(data) {
  return request({
    url: path + "/iep/web/cms/cmscol/insertOrUpdateCmsCol",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 专题分类删除api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function deleteCmsCol(data) {
  return request({
    url: path + "/iep/web/cms/cmscol/deleteCmsCol",
    method: "post",
    useMock: false,
    data
  })
}

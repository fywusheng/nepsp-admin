import request from "../../common-axios"
/**
 * @description: 环境判断
 * @param {*}
 * @return {*}
 * @author: camus
 */
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"
/**
 * @description: 专题内容查询api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function selectCmsContByDTO(data) {
  return request({
    url: `${path}/cms/iep/web/cms/cmscont/selectCmsContByDTO`,
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 专题内容更新、新增api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function insertOrUpdateCmsCont(data) {
  return request({
    url: `${path}/cms/iep/web/cms/cmscont/insertOrUpdateCmsCont`,
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 专题内容删除api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function deleteCmsCont(data) {
  return request({
    url: `${path}/cms/iep/web/cms/cmscont/deleteCmsCont`,
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 专题内容城市options api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function getRegnAreaTree(data) {
  return request({
    url: path + "/common/cusc/api/usersearch/getRegnAreaTree",
    method: "post",
    useMock: false,
    data
  })
}

/**
 * @description: 专题内容置顶api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function updateResrt(data) {
  return request({
    url: `${path}/cms/iep/web/cms/cmscont/updateResrt`,
    method: "post",
    useMock: false,
    data
  })
}

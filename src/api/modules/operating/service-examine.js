import request from "../../common-axios"
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"

/**
 * @description: 获取服务审批列表
 * @param {type} params Object 参数数据
 */
export function getServiceExamine(params = {}) {
  return request({
    url: path + "/cms/cmc/cmsServerAudit/findAllCmcServer",
    method: "post",
    data: params
  })
}

// /**
//  * @description: 获取服务类型列表
//  * @param {type} params Object 参数数据
//  */
export function getServiceType() {
  return request({
    url: path + "/cms/iep/web/cms/itemServType/selectItemServTypes",
    method: "post"
  })
}

/**
 * @description: 编辑服务审批
 * @param {type} params Object 参数数据
 */
export function editServiceExamine(params = {}) {
  return request({
    url: path + "/cms/cmc/cmsServerAudit/auditServer",
    method: "post",
    data: params
  })
}


import yRequest from "../request"
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"

/**
 * @description: 查询权益信息
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function getInterestList(data = {}, config = {}) {
  return yRequest.post("cmsGetInterestList", path + "/cms/iep/web/cms/droitContList/selectDroitContByPage", data, config)
}

/**
 * @description: 新增或修改权益信息
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function addOrEditInterest(data = {}, config = {}) {
  return yRequest.post("cmsAddOrEditInterest", path + "/cms/cmc/droitContList/insertOrUpdateDroitCont", data, config)
}

/**
 * @description: 删除权益信息接口
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function deleteInterest(data = {}, config = {}) {
  return yRequest.post("cmsDeleteInterest", path + "/cms/cmc/droitContList/deleteDroitContList", data, config)
}

/**
 * @description: 权益信息停用启用
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function changeInterest(data = {}, config = {}) {
  return yRequest.post("cmsChangeInterest", path + "/cms/cmc/droitContList/droitContDroitFlag", data, config)
}

/**
 * @description: 获取所有服务类别
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function getAllServiceType(data = {}, config = {}) {
  return yRequest.post("cmsGetAllServiceType", path + "/cms/iep/web/cms/itemServType/selectItemServTypes", data, config)
}

/**
 * @description: 获取所有服务
 * @param {type} 
 * @return {type} 
 * @author: syx
 */
export function webqueryList(data = {}, config = {}) {
  return yRequest.post("cmsWebqueryList", path + "/cms/cmc/webqueryList", data, config)
}

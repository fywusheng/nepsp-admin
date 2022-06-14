import request from "../../common-axios"
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"

/**
 * @description: 获取服务管理列表
 * @param {type} params Object 参数数据
 */
export function getServiceManage(params = {}) {
  return request({
    url: path + "/cms/cmc/pageList",
    method: "post",
    data: params
  })
}

/**
 * @description: 获取服务类型列表
 * @param {type} params Object 参数数据
 */
export function getServiceType() {
  return request({
    url: path + "/cms//iep/web/cms/itemServType/selectItemServTypes",
    method: "post"
  })
}

/**
 * @description: 设置是否启用服务
 * @param {type} params Object 参数数据
 */
export function editServiceStatus(params) {
  return request({
    url: path + "/cms/cmc/OnOff",
    method: "post",
    data: params
  })
}

/**
 * @description: 删除服务
 * @param {type} params Object 参数数据
 */
export function deleteService(params) {
  return request({
    url: path + "/cms/cmc/DeleteById",
    method: "post",
    data: params
  })
}

/**
 * @description: 上传图片
 * @param {type} params Object 参数数据
 */
export function uploadImage(params) {
  return request({
    url: path + "/cms/iep/web/cms/imgUpload",
    method: "post",
    data: params
  })
}

/**
 * @description: 添加服务
 * @param {type} params Object 参数数据
 */
export function addService(params) {
  return request({
    url: path + "/cms/cmc/insertServ",
    method: "post",
    data: params
  })
}

/**
 * @description: 编辑服务
 * @param {type} params Object 参数数据
 */
export function editService(params) {
  return request({
    url: path + "/cms/cmc/updateServ",
    method: "post",
    data: params
  })
}

/**
 * @description: 置顶服务
 * @param {type} params Object 参数数据
 */
export function updateServiceResrt(params) {
  return request({
    url: path + "/cmc/updateResrt",
    method: "post",
    data: params
  })
}
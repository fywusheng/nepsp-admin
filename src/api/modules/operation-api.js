/*
 * @Description: 运营管理api
 * @Version: //
 * @Autor: syx
 * @Date: 2021-06-30 13:45:44
 * @LastEditors: syx
 * @LastEditTime: 2021-07-22 11:28:24
 */
import yRequest from "../request"

const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"

/**
 * @description: 获取所有专栏列表
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function selectCmsColByDTO(data = {}, config = {}) {
  return yRequest.post("operationSelectCmsColByDTO", path + "/cms/iep/web/cms/cmscol/selectCmsColByDTO", data, config)
}

/**
 * @description: 查询专题内容列表
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function selectCmsContByDTO(data = {}, config = {}) {
  return yRequest.post("operationSelectCmsContByDTO", path + "/cms/iep/web/cms/cmscont/selectCmsContByDTO", data, config)
}

/**
 * @description: 提交审核
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function updateContToAudit(data = {}, config = {}) {
  return yRequest.post("operationUpdateContToAudit", path + "/cms/iep/web/cms/cmscont/updateContToAudit", data, config)
}

/**
 * @description: 审核不过(退回到待提交审核)
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function updateContAuditNoPass(data = {}, config = {}) {
  return yRequest.post("operationUpdateContAuditNoPass", path + "/cms/iep/web/cms/cmscont/updateContAuditNoPass", data, config)
}

/**
 * @description: 定时发布
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function updateRegRelease(data = {}, config = {}) {
  return yRequest.post("operationUpdateRegRelease", path + "/cms/iep/web/cms/cmscont/updateRegRelease", data, config)
}

/**
 * @description: 立即发布
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function updateImmediaAuditPass(data = {}, config = {}) {
  return yRequest.post("operationUpdateImmediaAuditPass", path + "/cms/iep/web/cms/cmscont/updateImmediaAuditPass", data, config)
}

/**
 * @description: 删除内容
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function deleteCmsCont(data = {}, config = {}) {
  return yRequest.post("operationDeleteCmsCont", path + "/cms/iep/web/cms/cmscont/deleteCmsCont", data, config)
}

/**
 * @description: 添加或编辑
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function insertOrUpdateCmsCont(data = {}, config = {}) {
  return yRequest.post("operationInsertOrUpdateCmsCont", path + "/cms/iep/web/cms/cmscont/insertOrUpdateCmsCont", data, config)
}

/**
 * @description: 添加或编辑
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function uploadImage(data = {}, config = {}) {
  return yRequest.post("operationImgUpload", path + "/cms/iep/web/cms/imgUpload", data, config)
}

/**
 * @description: 音频/视频上传
 * @param {*}
 * @return {*}
 * @author: syx
 */
export function singleFileUpload(data = {}, config = {}) {
  return yRequest.post("operationSingleFileUpload", path + "/cms/iep/web/cms/singleFileUpload", data, config)
}
import request from "../common-axios"
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api/ngcmn" : "/nepsp-api/ngcmn"

/**
 * @description: 获取通知列表
 * @param {type} params Object 参数数据
 */
export function getNoticeList(params = {}) {
  return request({
    url: path + "/notice/sys/selectNotice",
    method: "post",
    data: params
  })
}

/**
 * @description: 删除通知
 * @param {type} params Object 参数数据
 */
export function deleteNotice(params = {}) {
  return request({
    url: path + "/notice/sys/deleteNoticeService",
    method: "post",
    data: params
  })
}

/**
 * @description: 添加或编辑通知
 * @param {type} params Object 参数数据
 */
export function addOrEditNoticeInfo(params = {}) {
  return request({
    url: path + "/notice/sys/addOrUpdateSysNoticeService",
    method: "post",
    data: params
  })
}

/**
 * @description: 修改通知运行状态
 * @param {type} params Object 参数数据
 */
export function editNoticeStatus(params = {}) {
  return request({
    url: path + "/notice/sys/updtNotcRunStas",
    method: "post",
    data: params
  })
}

/**
 * @description: 推送通知
 * @param {type} params Object 参数数据
 */
// export function pushNotice(params = {}) {
//   return request({
//     url: path + "/mock/api/notice/push",
//     method: "post",
//     useMock: true,
//     data: params
//   })
// }

/**
 * @description: 获取短信列表
 * @param {type} params Object 参数数据
 */
export function getShortMessageList(params = {}) {
  return request({
    url: path + "/sms/selectSendSmsList",
    method: "post",
    data: params
  })
}

/**
 * @description: 删除短信
 * @param {type} params Object 参数数据
 */
export function deleteShortMessage(params = "") {
  return request({
    url: path + "/sms/deleteSendSms",
    method: "post",
    data: params
  })
}

/**
 * @description: 添加短信(发送短信)
 * @param {type} params Object 参数数据
 */
export function sendShortMessage(params = "") {
  return request({
    url: path + "/sms/sendSmsContent",
    method: "post",
    data: params
  })
}

/**
 * @description: 修改通知运行状态
 * @param {type} params Object 参数数据
 */
export function getInsideMsgList(params = "") {
  return request({
    url: path + "/wbst/msg/getWbstMsgListByParam",
    method: "post",
    data: params
  })
}

/**
 * @description: 发送站内消息
 * @param {type} params Object 参数数据
 */
export function sendMessage(params = {}) {
  return request({
    url: path + "/wbst/send/singlemsg",
    method: "post",
    data: params
  })
}

/**
 * @description: 获取消息类型列表
 * @param {type} params Object 参数数据
 */
export function getMessageTypeList(params = {}) {
  return request({
    url: path + "/iep/api/msc/tmpl/getTmplOptionsByType",
    method: "post",
    data: params
  })
}

/**
 * @description: 获取模板列表
 * @param {type} params Object 参数数据
 */
export function getTemplateList(params = {}) {
  return request({
    url: path + "/iep/api/msc/tmpl/selectTmpl",
    method: "post",
    data: params
  })
}

/**
 * @description: 添加或编辑模板
 * @param {type} params Object 参数数据
 */
export function addOrEditTemplate(params = {}) {
  return request({
    url: path + "/iep/api/msc/tmpl/saveTmpl",
    method: "post",
    data: params
  })
}

/**
 * @description: 获取系统提示列表
 * @param {type} params Object 参数数据
 */
export function getSystemRemindList(params = {}) {
  return request({
    url: path + "/mock/api/system-remind/list",
    method: "get",
    useMock: true,
    data: params
  })
}

/**
 * @description: 删除模板
 * @param {type} params Object 参数数据
 */
export function deleteTemplate(params = {}) {
  return request({
    url: path + "/iep/api/msc/tmpl/deleteTmpl",
    method: "post",
    data: params
  })
}
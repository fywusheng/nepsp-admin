import yRequest from "../request"

const cuscPath = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"
/**
 * @description: 城市列表树形结构
 * @param {type}
 * @return {type}
 * @author: syx
 */
export function getRegnAreaTree(data = {}, config = {}) {
  return yRequest.post("commonGetRegnAreaTree", cuscPath + "/common/cusc/api/usersearch/getRegnAreaTree", data, config)
}

/**
 * 上传图片
 * @param {*} params
 * base64String: string 图片base64字符串,文件大小超过10MB报错
 * fileExt: string 图片后缀
 * imageName: string 图片名称
 * @param {*} options
 * @returns
 */
export function uploadFile(data = {}, config = {}) {
  return yRequest.post("commonUploadFile", path + "/cms/iep/web/cms/imgUpload", data, config)
}


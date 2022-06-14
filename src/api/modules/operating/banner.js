import request from "../../common-axios"
/**
 * @description: 环境判断
 * @param {*}
 * @return {*}
 * @author: camus
 */
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"

/**
 * @description: 轮播图查询api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function qryBannerForPage(data) {
  return request({
    url: path + "/common/app/qryBannerForPage",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 轮播图添加请求api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function addBannerInfo(data) {
  return request({
    url: path + "/common/app/addBannerInfo",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 轮播图删除api导出
 * @param {*} bannerId
 * @return {*}
 * @author: camus
 */
export function deleteBannerInfo(bannerId) {
  return request({
    url: path + "/common/app/deleteBannerInfo",
    method: "post",
    useMock: false,
    data: {
      bannerId
    }
  })
}
/**
 * @description: 轮播图更新api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function updateBannerInfo(data) {
  return request({
    url: path + "/common/app/updateBannerInfo",
    method: "post",
    useMock: false,
    data
  })
}

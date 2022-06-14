import request from "../../common-axios"
/**
 * @description: 环境判断
 * @param {*}
 * @return {*}
 * @author: camus
 */
const path = eval(process.env.VUE_APP_TEST_LOCAL) ? "/api" : "/nepsp-api"
/**
 * @description: 用户反馈查询api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function getFeedbackList(data) {
  return request({
    url: path+ "/common/app/prb/pageList",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 用户反馈保存api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function saveFeedback(data) {
  return request({
    url: path+ "/common/app/prb/reply",
    method: "post",
    useMock: false,
    data
  })
}
/**
 * @description: 用户反馈发布api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function releaseFeedback(data) {
  return request({
    url: path+ "/common/app/prb/publish",
    method: "post",
    useMock: false,
    data
  })
}

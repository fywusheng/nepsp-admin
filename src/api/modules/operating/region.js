import request from "../../common-axios"

/**
 * @description: 专题内容城市options api导出
 * @param {*} data
 * @return {*}
 * @author: camus
 */
export function getRegnAreaTree(data) {
  return request({
    url: "/common/cusc/api/usersearch/getRegnAreaTree",
    method: "post",
    useMock: false,
    data
  })
}

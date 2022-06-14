import * as http from "@/utils/http"

export default {

  list(params) {
    return http.get(`/nepsp-cms-api/operation`, params)
  },
  get(id) {
    return http.get(
      `/nepsp-cms-api/operation/${id}`
    )
  },
  add(params) {
    return http.post(
      `/nepsp-cms-api/operation/add`, params
    )
  },
  remove(id) {
    return http.post(
      `/nepsp-cms-api/operation/${id}/remove`
    )
  },
  update(params) {
    return http.post(
      `/nepsp-cms-api/operation/${params.id}/update`, params
    )
  }
}

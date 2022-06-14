import * as http from "@/utils/http"

export default {

  list(params) {
    return http.get(`/nepsp-cms-api/operationContent`, params)
  },
  get(id) {
    return http.get(
      `/nepsp-cms-api/operationContent/${id}`
    )
  },
  add(params) {
    return http.post(
      `/nepsp-cms-api/operationContent/add`, params
    )
  },
  remove(id) {
    return http.post(
      `/nepsp-cms-api/operationContent/${id}/remove`
    )
  },
  update(params) {
    return http.post(
      `/nepsp-cms-api/operationContent/${params.id}/update`, params
    )
  }
}

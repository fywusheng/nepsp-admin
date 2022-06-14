import * as http from "@/utils/http"

export default {
  list(params) {
    return http.get(
      `/nepsp-cms-api/topic`, params
    )
  },
  get(id) {
    return http.get(
      `/nepsp-cms-api/topic/${id}`
    )
  },
  copy(id, params) {
    return http.post(
      `/nepsp-cms-api/topic/${id}/copy`, params
    )
  },
  add(params) {
    return http.post(
      `/nepsp-cms-api/topic/add`, params
    )
  },
  update(id, params) {
    return http.post(
      `/nepsp-cms-api/topic/${id}/update`, params
    )
  },
  rollback(id, params) {
    return http.post(
      `/nepsp-cms-api/topic/${id}/rollback`, params
    )
  },
  publish(id) {
    return http.post(
      `/nepsp-cms-api/topic/${id}/publish`
    )
  },
  fetch(id) {
    return http.post(
      `/nepsp-cms-api/topic/${id}/fetch`
    )
  },
  remove(id) {
    return http.post(
      `/nepsp-cms-api/topic/${id}/remove`
    )
  }
}

import api from './index'

export const pageApi = {
  get: (slug) => api.get(`/pages/${slug}`),
  adminGet: (slug) => api.get(`/admin/pages/${slug}`),
  update: (slug, data) => api.put(`/admin/pages/${slug}`, data)
}

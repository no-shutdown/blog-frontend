import api from './index'

export const tagApi = {
  list: () => api.get('/tags'),
  adminList: () => api.get('/admin/tags'),
  create: (data) => api.post('/admin/tags', data),
  update: (id, data) => api.put(`/admin/tags/${id}`, data),
  delete: (id) => api.delete(`/admin/tags/${id}`)
}

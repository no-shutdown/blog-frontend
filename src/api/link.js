import api from './index'

export const linkApi = {
  list: () => api.get('/links'),
  adminList: () => api.get('/admin/links'),
  create: (data) => api.post('/admin/links', data),
  update: (id, data) => api.put(`/admin/links/${id}`, data),
  delete: (id) => api.delete(`/admin/links/${id}`)
}

import api from './index'

export const articleApi = {
  list: (params) => api.get('/articles', { params }),
  detail: (id) => api.get(`/articles/${id}`),
  archive: () => api.get('/articles/archive'),
  adminList: (params) => api.get('/admin/articles', { params }),
  adminDetail: (id) => api.get(`/admin/articles/${id}`),
  create: (data) => api.post('/admin/articles', data),
  update: (id, data) => api.put(`/admin/articles/${id}`, data),
  delete: (id) => api.delete(`/admin/articles/${id}`)
}

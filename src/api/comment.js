import api from './index'

export const commentApi = {
  list: (articleId) => api.get(`/comments/${articleId}`),
  submit: (data) => api.post('/comments', data),
  adminList: (params) => api.get('/admin/comments', { params }),
  updateStatus: (id, status) => api.put(`/admin/comments/${id}`, { status }),
  delete: (id) => api.delete(`/admin/comments/${id}`)
}

import api from './index'

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  uploadImage: (file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post('/admin/upload/image', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

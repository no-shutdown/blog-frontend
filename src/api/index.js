import axios from 'axios'
import { useUiStore } from '@/stores/ui'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

api.interceptors.request.use((config) => {
  const ui = useUiStore()
  ui.startLoading()

  const token = localStorage.getItem('blog_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => {
    const ui = useUiStore()
    ui.endLoading()
    return response.data
  },
  (error) => {
    const ui = useUiStore()
    ui.endLoading()

    const payload = error.response?.data || {}
    const message = payload.msg || payload.message || error.message || 'Request failed'
    const code = payload.code || error.response?.status || 500

    if (error.response?.status === 401 && location.pathname !== '/admin/login') {
      localStorage.removeItem('blog_token')
      localStorage.removeItem('blog_user')
      location.href = '/admin/login'
    }

    const normalized = new Error(message)
    normalized.code = code
    normalized.raw = error
    return Promise.reject(normalized)
  }
)

export default api

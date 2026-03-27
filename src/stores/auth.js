import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/api'

const TOKEN_KEY = 'blog_token'
const USER_KEY = 'blog_user'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY))
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken, newUser = null) {
    token.value = newToken
    user.value = newUser
    localStorage.setItem(TOKEN_KEY, newToken)
    if (newUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(newUser))
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  async function login(username, password) {
    const res = await api.post('/admin/login', { username, password })
    if (res.code !== 200) {
      throw new Error(res.message || 'Login failed')
    }
    setToken(res.data.token, { username })
    return res
  }

  return { token, user, isAuthenticated, setToken, logout, login }
})

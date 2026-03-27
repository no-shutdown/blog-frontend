import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from './auth'

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should be unauthenticated by default', () => {
    const auth = useAuthStore()
    expect(auth.token).toBeNull()
    expect(auth.isAuthenticated).toBe(false)
  })

  it('should store token on setToken', () => {
    const auth = useAuthStore()
    auth.setToken('test-token', { username: 'admin' })
    expect(auth.token).toBe('test-token')
    expect(auth.isAuthenticated).toBe(true)
    expect(localStorage.getItem('blog_token')).toBe('test-token')
  })

  it('should clear token on logout', () => {
    const auth = useAuthStore()
    auth.setToken('test-token', { username: 'admin' })
    auth.logout()
    expect(auth.token).toBeNull()
    expect(localStorage.getItem('blog_token')).toBeNull()
  })
})

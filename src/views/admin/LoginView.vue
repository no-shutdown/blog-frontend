<template>
  <div class="login-wrap">
    <form class="login" @submit.prevent="submit">
      <h2>后台登录</h2>
      <input v-model="form.username" required placeholder="用户名" />
      <input v-model="form.password" required placeholder="密码" type="password" />
      <button :disabled="loading" type="submit">{{ loading ? '登录中...' : '登录' }}</button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = reactive({ username: 'admin', password: '123456' })

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form.username, form.password)
    router.push('/admin/dashboard')
  } catch (e) {
    error.value = e.message || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrap { min-height: 100vh; display: grid; place-items: center; background: #f3f4f6; }
.login { width: 320px; background: #fff; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
input { padding: 10px; border: 1px solid #ddd; border-radius: 8px; }
button { padding: 10px; border: 0; border-radius: 8px; background: #1677ff; color: #fff; cursor: pointer; }
.error { color: #ef4444; }
</style>

<template>
  <div class="login-wrap">
    <div class="blur blur-a"></div>
    <div class="blur blur-b"></div>

    <form class="login card" @submit.prevent="submit">
      <h2>后台登录</h2>
      <p class="desc">欢迎回来，输入账号继续管理内容。</p>

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
.login-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(980px 430px at 8% -20%, rgba(15, 107, 255, 0.18), transparent),
    radial-gradient(900px 400px at 94% -10%, rgba(255, 106, 61, 0.12), transparent),
    linear-gradient(180deg, #f8fbff 0%, #edf3fb 100%);
}

.blur {
  position: absolute;
  border-radius: 999px;
  filter: blur(30px);
  opacity: 0.45;
  pointer-events: none;
}

.blur-a {
  width: 340px;
  height: 340px;
  background: var(--primary);
  top: -110px;
  left: -90px;
}

.blur-b {
  width: 290px;
  height: 290px;
  background: #ff6a3d;
  right: -90px;
  bottom: -100px;
}

.login {
  width: min(420px, calc(100vw - 24px));
  padding: 26px;
  position: relative;
  z-index: 2;
  display: grid;
  gap: 11px;
}

h2 {
  margin: 0;
  font-size: 28px;
}

.desc {
  margin: 0 0 6px;
  color: #64748b;
  font-size: 14px;
}

.error {
  margin: 4px 0 0;
  color: #e24f4f;
}
</style>

<template>
  <div class="admin-layout">
    <aside class="menu">
      <h2>Blog Admin</h2>
      <RouterLink to="/admin/dashboard">Dashboard</RouterLink>
      <RouterLink to="/admin/articles">Articles</RouterLink>
      <RouterLink to="/admin/categories">Categories</RouterLink>
      <RouterLink to="/admin/tags">Tags</RouterLink>
      <RouterLink to="/admin/comments">Comments</RouterLink>
      <RouterLink to="/admin/links">Links</RouterLink>
      <RouterLink to="/admin/pages/about">About Page</RouterLink>
      <button @click="doLogout">Logout</button>
    </aside>
    <main class="panel"><RouterView /></main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

function doLogout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout { min-height: 100vh; display: flex; }
.menu { width: 220px; background: #1f2937; color: #fff; padding: 16px; display: flex; flex-direction: column; gap: 8px; }
.menu h2 { margin: 4px 0 12px; font-size: 18px; }
.menu a { color: #d1d5db; text-decoration: none; padding: 6px 8px; border-radius: 6px; }
.menu a.router-link-active { color: #fff; background: #374151; }
.menu button { margin-top: auto; padding: 8px 10px; border: 0; border-radius: 6px; cursor: pointer; }
.panel { flex: 1; background: #f3f4f6; padding: 20px; overflow: auto; }
</style>

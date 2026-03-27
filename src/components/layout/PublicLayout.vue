<template>
  <div class="public-layout">
    <header class="site-header">
      <div class="inner">
        <RouterLink to="/" class="brand">My Blog</RouterLink>
        <nav>
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/archive">归档</RouterLink>
          <RouterLink to="/about">关于</RouterLink>
          <RouterLink to="/links">友链</RouterLink>
        </nav>
      </div>
    </header>
    <div class="container">
      <main class="main"><RouterView /></main>
      <aside class="sidebar"><Sidebar /></aside>
    </div>
  </div>
</template>

<script setup>
import Sidebar from '@/components/public/Sidebar.vue'
</script>

<style scoped>
.site-header { border-bottom: 1px solid #eee; background: #fff; position: sticky; top: 0; z-index: 10; }
.inner { max-width: 1100px; margin: 0 auto; padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; }
.brand { font-weight: 700; color: #111; text-decoration: none; }
nav { display: flex; gap: 14px; }
nav a { color: #444; text-decoration: none; }
nav a.router-link-active { color: #1677ff; }
.container { max-width: 1100px; margin: 24px auto; padding: 0 16px; display: flex; gap: 20px; }
.main { flex: 1; min-width: 0; }
.sidebar { width: 280px; }
@media (max-width: 960px) {
  .container { flex-direction: column; }
  .sidebar { width: 100%; }
}
</style>

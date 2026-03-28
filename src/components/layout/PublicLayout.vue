<template>
  <div class="public-shell">
    <header class="site-header">
      <div class="inner">
        <RouterLink to="/" class="brand">
          <img v-if="settings.logoUrl" :src="settings.logoUrl" class="logo" alt="logo" />
          <span v-else class="dot"></span>
          <span v-if="settings.siteName" class="site-name">{{ settings.siteName }}</span>
        </RouterLink>
        <nav class="nav">
          <RouterLink to="/">首页</RouterLink>
          <RouterLink to="/links">友链</RouterLink>
          <RouterLink to="/about">关于</RouterLink>
        </nav>
      </div>
    </header>

    <div class="layout-grid">
      <main class="main">
        <RouterView />
      </main>
      <aside class="sidebar">
        <Sidebar />
      </aside>
    </div>

    <Footer />
    <ScrollToTop />
  </div>
</template>

<script setup>
import Footer from '@/components/public/Footer.vue'
import ScrollToTop from '@/components/public/ScrollToTop.vue'
import Sidebar from '@/components/public/Sidebar.vue'
import { useSettingsStore } from '@/stores/settings'
const settings = useSettingsStore()
</script>

<style scoped>
.public-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.site-header {
  position: static;
}

.inner {
  max-width: 1240px;
  margin: 0 auto;
  border-radius: 18px;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(8px);
  box-shadow: 0 12px 34px rgba(16, 40, 80, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #0f172a;
}

.logo {
  max-height: 32px;
  max-width: 120px;
  object-fit: contain;
}

.site-name {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(120deg, #0f6bff, #ff6a3d);
  box-shadow: 0 0 0 4px rgba(15, 107, 255, 0.12);
}

.nav {
  display: flex;
  gap: 10px;
}

.nav a {
  text-decoration: none;
  color: #1f2937;
  font-weight: 600;
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 10px;
  transition: 0.15s ease;
}

.nav a:hover {
  background: #eaf1ff;
}

.nav a.router-link-exact-active {
  color: #0f6bff;
  background: #dce9ff;
}

.layout-grid {
  flex: 1;
  max-width: 1240px;
  width: 100%;
  margin: 18px auto 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 20px;
  align-items: start;
}

.main {
  min-width: 0;
}

.sidebar {
  min-width: 0;
  position: sticky;
  top: 12px;
  align-self: start;
}

@media (max-width: 1080px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    top: auto;
  }
}

@media (max-width: 720px) {
  .public-shell {
    padding: 12px;
  }

  .inner {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .nav {
    overflow-x: auto;
    padding-bottom: 2px;
  }
}
</style>






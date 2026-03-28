<template>
  <div class="admin-layout">
    <aside class="menu">
      <div class="menu-top">
        <h2>控制台</h2>
        <p class="sub">内容管理中心</p>
      </div>

      <nav class="menu-list">
        <RouterLink to="/admin/dashboard">仪表盘</RouterLink>
        <RouterLink to="/admin/articles">文章管理</RouterLink>
        <RouterLink to="/admin/categories">分类管理</RouterLink>
        <RouterLink to="/admin/tags">标签管理</RouterLink>
        <RouterLink to="/admin/comments">评论管理</RouterLink>
        <RouterLink to="/admin/links">友链管理</RouterLink>
        <RouterLink to="/admin/pages/about">关于页面</RouterLink>
        <RouterLink to="/admin/settings">网站设置</RouterLink>
      </nav>

      <button class="logout" @click="doLogout">退出登录</button>
    </aside>

    <main class="panel">
      <RouterView />
    </main>
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
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 16px;
  padding: 14px;
}

.menu {
  border-radius: 16px;
  padding: 18px 14px;
  background: linear-gradient(180deg, #0f172a, #1b2b4c);
  color: #e5edff;
  box-shadow: 0 18px 40px rgba(9, 20, 44, 0.3);
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.menu-top {
  margin-bottom: 16px;
}

.menu h2 {
  margin: 0 0 3px;
  font-size: 18px;
}

.sub {
  margin: 0;
  color: #9eb1d6;
  font-size: 12px;
}

.menu-list {
  display: grid;
  gap: 2px;
}

.menu a {
  text-decoration: none;
  color: #b8caf0;
  font-size: 14px;
  padding: 10px 12px;
  border-radius: 8px;
  transition: background 0.15s ease, color 0.15s ease;
}

.menu a:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #e5edff;
}

.menu a.router-link-active {
  color: #fff;
  background: rgba(15, 107, 255, 0.85);
}

.logout {
  margin-top: auto;
  border: 1px solid rgba(223, 234, 255, 0.18);
  color: #b8caf0;
  background: transparent;
  box-shadow: none;
  padding: 8px 10px;
  width: 100%;
  border-radius: 8px;
  font-size: 14px;
  text-align: left;
  transition: background 0.15s ease, color 0.15s ease;
}

.logout:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #e5edff;
}

.panel {
  padding: 8px;
}

@media (max-width: 980px) {
  .admin-layout {
    grid-template-columns: 1fr;
  }

  .menu {
    position: static;
    border-radius: 12px;
  }

  .menu-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .logout {
    margin-top: 10px;
  }
}
</style>




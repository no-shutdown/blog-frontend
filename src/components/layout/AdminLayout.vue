<template>
  <div class="admin-layout" :class="{ collapsed }">
    <aside class="menu">
      <div class="menu-top">
        <div v-if="!collapsed">
          <h2>控制台</h2>
          <p class="sub">内容管理中心</p>
        </div>
        <button class="collapse-btn btn-light" :title="collapsed ? '展开' : '收起'" @click="collapsed = !collapsed">
          {{ collapsed ? '▶' : '◀' }}
        </button>
      </div>

      <nav class="menu-list">
        <RouterLink to="/admin/dashboard" :title="collapsed ? '仪表盘' : ''">
          <span class="icon">📊</span><span class="label">仪表盘</span>
        </RouterLink>
        <RouterLink to="/admin/articles" :title="collapsed ? '文章管理' : ''">
          <span class="icon">📝</span><span class="label">文章管理</span>
        </RouterLink>
        <RouterLink to="/admin/categories" :title="collapsed ? '分类管理' : ''">
          <span class="icon">🗂️</span><span class="label">分类管理</span>
        </RouterLink>
        <RouterLink to="/admin/tags" :title="collapsed ? '标签管理' : ''">
          <span class="icon">🏷️</span><span class="label">标签管理</span>
        </RouterLink>
        <RouterLink to="/admin/comments" :title="collapsed ? '评论管理' : ''">
          <span class="icon">💬</span><span class="label">评论管理</span>
        </RouterLink>
        <RouterLink to="/admin/links" :title="collapsed ? '友链管理' : ''">
          <span class="icon">🔗</span><span class="label">友链管理</span>
        </RouterLink>
        <RouterLink to="/admin/pages/about" :title="collapsed ? '关于页面' : ''">
          <span class="icon">📄</span><span class="label">关于页面</span>
        </RouterLink>
      </nav>

      <button class="logout" :title="collapsed ? '退出登录' : ''" @click="doLogout">
        <span class="icon">🚪</span><span class="label">退出登录</span>
      </button>
    </aside>

    <main class="panel">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const collapsed = ref(false)

function doLogout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 16px;
  padding: 14px;
  transition: grid-template-columns 0.22s ease;
}

.admin-layout.collapsed {
  grid-template-columns: 64px minmax(0, 1fr);
}

.menu {
  border-radius: 22px;
  padding: 18px 14px;
  background: linear-gradient(180deg, #0f172a, #1b2b4c);
  color: #e5edff;
  box-shadow: 0 18px 40px rgba(9, 20, 44, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: padding 0.22s ease;
}

.menu-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 8px;
}

.menu h2 {
  margin: 2px 0 4px;
  font-size: 20px;
}

.sub {
  margin: 0;
  color: #9eb1d6;
  font-size: 12px;
}

.collapse-btn {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 13px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.08);
  color: #d3def8;
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: none;
  margin-left: auto;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

.menu-list {
  display: grid;
  gap: 4px;
  flex: 1;
}

.menu a {
  text-decoration: none;
  color: #d3def8;
  font-size: 14px;
  padding: 9px 10px;
  border-radius: 10px;
  transition: 0.15s ease;
  display: flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
  overflow: hidden;
}

.icon {
  flex-shrink: 0;
  font-size: 16px;
}

.label {
  overflow: hidden;
  transition: opacity 0.15s ease, max-width 0.22s ease;
}

.collapsed .label {
  opacity: 0;
  max-width: 0;
}

.menu a:hover {
  background: rgba(255, 255, 255, 0.08);
}

.menu a.router-link-active {
  color: #fff;
  background: linear-gradient(135deg, rgba(15, 107, 255, 0.92), rgba(47, 139, 255, 0.88));
}

.logout {
  margin-top: 12px;
  border: 1px solid rgba(223, 234, 255, 0.26);
  color: #f8fbff;
  background: linear-gradient(135deg, rgba(66, 91, 132, 0.96), rgba(42, 62, 95, 0.98));
  box-shadow: 0 10px 24px rgba(7, 18, 40, 0.28);
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  border-radius: 10px;
}

.panel {
  padding: 8px;
}

@media (max-width: 980px) {
  .admin-layout {
    grid-template-columns: 1fr !important;
  }

  .menu {
    border-radius: 16px;
  }

  .menu-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .logout {
    margin-top: 10px;
  }

  .collapse-btn {
    display: none;
  }

  .collapsed .label {
    opacity: 1;
    max-width: unset;
  }
}
</style>

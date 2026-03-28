<template>
  <div class="card table-card">
    <div class="top">
      <h2>文章管理</h2>
      <RouterLink class="create-link" to="/admin/articles/new">新建文章</RouterLink>
    </div>

    <div v-if="!list.length" class="empty-state">暂无数据</div>
    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>标题</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in list" :key="a.id">
          <td>#{{ a.id }}</td>
          <td>{{ a.title }}</td>
          <td>{{ fmtStatus(a.status) }}</td>
          <td class="actions">
            <RouterLink :to="`/admin/articles/${a.id}`">编辑</RouterLink>
            <button @click="remove(a.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { articleApi } from '@/api/article'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const list = ref([])
const STATUS_MAP = { published: '已发布', draft: '草稿' }
const fmtStatus = (s) => STATUS_MAP[s] || s

async function load() {
  const res = await articleApi.adminList({ page: 1, size: 50 })
  if (res.code === 200) list.value = res.data.list
}

async function remove(id) {
  const ok = await ui.askConfirm({
    title: '删除文章',
    message: '删除后无法恢复，确定继续吗？',
    confirmText: '删除'
  })
  if (!ok) return

  await articleApi.delete(id)
  ui.notify('文章已删除', 'success')
  await load()
}

onMounted(load)
</script>

<style scoped>
.table-card {
  padding: 16px;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.top h2 {
  margin: 0;
}

.create-link {
  text-decoration: none;
  color: #0f6bff;
  font-weight: 700;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 6px;
  align-items: center;
}
</style>

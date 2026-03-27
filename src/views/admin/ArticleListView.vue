<template>
  <div class="card">
    <div class="top">
      <h2>文章管理</h2>
      <RouterLink to="/admin/articles/new">新建文章</RouterLink>
    </div>
    <table>
      <thead><tr><th>ID</th><th>标题</th><th>状态</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="a in list" :key="a.id">
          <td>{{ a.id }}</td>
          <td>{{ a.title }}</td>
          <td>{{ a.status }}</td>
          <td>
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

const list = ref([])

async function load() {
  const res = await articleApi.adminList({ page: 1, size: 50 })
  if (res.code === 200) list.value = res.data.list
}

async function remove(id) {
  if (!confirm('确定删除?')) return
  await articleApi.delete(id)
  await load()
}

onMounted(load)
</script>

<style scoped>
.card { background: #fff; padding: 16px; border-radius: 10px; }
.top { display: flex; justify-content: space-between; margin-bottom: 10px; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px; border-top: 1px solid #eee; text-align: left; }
button { margin-left: 8px; }
</style>

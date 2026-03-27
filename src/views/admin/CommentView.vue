<template>
  <div class="card">
    <h2>评论管理</h2>
    <table>
      <thead><tr><th>ID</th><th>文章ID</th><th>昵称</th><th>内容</th><th>状态</th><th>操作</th></tr></thead>
      <tbody>
        <tr v-for="c in list" :key="c.id">
          <td>{{ c.id }}</td>
          <td>{{ c.articleId }}</td>
          <td>{{ c.nickname }}</td>
          <td>{{ c.content }}</td>
          <td>{{ c.status }}</td>
          <td>
            <button @click="change(c.id, 'approved')">通过</button>
            <button @click="change(c.id, 'rejected')">拒绝</button>
            <button @click="remove(c.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { commentApi } from '@/api/comment'

const list = ref([])

async function load() {
  const res = await commentApi.adminList({ page: 1, size: 100 })
  if (res.code === 200) list.value = res.data.list
}

async function change(id, status) {
  await commentApi.updateStatus(id, status)
  await load()
}

async function remove(id) {
  if (!confirm('确定删除?')) return
  await commentApi.delete(id)
  await load()
}

onMounted(load)
</script>

<style scoped>
.card { background: #fff; padding: 16px; border-radius: 10px; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 8px; border-top: 1px solid #eee; text-align: left; }
</style>

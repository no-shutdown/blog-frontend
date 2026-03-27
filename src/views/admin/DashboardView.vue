<template>
  <div class="card" v-if="stats">
    <h2>Dashboard</h2>
    <ul>
      <li>文章总数: {{ stats.articleCount }}</li>
      <li>已发布: {{ stats.publishedCount }}</li>
      <li>草稿: {{ stats.draftCount }}</li>
      <li>评论总数: {{ stats.commentCount }}</li>
      <li>待审核评论: {{ stats.pendingCommentCount }}</li>
      <li>总浏览量: {{ stats.totalViewCount }}</li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { adminApi } from '@/api/admin'

const stats = ref(null)

onMounted(async () => {
  const res = await adminApi.dashboard()
  if (res.code === 200) stats.value = res.data
})
</script>

<style scoped>
.card { background: #fff; border-radius: 10px; padding: 16px; }
</style>

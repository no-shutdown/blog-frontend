<template>
  <article class="card">
    <img v-if="article.coverImage" :src="article.coverImage" class="cover" />
    <h2><RouterLink :to="`/article/${article.id}`">{{ article.title }}</RouterLink></h2>
    <p>{{ article.summary }}</p>
    <div class="meta">
      <span>{{ fmt(article.createdAt) }}</span>
      <span>{{ article.viewCount || 0 }} views</span>
    </div>
  </article>
</template>

<script setup>
defineProps({ article: { type: Object, required: true } })
const fmt = (v) => (v ? new Date(v).toLocaleDateString('zh-CN') : '-')
</script>

<style scoped>
.card { background: #fff; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.cover { width: 100%; max-height: 240px; object-fit: cover; border-radius: 8px; margin-bottom: 12px; }
h2 { margin: 0 0 10px; font-size: 22px; }
h2 a { text-decoration: none; color: #111; }
.meta { display: flex; gap: 12px; color: #6b7280; font-size: 13px; }
</style>

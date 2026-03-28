<template>
  <article class="article-card card">
    <img v-if="article.coverImage" :src="article.coverImage" class="cover" />

    <div class="content-wrap">
      <span v-if="article.categoryName" class="cat-badge">{{ article.categoryName }}</span>
      <h2><RouterLink :to="`/article/${article.id}`">{{ article.title }}</RouterLink></h2>
      <p class="summary">{{ article.summary || '暂无摘要' }}</p>

      <div class="meta">
        <span>{{ fmt(article.createdAt) }}</span>
        <span>{{ article.viewCount || 0 }} 阅读</span>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({ article: { type: Object, required: true } })
const fmt = (v) => (v ? new Date(v).toLocaleDateString('zh-CN') : '-')
</script>

<style scoped>
.article-card {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 14px;
  padding: 14px;
  margin-bottom: 14px;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  overflow: hidden;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.cover {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-radius: 14px;
  transition: transform 0.3s ease;
}

.article-card:hover .cover {
  transform: scale(1.04);
}

.content-wrap {
  min-width: 0;
}

.cat-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--primary);
  background: var(--primary-soft);
  border-radius: 999px;
  padding: 3px 8px;
  margin-bottom: 6px;
}

h2 {
  margin: 2px 0 8px;
  font-size: 22px;
  line-height: 1.2;
}

h2 a {
  text-decoration: none;
  color: var(--text);
}

h2 a:hover {
  color: var(--primary);
}

.summary {
  margin: 0 0 10px;
  color: var(--text-secondary);
  line-height: 1.72;
}

.meta {
  display: inline-flex;
  gap: 8px;
  color: var(--text-muted);
  font-size: 12px;
}

.meta span {
  padding: 5px 9px;
  border-radius: 999px;
  background: #edf3ff;
}

@media (max-width: 860px) {
  .article-card {
    grid-template-columns: 1fr;
  }

  .cover {
    height: 200px;
  }
}
</style>


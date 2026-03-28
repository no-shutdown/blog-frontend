<template>
  <div class="links-page">
    <h1 class="page-title">友情链接</h1>
    <div class="grid">
      <a
        v-for="l in links"
        :key="l.id"
        :href="l.url"
        target="_blank"
        rel="noreferrer"
        class="link-card card"
      >
        <div class="avatar-wrap">
          <img v-if="l.avatar" :src="l.avatar" class="avatar" :alt="l.name" />
          <span v-else class="avatar-initial">{{ (l.name || '?')[0] }}</span>
        </div>
        <div class="info">
          <h3>{{ l.name }}</h3>
          <p>{{ l.description }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { linkApi } from '@/api/link'

const links = ref([])

onMounted(async () => {
  const res = await linkApi.list()
  if (res.code === 200) links.value = res.data
})
</script>

<style scoped>
.links-page {
  padding: 4px 0;
}

.page-title {
  font-size: 26px;
  margin: 0 0 18px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.link-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.link-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  color: inherit;
}

.avatar-wrap {
  flex-shrink: 0;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--line);
}

.avatar-initial {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
  font-size: 18px;
  border: 2px solid rgba(15, 107, 255, 0.2);
}

.info {
  min-width: 0;
}

.info h3 {
  margin: 0 0 4px;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info p {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
</style>

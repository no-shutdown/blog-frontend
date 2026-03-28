<template>
  <div class="links-page">
    <h1 class="page-title">友情链接</h1>
    <div class="list">
      <a
        v-for="l in links"
        :key="l.id"
        :href="l.url"
        target="_blank"
        rel="noreferrer"
        class="link-row card"
      >
        <div class="avatar-wrap">
          <img v-if="l.avatar" :src="l.avatar" class="avatar" :alt="l.name" />
          <span v-else class="avatar-initial">{{ (l.name || '?')[0] }}</span>
        </div>
        <div class="info">
          <div class="name-row">
            <h3>{{ l.name }}</h3>
            <span class="url">{{ l.url }}</span>
          </div>
          <p v-if="l.description" class="desc">{{ l.description }}</p>
        </div>
        <span class="arrow">↗</span>
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

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.link-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.link-row:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
  color: inherit;
}

.avatar-wrap {
  flex-shrink: 0;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--line);
}

.avatar-initial {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
  font-size: 17px;
  border: 2px solid rgba(15, 107, 255, 0.2);
}

.info {
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 3px;
}

.name-row h3 {
  margin: 0;
  font-size: 15px;
  white-space: nowrap;
}

.url {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
}

.desc {
  margin: 0;
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow {
  flex-shrink: 0;
  font-size: 16px;
  color: var(--text-muted);
  transition: color 0.15s ease;
}

.link-row:hover .arrow {
  color: var(--primary);
}
</style>

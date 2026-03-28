<template>
  <div class="archive card">
    <h1 class="page-title">归档</h1>

    <div v-for="g in groups" :key="`${g.year}-${g.month}`" class="group">
      <div class="month-node">
        <span class="dot"></span>
        <h3>{{ g.year }}年{{ g.month }}月 <em>({{ g.count }})</em></h3>
      </div>

      <ul>
        <li v-for="a in g.articles" :key="a.id">
          <RouterLink :to="`/article/${a.id}`">{{ a.title }}</RouterLink>
          <span class="date">{{ fmt(a.createdAt) }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { articleApi } from '@/api/article'

const groups = ref([])
const fmt = (v) => (v ? new Date(v).toLocaleDateString('zh-CN') : '-')

onMounted(async () => {
  const res = await articleApi.archive()
  if (res.code === 200) groups.value = res.data
})
</script>

<style scoped>
.archive {
  padding: 24px 28px;
}

.page-title {
  margin: 0 0 24px;
  font-size: 26px;
}

.group {
  padding-left: 20px;
  border-left: 2px solid var(--line);
  margin-bottom: 28px;
  position: relative;
}

.month-node {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  position: relative;
}

.dot {
  position: absolute;
  left: -27px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: var(--primary);
  box-shadow: 0 0 0 3px rgba(15, 107, 255, 0.18);
}

h3 {
  margin: 0;
  font-size: 16px;
  color: var(--text);
}

h3 em {
  font-style: normal;
  font-weight: 400;
  color: var(--text-muted);
  font-size: 13px;
  margin-left: 6px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 2px;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 10px;
  border-radius: 8px;
  transition: background var(--transition-base);
}

li:hover {
  background: var(--primary-soft);
}

li a {
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-right: 12px;
}

li a:hover {
  color: var(--primary);
}

.date {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}
</style>

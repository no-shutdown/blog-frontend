<template>
  <div class="page">
    <h1>归档</h1>
    <div v-for="g in groups" :key="`${g.year}-${g.month}`" class="group">
      <h3>{{ g.year }}年{{ g.month }}月 ({{ g.count }})</h3>
      <ul>
        <li v-for="a in g.articles" :key="a.id">
          <RouterLink :to="`/article/${a.id}`">{{ a.title }}</RouterLink>
          <span>{{ fmt(a.createdAt) }}</span>
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
.page { background: #fff; padding: 16px; border-radius: 10px; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; justify-content: space-between; padding: 6px 0; border-top: 1px solid #f0f0f0; }
</style>

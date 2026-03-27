<template>
  <div>
    <section class="box">
      <h3>分类</h3>
      <ul>
        <li v-for="c in categories" :key="c.id">
          <RouterLink :to="`/category/${c.id}`">{{ c.name }}</RouterLink>
          <span>{{ c.articleCount || 0 }}</span>
        </li>
      </ul>
    </section>
    <section class="box">
      <h3>标签</h3>
      <div class="tags">
        <RouterLink v-for="t in tags" :key="t.id" :to="`/tag/${t.id}`" :style="{ color: t.color || '#1677ff' }">#{{ t.name }}</RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { categoryApi } from '@/api/category'
import { tagApi } from '@/api/tag'

const categories = ref([])
const tags = ref([])

onMounted(async () => {
  const [cRes, tRes] = await Promise.all([categoryApi.list(), tagApi.list()])
  if (cRes.code === 200) categories.value = cRes.data
  if (tRes.code === 200) tags.value = tRes.data
})
</script>

<style scoped>
.box { background: #fff; border-radius: 10px; padding: 14px; margin-bottom: 14px; }
h3 { margin: 0 0 8px; font-size: 16px; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; justify-content: space-between; margin: 6px 0; }
li a { text-decoration: none; color: #111; }
.tags { display: flex; gap: 8px; flex-wrap: wrap; }
.tags a { text-decoration: none; }
</style>

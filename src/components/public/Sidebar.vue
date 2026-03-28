<template>
  <div>
    <section class="box card">
      <h3>分类</h3>
      <ul>
        <li v-for="c in categories" :key="c.id">
          <RouterLink :to="`/category/${c.id}`">{{ c.name }}</RouterLink>
          <span class="count">{{ c.articleCount || 0 }}</span>
        </li>
      </ul>
    </section>

    <section class="box card">
      <h3>标签云</h3>
      <div class="tags">
        <RouterLink
          v-for="t in tags"
          :key="t.id"
          :to="`/tag/${t.id}`"
          :style="{ borderColor: `${t.color || '#0f6bff'}40`, color: t.color || '#0f6bff' }"
        >
          #{{ t.name }}
        </RouterLink>
      </div>
    </section>

    <section v-if="archive.length" class="box card">
      <h3>归档</h3>
      <ul>
        <li v-for="g in archive" :key="`${g.year}-${g.month}`">
          <RouterLink to="/archive">{{ g.year }}年{{ g.month }}月</RouterLink>
          <span class="count">{{ g.count }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { categoryApi } from '@/api/category'
import { tagApi } from '@/api/tag'
import { articleApi } from '@/api/article'

const categories = ref([])
const tags = ref([])
const archive = ref([])

onMounted(async () => {
  const [cRes, tRes, aRes] = await Promise.all([categoryApi.list(), tagApi.list(), articleApi.archive()])
  if (cRes.code === 200) categories.value = cRes.data
  if (tRes.code === 200) tags.value = tRes.data
  if (aRes.code === 200) archive.value = aRes.data
})
</script>

<style scoped>
.box {
  padding: 14px;
  margin-bottom: 14px;
}

h3 {
  margin: 0 0 8px;
  font-size: 15px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px dashed rgba(15, 23, 42, 0.1);
}

li:last-child {
  border-bottom: 0;
}

li a {
  text-decoration: none;
  color: #0f172a;
  font-weight: 600;
}

.count {
  font-size: 12px;
  color: #64748b;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags a {
  border: 1px solid;
  border-radius: 999px;
  padding: 4px 9px;
  font-size: 12px;
  text-decoration: none;
  font-weight: 600;
}
</style>

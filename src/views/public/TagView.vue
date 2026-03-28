<template>
  <div class="tag-page">
    <div class="page-header card">
      <h1>#{{ tagName }}</h1>
      <p>共 {{ list.length }} 篇文章</p>
    </div>
    <ArticleCard v-for="a in list" :key="a.id" :article="a" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/api/article'
import ArticleCard from '@/components/public/ArticleCard.vue'

const route = useRoute()
const list = ref([])
const tagName = computed(() => list.value[0]?.tagName || route.params.id)

async function load() {
  const res = await articleApi.list({ page: 1, size: 50, tagId: route.params.id })
  if (res.code === 200) list.value = res.data.list
}

watch(() => route.params.id, load)
onMounted(load)
</script>

<style scoped>
.page-header {
  padding: 20px 24px;
  margin-bottom: 14px;
}

h1 {
  margin: 0 0 4px;
  font-size: 22px;
}

p {
  margin: 0;
  color: var(--text-muted);
  font-size: 13px;
}
</style>

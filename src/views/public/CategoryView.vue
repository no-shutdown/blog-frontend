<template>
  <div>
    <h1>分类文章</h1>
    <ArticleCard v-for="a in list" :key="a.id" :article="a" />
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/api/article'
import ArticleCard from '@/components/public/ArticleCard.vue'

const route = useRoute()
const list = ref([])

async function load() {
  const res = await articleApi.list({ page: 1, size: 50, categoryId: route.params.id })
  if (res.code === 200) list.value = res.data.list
}

watch(() => route.params.id, load)
onMounted(load)
</script>

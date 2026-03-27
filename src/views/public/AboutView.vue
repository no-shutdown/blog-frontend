<template>
  <article class="page" v-if="data">
    <h1>{{ data.title }}</h1>
    <div v-if="data.contentType === 'markdown'" v-html="renderMarkdown(data.content)" />
    <div v-else v-html="data.content" />
  </article>
</template>

<script setup>
import { marked } from 'marked'
import { onMounted, ref } from 'vue'
import { pageApi } from '@/api/page'

const data = ref(null)
const renderMarkdown = (v) => marked.parse(v || '')

onMounted(async () => {
  const res = await pageApi.get('about')
  if (res.code === 200) data.value = res.data
})
</script>

<style scoped>
.page { background: #fff; padding: 16px; border-radius: 10px; }
</style>

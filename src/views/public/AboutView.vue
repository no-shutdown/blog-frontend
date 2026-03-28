<template>
  <article v-if="data" class="about card">
    <h1>{{ data.title }}</h1>
    <div
      v-if="data.contentType === 'markdown'"
      class="article-content"
      v-html="renderMarkdown(data.content)"
    ></div>
    <div v-else class="article-content" v-html="data.content"></div>
  </article>
</template>

<script setup>
import { marked } from 'marked'
import { onMounted, ref } from 'vue'
import { pageApi } from '@/api/page'
import '@/styles/article-content.css'

const data = ref(null)
const renderMarkdown = (v) => marked.parse(v || '')

onMounted(async () => {
  const res = await pageApi.get('about')
  if (res.code === 200) data.value = res.data
})
</script>

<style scoped>
.about {
  padding: 28px;
}

h1 {
  margin: 0 0 20px;
  font-size: clamp(24px, 3vw, 32px);
}
</style>

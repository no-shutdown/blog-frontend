<template>
  <div v-if="loading">加载中...</div>
  <article v-else-if="article" class="article">
    <h1>{{ article.title }}</h1>
    <div class="meta">{{ fmt(article.createdAt) }} · {{ article.viewCount || 0 }} views</div>

    <div v-if="article.contentType === 'markdown'" class="content" v-html="renderMarkdown(article.content)" />
    <div v-else v-html="article.content" class="content" />

    <CommentList :comments="comments" />
    <CommentForm :article-id="Number(article.id)" @submitted="loadComments" />
  </article>
  <div v-else>文章不存在</div>
</template>

<script setup>
import { marked } from 'marked'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/api/article'
import { commentApi } from '@/api/comment'
import CommentList from '@/components/public/CommentList.vue'
import CommentForm from '@/components/public/CommentForm.vue'

const route = useRoute()
const loading = ref(false)
const article = ref(null)
const comments = ref([])

const fmt = (v) => (v ? new Date(v).toLocaleString('zh-CN') : '-')
const renderMarkdown = (v) => marked.parse(v || '')

async function loadComments() {
  if (!article.value) return
  const res = await commentApi.list(article.value.id)
  if (res.code === 200) comments.value = res.data
}

async function fetchDetail() {
  loading.value = true
  article.value = null
  const res = await articleApi.detail(route.params.id)
  if (res.code === 200) {
    article.value = res.data
    await loadComments()
  }
  loading.value = false
}

watch(() => route.params.id, fetchDetail)
onMounted(fetchDetail)
</script>

<style scoped>
.article { background: #fff; border-radius: 10px; padding: 16px; }
.meta { color: #6b7280; margin-bottom: 12px; }
.content { line-height: 1.8; }
</style>

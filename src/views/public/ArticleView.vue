<template>
  <div class="read-progress" :style="{ width: `${progress}%` }"></div>

  <div v-if="loading" class="state card">文章加载中...</div>

  <div v-else-if="article" class="article-wrap">
    <article class="article card">
      <span v-if="article.categoryName" class="cat-badge">{{ article.categoryName }}</span>
      <h1>{{ article.title }}</h1>

      <div class="meta">
        <span>{{ fmt(article.createdAt) }}</span>
        <span>{{ article.viewCount || 0 }} 阅读</span>
      </div>

      <div v-if="article.tags && article.tags.length" class="tags">
        <RouterLink
          v-for="t in article.tags"
          :key="t.id"
          :to="`/tag/${t.id}`"
          class="tag"
          :style="{ borderColor: `${t.color || '#0f6bff'}40`, color: t.color || '#0f6bff' }"
        >#{{ t.name }}</RouterLink>
      </div>

      <div class="article-content" v-html="rendered"></div>

      <CommentList :comments="comments" />
      <CommentForm :article-id="Number(article.id)" @submitted="loadComments" />
    </article>

    <aside class="toc-aside">
      <TableOfContents :html="rendered" />
    </aside>
  </div>

  <div v-else class="state card">文章不存在</div>
</template>

<script setup>
import { marked } from 'marked'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import sql from 'highlight.js/lib/languages/sql'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { articleApi } from '@/api/article'
import { commentApi } from '@/api/comment'
import CommentList from '@/components/public/CommentList.vue'
import CommentForm from '@/components/public/CommentForm.vue'
import TableOfContents from '@/components/public/TableOfContents.vue'
import '@/styles/article-content.css'

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('java', java)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('sql', sql)

// marked v5+ removed setOptions({ highlight }). Use a custom Renderer instead.
const renderer = new marked.Renderer()
renderer.code = ({ text, lang }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : null
  const highlighted = language
    ? hljs.highlight(text, { language }).value
    : hljs.highlightAuto(text).value
  return `<pre><code class="hljs${language ? ` language-${language}` : ''}">${highlighted}</code></pre>`
}
marked.use({ renderer })

const route = useRoute()
const loading = ref(false)
const article = ref(null)
const comments = ref([])
const rendered = ref('')
const progress = ref(0)

const fmt = (v) => (v ? new Date(v).toLocaleString('zh-CN') : '-')

function onScroll() {
  const el = document.documentElement
  const scrolled = el.scrollTop
  const total = el.scrollHeight - el.clientHeight
  progress.value = total > 0 ? Math.round((scrolled / total) * 100) : 0
}

async function loadComments() {
  if (!article.value) return
  const res = await commentApi.list(article.value.id)
  if (res.code === 200) comments.value = res.data
}

async function fetchDetail() {
  loading.value = true
  article.value = null
  rendered.value = ''
  try {
    const res = await articleApi.detail(route.params.id)
    if (res.code === 200) {
      article.value = res.data
      rendered.value = article.value.contentType === 'markdown'
        ? await marked.parse(article.value.content || '')
        : (article.value.content || '')
      await loadComments()
    }
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, fetchDetail)
onMounted(() => {
  fetchDetail()
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.read-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), #ff6a3d);
  z-index: 9999;
  transition: width 0.1s linear;
  pointer-events: none;
}

.article-wrap {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 220px;
  gap: 20px;
  align-items: start;
}

.article {
  padding: 28px;
  min-width: 0;
}

.cat-badge {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--primary);
  background: var(--primary-soft);
  border-radius: 999px;
  padding: 3px 10px;
  margin-bottom: 10px;
}

h1 {
  margin: 0 0 10px;
  font-size: clamp(26px, 3vw, 38px);
  line-height: 1.2;
}

.meta {
  display: flex;
  gap: 14px;
  color: var(--text-muted);
  font-size: 13px;
  margin-bottom: 12px;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 20px;
}

.tag {
  border: 1px solid;
  border-radius: 999px;
  padding: 3px 9px;
  font-size: 12px;
  font-weight: 600;
  text-decoration: none;
}

.toc-aside {
  min-width: 0;
}

.state {
  padding: 22px;
  color: var(--text-muted);
}

@media (max-width: 1080px) {
  .article-wrap {
    grid-template-columns: 1fr;
  }

  .toc-aside {
    display: none;
  }
}
</style>


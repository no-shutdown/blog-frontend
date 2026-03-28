# Blog Frontend UI Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify the blog frontend visual language, enhance the article reading experience, add interactive polish, and improve the admin panel across all pages.

**Architecture:** Pure Vue 3 SFC modifications — no new frameworks. T1 lays the global foundation (new CSS variables + new shared components); T2–T5 run in parallel after T1 completes. All changes are in template/style layers only; no routing, store, or API changes.

**Tech Stack:** Vue 3 · Vite · Pinia · Pure CSS (CSS variables in `src/styles/theme.css`) · highlight.js (new dep, added in T2)

**Spec:** `docs/superpowers/specs/2026-03-29-blog-frontend-ui-design.md`

---

## Execution Order

```
T1 (foundation) → then launch T2, T3, T4, T5 in parallel
```

T3's `AboutView` reuses `src/styles/article-content.css` created by T2. If running T3 before T2 finishes, skip the `AboutView` step and return to it after T2 completes.

---

## File Map

### New files
| File | Purpose |
|---|---|
| `src/components/public/SkeletonCard.vue` | Shimmer loading placeholder for article list |
| `src/components/public/ScrollToTop.vue` | Floating back-to-top button |
| `src/components/public/Footer.vue` | Global site footer |
| `src/components/public/TableOfContents.vue` | Sticky TOC for article detail |
| `src/styles/article-content.css` | Markdown typography + code highlight styles |

### Modified files
| File | What changes |
|---|---|
| `src/styles/theme.css` | Add 3 new CSS variables |
| `src/components/public/ArticleCard.vue` | Hover lift, cover scale, category badge |
| `src/views/public/HomeView.vue` | Numeric pagination + skeleton loading |
| `src/components/layout/PublicLayout.vue` | Import Footer + ScrollToTop |
| `src/views/public/ArticleView.vue` | highlight.js, progress bar, TOC, tags/category |
| `src/views/public/ArchiveView.vue` | Timeline layout |
| `src/views/public/AboutView.vue` | Card wrap + article-content.css |
| `src/views/public/LinksView.vue` | Card hover effects, avatar fallback |
| `src/views/public/CategoryView.vue` | Card wrap + page title |
| `src/views/public/TagView.vue` | Card wrap + page title |
| `src/components/public/CommentList.vue` | Bubble layout + letter avatar |
| `src/components/public/CommentForm.vue` | Card wrap + consistent styles |
| `src/components/layout/AdminLayout.vue` | Icons + active highlight + collapse |
| `src/views/admin/LoginView.vue` | CSS variable alignment |
| `src/views/admin/DashboardView.vue` | Color-coded stat cards + bar chart |
| All admin list views | Empty states + button group consistency |
| `src/views/admin/ArticleEditView.vue` | Section grouping in cards |
| `src/views/admin/PageEditView.vue` | Section grouping in cards |

---

## Task 1 — Global Foundation (run first)

**Files:**
- Modify: `src/styles/theme.css`
- Modify: `src/components/public/ArticleCard.vue`
- Modify: `src/views/public/HomeView.vue`
- Create: `src/components/public/SkeletonCard.vue`
- Create: `src/components/public/ScrollToTop.vue`
- Create: `src/components/public/Footer.vue`
- Modify: `src/components/layout/PublicLayout.vue`

---

- [ ] **Step 1: Add CSS variables to theme.css**

Open `src/styles/theme.css`. Inside `:root { ... }`, add after the existing variables:

```css
  --transition-base: 0.18s ease;
  --skeleton-bg: #e8edf5;
  --skeleton-shine: linear-gradient(90deg, #e8edf5 25%, #f4f7fd 50%, #e8edf5 75%);
```

- [ ] **Step 2: Add hover effects to ArticleCard**

Open `src/components/public/ArticleCard.vue`.

In the `<template>`, add a category badge inside `.content-wrap` just before `<h2>`:

```html
<span v-if="article.categoryName" class="cat-badge">{{ article.categoryName }}</span>
```

In `<style scoped>`, add to `.article-card`:

```css
.article-card {
  /* existing rules … */
  transition: transform var(--transition-base), box-shadow var(--transition-base);
  overflow: hidden;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}
```

Add new rules:

```css
.cover {
  /* existing rules … */
  transition: transform 0.3s ease;
}

.article-card:hover .cover {
  transform: scale(1.04);
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
  padding: 3px 8px;
  margin-bottom: 6px;
}
```

- [ ] **Step 3: Create SkeletonCard component**

Create `src/components/public/SkeletonCard.vue`:

```vue
<template>
  <div class="skeleton-card card">
    <div class="sk-cover"></div>
    <div class="sk-body">
      <div class="sk-line" style="width:30%;height:14px;margin-bottom:10px;"></div>
      <div class="sk-line" style="width:75%;height:22px;margin-bottom:12px;"></div>
      <div class="sk-line" style="width:100%;height:13px;margin-bottom:6px;"></div>
      <div class="sk-line" style="width:85%;height:13px;margin-bottom:6px;"></div>
      <div class="sk-line" style="width:60%;height:13px;"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: grid;
  grid-template-columns: 220px minmax(0,1fr);
  gap: 14px;
  padding: 14px;
  margin-bottom: 14px;
}

.sk-cover {
  height: 160px;
  border-radius: 14px;
  background: var(--skeleton-bg);
  background-image: var(--skeleton-shine);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.sk-body {
  padding: 4px 0;
}

.sk-line {
  border-radius: 6px;
  background: var(--skeleton-bg);
  background-image: var(--skeleton-shine);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}

@media (max-width: 860px) {
  .skeleton-card { grid-template-columns: 1fr; }
  .sk-cover { height: 200px; }
}
</style>
```

- [ ] **Step 4: Replace pagination in HomeView + add skeletons**

Open `src/views/public/HomeView.vue`. Replace the entire file with:

```vue
<template>
  <div>
    <template v-if="loading">
      <SkeletonCard v-for="n in 3" :key="n" />
    </template>
    <template v-else>
      <ArticleCard v-for="a in list" :key="a.id" :article="a" />
    </template>

    <div class="pager card">
      <button class="btn-light" :disabled="page <= 1" @click="change(page - 1)">‹</button>

      <button
        v-for="p in pageButtons"
        :key="p"
        :class="['page-btn', p === page && 'active']"
        @click="typeof p === 'number' && change(p)"
        :disabled="p === '…'"
      >{{ p }}</button>

      <button class="btn-light" :disabled="page >= totalPages" @click="change(page + 1)">›</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ArticleCard from '@/components/public/ArticleCard.vue'
import SkeletonCard from '@/components/public/SkeletonCard.vue'
import { articleApi } from '@/api/article'

const page = ref(1)
const size = 10
const total = ref(0)
const list = ref([])
const loading = ref(false)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size)))

const pageButtons = computed(() => {
  const total = totalPages.value
  const cur = page.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = new Set([1, total, cur, cur - 1, cur + 1].filter(p => p >= 1 && p <= total))
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('…')
    result.push(sorted[i])
  }
  return result
})

async function fetchList() {
  loading.value = true
  const res = await articleApi.list({ page: page.value, size })
  if (res.code === 200) { list.value = res.data.list; total.value = res.data.total }
  loading.value = false
}

async function change(next) {
  page.value = next
  window.scrollTo({ top: 0, behavior: 'smooth' })
  await fetchList()
}

onMounted(fetchList)
</script>

<style scoped>
.pager {
  margin-top: 12px;
  padding: 10px 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.page-btn {
  min-width: 36px;
  padding: 7px 10px;
  font-size: 13px;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--line);
  box-shadow: none;
}

.page-btn:hover:not(:disabled) {
  background: var(--primary-soft);
  color: var(--primary);
  border-color: var(--primary-soft);
}

.page-btn.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
}

.page-btn:disabled {
  color: var(--text-muted);
  cursor: default;
}
</style>
```

- [ ] **Step 5: Create ScrollToTop component**

Create `src/components/public/ScrollToTop.vue`:

```vue
<template>
  <Transition name="fade-up">
    <button v-show="visible" class="scroll-top" @click="scrollToTop" aria-label="回到顶部">↑</button>
  </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
.scroll-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 200;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  padding: 0;
  font-size: 18px;
  background: linear-gradient(135deg, var(--primary), #2f8bff);
  box-shadow: var(--shadow-md);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 720px) {
  .scroll-top { bottom: 16px; right: 16px; }
}
</style>
```

- [ ] **Step 6: Create Footer component**

Create `src/components/public/Footer.vue`:

```vue
<template>
  <footer class="footer">
    <p>© {{ year }} Nebula Blog &nbsp;·&nbsp;
      <RouterLink to="/archive">归档</RouterLink> &nbsp;·&nbsp;
      <RouterLink to="/about">关于</RouterLink> &nbsp;·&nbsp;
      <RouterLink to="/links">友链</RouterLink>
    </p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  max-width: 1240px;
  margin: 28px auto 0;
  padding: 18px 0 10px;
  border-top: 1px solid var(--line);
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

.footer a {
  color: var(--text-muted);
}

.footer a:hover {
  color: var(--primary);
}
</style>
```

- [ ] **Step 7: Register Footer and ScrollToTop in PublicLayout**

Open `src/components/layout/PublicLayout.vue`.

In `<script setup>`, add imports:

```js
import Footer from '@/components/public/Footer.vue'
import ScrollToTop from '@/components/public/ScrollToTop.vue'
```

In `<template>`, inside `.public-shell` after the `.layout-grid` div, add:

```html
<Footer />
<ScrollToTop />
```

- [ ] **Step 8: Commit T1**

```bash
git add src/styles/theme.css \
        src/components/public/ArticleCard.vue \
        src/views/public/HomeView.vue \
        src/components/public/SkeletonCard.vue \
        src/components/public/ScrollToTop.vue \
        src/components/public/Footer.vue \
        src/components/layout/PublicLayout.vue
git commit -m "feat: T1 global foundation — card hover, numeric pager, skeleton, scroll-to-top, footer"
```

---

## Task 2 — Article Reading Experience (parallel after T1)

**Files:**
- Create: `src/styles/article-content.css`
- Create: `src/components/public/TableOfContents.vue`
- Modify: `src/views/public/ArticleView.vue`

---

- [ ] **Step 1: Install highlight.js**

```bash
cd blog-frontend
npm install highlight.js
```

- [ ] **Step 2: Create article-content.css**

Create `src/styles/article-content.css`:

```css
/* Article typography + highlight.js code block styles */

.article-content {
  color: #1f2937;
  line-height: 1.85;
  font-size: 16px;
}

.article-content h2,
.article-content h3,
.article-content h4 {
  margin-top: 2em;
  margin-bottom: 0.6em;
  line-height: 1.3;
  scroll-margin-top: 80px;
}

.article-content h2 { font-size: 1.5em; border-bottom: 2px solid var(--line); padding-bottom: 6px; }
.article-content h3 { font-size: 1.25em; }
.article-content h4 { font-size: 1.1em; }

.article-content p { margin: 0 0 1.2em; }

.article-content a {
  color: var(--primary);
  text-decoration: underline;
  text-decoration-color: rgba(15, 107, 255, 0.3);
}

.article-content blockquote {
  margin: 1.2em 0;
  padding: 12px 18px;
  border-left: 4px solid var(--primary);
  background: var(--surface-soft);
  border-radius: 0 10px 10px 0;
  color: var(--text-secondary);
  font-style: italic;
}

.article-content blockquote p { margin: 0; }

.article-content ul,
.article-content ol {
  padding-left: 1.6em;
  margin: 0 0 1.2em;
}

.article-content li { margin-bottom: 0.4em; }

.article-content table {
  margin: 1.2em 0;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid var(--line);
}

.article-content th {
  background: var(--surface-soft);
}

.article-content img {
  max-width: 100%;
  border-radius: 10px;
  display: block;
  margin: 1.2em auto;
}

.article-content hr {
  border: none;
  border-top: 1px solid var(--line);
  margin: 2em 0;
}

/* Inline code */
.article-content code:not(pre code) {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 0.88em;
  background: var(--primary-soft);
  color: var(--primary);
  padding: 2px 6px;
  border-radius: 5px;
}

/* Code block container */
.article-content pre {
  margin: 1.2em 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.article-content pre code {
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.65;
  display: block;
  padding: 18px 20px;
  overflow-x: auto;
  background: #1e2433;
  color: #cdd6f4;
}

/* highlight.js token overrides (github-dark palette) */
.hljs-keyword, .hljs-selector-tag { color: #cba6f7; }
.hljs-string, .hljs-attr { color: #a6e3a1; }
.hljs-number, .hljs-literal { color: #fab387; }
.hljs-comment { color: #6c7086; font-style: italic; }
.hljs-function, .hljs-title { color: #89b4fa; }
.hljs-variable, .hljs-name { color: #cdd6f4; }
.hljs-built_in { color: #89dceb; }
.hljs-type { color: #f38ba8; }
```

- [ ] **Step 3: Create TableOfContents component**

Create `src/components/public/TableOfContents.vue`:

```vue
<template>
  <nav v-if="headings.length > 1" class="toc">
    <p class="toc-title">目录</p>
    <ul>
      <li
        v-for="h in headings"
        :key="h.id"
        :class="['toc-item', `toc-${h.tag}`, h.id === activeId && 'active']"
      >
        <a :href="`#${h.id}`" @click.prevent="scrollTo(h.id)">{{ h.text }}</a>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({ html: { type: String, default: '' } })

const headings = ref([])
const activeId = ref('')
let observers = []

function buildHeadings(html) {
  if (!html) return []
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const nodes = doc.querySelectorAll('h2, h3')
  return [...nodes].map((n, i) => ({
    tag: n.tagName.toLowerCase(),
    text: n.textContent,
    id: n.id || `heading-${i}`
  }))
}

function injectIds(html) {
  // Inject IDs into rendered DOM after ArticleView mounts
  headings.value.forEach(({ id, text }) => {
    const els = document.querySelectorAll('.article-content h2, .article-content h3')
    els.forEach(el => {
      if (el.textContent === text && !el.id) el.id = id
    })
  })
}

function setupObservers() {
  observers.forEach(o => o.disconnect())
  observers = []
  headings.value.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) activeId.value = id },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    obs.observe(el)
    observers.push(obs)
  })
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(() => props.html, (html) => {
  headings.value = buildHeadings(html)
  setTimeout(() => { injectIds(); setupObservers() }, 100)
}, { immediate: true })

onUnmounted(() => observers.forEach(o => o.disconnect()))
</script>

<style scoped>
.toc {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 14px;
  background: var(--surface);
  border: 1px solid rgba(255,255,255,0.72);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  font-size: 13px;
}

.toc-title {
  margin: 0 0 10px;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 2px;
}

.toc-item a {
  display: block;
  padding: 5px 8px;
  border-radius: 7px;
  color: var(--text-secondary);
  text-decoration: none;
  line-height: 1.4;
  transition: var(--transition-base);
}

.toc-item a:hover,
.toc-item.active a {
  background: var(--primary-soft);
  color: var(--primary);
}

.toc-h3 a { padding-left: 20px; font-size: 12px; }

@media (max-width: 1080px) {
  .toc { display: none; }
}
</style>
```

- [ ] **Step 4: Update ArticleView with all enhancements**

> **Note on marked v13:** `marked.setOptions({ highlight })` was removed in marked v5. Use a custom `Renderer` instead — no extra dependency needed.

Replace `src/views/public/ArticleView.vue` with:

```vue
<template>
  <!-- Reading progress bar -->
  <div class="read-progress" :style="{ width: progress + '%' }"></div>

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

      <div
        class="article-content"
        v-html="rendered"
      />

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
  const res = await articleApi.detail(route.params.id)
  if (res.code === 200) {
    article.value = res.data
    rendered.value = article.value.contentType === 'markdown'
      ? marked.parse(article.value.content || '')
      : (article.value.content || '')
    await loadComments()
  }
  loading.value = false
}

watch(() => route.params.id, fetchDetail)
onMounted(() => {
  fetchDetail()
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
  grid-template-columns: minmax(0,1fr) 220px;
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
  .article-wrap { grid-template-columns: 1fr; }
  .toc-aside { display: none; }
}
</style>
```

- [ ] **Step 5: Commit T2**

```bash
git add src/styles/article-content.css \
        src/components/public/TableOfContents.vue \
        src/views/public/ArticleView.vue \
        package.json package-lock.json
git commit -m "feat: T2 article reading — highlight.js, Markdown typography, TOC, progress bar, tags/category"
```

---

## Task 3 — Secondary Pages Unification (parallel after T1)

**Files:**
- Modify: `src/views/public/ArchiveView.vue`
- Modify: `src/views/public/AboutView.vue`
- Modify: `src/views/public/LinksView.vue`
- Modify: `src/views/public/CategoryView.vue`
- Modify: `src/views/public/TagView.vue`

Note: `AboutView` applies `article-content.css` which is created in T2. If T2 is not yet merged, skip the `AboutView` CSS import and add it later.

---

- [ ] **Step 1: Rebuild ArchiveView as timeline**

Replace `src/views/public/ArchiveView.vue`:

```vue
<template>
  <div class="archive card">
    <h1 class="page-title">归档</h1>

    <div v-for="g in groups" :key="`${g.year}-${g.month}`" class="group">
      <div class="month-node">
        <span class="dot"></span>
        <h3>{{ g.year }}年{{ g.month }}月
          <em>({{ g.count }})</em>
        </h3>
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
  box-shadow: 0 0 0 3px rgba(15,107,255,0.18);
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

li a:hover { color: var(--primary); }

.date {
  font-size: 12px;
  color: var(--text-muted);
  white-space: nowrap;
}
</style>
```

- [ ] **Step 2: Update AboutView**

Replace `src/views/public/AboutView.vue`:

```vue
<template>
  <article class="about card" v-if="data">
    <h1>{{ data.title }}</h1>
    <div
      class="article-content"
      v-if="data.contentType === 'markdown'"
      v-html="renderMarkdown(data.content)"
    />
    <div class="article-content" v-else v-html="data.content" />
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
```

- [ ] **Step 3: Rebuild LinksView cards**

Replace `src/views/public/LinksView.vue`:

```vue
<template>
  <div class="links-page">
    <h1 class="page-title">友情链接</h1>
    <div class="grid">
      <a
        v-for="l in links"
        :key="l.id"
        :href="l.url"
        target="_blank"
        rel="noreferrer"
        class="link-card card"
      >
        <div class="avatar-wrap">
          <img v-if="l.avatar" :src="l.avatar" class="avatar" :alt="l.name" />
          <span v-else class="avatar-initial">{{ l.name[0] }}</span>
        </div>
        <div class="info">
          <h3>{{ l.name }}</h3>
          <p>{{ l.description }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { linkApi } from '@/api/link'

const links = ref([])

onMounted(async () => {
  const res = await linkApi.list()
  if (res.code === 200) links.value = res.data
})
</script>

<style scoped>
.links-page {
  padding: 4px 0;
}

.page-title {
  font-size: 26px;
  margin: 0 0 18px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.link-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  text-decoration: none;
  color: inherit;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.link-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
  color: inherit;
}

.avatar-wrap {
  flex-shrink: 0;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--line);
}

.avatar-initial {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--primary-soft);
  color: var(--primary);
  font-weight: 700;
  font-size: 18px;
  border: 2px solid rgba(15,107,255,0.2);
}

.info {
  min-width: 0;
}

.info h3 {
  margin: 0 0 4px;
  font-size: 15px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.info p {
  margin: 0;
  font-size: 12px;
  color: var(--text-muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}
</style>
```

- [ ] **Step 4: Wrap CategoryView and TagView in card**

Replace `src/views/public/CategoryView.vue`:

```vue
<template>
  <div class="cat-page">
    <div class="page-header card">
      <h1>分类：{{ categoryName }}</h1>
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
const categoryName = computed(() => list.value[0]?.categoryName || '全部')

async function load() {
  const res = await articleApi.list({ page: 1, size: 50, categoryId: route.params.id })
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

h1 { margin: 0 0 4px; font-size: 22px; }
p { margin: 0; color: var(--text-muted); font-size: 13px; }
</style>
```

Replace `src/views/public/TagView.vue` with the same structure but using `tagId`:

```vue
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

h1 { margin: 0 0 4px; font-size: 22px; }
p { margin: 0; color: var(--text-muted); font-size: 13px; }
</style>
```

- [ ] **Step 5: Commit T3**

```bash
git add src/views/public/ArchiveView.vue \
        src/views/public/AboutView.vue \
        src/views/public/LinksView.vue \
        src/views/public/CategoryView.vue \
        src/views/public/TagView.vue
git commit -m "feat: T3 secondary pages — timeline archive, cards for links/about/category/tag"
```

---

## Task 4 — Comment Section Rebuild (parallel after T1)

**Files:**
- Modify: `src/components/public/CommentList.vue`
- Modify: `src/components/public/CommentForm.vue`

---

- [ ] **Step 1: Rebuild CommentList with bubble layout**

Replace `src/components/public/CommentList.vue`:

```vue
<template>
  <div class="comments">
    <h3 class="comments-title">
      评论
      <span class="count-badge">{{ comments.length }}</span>
    </h3>

    <div v-if="!rootComments.length" class="empty">暂无评论，来发表第一条吧 :)</div>

    <div v-for="item in rootComments" :key="item.id" class="comment-item">
      <div class="avatar">{{ item.nickname?.[0]?.toUpperCase() || '?' }}</div>
      <div class="bubble">
        <div class="bubble-head">
          <span class="nickname">{{ item.nickname }}</span>
          <span class="time">{{ fmt(item.createdAt) }}</span>
        </div>
        <div class="bubble-body">{{ item.content }}</div>

        <div v-if="replies(item.id).length" class="replies">
          <div v-for="reply in replies(item.id)" :key="reply.id" class="reply-item">
            <div class="avatar sm">{{ reply.nickname?.[0]?.toUpperCase() || '?' }}</div>
            <div class="reply-bubble">
              <span class="nickname">{{ reply.nickname }}</span>
              <span class="time">{{ fmt(reply.createdAt) }}</span>
              <div>{{ reply.content }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ comments: { type: Array, default: () => [] } })
const rootComments = computed(() => props.comments.filter((c) => !c.parentId))
const replies = (id) => props.comments.filter((c) => c.parentId === id)

function fmt(v) {
  if (!v) return '-'
  const diff = Date.now() - new Date(v).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 60) return `${m || 1} 分钟前`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h} 小时前`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d} 天前`
  return new Date(v).toLocaleDateString('zh-CN')
}
</script>

<style scoped>
.comments {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
}

.comments-title {
  margin: 0 0 20px;
  font-size: 18px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.count-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--primary-soft);
  color: var(--primary);
  font-size: 12px;
  font-weight: 700;
  padding: 0 6px;
}

.empty {
  color: var(--text-muted);
  font-size: 14px;
  padding: 20px 0;
}

.comment-item {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.avatar {
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), #2f8bff);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
}

.avatar.sm {
  width: 28px;
  height: 28px;
  font-size: 12px;
}

.bubble {
  flex: 1;
  min-width: 0;
  background: var(--surface-soft);
  border: 1px solid var(--line);
  border-radius: 0 14px 14px 14px;
  padding: 12px 14px;
}

.bubble-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.nickname {
  font-weight: 700;
  font-size: 14px;
  color: var(--text);
}

.time {
  font-size: 12px;
  color: var(--text-muted);
}

.bubble-body {
  font-size: 14px;
  line-height: 1.7;
  color: var(--text-secondary);
  white-space: pre-wrap;
}

.replies {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--line);
  display: grid;
  gap: 10px;
}

.reply-item {
  display: flex;
  gap: 8px;
}

.reply-bubble {
  flex: 1;
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.reply-bubble .nickname {
  font-size: 13px;
  margin-right: 6px;
}

.reply-bubble .time {
  margin-right: 8px;
}
</style>
```

- [ ] **Step 2: Restyle CommentForm**

Replace `src/components/public/CommentForm.vue`:

```vue
<template>
  <div class="form-wrap card">
    <h3 class="form-title">发表评论</h3>
    <form @submit.prevent="submit">
      <div class="row">
        <input v-model="form.nickname" maxlength="50" required placeholder="昵称 *" />
        <input v-model="form.email" type="email" placeholder="邮箱（可选）" />
      </div>
      <textarea v-model="form.content" maxlength="1000" required placeholder="说点什么…" rows="4" />
      <div class="form-footer">
        <p v-if="message" :class="['msg', msgType]">{{ message }}</p>
        <button :disabled="loading" type="submit">
          {{ loading ? '提交中…' : '提交评论' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { commentApi } from '@/api/comment'

const props = defineProps({ articleId: { type: Number, required: true }, parentId: { type: Number, default: null } })
const emit = defineEmits(['submitted'])

const form = ref({ nickname: '', email: '', content: '' })
const loading = ref(false)
const message = ref('')
const msgType = ref('ok')

async function submit() {
  loading.value = true
  message.value = ''
  try {
    const res = await commentApi.submit({
      articleId: props.articleId,
      parentId: props.parentId,
      ...form.value
    })
    if (res.code === 200) {
      message.value = '评论已提交，等待审核。'
      msgType.value = 'ok'
      form.value = { nickname: '', email: '', content: '' }
      emit('submitted')
    } else {
      message.value = res.message || '提交失败，请重试。'
      msgType.value = 'err'
    }
  } catch {
    message.value = '提交失败，请重试。'
    msgType.value = 'err'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-wrap {
  margin-top: 24px;
  padding: 20px 22px;
}

.form-title {
  margin: 0 0 16px;
  font-size: 17px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}

textarea {
  min-height: 110px;
  resize: vertical;
  margin-bottom: 12px;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.msg {
  margin: 0;
  font-size: 13px;
}

.msg.ok { color: var(--ok); }
.msg.err { color: var(--danger); }

@media (max-width: 560px) {
  .row { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 3: Commit T4**

```bash
git add src/components/public/CommentList.vue \
        src/components/public/CommentForm.vue
git commit -m "feat: T4 comments — bubble layout, letter avatar, relative time, card form"
```

---

## Task 5 — Admin UI Polish (parallel after T1)

**Files:**
- Modify: `src/components/layout/AdminLayout.vue`
- Modify: `src/views/admin/DashboardView.vue`
- Modify: `src/views/admin/ArticleListView.vue`
- Modify: `src/views/admin/CategoryView.vue`
- Modify: `src/views/admin/TagView.vue`
- Modify: `src/views/admin/CommentView.vue`
- Modify: `src/views/admin/LinkView.vue`
- Modify: `src/views/admin/ArticleEditView.vue`
- Modify: `src/views/admin/PageEditView.vue`

---

- [ ] **Step 1: Enhance AdminLayout sidebar**

Open `src/components/layout/AdminLayout.vue`.

Add a `collapsed` ref and toggle button. Replace the entire file:

```vue
<template>
  <div class="admin-layout" :class="{ collapsed }">
    <aside class="menu">
      <div class="menu-top">
        <div v-if="!collapsed">
          <h2>控制台</h2>
          <p class="sub">内容管理中心</p>
        </div>
        <button class="collapse-btn btn-light" @click="collapsed = !collapsed" :title="collapsed ? '展开' : '收起'">
          {{ collapsed ? '→' : '←' }}
        </button>
      </div>

      <nav class="menu-list">
        <RouterLink to="/admin/dashboard" :title="collapsed ? '仪表盘' : ''">
          <span class="icon">📊</span><span class="label">仪表盘</span>
        </RouterLink>
        <RouterLink to="/admin/articles" :title="collapsed ? '文章管理' : ''">
          <span class="icon">📝</span><span class="label">文章管理</span>
        </RouterLink>
        <RouterLink to="/admin/categories" :title="collapsed ? '分类管理' : ''">
          <span class="icon">🗂️</span><span class="label">分类管理</span>
        </RouterLink>
        <RouterLink to="/admin/tags" :title="collapsed ? '标签管理' : ''">
          <span class="icon">🏷️</span><span class="label">标签管理</span>
        </RouterLink>
        <RouterLink to="/admin/comments" :title="collapsed ? '评论管理' : ''">
          <span class="icon">💬</span><span class="label">评论管理</span>
        </RouterLink>
        <RouterLink to="/admin/links" :title="collapsed ? '友链管理' : ''">
          <span class="icon">🔗</span><span class="label">友链管理</span>
        </RouterLink>
        <RouterLink to="/admin/pages/about" :title="collapsed ? '关于页面' : ''">
          <span class="icon">📄</span><span class="label">关于页面</span>
        </RouterLink>
      </nav>

      <button @click="doLogout" class="logout" :title="collapsed ? '退出登录' : ''">
        <span class="icon">🚪</span><span class="label">退出登录</span>
      </button>
    </aside>

    <main class="panel">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const collapsed = ref(false)

function doLogout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 16px;
  padding: 14px;
  transition: grid-template-columns 0.22s ease;
}

.admin-layout.collapsed {
  grid-template-columns: 64px minmax(0, 1fr);
}

.menu {
  border-radius: 22px;
  padding: 18px 14px;
  background: linear-gradient(180deg, #0f172a, #1b2b4c);
  color: #e5edff;
  box-shadow: 0 18px 40px rgba(9, 20, 44, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: padding 0.22s ease;
}

.menu-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 14px;
  gap: 8px;
}

.menu h2 { margin: 2px 0 4px; font-size: 20px; }
.sub { margin: 0; color: #9eb1d6; font-size: 12px; }

.collapse-btn {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  padding: 0;
  font-size: 13px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  color: #d3def8;
  border-color: rgba(255,255,255,0.12);
  box-shadow: none;
  margin-left: auto;
}

.collapse-btn:hover { background: rgba(255,255,255,0.16); color: #fff; }

.menu-list {
  display: grid;
  gap: 4px;
  flex: 1;
}

.menu a {
  text-decoration: none;
  color: #d3def8;
  font-size: 14px;
  padding: 9px 10px;
  border-radius: 10px;
  transition: 0.15s ease;
  display: flex;
  align-items: center;
  gap: 9px;
  white-space: nowrap;
  overflow: hidden;
}

.icon { flex-shrink: 0; font-size: 16px; }
.label { overflow: hidden; transition: opacity 0.15s ease, max-width 0.22s ease; }

.collapsed .label { opacity: 0; max-width: 0; }

.menu a:hover { background: rgba(255, 255, 255, 0.08); }

.menu a.router-link-active {
  color: #fff;
  background: linear-gradient(135deg, rgba(15,107,255,0.92), rgba(47,139,255,0.88));
}

.logout {
  margin-top: 12px;
  border: 1px solid rgba(223, 234, 255, 0.26);
  color: #f8fbff;
  background: linear-gradient(135deg, rgba(66,91,132,0.96), rgba(42,62,95,0.98));
  box-shadow: 0 10px 24px rgba(7, 18, 40, 0.28);
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 9px 10px;
  white-space: nowrap;
  overflow: hidden;
  width: 100%;
  border-radius: 10px;
}

.panel { padding: 8px; }

@media (max-width: 980px) {
  .admin-layout { grid-template-columns: 1fr !important; }
  .menu { border-radius: 16px; }
  .menu-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .logout { margin-top: 10px; }
  .collapse-btn { display: none; }
  .collapsed .label { opacity: 1; max-width: unset; }
}
</style>
```

- [ ] **Step 2: Align LoginView with CSS variables**

Open `src/views/admin/LoginView.vue`. The `.blur-a/.blur-b` colors use hardcoded hex values (`#4f8dff`, `#ff8a66`). Replace them to use CSS variables, and ensure the full-page background uses the same gradient as the public frontend.

In the `<style scoped>` block, change:

```css
/* before */
.blur-a { background: #4f8dff; }
.blur-b { background: #ff8a66; }
```

to:

```css
.blur-a { background: var(--primary); }
.blur-b { background: #ff6a3d; }
```

Also add a background to `.login-wrap` that matches the public body gradient:

```css
.login-wrap {
  /* existing rules ... */
  background:
    radial-gradient(980px 430px at 8% -20%, rgba(15,107,255,0.18), transparent),
    radial-gradient(900px 400px at 94% -10%, rgba(255,106,61,0.12), transparent),
    linear-gradient(180deg, #f8fbff 0%, #edf3fb 100%);
}
```

- [ ] **Step 3: Enhance DashboardView with color-coded cards + bar chart**

Replace `src/views/admin/DashboardView.vue`:

```vue
<template>
  <div>
    <h2 class="page-title">仪表盘</h2>

    <div class="stat-grid">
      <div
        v-for="item in items"
        :key="item.label"
        class="stat card"
        :style="{ '--accent': item.color }"
      >
        <span class="stat-icon">{{ item.icon }}</span>
        <p class="stat-label">{{ item.label }}</p>
        <p class="stat-value">{{ item.value ?? '—' }}</p>
      </div>
    </div>

    <div v-if="monthlyData.length" class="chart card">
      <p class="chart-title">近期月度发文</p>
      <div class="bars">
        <div
          v-for="m in monthlyData"
          :key="`${m.year}-${m.month}`"
          class="bar-col"
        >
          <div
            class="bar"
            :style="{ height: barHeight(m.count) + '%' }"
            :title="`${m.count} 篇`"
          ></div>
          <span class="bar-label">{{ m.month }}月</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { adminApi } from '@/api/admin'
import { articleApi } from '@/api/article'

const stats = ref(null)
const archiveGroups = ref([])

const items = computed(() => {
  if (!stats.value) return []
  return [
    { label: '文章总数',   value: stats.value.articleCount,        icon: '📝', color: '#0f6bff' },
    { label: '已发布',     value: stats.value.publishedCount,      icon: '✅', color: '#20b26c' },
    { label: '草稿',       value: stats.value.draftCount,          icon: '📋', color: '#f59e0b' },
    { label: '评论总数',   value: stats.value.commentCount,        icon: '💬', color: '#8b5cf6' },
    { label: '待审核评论', value: stats.value.pendingCommentCount, icon: '⏳', color: '#ef4444' },
    { label: '总浏览量',   value: stats.value.totalViewCount,      icon: '👁️', color: '#0ea5e9' }
  ]
})

const monthlyData = computed(() => archiveGroups.value.slice(0, 12))
const maxCount = computed(() => Math.max(...monthlyData.value.map(m => m.count), 1))
const barHeight = (count) => Math.max(8, Math.round((count / maxCount.value) * 100))

onMounted(async () => {
  const [sRes, aRes] = await Promise.all([adminApi.dashboard(), articleApi.archive()])
  if (sRes.code === 200) stats.value = sRes.data
  if (aRes.code === 200) archiveGroups.value = aRes.data
})
</script>

<style scoped>
.page-title { margin: 0 0 18px; font-size: 22px; }

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 20px;
}

.stat {
  padding: 18px;
  position: relative;
  overflow: hidden;
}

.stat::before {
  content: '';
  position: absolute;
  top: -18px;
  right: -18px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.1;
}

.stat-icon { font-size: 22px; display: block; margin-bottom: 8px; }
.stat-label { margin: 0 0 4px; color: var(--text-muted); font-size: 12px; }
.stat-value { margin: 0; font-size: clamp(26px,3vw,36px); font-weight: 700; color: var(--accent); }

.chart {
  padding: 20px;
}

.chart-title {
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.bars {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 120px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  height: 100%;
}

.bar {
  width: 100%;
  background: linear-gradient(180deg, var(--primary), #2f8bff);
  border-radius: 5px 5px 0 0;
  transition: height 0.4s ease;
  min-height: 4px;
}

.bar-label {
  font-size: 11px;
  color: var(--text-muted);
  white-space: nowrap;
}

@media (max-width: 980px) {
  .stat-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 640px) {
  .stat-grid { grid-template-columns: 1fr; }
}
</style>
```

- [ ] **Step 4: Add empty states to all admin list views**

For each of `ArticleListView.vue`, `CategoryView.vue`, `TagView.vue`, `CommentView.vue`, `LinkView.vue`:

Open the file. Find the `<table>` or list element. Add an empty state check like:

```html
<div v-if="!list.length" class="empty-state">暂无数据</div>
<table v-else>
  <!-- existing table markup -->
</table>
```

And add the style (in scoped styles):

```css
.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 14px;
}
```

Also ensure action button groups use consistent spacing:

```css
.actions { display: flex; gap: 6px; }
```

(Read each file first to confirm where `list` is defined and the exact table structure, then apply accordingly.)

- [ ] **Step 5: Group ArticleEditView and PageEditView form sections in cards**

Open `src/views/admin/ArticleEditView.vue`. Find logical groups (title/meta, content, publish settings). Wrap each group:

```html
<div class="section card">
  <h3 class="section-title">基本信息</h3>
  <!-- title, category, tags inputs -->
</div>

<div class="section card">
  <h3 class="section-title">文章内容</h3>
  <!-- editor -->
</div>
```

Add scoped styles:

```css
.section {
  padding: 18px 20px;
  margin-bottom: 14px;
}

.section-title {
  margin: 0 0 14px;
  font-size: 15px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 12px;
}
```

Apply same pattern to `src/views/admin/PageEditView.vue`.

(Read each file first to understand the current template structure before editing.)

- [ ] **Step 6: Commit T5**

```bash
git add src/components/layout/AdminLayout.vue \
        src/views/admin/DashboardView.vue \
        src/views/admin/ArticleListView.vue \
        src/views/admin/CategoryView.vue \
        src/views/admin/TagView.vue \
        src/views/admin/CommentView.vue \
        src/views/admin/LinkView.vue \
        src/views/admin/ArticleEditView.vue \
        src/views/admin/PageEditView.vue
git commit -m "feat: T5 admin UI — sidebar icons/collapse, color-coded stats, bar chart, empty states, form sections"
```

---

## Verification Checklist

After all tasks merge:

- [ ] `npm run dev` starts without errors
- [ ] Homepage shows skeleton cards during load, then article cards with hover lift effect
- [ ] Numeric pagination shows correct page buttons
- [ ] Article detail page shows reading progress bar, code blocks with syntax highlighting, floating TOC on desktop, tags/category
- [ ] Archive page shows timeline with month dots
- [ ] About page renders Markdown with typography styles
- [ ] Links page shows cards with hover animation and avatar fallbacks
- [ ] Comments show bubble layout with letter avatars and relative timestamps
- [ ] Comment form uses card style with consistent inputs
- [ ] Admin sidebar shows icons, active state highlight, and collapses on desktop
- [ ] Dashboard shows color-coded stat cards and monthly bar chart
- [ ] ScrollToTop button appears when scrolling down 400px
- [ ] Footer visible on all public pages
- [ ] `npm run test` passes (no existing tests broken)

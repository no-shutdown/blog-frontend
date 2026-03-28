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
import { onUnmounted, ref, watch } from 'vue'

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

function injectIds() {
  // Inject IDs into rendered DOM after ArticleView mounts.
  headings.value.forEach(({ id, text }) => {
    const els = document.querySelectorAll('.article-content h2, .article-content h3')
    els.forEach((el) => {
      if (el.textContent === text && !el.id) el.id = id
    })
  })
}

function setupObservers() {
  observers.forEach((o) => o.disconnect())
  observers = []
  headings.value.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) activeId.value = id
      },
      { rootMargin: '-20% 0px -70% 0px' }
    )
    obs.observe(el)
    observers.push(obs)
  })
}

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(
  () => props.html,
  (html) => {
    headings.value = buildHeadings(html)
    setTimeout(() => {
      injectIds()
      setupObservers()
    }, 100)
  },
  { immediate: true }
)

onUnmounted(() => observers.forEach((o) => o.disconnect()))
</script>

<style scoped>
.toc {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 14px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.72);
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

.toc-h3 a {
  padding-left: 20px;
  font-size: 12px;
}

@media (max-width: 1080px) {
  .toc {
    display: none;
  }
}
</style>

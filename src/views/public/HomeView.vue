<template>
  <div>
    <template v-if="loading">
      <SkeletonCard v-for="n in 3" :key="n" />
    </template>
    <template v-else>
      <ArticleCard v-for="a in list" :key="a.id" :article="a" />
    </template>

    <div class="pager card">
      <button class="btn-light" :disabled="page <= 1" @click="change(page - 1)">&lt;</button>

      <button
        v-for="(p, i) in pageButtons"
        :key="`${p}-${i}`"
        :class="['page-btn', p === page && 'active']"
        @click="typeof p === 'number' && change(p)"
        :disabled="p === '...'"
      >{{ p }}</button>

      <button class="btn-light" :disabled="page >= totalPages" @click="change(page + 1)">&gt;</button>
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
  const totalPageCount = totalPages.value
  const cur = page.value

  if (totalPageCount <= 7) {
    return Array.from({ length: totalPageCount }, (_, i) => i + 1)
  }

  const pages = new Set([1, totalPageCount, cur, cur - 1, cur + 1].filter((p) => p >= 1 && p <= totalPageCount))
  const sorted = [...pages].sort((a, b) => a - b)
  const result = []

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push('...')
    }
    result.push(sorted[i])
  }

  return result
})

async function fetchList() {
  loading.value = true
  try {
    const res = await articleApi.list({ page: page.value, size })
    if (res.code === 200) {
      list.value = res.data.list
      total.value = res.data.total
    }
  } finally {
    loading.value = false
  }
}

async function change(next) {
  page.value = Math.min(totalPages.value, Math.max(1, next))
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

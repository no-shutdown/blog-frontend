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
        <p class="stat-label">{{ item.label }}</p>
        <p class="stat-value">{{ item.value ?? '-' }}</p>
      </div>
    </div>

    <div v-if="monthlyData.length" class="chart card">
      <p class="chart-title">近期发文</p>
      <div class="chart-list">
        <div v-for="m in monthlyData" :key="`${m.year}-${m.month}`" class="chart-row">
          <span class="chart-month">{{ m.year }}/{{ String(m.month).padStart(2, '0') }}</span>
          <div class="chart-bar-wrap">
            <div class="chart-bar" :style="{ width: `${barPct(m.count)}%` }"></div>
          </div>
          <span class="chart-count">{{ m.count }} 篇</span>
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
    { label: '文章总数', value: stats.value.articleCount, color: '#0f6bff' },
    { label: '已发布', value: stats.value.publishedCount, color: '#20b26c' },
    { label: '草稿', value: stats.value.draftCount, color: '#f59e0b' },
    { label: '评论总数', value: stats.value.commentCount, color: '#8b5cf6' },
    { label: '待审核评论', value: stats.value.pendingCommentCount, color: '#ef4444' },
    { label: '总浏览量', value: stats.value.totalViewCount, color: '#0ea5e9' }
  ]
})

const monthlyData = computed(() => archiveGroups.value.slice(0, 12))
const maxCount = computed(() => Math.max(...monthlyData.value.map((m) => m.count), 1))
const barPct = (count) => Math.max(4, Math.round((count / maxCount.value) * 100))

onMounted(async () => {
  const [sRes, aRes] = await Promise.all([adminApi.dashboard(), articleApi.archive()])
  if (sRes.code === 200) stats.value = sRes.data
  if (aRes.code === 200) archiveGroups.value = aRes.data
})
</script>

<style scoped>
.page-title {
  margin: 0 0 18px;
  font-size: 22px;
}

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

.stat-label {
  margin: 0 0 4px;
  color: var(--text-muted);
  font-size: 12px;
}

.stat-value {
  margin: 0;
  font-size: clamp(26px, 3vw, 36px);
  font-weight: 700;
  color: var(--accent);
}

.chart {
  padding: 18px 20px;
}

.chart-title {
  margin: 0 0 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
}

.chart-list {
  display: grid;
  gap: 8px;
}

.chart-row {
  display: grid;
  grid-template-columns: 64px 1fr 48px;
  align-items: center;
  gap: 10px;
}

.chart-month {
  font-size: 12px;
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
}

.chart-bar-wrap {
  height: 8px;
  background: var(--skeleton-bg);
  border-radius: 999px;
  overflow: hidden;
}

.chart-bar {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #2f8bff);
  border-radius: 999px;
  transition: width 0.5s ease;
}

.chart-count {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: right;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 980px) {
  .stat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stat-grid {
    grid-template-columns: 1fr;
  }
}
</style>

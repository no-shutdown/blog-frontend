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
        <p class="stat-value">{{ item.value ?? '-' }}</p>
      </div>
    </div>

    <div v-if="monthlyData.length" class="chart card">
      <p class="chart-title">近期月度发文</p>
      <div class="bars">
        <div v-for="m in monthlyData" :key="`${m.year}-${m.month}`" class="bar-col">
          <div class="bar" :style="{ height: `${barHeight(m.count)}%` }" :title="`${m.count} 篇`"></div>
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
    { label: '文章总数', value: stats.value.articleCount, icon: '📝', color: '#0f6bff' },
    { label: '已发布', value: stats.value.publishedCount, icon: '✅', color: '#20b26c' },
    { label: '草稿', value: stats.value.draftCount, icon: '📄', color: '#f59e0b' },
    { label: '评论总数', value: stats.value.commentCount, icon: '💬', color: '#8b5cf6' },
    { label: '待审核评论', value: stats.value.pendingCommentCount, icon: '⏳', color: '#ef4444' },
    { label: '总浏览量', value: stats.value.totalViewCount, icon: '👀', color: '#0ea5e9' }
  ]
})

const monthlyData = computed(() => archiveGroups.value.slice(0, 12))
const maxCount = computed(() => Math.max(...monthlyData.value.map((m) => m.count), 1))
const barHeight = (count) => Math.max(8, Math.round((count / maxCount.value) * 100))

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

.stat-icon {
  font-size: 22px;
  display: block;
  margin-bottom: 8px;
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

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

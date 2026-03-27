<template>
  <div>
    <h3>评论 ({{ comments.length }})</h3>
    <div v-for="item in rootComments" :key="item.id" class="item">
      <div class="head">{{ item.nickname }} · {{ fmt(item.createdAt) }}</div>
      <div class="body">{{ item.content }}</div>
      <div v-for="reply in replies(item.id)" :key="reply.id" class="reply">
        <b>{{ reply.nickname }}:</b> {{ reply.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ comments: { type: Array, default: () => [] } })
const rootComments = computed(() => props.comments.filter((c) => !c.parentId))
const replies = (id) => props.comments.filter((c) => c.parentId === id)
const fmt = (v) => (v ? new Date(v).toLocaleString('zh-CN') : '-')
</script>

<style scoped>
.item { border-top: 1px solid #eee; padding: 10px 0; }
.head { color: #666; font-size: 13px; }
.body { margin-top: 6px; white-space: pre-wrap; }
.reply { margin-top: 6px; padding: 6px 8px; background: #f7f7f7; border-radius: 6px; }
</style>

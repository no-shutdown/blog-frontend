<template>
  <div class="card">
    <h2>编辑关于我页面</h2>
    <form @submit.prevent="save">
      <input v-model="form.title" placeholder="标题" required />
      <ArticleEditor v-model="form.content" v-model:contentType="form.contentType" />
      <button type="submit">保存</button>
    </form>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { pageApi } from '@/api/page'
import ArticleEditor from '@/components/admin/ArticleEditor.vue'

const form = reactive({ title: '', content: '', contentType: 'markdown' })

onMounted(async () => {
  const res = await pageApi.adminGet('about')
  if (res.code === 200) {
    form.title = res.data.title
    form.content = res.data.content || ''
    form.contentType = res.data.contentType || 'markdown'
  }
})

async function save() {
  await pageApi.update('about', { ...form })
  alert('保存成功')
}
</script>

<style scoped>
.card { background: #fff; padding: 16px; border-radius: 10px; }
input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 8px; }
button { margin-top: 8px; padding: 8px 14px; border: 0; border-radius: 6px; background: #1677ff; color: #fff; }
</style>

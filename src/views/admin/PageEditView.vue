<template>
  <form class="page-edit" @submit.prevent="save">
    <div class="section card">
      <h3 class="section-title">基本信息</h3>
      <div class="field">
        <label>标题</label>
        <input v-model="form.title" required placeholder="请输入页面标题" />
      </div>
    </div>

    <div class="section card">
      <h3 class="section-title">页面内容</h3>
      <ArticleEditor v-model="form.content" v-model:contentType="form.contentType" />
    </div>

    <div class="section card">
      <h3 class="section-title">发布</h3>
      <div class="actions">
        <button type="submit">保存</button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { pageApi } from '@/api/page'
import ArticleEditor from '@/components/admin/ArticleEditor.vue'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
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
  ui.notify('保存成功', 'success')
}
</script>

<style scoped>
.page-edit {
  display: grid;
  gap: 14px;
}

.section {
  padding: 18px 20px;
  margin-bottom: 0;
}

.section-title {
  margin: 0 0 14px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 12px;
}

.field {
  margin-bottom: 0;
}

.field label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

.actions {
  display: flex;
  justify-content: flex-start;
}
</style>

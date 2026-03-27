<template>
  <div class="card">
    <h2>{{ isEdit ? '编辑文章' : '新建文章' }}</h2>
    <form @submit.prevent="submit">
      <input v-model="form.title" required placeholder="标题" />
      <textarea v-model="form.summary" maxlength="500" placeholder="摘要" />
      <input v-model="form.coverImage" placeholder="封面 URL" />

      <div class="row">
        <select v-model="form.status">
          <option value="draft">draft</option>
          <option value="published">published</option>
        </select>
        <select v-model.number="form.categoryId">
          <option :value="null">无分类</option>
          <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </div>

      <div class="tags">
        <label v-for="t in tags" :key="t.id"><input type="checkbox" :value="t.id" v-model="form.tagIds" />{{ t.name }}</label>
      </div>

      <ArticleEditor v-model="form.content" v-model:contentType="form.contentType" />

      <button type="submit">保存</button>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { articleApi } from '@/api/article'
import { categoryApi } from '@/api/category'
import { tagApi } from '@/api/tag'
import ArticleEditor from '@/components/admin/ArticleEditor.vue'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const categories = ref([])
const tags = ref([])

const form = reactive({
  title: '',
  content: '',
  contentType: 'markdown',
  summary: '',
  coverImage: '',
  status: 'draft',
  categoryId: null,
  tagIds: []
})

async function loadMeta() {
  const [cRes, tRes] = await Promise.all([categoryApi.adminList(), tagApi.adminList()])
  if (cRes.code === 200) categories.value = cRes.data
  if (tRes.code === 200) tags.value = tRes.data
}

async function loadDetail() {
  if (!isEdit.value) return
  const res = await articleApi.adminDetail(route.params.id)
  if (res.code === 200) {
    Object.assign(form, {
      title: res.data.title,
      content: res.data.content,
      contentType: res.data.contentType,
      summary: res.data.summary || '',
      coverImage: res.data.coverImage || '',
      status: res.data.status,
      categoryId: res.data.category?.id ?? null,
      tagIds: (res.data.tags || []).map((t) => t.id)
    })
  }
}

async function submit() {
  const payload = { ...form }
  if (isEdit.value) {
    await articleApi.update(route.params.id, payload)
  } else {
    await articleApi.create(payload)
  }
  router.push('/admin/articles')
}

onMounted(async () => {
  await loadMeta()
  await loadDetail()
})
</script>

<style scoped>
.card { background: #fff; padding: 16px; border-radius: 10px; }
input, textarea, select { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 8px; }
textarea { min-height: 80px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.tags { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 8px; }
button { padding: 8px 14px; border: 0; border-radius: 6px; background: #1677ff; color: #fff; cursor: pointer; margin-top: 8px; }
</style>

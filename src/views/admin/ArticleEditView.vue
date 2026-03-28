<template>
  <form class="article-edit" @submit.prevent="submit">
    <div class="section card">
      <h3 class="section-title">基本信息</h3>

      <div class="field">
        <label>标题</label>
        <input v-model="form.title" required placeholder="请输入文章标题" />
      </div>

      <div class="field">
        <label>摘要</label>
        <textarea v-model="form.summary" maxlength="500" placeholder="请输入摘要" />
      </div>

      <div class="field">
        <label>封面 URL</label>
        <input v-model="form.coverImage" placeholder="https://..." />
      </div>

      <div class="row">
        <div class="field">
          <label>分类</label>
          <select v-model.number="form.categoryId">
            <option :value="null">无分类</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label>标签</label>
        <div class="tags">
          <label v-for="t in tags" :key="t.id" class="tag-item">
            <input v-model="form.tagIds" type="checkbox" :value="t.id" />{{ t.name }}
          </label>
        </div>
      </div>
    </div>

    <div class="section card">
      <h3 class="section-title">文章内容</h3>
      <ArticleEditor v-model="form.content" v-model:contentType="form.contentType" />
    </div>

    <div class="section card">
      <h3 class="section-title">发布设置</h3>
      <div class="row">
        <div class="field">
          <label>状态</label>
          <select v-model="form.status">
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>
      </div>

      <div class="actions">
        <button type="submit">保存</button>
      </div>
    </div>
  </form>
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
.article-edit {
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
  margin-bottom: 12px;
}

.field label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

textarea {
  min-height: 80px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.actions {
  display: flex;
  justify-content: flex-start;
}

@media (max-width: 720px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>

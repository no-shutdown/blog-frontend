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
        <label>封面图片</label>
        <div class="upload-row">
          <input v-model="form.coverImage" placeholder="粘贴图片 URL，或点击右侧上传" />
          <label class="upload-btn">
            {{ coverUploading ? '上传中...' : '上传图片' }}
            <input type="file" accept="image/*" :disabled="coverUploading" @change="uploadCover" />
          </label>
        </div>
        <img v-if="form.coverImage" :src="form.coverImage" class="cover-preview" alt="封面预览" />
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
          <label
            v-for="t in tags"
            :key="t.id"
            class="tag-item"
            :class="{ selected: form.tagIds.includes(t.id) }"
          >
            <input v-model="form.tagIds" type="checkbox" :value="t.id" />
            {{ t.name }}
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
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
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
import { adminApi } from '@/api/admin'
import { useUiStore } from '@/stores/ui'
import ArticleEditor from '@/components/admin/ArticleEditor.vue'

const ui = useUiStore()

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.id)
const categories = ref([])
const tags = ref([])
const coverUploading = ref(false)

async function uploadCover(e) {
  const file = e.target.files?.[0]
  if (!file) return
  coverUploading.value = true
  try {
    const res = await adminApi.uploadImage(file)
    if (res.code === 200) {
      form.coverImage = res.data.url
    } else {
      ui.notify('上传失败', 'error')
    }
  } catch {
    ui.notify('上传失败', 'error')
  } finally {
    coverUploading.value = false
    e.target.value = ''
  }
}

const form = reactive({
  title: '',
  content: '',
  contentType: 'html',
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

.field > label {
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
  gap: 8px;
  flex-wrap: wrap;
}

.tag-item {
  display: inline-flex;
  align-items: center;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
  user-select: none;
}

.tag-item:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.tag-item.selected {
  background: var(--primary-soft);
  border-color: var(--primary);
  color: var(--primary);
  font-weight: 600;
}

.tag-item input {
  display: none;
}

.upload-row {
  display: flex;
  gap: 8px;
}

.upload-row input:not([type='file']) {
  flex: 1;
}

.upload-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 0 14px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(135deg, var(--primary), #2f8bff);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.upload-btn input[type='file'] {
  display: none;
}

.cover-preview {
  margin-top: 8px;
  max-height: 140px;
  max-width: 100%;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid var(--line);
  display: block;
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

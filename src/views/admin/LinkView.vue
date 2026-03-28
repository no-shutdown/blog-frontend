<template>
  <div class="link-page">
    <section class="card editor-card">
      <div class="editor-head">
        <h2>友链管理</h2>
        <p>维护站点名称、地址、头像、可见状态和排序。</p>
      </div>

      <form class="editor-grid" @submit.prevent="save">
        <div class="field">
          <label>站点名称</label>
          <input v-model.trim="form.name" required placeholder="例如：Vue.js" />
        </div>

        <div class="field">
          <label>站点地址</label>
          <input v-model.trim="form.url" required placeholder="https://example.com" />
        </div>

        <div class="field field-wide">
          <label>头像地址</label>
          <div class="avatar-row">
            <input v-model.trim="form.avatar" placeholder="可手填 URL，或使用右侧本地上传" />
            <label class="upload-btn" :class="{ disabled: uploadingAvatar }">
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                :disabled="uploadingAvatar"
                @change="onAvatarFileChange"
              />
              {{ uploadingAvatar ? '上传中...' : '本地上传' }}
            </label>
          </div>
          <p class="hint">支持 jpg/jpeg/png/gif/webp，最大 5MB。</p>
        </div>

        <div class="field">
          <label>排序值</label>
          <input v-model.number="form.sortOrder" type="number" min="0" placeholder="0" />
        </div>

        <div class="field">
          <label>状态</label>
          <select v-model="form.status">
            <option value="visible">显示</option>
            <option value="hidden">隐藏</option>
          </select>
        </div>

        <div class="field field-wide">
          <label>描述</label>
          <input v-model.trim="form.description" placeholder="一句话介绍该站点" />
        </div>

        <div class="form-actions">
          <button type="submit">{{ editingId ? '更新友链' : '新增友链' }}</button>
          <button v-if="editingId" type="button" class="btn-ghost" @click="reset">取消编辑</button>
        </div>
      </form>

      <div class="preview card">
        <p class="preview-title">预览</p>
        <div class="preview-item">
          <img v-if="form.avatar" :src="form.avatar" alt="avatar" @error="onPreviewImgError" />
          <div v-else class="avatar-fallback">链</div>
          <div class="meta">
            <h4>{{ form.name || '站点名称' }}</h4>
            <p>{{ form.description || '这里会显示站点描述' }}</p>
            <a :href="safePreviewUrl" target="_blank" rel="noreferrer">{{ form.url || 'https://example.com' }}</a>
          </div>
          <span class="status" :class="form.status">{{ form.status === 'visible' ? '显示' : '隐藏' }}</span>
        </div>
      </div>
    </section>

    <section class="card list-card">
      <div class="toolbar">
        <input v-model.trim="keyword" placeholder="搜索名称或地址" class="search" />
        <select v-model="statusFilter" class="filter">
          <option value="all">全部状态</option>
          <option value="visible">仅显示</option>
          <option value="hidden">仅隐藏</option>
        </select>
      </div>

      <div v-if="!filteredList.length" class="empty-state">暂无数据</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>排序</th>
              <th>状态</th>
              <th>站点</th>
              <th>地址</th>
              <th>描述</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredList" :key="item.id">
              <td>#{{ item.sortOrder ?? 0 }}</td>
              <td>
                <span class="status" :class="item.status">{{ item.status === 'visible' ? '显示' : '隐藏' }}</span>
              </td>
              <td class="site-cell">
                <img v-if="item.avatar" :src="item.avatar" alt="avatar" @error="onTableImgError" />
                <span v-else class="avatar-fallback small">链</span>
                <span class="site-name">{{ item.name }}</span>
              </td>
              <td class="url-cell">
                <a :href="item.url" target="_blank" rel="noreferrer">{{ item.url }}</a>
              </td>
              <td class="desc-cell">{{ item.description || '-' }}</td>
              <td class="actions">
                <button class="btn-mini" @click="edit(item)">编辑</button>
                <button class="btn-mini btn-danger" @click="remove(item.id)">删除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { linkApi } from '@/api/link'
import { adminApi } from '@/api/admin'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const list = ref([])
const editingId = ref(null)
const keyword = ref('')
const statusFilter = ref('all')
const uploadingAvatar = ref(false)
const AVATAR_MAX_SIZE = 5 * 1024 * 1024
const AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']

const form = reactive({
  name: '',
  url: '',
  avatar: '',
  description: '',
  status: 'visible',
  sortOrder: 0
})

const filteredList = computed(() => {
  const key = keyword.value.toLowerCase()
  return [...list.value]
    .filter((item) => {
      const hitKeyword = !key || item.name?.toLowerCase().includes(key) || item.url?.toLowerCase().includes(key)
      const hitStatus = statusFilter.value === 'all' || item.status === statusFilter.value
      return hitKeyword && hitStatus
    })
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
})

const safePreviewUrl = computed(() => {
  const raw = form.url?.trim()
  if (!raw) return 'https://example.com'
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
})

async function load() {
  const res = await linkApi.adminList()
  if (res.code === 200) list.value = res.data || []
}

function edit(item) {
  editingId.value = item.id
  Object.assign(form, {
    name: item.name || '',
    url: item.url || '',
    avatar: item.avatar || '',
    description: item.description || '',
    status: item.status || 'visible',
    sortOrder: Number(item.sortOrder || 0)
  })
}

function reset() {
  editingId.value = null
  Object.assign(form, {
    name: '',
    url: '',
    avatar: '',
    description: '',
    status: 'visible',
    sortOrder: 0
  })
}

async function save() {
  const payload = {
    ...form,
    sortOrder: Number(form.sortOrder || 0)
  }

  if (editingId.value) {
    await linkApi.update(editingId.value, payload)
    ui.notify('友链已更新', 'success')
  } else {
    await linkApi.create(payload)
    ui.notify('友链已新增', 'success')
  }

  reset()
  await load()
}

async function remove(id) {
  const ok = await ui.askConfirm({
    title: '删除友链',
    message: '删除后无法恢复，确定继续吗？',
    confirmText: '删除'
  })
  if (!ok) return

  await linkApi.delete(id)
  ui.notify('友链已删除', 'success')
  if (editingId.value === id) reset()
  await load()
}

async function onAvatarFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  if (!AVATAR_TYPES.includes(file.type)) {
    ui.notify('仅支持 jpg/jpeg/png/gif/webp 图片', 'error')
    event.target.value = ''
    return
  }

  if (file.size > AVATAR_MAX_SIZE) {
    ui.notify('图片大小不能超过 5MB', 'error')
    event.target.value = ''
    return
  }

  uploadingAvatar.value = true
  try {
    const res = await adminApi.uploadImage(file)
    if (res.code !== 200) throw new Error(res.msg || res.message || '上传失败')
    form.avatar = res.data?.url || ''
    ui.notify('头像上传成功', 'success')
  } catch (error) {
    ui.notify(error.message || '头像上传失败', 'error')
  } finally {
    uploadingAvatar.value = false
    event.target.value = ''
  }
}

function onPreviewImgError(event) {
  event.target.style.display = 'none'
}

function onTableImgError(event) {
  event.target.style.display = 'none'
}

onMounted(load)
</script>

<style scoped>
.link-page {
  display: grid;
  gap: 14px;
}

.editor-card {
  padding: 16px;
  display: grid;
  gap: 12px;
}

.editor-head h2 {
  margin: 0;
}

.editor-head p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}

.editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.field {
  display: grid;
  gap: 6px;
}

.field label {
  font-size: 12px;
  color: #64748b;
}

.field-wide {
  grid-column: 1 / -1;
}

.avatar-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border-radius: 11px;
  border: 1px solid #bfd2ef;
  background: linear-gradient(180deg, #f9fbff, #eaf2ff);
  color: #0b1220;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  box-shadow: 0 4px 10px rgba(8, 30, 72, 0.12);
}

.upload-btn input {
  display: none;
}

.upload-btn.disabled {
  color: #6b7a93;
  background: linear-gradient(180deg, #f3f6fb, #e9eef7);
  border-color: #d2dbe8;
  box-shadow: none;
  cursor: not-allowed;
}

.hint {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-ghost {
  background: #e6edf9;
  color: #1f2937;
  box-shadow: none;
}

.preview {
  padding: 12px;
}

.preview-title {
  margin: 0 0 8px;
  font-size: 12px;
  color: #64748b;
}

.preview-item {
  display: flex;
  gap: 10px;
  align-items: center;
}

.preview-item img,
.avatar-fallback {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  object-fit: cover;
  flex-shrink: 0;
}

.avatar-fallback {
  display: grid;
  place-items: center;
  background: #e8efff;
  color: #0f6bff;
  font-weight: 700;
}

.avatar-fallback.small {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  font-size: 11px;
}

.meta {
  min-width: 0;
  flex: 1;
}

.meta h4 {
  margin: 0;
  font-size: 14px;
}

.meta p {
  margin: 3px 0;
  color: #64748b;
  font-size: 12px;
}

.meta a {
  color: #0f6bff;
  font-size: 12px;
  text-decoration: none;
}

.status {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
}

.status.visible {
  color: #166534;
  background: #dcfce7;
}

.status.hidden {
  color: #92400e;
  background: #ffedd5;
}

.list-card {
  padding: 14px;
}

.toolbar {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.search {
  flex: 1;
}

.filter {
  width: 160px;
}

.table-wrap {
  overflow-x: auto;
}

.site-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.site-cell img {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.site-name {
  font-weight: 600;
}

.url-cell a {
  color: #0f6bff;
  text-decoration: none;
}

.desc-cell {
  color: #475569;
}

.actions {
  display: flex;
  gap: 6px;
}

.btn-mini {
  padding: 5px 10px;
  font-size: 12px;
}

.btn-danger {
  background: linear-gradient(135deg, #e24f4f, #ef6b6b);
  box-shadow: 0 6px 14px rgba(226, 79, 79, 0.22);
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 14px;
}

@media (max-width: 980px) {
  .editor-grid {
    grid-template-columns: 1fr;
  }

  .field-wide,
  .form-actions {
    grid-column: auto;
  }

  .avatar-row {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
  }

  .filter {
    width: 100%;
  }
}
</style>

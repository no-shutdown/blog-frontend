<template>
  <div class="tag-page">
    <section class="card editor-card">
      <div class="editor-head">
        <h2>标签管理</h2>
        <p>维护标签名称与颜色，可快速选择预设色并实时预览。</p>
      </div>

      <form class="editor-grid" @submit.prevent="save">
        <div class="field">
          <label>标签名称</label>
          <input v-model.trim="form.name" required placeholder="例如：前端" />
        </div>

        <div class="field">
          <label>颜色代码</label>
          <div class="code-row">
            <input v-model.trim="form.color" required placeholder="#0f6bff" />
            <span class="color-preview" :style="{ background: safeColor }" :title="safeColor"></span>
          </div>
        </div>

        <div class="field field-wide">
          <label>推荐色卡</label>
          <div class="palette">
            <button
              v-for="color in presetColors"
              :key="color"
              type="button"
              class="palette-item"
              :class="{ active: safeColor.toLowerCase() === color.toLowerCase() }"
              :style="{ background: color, color: getContrastText(color) }"
              :title="color"
              @click="form.color = color"
            >
              <span v-if="safeColor.toLowerCase() === color.toLowerCase()">✓</span>
            </button>
          </div>
        </div>

        <div class="field field-wide advanced">
          <label>高级取色器</label>
          <div class="picker-row">
            <input v-model="form.color" type="color" class="color-picker" />
            <span class="hint">拖动选择后会同步到颜色代码。</span>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit">{{ editingId ? '更新标签' : '新增标签' }}</button>
          <button v-if="editingId" type="button" class="btn-ghost" @click="reset">取消编辑</button>
        </div>
      </form>

      <div class="preview card">
        <p class="preview-title">预览</p>
        <div class="preview-chip" :style="{ background: `${safeColor}1a`, borderColor: `${safeColor}66`, color: safeColor }">
          #{{ form.name || '标签名' }}
        </div>
      </div>
    </section>

    <section class="card list-card">
      <div class="toolbar">
        <input v-model.trim="keyword" class="search" placeholder="搜索标签名称" />
      </div>

      <div v-if="!filteredList.length" class="empty-state">暂无数据</div>
      <div v-else class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>标签</th>
              <th>颜色</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredList" :key="item.id">
              <td>#{{ item.id }}</td>
              <td>
                <span
                  class="tag-chip"
                  :style="{ background: `${item.color || '#0f6bff'}1a`, borderColor: `${item.color || '#0f6bff'}66`, color: item.color || '#0f6bff' }"
                >
                  #{{ item.name }}
                </span>
              </td>
              <td>
                <div class="color-cell">
                  <span class="dot" :style="{ background: item.color || '#0f6bff' }"></span>
                  <code>{{ item.color || '#0f6bff' }}</code>
                </div>
              </td>
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
import { tagApi } from '@/api/tag'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const list = ref([])
const editingId = ref(null)
const keyword = ref('')

const form = reactive({
  name: '',
  color: '#0f6bff'
})

const presetColors = [
  '#0f6bff', '#2f8bff', '#20b26c', '#ff6a3d', '#e24f4f', '#8b5cf6', '#14b8a6', '#f59e0b', '#64748b', '#111827'
]

const safeColor = computed(() => {
  const value = (form.color || '').trim()
  return /^#([0-9a-fA-F]{3}){1,2}$/.test(value) ? value : '#0f6bff'
})

const filteredList = computed(() => {
  const key = keyword.value.toLowerCase()
  return list.value
    .filter((item) => !key || item.name?.toLowerCase().includes(key))
    .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'))
})

function getContrastText(hex) {
  const value = (hex || '').replace('#', '').trim()
  if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value)) return '#ffffff'

  const full = value.length === 3 ? value.split('').map((c) => c + c).join('') : value
  const r = parseInt(full.slice(0, 2), 16)
  const g = parseInt(full.slice(2, 4), 16)
  const b = parseInt(full.slice(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.62 ? '#0b1220' : '#ffffff'
}

async function load() {
  const res = await tagApi.adminList()
  if (res.code === 200) list.value = res.data || []
}

function edit(item) {
  editingId.value = item.id
  form.name = item.name || ''
  form.color = item.color || '#0f6bff'
}

function reset() {
  editingId.value = null
  form.name = ''
  form.color = '#0f6bff'
}

async function save() {
  const payload = { name: form.name, color: safeColor.value }

  if (editingId.value) {
    await tagApi.update(editingId.value, payload)
    ui.notify('标签已更新', 'success')
  } else {
    await tagApi.create(payload)
    ui.notify('标签已新增', 'success')
  }

  reset()
  await load()
}

async function remove(id) {
  const ok = await ui.askConfirm({
    title: '删除标签',
    message: '删除后无法恢复，确定继续吗？',
    confirmText: '删除'
  })
  if (!ok) return

  await tagApi.delete(id)
  ui.notify('标签已删除', 'success')
  if (editingId.value === id) reset()
  await load()
}

onMounted(load)
</script>

<style scoped>
.tag-page {
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

.code-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.color-preview {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  flex-shrink: 0;
}

.palette {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.palette-item {
  width: 30px;
  height: 30px;
  border-radius: 9px;
  border: 2px solid rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.18);
  padding: 0;
  display: grid;
  place-items: center;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.palette-item.active {
  box-shadow: 0 0 0 2px rgba(15, 107, 255, 0.4);
}

.advanced {
  padding: 10px;
  border-radius: 10px;
  background: #f8fbff;
  border: 1px dashed rgba(15, 23, 42, 0.12);
}

.picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker {
  width: 120px;
  min-height: 36px;
  padding: 0;
  border-radius: 8px;
}

.hint {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

.form-actions {
  grid-column: 1 / -1;
  display: flex;
  gap: 8px;
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

.preview-chip,
.tag-chip {
  display: inline-flex;
  align-items: center;
  border: 1px solid;
  border-radius: 999px;
  padding: 5px 11px;
  font-weight: 700;
  font-size: 13px;
}

.list-card {
  padding: 14px;
}

.toolbar {
  margin-bottom: 10px;
}

.search {
  width: min(340px, 100%);
}

.table-wrap {
  overflow-x: auto;
}

.color-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.08);
}

code {
  background: #eef3ff;
  border-radius: 8px;
  padding: 2px 7px;
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

  .picker-row {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>

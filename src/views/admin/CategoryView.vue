<template>
  <div class="card">
    <h2>分类管理</h2>
    <form class="row" @submit.prevent="save">
      <input v-model="form.name" required placeholder="分类名" />
      <input v-model="form.description" placeholder="描述" />
      <button type="submit">{{ editingId ? '更新' : '新增' }}</button>
      <button v-if="editingId" type="button" @click="reset">取消</button>
    </form>

    <div v-if="!list.length" class="empty-state">暂无数据</div>
    <ul v-else>
      <li v-for="c in list" :key="c.id">
        <span>{{ c.name }} - {{ c.description }}</span>
        <div class="actions">
          <button @click="edit(c)">编辑</button>
          <button @click="remove(c.id)">删除</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { categoryApi } from '@/api/category'
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
const list = ref([])
const editingId = ref(null)
const form = reactive({ name: '', description: '' })

async function load() {
  const res = await categoryApi.adminList()
  if (res.code === 200) list.value = res.data
}

function edit(c) {
  editingId.value = c.id
  form.name = c.name
  form.description = c.description || ''
}

function reset() {
  editingId.value = null
  form.name = ''
  form.description = ''
}

async function save() {
  const payload = { ...form }
  if (editingId.value) {
    await categoryApi.update(editingId.value, payload)
    ui.notify('分类已更新', 'success')
  } else {
    await categoryApi.create(payload)
    ui.notify('分类已新增', 'success')
  }
  reset()
  await load()
}

async function remove(id) {
  const ok = await ui.askConfirm({
    title: '删除分类',
    message: '确定删除该分类吗？',
    confirmText: '删除'
  })
  if (!ok) return

  await categoryApi.delete(id)
  ui.notify('分类已删除', 'success')
  await load()
}

onMounted(load)
</script>

<style scoped>
.card {
  background: #fff;
  padding: 16px;
  border-radius: 10px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr auto auto;
  gap: 8px;
  margin-bottom: 10px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  border-top: 1px solid #eee;
  padding: 8px 0;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: var(--text-muted);
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 6px;
}
</style>

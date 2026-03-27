<template>
  <div class="card">
    <h2>友链管理</h2>
    <form class="grid" @submit.prevent="save">
      <input v-model="form.name" required placeholder="名称" />
      <input v-model="form.url" required placeholder="URL" />
      <input v-model="form.avatar" placeholder="头像URL" />
      <input v-model="form.description" placeholder="描述" />
      <select v-model="form.status">
        <option value="visible">visible</option>
        <option value="hidden">hidden</option>
      </select>
      <input v-model.number="form.sortOrder" type="number" placeholder="排序" />
      <button type="submit">{{ editingId ? '更新' : '新增' }}</button>
      <button v-if="editingId" type="button" @click="reset">取消</button>
    </form>
    <ul>
      <li v-for="l in list" :key="l.id">
        <span>{{ l.name }} ({{ l.status }})</span>
        <div>
          <button @click="edit(l)">编辑</button>
          <button @click="remove(l.id)">删除</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { linkApi } from '@/api/link'

const list = ref([])
const editingId = ref(null)
const form = reactive({
  name: '',
  url: '',
  avatar: '',
  description: '',
  status: 'visible',
  sortOrder: 0
})

async function load() {
  const res = await linkApi.adminList()
  if (res.code === 200) list.value = res.data
}

function edit(item) {
  editingId.value = item.id
  Object.assign(form, item)
}

function reset() {
  editingId.value = null
  Object.assign(form, { name: '', url: '', avatar: '', description: '', status: 'visible', sortOrder: 0 })
}

async function save() {
  const payload = { ...form }
  if (editingId.value) await linkApi.update(editingId.value, payload)
  else await linkApi.create(payload)
  reset()
  await load()
}

async function remove(id) {
  if (!confirm('确定删除?')) return
  await linkApi.delete(id)
  await load()
}

onMounted(load)
</script>

<style scoped>
.card { background: #fff; padding: 16px; border-radius: 10px; }
.grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; margin-bottom: 10px; }
input, select { padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; justify-content: space-between; border-top: 1px solid #eee; padding: 8px 0; }
</style>

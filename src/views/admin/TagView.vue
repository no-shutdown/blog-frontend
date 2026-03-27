<template>
  <div class="card">
    <h2>标签管理</h2>
    <form class="row" @submit.prevent="save">
      <input v-model="form.name" required placeholder="标签名" />
      <input v-model="form.color" required placeholder="#1677ff" />
      <button type="submit">{{ editingId ? '更新' : '新增' }}</button>
      <button v-if="editingId" type="button" @click="reset">取消</button>
    </form>
    <ul>
      <li v-for="t in list" :key="t.id">
        <span :style="{ color: t.color }">{{ t.name }}</span>
        <div>
          <button @click="edit(t)">编辑</button>
          <button @click="remove(t.id)">删除</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { tagApi } from '@/api/tag'

const list = ref([])
const editingId = ref(null)
const form = reactive({ name: '', color: '#1677ff' })

async function load() {
  const res = await tagApi.adminList()
  if (res.code === 200) list.value = res.data
}

function edit(t) {
  editingId.value = t.id
  form.name = t.name
  form.color = t.color
}

function reset() {
  editingId.value = null
  form.name = ''
  form.color = '#1677ff'
}

async function save() {
  const payload = { ...form }
  if (editingId.value) await tagApi.update(editingId.value, payload)
  else await tagApi.create(payload)
  reset()
  await load()
}

async function remove(id) {
  if (!confirm('确定删除?')) return
  await tagApi.delete(id)
  await load()
}

onMounted(load)
</script>

<style scoped>
.card { background: #fff; padding: 16px; border-radius: 10px; }
.row { display: grid; grid-template-columns: 1fr 1fr auto auto; gap: 8px; margin-bottom: 10px; }
input { padding: 8px; border: 1px solid #ddd; border-radius: 6px; }
ul { list-style: none; margin: 0; padding: 0; }
li { display: flex; justify-content: space-between; border-top: 1px solid #eee; padding: 8px 0; }
</style>

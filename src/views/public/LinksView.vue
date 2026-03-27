<template>
  <div class="grid">
    <a v-for="l in links" :key="l.id" :href="l.url" target="_blank" class="card" rel="noreferrer">
      <img v-if="l.avatar" :src="l.avatar" class="avatar" />
      <h3>{{ l.name }}</h3>
      <p>{{ l.description }}</p>
    </a>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { linkApi } from '@/api/link'

const links = ref([])

onMounted(async () => {
  const res = await linkApi.list()
  if (res.code === 200) links.value = res.data
})
</script>

<style scoped>
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.card { background: #fff; color: inherit; text-decoration: none; padding: 14px; border-radius: 10px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; object-fit: cover; }
</style>

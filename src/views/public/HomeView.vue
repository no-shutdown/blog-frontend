<template>
  <div>
    <ArticleCard v-for="a in list" :key="a.id" :article="a" />
    <div class="pager">
      <button :disabled="page <= 1" @click="change(page - 1)">上一页</button>
      <span>{{ page }} / {{ totalPages }}</span>
      <button :disabled="page >= totalPages" @click="change(page + 1)">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ArticleCard from '@/components/public/ArticleCard.vue'
import { articleApi } from '@/api/article'

const page = ref(1)
const size = 10
const total = ref(0)
const list = ref([])
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / size)))

async function fetchList() {
  const res = await articleApi.list({ page: page.value, size })
  if (res.code === 200) {
    list.value = res.data.list
    total.value = res.data.total
  }
}

async function change(next) {
  page.value = next
  await fetchList()
}

onMounted(fetchList)
</script>

<style scoped>
.pager { display: flex; justify-content: center; gap: 8px; margin-top: 20px; }
</style>

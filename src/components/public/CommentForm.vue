<template>
  <form class="form" @submit.prevent="submit">
    <h3>发表评论</h3>
    <div class="row">
      <input v-model="form.nickname" maxlength="50" required placeholder="昵称" />
      <input v-model="form.email" type="email" placeholder="邮箱(可选)" />
    </div>
    <textarea v-model="form.content" maxlength="1000" required placeholder="评论内容" />
    <button :disabled="loading" type="submit">{{ loading ? '提交中...' : '提交' }}</button>
    <p v-if="message">{{ message }}</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { commentApi } from '@/api/comment'

const props = defineProps({ articleId: { type: Number, required: true }, parentId: { type: Number, default: null } })
const emit = defineEmits(['submitted'])

const form = ref({ nickname: '', email: '', content: '' })
const loading = ref(false)
const message = ref('')

async function submit() {
  loading.value = true
  message.value = ''
  try {
    const res = await commentApi.submit({
      articleId: props.articleId,
      parentId: props.parentId,
      nickname: form.value.nickname,
      email: form.value.email,
      content: form.value.content
    })
    message.value = res.code === 200 ? '评论已提交，等待审核。' : (res.message || '提交失败')
    if (res.code === 200) {
      form.value = { nickname: '', email: '', content: '' }
      emit('submitted')
    }
  } catch {
    message.value = '提交失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form { margin-top: 20px; }
.row { display: flex; gap: 8px; }
input, textarea { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 6px; margin-bottom: 8px; }
textarea { min-height: 100px; resize: vertical; }
button { padding: 8px 14px; border: 0; border-radius: 6px; background: #1677ff; color: #fff; cursor: pointer; }
</style>

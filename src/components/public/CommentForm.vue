<template>
  <div class="form-wrap card">
    <h3 class="form-title">发表评论</h3>
    <form @submit.prevent="submit">
      <div class="row">
        <input v-model="form.nickname" maxlength="50" required placeholder="昵称 *" />
        <input v-model="form.email" type="email" placeholder="邮箱（可选）" />
      </div>
      <textarea v-model="form.content" maxlength="1000" required placeholder="说点什么..." rows="4" />
      <div class="form-footer">
        <p v-if="message" :class="['msg', msgType]">{{ message }}</p>
        <button :disabled="loading" type="submit">
          {{ loading ? '提交中...' : '提交评论' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { commentApi } from '@/api/comment'

const props = defineProps({ articleId: { type: Number, required: true }, parentId: { type: Number, default: null } })
const emit = defineEmits(['submitted'])

const form = ref({ nickname: '', email: '', content: '' })
const loading = ref(false)
const message = ref('')
const msgType = ref('ok')

async function submit() {
  loading.value = true
  message.value = ''
  try {
    const res = await commentApi.submit({
      articleId: props.articleId,
      parentId: props.parentId,
      ...form.value
    })
    if (res.code === 200) {
      message.value = '评论已提交，等待审核。'
      msgType.value = 'ok'
      form.value = { nickname: '', email: '', content: '' }
      emit('submitted')
    } else {
      message.value = res.message || '提交失败，请重试。'
      msgType.value = 'err'
    }
  } catch {
    message.value = '提交失败，请重试。'
    msgType.value = 'err'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-wrap {
  margin-top: 24px;
  padding: 20px 22px;
}

.form-title {
  margin: 0 0 16px;
  font-size: 17px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 10px;
}

textarea {
  min-height: 110px;
  resize: vertical;
  margin-bottom: 12px;
}

.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.msg {
  margin: 0;
  font-size: 13px;
}

.msg.ok {
  color: var(--ok);
}

.msg.err {
  color: var(--danger);
}

@media (max-width: 560px) {
  .row {
    grid-template-columns: 1fr;
  }
}
</style>

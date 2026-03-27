<template>
  <div>
    <div class="tabs">
      <button :class="{ active: modelContentType === 'markdown' }" @click="setType('markdown')">Markdown</button>
      <button :class="{ active: modelContentType === 'html' }" @click="setType('html')">Rich Text</button>
    </div>

    <textarea
      v-if="modelContentType === 'markdown'"
      v-model="modelValue"
      class="markdown-input"
      placeholder="请输入 Markdown 内容"
    />

    <div v-else class="editor-wrap">
      <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" style="border-bottom: 1px solid #e5e7eb" />
      <Editor
        v-model="modelValue"
        :defaultConfig="editorConfig"
        mode="default"
        style="height: 320px; overflow-y: hidden"
        @onCreated="handleCreated"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { adminApi } from '@/api/admin'

const props = defineProps({
  modelValue: { type: String, default: '' },
  contentType: { type: String, default: 'markdown' }
})

const emit = defineEmits(['update:modelValue', 'update:contentType'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const modelContentType = computed({
  get: () => props.contentType,
  set: (v) => emit('update:contentType', v)
})

const editorRef = shallowRef()
const toolbarConfig = {}

const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      async customUpload(file, insertFn) {
        const res = await adminApi.uploadImage(file)
        if (res.code === 200) {
          insertFn(res.data.url)
        }
      }
    }
  }
}

function handleCreated(editor) {
  editorRef.value = editor
}

function setType(type) {
  modelContentType.value = type
}

onBeforeUnmount(() => {
  if (editorRef.value) {
    editorRef.value.destroy()
  }
})
</script>

<style scoped>
.tabs { display: flex; gap: 8px; margin-bottom: 8px; }
.tabs button { padding: 6px 10px; border: 1px solid #d1d5db; border-radius: 6px; background: #fff; cursor: pointer; }
.tabs .active { background: #111827; color: #fff; }
.markdown-input { width: 100%; min-height: 320px; padding: 10px; border: 1px solid #e5e7eb; border-radius: 8px; font-family: Consolas, monospace; }
.editor-wrap { border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; }
</style>

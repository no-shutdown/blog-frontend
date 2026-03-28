<template>
  <div>
    <div class="toolbar-bar">
      <button type="button" class="preview-btn" :class="{ active: showPreview }" @click="showPreview = !showPreview">
        {{ showPreview ? '关闭预览' : '开启预览' }}
      </button>
    </div>

    <div class="split-wrap" :class="{ split: showPreview }" :style="{ '--panel-height': `${panelHeight}px` }">
      <div class="editor-col">
        <Toolbar ref="toolbarRef" :editor="editorRef" :defaultConfig="toolbarConfig" class="we-toolbar" />
        <Editor
          v-model="modelValue"
          :defaultConfig="editorConfig"
          mode="default"
          :style="{ height: editorHeight + 'px', overflowY: 'auto' }"
          @onCreated="handleCreated"
        />
      </div>
      <div
        v-if="showPreview"
        ref="previewRef"
        class="preview-col article-content"
        v-html="modelValue"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { adminApi } from '@/api/admin'
import '@/styles/article-content.css'

const props = defineProps({
  modelValue: { type: String, default: '' },
  contentType: { type: String, default: 'html' }
})

const emit = defineEmits(['update:modelValue', 'update:contentType'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v)
})

const editorRef = shallowRef()
const toolbarRef = ref(null)
const previewRef = ref(null)
const showPreview = ref(true)
const editorHeight = ref(560)
const toolbarHeight = ref(42)
const panelHeight = computed(() => editorHeight.value + toolbarHeight.value)
const toolbarConfig = {}

const editorConfig = {
  placeholder: '请输入内容...',
  MENU_CONF: {
    uploadImage: {
      async customUpload(file, insertFn) {
        const res = await adminApi.uploadImage(file)
        if (res.code === 200) insertFn(res.data.url)
      }
    }
  }
}

let textContainer = null

function updatePanelHeights() {
  editorHeight.value = Math.max(500, window.innerHeight - 280)

  nextTick(() => {
    const toolbarEl = toolbarRef.value?.$el ?? toolbarRef.value
    if (toolbarEl?.offsetHeight) {
      toolbarHeight.value = toolbarEl.offsetHeight
    }
  })
}

function handleCreated(editor) {
  editorRef.value = editor

  nextTick(() => {
    const editable = editor.getEditableContainer()

    if (textContainer) {
      textContainer.removeEventListener('scroll', syncScroll)
    }

    textContainer = editable?.closest?.('.w-e-text-container') ?? editable?.parentElement
    if (textContainer) {
      textContainer.addEventListener('scroll', syncScroll, { passive: true })
    }

    updatePanelHeights()
  })
}

function syncScroll() {
  if (!previewRef.value || !textContainer) return
  const { scrollTop, scrollHeight, clientHeight } = textContainer
  const ratio = scrollTop / Math.max(1, scrollHeight - clientHeight)
  const p = previewRef.value
  p.scrollTop = ratio * Math.max(0, p.scrollHeight - p.clientHeight)
}

onMounted(() => {
  emit('update:contentType', 'html')
  updatePanelHeights()
  window.addEventListener('resize', updatePanelHeights)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updatePanelHeights)
  if (textContainer) textContainer.removeEventListener('scroll', syncScroll)
  if (editorRef.value) editorRef.value.destroy()
})
</script>

<style scoped>
.toolbar-bar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 8px;
}

.preview-btn {
  width: auto;
  padding: 6px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: #fff;
  color: #334155;
  box-shadow: none;
  font-size: 13px;
}

.preview-btn:hover {
  transform: none;
  color: #0f6bff;
  background: #eaf1ff;
  border-color: #b8d0ff;
}

.preview-btn.active {
  color: #fff;
  border-color: transparent;
  background: linear-gradient(135deg, #0f6bff, #2f8bff);
  box-shadow: 0 6px 14px rgba(15, 107, 255, 0.22);
}

.split-wrap {
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.split-wrap.split {
  grid-template-columns: 1fr 1fr;
}

.editor-col {
  min-width: 0;
  display: flex;
  flex-direction: column;
  height: var(--panel-height);
}

.we-toolbar {
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
}

.preview-col {
  padding: 20px 24px;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  background: #fafbff;
  height: var(--panel-height);
}

@media (max-width: 960px) {
  .split-wrap.split {
    grid-template-columns: 1fr;
  }

  .preview-col {
    border-left: none;
    border-top: 1px solid #e5e7eb;
  }
}
</style>

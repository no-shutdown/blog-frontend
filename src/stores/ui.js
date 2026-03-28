import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

const SHOW_DELAY_MS = 120
const TOAST_DURATION_MS = 2200

export const useUiStore = defineStore('ui', () => {
  const pending = ref(0)
  const visible = ref(false)
  let loadingTimer = null

  const isLoading = computed(() => visible.value)

  const toast = reactive({
    visible: false,
    text: '',
    type: 'info'
  })
  let toastTimer = null

  const confirmState = reactive({
    visible: false,
    title: '请确认',
    message: '',
    confirmText: '确认',
    cancelText: '取消'
  })
  let confirmResolver = null

  function startLoading() {
    pending.value += 1

    if (pending.value === 1) {
      if (loadingTimer) {
        clearTimeout(loadingTimer)
      }
      loadingTimer = setTimeout(() => {
        if (pending.value > 0) {
          visible.value = true
        }
      }, SHOW_DELAY_MS)
    }
  }

  function endLoading() {
    pending.value = Math.max(0, pending.value - 1)

    if (pending.value === 0) {
      if (loadingTimer) {
        clearTimeout(loadingTimer)
        loadingTimer = null
      }
      visible.value = false
    }
  }

  function notify(text, type = 'info', duration = TOAST_DURATION_MS) {
    toast.visible = true
    toast.text = text
    toast.type = type

    if (toastTimer) {
      clearTimeout(toastTimer)
    }

    toastTimer = setTimeout(() => {
      toast.visible = false
      toast.text = ''
      toast.type = 'info'
    }, duration)
  }

  function askConfirm(messageOrOptions, options = {}) {
    const payload = typeof messageOrOptions === 'object'
      ? messageOrOptions
      : { ...options, message: messageOrOptions }

    confirmState.title = payload.title || '请确认'
    confirmState.message = payload.message || '确定继续吗？'
    confirmState.confirmText = payload.confirmText || '确认'
    confirmState.cancelText = payload.cancelText || '取消'
    confirmState.visible = true

    return new Promise((resolve) => {
      confirmResolver = resolve
    })
  }

  function resolveConfirm(confirmed) {
    confirmState.visible = false
    if (confirmResolver) {
      confirmResolver(confirmed)
      confirmResolver = null
    }
  }

  return {
    pending,
    isLoading,
    startLoading,
    endLoading,
    toast,
    notify,
    confirmState,
    askConfirm,
    resolveConfirm
  }
})

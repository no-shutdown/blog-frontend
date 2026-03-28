<template>
  <Transition name="fade-up">
    <button v-show="visible" class="scroll-top" @click="scrollToTop" aria-label="Back to top">↑</button>
  </Transition>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const visible = ref(false)

function onScroll() {
  visible.value = window.scrollY > 400
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.scroll-top {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 200;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  padding: 0;
  font-size: 18px;
  background: linear-gradient(135deg, var(--primary), #2f8bff);
  box-shadow: var(--shadow-md);
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 720px) {
  .scroll-top {
    bottom: 16px;
    right: 16px;
  }
}
</style>

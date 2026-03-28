<template>
  <RouterView />

  <div v-show="ui.isLoading" class="top-loading" aria-hidden="true">
    <div class="bar"></div>
  </div>

  <transition name="fade-slide">
    <div v-if="ui.toast.visible" class="toast" :class="`toast--${ui.toast.type}`">
      {{ ui.toast.text }}
    </div>
  </transition>

  <transition name="fade">
    <div v-if="ui.confirmState.visible" class="confirm-mask" @click.self="ui.resolveConfirm(false)">
      <div class="confirm-dialog card">
        <h3>{{ ui.confirmState.title }}</h3>
        <p>{{ ui.confirmState.message }}</p>
        <div class="actions">
          <button class="btn-secondary" @click="ui.resolveConfirm(false)">{{ ui.confirmState.cancelText }}</button>
          <button class="btn-danger" @click="ui.resolveConfirm(true)">{{ ui.confirmState.confirmText }}</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useUiStore } from '@/stores/ui'

const ui = useUiStore()
</script>

<style scoped>
.top-loading {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 4px;
  z-index: 9999;
  pointer-events: none;
}

.bar {
  height: 100%;
  width: 32%;
  border-radius: 0 4px 4px 0;
  background: linear-gradient(90deg, #0f6bff, #ff6a3d);
  box-shadow: 0 0 20px rgba(15, 107, 255, 0.4);
  animation: loading-bar 1s ease-in-out infinite;
}

.toast {
  position: fixed;
  left: 50%;
  top: 18px;
  transform: translateX(-50%);
  z-index: 10010;
  min-width: 240px;
  max-width: min(520px, calc(100vw - 24px));
  text-align: center;
  padding: 11px 16px;
  border-radius: 12px;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 16px 30px rgba(15, 23, 42, 0.18);
}

.toast--info {
  background: linear-gradient(135deg, #0f6bff, #2f8bff);
}

.toast--success {
  background: linear-gradient(135deg, #19a463, #20b26c);
}

.toast--error {
  background: linear-gradient(135deg, #e24f4f, #f06a6a);
}

.confirm-mask {
  position: fixed;
  inset: 0;
  z-index: 10005;
  display: grid;
  place-items: center;
  background: rgba(11, 16, 30, 0.36);
  backdrop-filter: blur(3px);
}

.confirm-dialog {
  width: min(420px, calc(100vw - 32px));
  padding: 18px;
}

.confirm-dialog h3 {
  margin: 0 0 8px;
  font-size: 20px;
}

.confirm-dialog p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

.actions {
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-secondary {
  background: #e8edf5;
  color: #1f2937;
  box-shadow: none;
}

.btn-danger {
  background: linear-gradient(135deg, #e24f4f, #f06a6a);
  box-shadow: 0 8px 20px rgba(226, 79, 79, 0.24);
}

.fade-enter-active,
.fade-leave-active,
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, -6px);
}

@keyframes loading-bar {
  0% { transform: translateX(-120%); width: 18%; }
  50% { transform: translateX(130%); width: 45%; }
  100% { transform: translateX(360%); width: 20%; }
}
</style>

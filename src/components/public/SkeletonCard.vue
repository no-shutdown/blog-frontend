<template>
  <div class="skeleton-card card">
    <div class="sk-cover"></div>
    <div class="sk-body">
      <div class="sk-line" style="width:30%;height:14px;margin-bottom:10px;"></div>
      <div class="sk-line" style="width:75%;height:22px;margin-bottom:12px;"></div>
      <div class="sk-line" style="width:100%;height:13px;margin-bottom:6px;"></div>
      <div class="sk-line" style="width:85%;height:13px;margin-bottom:6px;"></div>
      <div class="sk-line" style="width:60%;height:13px;"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-card {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 14px;
  padding: 14px;
  margin-bottom: 14px;
}

.sk-cover {
  height: 160px;
  border-radius: 14px;
  background: var(--skeleton-bg);
  background-image: var(--skeleton-shine);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.sk-body {
  padding: 4px 0;
}

.sk-line {
  border-radius: 6px;
  background: var(--skeleton-bg);
  background-image: var(--skeleton-shine);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% center;
  }

  100% {
    background-position: -200% center;
  }
}

@media (max-width: 860px) {
  .skeleton-card {
    grid-template-columns: 1fr;
  }

  .sk-cover {
    height: 200px;
  }
}
</style>

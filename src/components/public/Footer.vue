<template>
  <footer class="footer">
    <p>
      © {{ year }} Nebula Blog |
      <RouterLink to="/archive">归档</RouterLink> |
      <RouterLink to="/about">关于</RouterLink> |
      <RouterLink to="/links">友链</RouterLink>
    </p>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer {
  max-width: 1240px;
  margin: 28px auto 0;
  padding: 18px 0 10px;
  border-top: 1px solid var(--line);
  text-align: center;
  color: var(--text-muted);
  font-size: 13px;
}

.footer a {
  color: var(--text-muted);
}

.footer a:hover {
  color: var(--primary);
}
</style>


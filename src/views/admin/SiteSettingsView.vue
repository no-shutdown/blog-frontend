<template>
  <div class="card settings-card">
    <h2>网站设置</h2>

    <div class="field">
      <label>站点名称</label>
      <input v-model="nameInput" placeholder="例如：我的博客" />
    </div>

    <div class="field">
      <label>Logo</label>
      <div class="upload-row">
        <input v-model="logoInput" placeholder="粘贴图片 URL，或点击右侧上传" />
        <label class="upload-btn">
          {{ uploading ? '上传中...' : '上传图片' }}
          <input type="file" accept="image/*" :disabled="uploading" @change="upload" />
        </label>
      </div>
    </div>

    <div v-if="logoInput || nameInput" class="preview card">
      <p class="preview-label">预览</p>
      <div class="brand-preview">
        <img v-if="logoInput" :src="logoInput" class="logo-img" alt="logo" />
        <span v-if="nameInput" class="name-text">{{ nameInput }}</span>
      </div>
    </div>

    <button @click="save">保存</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import { useUiStore } from '@/stores/ui'
import { adminApi } from '@/api/admin'

const settings = useSettingsStore()
const ui = useUiStore()

const logoInput = ref(settings.logoUrl)
const nameInput = ref(settings.siteName)
const uploading = ref(false)

async function upload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const res = await adminApi.uploadImage(file)
    if (res.code === 200) {
      logoInput.value = res.data.url
    } else {
      ui.notify('上传失败', 'error')
    }
  } catch {
    ui.notify('上传失败', 'error')
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

function save() {
  settings.setLogo(logoInput.value.trim())
  settings.setSiteName(nameInput.value.trim())
  ui.notify('设置已保存', 'success')
}
</script>

<style scoped>
.settings-card {
  padding: 22px;
  max-width: 560px;
}

h2 {
  margin: 0 0 22px;
}

.field {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

label {
  font-size: 12px;
  color: var(--text-muted);
}

.upload-row {
  display: flex;
  gap: 8px;
}

.upload-row input[type="text"],
.upload-row input:not([type="file"]) {
  flex: 1;
}

.upload-btn {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  padding: 0 14px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(135deg, var(--primary), #2f8bff);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;
}

.upload-btn input[type="file"] {
  display: none;
}

.preview {
  padding: 14px 16px;
  margin-bottom: 18px;
}

.preview-label {
  margin: 0 0 10px;
  font-size: 11px;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.brand-preview {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.logo-img {
  max-height: 36px;
  max-width: 120px;
  object-fit: contain;
}

.name-text {
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
}
</style>

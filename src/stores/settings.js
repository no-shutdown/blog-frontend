import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const logoUrl = ref(localStorage.getItem('site_logo') || '')
  const siteName = ref(localStorage.getItem('site_name') || '')

  function setLogo(url) {
    logoUrl.value = url
    localStorage.setItem('site_logo', url)
  }

  function setSiteName(name) {
    siteName.value = name
    localStorage.setItem('site_name', name)
  }

  return { logoUrl, siteName, setLogo, setSiteName }
})

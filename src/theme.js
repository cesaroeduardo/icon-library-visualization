import { ref } from 'vue'

export const isDark = ref(false)

export function initTheme() {
  const saved = localStorage.getItem('icon-library-theme')
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = saved ? saved === 'dark' : prefersDark
  applyTheme(dark)
}

export function applyTheme(dark) {
  isDark.value = dark
  const root = document.documentElement
  if (dark) {
    root.classList.add('dark')
    localStorage.setItem('icon-library-theme', 'dark')
  } else {
    root.classList.remove('dark')
    localStorage.setItem('icon-library-theme', 'light')
  }
}

export function toggleTheme() {
  applyTheme(!isDark.value)
}

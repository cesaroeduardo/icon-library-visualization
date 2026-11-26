import { ref } from 'vue'

export const isDark = ref(true)

export function initTheme() {
  const saved = localStorage.getItem('icon-library-theme')
  const dark = saved ? saved === 'dark' : true // TUFFUI dark default
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

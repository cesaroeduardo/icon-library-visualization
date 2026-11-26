import { createApp } from 'vue'
import Vue3ColorPicker from 'vue3-colorpicker'
import 'vue3-colorpicker/style.css'
import './main.css'
import App from './App.vue'
import { initTheme } from './theme'

initTheme()

createApp(App).use(Vue3ColorPicker).mount('#app')

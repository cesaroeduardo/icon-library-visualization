import { createApp } from 'vue'
import Vue3ColorPicker from "vue3-colorpicker"

import './assets/main.css'
import './assets/icon-fonts/azionicons.css'
import './assets/icon-fonts/primeicons.css'
import 'vue3-colorpicker/style.css'

import App from './App.vue'
import { initializeTheme } from './theme'

initializeTheme();
createApp(App).use(Vue3ColorPicker).mount("#app");

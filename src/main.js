import { createApp } from 'vue';
import './assets/main.css';
import App from './App.vue';
import Vue3ColorPicker from "vue3-colorpicker";
import './assets/azionicons.scss';
import "vue3-colorpicker/style.css";
import { initializeTheme } from './theme';

initializeTheme();

createApp(App)
  .use(Vue3ColorPicker)
  .mount("#app");

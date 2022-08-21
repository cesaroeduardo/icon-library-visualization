import { createApp } from 'vue'
import App from './App.vue'
import Unicon from 'vue-unicons'
import { uniPlus, uniTimes, uniMinus } from 'vue-unicons/dist/icons'

Unicon.add([uniPlus, uniTimes, uniMinus])

createApp(App).use(Unicon).mount('#app')
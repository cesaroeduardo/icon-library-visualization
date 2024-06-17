<template>
  <SearchBar class="input"/>
  <div class="customize-area no-desktop">
    <br/>
    <select class="input" v-model="IconsSize">
      <option v-for="size in iconSizes" :key="size">{{ size }}</option>
    </select>
    <input type="text" class="input" v-model="IconsColor" placeholder="Type a color or hex code" />
  </div>
  <section>
    <h1>Icons</h1>
    <div class="content">
      <div class="card-content">
        <ul class="library-module-grid" id="myUL">
          <icon-card 
            v-for="icon in icons" 
            :key="icon.name" 
            :name="icon.name" 
            :keywords="icon.keywords" 
            :icon="icon.icon"
          >
            <i 
              :class="`ai ai-${icon.icon}`" 
              :style="{ color: IconsColor, fontSize: IconsSize }"
            ></i>
          </icon-card>
        </ul>
      </div>
      <div class="customize-area no-mobile">
        <select class="input" v-model="IconsSize">
          <option v-for="size in iconSizes" :key="size">{{ size }}</option>
        </select>
        <input type="text" class="input" v-model="IconsColor" placeholder="Type a color or hex code" />
      </div>
    </div>
  </section>
</template>

<script>
import IconCard from './components/IconCard.vue'
import SearchBar from './components/SearchBar.vue'
import icons from './assets/icons.json'
import './assets/azionicons.scss'  // Importando o arquivo de ícones

export default {
  name: 'App',
  components: {
    IconCard,
    SearchBar
  },
  data() {
    return {
      IconsColor: '',
      IconsSize: '24px',
      icons: icons,
      iconSizes: ['12px', '16px', '20px', '24px', '28px', '32px', '40px', '48px', '56px', '64px']
    }
  }
}
</script>

<style scoped>
/* Seus estilos aqui */
</style>

<template>
  <div class="flex flex-col gap-8 p-8">
    <SearchBar />
    <div class="flex flex-col gap-4 md:hidden">
      <select v-model="selectedFontSize">
        <option v-for="fontSize in fontSizes" :key="fontSize.value" :value="fontSize.value">
          {{ fontSize.name }} ({{ fontSize.value }})
        </option>
      </select>
      <input type="text" v-model="IconsColor" placeholder="Type a color or hex code" />
    </div>
    <section class="w-full flex flex-row gap-8">
      <div class="w-full">
        <ul class="grid grid-cols-5 gap-4" id="myUL">
          <icon-card
            v-for="icon in icons"
            :key="icon.name"
            :name="icon.name"
            :keywords="icon.keywords"
            :icon="icon.icon"
          >
            <i
              :class="`ai ai-${icon.icon} ${selectedFontSize}`"
              :style="{ color: IconsColor }"
            ></i>
          </icon-card>
        </ul>
      </div>
      <div class="flex-col gap-4 md:flex md:w-64 hidden">
        <select v-model="selectedFontSize">
          <option v-for="fontSize in fontSizes" :key="fontSize.value" :value="fontSize.value">
            {{ fontSize.name }} ({{ fontSize.value }})
          </option>
        </select>
        <input type="text" v-model="IconsColor" placeholder="Type a color or hex code" />
      </div>
    </section>
  </div>
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
      IconsColor: '#F3652B',
      selectedFontSize: 'text-base', // Inicialize com o tamanho de fonte base
      icons: icons,
      fontSizes: [
        { name: '12px', value: 'text-xs' },
        { name: '16px', value: 'text-sm' },
        { name: '20px', value: 'text-base' },
        { name: '24px', value: 'text-lg' },
        { name: '28px', value: 'text-xl' },
        { name: '32px', value: 'text-2xl' },
        { name: '40px', value: 'text-3xl' },
        { name: '48px', value: 'text-4xl' },
        { name: '56px', value: 'text-5xl' },
        { name: '64px', value: 'text-6xl' },
      ]
    }
  }
}
</script>

<style scoped>
/* Seus estilos aqui */
</style>

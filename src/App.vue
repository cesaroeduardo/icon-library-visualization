<template>
  <div class="flex flex-col gap-8 p-8">
    <!-- Circles Background -->
    <div class="w-full h-full fixed -z-10">
      <div class="flex flex-col gap-2">
        <div
          v-for="(circleColor, index) in circleColors"
          :key="index"
          class="circle"
          :style="{ backgroundColor: circleColor, top: circlePositions[index].top, left: circlePositions[index].left }"
        ></div>
      </div>
    </div>

    <!-- Content -->
    <div class="w-full flex gap-4 justify-between">
      <SearchBar class="w-full" />
      <button @click="toggleTheme">
        <i :class="getThemeIcon()"></i>
      </button>
    </div>

    <!-- Mobile Commands -->
    <div class="flex flex-col gap-4 md:hidden">
      <select v-model="selectedFontSize">
        <option v-for="fontSize in fontSizes" :key="fontSize.value" :value="fontSize.value">
          {{ fontSize.name }} ({{ fontSize.value }})
        </option>
      </select>
    </div>

    <!-- Icons List -->
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
              :class="'ai ai-' + icon.icon + ' ' + selectedFontSize"
              :style="{ color: IconsColor }"
            ></i>
          </icon-card>
        </ul>
      </div>
      <!-- Commands -->
      <div class="flex-col gap-4 md:flex md:w-64 hidden">
        <select v-model="selectedFontSize">
          <option v-for="fontSize in fontSizes" :key="fontSize.value" :value="fontSize.value">
            {{ fontSize.name }} ({{ fontSize.value }})
          </option>
        </select>
        <color-picker v-model:pureColor="pureColor" v-model:gradientColor="gradientColor" class="rounded-md"/>
      </div>
    </section>
  </div>
</template>

<script>
import IconCard from './components/IconCard.vue'
import SearchBar from './components/SearchBar.vue'
import icons from './assets/icons.json'
import { isDarkMode, getThemeIcon, toggleTheme } from './theme'; // Importa variáveis e funções de tema


export default {
  name: 'App',
  components: {
    IconCard,
    SearchBar
  },
  data() {
    return {
      isDarkMode,
      getThemeIcon,
      IconsColor: 'rgb(243, 101, 43)',
      circleColors: ['rgb(243, 101, 43)', 'rgb(243, 101, 43)', 'rgb(243, 101, 43)'],
      circlePositions: [
        { top: '-30%', left: '-30%' },
        { top: '20%', left: '90%' },
        { top: '80%', left: '20%' }
      ],
      selectedFontSize: 'text-base',
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
      ],
      pureColor: 'rgb(243, 101, 43)', // Cor inicial para o color-picker em formato RGB
      gradientColor: 'linear-gradient(0deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 1) 100%)',
    }
  },
  watch: {
    pureColor(newVal) {
      this.IconsColor = newVal; // Atualiza a cor dos ícones com o novo valor RGB
      this.circleColors = [newVal, newVal, newVal]; // Atualiza as cores dos círculos de fundo
    }
  },
  methods: {
    toggleTheme
  },
}
</script>

<style scoped>
.circle {
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(300px);
  position: absolute;
}
</style>

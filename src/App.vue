<template>
  <div class="flex flex-col gap-6 p-8">
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

    <!-- Icons List -->
    <section class="w-full flex gap-8 md:flex-row flex-col-reverse">
      <div class="w-full flex flex-col gap-8">
        <ul class="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-3 gap-4" id="myUL">
          <icon-card
            v-for="icon in icons"
            :key="icon.name"
            :name="icon.name"
            :keywords="icon.keywords"
            :icon="icon.icon"
          >
            <i :class="'' + icon.icon + ' ' + selectedFontSize" :style="{ color: IconsColor }"></i>
          </icon-card>
        </ul>
        <div class="text-neutral-700 dark:text-neutral-200 opacity-40 gap-2 w-full text-center justify-center items-center min-h-28 border border-neutral-200 dark:border-neutral-700 bg-neutral-100/60 dark:bg-neutral-800/60 rounded-md text-xs flex px-4 py-8 ">
          <p>Not found your icon? Try another keyword.</p>
          <i class="pi pi-face-smile"></i>
        </div>
      </div>
      <!-- Commands -->
      <div class="flex flex-col gap-3 w-full md:flex-col md:w-64">
        <div class="select-container w-full">
          <i class="pi pi-arrows-h mr-8"></i>
          <select v-model="selectedFontSize" class="w-full">
            <option v-for="fontSize in fontSizes" :key="fontSize.value" :value="fontSize.value">
              {{ fontSize.name }} ({{ fontSize.value }})
            </option>
          </select>
          <i class="pi pi-chevron-down select-icon"></i>
        </div>
        <div class="flex items-start gap-4 bg-neutral-100/60 py-2 border border-neutral-200 rounded-lg px-2.5 dark:bg-neutral-800/60 dark:border-neutral-700">
          <i class="pi pi-palette text-xs ml-1 mt-1.5 text-neutral-700 dark:text-neutral-400"></i>
          <color-picker v-model:pureColor="pureColor"/>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import IconCard from './components/IconCard.vue'
import SearchBar from './components/SearchBar.vue'
import icons from './icons.json'
import { isDarkMode, getThemeIcon, toggleTheme } from './theme';

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
      pureColor: 'rgb(243, 101, 43)'
    }
  },
  watch: {
    pureColor(newVal) {
      this.IconsColor = newVal;
      this.circleColors = [newVal, newVal, newVal];
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

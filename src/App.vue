<template>
  <div class="flex flex-col justify-center items-center w-full">
    <!-- Top Bar -->
    <div class="w-full bg-neutral-200 dark:bg-neutral-900 overflow-hidden pb-5 gradient-mask-b-60 md:gradient-mask-b-60 px-4 md:px-8 top-0 z-20 py-4 md:py-8 sticky justify-center items-center flex flex-col">
      <div class="max-w-[1472px] w-full z-20 flex gap-2 md:gap-4 justify-between">
        <SearchBar class="w-full z-20" />
        <button @click="toggleTheme" class="z-20 hidden md:flex items-center justify-center h-12 w-12">
          <i :class="getThemeIcon()"></i>
        </button>
        <button @click="toggleBottombar" class="z-20 flex items-center justify-center h-12 w-12 md:hidden">
          <i :class="[openBottombar ? 'pi pi-times' : 'pi pi-ellipsis-v']"></i>
        </button>
      </div>
      <div
        v-for="(circleColor, index) in circleColors"
        :key="index"
        class="circle"
        :style="{ backgroundColor: circleColor, top: circlePositions[index].top, left: circlePositions[index].left }">
      </div>
    </div>
    <div class="flex flex-col pb-8 w-full max-w-[1536px]">
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

      <!-- Icons List -->
      <section class="w-full flex gap-4 md:gap-8 md:flex-row flex-col-reverse px-4 md:px-8">
        <div class="w-full flex flex-col gap-4 md:gap-8">
          <ul class="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-3 gap-2 md:gap-4" id="myUL">
            <icon-card
                v-for="icon in icons"
                :key="icon.name"
                :name="icon.name"
                :keywords="icon.keywords"
                :icon="icon.icon"
                :color="IconsColor"
                :size="`${selectedFontSize}px`"
                :download-format="downloadFormat"
              >
              <i :class="'' + icon.icon" :style="{ fontSize: selectedFontSize + 'px', color: IconsColor }"></i>
            </icon-card>
          </ul>
          <div class="text-neutral-700 dark:text-neutral-200 opacity-40 gap-2 w-full text-center justify-center items-center min-h-28 border border-neutral-200 dark:border-neutral-700 bg-neutral-100/60 dark:bg-neutral-800/60 rounded-md text-xs flex px-4 py-8 ">
            <p>Not found your icon? Try another keyword.</p>
            <i class="pi pi-face-smile"></i>
          </div>
        </div>
        <!-- Comandos -->
        <div class="flex-col gap-3 w-full md:flex-col md:w-64 md:sticky top-28 md:h-60 z-10 hidden md:flex">
          <div class="flex items-center gap-4 bg-neutral-100/60 py-2 border border-neutral-200 rounded-lg px-2.5 dark:bg-neutral-800/60 dark:border-neutral-700">
            <i class="pi pi-arrows-h text-xs ml-1 text-neutral-700 dark:text-neutral-400"></i>
            <!-- Slider -->
            <div class="flex flex-row w-full items-center gap-2">
              <input
                type="range"
                v-model="sliderValue"
                min="0"
                max="11"
                @input="updateFontSize"
                class="w-full slider-input"
                :style="{ '--thumb-color': pureColor }"
                style="cursor: grab;"
              />
              <p class="text-neutral-500 text-xs dark:text-neutral-400 w-12 text-left">{{ selectedFontSize }}px</p>
            </div>

          </div>
          <div class="flex items-center gap-4 bg-neutral-100/60 py-2 border border-neutral-200 rounded-lg px-2.5 dark:bg-neutral-800/60 dark:border-neutral-700">
            <i class="pi pi-palette text-xs ml-1 text-neutral-700 dark:text-neutral-400"></i>
            <color-picker v-model:pureColor="pureColor"/>
          </div>
          <div class="flex items-center gap-4 bg-neutral-100/60 py-2 border border-neutral-200 rounded-lg px-2.5 dark:bg-neutral-800/60 dark:border-neutral-700">
            <i class="pi pi-cog text-xs ml-1 text-neutral-700 dark:text-neutral-400"></i>
            <div class="radio-group">
              <label class="w-full">
                <input type="radio" value="png" class="radio" v-model="downloadFormat" checked />
                <div class="radio-container text-white p-8 checked:text-yellow-400">
                  .png
                </div>
              </label>
              <label class="w-full">
                <input type="radio" value="svg" class="radio" v-model="downloadFormat" />
                <div class="radio-container">
                  .svg
                </div>
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
  <!-- Bottombar Mobile -->
  <div v-if="openBottombar" class="flex w-full h-fit bottom-0 fixed bg-white z-30 rounded-t-xl md:hidden bg-neutral-300/90 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-600">
    <div class="flex flex-col gap-3 w-full md:flex-col md:w-64 md:sticky top-28 md:h-60 z-10 px-4 pt-6 pb-8">
      <!-- Comandos -->
      <div class="flex items-center gap-4 bg-neutral-100/60 py-2 border border-neutral-200 rounded-lg px-2.5 dark:bg-neutral-800/60 dark:border-neutral-700">
        <i class="pi pi-arrows-h text-xs ml-1 text-neutral-700 dark:text-neutral-400"></i>
        <!-- Slider for mobile -->
        <div class="flex flex-row w-full items-center gap-2">
          <input
            type="range"
            v-model="sliderValue"
            min="0"
            max="11"
            @input="updateFontSize"
            :style="{ '--thumb-color': pureColor }"
            class="w-full slider-input"
          />
          <p class="text-neutral-500 dark:text-neutral-400 w-10 text-xs">{{ selectedFontSize }}px</p>
        </div>
      </div>
      <div class="flex items-center gap-4 bg-neutral-100/60 py-2 border border-neutral-200 rounded-lg px-2.5 dark:bg-neutral-800/60 dark:border-neutral-700">
        <i class="pi pi-palette text-xs ml-1 text-neutral-700 dark:text-neutral-400"></i>
        <color-picker v-model:pureColor="pureColor"/>
      </div>
      <div class="flex items-center gap-4 bg-neutral-100/60 py-2 border border-neutral-200 rounded-lg px-2.5 dark:bg-neutral-800/60 dark:border-neutral-700">
        <i class="pi pi-cog text-xs ml-1 text-neutral-700 dark:text-neutral-400"></i>
        <div class="radio-group">
          <label class="w-full">
            <input type="radio" value="png" class="radio" v-model="downloadFormat" checked />
            <div class="radio-container text-white p-8 checked:text-yellow-400">
              .png
            </div>
          </label>
          <label class="w-full">
            <input type="radio" value="svg" class="radio" v-model="downloadFormat" />
            <div class="radio-container">
              .svg
            </div>
          </label>
        </div>
      </div>
      <!-- ToggleTheme -->
      <button @click="toggleTheme" class="flex items-center justify-center h-12 w-full">
        <i :class="getThemeIcon()"></i>
      </button>
    </div>
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
      IconsColor: 'rgb(133, 133, 133)',
      circleColors: ['rgb(133, 133, 133)', 'rgb(133, 133, 133)', 'rgb(133, 133, 133)'],
      circlePositions: [
        { top: '-30%', left: '-30%' },
        { top: '20%', left: '90%' },
        { top: '80%', left: '20%' }
      ],
      selectedFontSize: 20, // Default font size
      sliderValue: 2, // Default value in the exponential range
      fontSizeValues: [8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 320], // Exponential values
      icons: icons,
      pureColor: 'rgb(133, 133, 133)',
      downloadFormat: 'png',
      openBottombar: false
    }
  },
  watch: {
    pureColor(newVal) {
      this.IconsColor = newVal;
      this.circleColors = [newVal, newVal, newVal];
    }
  },
  methods: {
    toggleTheme,
    toggleBottombar() {
      this.openBottombar = !this.openBottombar;
    },
    updateFontSize() {
      window.requestAnimationFrame(() => {
        this.selectedFontSize = this.fontSizeValues[this.sliderValue];
      });
    }
  }
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

.slider-input {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 0px;
  border-radius: 4px;
  transition: background 0.3s ease;
  @apply bg-neutral-300 dark:bg-black/10 border-neutral-400/30 dark:border-neutral-400/25
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: grab;
  background-color: var(--thumb-color, #4a5568); /* Aplica a cor da bolinha */
}

.slider-input::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  cursor: grab;
  background-color: var(--thumb-color, #4a5568); /* Aplica a cor da bolinha */
}
</style>


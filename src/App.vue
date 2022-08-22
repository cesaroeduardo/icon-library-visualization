<template>
  <SearchBar class="input"/>
  <div class="customize-area no-desktop">
    <br/>
    <select class="input" v-model="IconsSize">
      <option>12px</option>
      <option>16px</option>
      <option>20px</option>
      <option>24px</option>
      <option>28px</option>
      <option>32px</option>
      <option>40px</option>
      <option>48px</option>
      <option>56px</option>
      <option>64px</option>
    </select>
    <input type="text" class="input " v-model="IconsColor" placeholder="Type a color or hex code" />
  </div>
  <section>
      <h1>Icons</h1>
      <div class="content">
        <div class="card-content">
          <ul class="library-module-grid" id="myUL">
            <icon-card name="Add" keywords="Add, Plus, Adicionar">
              <unicon name="plus" :fill="IconsColor" :height="IconsSize" :width="IconsSize" />
            </icon-card>
            <icon-card name="Close" keywords="Times, Fechar, Close" icon='times'>
              <unicon name="times" :fill="IconsColor" :height="IconsSize" :width="IconsSize" />
            </icon-card>
            <icon-card name="Minus" keywords="Minus, Menos" icon='minus'>
              <unicon name="minus" :fill="IconsColor" :height="IconsSize" :width="IconsSize" />
            </icon-card>
          </ul>
        </div>
        <div class="customize-area no-mobile">
          <select class="input" v-model="IconsSize">
            <option>12px</option>
            <option>16px</option>
            <option>20px</option>
            <option>24px</option>
            <option>28px</option>
            <option>32px</option>
            <option>40px</option>
            <option>48px</option>
            <option>56px</option>
            <option>64px</option>
          </select>
          <input type="text" class="input " v-model="IconsColor" placeholder="Type a color or hex code" />
        </div>
      </div>
  </section>
</template>

<script>
import IconCard from './components/IconCard.vue'
import SearchBar from './components/SearchBar.vue'

export default {
  name: 'App',
  components: {
    IconCard,
    SearchBar
  },
  data() {
    return {
      IconsColor: '',
      IconsSize: '24px'
    }
  }
}
</script>

<style>
html,
body,
div,
a,
b,
p,
u,
i,
span,
h1,
header,
section,
li,
ul{
  font-family: 'Roboto', sans-serif;
  font-weight: 800;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  list-style: none;
  padding-inline-start: 0px;
  border: 0;
  font: inherit;
  font-size: 100%;
  margin: 0;
  padding: 0;
  vertical-align: initial;
}

body {
  padding: 32px;
}

.customize-area {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.input {
  height: 48px;
  padding-left: 1rem;
}

.content {
  display: grid;
  grid-template-columns: 1fr 280px;
  width: 100%;
  gap: 32px;
}

h1 {
  font-size: 2rem;
  font-weight: 900;
  margin: 2rem 0;
  font-family: 'Roboto', sans-serif;
}

.library-module-grid {
  display: grid;
  flex-wrap: wrap;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  gap: 8px;
}

.no-mobile {
  display: flex;
}

.no-desktop {
  display: none;
}

@media only screen and (max-width: 1024px) {
  .library-module-grid{ 
    grid-template-columns: repeat(3, 1fr);
  }
}

@media only screen and (max-width: 768px) {
  .library-module-grid{ 
    grid-template-columns: repeat(3, 1fr);
  }
  .content {
    display: flex;
    flex-direction: column;
  }
  .no-mobile {
    display: none !important;
  }
  .no-desktop {
    display: flex;
  }
  .input {
      width: auto;
  }
}

@media only screen and (max-width: 468px) {
  .library-module-grid{ 
    grid-template-columns: repeat(2, 1fr);
  }
  .no-mobile {
    display: none;
  }
  .no-desktop {
    display: flex;
  }
  .input {
      width: 100%;
  }
  body {
    padding: 4%;
  }
}
</style>

<template>
  <div class="hello">
    <input type="text" id="searchInput" onkeyup="searchIcons()" placeholder="Search for an icon..">
    <section>
        <h1>Icons</h1>
        <ul class="library-module-grid" id="myUL">
          <IconCard name="Add" keywords="Add, Plus, Adicionar" teste="M18.5 18.5V2H21.5V18.5H38V21.5H21.5V38H18.5V21.5H2V18.5H18.5Z"/>
          <IconCard name="Close" keywords="Times, Fechar, Close" teste="M17.1717 20L2.61523 5.44354L5.44366 2.61511L20.0001 17.1716L34.5566 2.61511L37.3851 5.44354L22.8286 20L37.3851 34.5565L34.5566 37.3849L20.0001 22.8284L5.44366 37.3849L2.61523 34.5565L17.1717 20Z"/>
        </ul>
    </section>
  </div>
</template>

<script>
import IconCard from './components/IconCard.vue'

export default {
  name: 'App',
  components: {
    IconCard
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
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
    list-style: none;
    padding-inline-start: 0px;
    border: 0;
    font: inherit;
    font-size: 100%;
    margin: 0;
    padding: 0;
    vertical-align: initial;
}

#searchInput {
    height: 48px;
    min-width: 24rem;
    padding-left: 1rem;
}

body {
    padding: 30px;
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
    gap: .5rem;
}
</style>

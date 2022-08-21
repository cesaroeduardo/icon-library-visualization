<template>
  <div>
    <SearchBar/>
      <section>
        <h1>Icons</h1>
        <ul class="library-module-grid" id="myUL">
          <IconCard name="Add" keywords="Add, Plus, Adicionar" icon='plus'/>
          <IconCard name="Close" keywords="Times, Fechar, Close" icon='times'/>
          <IconCard name="Minus" keywords="Minus, Menos" icon='minus'/>
       </ul>
    </section>
  </div>
</template>

<script>
import IconCard from './components/IconCard.vue'
import SearchBar from './components/SearchBar.vue'

export default {
  name: 'App',
  components: {
    IconCard,
    SearchBar
  }
}


// // Search Function
// function searchIcons() {
//     // Declare variables
//     var input, filter, ul, li, a, i, txtValue;
//     input = document.getElementById('searchInput');
//     filter = input.value.toUpperCase();
//     ul = document.getElementById("myUL");
//     li = ul.getElementsByTagName('li');

//     // Loop through all list items, and hide those who don't match the search query
//     for (i = 0; i < li.length; i++) {
//         a = li[i].getElementsByTagName("span")[0];
//         txtValue = a.textContent || a.innerText;
//         if (txtValue.toUpperCase().indexOf(filter) > -1) {
//             li[i].style.display = "";
//         } else {
//             li[i].style.display = "none";
//         }
//     }
// }
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
    font-family: 'Roboto', Helvetica, Arial, sans-serif;
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

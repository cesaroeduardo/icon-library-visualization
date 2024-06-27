<template>
    <div class="input-container">
        <i class="pi pi-search"></i>
        <input class="w-full" autofocus type="text" v-on:keyup="searchIcons()" id="searchInput" v-model="input" :placeholder="`Search by keywords in ${icons.length} icons...`"/>
    </div>
</template>

<script setup>
import { ref } from "vue";
import icons from "../icons.json";

let input = ref("");

function searchIcons() {
  // Obter o filtro em letras maiúsculas
  let filter = input.value.toUpperCase();
  
  // Selecionar a lista de ícones
  let ul = document.getElementById("myUL");
  let li = ul.getElementsByTagName("li");

  // Loop através de todos os itens da lista e ocultar aqueles que não correspondem à consulta de pesquisa
  for (let i = 0; i < li.length; i++) {
    let icon = icons[i];
    let nameMatch = icon.name.toUpperCase().indexOf(filter) > -1;
    let keywordMatch = icon.keywords.toUpperCase().indexOf(filter) > -1;

    // Mostrar o item da lista se houver correspondência com o nome, as palavras-chave ou o texto do conteúdo
    if (nameMatch || keywordMatch) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}
</script>

<style scoped>
#searchInput {
  @apply h-12 pl-10 box-border text-xs
}
</style>
<template>
    <div class="input-container">
        <i class="pi pi-search"></i>
        <input class="w-full" type="text" v-on:keyup="searchIcons()" id="searchInput" v-model="input" placeholder="Search icons..." />
    </div>
</template>

<script setup>
import { ref } from "vue";
let input = ref("");
function searchIcons() {
    // Declare variables
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById('searchInput');
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("span")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
</script>

<style scoped>
#searchInput {
  @apply h-12 pl-10 box-border
}
</style>
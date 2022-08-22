<template>
   <input type="text" v-on:keyup="searchIcons()" id="searchInput" v-model="input" placeholder="Search icons..." />
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
    height: 48px;
    padding-left: 1rem;
    min-width: 260px;
}
</style>
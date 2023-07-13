<template>
  <div class="container">
    <v-img :src="getDefaultLogo()" class="logo" @click="navigateTo('/')" />
    <p class="text">THIS IS ADMIN PAGE</p>
  </div>
</template>
<script setup>
definePageMeta({ layout: "admin", middleware: ["admin-auth"] });
</script>
<style scoped>
.container {
  text-align: center;
  height: 100vh;
  background-image: linear-gradient(#f6eaf7, #f0eff1);
}
.logo {
  margin: auto;
  width: 500px;
  height: fit-content;
}
.text {
  font-size: 40px;
  font-family: "Roboto", "Roboto", monospace;
  font-style: italic;
  font-weight: 800;
  opacity: 0.7;
}
</style>

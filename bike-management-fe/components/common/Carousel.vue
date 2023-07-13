<template>
  <v-carousel
    hide-delimiter-background
    :hide-delimiters="hideDelimiters"
    :show-arrows="showArrows && 'hover'"
    :height="height || 300"
    :cycle="cycle"
  >
    <v-carousel-item
      v-for="(image, indx) in images"
      :key="indx"
      :src="image"
      class="carousel-item"
      cover
    ></v-carousel-item>
  </v-carousel>
</template>

<script setup>
// Props
const props = defineProps({
  showArrows: Boolean,
  hideDelimiters: Boolean,
  images: Array,
  height: String,
  cycle: Boolean,
});
</script>

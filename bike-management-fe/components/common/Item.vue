<template>
  <v-card class="item rounded-xl" @click="navigateTo(`/item/${item.id}`)">
    <v-card-item class="item-image">
      <common-carousel
        :hide-delimiters="!item.image?.length"
        :show-arrows="!!item.image?.length"
        :images="item.image?.length ? item.image : [getDefaultImage()]"
      ></common-carousel>
    </v-card-item>
    <v-card-title class="item-name"> {{ item.name }}</v-card-title>
    <div class="text-center">
      <b class="price-text">{{ formatMoney(item.price) }} VND </b>
      <b style="display: inline">{{ item.quantity ? "" : "(SOLD OUT)" }}</b>
    </div>
  </v-card>
</template>
<script setup>
const props = defineProps({
  item: Object,
});
</script>
<style scoped lang="scss">
.item {
  .item-image {
    box-shadow: 0px 2px 2px 0px rgba(168, 164, 164, 0.5);
  }
  .item-name {
    font-weight: 600;
    font-family: "Roboto", "Roboto", monospace;
  }
  &:hover {
    box-shadow: 0px 20px 20px 10px rgba(0, 0, 0, 0.5);
    transform: translateX(-10px) translateY(-10px);
  }
}

.price-text {
  font-size: larger;
  color: rgb(196, 6, 6);
}
</style>

<template>
  <v-sheet class="container" elevation="1">
    <v-slide-group center-active show-arrows>
      <v-slide-group-item
        v-for="(item, index) in items"
        :key="index"
        :value="item"
        v-slot="{ isSelected, toggle }"
      >
        <v-card
          elevation="8"
          class="ma-4"
          :image="item"
          width="100"
          height="100"
          @click="
            () => {
              toggle();
              $emit('selectItem', item);
            }
          "
        >
          <div class="d-flex fill-height align-center justify-center">
            <v-scale-transition>
              <v-icon
                v-if="isSelected"
                color="white"
                size="30"
                icon="mdi-eye"
              ></v-icon>
            </v-scale-transition>
          </div>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script setup>
const props = defineProps({
  items: Array,
});
defineEmits(["selectItem"]);
</script>
<style lang="scss" scoped>
.container {
  width: fit-content;
  max-width: 400px;
}
</style>

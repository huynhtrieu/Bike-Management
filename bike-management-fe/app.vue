<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import axios from "axios";
import { useCategoryStore } from "@/store/category";

onMounted(async () => {
  await getAllCategories();
});
// Function
const getAllCategories = async () => {
  const categoryStore = useCategoryStore();
  const response = await axios.get("categories");
  categoryStore.setCategoryState(response.data);
};
</script>

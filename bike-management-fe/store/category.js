import { defineStore } from "pinia";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    category: [],
  }),

  actions: {
    setCategoryState(category) {
      this.category = category;
    },
  },
});

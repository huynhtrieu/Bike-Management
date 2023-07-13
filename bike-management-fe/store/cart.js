import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: [],
  }),

  getters: {
    totalOrders: (state) =>
      state.cart.reduce((acc, item) => (acc += item.quantity), 0),
  },

  actions: {
    setCartState(cart) {
      this.cart = cart;
    },
    addItemToCart(item) {
      this.cart.push(item);
    },
    removeItemFromCart(removedItem) {
      this.cart = this.cart.filter((item) => item.id !== removedItem);
    },
  },
  persist: {
    storage: persistedState.cookies,
    paths: ["cart"],
  },
});

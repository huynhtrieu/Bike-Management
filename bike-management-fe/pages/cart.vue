<template>
  <common-carousel
    height="300"
    cycle
    :images="getIndexPageCarouselImage()"
  ></common-carousel>
  <v-card class="sumary mt-3">
    <v-card-item>
      <v-row>
        <v-col cols="3" class="title text-center my-auto"
          >Number of Items: <i>{{ cartStore.totalOrders }}</i></v-col
        >
        <v-col cols="3" class="title text-center my-auto"
          >Number of Orders: <i>{{ cartStore.cart.length }}</i></v-col
        >
        <v-col cols="3" class="title text-center my-auto"
          >Total: <i>{{ formatMoney(totalAmount) }}</i></v-col
        >
        <v-col cols="3" class="title text-center my-auto"
          ><v-btn
            class="sumary-btn"
            variant="tonal"
            size="large"
            prepend-icon="mdi-cash"
            @click="payAll"
            ><i>Pay</i></v-btn
          ></v-col
        >
      </v-row>
    </v-card-item>
  </v-card>
  <div class="d-flex mt-5">
    <v-row class="title text-title-font">
      <v-col cols="2"></v-col>
      <v-col cols="3">Item</v-col>
      <v-col cols="1">Price</v-col>
      <v-col cols="1">Quantity</v-col>
      <v-col cols="2" class="d-flex justify-center">Total</v-col>
      <v-col cols="3" class="d-flex justify-center">Action</v-col>
    </v-row>
  </div>
  <div v-for="(item, index) in cartStore.cart" :key="index">
    <common-cart-item :item="item"></common-cart-item>
  </div>
  <div v-if="!cartStore.cart.length" class="empty-container">
    <b>NO ITEMS IN CART</b>
  </div>
</template>
<script setup>
import { useCartStore } from "~~/store/cart";
import axios from "axios";
definePageMeta({ layout: "customer" });
const cartStore = useCartStore();
onMounted(() => {
  getAllCarts();
});
const totalAmount = computed(() =>
  cartStore.cart.reduce(
    (acc, cart) => (acc += cart.bike.price * cart.quantity),
    0
  )
);

const payAll = async () => {
  if (!cartStore.cart.length) return;
  const allCartIds = cartStore.cart.map((cartItem) => cartItem._id);
  try {
    const payload = {
      carts: allCartIds,
    };
    const response = await axios.post("payments/carts", payload);
    window.location.href = response.data.redirectLink;
  } catch (err) {}
};

const getAllCarts = async () => {
  const response = await axios.get("carts");
  cartStore.setCartState(response.data);
};
</script>
<style scoped lang="scss">
.title {
  font-size: 20px;
  font-weight: 800;
}
.sumary {
  border: solid 1px rgb(51, 17, 58);
  background-image: radial-gradient(#ffe3d8, #ffe3d8);
  .sumary-btn {
    border: solid 2px rgb(51, 17, 58);
  }
}
.text-title-font {
  font-family: "Roboto", "Roboto", monospace;
  font-style: italic;
}
.empty-container {
  margin: 20px 0 0 0;
  text-align: center;
  font-size: 25px;
  font-family: "Roboto", "Roboto", monospace;
  font-style: italic;
  padding: 10px;
  border: solid 1px grey;
  color: #4F5665;
}
</style>

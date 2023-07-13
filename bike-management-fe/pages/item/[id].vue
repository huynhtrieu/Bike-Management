<template>
  <v-dialog width="300" :model-value="isShowAddToCartSuccessful">
    <v-card color="#ddf0e2">
      <v-card-item class="text-center">
        <v-icon color="#22522f" icon="mdi-check-circle" size="100"></v-icon>
      </v-card-item>
      <v-card-title style="color: #22522f" class="text-center"
        >Add To Cart Successfully</v-card-title
      >
    </v-card>
  </v-dialog>
  <common-login-dialog
    :is-show-login-popup="isShowLoginPopup"
    @close-login-popup="(value) => (isShowLoginPopup = value)"
  ></common-login-dialog>
  <div class="item-detail-title">
    <h1><b>BIKE DETAIL</b></h1>
    <h2>
      <i>{{ item.name }}</i>
    </h2>
  </div>
  <v-row class="item-detail-main">
    <v-col cols="5">
      <v-card
        elevation="8"
        :image="item.image.length ? selectedImage : getDefaultImage()"
        width="350"
        height="300"
        class="mx-auto"
      >
      </v-card>
      <common-center-active-slide
        v-if="item.image.length"
        class="mx-auto mt-5"
        :items="item.image"
        @select-item="selectItem"
      ></common-center-active-slide>
      <v-card
        v-else
        height="117"
        class="mx-auto mt-5 ma-4 d-flex justify-center align-center"
        ><v-card-title><i>NO IMAGE AVAILABLE</i></v-card-title></v-card
      >
    </v-col>
    <v-col cols="7" class="mx-auto">
      <h2 class="text-center text-item-name">{{ item.name }}</h2>
      <div class="d-flex justify-center align-center">
        <h1 class="text-center item-price">
          {{ formatMoney(item.price) }} VND
        </h1>
        <h3
          :style="
            !item.quantity ? 'color: rgb(174, 5, 5)' : 'color: rgb(47, 150, 57)'
          "
          class="ml-5 mr-2"
        >
          {{ !item.quantity ? "SOLD OUT" : `${item.quantity} ITEMS AVAILABLE` }}
        </h3>
        <v-icon
          v-if="!item.quantity"
          color="error"
          icon="mdi-clipboard-text-off"
        ></v-icon>
      </div>
      <h2 class="mt-3 text-item-font text-item-info">
        <v-icon icon="mdi-circle-small"></v-icon>Type:
        <i v-if="!!item.bikeCategory.name" style="color: #2f3542">{{
          item.bikeCategory.name
        }}</i>
        <i v-else style="color: #2f3542"> ___</i>
      </h2>
      <h2 class="mt-2 text-item-font">
        <v-icon icon="mdi-circle-small"></v-icon>Warranty:
        <i
          v-if="!!item.information.overallInformation.warranty"
          style="color: #2f3542"
          >{{ item.information.overallInformation.warranty }}</i
        >
        <i v-else style="color: #2f3542"> ___</i>
      </h2>
      <h2 class="mt-2 text-item-font">
        <v-icon icon="mdi-circle-small"></v-icon>Origin:
        <i
          v-if="!!item.information.overallInformation.origin"
          style="color: #2f3542"
          >{{ item.information.overallInformation.origin }}</i
        >
        <i v-else style="color: #2f3542"> ___</i>
      </h2>
      <h2 class="mt-2 text-item-font">
        <v-icon icon="mdi-circle-small"></v-icon>Author:
        <i
          v-if="!!item.information.overallInformation.author"
          style="color: #2f3542"
          >{{ item.information.overallInformation.author }}</i
        >
        <i v-else style="color: #2f3542"> ___</i>
      </h2>
      <div class="d-flex justify-center align-center mt-5">
        <v-btn
          :disabled="!item.quantity"
          append-icon="mdi-cash"
          class="add-btn"
          variant="tonal"
          height="50"
          @click="buyItem"
          color="#e55039"
          ><b>BUY</b></v-btn
        >
        <v-btn
          :disabled="!item.quantity"
          append-icon="mdi-cart-plus"
          class="add-btn ml-5"
          variant="tonal"
          width="250"
          height="50"
          color="#e55039"
          @click="addToCart"
          ><b>ADD TO CART</b></v-btn
        >
        <v-btn
          class="ml-5 add-btn"
          variant="tonal"
          size="52"
          color="#2f3542"
          :disabled="quantity >= item.quantity"
          @click="quantity += 1"
          ><v-icon icon="mdi-plus-thick"></v-icon
        ></v-btn>
        <p class="quantity-input">{{ quantity }}</p>
        <v-btn
          class="add-btn"
          variant="tonal"
          size="52"
          color="#2f3542"
          @click="quantity -= 1"
          :disabled="quantity < 2"
          ><v-icon icon="mdi-minus-thick"></v-icon
        ></v-btn>
      </div>
    </v-col>
  </v-row>
  <v-divider thickness="3"></v-divider>
  <div class="px-10 py-5">
    <p class="text-h5 font-weight-bold">
      <i>Description</i
      ><v-icon icon="mdi-text" color="grey" size="30" class="ml-5"></v-icon>
    </p>
    <p class="text-h6 text-item-font" style="color: #2f3542">
      <v-icon
        icon="mdi-circle-small"
        color="#2f3542"
        size="30"
        class="ml-5"
      ></v-icon>
      {{ item.description || "__________" }}
    </p>
    <p class="text-h5 font-weight-bold mt-7">
      <i>More detail</i
      ><v-icon icon="mdi-more" color="grey" size="30" class="ml-5"></v-icon>
    </p>
    <v-table class="text-h6 text-center mt-5" style="color: #2f3542">
      <thead>
        <tr>
          <th class="text-center font-weight-bold">Height</th>
          <th class="text-center font-weight-bold">Length</th>
          <th class="text-center font-weight-bold">Width</th>
          <th class="text-center font-weight-bold">Weight</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ item.information.body.height || "___" }}</td>
          <td>{{ item.information.body.length || "___" }}</td>
          <td>{{ item.information.body.width || "___" }}</td>
          <td>{{ item.information.body.weight || "___" }}</td>
        </tr>
      </tbody>
      <thead>
        <tr>
          <th class="text-center font-weight-bold">Engine</th>
          <th class="text-center font-weight-bold">Wattage</th>
          <th class="text-center font-weight-bold">Heavy Capacity</th>
          <th class="text-center font-weight-bold">Speed</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ item.information.feature.engine || "___" }}</td>
          <td>{{ item.information.feature.wattage || "___" }}</td>
          <td>{{ item.information.feature.heavyCapacity || "___" }}</td>
          <td>{{ item.information.feature.speed || "___" }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>
<script setup>
import axios from "axios";
import { useCartStore } from "~~/store/cart";
import { useAuthStore } from "~~/store/auth";
definePageMeta({ layout: "customer" });
const authStore = useAuthStore();
const cartStore = useCartStore();
const route = useRoute();
const item = reactive({
  id: "",
  name: "",
  bikeCategory: {
    name: "",
  },
  description: "",
  information: {
    overallInformation: {
      warranty: "",
      origin: "",
      author: "",
    },
    body: {
      height: "",
      weight: "",
      length: "",
      width: "",
    },
    feature: {
      engine: "",
      wattage: "",
      speed: "",
      heavyCapacity: "",
    },
  },
  price: 0,
  quantity: 0,
  image: [],
});

const selectedImage = ref();
const isShowLoginPopup = ref(false);
const isShowAddToCartSuccessful = ref(false);
const quantity = ref(1);
onMounted(() => {
  getItembyId(route.params.id);
});

const getItembyId = async (id) => {
  const response = await axios.get(`bikes/${id}`);
  Object.assign(item, response.data);
  selectedImage.value = item.image?.[0];
};
const selectItem = (item) => {
  selectedImage.value = item;
};
const buyItem = async () => {
  if (!authStore.isUser) {
    isShowLoginPopup.value = true;
    return;
  }
  try {
    const payload = {
      bikeId: item.id,
      quantity: quantity.value.toString(),
    };
    const response = await axios.post("payments", payload);
    window.location.href = response.data.redirectLink;
  } catch (err) {}
};
const addToCart = async () => {
  if (!authStore.isUser) {
    isShowLoginPopup.value = true;
    return;
  }
  const payload = {
    bikeId: item.id,
    quantity: quantity.value,
  };
  try {
    const response = await axios.post("carts", payload);
    cartStore.setCartState(response.data.bike);
    isShowAddToCartSuccessful.value = true;
    setTimeout(() => {
      isShowAddToCartSuccessful.value = false;
    }, 1500);
  } catch (err) {}
};
</script>
<style scoped lang="scss">
.item-detail-title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: azure;
  border: solid 1px orange;
  font-family: "Roboto", "Roboto", monospace;
  width: 100%;
  height: 200px;
  padding: 30px;
  background: url(../../image/detail-background.jpeg);
}
.text-item-font {
  font-family: "Roboto", "Roboto", monospace;
  font-style: italic;
}
.item-detail-main {
  padding: 15px;
  .text-item-name {
    font-family: "Roboto", "Roboto", monospace;
    font-style: italic;
    font-size: 30px;
    font-weight: 700;
    color: #2f3542;
    text-transform: uppercase;
  }
  .item-price {
    margin-top: 10px;
    padding: 5px 20px;
    background-image: radial-gradient(#b8e994, #b8e994);
    width: fit-content;
    border-radius: 20px;
    color: rgb(46, 20, 3);
  }
}

.add-btn {
  font-size: 20px;
  border: solid 2px #e55039;
}
.quantity-input {
  text-align: center;
  padding: 2px 40px;
  font-size: 30px;
  border-top: solid 2px #e55039;
  border-bottom: solid 2px #e55039;
  color: #e55039;
  background-color: #ffece1;
}
</style>

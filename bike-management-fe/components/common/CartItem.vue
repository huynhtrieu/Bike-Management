<template>
  <v-dialog width="400" v-model="isShowConfirmDeleteCartPopup">
    <v-toolbar height="40" color="primary">
      <v-toolbar-title><i>Delete Cart</i></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="isShowConfirmDeleteCartPopup = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card>
      <v-card-title>Are you sure delete </v-card-title>

      <v-card-actions
        ><v-spacer></v-spacer
        ><v-btn size="large" @click="submitDeleteCart">YES</v-btn
        ><v-btn size="large" @click="isShowConfirmDeleteCartPopup = false"
          >NO</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-divider thickness="2" class="my-5"></v-divider>
  <v-row>
    <v-col cols="2" class="my-auto">
      <v-card>
        <v-card-item>
          <common-carousel
            :hide-delimiters="!item.bike.image?.length"
            :show-arrows="!!item.bike.image?.length"
            :images="
              item.bike?.image?.length ? item.bike.image : [getDefaultImage()]
            "
            height="150"
          ></common-carousel>
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="3" class="my-auto">
      <p class="item-name">
        {{ item.bike?.name }}
      </p>
      <p class="category-name">
        <v-icon icon="mdi-circle-small"></v-icon
        >{{ item.bike.bikeCategory?.name }}
      </p>
    </v-col>
    <v-col cols="1" class="my-auto d-flex justify-center price-text">{{
      formatMoney(item.bike.price)
    }}</v-col>
    <v-col cols="1" class="my-auto d-flex justify-center price-text">{{
      item?.quantity
    }}</v-col>
    <v-col cols="2" class="my-auto d-flex justify-center price-text total-text"
      ><b>{{ formatMoney(item.quantity * item.bike.price) }}</b></v-col
    >
    <v-col cols="3" class="my-auto cart-item-action">
      <v-btn
        prepend-icon="mdi-delete"
        variant="tonal"
        color="red"
        class="cart-item-action-btn"
        @click="isShowConfirmDeleteCartPopup = true"
        >Delete</v-btn
      >
      <v-btn
        prepend-icon="mdi-eye"
        variant="tonal"
        color="#45aaf2"
        class="cart-item-action-btn"
        @click="viewItemDetail"
        >Detail</v-btn
      >
      <v-btn
        prepend-icon="mdi-cash"
        variant="tonal"
        color="success"
        class="cart-item-action-btn"
        @click="payCart"
        >Pay</v-btn
      >
    </v-col>
  </v-row>
</template>
<script setup>
import axios from "axios";
import { useCartStore } from "~~/store/cart";
const route = useRouter();

const props = defineProps({
  item: Object,
});
const viewItemDetail = () => {
  if (props.item.bike.id) navigateTo(`/item/${props.item.bike.id}`);
};
const isShowConfirmDeleteCartPopup = ref(false);
const cartStore = useCartStore();
const payCart = async () => {
  try {
    const payload = {
      carts: [props.item._id],
    };
    const response = await axios.post("payments/carts", payload);
    window.location.href = response.data.redirectLink;
  } catch (err) {}
};
const submitDeleteCart = async () => {
  try {
    const response = await axios.delete(`carts/${props.item._id}`);
    cartStore.setCartState(response.data.bike);
    isShowConfirmDeleteCartPopup.value = false;
  } catch (err) {}
};
</script>
<style scoped>
.price-text {
  font-size: 20px;
}
.total-text {
  text-decoration: underline;
}
.category-name {
  font-size: 18px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-name {
  font-size: 18px;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.cart-item-action {
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}
.cart-item-action-btn {
  font-weight: 600;
  border: solid 1px grey;
}
.cart-item-container {
  border-bottom: 1px solid rgb(154, 147, 139, 0.4);
}
</style>

<template>
  <common-carousel
    height="300"
    cycle
    :images="getIndexPageCarouselImage()"
  ></common-carousel>
  <v-row class="mt-2">
    <v-col cols="5" class="title text-center"><i>Bike</i></v-col>
    <v-col cols="3" class="title text-center"><i>Amount</i></v-col>
    <v-col cols="3" class="title text-center"><i>Pay Date</i></v-col>
    <v-col cols="1" class="title text-center"><i>Status</i></v-col>
  </v-row>

  <div v-for="(item, index) in listPayment.data" :key="index">
    <common-payment-item :item="item"></common-payment-item>
  </div>
  <v-pagination
    v-if="!!listPayment.count"
    class="mx-auto mt-5 mb-2"
    :model-value="currentPage"
    show-first-last-page
    :length="Math.ceil(listPayment.count / paymentPerPage)"
    ellipsis="...."
    total-visible="5"
    @update:model-value="changePage"
  ></v-pagination>
  <div v-if="!listPayment.count" class="empty-container">
    <b>NO ITEMS IN HISTORY</b>
  </div>
</template>
<script setup>
import axios from "axios";
import { onMounted } from "vue";
definePageMeta({ middleware: "user-auth", layout: "customer" });

const paymentPerPage = 10;
const currentPage = ref(1);
const listPayment = reactive({
  data: [],
  count: 0,
});
onMounted(() => {
  getPaymentHistory(0);
});

const getPaymentHistory = async (offset, limit = paymentPerPage) => {
  const response = await axios.get("payments/history-payment", {
    params: { offset, limit },
  });
  listPayment.data = response.data.payments;
  listPayment.count = response.data.countPayments;
};
const changePage = (value) => {
  currentPage.value = value;
  const offset = (value - 1) * paymentPerPage;
  getPaymentHistory(offset);
};
</script>
<style scoped lang="scss">
.title {
  font-family: "Roboto", "Roboto", monospace;
  font-style: italic;
  font-weight: 600;
  font-size: 20px;
}
.empty-container {
  margin: 20px 0 0 0;
  text-align: center;
  font-size: 25px;
  font-family: "Roboto", "Roboto", monospace;
  font-style: italic;
  padding: 10px;
  border: solid 1px grey;
  color: #4f5665;
}
</style>

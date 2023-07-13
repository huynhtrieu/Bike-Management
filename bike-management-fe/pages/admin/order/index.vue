<template>
  <div class="container">
    <!-- Toolbar -->
    <div class="d-flex align-center">
      <!-- Search -->
      <v-autocomplete
        @update:search="searchOrder"
        density="comfortable"
        label="Search"
        variant="outlined"
        append-inner-icon="mdi-magnify"
        hide-details
        hide-no-data
        :custom-filter="() => {}"
      >
      </v-autocomplete>
      <v-spacer></v-spacer>
      <v-btn
        variant="tonal"
        size="default"
        append-icon="mdi-download"
        class="ml-5"
        @click="downloadOrder"
        >Download Excel</v-btn
      >
    </div>
    <!-- User Table -->
    <v-table density="comfortable" fixed-header class="order-table">
      <thead>
        <tr>
          <th><b>USER</b></th>
          <th><b>BIKE</b></th>
          <th><b>AMOUNT</b></th>
          <th><b>PAY DATE</b></th>
          <th><b>PAY STATUS</b></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(order, index) in listOrder.data" :key="index">
          <td>{{ order.user.email || "" }}</td>
          <td :class="{ 'text-error': !order?.items?.[0]?.bike?.name }">
            {{ order?.items?.[0]?.bike?.name || ">> This item is deleted <<" }}
          </td>
          <td>{{ order?.amount ? formatMoney(order?.amount) : "" }}</td>
          <td>
            {{
              order.payDate && order.payStatus === "Y"
                ? formatDate(order.payDate)
                : ""
            }}
          </td>
          <td class="text-center">{{ order.payStatus || "" }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
  <!-- Paginatiom -->
  <v-pagination
    v-if="!!listOrder.count"
    class="mx-auto mt-5 mb-2"
    color="primary"
    show-first-last-page
    :length="Math.ceil(listOrder.count / orderPerPage)"
    ellipsis="...."
    total-visible="5"
    @update:model-value="changePage"
  ></v-pagination>
</template>
<script setup>
import axios from "axios";
import moment from "moment";
definePageMeta({ layout: "admin" });

const orderPerPage = 10;
const listOrder = reactive({
  data: [],
  count: 0,
});

onMounted(() => {
  getAllOrder(0);
});

// Function
const getAllOrder = async (offset, limit = orderPerPage) => {
  const response = await axios.get("payments", {
    params: { offset, limit },
  });
  listOrder.count = response.data.countPayments;
  listOrder.data = response.data.payments;
};
const changePage = (value) => {
  const offset = (value - 1) * orderPerPage;
  getAllOrder(offset);
};

const downloadOrder = async () => {
  const response = await axios.get("payments/download", {
    responseType: "blob",
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement("a");
  a.href = url;
  a.download = `PAYMENT_${moment().toISOString()}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
</script>

<style lang="scss" scoped>
.container {
  padding: 20px;
}
.order-table {
  overflow: auto;
  max-height: 100vh;
  margin-top: 20px;
  td,
  th {
    border: 1px solid rgb(229, 227, 227);
  }
}
.loading {
  position: fixed;
  width: 100%;
}
.text-error {
  color: rgb(130, 37, 37);
}
</style>

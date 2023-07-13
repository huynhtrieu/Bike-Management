<template>
  <v-divider thickness="2" class="my-5"></v-divider>
  <v-row>
    <v-col cols="2" class="my-auto">
      <v-card>
        <v-card-item>
          <common-carousel
            :hide-delimiters="!props.item.items[0].bike?.image?.length"
            :show-arrows="!!props.item?.item?.[0]?.bike?.image?.length"
            :images="
              props.item?.items?.[0]?.bike?.image?.length
                ? props.item?.items?.[0]?.bike?.image
                : [getDefaultImage()]
            "
            height="150"
          ></common-carousel>
        </v-card-item>
      </v-card>
    </v-col>
    <v-col cols="3" class="my-auto">
      <p
        :class="[
          'item-name',
          { 'text-error': !props.item?.items?.[0].bike?.name },
        ]"
      >
        {{ props.item?.items?.[0].bike?.name || ">> This item is deleted <<" }}
      </p>
    </v-col>
    <v-col cols="3" class="my-auto d-flex justify-center price-text"
      >{{ amountText }} &nbsp;<b class="total-text">{{
        props.item.amount ? formatMoney(props.item.amount) : ""
      }}</b>
    </v-col>

    <v-col
      cols="3"
      class="my-auto d-flex price-text justify-center font-weight-medium"
    >
      {{ formattedPayDate }}</v-col
    >
    <v-col
      cols="1"
      class="my-auto d-flex price-text justify-center font-weight-bold"
    >
      {{ props.item.payStatus }}</v-col
    >
  </v-row>
</template>
<script setup>
import moment from "moment";
const props = defineProps({
  item: Object,
});
const amountText = computed(() =>
  props?.item?.amount && props?.item?.items?.[0]?.bike?.price
    ? `${formatMoney(props.item?.items?.[0]?.bike?.price)} x ${
        props.item.amount / props.item.items[0].bike.price
      } = `
    : ""
);
const formattedPayDate = computed(() =>
  props?.item?.payDate && props?.item?.payStatus === "Y"
    ? formatDate(props?.item?.payDate)
    : ""
);
</script>
<style scoped>
.price-text {
  font-size: 20px;
}
.total-text {
  text-decoration: underline;
}
.category-name {
  font-size: 16px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-name {
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.text-error {
  color: rgb(130, 37, 37) !important;
}
</style>

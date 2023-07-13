<template>
  <v-menu v-model="menu">
    <template v-slot:activator="{ props }">
      <v-text-field
        readonly
        v-model="displayedDate"
        :label="datePickerProps.label || 'Date of Birth'"
        v-bind="props"
      ></v-text-field>
    </template>
    <vue-date-picker
      v-model:model-value="datePickerProps.date"
      inline
      :month-change-on-scroll="false"
      auto-apply
      :enable-time-picker="false"
      @update:model-value="updateDate"
    />
  </v-menu>
</template>
<script setup>
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import moment from "moment";
const emit = defineEmits(["update"]);
const datePickerProps = defineProps({
  date: String,
  label: String,
});
const menu = ref(false);
const displayedDate = computed(() =>
  moment(datePickerProps.date).format("DD-MM-YYYY")
);
const updateDate = (value) => {
  emit("update", value);
};
</script>
<style scoped></style>

<template>
  <common-carousel
    height="300"
    cycle
    :images="getIndexPageCarouselImage()"
  ></common-carousel>
  <v-divider thickness="2" class="mt-12 mb-5"></v-divider>
  <div class="container">
    <h1 class="container-title">
      <v-icon icon="mdi-motorbike-electric" class="mr-5"></v-icon>Best selling
    </h1>
    <div v-if="!!listBestSaleItems.data.length" class="container-slides">
      <div
        class="container-slide-item"
        v-for="(item, indx) in listBestSaleItems.data"
        :key="indx"
      >
        <common-item :item="item"></common-item>
      </div>
    </div>
    <div class="empty-container" v-else><b>NO BIKE AVAILABLE</b></div>
  </div>

  <v-divider thickness="2" class="my-12"></v-divider>

  <v-chip-group
    class="category-filter"
    mandatory
    @update:model-value="selectCategory"
  >
    <v-chip
      v-for="category in [
        'All',
        ...categoryStore.category.map((ca) => ca.name),
      ]"
      class="category-filter-item"
      :class="selectedCategory === category && 'category-filter-item__selected'"
      :key="category"
      :value="category"
    >
      <v-icon start icon="mdi-motorbike"></v-icon>

      <b>{{ category }}</b>
    </v-chip>
  </v-chip-group>
  <v-divider thickness="2"></v-divider>
  <div class="filter-bar">
    <b>Price:</b>
    <v-app class="range-slider">
      <div class="range-slider-card">
        <v-range-slider
          v-model="priceRange"
          hide-details
          min="0"
          max="100000000"
          step="10000000"
        ></v-range-slider>
      </div>
      <b class="text-center">{{ priceFilterText }}</b>
    </v-app>
    <v-btn
      style="border: 2px solid; height: 70%"
      variant="outlined"
      size="large"
      color="#4f5665"
      @click="filterPrice"
      ><v-icon size="x-large" icon="mdi-magnify" color="#4f5665"></v-icon
    ></v-btn>
  </div>

  <v-row class="main-container" v-if="listItems.count > 0">
    <v-col cols="4" v-for="(item, indx) in listItems.data" :key="indx"
      ><common-item :item="item"></common-item
    ></v-col>
  </v-row>
  <div class="empty-container" v-else><b>NO BIKE AVAILABLE</b></div>
  <v-pagination
    v-if="!!listItems.count"
    class="mx-auto mt-5 mb-2"
    color="#4F5665"
    :model-value="currentPage"
    show-first-last-page
    :length="Math.ceil(listItems.count / itemPerPage)"
    ellipsis="...."
    total-visible="5"
    @update:model-value="changePage"
  ></v-pagination>
</template>

<script setup>
import axios from "axios";
import { useCategoryStore } from "~~/store/category";
import { isEqual } from "lodash";
definePageMeta({ layout: "customer" });
const categoryStore = useCategoryStore();
const itemPerPage = 6;
const listBestSaleItems = reactive({
  data: [],
});
const listItems = reactive({
  data: [],
  count: 0,
});
const currentPage = ref(1);
const priceRange = ref([0, 0]);
const selectedCategory = ref("All");
const initialFilter = { categories: [], price: null };
const filter = reactive({ ...initialFilter });

onMounted(() => {
  getAllItems(0);
  getBestSaleItem();
  getAllCategories();
});

const priceFilterText = computed(() => {
  if (priceRange.value[0] === priceRange.value[1]) {
    if (priceRange.value[1] === 100000000) {
      return "Over 100.000.000 (VND)";
    }
    if (priceRange.value[1] === 0) {
      return "All price (VND)";
    }
  }
  return `${formatMoney(priceRange.value[0])} - ${formatMoney(
    priceRange.value[1]
  )} (VND)`;
});

// Function
const getBestSaleItem = async () => {
  try {
    const response = await axios.get("payments/best-sellers");
    listBestSaleItems.data = response.data;
  } catch (error) {
    console.log(error);
  }
};
const getAllItemsWithFilter = async (offset, limit = itemPerPage) => {
  try {
    let priceCond;
    if (
      priceRange.value[0] === priceRange.value[1] &&
      priceRange.value[1] === 0
    ) {
      priceCond = undefined;
    } else if (
      priceRange.value[0] === priceRange.value[1] &&
      priceRange.value[1] === 100000000
    ) {
      priceCond = [100000000, 9999999999999].join(",");
    } else {
      priceCond = priceRange.value.join(",");
    }
    const categoriesCond = filter.categories.join(",") || undefined;
    const response = await axios.get("bikes/search", {
      params: {
        price: priceCond,
        categoryName: categoriesCond,
        offset,
        limit,
      },
    });
    listItems.data = response.data.bikes;
    listItems.count = response.data.countBikes;
  } catch (err) {
    console.log(err);
  }
};
const getAllCategories = async () => {
  try {
    const categoryStore = useCategoryStore();
    const response = await axios.get("categories");
    categoryStore.setCategoryState(response.data);
  } catch (err) {
    console.log(err);
  }
};
const getAllItems = async (offset, limit = itemPerPage) => {
  const response = await axios.get("bikes", {
    params: { offset, limit },
  });
  listItems.data = response.data.bikes;
  listItems.count = response.data.countBikes;
};

const selectCategory = (category) => {
  selectedCategory.value = category;
  filter.categories = category === "All" ? [] : [category];
  getAllItemsWithFilter(0);
};

const filterPrice = () => {
  currentPage.value = 1;
  getAllItemsWithFilter(0);
};

const changePage = (value) => {
  currentPage.value = value;
  const offset = (value - 1) * itemPerPage;
  if (isEqual(initialFilter, filter)) {
    getAllItems(offset);
    return;
  }
  getAllItemsWithFilter(offset);
};
</script>
<style scoped lang="scss">
.carousel {
  height: 300px;
}

.empty-container {
  text-align: center;
  font-size: 25px;
  font-family: " Console", "Roboto", monospace;
  font-style: italic;
  background-image: radial-gradient(#ffe3d8, #ffe3d8);
  padding: 10px;
  border-radius: 10px;
  color: #4f5665;
}

.container {
  .container-title {
    margin-bottom: 5px;
    font-family: "Roboto", "Roboto", monospace;
    font-style: italic;
    cursor: pointer;
    color: #4f5665;
  }
  .container-slides {
    display: grid;
    grid-auto-flow: column;
    gap: 20px;
    overflow-y: auto;
    overscroll-behavior-x: contain;
    scroll-snap-type: x mandatory;
    border-radius: 10px;
    scrollbar-width: none;
    box-shadow: 0px 20px 20px 0px rgba(122, 122, 122, 0.5);
    padding: 20px;
    background-image: radial-gradient(#f8efba, #ffe3d8);
    .container-slide-item {
      width: 300px;
    }
  }
  .container-slides::-webkit-scrollbar {
    display: none;
  }
}
.main-container {
  padding: 10px;
  border-radius: 10px;
  background-image: radial-gradient(#f8efba, #ffe3d8);
}

.category-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px;
  gap: 10px;
  .category-filter-item {
    text-transform: uppercase;
    background-color: white;
    border: #4f5665 solid 2px;
    border-radius: 10px;
    color: #4f5665;
    font-family: "Roboto", "Roboto", monospace;
    font-style: italic;
    font-size: 25px;
    &__selected {
      background-color: #4f5665;
      color: #f6eaf7;
    }
    &:hover {
      box-shadow: 5px 5px 5px 5px rgba(0, 0, 0, 0.5);
      transform: translateX(-5px) translateY(-5px);
    }
  }
}
:deep(.v-application__wrap) {
  min-height: 0px;
}
.filter-bar {
  height: 70px;
  display: flex;
  gap: 10px;
  font-size: 25px;
  font-style: italic;
  font-family: "Lucida Console", "Courier New", monospace;
  margin: 10px 0px 20px 0px;

  .range-slider {
    max-height: 100px;
    min-height: 0 !important;
    .range-slider-card {
      height: 30px;
    }
  }
}
</style>

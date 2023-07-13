<template>
  <div class="container">
    <div class="toolbar">
      <!-- Search -->
      <v-autocomplete
        single-line
        @update:search="searchItem"
        item-value="name"
        item-title="name"
        class="toolbar__search-input"
        label="Search"
        append-inner-icon="mdi-magnify"
        variant="outlined"
        hide-no-data
        hide-details
        :items="search.searchedList"
      >
        <template v-slot:item="{ props, item }">
          <v-list-item
            class="mt-2"
            v-bind="props"
            :prepend-avatar="item?.raw?.image?.[0] || getDefaultImage()"
            :title="item?.raw.name"
            :subtitle="item?.raw?.bikeCategory?.name || ''"
            @click="navigateTo(`/admin/item/${item.raw.id}`)"
          >
          </v-list-item>
        </template>
      </v-autocomplete>
      <!--  -->
      <v-spacer></v-spacer>

      <div>
        <!-- Filter Panel -->
        <v-menu
          location="bottom"
          v-model="isShowMenu"
          persistent
          :close-on-content-click="false"
          class="toolbar__filter-panel"
        >
          <template v-slot:activator="{ props }">
            <v-btn append-icon="mdi-filter" elevation="6" v-bind="props"
              >Filter</v-btn
            >
          </template>
          <v-card max-height="400" max-width="300" min-width="300">
            <v-list>
              <v-list-item
                prepend-icon="mdi-filter-cog"
                append-icon="mdi-filter-cog"
                class="text-center"
                title="FILTER PANEL"
              >
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-list-item>
                <v-autocomplete
                  v-model="filter.categories"
                  density="comfortable"
                  clearable
                  chips
                  label="Categories"
                  :items="categoryStore.category.map((item) => item.name)"
                  multiple
                ></v-autocomplete>
              </v-list-item>
              <v-list-item>
                <v-select
                  v-model="filter.price"
                  density="comfortable"
                  clearable
                  :chips="!!filter.price"
                  label="Price"
                  :items="Object.keys(priceRange)"
                ></v-select>
              </v-list-item>
            </v-list>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="cancelFilter"> Cancel </v-btn>
              <v-btn color="primary" variant="text" @click="filterItem">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>

        <!-- Category Management Modal-->
        <v-dialog
          v-model="isShowCategoryModal"
          width="800"
          class="category-modal"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              append-icon="mdi-archive-cog"
              elevation="6"
              class="ml-5"
              v-bind="props"
              >Category</v-btn
            >
          </template>
          <v-toolbar color="primary" height="40">
            <v-toolbar-title>CATEGORY</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon dark @click="isShowCategoryModal = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card>
            <v-card-item class="pb-3">
              <v-row>
                <v-col cols="6">
                  <v-form ref="addNewCategoryForm" class="px-3">
                    <v-text-field
                      v-model="newCategory.name"
                      label="New Category"
                      :rules="[notEmpty]"
                    ></v-text-field>
                    <v-btn
                      block
                      class="mb-5 mt-2"
                      size="large"
                      elevation="8"
                      append-icon="mdi-plus-thick"
                      @click="submitAddCategory"
                      >Add</v-btn
                    >
                    <v-dialog v-model="isShowDeleteCategoryModal" width="500">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          block
                          class="mb-5"
                          :disabled="!selectedCategory"
                          size="large"
                          elevation="8"
                          append-icon="mdi-minus-thick"
                          v-bind="props"
                          >Delete</v-btn
                        >
                      </template>
                      <v-toolbar height="40" color="primary">
                        <v-toolbar-title
                          ><i>Delete category</i></v-toolbar-title
                        >
                        <v-spacer></v-spacer>
                        <v-btn
                          icon
                          dark
                          @click="isShowDeleteCategoryModal = false"
                        >
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </v-toolbar>
                      <v-card>
                        <v-card-title
                          >Do you want to delete
                          <b
                            ><i>{{ selectedCategory?.name }} </i></b
                          >.
                          <p>All items in this category will be deleted.</p>
                        </v-card-title>

                        <v-card-actions
                          ><v-spacer></v-spacer
                          ><v-btn size="large" @click="deleteCategory"
                            >YES</v-btn
                          ><v-btn
                            size="large"
                            @click="isShowDeleteCategoryModal = false"
                            >NO</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-form>
                  <v-slide-x-transition>
                    <v-alert
                      v-bind:model-value="alertNotification.isShow"
                      closable
                      :type="alertNotification.type"
                      :text="alertNotification.text"
                      density="compact"
                    ></v-alert>
                  </v-slide-x-transition>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    :model-value="searchCategoryKeyword"
                    class="list-categories__search-input"
                    label="Search"
                    hide-details
                    append-inner-icon="mdi-magnify"
                    @update:model-value="searchCategory"
                  ></v-text-field>
                  <v-list
                    class="list-categories pt-0 pb-0"
                    elevation="8"
                    @update:selected="selectCategory"
                  >
                    <v-divider></v-divider>
                    <v-list-item
                      v-for="(category, i) in categoryStore.category.filter(
                        (category) =>
                          category.name.includes(searchCategoryKeyword)
                      )"
                      :key="i"
                      :value="category"
                      active-color="primary"
                    >
                      <v-list-item-title>{{ category.name }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>
            </v-card-item>
            <v-progress-linear
              v-if="loading"
              indeterminate
              color="primary"
            ></v-progress-linear>
          </v-card>
        </v-dialog>

        <!-- Add Item Modal -->
        <v-dialog
          v-model="isShowAddItemModal"
          width="1024"
          @update:model-value="resetAddItemForm"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              append-icon="mdi-plus-thick"
              elevation="8"
              class="ml-5"
              v-bind="props"
              >Add item</v-btn
            >
          </template>
          <v-card>
            <v-card>
              <v-toolbar color="primary">
                <v-toolbar-title>ADD ITEM</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon dark @click="isShowAddItemModal = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-form ref="addNewItemForm">
                <v-card-item>
                  <v-row>
                    <v-col cols="6">
                      <common-carousel
                        :hide-delimiters="!previewImages?.length"
                        :show-arrows="!!previewImages?.length"
                        :images="
                          previewImages?.length
                            ? previewImages
                            : [getDefaultImage()]
                        "
                      ></common-carousel>
                      <v-divider></v-divider>
                      <v-file-input
                        v-model="newItem.file"
                        accept="image/png, image/jpeg, image/bmp, image/jpg"
                        append-inner-icon="mdi-image-area"
                        class="mt-5"
                        @update:model-value="getItemImage"
                        multiple
                        chips
                        show-size
                        label="File input"
                        :rules="[notEmpty]"
                      ></v-file-input>
                    </v-col>
                    <v-col cols="6" class="">
                      <v-text-field
                        append-inner-icon="mdi-rename"
                        v-model="newItem.name"
                        label="Item Name"
                        :rules="[notEmpty]"
                      ></v-text-field>
                      <v-select
                        v-model="newItem.categoryName"
                        append-inner-icon="mdi-text-box-multiple"
                        label="Categories"
                        :rules="[notEmpty]"
                        :items="
                          categoryStore.category.map(
                            (category) => category.name
                          )
                        "
                      ></v-select>
                      <v-text-field
                        type="number"
                        v-model="newItem.price"
                        append-inner-icon="mdi-cash"
                        label="Price"
                        :rules="[notEmpty, positiveNumber]"
                      ></v-text-field>
                      <v-text-field
                        type="number"
                        v-model="newItem.quantity"
                        append-inner-icon="mdi-store-search"
                        label="Quantity"
                        :rules="[notEmpty, positiveNumber]"
                      ></v-text-field>
                      <v-divider thickness="1"></v-divider>
                      <v-btn
                        size="x-large"
                        block
                        class="mt-2"
                        @click="submitAddItem"
                        >Submit</v-btn
                      >
                    </v-col>
                  </v-row>
                  <v-slide-x-transition>
                    <v-alert
                      v-bind:model-value="alertNotification.isShow"
                      closable
                      :type="alertNotification.type"
                      :text="alertNotification.text"
                      density="compact"
                    ></v-alert>
                  </v-slide-x-transition>
                </v-card-item>
              </v-form>
              <v-progress-linear
                v-if="loading"
                indeterminate
                color="primary"
              ></v-progress-linear>
            </v-card>
          </v-card>
        </v-dialog>
      </div>
      <!--  -->
    </div>
    <!--  -->
    <v-divider></v-divider>

    <!-- Layout -->
    <v-row align-content="space-evenly" class="px-5">
      <v-col cols="3" v-for="(item, indx) in listItems.data" :key="indx">
        <v-card class="card">
          <v-card-item class="card__card-item">
            <common-carousel
              :hide-delimiters="!item.image?.length"
              :show-arrows="!!item.image?.length"
              :images="item.image?.length ? item.image : [getDefaultImage()]"
            ></common-carousel>
          </v-card-item>
          <v-card-title class="text-center mb-0 py-0"
            ><i>{{ item.name }}</i></v-card-title
          >
          <h3 class="text-center">{{ formatMoney(item.price) }} VND</h3>

          <v-card-subtitle class="mb-2 mt-1"
            ><i><b>Type:</b></i> {{ item.bikeCategory.name }}</v-card-subtitle
          >
          <v-card-subtitle
            ><i><b>Quantity:</b></i> {{ item.quantity }}</v-card-subtitle
          >
          <v-divider></v-divider>
          <v-card-actions
            ><v-spacer></v-spacer
            ><nuxt-link class="mr-3" :to="`/admin/item/${item.id}`"
              ><i>More detail</i></nuxt-link
            ></v-card-actions
          >
        </v-card>
      </v-col>
    </v-row>
    <!--  -->

    <!-- Pagination -->
    <v-pagination
      v-if="!!listItems.count"
      class="pagination mt-5 mb-2"
      color="primary"
      :model-value="currentPage"
      show-first-last-page
      :length="Math.ceil(listItems.count / itemPerPage)"
      ellipsis="...."
      total-visible="5"
      @update:model-value="changePage"
    ></v-pagination>
    <!--  -->
  </div>
</template>

<script setup>
import axios from "axios";
import { isEqual } from "lodash";
import usePreviewFile from "@/composables/usePreviewFile";
import { useCategoryStore } from "~~/store/category";
import { PRICE_RANGE } from "~~/constant";
definePageMeta({ layout: "admin" });

const initialNewItem = {
  file: [],
  name: null,
  categoryName: null,
  price: null,
  quantity: null,
};
const initialNewCategory = {
  name: null,
};
const initialFilter = { categories: [], price: null };
const itemPerPage = 8;
const priceRange = PRICE_RANGE;
const isShowMenu = ref(false);
const listItems = reactive({
  data: [],
  count: 0,
});
const categoryStore = useCategoryStore();
const filter = reactive({ ...initialFilter });
const newItem = reactive({
  ...initialNewItem,
});
const newCategory = reactive({
  ...initialNewCategory,
});
const selectedCategory = ref();
const currentPage = ref(1);
const isShowAddItemModal = ref(false);
const isShowCategoryModal = ref(false);
const isShowDeleteCategoryModal = ref(false);
const previewImages = ref([]);
const search = reactive({
  keyWord: "",
  searchedList: [],
});
const searchCategoryKeyword = ref("");
const addNewItemForm = ref(null);
const addNewCategoryForm = ref(null);
const loading = ref(false);
const alertNotification = reactive({
  isShow: false,
  type: "success",
  text: "Add Item Successfully",
});

// onMouted
onMounted(() => {
  getAllCategories();
  getAllItems(0);
});

// Computed

// Function
const searchCategory = (keyword) => {
  searchCategoryKeyword.value = keyword;
};
const selectCategory = (item) => {
  selectedCategory.value = item.length ? item[0] : null;
};

const deleteCategory = async () => {
  isShowDeleteCategoryModal.value = false;

  loading.value = true;
  try {
    await axios.delete(`categories/${selectedCategory.value.id}`);
    const response = await axios.get("categories");
    categoryStore.setCategoryState(response.data);
    filter.categories = filter.categories.filter(
      (category) => category !== selectedCategory.value.name
    );
    const offset = (currentPage.value - 1) * itemPerPage;
    getAllItemsWithFilter(offset);
  } catch (err) {
    const errorMessage = err?.response?.data?.message;
    showTimeoutAlertNotification({ text: errorMessage, type: "error" });
  } finally {
    loading.value = false;

    selectedCategory.value = null;
  }
};

const submitAddCategory = async () => {
  const { valid } = await addNewCategoryForm.value.validate();
  if (!valid) return;
  loading.value = true;
  try {
    await axios.post("categories", newCategory);
    addNewCategoryForm.value.reset();
    const response = await axios.get("categories");
    categoryStore.setCategoryState(response.data);
    showTimeoutAlertNotification({
      text: "Add Successfully",
      type: "success",
    });
  } catch (err) {
    const errorMessage = err?.response?.data?.message;
    showTimeoutAlertNotification({ text: errorMessage, type: "error" });
  } finally {
    loading.value = false;
  }
};

const searchItem = useDebounce(async (keyword) => {
  if (keyword.length < 2) {
    search.searchedList = [];
    return;
  }
  const response = await axios.get("bikes/search", {
    params: {
      search: keyword,
    },
  });
  search.searchedList = response.data?.bikes || [];
}, 300);

const changePage = (value) => {
  currentPage.value = value;
  const offset = (value - 1) * itemPerPage;
  if (isEqual(initialFilter, filter)) getAllItems(offset);
  else getAllItemsWithFilter(offset);
};

const getAllCategories = async () => {
  const categoryStore = useCategoryStore();
  const response = await axios.get("categories");
  categoryStore.setCategoryState(response.data);
};

const getAllItems = async (offset, limit = itemPerPage) => {
  const response = await axios.get("bikes", {
    params: { offset, limit },
  });
  listItems.data = response.data.bikes;
  listItems.count = response.data.countBikes;
};
const getAllItemsWithFilter = async (offset, limit = itemPerPage) => {
  const priceCond = priceRange?.[filter.price];
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
};
const filterItem = () => {
  getAllItemsWithFilter(0);
  isShowMenu.value = false;
};
const cancelFilter = () => {
  isShowMenu.value = false;
  Object.assign(filter, initialFilter);
  getAllItems(0);
};
const getItemImage = (images) => {
  previewImages.value = usePreviewFile(images);
};

const resetAddItemForm = () => {
  addNewItemForm.value?.reset();
  previewImages.value = [];
};

const showTimeoutAlertNotification = (alertConfig = null) => {
  Object.assign(alertNotification, { ...alertConfig, isShow: true });
  setTimeout(() => {
    alertNotification.isShow = false;
  }, 3000);
};

const submitAddItem = async () => {
  const { valid } = await addNewItemForm.value.validate();
  if (!valid) return;
  loading.value = true;
  try {
    const formData = new FormData();
    Object.keys(newItem).forEach((key) => {
      if (Array.isArray(newItem[key])) {
        newItem[key].forEach((item) => {
          formData.append(key, item);
        });
        return;
      }
      formData.append(key, newItem[key]);
    });
    await axios.post("bikes", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    Object.assign(filter, initialFilter);
    resetAddItemForm();
    showTimeoutAlertNotification({
      text: "Add Item Successfully",
      type: "success",
    });
    const offset = (currentPage.value - 1) * itemPerPage;
    getAllItems(offset);
  } catch (err) {
    const errorMessage = err?.response?.data?.message;
    showTimeoutAlertNotification({ text: errorMessage, type: "error" });
  } finally {
    loading.value = false;
  }
};
</script>
<style lang="scss" scoped>
.toolbar {
  padding: 10px 20px;
  display: flex;
  align-items: center;
}
.list-categories {
  max-height: 200px;
  margin: 10px;
}
.category-modal {
  ::v-deep(.v-overlay__content) {
    top: 200px;
  }
}
</style>

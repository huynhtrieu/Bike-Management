<template>
  <v-dialog width="300" :model-value="alertNotification.isShow">
    <v-slide-x-transition>
      <v-alert
        class="text-h6"
        block
        v-bind:model-value="alertNotification.isShow"
        :type="alertNotification.type"
        :text="alertNotification.text"
        density="compact"
      ></v-alert>
    </v-slide-x-transition>
  </v-dialog>
  <v-card class="container">
    <v-toolbar height="fit-content">
      <v-toolbar-title class="text-center">
        <h2>
          <b
            ><i>{{ itemTitle }}</i></b
          >
        </h2>
      </v-toolbar-title>

      <v-badge :content="isEditable ? 'edit' : 'view'" location="left">
        <v-btn variant="plain" icon @click="isEditable = !isEditable">
          <v-icon
            size="22"
            :icon="isEditable ? 'mdi-pencil-outline' : 'mdi-pencil-lock'"
          ></v-icon>
        </v-btn>
      </v-badge>
      <!-- Delete item popup -->
      <v-dialog v-model="isShowDeleteItemModal" width="600">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="plain"
            icon
            class="ml-3"
            v-bind="props"
            @click="isShowDeleteItemModal = true"
          >
            <v-icon size="22" icon="mdi-delete"></v-icon>
          </v-btn>
        </template>
        <v-form ref="deleteForm" validate-on="submit">
          <v-card>
            <v-toolbar color="primary" height="40">
              <v-toolbar-title>DELETE ITEM</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon dark @click="isShowDeleteItemModal = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-item>
              <v-label class="mb-3"
                ><b><i>INPUT ITEM NAME TO DELETE:</i></b></v-label
              >
              <v-text-field
                :rules="[notEqual(item.name)]"
                density="compact"
              ></v-text-field>
            </v-card-item>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn class="mr-5" @click="submitDeleteItem"
                ><b>Delete</b></v-btn
              >
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-toolbar>
    <v-form ref="form" :disabled="!isEditable">
      <v-spacer></v-spacer>
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-linear>
      <v-card-item>
        <v-row>
          <v-col cols="6" align-self="stretch">
            <v-card>
              <v-divider></v-divider>
              <v-card-item>
                <v-card
                  elevation="8"
                  :image="
                    allViewedImage.length ? selectedImage : getDefaultImage()
                  "
                  width="400"
                  height="400"
                  class="mx-auto"
                >
                  <v-card-item v-if="isEditable" class="text-end"
                    ><v-btn
                      v-if="allViewedImage.length"
                      elevation="0"
                      icon
                      dark
                      size="30"
                      @click="removeImage"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn></v-card-item
                  >
                </v-card>
                <common-center-active-slide
                  v-if="allViewedImage.length"
                  class="mx-auto mt-5"
                  :items="allViewedImage"
                  @select-item="selectItem"
                ></common-center-active-slide>
                <v-card
                  height="117"
                  class="mx-auto mt-5 ma-4 d-flex justify-center align-center"
                  v-else
                  ><v-card-title
                    ><i>NO IMAGE AVAILABLE</i></v-card-title
                  ></v-card
                >
              </v-card-item>
              <v-divider thickness="1.5"></v-divider>
              <v-card-actions>
                <v-file-input
                  v-model="item.file"
                  accept="image/png, image/jpeg, image/bmp, image/jpg"
                  append-inner-icon="mdi-image-area"
                  class="mt-5"
                  @update:model-value="updateImage"
                  multiple
                  chips
                  show-size
                  label="File input"
                ></v-file-input>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="6">
            <v-text-field
              append-inner-icon="mdi-rename"
              v-model="item.name"
              label="Item Name"
              :rules="[notEmpty]"
            ></v-text-field>
            <v-select
              v-model="item.bikeCategory.name"
              append-inner-icon="mdi-text-box-multiple"
              label="Categories"
              :rules="[notEmpty]"
              :items="categoryStore.category.map((category) => category.name)"
            ></v-select>
            <v-text-field
              type="number"
              :model-value="item.price"
              append-inner-icon="mdi-cash"
              label="Price"
              :rules="[notEmpty, positiveNumber]"
            ></v-text-field>
            <v-text-field
              type="number"
              v-model="item.quantity"
              append-inner-icon="mdi-store-search"
              label="Quantity"
              :rules="[notEmpty, positiveNumber]"
            ></v-text-field>
            <v-text-field
              v-model="item.information.overallInformation.warranty"
              append-inner-icon="mdi-security"
              label="Warranty"
            ></v-text-field>
            <v-text-field
              v-model="item.information.overallInformation.origin"
              append-inner-icon="mdi-origin"
              label="Origin"
            ></v-text-field>
            <v-text-field
              v-model="item.information.overallInformation.author"
              append-inner-icon="mdi-domain"
              label="Author"
            ></v-text-field>
            <v-divider></v-divider>
            <v-btn
              :disabled="!isEditable"
              elevation="8"
              size="x-large"
              block
              @click="submitUpdateItem"
              class="mt-5 mb-5"
              >Submit</v-btn
            >
            <v-btn
              elevation="8"
              prepend-icon="mdi-arrow-left"
              size="x-large"
              block
              @click="navigateTo('/admin/item')"
              class="mt-5 mb-5"
              >Back</v-btn
            >
          </v-col>
        </v-row>
        <v-expansion-panels class="item-detail elevation-10">
          <v-expansion-panel @group:selected="toggleItemDetailExpansion">
            <v-expansion-panel-title class="text-h6 font-weight-bold"
              ><i>Description</i
              ><v-icon
                icon="mdi-text"
                color="grey"
                size="30"
                class="ml-5"
              ></v-icon
            ></v-expansion-panel-title>
            <v-expansion-panel-text class="pt-5" ref="detailExpansion">
              <v-textarea
                label="Description"
                v-model="item.description"
              ></v-textarea>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-expansion-panels class="item-detail elevation-10">
          <v-expansion-panel @group:selected="toggleItemDetailExpansion">
            <v-expansion-panel-title class="text-h6 font-weight-bold"
              ><i>More detail</i
              ><v-icon
                icon="mdi-more"
                color="grey"
                size="30"
                class="ml-5"
              ></v-icon
            ></v-expansion-panel-title>
            <v-expansion-panel-text class="pt-5" ref="detailExpansion">
              <v-row>
                <v-col cols="3"
                  ><v-text-field
                    v-model="item.information.body.height"
                    label="Height"
                    hide-details
                  ></v-text-field
                ></v-col>
                <v-col cols="3"
                  ><v-text-field
                    v-model="item.information.body.length"
                    label="Lenght"
                    hide-details
                  ></v-text-field
                ></v-col>
                <v-col cols="3"
                  ><v-text-field
                    v-model="item.information.body.width"
                    label="Width"
                    hide-details
                  ></v-text-field
                ></v-col>
                <v-col cols="3"
                  ><v-text-field
                    v-model="item.information.body.weight"
                    label="Weight"
                    hide-details
                  ></v-text-field
                ></v-col>
              </v-row>
              <v-row>
                <v-col cols="3"
                  ><v-text-field
                    v-model="item.information.feature.engine"
                    label="Engine"
                  ></v-text-field
                ></v-col>
                <v-col cols="3"
                  ><v-text-field
                    v-model="item.information.feature.wattage"
                    label="Wattage"
                  ></v-text-field
                ></v-col>
                <v-col cols="3"
                  ><v-text-field
                    v-model="item.information.feature.speed"
                    label="Speed"
                  ></v-text-field
                ></v-col>
                <v-col cols="3"
                  ><v-text-field
                    v-model="item.information.feature.heavyCapacity"
                    label="Heavy Capacity"
                  ></v-text-field
                ></v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-item>
    </v-form>
  </v-card>
</template>

<script setup>
import { isEqual, cloneDeep } from "lodash";
import axios from "axios";
import { useCategoryStore } from "~~/store/category";
import { ref } from "vue";
import getDefaultImage from "~~/utils/getDefaultImage";

const categoryStore = useCategoryStore();
let initialItem = {};
const item = reactive({
  id: "",
  name: "",
  bikeCategory: {
    name: "",
  },
  price: 0,
  quantity: 0,
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
  image: [],
  file: [],
  newImages: [],
});
const selectedImage = ref();
const route = useRoute();
const alertNotification = reactive({
  isShow: false,
  type: "success",
  text: "Edit Item Successfully",
});
const isShowDeleteItemModal = ref(false);
const loading = ref(false);
const isEditable = ref(false);
const deleteForm = ref(null);
const form = ref(null);
const detailExpansion = ref(null);

onMounted(async () => {
  await getItembyId(route.params.id);
});

// Computed
const allViewedImage = computed(() => [...item.image, ...item.newImages]);
const itemTitle = computed(() => `${item.name} (${item.bikeCategory.name})`);

// Function
const removeImage = () => {
  if (!allViewedImage.value.length) return;

  // Remove current image
  const delCurrentImageIndx = item.image.findIndex(
    (img) => img === selectedImage.value
  );
  if (delCurrentImageIndx !== -1) item.image.splice(delCurrentImageIndx, 1);

  // Remove new Image
  const delNewImageIndx = item.newImages.findIndex(
    (img) => img === selectedImage.value
  );
  if (delNewImageIndx !== -1) {
    item.newImages.splice(delNewImageIndx, 1);
    item.file.splice(delNewImageIndx, 1);
  }

  selectedImage.value = allViewedImage.value?.[0];
};
const updateImage = async (images) => {
  item.newImages = usePreviewFile(images);
  selectedImage.value = allViewedImage.value?.[0];
};

const getItembyId = async (id) => {
  const response = await axios.get(`bikes/${id}`);
  Object.assign(item, response.data);
  // Object.assign(initialItem, item);
  initialItem = cloneDeep(item);
  selectedImage.value = item.image?.[0];
};

const showTimeoutAlertNotification = (alertConfig = null) => {
  Object.assign(alertNotification, { ...alertConfig, isShow: true });
  setTimeout(() => {
    alertNotification.isShow = false;
  }, 2000);
};

const toggleItemDetailExpansion = async (value) => {
  if (value.value) {
    await nextTick(() => {
      detailExpansion.value.$el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }
};

const selectItem = (item) => {
  selectedImage.value = item;
};
const submitDeleteItem = async () => {
  const { valid } = await deleteForm.value.validate();
  if (!valid) return;
  try {
    loading.value = true;
    await axios.delete(`bikes/${item.id}`);
    isShowDeleteItemModal.value = false;
    navigateTo("/admin/item");
  } catch (error) {
    const errorMessage = err?.response?.data?.message || "Some Error";
    showTimeoutAlertNotification({ text: errorMessage, type: "error" });
  } finally {
    loading.value = false;
  }
};
const submitUpdateItemImage = async () => {
  const formData = new FormData();
  formData.append("bikeId", item.id);
  item.image.forEach((img, index) => {
    formData.append(`imageList[${index}]`, img);
  });
  item.file.forEach((imgFile) => {
    formData.append("file", imgFile);
  });
  const response = await axios.patch("bikes/image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  item.file = [];
  item.newImages = [];
  item.image = response.data.image || [];
  initialItem.file = [];
  initialItem.newImages = [];
  initialItem.image = [...item.image];
};

const submitUpdateItemDetail = async () => {
  const itemDetail = [
    "price",
    "quantity",
    "name",
    "information",
    "description",
  ];
  const payload = {
    bikeId: item.id,
    categoryName: item.bikeCategory.name,
  };
  itemDetail.forEach((itemKey) => {
    payload[itemKey] = item[itemKey];
  });
  const response = await axios.patch("bikes", payload);
  // Object.assign(initialItem, response.data);
  initialItem = cloneDeep(item);
};
const submitUpdateItem = async () => {
  const { valid } = await form.value.validate();
  if (!valid) return;
  loading.value = true;
  try {
    if (item.newImages.length || !isEqual(item.image, initialItem.image))
      await submitUpdateItemImage();
    if (!isEqual(item, initialItem)) {
      await submitUpdateItemDetail();
    }
    showTimeoutAlertNotification();
  } catch (err) {
    const errorMessage = err?.response?.data?.message || "Some Error";
    showTimeoutAlertNotification({ text: errorMessage, type: "error" });
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped>
.item-detail {
  border: 3px solid rgb(231, 231, 231);
  border-radius: 5px;
}
</style>

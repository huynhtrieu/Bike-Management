<template>
  <common-login-dialog
    :is-show-login-popup="isShowLoginPopup"
    @close-login-popup="(value) => (isShowLoginPopup = value)"
  ></common-login-dialog>
  <div class="layout">
    <div class="header">
      <div class="info-header">
        <div class="info-header-item">
          <v-icon icon="mdi-map-marker-radius" color="#ff6348"></v-icon>
          <p>Da Nang</p>
        </div>
        <div class="info-header-item">
          <v-icon icon="mdi-phone-message" color="#ff6348"></v-icon>
          <p>0918069067</p>
        </div>
        <div class="info-header-item">
          <v-icon icon="mdi-truck" color="#ff6348"></v-icon>
          <p>About Rotary</p>
        </div>
      </div>
      <div class="main-header">
        <v-img
          :src="getDefaultLogo()"
          class="mt-2 logo"
          @click="navigateTo('/')"
        />
        <v-autocomplete
          single-line
          density="compact"
          variant="outlined"
          class="mt-2 main-header-search-input"
          append-inner-icon="mdi-magnify"
          item-value="name"
          item-title="name"
          hide-no-data
          hide-details
          :items="search.searchedList"
          @update:search="searchItem"
        >
          <template v-slot:item="{ props, item }">
            <v-list-item
              class="mt-2"
              v-bind="props"
              :prepend-avatar="item?.raw?.image?.[0] || getDefaultImage()"
              :title="item?.raw.name"
              :subtitle="item?.raw?.bikeCategory?.name || ''"
              @click="navigateTo(`/item/${item.raw.id}`)"
            >
            </v-list-item> </template
        ></v-autocomplete>
        <div class="main-header-icon-group">
          <v-icon
            v-if="!authStore.isUser"
            icon="mdi-account-outline"
            size="40"
            class="mt-5 ml-5"
            @click="isShowLoginPopup = true"
          ></v-icon>
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-avatar
                v-if="authStore.isUser"
                v-bind="props"
                :image="authStore.user.image || getDefaultImage()"
                size="40"
                class="mt-5 ml-5"
              ></v-avatar>
            </template>
            <v-card>
              <v-list>
                <v-list-item
                  class="account-menu-item"
                  prepend-icon="mdi-account-circle-outline"
                  title="Profile"
                  @click="navigateTo('/profile')"
                ></v-list-item>
                <v-list-item
                  class="account-menu-item"
                  prepend-icon="mdi-history"
                  title="Order History"
                  @click="navigateTo('/payment')"
                ></v-list-item>
                <v-list-item
                  class="account-menu-item"
                  prepend-icon="mdi-logout"
                  title="Logout"
                  @click="logout"
                ></v-list-item>
              </v-list>
            </v-card>
          </v-menu>
          <v-badge
            :content="cartStore.totalOrders"
            color="rgb(255, 99, 72)"
            class="mt-6 ml-5"
          >
            <v-icon
              icon="mdi-cart-outline"
              size="33"
              @click="handleClickCart"
            ></v-icon>
          </v-badge>
        </div>
      </div>
    </div>
    <div class="body"><slot></slot></div>
    <div class="footer">
      <v-row>
        <v-col cols="4">
          <h3>
            ROTARY is a website that specializes in providing electric vehicles
          </h3>
          <h3>Hotline: 0918.069.067</h3>
          <h3>Email: huynhtrieu2410@gmail.com</h3>
          <h3>Adress: Thanh Khe, Da Nang</h3>
          <h3>©2023 ROTARY</h3>
        </v-col>
        <v-col cols="4">
          <h3 class="text-center">About Rotary</h3>
          <h3 class="text-center">Shopping guide</h3>
          <h3 class="text-center">Pay</h3>
          <h3 class="text-center">Customer care</h3>
          <h3 class="text-center">Warranty Policy</h3>
          <!-- <h3 class="text-center">Other information</h3> -->
        </v-col>
        <v-col cols="4" class="text-right">
          <v-icon class="mr-5" icon="mdi-facebook" size="40"></v-icon>
          <v-icon class="mr-5" icon="mdi-instagram" size="40"></v-icon>
          <v-icon class="mr-5" icon="mdi-youtube" size="40"></v-icon>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { useAuthStore } from "../store/auth";
import { useCartStore } from "~~/store/cart";
const authStore = useAuthStore();
const cartStore = useCartStore();
const route = useRoute();
const isShowLoginPopup = ref(false);
const search = reactive({
  keyWord: "",
  searchedList: [],
});

onMounted(() => {
  if (authStore.isUser && route.fullPath !== "/cart") {
    getAllCarts();
  }
});

const handleClickCart = async () => {
  if (authStore.isUser) {
    navigateTo("/cart");
    return;
  }
  isShowLoginPopup.value = true;
};

const getAllCarts = async () => {
  const response = await axios.get("carts");
  cartStore.setCartState(response.data);
};

function logout() {
  authStore.$reset();
  cartStore.$reset();
  navigateTo("/");
}

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
</script>
<style scoped lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-content: space-between;
  width: 100%;
}
.main-header {
  background-image: radial-gradient(#ffe3d8, #ffe3d8);
  height: 60px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0px 100px 10px 100px;
  margin: auto;
  .main-header-search-input {
    max-width: 600px;
    border: solid 2px;
  }
  .main-header-icon-group {
    display: flex;
    gap: 15px;
  }
}
.info-header {
  display: flex;
  justify-content: space-evenly;
  padding: 5px;
  height: 30px;
  .info-header-item {
    display: flex;
    gap: 10px;
    .info-header-text {
      font-size: 14px;
      color: #66016a;
    }
  }
}

.body {
  padding: 10px 0px;
  width: 70vw;
  margin: auto;
}

.footer {
  display: flex;
  align-items: center;
  width: 100vw;
  height: 250px;
  font-family: "Roboto", "Roboto", monospace;
  background-color: rgb(221, 222, 222);
  color: rgb(5, 1, 29);
  margin-top: 20px;
  padding: 20px;
}
.account-menu-item:hover {
  cursor: pointer;
  background-color: rgb(221, 222, 222);
}

.logo {
  max-width: 200px;
}
</style>

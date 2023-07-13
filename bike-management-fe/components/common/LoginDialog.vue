<template>
  <v-dialog
    :model-value="isShowLoginPopup"
    width="600"
    @update:model-value="
      () => {
        $emit('closeLoginPopup', false);
        resetLoginForm();
        loginError = '';
      }
    "
  >
    <v-card style="border-radius: 15px">
      <v-toolbar height="100" class="login-toolbar">
        <p class="text-center mx-auto text-font" style="font-size: 40px">
          <b>Login</b>
        </p>
        <v-icon
          class="close-btn"
          @click="
            () => {
              $emit('closeLoginPopup', false);
              resetLoginForm();
              loginError = '';
            }
          "
          >mdi-close</v-icon
        >
      </v-toolbar>
      <v-divider></v-divider>
      <v-card-item style="padding: 0px 20px 20px 20px">
        <v-form ref="loginFormRef" @submit.prevent validate-on="submit">
          <v-text-field
            color="#691870"
            theme="#e0d4dc"
            class="mt-5"
            label="Username"
            v-model="loginForm.email"
            :rules="[notEmpty, isEmail]"
          ></v-text-field>
          <v-text-field
            color="#691870"
            class="mt-5"
            label="Password"
            v-model="loginForm.password"
            :rules="[notEmpty]"
          ></v-text-field>
          <v-btn
            type="submit"
            block
            class="mt-5"
            size="x-large"
            color="#e0d4dc"
            style="color: #691870"
            @click="login"
            >Submit</v-btn
          >
          <p class="text-error">{{ loginError }}</p>

          <p class="text-right mt-10" style="font-size: large">
            <nuxt-link to="register">Sign Up</nuxt-link>
          </p>
        </v-form>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>
<script setup>
import axios from "axios";
import { useAuthStore } from "~~/store/auth";
import { useCartStore } from "~~/store/cart";
const emits = defineEmits(["closeLoginPopup"]);
const props = defineProps({
  isShowLoginPopup: Boolean,
});
const authStore = useAuthStore();
const cartStore = useCartStore();
const initialLoginForm = {
  email: "",
  password: "",
};
const loginFormRef = ref(null);

const loginForm = reactive({
  ...initialLoginForm,
});
const loginError = ref("");

async function getCart() {
  try {
    const response = await axios.get("carts");
    cartStore.setCartState(response.data);
  } catch (err) {}
}

async function login() {
  loginError.value = "";
  const { valid } = await loginFormRef.value.validate();
  if (!valid) return;
  try {
    const response = await axios.post("auth/login", loginForm);
    if (response?.data?.user?.roleId?.name === "user") {
      authStore.$patch(response.data);
      await getCart();
      emits("closeLoginPopup", false);
      return;
    }
    resetLoginForm();
  } catch (e) {
    loginError.value = e?.response?.data?.message || "Login Error";
    authStore.$reset();
  } finally {
    resetLoginForm();
  }
}
function resetLoginForm() {
  Object.assign(loginForm, initialLoginForm);
}
</script>
<style scoped>
.text-font {
  color: #4f5665;
  font-family: "Roboto", "Roboto", monospace;
  font-style: italic;
}
.login-toolbar {
  background-color: white;
  position: relative;
}
.close-btn {
  position: absolute;
  right: 8px;
  top: 6px;
}
.login-popup {
  border-radius: 20px;
}
</style>

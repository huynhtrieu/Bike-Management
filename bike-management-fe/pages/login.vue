<template>
  <div class="login-wrapper">
    <v-form
      ref="loginFormRef"
      @submit.prevent
      class="login-form"
      validate-on="submit"
    >
      <v-img :src="getDefaultLogo()" width="300" class="mx-auto" />

      <v-text-field
        color="#691870"
        label="Username"
        v-model="loginForm.email"
        :rules="[notEmpty, isEmail]"
      ></v-text-field>
      <v-text-field
        color="#691870"
        label="Password"
        v-model="loginForm.password"
        :rules="[notEmpty]"
      ></v-text-field>
      <v-btn
        type="submit"
        block
        class="mt-2"
        size="x-large"
        color="#bb7bc1"
        style="color: white"
        @click="login"
        >Submit</v-btn
      >
      <p v-if="!!loginError" class="text-error">{{ loginError }}</p>
      <p class="footer-link" style="font-size: large">
        <nuxt-link to="/">Home</nuxt-link>
        <nuxt-link to="register">Sign up</nuxt-link>
      </p>
    </v-form>
  </div>
</template>
<script setup>
import axios from "axios";
import { useAuthStore } from "@/store/auth";
import { reactive } from "vue";
const initialLoginForm = {
  email: "",
  password: "",
};
const loginForm = reactive({
  ...initialLoginForm,
});
const loginError = ref("");
const loginFormRef = ref(null);

async function login() {
  loginError.value = "";

  const { valid } = await loginFormRef.value.validate();
  if (!valid) return;
  const authStore = useAuthStore();

  try {
    const response = await axios.post("auth/login", loginForm);
    authStore.$patch(response.data);
    navigateTo("/admin");
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
<style scoped lang="scss">
.login-wrapper {
  background-image: linear-gradient(#bb7bc1, #d1ced5);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
.login-form {
  background-color: white;
  border-radius: 10px;
  width: 600px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
}
.text-error {
  color: red !important;
}
.footer-link {
  display: flex;
  justify-content: space-between;
}
</style>

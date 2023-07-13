<template>
  <div class="login-wrapper">
    <v-form
      @submit.prevent
      class="login-form"
      ref="registerFormRef"
      validate-on="submit"
    >
      <v-img :src="getDefaultLogo()" width="300" class="mx-auto" />
      <v-text-field
        color="#691870"
        label="Name"
        v-model="signUpForm.name"
        :rules="[notEmpty]"
      ></v-text-field>
      <v-text-field
        color="#691870"
        label="Email"
        v-model="signUpForm.email"
        :rules="[isEmail, notEmpty]"
      ></v-text-field>
      <v-text-field
        color="#691870"
        label="Password"
        v-model="signUpForm.password"
        :rules="[notEmpty, minLength(8)]"
      ></v-text-field>

      <v-btn
        type="submit"
        block
        class="mt-2"
        size="x-large"
        color="#bb7bc1"
        style="color: white"
        @click="signUp"
        >Submit</v-btn
      >
      <p v-if="!!registerError" class="text-error">{{ registerError }}</p>
      <p class="footer-link" style="font-size: large">
        <nuxt-link to="/">Home</nuxt-link>
        <nuxt-link to="login">Admin</nuxt-link>
      </p>
    </v-form>
  </div>
</template>
<script setup>
import axios from "axios";
const initialSignUp = {
  email: "",
  password: "",
  name: "",
};
const signUpForm = reactive({
  ...initialSignUp,
});
const registerFormRef = ref(null);
const registerError = ref("");

// Function
const signUp = async () => {
  const { valid } = await registerFormRef.value.validate();
  if (!valid) return;
  try {
    const response = await axios.post("auth/register", signUpForm);
    navigateTo("/");
  } catch (e) {
    registerError.value = e?.response?.data?.message || "Register Error";
  } finally {
    resetRegisterForm();
  }
};

function resetRegisterForm() {
  Object.assign(signUpForm, initialSignUp);
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

<template>
  <v-dialog width="500" :model-value="alertNotification.isShow">
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
  <v-divider thickness="2"></v-divider>
  <v-card class="profile-container">
    <v-progress-linear
      v-if="loading"
      indeterminate
      color="primary"
    ></v-progress-linear>
    <v-card-item>
      <v-form ref="profileForm" @submit.prevent>
        <v-row>
          <v-col cols="5">
            <v-card
              class="mx-auto"
              width="430"
              height="430"
              :image="adminUser.image || getDefaultImage()"
            ></v-card>
            <v-file-input
              v-model="adminUser.file"
              accept="image/png, image/jpeg, image/bmp, image/jpg"
              append-inner-icon="mdi-image-area"
              class="mt-5 mx-auto avatar-file-input"
              @update:model-value="updateAvatar"
              chips
              show-size
              label="File input"
            ></v-file-input>
          </v-col>
          <v-col cols="7">
            <v-card-item>
              <v-form disabled>
                <v-text-field
                  append-inner-icon="mdi-pencil-off"
                  label="Email"
                  v-model="adminUser.email"
                  :rules="[notEmpty, isEmail]"
                ></v-text-field>
              </v-form>
              <v-text-field
                label="Name"
                v-model="adminUser.name"
                :rules="[notEmpty]"
              ></v-text-field>
              <v-text-field
                label="Phone"
                v-model="adminUser.phoneNumber"
                :rules="[isPhoneNumber]"
              ></v-text-field>
              <common-date-picker
                :date="adminUser.birthDate"
                @update="
                  (date) => {
                    adminUser.birthDate = date;
                  }
                "
              ></common-date-picker>
              <v-text-field
                label="Address"
                v-model="adminUser.address"
              ></v-text-field>
              <v-dialog v-model="resetPassword.isShowPasswordModal" width="800">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    append-icon="mdi-lock-reset"
                    elevation="8"
                    size="x-large"
                    block
                    class="mt-5 mb-5"
                    @click="resetPassword.isShowPasswordModal = true"
                    >Reset password</v-btn
                  >
                  <v-btn
                    elevation="8"
                    append-icon="mdi-content-save"
                    size="x-large"
                    block
                    class="mt-5 mb-5"
                    @click="submitUpdateProfile"
                    >Save</v-btn
                  >
                </template>
                <v-card>
                  <v-toolbar color="primary" height="40">
                    <v-toolbar-title>CHANGE PASSWORD</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn
                      icon
                      dark
                      @click="resetPassword.isShowPasswordModal = false"
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-toolbar>
                  <v-progress-linear
                    v-if="loading"
                    indeterminate
                    color="primary"
                  ></v-progress-linear>
                  <v-card-item>
                    <v-form ref="resetPwForm" validate-on="submit">
                      <v-text-field
                        label="Current Password"
                        v-model="resetPassword.currentPassword"
                        :error-messages="resetPassword.error_msg"
                        :rules="[notEmpty, minLength(8)]"
                      ></v-text-field>
                      <v-text-field
                        label="New Password"
                        v-model="resetPassword.newPassword"
                        :rules="[
                          notEmpty,
                          minLength(8),
                          isValidNewPassword(resetPassword.currentPassword),
                        ]"
                      ></v-text-field>
                      <v-text-field
                        label="Confirm New Password"
                        :rules="[
                          notEmpty,
                          minLength(8),
                          notEqual(resetPassword.newPassword),
                        ]"
                      ></v-text-field>
                      <v-btn
                        variant="tonal"
                        size="x-large"
                        dark
                        block
                        class="mb-5 mt-3"
                        @click="submitResetPassword"
                        >Save</v-btn
                      >
                    </v-form>
                  </v-card-item>
                </v-card>
              </v-dialog>
            </v-card-item>
          </v-col>
        </v-row>
      </v-form>
    </v-card-item>
  </v-card>
</template>
<script setup>
import { useAuthStore } from "@/store/auth";
import axios from "axios";
import { isEqual } from "lodash";
import getDefaultImage from "~~/utils/getDefaultImage";
definePageMeta({ middleware: "user-auth", layout: "customer" });
const authStore = useAuthStore();
const initialResetPasswordForm = {
  isShowPasswordModal: false,
  currentPassword: "",
  newPassword: "",
  error_msg: "",
};
const adminUser = reactive({
  ...authStore.user,
  file: null,
});
const resetPassword = reactive({
  ...initialResetPasswordForm,
});
const alertNotification = reactive({
  isShow: false,
  type: "success",
  text: "Edit Profile Successfully",
});
const loading = ref(false);
const resetPwForm = ref();
const profileForm = ref();

watch(
  () => resetPassword.isShowPasswordModal,
  (isShow) => {
    if (!isShow) Object.assign(resetPassword, initialResetPasswordForm);
  }
);

const updateAvatar = (files) => {
  adminUser.image = usePreviewFile(files)?.[0];
};

const submitUpdateProfile = async () => {
  const { valid } = await profileForm.value.validate();
  if (!valid) return;
  try {
    loading.value = true;
    if (!isEqual({ ...authStore.user, file: null }, adminUser)) {
      const updatedField = [
        "name",
        "address",
        "phoneNumber",
        "file",
        "birthDate",
      ];
      const formData = new FormData();
      updatedField.forEach((key) => {
        if (key === "file") {
          formData.append(key, adminUser[key]?.[0]);
          return;
        }
        formData.append(key, adminUser[key]);
      });
      const response = await axios.patch("users/profile", formData);
      authStore.user = response.data;
      Object.assign(adminUser, { ...authStore, file: null });
    }
    showTimeoutAlertNotification({
      type: "success",
      text: "Edit profile Successfully",
    });
  } catch (err) {
    const errorMsg = err?.response?.data?.message || "Something error";
    showTimeoutAlertNotification({ type: "error", text: errorMsg });
  } finally {
    loading.value = false;
  }
};

const showTimeoutAlertNotification = (alertConfig = null) => {
  Object.assign(alertNotification, { ...alertConfig, isShow: true });
  setTimeout(() => {
    alertNotification.isShow = false;
  }, 3000);
};

const submitResetPassword = async () => {
  const { valid } = await resetPwForm.value.validate();
  if (!valid) return;
  loading.value = true;
  try {
    const response = await axios.patch("users/profile/password", {
      currentPassword: resetPassword.currentPassword,
      newPassword: resetPassword.newPassword,
    });
    resetPassword.isShowPasswordModal = false;
    showTimeoutAlertNotification({ text: "Change Password Successfully" });
  } catch (error) {
    const errorMsg = error?.response?.data?.message || "Something error";
    if (errorMsg === "Invalid passowrd") {
      resetPassword.error_msg = errorMsg;
      return;
    }
    resetPassword.isShowPasswordModal = false;
    showTimeoutAlertNotification({ type: "error", text: errorMsg });
  } finally {
    loading.value = false;
  }
};
</script>
<style scoped>
.profile-container {
  margin: 20px;
  border: 1px solid grey;
}
</style>

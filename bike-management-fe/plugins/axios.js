import axios from "axios";
import { useAuthStore } from "~~/store/auth";
export default defineNuxtPlugin((nuxtApp) => {
  axios.defaults.baseURL = nuxtApp.$config.public.apiBase;

  axios.interceptors.request.use(
    function (config) {
      const token = useAuthStore()?.tokens?.access?.token;
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  ///
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      const errorResponse = error.response;
      if (errorResponse?.status === 401) {
        const authStore = useAuthStore();
        authStore.$reset();
        navigateTo("/login");
      }
      return Promise.reject(error);
    }
  );
});

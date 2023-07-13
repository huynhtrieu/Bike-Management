import { useAuthStore } from "~~/store/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAdmin } = useAuthStore();
  if (!isAdmin) {
    return navigateTo("/login");
  }
});

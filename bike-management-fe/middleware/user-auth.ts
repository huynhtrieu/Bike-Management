import { useAuthStore } from "~~/store/auth";
export default defineNuxtRouteMiddleware((to, from) => {
  const { isLoggedIn, isUser } = useAuthStore();

  if (!isLoggedIn && !isUser) {
    return navigateTo("/");
  }
});

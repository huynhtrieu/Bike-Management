import { useAuthStore } from "~~/store/auth";

const useAuth = () => {
  const authStore = useAuthStore();
  const isLoggedIn = () => !!Object.keys(authStore.user).length;
  return {
    isLoggedIn,
  };
};

export default useAuth;

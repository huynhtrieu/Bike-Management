import { defineStore } from "pinia";

const initilUserState = {
  user: {
    id: "",
    name: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    address: "",
    roleId: {
      id: "",
      name: "",
    },
    image: "",
  },
  tokens: {
    access: {
      token: "",
    },
    refresh: {
      token: "",
    },
  },
};
export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      id: "",
      name: "",
      email: "",
      phoneNumber: "",
      birthDate: "",
      address: "",
      roleId: {
        id: "",
        name: "",
      },
      image: "",
    },
    tokens: {
      access: {
        token: "",
      },
      refresh: {
        token: "",
      },
    },
  }),
  getters: {
    isLoggedIn: (state) => !!state.tokens.access.token,
    isAdmin: (state) => state.user.roleId.name === "admin",
    isUser: (state) => state.user.roleId.name === "user",
  },

  actions: {
    setAuthState(authData: any) {
      this.user = authData.user;
      this.tokens = authData.tokens;
    },
    resetAuthState() {
      this.user = initilUserState.user;
      this.tokens = initilUserState.tokens;
    },
  },

  // persist: true
  persist: {
    storage: persistedState.cookies,
    paths: ["user", "tokens"],
  },
});

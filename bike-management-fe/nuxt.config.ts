// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: process.env.BASE_URL || "http://localhost:8080/api/",
      defaultPassword: process.env.DEFAULT_PASSWORD,
    },
  },
  app: {
    head: {
      charset: "utf-16",
      viewport: "width=device-width, initial-scale=1",
      title: "Bike",
    },
  },

  modules: ["@pinia/nuxt", , "@pinia-plugin-persistedstate/nuxt"],

  css: [
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  build: {
    transpile: ["vuetify", "@vuepic/vue-datepicker"],
  },
  vite: {
    define: {
      "process.env.DEBUG": false,
    },
  },
});

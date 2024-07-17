// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  compatibilityDate: "2024-07-05",
  modules: ["@element-plus/nuxt", "@nuxtjs/google-fonts", "@nuxtjs/supabase"],
  googleFonts: {
    families: {
      Jost: [400, 500, 600, 700],
    },
  },
  supabase: {
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/register"],
    },
  },
  css: ["assets/css/global.css"],
});

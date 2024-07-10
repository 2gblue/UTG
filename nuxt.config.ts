// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2024-07-05",
  modules: ["@element-plus/nuxt", "@nuxtjs/google-fonts", "@nuxtjs/supabase"],
  googleFonts: {
    families: {
      Jost: [400, 500, 600, 700],
    },
  },
  css: ["assets/css/global.css"],
  supabase: {
    redirect: false,
  },
});

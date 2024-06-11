// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  sourcemap: false,
  devtools: { enabled: true },
  modules: ["nuxt-monaco-editor", "@unocss/nuxt", "@pinia/nuxt"]
})
import { fileURLToPath, URL } from 'node:url'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// import { isCustomElement, transformAssetUrls } from 'vue3-pixi/compiler' // Import this

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // template: {
      //   // Support for custom elements and remove unknown element warnings
      //   compilerOptions: {
      //     isCustomElement: isCustomElement, // Add this
      //   },
      //   // Support for asset URL conversion for vue3-pixi components
      //   transformAssetUrls, // Add this
      // },
    }),
    vueJsx({
      include: /\.[jt]sx?$/, // also support tsx for react
    }),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
// vite.config.js (or vite.config.ts)

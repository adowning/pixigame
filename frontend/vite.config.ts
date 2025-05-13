import { fileURLToPath, URL } from 'node:url'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
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
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      dts: 'src/types/auto/auto-imports.d.ts',
      dirs: ['src/composables'],
      eslintrc: {
        enabled: true, // <-- this
      },
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/],
    }),
    // 自动按需导入组件
    Components({
      dts: 'src/types/auto/components.d.ts',
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      resolvers: [
        // RekaResolver(),
        // RekaResolver({
        //   prefix: '' // use the prefix option to add Prefix to the imported components
        // })
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
// vite.config.js (or vite.config.ts)

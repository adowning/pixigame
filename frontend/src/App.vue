<template>
  <div>
    <div v-if="isPreloading" class="preloader-game" ref="preloaderBaseRef">
      <div class="prel-bar">
        <div class="prel-bar-line" :style="{ 'clip-path': preloaderClipPath }"></div>
      </div>
    </div>

    <MessageWin v-if="messageText" :text="messageText" @close="handleCloseMessage" />

    <TopWindows />

    <div id="AppGame"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import WebFontLoader from 'webfontloader'
import * as PIXI from 'pixi.js' // Import PIXI to use PIXI.Assets

// Vue components
import TopWindows from './components/TopWindows.vue'
import MessageWin from './components/windows/MessageWin.vue'

// Shared instances and project modules
import { EE } from './Game'
import { listImages } from './libs/common/Config'
import { setup as setupGame } from './Game'

// Reactive state
const isPreloading = ref(true)
const messageText = ref<string | null>(null)
const assetLoadingProgress = ref(0) // Progress from 0 to 1 for PIXI.Assets

// Template refs
const preloaderBaseRef = ref<HTMLElement | null>(null)

// --- Computed property for clip-path ---
const preloaderClipPath = computed(() => {
  // assetLoadingProgress is 0 to 1. We need to invert it for the clip-path effect.
  // If progress is 0.1 (10%), then (1 - 0.1) = 0.9. 917 * 0.9 = remaining width to clip.
  // If progress is 1 (100%), then (1 - 1) = 0. 917 * 0 = 0 width to clip (fully shown).
  // The original React code was `917 * (Math.ceil(100 - imagesLoader.progress)) / 100;`
  // imagesLoader.progress was 0-100. So `100 - progress` gives remaining percentage.
  // (1 - assetLoadingProgress.value) gives remaining fraction.
  const remainingFraction = 1 - assetLoadingProgress.value
  const wdth = 917 * remainingFraction
  return `inset(0 ${wdth < 0 ? 0 : Math.ceil(wdth)}px 0 0)`
})

// --- Global Event Handling & Functions ---
EE.on('SHOW_MESSAGE', (txt: string) => {
  messageText.value = txt
})

EE.once('GO_GAME', () => {
  EE.emit('CLEAR_TOP_WINDOWS')
  setupGame()
})

const handleCloseMessage = () => {
  messageText.value = null
}

// --- Lifecycle Hooks & Asset Loading ---
onMounted(() => {
  WebFontLoader.load({
    custom: {
      families: ['Bronzier'],
    },
    active: () => {
      console.log('Font Bronzier loaded.')
      startAssetLoading()
    },
    inactive: () => {
      console.warn('Font Bronzier failed to load. Proceeding...')
      startAssetLoading()
    },
  })
})

async function startAssetLoading() {
  try {
    // PIXI.Assets.load takes an array of URLs and an optional onProgress callback
    // The onProgress callback receives a value from 0 to 1.
    const loadedTextures = await PIXI.Assets.load(listImages, (progress) => {
      assetLoadingProgress.value = progress // progress is 0 to 1
    })

    console.log('All assets loaded with PIXI.Assets!')
    // You can access loaded textures via PIXI.Assets.get(url) or from loadedTextures object
    // e.g., const specificTexture = PIXI.Assets.get(listImages[0]);
    // or const specificTextureFromLoad = loadedTextures[listImages[0]];

    if (preloaderBaseRef.value) {
      preloaderBaseRef.value.style.opacity = '0' // Start fade out
      setTimeout(async () => {
        isPreloading.value = false // Vue will remove it from DOM
        await nextTick()
        emitPostLoadEvents()
      }, 1000) // Delay for fade out animation
    } else {
      isPreloading.value = false
      await nextTick()
      emitPostLoadEvents()
    }
  } catch (error) {
    console.error('ERROR LOADING ASSETS with PIXI.Assets:', error)
    isPreloading.value = false // Hide preloader on error too
    // Potentially show an error message to the user
  }
}

function emitPostLoadEvents() {
  // EE.emit('SHOW_UPDATE_POPUP');
  // EE.emit('CLEAR_TOP_WINDOWS');
  // EE.emit('SHOW_LOGIN');
  // EE.emit('SHOW_ADV');
  // EE.emit('SHOW_MAINTEN');
  // EE.emit('PAGE_INFO');
  // EE.emit('SHOW_REG');
  // EE.emit('SHOW_FREE_PLAY');
  // EE.emit('SHOW_SIGNPHONE');
  EE.emit('BONUS_WIN_RANK')
  EE.emit('GO_GAME')
}
</script>

<style>
/* Global styles from your original App.css or similar */
/* @import './App.css'; */

/* Ensure @font-face for Bronzier is in a globally imported CSS file (e.g., main.css) */

/* Styles for Preloader (mimicking your class names) */
.preloader-game {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000; /* Example: Black background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  opacity: 1;
  transition: opacity 1s ease-out; /* For fade-out effect */
}

.prel-bar {
  width: 917px; /* Width of your preloader bar design */
  height: 40px; /* Height of your preloader bar design */
  background-color: #333; /* Example background for the bar track */
  border-radius: 5px;
  position: relative;
}

.prel-bar-line {
  width: 100%;
  height: 100%;
  background-color: #4caf50; /* Example progress color */
  border-radius: 5px;
  /* clip-path will be applied dynamically via :style binding */
  /* No transition needed on clip-path if updates are frequent from PIXI.Assets.
     If you want a smoother visual update *between* PIXI.Assets progress ticks,
     you could add: transition: clip-path 0.05s linear;
     but often the progress events are rapid enough.
  */
}

#AppGame {
  width: 100%;
  height: 100vh;
  position: relative;
}
</style>

<template>
  <div class="modal-window-db_update-popup" v-if="isVisible">
    <div
      class="modal-window-db_update-popup__scale-cont"
      ref="scaleContainerRef"
      :style="containerStyle"
    >
      <img
        class="modal-window-db_update-popup__back"
        src="/images/frenzy/updatePopup.png"
        alt="popup background"
        @load="onBackgroundImageLoad"
      />
      <img
        src="/images/frenzy/bonus_close.png"
        alt="close button"
        class="modal-window-db_update-popup__cross_icon"
        @click="handleClose"
      />
      <div class="modal-window-db_update-popup__content-container">
        <img
          src="/images/frenzy/update_btn.png"
          alt="update button"
          class="modal-window-db_update-popup__popup_btn"
          @click="handleUpdateClick"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineEmits, defineProps, computed, nextTick } from 'vue'
// Assuming EE is the event emitter from your Game.ts or a similar global instance
// You'll need to make sure this path is correct and EE is exported from your Pixi game setup.
// If `App.js` or `App.ts` from the React context is where EE was, you need to find its equivalent.
// For this example, I'm assuming it's from your main Game.ts file.
import { EE } from '@/Game' // Adjust path as needed, e.g., '../../Game' or '@/libs/Game' if aliased
import { PAGE_SIZE_DEFAULT } from '@/libs/common/Config' // Adjust path as needed

// Props (if any were passed to the React component)
// For this example, the React component didn't explicitly use props other than onClose.
// const props = defineProps({});

// Emits (for onClose, onUpdateClick)
const emit = defineEmits(['close', 'updateClick'])

const isVisible = ref(true) // Controls overall visibility for transitions
const scaleContainerRef = ref<HTMLDivElement | null>(null)
const currentScale = ref(0.7) // Start smaller for entry animation
const currentOpacity = ref(0)

const containerStyle = computed(() => ({
  transform: `scale(${currentScale.value})`,
  opacity: `${currentOpacity.value}`,
  transition: 'transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.3s ease-out',
}))

const onResize = (data: { w: number; h: number; scale?: number }) => {
  // The 'scale' property from data in the original onResize might be Pixi stage scale.
  // For DOM elements, we usually scale based on viewport vs. design size.
  const scaleValue = Math.min(data.w / PAGE_SIZE_DEFAULT.width, data.h / PAGE_SIZE_DEFAULT.height)
  // If you want the Vue component to scale with the Pixi stage scale (data.scale), you'd use that.
  // However, typically responsive scaling for DOM popups is direct viewport comparison.
  // For now, let's assume the existing logic from React:
  if (scaleContainerRef.value) {
    // This logic might need review. If 'data.scale' is Pixi's stage scale,
    // applying it directly to a DOM element might not be what you want unless this
    // popup is meant to be part of the "scaled world".
    // The original React version did: cont.style.transform = `scale(${sc})`;
    // where sc was calculated from data.h / PAGE_SIZE_DEFAULT.height etc.
    // This means it was scaling the component relative to the game's default resolution.

    // Let's try to replicate the intended scaling:
    const designWidth = PAGE_SIZE_DEFAULT.width
    const designHeight = PAGE_SIZE_DEFAULT.height
    let scaleFactor = 1

    // If data.w and data.h represent the available space for the game canvas
    const scaleToFit = Math.min(data.w / designWidth, data.h / designHeight)
    scaleFactor = scaleToFit // This scales the popup along with the game viewport

    // The React version's onResize set opacity to 1.
    // We handle initial animation separately. If this is purely for resize, just adjust scale.
    // Note: The animation scale and resize scale might conflict.
    // It's often better to have a base scale for responsiveness and then animate on top of that,
    // or let CSS handle responsiveness and Vue handle animation states.

    // For simplicity, let's assume the incoming `data` from EE's "RESIZE" event
    // is providing the BROWSER_WIDTH and BROWSER_HEIGHT and BROWSER_SCALE from responsiveModule.ts
    // In that case, data.w = BROWSER_WIDTH, data.h = BROWSER_HEIGHT
    // and the scale to apply to the popup to match the game's viewport scale is BROWSER_SCALE.
    // However, the original `onResize` calculated `sc` *again*.
    // Let's stick to what `responsiveModule.ts` calculates as the overall scale for DOM elements.
    // `responsiveModule` sets `anim_container.style.width = w * sRatio + 'px';`
    // This means `sRatio` is the scale factor applied to the game container.
    // If the popup is *outside* this container but needs to feel part of the same scaled UI,
    // then `sRatio` is the value to use.
    // The EE "RESIZE" event from responsiveModule.ts emits {w:iw, h:ih, scale: sRatio }
    // So data.scale here is sRatio.

    if (data.scale && currentOpacity.value === 1) {
      // Only apply resize scaling if fully visible
      currentScale.value = data.scale
    }
  }
}

const onBackgroundImageLoad = () => {
  // After the main background image loads, we can trigger a resize or ensure correct scaling
  // This replaces the direct DOM manipulation in the React version.
  EE.emit('FORCE_RESIZE') // Or call a local resize handler if preferred
  // Start entry animation
  currentScale.value = 1 // Assuming the resize event will provide the correct base scale
  currentOpacity.value = 1
  // Call onResize directly to apply initial scale based on current window dimensions
  // This requires knowing current browser width/height or having responsiveModule emit current values.
  // For now, FORCE_RESIZE should trigger responsiveModule to emit a RESIZE event.
}

onMounted(() => {
  EE.on('RESIZE', onResize) // Use EE.on for eventemitter3

  // Initial animation:
  // Wait for next tick to ensure element is in DOM and styles can be applied for transition
  nextTick(() => {
    // The onBackgroundImageLoad will now handle the initial animation to scale:1, opacity:1
    // If the image is cached, @load might not fire, so also trigger an initial scale up.
    // However, forcing resize on load is generally better.
    // If the image might be cached and @load won't fire reliably for the animation trigger:
    if (!scaleContainerRef.value?.querySelector('.modal-window-db_update-popup__back')?.complete) {
      // Image not loaded or not complete, @load will handle it.
    } else {
      // Image likely cached, manually trigger animation if @load didn't.
      // This can be tricky. A simpler way is to ensure the @load event always triggers the logic
      // or to decouple animation from image load if caching is an issue.
      // For now, let's rely on @load or an initial FORCE_RESIZE.
      EE.emit('FORCE_RESIZE') // Trigger initial sizing
      setTimeout(() => {
        // Give a moment for resize to apply
        currentScale.value = 1 // This might need to be the data.scale from onResize
        currentOpacity.value = 1
      }, 50) // Small delay
    }
  })
})

onUnmounted(() => {
  EE.off('RESIZE', onResize) // Use EE.off for eventemitter3
})

const handleClose = () => {
  currentScale.value = 0.7
  currentOpacity.value = 0

  setTimeout(() => {
    isVisible.value = false // Optionally hide with v-if after animation
    emit('close') // Emitting a 'close' event for the parent component
    EE.emit('SHOW_LOGIN') // Global game event
  }, 500) // Match transition duration
}

const handleUpdateClick = () => {
  console.log('UpdatePopupWin (Vue): Update button clicked')
  emit('updateClick') // Emitting an 'updateClick' event
}
</script>

<style scoped>
/* Import the CSS directly or copy its contents here */
/* @import '../css/updatePopup.css'; */ /* This might work depending on Vite setup */

/* Fallback: Copied relevant styles from a potential updatePopup.css */
.modal-window-db_update-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
  z-index: 1000; /* Ensure it's on top */
}

.modal-window-db_update-popup__scale-cont {
  position: relative;
  /* transform-origin: center center; set by inline style via containerStyle */
  /* opacity: 0; set by inline style */
  /* transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.3s ease-out; set by inline style */
  /* The actual width/height will be determined by the image content or explicit CSS */
  /* Based on image, looks like around 800x600 or similar aspect ratio */
}

.modal-window-db_update-popup__back {
  display: block;
  width: 100%; /* Or fixed width based on design */
  height: auto; /* Or fixed height */
  max-width: 783px; /* Example based on typical popup size from image names */
}

.modal-window-db_update-popup__cross_icon {
  position: absolute;
  top: 20px; /* Adjust based on actual image/design */
  right: 20px; /* Adjust */
  width: 40px; /* Example size */
  height: 40px; /* Example size */
  cursor: pointer;
  z-index: 1;
}

.modal-window-db_update-popup__content-container {
  position: absolute;
  bottom: 50px; /* Adjust */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-window-db_update-popup__popup_btn {
  width: 200px; /* Example size */
  height: auto;
  cursor: pointer;
}

/* Add any other styles from updatePopup.css here or ensure the @import works */
</style>

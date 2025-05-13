<template>
  <div v-if="isVisible" class="modal-window-npass">
    <div class="modal-window-npass__scale-cont" :style="{ transform: `scale(${scaleFactor})` }">
      <span class="modal-window-npass__info-text">
        A strong password should contain 6-16 characters.
      </span>
      <input
        v-model="password"
        class="modal-window-npass__pass1 modal-window-npass__fields"
        type="password"
        :placeholder="defaultText1"
        @input="handleInput"
        @focus="onFocus('pass1')"
        @blur="onBlur('pass1')"
      />
      <input
        v-model="confirmPassword"
        class="modal-window-npass__pass2 modal-window-npass__fields"
        type="password"
        :placeholder="defaultText2"
        @input="handleInput"
        @focus="onFocus('pass2')"
        @blur="onBlur('pass2')"
      />
      <div class="modal-window-npass__error" :style="{ opacity: errorText ? 1 : 0 }">
        <span class="modal-window-npass__error-text">{{ errorText }}</span>
        <img src="/images/frenzy/pass_err.png" alt="Error" />
      </div>
      <img
        class="modal-window-npass__close game-button"
        @click="handleClose"
        src="/images/frenzy/bonus_close.png"
        alt="Close"
      />
      <img
        class="modal-window-npass__ok game-button"
        @click="handleChangePassword"
        src="/images/frenzy/change_p_btn.png"
        alt="OK"
      />
      <img class="modal-window-npass__back" src="/images/frenzy/pass_back.png" alt="Background" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
// Assuming EE is globally available or provided/injected.
// If it's from a specific module, import it:
import { EE } from '../../Game' // Adjust path as needed
import { PAGE_SIZE_DEFAULT } from '../../libs/common/Config' //

const defaultText1 = 'Enter new password'
const defaultText2 = 'Retype new password'
const errorPassLength = 'Input password must be 6-16 chars'
const errorPassMatch = 'Password & repeat password must match'

const props = defineProps<{
  // If this component is controlled by a parent for visibility
  // isVisible?: boolean // Or handle visibility internally via EE
}>()

const emit = defineEmits(['close', 'passwordChanged']) // Emitting a close event

// Reactive state
const isVisible = ref(true) // Or manage via props if parent controls visibility
const password = ref('')
const confirmPassword = ref('')
const errorText = ref<string | null>(null)
const scaleFactor = ref(1)

// To manage placeholder behavior like in the React version
const isPass1Focused = ref(false)
const isPass2Focused = ref(false)

const handleClose = () => {
  // If visibility is managed internally:
  // isVisible.value = false;
  emit('close')
}

const handleChangePassword = () => {
  errorText.value = null // Reset error

  if (password.value.length < 6 || password.value.length > 16) {
    // Corrected length check
    errorText.value = errorPassLength
  } else if (password.value !== confirmPassword.value) {
    errorText.value = errorPassMatch
  }

  if (errorText.value) {
    // Error will show due to reactive errorText.
    // Auto-hide error after a delay:
    setTimeout(() => {
      errorText.value = null
    }, 2000)
    return
  }

  // Assuming newPassword was a global function or an API call
  // For now, we'll just emit an event and close
  console.log('New password submitted:', password.value)
  // Example: newPassword(password.value, handleClose);
  emit('passwordChanged', password.value)
  handleClose()
}

const onFocus = (field: 'pass1' | 'pass2') => {
  if (field === 'pass1') isPass1Focused.value = true
  if (field === 'pass2') isPass2Focused.value = true
  // Placeholder behavior is handled by :placeholder binding now
}

const onBlur = (field: 'pass1' | 'pass2') => {
  if (field === 'pass1') isPass1Focused.value = false
  if (field === 'pass2') isPass2Focused.value = false
  // Placeholder behavior is handled by :placeholder binding now
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.value.length > 16) {
    target.value = target.value.slice(0, 16)
    // Manually update the v-model ref if necessary, though usually Vue handles this
    if (target.classList.contains('modal-window-npass__pass1')) {
      password.value = target.value
    } else if (target.classList.contains('modal-window-npass__pass2')) {
      confirmPassword.value = target.value
    }
  }
}

const onResize = (data?: { w: number; h: number; scale: number }) => {
  // This logic was for scaling based on window dimensions.
  // Ensure data is provided or fallback to window dimensions if EE doesn't pass it.
  // The React version uses getElementsByClassName. In Vue, we'd prefer not to do that
  // for elements within the component itself.
  // The scaleFactor ref can be bound to the style directly.

  // If EE passes data like { w, h, scale (browser scale) }
  if (data && data.w && data.h) {
    const containerWidth = data.w / data.scale // Actual width in CSS pixels
    const containerHeight = data.h / data.scale // Actual height in CSS pixels
    scaleFactor.value = Math.min(
      containerHeight / PAGE_SIZE_DEFAULT.height,
      containerWidth / PAGE_SIZE_DEFAULT.width,
    )
  } else {
    // Fallback if data is not provided by EE event, or adjust based on how RESIZE is emitted
    const w = window.innerWidth
    const h = window.innerHeight
    scaleFactor.value = Math.min(h / PAGE_SIZE_DEFAULT.height, w / PAGE_SIZE_DEFAULT.width)
  }
  // Ensure the component re-renders if scaleFactor changes affecting layout significantly
  nextTick(() => {
    // console.log("Resized, new scale factor:", scaleFactor.value);
  })
}

onMounted(() => {
  EE.addListener('RESIZE', onResize)
  EE.emit('FORCE_RESIZE') // Trigger initial resize
  onResize() // Call once on mount for initial scaling
})

onUnmounted(() => {
  EE.removeListener('RESIZE', onResize)
})
</script>

<style scoped>
/* Import styles from ../css/newpass.css */
/* Make sure image paths are correct (e.g., /images/frenzy/...) */

.modal-window-npass {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5); /* Example backdrop */
  z-index: 1000; /* Ensure it's on top */
}

.modal-window-npass__scale-cont {
  /* Styles for the scaling container. Background image and layout go here. */
  /* Transition for smooth scaling */
  transition: transform 0.3s ease-out;
  position: relative; /* For positioning children absolutely if needed */
  /* Set width and height based on your background image aspect ratio if needed */
  width: 700px; /* Example width, adjust to your design */
  height: 500px; /* Example height, adjust to your design */
  background-image: url('/images/frenzy/pass_back.png');
  background-size: contain;
}
</style>

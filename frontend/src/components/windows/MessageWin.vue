<template>
  <div v_if="visible" class="modal-window-message">
    <div class="modal-window-message__scale-cont">
      <div class="modal-window-message__text-unit modal-window-message__text">{{ text }}</div>
      <div class="modal-window-message__text-unit modal-window-message__text-shadow">
        {{ text }}
      </div>
      <img
        class="modal-window-message__ok game-button"
        @click="handleClose"
        src="/images/frenzy/ok_btn.png"
        alt="OK"
      />
      <img
        class="modal-window-message__close game-button"
        @click="handleClose"
        src="/images/frenzy/bonus_close.png"
        alt="Close"
      />
      <img class="modal-window-message__back" src="/images/frenzy/message.png" alt="Background" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  text: string | null
}>()

const emit = defineEmits(['close'])

const visible = ref(false)

watch(
  () => props.text,
  (newText) => {
    visible.value = newText !== null && newText !== ''
  },
)

function handleClose() {
  emit('close')
}
</script>

<style scoped>
/* Add styles from your message.css, ensure paths to images are correct (e.g., /images/frenzy/...) */
.modal-window-message {
  /* ... */
}
/* ... other styles from message.css */
</style>

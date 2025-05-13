<template>
  <button @click="$emit('click')" class="my-button">
    {{ label }}
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'Click Me',
  },
})
defineEmits(['click'])
</script>

<style scoped>
.my-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}
.my-button:hover {
  background-color: #0056b3;
}
</style>

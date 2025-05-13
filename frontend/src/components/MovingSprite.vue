<template>
  <Sprite
    v-if="props.imageUrl"
    :texture="props.imageUrl"
    :x="spriteX"
    :y="spriteY"
    :anchor="0.5"
    @pointertap="onSpriteClick"
    :interactive="true"
  />
  <text
    v-else
    :text="'Sprite waiting for image...'"
    :x="props.startX"
    :y="props.startY"
    :style="{ fill: 'white', fontSize: 16 }"
    :anchor="0.5"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
// onTick should be the correct import for ticker functionality
import { Sprite, Text, onTick } from 'vue3-pixi'

const props = defineProps({
  imageUrl: {
    type: String,
    // Making it not strictly required to allow for a brief moment it might be undefined,
    // though generally it should always be passed.
    // required: true
  },
  startX: {
    type: Number,
    default: 100,
  },
  startY: {
    type: Number,
    default: 100,
  },
})

const spriteX = ref(props.startX)
const spriteY = ref(props.startY)
let direction = 1
const speed = ref(2)

const onSpriteClick = () => {
  console.log('Pixi Sprite Clicked!', props.imageUrl)
  speed.value += 1
}

// Use onTick for animation loop.
onTick((delta) => {
  // Only animate if we have an imageUrl to display a sprite for
  if (!props.imageUrl) return

  spriteX.value += speed.value * direction * delta
  // Example boundary for an 800px wide canvas
  if (spriteX.value > 770 && direction === 1) {
    direction = -1
  } else if (spriteX.value < 30 && direction === -1) {
    direction = 1
  }
})
</script>

<style scoped>
/* Scoped CSS doesn't apply to PixiJS objects. */
</style>

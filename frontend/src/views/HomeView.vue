<template>
  <div class="home-screen">
    <header class="standard-header">
      <h1>App with EventManager & Vanilla PixiJS</h1>
      <MyStandardButton @click="handleStandardButtonClick" label="Vue Button" />
      <button @click="updatePixiDynamicContent">Update Pixi Content</button>
      <p v-if="lastPixiEventMessage" class="event-message">
        Last Pixi Event: <span>{{ lastPixiEventMessage }}</span>
      </p>
    </header>

    <div class="pixi-section">
      <h2>PixiJS Canvas</h2>
      <PixiCanvas
        :width="canvasWidth"
        :height="canvasHeight"
        :backgroundColor="0x1a1a1a"
        :sprites="pixiSprites"
        :texts="pixiTexts"
        :graphics="pixiGraphicsData"
      />
    </div>

    <footer class="standard-footer">
      <p>Footer Section</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import MyStandardButton from '../components/MyStandardButton.vue'
import PixiCanvas from '../components/PixiCanvas.vue'
import { useEventManager } from '../composables/EventManager' // Adjust path

const eventManager = useEventManager()
// Unique target for listeners registered by this HomeView instance
const componentTarget = { id: 'HomeViewComponent' }

const canvasWidth = ref(800)
const canvasHeight = ref(600)
const lastPixiEventMessage = ref('No Pixi events yet.')

const pixiSprites = reactive([
  { name: 'movingBunny', imageUrl: '/images/common/close.png', x: 150, y: 150, scale: 1.2 },
  {
    name: 'anotherMovingSprite',
    imageUrl: '/images/common/close.png',
    x: 600,
    y: 250,
    scale: 0.8,
  },
])

const pixiTexts = reactive([
  {
    name: 'titleText',
    content: 'Interactive PixiJS Scene',
    x: canvasWidth.value / 2,
    y: 40,
    style: { fill: 'white', fontSize: 32, fontWeight: 'bold', align: 'center' },
    anchor: { x: 0.5, y: 0.5 },
  },
  {
    name: 'infoText',
    content: 'Click on shapes!',
    x: canvasWidth.value / 2,
    y: 80,
    style: { fill: 'lightblue', fontSize: 20, align: 'center' },
    anchor: { x: 0.5, y: 0.5 },
  },
])

const pixiGraphicsData = reactive([
  {
    name: 'interactiveButton',
    type: 'rect',
    x: 100,
    y: canvasHeight.value - 100,
    width: 150,
    height: 50,
    fill: { color: 0x00cc66, alpha: 1 },
    stroke: { width: 3, color: 0xffffff, alpha: 0.8, alignment: 0.5 },
  }, // alignment: 0 (inner), 0.5 (center), 1 (outer)
  {
    name: 'glowingCircle',
    type: 'circle',
    x: canvasWidth.value - 150,
    y: canvasHeight.value - 100,
    radius: 40,
    fill: { color: 0xff3300, alpha: 0.9 },
    stroke: { width: 4, color: 0xffcc00, alpha: 1 },
  },
])

const handleStandardButtonClick = () => {
  lastPixiEventMessage.value = 'Standard Vue Button was clicked!'
  // Example of emitting an event that other parts of the app (or PixiCanvas) could listen to
  eventManager.emit('vueInteraction', { type: 'buttonClick', source: 'HomeView' })
}

const updatePixiDynamicContent = () => {
  const bunny = pixiSprites.find((s) => s.name === 'movingBunny')
  if (bunny) {
    bunny.x = Math.random() * (canvasWidth.value - 100) + 50
    bunny.y = Math.random() * (canvasHeight.value / 2) + 50 // Keep it in upper half
  }

  const buttonGraphic = pixiGraphicsData.find((g) => g.name === 'interactiveButton')
  if (buttonGraphic) {
    buttonGraphic.fill.color = Math.random() * 0xffffff // Change button color
  }
  const circleGraphic = pixiGraphicsData.find((g) => g.name === 'glowingCircle')
  if (circleGraphic) {
    circleGraphic.x = Math.random() * (canvasWidth.value - 100) + 50
    circleGraphic.radius = Math.random() * 20 + 30 // Change radius
  }
  lastPixiEventMessage.value = 'Pixi content updated randomly.'
}

// --- Event Handlers for Pixi Events ---
const handlePixiSpriteClicked = (payload) => {
  console.log('HomeView received pixiSpriteClicked:', payload)
  lastPixiEventMessage.value = `Sprite "${payload.name}" clicked at X:${payload.x.toFixed(0)}, Y:${payload.y.toFixed(0)}`
}

const handlePixiGraphicClicked = (payload) => {
  console.log('HomeView received pixiGraphicClicked:', payload)
  lastPixiEventMessage.value = `Graphic "${payload.name}" (${payload.type}) clicked.`
  // Example: If the glowingCircle is clicked, change its color specifically
  if (payload.name === 'glowingCircle') {
    const circle = pixiGraphicsData.find((g) => g.name === 'glowingCircle')
    if (circle && circle.fill) {
      circle.fill.color = 0x00ff00 // Turn it green
      setTimeout(() => {
        if (circle.fill) circle.fill.color = 0xff3300 // Revert after a delay
        lastPixiEventMessage.value = `Graphic "${payload.name}" color reverted.`
      }, 1000)
    }
  }
}

onMounted(() => {
  // Register listeners with EventManager
  eventManager.on('pixiSpriteClicked', handlePixiSpriteClicked, componentTarget)
  eventManager.on('pixiGraphicClicked', handlePixiGraphicClicked, componentTarget)
})

onUnmounted(() => {
  // Clean up listeners registered by this component instance to prevent memory leaks
  eventManager.off('pixiSpriteClicked', componentTarget)
  eventManager.off('pixiGraphicClicked', componentTarget)
  // Alternatively, if this component registered many listeners:
  // eventManager.removeAllEvent(componentTarget);
})
</script>

<style scoped>
.home-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px; /* Increased gap */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; /* Modern font stack */
  color: #333; /* Darker base text color */
  margin-top: 20px;
  padding-bottom: 30px;
}
.standard-header,
.standard-footer {
  background-color: #f8f9fa; /* Lighter background */
  padding: 25px; /* Increased padding */
  border-radius: 12px; /* Softer radius */
  text-align: center;
  width: calc(100% - 40px); /* Responsive width */
  max-width: 900px; /* Max width */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Softer shadow */
}
.standard-header button,
.standard-header .my-button {
  margin: 0 8px; /* Spacing for buttons */
}
.event-message {
  margin-top: 15px;
  padding: 10px;
  background-color: #eef7ff; /* Light blue background for message */
  border-left: 4px solid #337ab7; /* Accent border */
  color: #2a5074; /* Darker blue text */
  border-radius: 4px;
  min-height: 1.5em;
  text-align: left;
}
.event-message span {
  font-weight: 500;
}
.pixi-section {
  border: 1px solid #dee2e6; /* Lighter border */
  border-radius: 12px;
  padding: 15px;
  background-color: #ffffff; /* White background for canvas section */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pixi-section h2 {
  margin-bottom: 15px;
  color: #495057; /* Subdued heading color */
  font-weight: 600;
}
/* MyStandardButton.vue styling should be self-contained or globally defined */
</style>

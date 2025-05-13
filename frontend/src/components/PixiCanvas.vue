<template>
  <div ref="pixiContainer" class="pixi-canvas-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as PIXI from 'pixi.js'

const props = defineProps({
  width: {
    type: Number,
    default: 800,
  },
  height: {
    type: Number,
    default: 600,
  },
  backgroundColor: {
    type: Number, // PixiJS colors are often hex numbers e.g., 0x1099bb
    default: 0x222222, // Dark grey
  },
  sprites: {
    // Array of sprite configurations
    type: Array,
    default: () => [], // e.g., [{ imageUrl: '/path/to/img.png', x: 100, y: 100, scale: 1, name: 'sprite1' }]
  },
  texts: {
    // Array of text configurations
    type: Array,
    default: () => [], // e.g., [{ content: 'Hello', x: 50, y: 50, style: { fill: 'white' } }]
  },
})

const pixiContainer = ref(null)
let pixiApp = null
const activeSprites = new Map() // To keep track of PIXI.Sprite objects for updates/removal

onMounted(async () => {
  if (!pixiContainer.value) return

  // Initialize PixiJS Application
  pixiApp = new PIXI.Application()
  await pixiApp.init({
    width: props.width,
    height: props.height,
    backgroundColor: props.backgroundColor,
    antialias: true,
    autoDensity: true, // Adjusts for device pixel ratio
    // Consider resizeTo: pixiContainer.value for responsive canvas, but requires more handling.
  })

  pixiContainer.value.appendChild(pixiApp.view) // pixiApp.view is the canvas element

  // Initial rendering of texts and sprites
  await renderTexts()
  await renderSprites()

  // Example animation loop (can be customized or controlled via props)
  let elapsed = 0.0
  pixiApp.ticker.add((ticker) => {
    elapsed += ticker.deltaTime
    // Animate sprites if needed
    activeSprites.forEach((spriteData) => {
      if (spriteData.name === 'movingBunny') {
        // Example specific animation
        spriteData.pixiObject.x = 100 + Math.cos(elapsed / 50.0) * 100.0
        spriteData.pixiObject.rotation += 0.01 * ticker.deltaTime
      }
      if (spriteData.name === 'anotherMovingSprite') {
        spriteData.pixiObject.y = 400 + Math.sin(elapsed / 30.0) * 50.0
      }
    })
  })
})

// Function to render texts based on props
async function renderTexts() {
  if (!pixiApp) return
  // Clear existing texts or manage them selectively if they can change
  // For simplicity, this example re-adds them; a more complex app would update/remove.
  props.texts.forEach(async (textConfig) => {
    const textStyle = new PIXI.TextStyle(textConfig.style || { fill: 'white', fontSize: 24 })
    const pixiText = new PIXI.Text({ text: textConfig.content, style: textStyle })
    pixiText.x = textConfig.x
    pixiText.y = textConfig.y
    if (textConfig.anchor) {
      pixiText.anchor.set(textConfig.anchor.x, textConfig.anchor.y)
    }
    pixiApp.stage.addChild(pixiText)
  })
}

// Function to render sprites based on props
async function renderSprites() {
  if (!pixiApp) return

  // Basic diffing/updating example: remove sprites no longer in props
  const newSpriteNames = new Set(props.sprites.map((s) => s.name))
  activeSprites.forEach((spriteData, name) => {
    if (!newSpriteNames.has(name)) {
      pixiApp.stage.removeChild(spriteData.pixiObject)
      spriteData.pixiObject.destroy()
      activeSprites.delete(name)
    }
  })

  for (const spriteConfig of props.sprites) {
    if (!spriteConfig.name || !spriteConfig.imageUrl) continue

    if (activeSprites.has(spriteConfig.name)) {
      // Update existing sprite (position, scale, texture if changed)
      const spriteData = activeSprites.get(spriteConfig.name)
      spriteData.pixiObject.x = spriteConfig.x
      spriteData.pixiObject.y = spriteConfig.y
      spriteData.pixiObject.scale.set(spriteConfig.scale || 1)
      // More complex: handle texture change if spriteConfig.imageUrl !== spriteData.imageUrl
    } else {
      // Create new sprite
      try {
        const texture = await PIXI.Assets.load(spriteConfig.imageUrl)
        const pixiSprite = new PIXI.Sprite(texture)
        pixiSprite.x = spriteConfig.x
        pixiSprite.y = spriteConfig.y
        pixiSprite.anchor.set(0.5) // Common default
        pixiSprite.scale.set(spriteConfig.scale || 1)
        pixiSprite.eventMode = 'static' // For interaction
        pixiSprite.on('pointertap', () => {
          console.log(`${spriteConfig.name} clicked!`)
          // Example: Make it jump or change slightly
          pixiSprite.y -= 10
          setTimeout(() => {
            pixiSprite.y += 10
          }, 100)
        })

        pixiApp.stage.addChild(pixiSprite)
        activeSprites.set(spriteConfig.name, {
          pixiObject: pixiSprite,
          imageUrl: spriteConfig.imageUrl,
        })
      } catch (error) {
        console.error(`Failed to load texture for ${spriteConfig.name}:`, error)
      }
    }
  }
}

// Watch for changes in props to re-render Pixi elements
watch(() => props.texts, renderTexts, { deep: true })
watch(() => props.sprites, renderSprites, { deep: true })

onUnmounted(() => {
  if (pixiApp) {
    // Clean up PixiJS application
    pixiApp.destroy(true, { children: true, texture: true, basePath: true }) // true removes canvas from DOM
    pixiApp = null
    activeSprites.clear()
  }
})
</script>

<style scoped>
.pixi-canvas-container {
  /* You can style the container div if needed */
  /* The canvas itself will be appended by PixiJS */
  width: fit-content; /* Or match prop width/height */
  height: fit-content;
  border: 1px solid #555; /* Example border */
  border-radius: 8px;
  overflow: hidden; /* If canvas is larger than container */
}
/* Styling the canvas itself, if necessary, might require :deep() or global styles,
     but often Pixi handles its own presentation within the container. */
</style>

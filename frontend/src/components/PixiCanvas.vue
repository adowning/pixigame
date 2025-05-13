<template>
  <div ref="pixiContainer" class="pixi-canvas-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as PIXI from 'pixi.js'
import { useEventManager } from '../composables/EventManager' // Adjust path if necessary

const props = defineProps({
  width: { type: Number, default: 800 },
  height: { type: Number, default: 600 },
  backgroundColor: { type: Number, default: 0x222222 },
  sprites: { type: Array, default: () => [] }, // e.g., [{ name: 's1', imageUrl: '/img.png', x: 0, y: 0, scale: 1}]
  texts: { type: Array, default: () => [] }, // e.g., [{ name: 't1', content: 'Hi', x:0, y:0, style:{...}}]
  graphics: { type: Array, default: () => [] }, // e.g., [{ name: 'g1', type: 'rect', x:0, y:0, width:50, height:50, fill:0xff0000}]
})

const pixiContainer = ref(null)
let pixiApp = null
const activeSprites = new Map()
const activeGraphics = new Map()
const activeTexts = new Map() // Added for managing texts similarly

const eventManager = useEventManager()
// const componentTarget = { id: 'PixiCanvasComponent' }; // For EventManager if this component itself listens

onMounted(async () => {
  if (!pixiContainer.value) return

  pixiApp = new PIXI.Application()
  await pixiApp.init({
    width: props.width,
    height: props.height,
    backgroundColor: props.backgroundColor,
    antialias: true,
    autoDensity: true,
    // resizeTo: pixiContainer.value // For responsive canvas, requires more setup
  })
  pixiContainer.value.appendChild(pixiApp.view)

  // Initial rendering
  await renderAllElements()

  pixiApp.ticker.add(animateElements)
})

function animateElements(ticker) {
  // Example animation logic (can be expanded or driven by props)
  activeSprites.forEach((spriteData) => {
    if (spriteData.name === 'movingBunny') {
      spriteData.pixiObject.x += Math.cos(pixiApp.ticker.lastTime / 500) * 1.5 * ticker.deltaTime
      spriteData.pixiObject.rotation += 0.005 * ticker.deltaTime
    }
    if (spriteData.name === 'anotherMovingSprite') {
      spriteData.pixiObject.y += Math.sin(pixiApp.ticker.lastTime / 400) * 1 * ticker.deltaTime
    }
  })
}

async function renderAllElements() {
  await renderTexts()
  await renderSprites()
  await renderGraphics()
}

async function renderTexts() {
  if (!pixiApp) return
  const newTextNames = new Set(props.texts.map((t) => t.name))

  activeTexts.forEach((textData, name) => {
    if (!newTextNames.has(name)) {
      pixiApp.stage.removeChild(textData.pixiObject)
      textData.pixiObject.destroy()
      activeTexts.delete(name)
    }
  })

  for (const textConfig of props.texts) {
    if (!textConfig.name) continue
    let pixiText
    if (activeTexts.has(textConfig.name)) {
      pixiText = activeTexts.get(textConfig.name).pixiObject
      pixiText.text = textConfig.content // Update text content
      pixiText.style = new PIXI.TextStyle(textConfig.style || { fill: 'white', fontSize: 24 })
      pixiText.x = textConfig.x
      pixiText.y = textConfig.y
    } else {
      const textStyle = new PIXI.TextStyle(textConfig.style || { fill: 'white', fontSize: 24 })
      pixiText = new PIXI.Text({ text: textConfig.content, style: textStyle })
      pixiText.x = textConfig.x
      pixiText.y = textConfig.y
      if (textConfig.anchor) pixiText.anchor.set(textConfig.anchor.x, textConfig.anchor.y)
      pixiApp.stage.addChild(pixiText)
      activeTexts.set(textConfig.name, { pixiObject: pixiText, name: textConfig.name })
    }
  }
}

async function renderSprites() {
  if (!pixiApp) return
  const newSpriteNames = new Set(props.sprites.map((s) => s.name))

  activeSprites.forEach((spriteData, name) => {
    if (!newSpriteNames.has(name)) {
      pixiApp.stage.removeChild(spriteData.pixiObject)
      // Smart texture destruction: only if not used elsewhere. For simplicity:
      spriteData.pixiObject.destroy({ children: true, texture: true, baseTexture: true })
      activeSprites.delete(name)
    }
  })

  for (const spriteConfig of props.sprites) {
    if (!spriteConfig.name || !spriteConfig.imageUrl) continue
    let pixiSprite
    if (activeSprites.has(spriteConfig.name)) {
      pixiSprite = activeSprites.get(spriteConfig.name).pixiObject
      pixiSprite.x = spriteConfig.x
      pixiSprite.y = spriteConfig.y
      pixiSprite.scale.set(spriteConfig.scale || 1)
      // Potentially update texture if imageUrl changed:
      // if (activeSprites.get(spriteConfig.name).imageUrl !== spriteConfig.imageUrl) {
      //   pixiSprite.texture = await PIXI.Assets.load(spriteConfig.imageUrl);
      //   activeSprites.get(spriteConfig.name).imageUrl = spriteConfig.imageUrl;
      // }
    } else {
      try {
        const texture = await PIXI.Assets.load(spriteConfig.imageUrl)
        pixiSprite = new PIXI.Sprite(texture)
        pixiSprite.x = spriteConfig.x
        pixiSprite.y = spriteConfig.y
        pixiSprite.anchor.set(0.5)
        pixiSprite.scale.set(spriteConfig.scale || 1)
        pixiSprite.eventMode = 'static'
        pixiSprite.cursor = 'pointer'
        pixiSprite.on('pointertap', () => {
          eventManager.emit('pixiSpriteClicked', {
            name: spriteConfig.name,
            x: pixiSprite.x,
            y: pixiSprite.y,
          })
        })
        pixiApp.stage.addChild(pixiSprite)
        activeSprites.set(spriteConfig.name, {
          pixiObject: pixiSprite,
          imageUrl: spriteConfig.imageUrl,
          name: spriteConfig.name,
        })
      } catch (error) {
        console.error(`PixiCanvas: Failed to load texture for ${spriteConfig.name}:`, error)
      }
    }
  }
}

async function renderGraphics() {
  if (!pixiApp) return
  const newGraphicNames = new Set(props.graphics.map((g) => g.name))

  activeGraphics.forEach((graphicData, name) => {
    if (!newGraphicNames.has(name)) {
      pixiApp.stage.removeChild(graphicData.pixiObject)
      graphicData.pixiObject.destroy()
      activeGraphics.delete(name)
    }
  })

  for (const graphicConfig of props.graphics) {
    if (!graphicConfig.name) continue
    let pixiGraphic
    if (activeGraphics.has(graphicConfig.name)) {
      pixiGraphic = activeGraphics.get(graphicConfig.name).pixiObject
    } else {
      pixiGraphic = new PIXI.Graphics()
      pixiGraphic.name = graphicConfig.name
      pixiApp.stage.addChild(pixiGraphic)
      activeGraphics.set(graphicConfig.name, { pixiObject: pixiGraphic, name: graphicConfig.name })

      pixiGraphic.eventMode = 'static' // Make it interactive
      pixiGraphic.cursor = 'pointer'
      pixiGraphic.on('pointertap', () => {
        eventManager.emit('pixiGraphicClicked', {
          // Emit event
          name: graphicConfig.name,
          type: graphicConfig.type,
          config: { ...graphicConfig },
        })
      })
    }

    // Draw/redraw the graphic
    pixiGraphic.clear()
    pixiGraphic.x = graphicConfig.x || 0
    pixiGraphic.y = graphicConfig.y || 0

    // Apply stroke style first if it exists, as fill will cover it for some methods
    if (graphicConfig.stroke) {
      const strokeStyle = graphicConfig.stroke
      pixiGraphic.stroke({
        width: strokeStyle.width || 1,
        color: strokeStyle.color || 0x000000,
        alpha: strokeStyle.alpha !== undefined ? strokeStyle.alpha : 1,
        alignment: strokeStyle.alignment !== undefined ? strokeStyle.alignment : 0.5, // Center alignment
      })
    }
    if (graphicConfig.fill) {
      // Apply fill after stroke setup
      pixiGraphic.fill(
        graphicConfig.fill.color !== undefined ? graphicConfig.fill.color : graphicConfig.fill,
        graphicConfig.fill.alpha !== undefined ? graphicConfig.fill.alpha : 1,
      )
    }

    if (graphicConfig.type === 'rect') {
      pixiGraphic.rect(0, 0, graphicConfig.width || 50, graphicConfig.height || 50)
    } else if (graphicConfig.type === 'circle') {
      pixiGraphic.circle(0, 0, graphicConfig.radius || 25)
    }
    // Add more shapes as needed: else if (graphicConfig.type === 'polygon') ...

    if (graphicConfig.fill || graphicConfig.stroke) {
      // ensure fill/stroke is applied
      if (graphicConfig.fill) pixiGraphic.fill()
      if (graphicConfig.stroke) pixiGraphic.stroke() // This will apply the stroke to the defined path
    }
  }
}

// Watchers for prop changes to re-render Pixi elements
watch(() => props.texts, renderTexts, { deep: true })
watch(() => props.sprites, renderSprites, { deep: true })
watch(() => props.graphics, renderGraphics, { deep: true })

onUnmounted(() => {
  if (pixiApp) {
    pixiApp.destroy(true, { children: true, texture: true, basePath: true })
    pixiApp = null
  }
  activeSprites.clear()
  activeGraphics.clear()
  activeTexts.clear()
  // If PixiCanvas itself were listening to global events:
  // eventManager.removeAllEvent(componentTarget);
})
</script>

<style scoped>
.pixi-canvas-container {
  width: fit-content; /* Or bind to props.width/height if you want CSS to also control size */
  height: fit-content;
  border: 1px solid #4a4a4a;
  border-radius: 8px;
  overflow: hidden; /* Important if canvas size is fixed by Pixi but container might be styled smaller */
  /* background-color: #1e1e1e; Ensure this doesn't conflict with Pixi's background */
}
</style>

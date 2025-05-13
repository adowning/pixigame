// // frontend/src/initRenderer.ts
// import * as PIXI from 'pixi.js'
// import { PAGE_SIZE_DEFAULT } from '@/libs/common/Config'

// const initRenderer = (): PIXI.Renderer | PIXI.WebGLRenderer | PIXI.WebGPURenderer => {
//   console.log('Attempting to create PIXI.Application instance...')
//   let app: PIXI.Application

//   try {
//     app = new PIXI.Application() // This is where the core renderer object is typically instantiated internally.
//     console.log('PIXI.Application instance created.')
//     if (!app.renderer) {
//       console.error(
//         'app.renderer is null/undefined immediately after new PIXI.Application(). This is the critical issue.',
//       )
//       // Log WebGL support
//       const webGLSupported = PIXI.utils.isWebGLSupported() // Old v5/v6 way
//       // For v8, check capabilities:
//       const capabilities = PIXI.Features.getCapabilities()
//       console.log('PIXI Capabilities:', capabilities)
//       console.log('WebGL 1 Supported by PIXI Features:', capabilities.webGL1)
//       console.log('WebGL 2 Supported by PIXI Features:', capabilities.webGL2)

//       // Try to detect WebGL support directly (browser check)
//       try {
//         const canvas = document.createElement('canvas')
//         const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
//         if (gl && gl instanceof WebGLRenderingContext) {
//           console.log('Browser supports WebGL directly.')
//         } else {
//           console.log('Browser does NOT support WebGL directly.')
//         }
//       } catch (e) {
//         console.error('Error checking WebGL support directly:', e)
//       }

//       throw new Error(
//         'PIXI.Application failed to create a renderer instance (checked immediately).',
//       )
//     }
//     console.log('app.renderer seems to be available initially.')
//   } catch (e) {
//     console.error('Error during new PIXI.Application():', e)
//     throw e // Re-throw the error
//   }

//   app
//     .init({
//       width: PAGE_SIZE_DEFAULT.width,
//       height: PAGE_SIZE_DEFAULT.height,
//       resolution: window.devicePixelRatio || 1,
//       autoDensity: true,
//       antialias: true,
//       backgroundAlpha: 0,
//       // preference: "webgl" // You can try uncommenting this to force WebGL
//     })
//     .then(() => {
//       if (!app.canvas) {
//         console.error('PIXI Application canvas is not available after init.')
//         return
//       }
//       app.canvas.className = 'renderArea'
//       app.canvas.addEventListener('contextmenu', (e) => e.preventDefault())

//       const domgame = document.getElementById('AppGame')
//       if (domgame) {
//         domgame.appendChild(app.canvas)
//         const domOverlayContainer = document.createElement('div')
//         domOverlayContainer.id = 'dom_overlay_container'
//         domOverlayContainer.style.cssText = `pointer-events:none; overflow:hidden; width:${PAGE_SIZE_DEFAULT.width}px; height:${PAGE_SIZE_DEFAULT.height}px; position: absolute; left: 0; top: 0; display: block;`
//         domgame.appendChild(domOverlayContainer)
//       } else {
//         console.warn('#AppGame element not found in DOM. PIXI canvas was not appended.')
//       }
//     })
//     .catch((err) => {
//       console.error('Error during PIXI Application initialization (app.init promise):', err)
//       // It's possible the renderer was created but init failed.
//     })

//   return app.renderer // This line is reached before the init() promise resolves.
// }

// export default initRenderer
import * as PIXI from 'pixi.js'

const initRenderer = (): PIXI.Renderer => {
  let app
  try {
    app = new PIXI.Application() // No options yet
    if (!app.renderer) {
      throw new Error('Basic PIXI.Application() failed to create renderer.')
    }
    // Initialize with minimal options *after* checking if app.renderer was created
    app.init({ width: 100, height: 100, backgroundAlpha: 0 }).catch(console.error)
  } catch (e) {
    console.error('Error in bare minimum PIXI.Application setup:', e)
    throw e
  }
  return app.renderer
}
export default initRenderer

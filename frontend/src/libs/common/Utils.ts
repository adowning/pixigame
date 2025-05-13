import * as PIXI from 'pixi.js'
import { Games } from './Config'
// This specific import from @pixi/utils is fine if you have @pixi/utils installed
// and is the correct way to get specific utilities in v8 if they are in such packages.
import { isMobile as isMobilePixi } from '@pixi/utils'

// This export uses the legacy PIXI.Loader, which is fine,
// but PIXI.Assets is the modern approach in v8 for new asset loading.
export let gamesLoader: PIXI.Loader

export const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
export const isMobile = isMobilePixi.tablet || isMobilePixi.phone

/**
 * Load config.json file and then game assets using the legacy PIXI.Loader.
 */
export async function loadJsonData(): Promise<void> {
  // Changed return type, as it resolves with no specific value
  return new Promise((resolve, reject) => {
    const jsonPath = 'config.json' // Make sure this path is correct (e.g., relative to public folder)
    const jsonLoader = new PIXI.Loader() // Using legacy loader

    jsonLoader.add('items', jsonPath)

    jsonLoader.onError.add((error, loader, resource) => {
      console.error('Error loading config.json:', error.message, 'URL:', resource?.url)
      // It's often better to reject the promise on a critical error like this
      // so the caller can handle it, instead of resolving with an empty array.
      reject(new Error(`Failed to load config.json: ${error.message}`))
    })

    jsonLoader.load((loaderInstance, resources) => {
      // Check if resources and 'items' exist and have data
      if (!resources || !resources.items || !resources.items.data) {
        console.error('Config.json loaded but is empty or malformed. Resources:', resources)
        // Decide how to handle this: resolve, reject, or load default games
        // For now, let's assume it might be an issue and we can't proceed with game loading.
        reject(new Error('Config.json is empty or malformed.'))
        return
      }

      gamesLoader = PIXI.Loader.shared // Assigning to the exported legacy loader

      const gameData = resources.items.data.games
      if (gameData) {
        // Example: Assuming structure { part1: [], part2: [], part3: [] }
        const parts = [gameData.part1, gameData.part2, gameData.part3]
        parts.forEach((part, partIndex) => {
          if (Array.isArray(part)) {
            part.forEach((item: any, itemIndex: number) => {
              // Ensure item has id, src, size, tag before pushing
              if (item && item.id && item.src && item.size && item.tag) {
                const gameKey = `game${partIndex + 1}_${itemIndex}`
                Games.push({
                  part: (partIndex + 1).toString(),
                  img: gameKey,
                  id: item.id,
                  size: item.size,
                  tag: item.tag,
                })
                gamesLoader.add(gameKey, item.src)
              } else {
                console.warn('Skipping malformed game item in config.json:', item)
              }
            })
          }
        })
      } else {
        console.warn('No "games" data found in config.json.')
      }

      gamesLoader.onComplete.add(() => {
        // Correct way to clear global texture caches in PixiJS v8,
        // mimicking the old PIXI.utils.clearTextureCache behavior
        // which primarily dealt with PIXI.Texture.Cache and PIXI.BaseTexture.Cache.

        // For PIXI.Texture.Cache (often aliased or managed by PIXI.Assets now for assets loaded via PIXI.Assets)
        // Since PIXI.Loader populates these global caches, we clear them here.
        for (const key of Object.keys(PIXI.Texture.Cache)) {
          PIXI.Texture.removeFromCache(key)
          // If you also need to destroy the texture instance to free GPU memory:
          // const texture = PIXI.Texture.Cache[key];
          // if (texture) texture.destroy();
          // delete PIXI.Texture.Cache[key]; // Or just delete if that's closer to old behavior
        }

        // For PIXI.BaseTexture.Cache
        for (const key of Object.keys(PIXI.BaseTexture.Cache)) {
          PIXI.BaseTexture.removeFromCache(key)
          // If you also need to destroy the base texture instance:
          // const baseTexture = PIXI.BaseTexture.Cache[key];
          // if (baseTexture) baseTexture.destroy();
          // delete PIXI.BaseTexture.Cache[key]; // Or just delete
        }
        console.log('Texture caches cleared (emulating old clearTextureCache).')
        resolve()
      })

      gamesLoader.onError.add((error, loader, resource) => {
        console.error(
          'Error loading game assets with gamesLoader:',
          error.message,
          'URL:',
          resource?.url,
        )
        // Handle individual asset load errors if necessary, loader might still complete.
      })

      gamesLoader.load()
    })
  })
}

/**
 * Enable/disable watermark
 * @param visible true/false
 */
export function setWatermark(visible: boolean) {
  // This function relies on jQuery ($) and a specific DOM structure.
  // Ensure jQuery is available if you intend to use this.
  // Consider a Vue-specific way to handle this if jQuery is not part of the project.
  const watermarkElement = document.querySelector('.watermark-game') as HTMLElement | null
  if (watermarkElement) {
    watermarkElement.style.visibility = visible ? 'visible' : 'hidden'
  }
}

export function convertTimeToStr(totalSeconds: number): (string | number)[] {
  const days = Math.floor(totalSeconds / 86400)
  let secs = totalSeconds - days * 86400

  const hours = Math.floor(secs / 3600)
  secs -= hours * 3600

  const minutes = Math.floor(secs / 60)
  secs -= minutes * 60

  const finalSeconds = Math.floor(secs)

  const hh: string = hours < 10 ? `0${hours}` : `${hours}`
  const mm: string = minutes < 10 ? `0${minutes}` : `${minutes}`
  const ss: string = finalSeconds < 10 ? `0${finalSeconds}` : `${finalSeconds}`

  return [hh, mm, ss] // No days included in original return, but calculated
}

export function disableButton(element: Element | null) {
  if (element && element.classList) {
    element.classList.add('grey-color')
  }
}

export function enableButton(element: Element | null) {
  if (element && element.classList) {
    element.classList.remove('grey-color')
  }
}

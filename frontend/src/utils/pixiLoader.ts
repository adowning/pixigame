// import * as PIXI from 'pixi.js'
// import { Loader } from 'pixi.js'

// Initialize once and export the instance
// export const imagesLoader: PIXI.Loader = Loader

import * as PIXI from 'pixi.js'
import { ref } from 'vue' // If in a Vue component
import { EE } from '../Game'
// In your Vue component's <script setup lang="ts">
const loadingProgress = ref(0) // 0 to 1

export async function loadGameAssets(assetsToLoad: any[]) {
  //   const assetsToLoad = [
  //     { alias: 'player', src: 'path/to/player.png' },
  //     { alias: 'enemy', src: 'path/to/enemy.png' },
  //     { alias: 'background', src: 'path/to/background.jpg' },
  //     // Add more assets: textures, json, fonts, sounds etc.
  //     // { alias: 'levelData', src: 'path/to/level.json' },
  //     // { alias: 'gameFont', src: 'path/to/yourFont.fnt' },
  //   ]

  // Optional: Add assets individually or in groups if preferred
  // PIXI.Assets.add('player', 'path/to/player.png');
  // PIXI.Assets.addBundle('level1', {
  //     enemy: 'path/to/enemy.png',
  //     background: 'path/to/background.jpg',
  // });

  try {
    console.log('Starting asset loading...')
    // The progress callback is the second argument to load()
    // when loading an array of assets or a bundle.
    const loadedAssets = await PIXI.Assets.load(
      assetsToLoad.map((a) => a.src), // Or just an array of URLs/aliases
      (progress) => {
        loadingProgress.value = progress // progress is a value from 0 to 1
        // console.log('Loading progress:', Math.round(progress * 100) + '%')
        // Update your UI here (e.g., a progress bar width)
        // progressBarElement.style.width = (progress * 100) + '%';
        EE.emit('progress', progress)
      },
    )
    console.log('All assets loaded successfully!')
    // EE.emit('progress', 999)
    EE.emit('SHOW_UPDATE_POPUP')
    EE.emit('CLEAR_TOP_WINDOWS')
    EE.emit('SHOW_LOGIN')
    EE.emit('SHOW_ADV')
    EE.emit('SHOW_MAINTEN')
    EE.emit('PAGE_INFO')
    EE.emit('SHOW_REG')
    EE.emit('SHOW_FREE_PLAY')
    EE.emit('SHOW_SIGNPHONE')

    // From your example, these were the active ones:
    EE.emit('BONUS_WIN_RANK') // You'll need a component to listen and react to this
    EE.emit('GO_GAME')
    // Now you can use the loaded assets
    // For assets loaded by URL directly:
    const playerTexture = loadedAssets['path/to/player.png']
    const enemyTexture = loadedAssets['path/to/enemy.png']

    if (playerTexture) {
      const playerSprite = new PIXI.Sprite(playerTexture)
      // Add sprite to stage, etc.
    }

    // If you used aliases with PIXI.Assets.add() before PIXI.Assets.load([...aliases]):
    // const playerTextureAliased = PIXI.Assets.get('player');
    // const enemyTextureAliased = PIXI.Assets.get('enemy');
  } catch (error) {
    console.error('Error loading assets:', error)
  }
}

<template>
  <div class="modal-windows-cont">
    <LoginWin v-if="currentPage === PAGE_LOGIN" @close="onCloseAll" />
    <RegWin v-if="currentPage === PAGE_REG" @close="onCloseAll" />
    <AdvWin v-if="currentPage === PAGE_ADV" @close="onCloseAll" />
    <FreePlayWin v-if="currentPage === PAGE_FREE_PLAY" @close="onCloseAll" />
    <SignPhoneWin v-if="currentPage === PAGE_SIGNPHONE" @close="onCloseAll" />
    <InfoWin
      v-if="currentPage === PAGE_INFO"
      @close="onCloseAll"
      @goChangePass="goOpenChangePass"
      @goAddPhone="goAddPhone"
    />
    <NewPassWin v-if="currentPage === PAGE_NPASS" @close="onCloseAll" />

    <MaintenenceWin v-if="currentPage === PAGE_MAINTEN" />
    <NewsWin v-if="currentPage === PAGE_NEWS" @close="onCloseAll" />
    <NewWebsiteWin v-if="currentPage === PAGE_NEW_WEBSITE" @close="onCloseAll" />
    <UpdatePopupWin v-if="currentPage === PAGE_UPDATE_POPUP" @close="onCloseAll" />

    <BonusWin
      v-if="
        currentPage === PAGE_BONUS ||
        currentPage === DAILY_BONUS_WIN ||
        currentPage === WEEKLY_BONUS_WIN
      "
      :isDaily="
        currentPage === DAILY_BONUS_WIN || (currentPage === PAGE_BONUS && defaultBonusIsDaily)
      "
      @close="onCloseAll"
    />
    <BonusRule
      v-if="currentPage === DAILY_BONUS_RULE || currentPage === WEEKLY_BONUS_RULE"
      :isDaily="currentPage === DAILY_BONUS_RULE"
      @close="onCloseAll"
    />
    <BonusRank v-if="currentPage === BONUS_WIN_RANK" @close="onCloseAll" />
    <ReferFriend v-if="currentPage === REFER_FRIEND" @close="onCloseAll" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// Assuming EE is from your Game.ts or a similar global PIXI setup
// Adjust path as necessary. If Game.ts is in src/Game.ts for example:
import { EE } from '@/Game' // Or '../Game' depending on actual location relative to 'components'

// Import the Vue versions of your window components
// These will need to be created/converted separately.
import LoginWin from './windows/LoginWin.vue'
import RegWin from './windows/RegWin.vue'
import AdvWin from './windows/AdvWin.vue'
import FreePlayWin from './windows/FreePlayWin.vue'
import SignPhoneWin from './windows/SignPhoneWin.vue'
import InfoWin from './windows/InfoWin.vue'
import NewPassWin from './windows/NewPassWin.vue'
import MaintenenceWin from './windows/MaintenenceWin.vue'
import NewsWin from './windows/NewsWin.vue'
import NewWebsiteWin from './windows/NewWebsiteWin.vue' // Assuming NewWebsite.jsx -> NewWebsiteWin.vue
import BonusWin from './windows/BonusWin.vue'
import UpdatePopupWin from './windows/UpdatePopupWin.vue'
import BonusRule from './windows/BonusRule.vue'
import BonusRank from './windows/BonusRank.vue'
import ReferFriend from './windows/ReferFriend.vue'

// Define page constants (could also be imported from a shared constants file)
const PAGE_LOGIN = 'PAGE_LOGIN'
const PAGE_REG = 'PAGE_REG'
const PAGE_ADV = 'PAGE_ADV'
const PAGE_FREE_PLAY = 'PAGE_FREE_PLAY'
const PAGE_SIGNPHONE = 'PAGE_SIGNPHONE'
const PAGE_INFO = 'PAGE_INFO'
const PAGE_NPASS = 'PAGE_NPASS'
const PAGE_MAINTEN = 'PAGE_MAINTEN'
const PAGE_NEWS = 'PAGE_NEWS'
const PAGE_NEW_WEBSITE = 'PAGE_NEW_WEBSITE'
const PAGE_BONUS = 'PAGE_BONUS' // General bonus page
const PAGE_UPDATE_POPUP = 'PAGE_UPDATE_POPUP'
const DAILY_BONUS_RULE = 'DAILY_BONUS_RULE'
const WEEKLY_BONUS_RULE = 'WEEKLY_BONUS_RULE'
const DAILY_BONUS_WIN = 'DAILY_BONUS_WIN'
const WEEKLY_BONUS_WIN = 'WEEKLY_BONUS_WIN'
const BONUS_WIN_RANK = 'BONUS_WIN_RANK'
const REFER_FRIEND = 'REFER_FRIEND'

const currentPage = ref('')
// const dataForWindow = ref(null); // If you need to pass specific data to a window

// You might need a default for `isDaily` if PAGE_BONUS is shown without specific win context
const defaultBonusIsDaily = ref(true) // Or based on some game state

const onCloseAll = () => {
  currentPage.value = ''
}

const goOpenChangePass = () => {
  currentPage.value = PAGE_NPASS
}

const goAddPhone = () => {
  // Original was: //this.setState({CURRENT_PAGE: PAGE_REG});
  // Decide if this should open PAGE_REG or PAGE_SIGNPHONE
  currentPage.value = PAGE_SIGNPHONE // Or PAGE_REG
}

// Event handlers to update currentPage
const showPage = (pageName: string) => {
  // console.log(`Showing page: ${pageName}`);
  currentPage.value = pageName
}

onMounted(() => {
  EE.on('CLEAR_TOP_WINDOWS', onCloseAll)
  EE.on('SHOW_ADV', () => showPage(PAGE_ADV))
  EE.on('SHOW_REG', () => showPage(PAGE_REG))
  EE.on('SHOW_FREE_PLAY', () => showPage(PAGE_FREE_PLAY))
  EE.on('SHOW_LOGIN', () => showPage(PAGE_LOGIN))
  EE.on('SHOW_MAINTEN', () => showPage(PAGE_MAINTEN))
  EE.on('SHOW_SIGNPHONE', () => showPage(PAGE_SIGNPHONE))
  EE.on('SHOW_INFO', () => showPage(PAGE_INFO))
  EE.on('SHOW_NEWS', () => showPage(PAGE_NEWS))
  EE.on('SHOW_NEW_WEBSITE', () => showPage(PAGE_NEW_WEBSITE))
  EE.on('SHOW_NPASS', goOpenChangePass) // Keeps original direct function call
  EE.on('SHOW_BONUS', () => showPage(PAGE_BONUS))
  EE.on('SHOW_UPDATE_POPUP', () => showPage(PAGE_UPDATE_POPUP))
  EE.on('WEEKLY_BONUS_WIN', () => showPage(WEEKLY_BONUS_WIN))
  EE.on('DAILY_BONUS_WIN', () => showPage(DAILY_BONUS_WIN))
  EE.on('WEEKLY_BONUS_RULE', () => showPage(WEEKLY_BONUS_RULE))
  EE.on('DAILY_BONUS_RULE', () => showPage(DAILY_BONUS_RULE))
  EE.on('BONUS_WIN_RANK', () => showPage(BONUS_WIN_RANK))
  EE.on('REFER_FRIEND', () => showPage(REFER_FRIEND))
})

onUnmounted(() => {
  EE.off('CLEAR_TOP_WINDOWS', onCloseAll)
  EE.off('SHOW_ADV') // eventemitter3's `off` can remove all listeners for an event if only eventName is provided
  EE.off('SHOW_REG')
  EE.off('SHOW_FREE_PLAY')
  EE.off('SHOW_LOGIN')
  EE.off('SHOW_MAINTEN')
  EE.off('SHOW_SIGNPHONE')
  EE.off('SHOW_INFO')
  EE.off('SHOW_NEWS')
  EE.off('SHOW_NEW_WEBSITE')
  EE.off('SHOW_NPASS', goOpenChangePass)
  EE.off('SHOW_BONUS')
  EE.off('SHOW_UPDATE_POPUP')
  EE.off('WEEKLY_BONUS_WIN')
  EE.off('DAILY_BONUS_WIN')
  EE.off('WEEKLY_BONUS_RULE')
  EE.off('DAILY_BONUS_RULE')
  EE.off('BONUS_WIN_RANK')
  EE.off('REFER_FRIEND')
})
</script>

<style scoped>
.modal-windows-cont {
  position: fixed; /* Or relative, depending on how you integrate it */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* Container itself shouldn't block, modals will enable pointer events */
  z-index: 999; /* Ensure it's above game canvas but potentially below other global UI */
}

/* Each individual modal window component should handle its own styling,
     including position (e.g., fixed, centered), background, z-index (higher than container),
     and enabling pointer-events: auto; */
</style>

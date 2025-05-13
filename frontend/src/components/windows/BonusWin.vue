<template>
  <div className="modal-window-bonuswin">
    <div className="modal-window-bonus-win-cont">
      <img
        draggable="false"
        :src="`images/frenzy/bonus/${isDaily ? 'daily_bonus_win' : 'weekly_bonus_win'}.png`"
        alt=""
        className="carousel__item"
      />
      <img
        className="modal-window-bonus-win-close"
        @click="onClose"
        src="/images/frenzy/bonus_close_2.png"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { EE } from '../../Game'
import '@/assets/css/bonuswin.css'
import { PAGE_SIZE_DEFAULT } from '@/libs/common/Config'

export default {
  props: ['onClose', 'isDaily'],
  methods: {
    onResize(data) {
      const cont = document.getElementsByClassName('modal-window-bonus-win-cont')[0]
      const sc = Math.min(data.h / PAGE_SIZE_DEFAULT.height, data.w / PAGE_SIZE_DEFAULT.width)
      if (cont) {
        cont.style.transform = `scale(${sc})`
      }
    },
    onClose() {
      this.$emit('close')
    },
  },
  mounted() {
    EE.addListener('RESIZE', this.onResize)
    EE.emit('FORCE_RESIZE')
  },
}
</script>

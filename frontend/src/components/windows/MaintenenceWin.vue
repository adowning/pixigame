<template>
  <div className="modal-window-maintenence">
    <div className="modal-window-maintenence__scale-cont">
      <div className="modal-window-maintenence__down">
        <img
          className="modal-window-maintenence__text"
          src="/images/frenzy/maintenence.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import { EE } from '../../Game'
import '@/assets/css/maintenence.css'
import { PAGE_SIZE_DEFAULT } from '@/libs/common/Config'

export default {
  mounted() {
    EE.addListener('RESIZE', this.onResize)
    EE.emit('FORCE_RESIZE')
  },
  beforeUnmount() {
    clearInterval(this.int)
  },
  methods: {
    onResize(data) {
      const cont = document.getElementsByClassName('modal-window-maintenence__scale-cont')[0]
      const sc = Math.min(data.h / PAGE_SIZE_DEFAULT.height, data.w / PAGE_SIZE_DEFAULT.width)
      if (cont) {
        cont.style.transform = `scale(${sc})`
      }
    },
  },
}
</script>

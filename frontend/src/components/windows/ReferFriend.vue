<template>
  <div className="modal-window-refer-friend">
    <div className="modal-window-bonus__scale-cont">
      <img
        className="modal-window-refer-friend__close"
        @click="onClose"
        src="/images/frenzy/bonus_close_2.png"
        alt=""
      />

      <div className="carousel__image">
        <img
          draggable="false"
          src="/images/frenzy/refer_friend_bg.png"
          alt=""
          className="carousel__item"
        />

        <div className="user-code" id="my_code">
          <input type="text" readOnly="{true}" ref="myCodeRef" :value="myCode" />
          <button @click="onCopy">
            <img src="/images/frenzy/copy_btn.png" alt="" draggable="false" />
          </button>
        </div>
        <span type="text" className="left-people-cnt">{{ leftPeopleCnt }}</span>

        <div className="progress-bar">
          <div className="progress-done" :style="{ width: betRate + '%' }"></div>
        </div>

        <div className="user-code" id="friend_code">
          <input type="text" className="user-code" />
          <button>
            <img src="/images/frenzy/confirm_btn.png" alt="" draggable="false" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EE } from '../../Game'
import '@/assets/css/referfriend.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import Slider from 'vue-slick'

export default {
  props: ['onClose'],
  data() {
    return {
      betRate: 0,
      leftPeopleCnt: 8,
      myCode: 'Ce45nfH3',
    }
  },
  mounted() {
    EE.addListener('RESIZE', this.onResize)
    ;(async () => {
      const allImages = document.querySelectorAll('.carousel__image img')

      await Promise.all(
        [...allImages].map((img) => {
          return new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
          })
        }),
      )

      const cont = document.getElementsByClassName('modal-window-bonus__scale-cont')[0]
      if (cont) {
        setTimeout(() => {
          cont.style.transform = `scale(0.9)`
          EE.emit('FORCE_RESIZE')
        }, 100)
      }
    })()

    setTimeout(() => {
      this.betRate = 50
      this.leftPeopleCnt = 8
    }, 500)
  },
  methods: {
    onResize(data) {
      const cont = document.getElementsByClassName('modal-window-bonus__scale-cont')[0]
      if (!cont) return

      const viewportWidth = data.w
      const viewportHeight = data.h
      const contentWidth = 1480 // Adjust this to match your actual content width
      const contentHeight = 1050 // Adjust this to match your actual content height

      const scaleX = (viewportWidth * 0.9) / contentWidth
      const scaleY = (viewportHeight * 0.9) / contentHeight
      const scale = Math.min(scaleX, scaleY)

      cont.style.transform = `translate(-50%, -50%) scale(${scale})`

      // Center the content
      cont.style.left = '50%'
      cont.style.top = '50%'
    },
    onClose() {
      const cont = document.getElementsByClassName('modal-window-bonus__scale-cont')[0]

      if (cont) {
        cont.style.transform = `scale(0)`
      }

      setTimeout(() => {
        this.$emit('close')
      }, 300)
    },
    onCopy() {
      const codeInput = this.$refs.myCodeRef
      if (codeInput) {
        navigator.clipboard
          .writeText(codeInput.value) // Use Clipboard API
          .then(() => {
            alert('Copied to clipboard: ' + codeInput.value) // Optional: provide feedback
          })
          .catch((err) => {
            console.error('Failed to copy text: ', err)
          })
      }
    },
  },
}
</script>

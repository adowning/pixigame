<template>
  <div className="modal-window-info">
    <div className="modal-window-info__scale-cont">
      <div v-if="delete_sure" className="modal-window-info__popup-cont">
        <img className="modal-window-info_text" src="/images/frenzy/del_back.png" alt="" />
        <img
          className="modal-window-info__yes modal-window-info-popup__btn game-button"
          @click="goDelAccount"
          src="/images/frenzy/yes_btn.png"
          alt=""
        />
        <img
          className="modal-window-info__no modal-window-info-popup__btn game-button"
          @click="closeDelAccount"
          src="/images/frenzy/no_btn.png"
          alt=""
        />
        <img className="modal-window-info__popup-back" src="/images/frenzy/message.png" alt="" />
      </div>
      <!-- <img
        className="modal-window-info__avatar"
        @click="onSelectNewAvatar"
        src="/images/pic.png"
        alt=""
      /> -->
      <span className="modal-window-info__user modal-window-info__text">User</span>
      <span className="modal-window-info__pass modal-window-info__text">****************</span>
      <img
        className="modal-window-info__close game-button"
        @click="onClose"
        src="/images/frenzy/bonus_close.png"
        alt=""
      />

      <div className="modal-window-info__avatar_ok game-button" @click="onAvatarComplete" />
      <img
        className="modal-window-info__done modal-window-info__btn game-button"
        @click="goChangePass"
        src="/images/frenzy/change_btn.png"
        alt=""
      />
      <img
        className="modal-window-info__del game-button"
        @click="onDelete"
        src="/images/frenzy/del_btn.png"
        alt=""
      />
      <img className="modal-window-info__back" src="/images/frenzy/info_back3.png" alt="" />
    </div>
  </div>
</template>

<script>
import { EE } from '../../Game'
import '@/assets/css/info.css'
import { PAGE_SIZE_DEFAULT } from '@/libs/common/Config'

export default {
  props: ['onClose', 'goChangePass'],
  data() {
    return {
      delete_sure: false,
      AVATAR_SOURCE: '',
    }
  },
  mounted() {
    EE.addListener('RESIZE', this.onResize)
    EE.emit('FORCE_RESIZE')
  },
  methods: {
    onResize(data) {
      const cont = document.getElementsByClassName('modal-window-info__scale-cont')[0]
      const sc = Math.min(data.h / PAGE_SIZE_DEFAULT.height, data.w / PAGE_SIZE_DEFAULT.width)
      if (cont) {
        cont.style.transform = `scale(${sc})`
      }
    },
    onDelete() {
      this.delete_sure = true
    },
    goDelAccount() {
      console.log('go delete!')
    },
    closeDelAccount() {
      this.delete_sure = false
    },
    onSelectNewAvatar(e) {
      var input = document.createElement('input')
      input.type = 'file'
      input.accept = '.jpg,.png'
      input.onchange = (e) => {
        var file = e.target.files[0]
        console.log(file)
        var reader = new FileReader()
        reader.onload = (re) => {
          const img = document.querySelector('.modal-window-info__avatar')
          img.src = re.target.result
          this.AVATAR_SOURCE = img.src
          console.log(re.target.result)
        }
        reader.readAsDataURL(file)
      }
      input.click()
    },
    onAvatarComplete() {
      console.log('Avatar send. Source: ', this.AVATAR_SOURCE)
    },
    onClose() {
      this.$emit('close')
    },
  },
}
</script>

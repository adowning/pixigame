<template>
  <div className="modal-window-signphone">
    <div className="modal-window-signphone__scale-cont">
      <div v-if="modal" className="modal-window-signphone__verify-cont">
        <input
          className="modal-window-signphone__fields modal-window-signphone__code-modal"
          type="text"
          maxLength="6"
          :value="inputCode2"
          @input="onInput"
          @focus="handleFocusCode2"
          @change="onChangeCode2"
          ref="refCode2"
          placeholder="------"
        />
        <img
          className="modal-window-signphone__close-modal game-button"
          @click="onCloseModal"
          src="/images/frenzy/bonus_close.png"
          alt=""
        />
        <img
          className="modal-window-signphone__submit-modal game-button"
          @click="onSubmitModal"
          src="/images/frenzy/freeplay/ver_submit.png"
          alt=""
        />
        <img
          className="modal-window-signphone__back-modal"
          src="/images/frenzy/freeplay/ver_back.png"
          alt=""
        />
      </div>
      <div v-if="codeInvalidate" className="modal-window-signphone__validate-cont">
        <img
          className="modal-window-signphone__valid"
          :src="`images/frenzy/freeplay/${Math.random() > 0.5 ? 'valid' : 'invalid'}.png`"
          alt=""
        />
        <img
          className="modal-window-signphone__back-modal"
          src="/images/frenzy/freeplay/err_back.png"
          alt=""
        />
      </div>
      <input
        className="modal-window-signphone__phone modal-window-signphone__fields"
        type="text"
        :value="inputPhone"
        @input="onInput"
        @focus="handleFocusPhone"
        @change="onChangePhone"
        ref="refPhone"
        :placeholder="defaultText1"
      />
      <input
        className="modal-window-signphone__code modal-window-signphone__fields"
        type="text"
        :value="inputCode"
        @input="onInput"
        @focus="handleFocusCode"
        @change="onChangeCode"
        ref="refCode"
        :placeholder="defaultText2"
      />
      <img
        className="modal-window-signphone__close game-button"
        @click="onClose"
        src="/images/frenzy/bonus_close.png"
        alt=""
      />
      <img
        className="modal-window-signphone__verify game-button"
        @click="onVerify"
        src="/images/frenzy/freeplay/submit_phone.png"
        alt=""
      />
      <img
        className="modal-window-signphone__ok game-button"
        @click="onSubmit"
        src="/images/frenzy/freeplay/submit_ref.png"
        alt=""
      />
      <img
        className="modal-window-signphone__back"
        src="/images/frenzy/freeplay/info_back.png"
        alt=""
      />
      <div :class="`game-keyboard ${keyboardVisible ? 'game-keyboard-on' : 'game-keyboard-off'}`">
        <Keyboard
          v-if="!isMobile"
          :keyboardRef="(r) => (keyboard = r)"
          :layoutName="layoutName"
          @change="onChange"
          @keypress="onKeyPress"
        />
      </div>
    </div>
    <div className="modal-window-fill-backevent" @click="keyboardVisible = false" />
  </div>
</template>

<script>
import { EE } from '../../Game'
import '@/assets/css/signphone.css'
import { PAGE_SIZE_DEFAULT } from '@/libs/common/Config'
import { isMobile } from '@/libs/common/Utils'
import Keyboard from 'simple-keyboard'

const defaultText1 = 'Phone Number'
const defaultText2 = 'Referral Code'

export default {
  props: ['onClose'],
  data() {
    return {
      tim: 0,
      modal: false,
      codeInvalidate: false,
      keyboardVisible: false,
      inputNode: null,
      layoutName: 'default',
      inputPhone: '',
      inputCode: '',
      inputCode2: '',
      keyboard: null,
      defaultText1: 'Phone Number',
      defaultText2: 'Referral Code',
    }
  },
  mounted() {
    EE.addListener('RESIZE', this.onResize)
    EE.emit('FORCE_RESIZE')
  },
  methods: {
    onResize(data) {
      const cont = document.getElementsByClassName('modal-window-signphone__scale-cont')[0]
      const sc = Math.min(data.h / PAGE_SIZE_DEFAULT.height, data.w / PAGE_SIZE_DEFAULT.width)
      if (cont) {
        cont.style.transform = `scale(${sc})`
      }
    },
    onSubmit() {
      this.codeInvalidate = true
      clearTimeout(this.tim)
      this.tim = setTimeout(() => {
        const valid = document.getElementsByClassName('modal-window-signphone__validate-cont')[0]
        if (valid) {
          valid.style.opacity = 0
          this.tim = setTimeout(() => {
            this.codeInvalidate = false
            valid.style.opacity = 1
          }, 500)
        }
      }, 500)
    },
    onVerify() {
      this.modal = true
    },
    onBlur1(e) {
      if (e.target.value === '') e.target.value = defaultText1
    },
    onBlur2(e) {
      if (e.target.value === '') e.target.value = defaultText2
    },
    onFocus(e) {
      e.target.value = ''
    },
    onInput(e) {
      if (e.target.value.length > 16) {
        e.target.value = e.target.value.slice(0, 16)
      }
    },
    onSubmitModal() {
      console.log('Submit click in Get verification')
      this.onCloseModal()
    },
    onCloseModal() {
      this.modal = false
    },
    onClose() {
      EE.emit('SHOW_LOGIN') //show login
      //this.props.onClose();
    },
    handleFocusPhone() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '309px'
      }
      this.inputNode = this.$refs.refPhone
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputPhone)
    },
    handleFocusCode() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '517px'
      }
      this.inputNode = this.$refs.refCode
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputCode)
    },
    handleFocusCode2() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '402px'
      }
      this.inputNode = this.$refs.refCode2
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputCode2)
    },
    handleShift() {
      this.layoutName = this.layoutName === 'default' ? 'shift' : 'default'
    },
    onKeyPress(button) {
      switch (button) {
        case '{shift}':
        case '{lock}':
          this.handleShift()
          break
        case '{enter}':
          //this.goLogin();
          break
      }
    },
    onChange(input) {
      switch (this.inputNode) {
        case this.$refs.refPhone:
          this.inputPhone = input
          break
        case this.$refs.refCode:
          this.inputCode = input
          break
        case this.$refs.refCode2:
          this.inputCode2 = input
          break
      }
    },
    onChangePhone(event) {
      this.inputPhone = event.target.value
      if (this.keyboard) this.keyboard.setInput(this.inputPhone)
    },
    onChangeCode(event) {
      this.inputCode = event.target.value
      if (this.keyboard) this.keyboard.setInput(this.inputCode)
    },
    onChangeCode2(event) {
      this.inputCode2 = event.target.value
      if (this.keyboard) this.keyboard.setInput(this.inputCode2)
    },
  },
}
</script>

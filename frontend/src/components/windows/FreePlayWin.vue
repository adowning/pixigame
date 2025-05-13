<template>
  <div className="modal-window-fp">
    <div className="modal-window-fp__scale-cont">
      <input
        className="modal-window-fp__name modal-window-fp__fields"
        type="text"
        :value="inputName"
        @input="onInput"
        @focus="handleFocusName"
        @change="onChangeName"
        ref="refName"
      />
      <input
        className="modal-window-fp__phone modal-window-fp__fields"
        type="text"
        :value="inputPhone"
        @input="onInput"
        @focus="handleFocusPhone"
        @change="onChangePhone"
        ref="refPhone"
      />
      <input
        className="modal-window-fp__email modal-window-fp__fields"
        type="text"
        :value="inputEmail"
        @input="onInput"
        @focus="handleFocusEmail"
        @change="onChangeEmail"
        ref="refEmail"
      />
      <input
        className="modal-window-fp__pass modal-window-fp__fields"
        type="password"
        @input="onInput"
        :value="inputPass"
        @focus="handleFocusPass"
        @change="onChangePass"
        ref="refPass"
      />
      <img
        className="modal-window-fp__close game-button"
        @click="onClose"
        src="/images/frenzy/bonus_close.png"
        alt=""
      />
      <img
        className="modal-window-fp__submit game-button"
        @click="onSubmit"
        src="/images/frenzy/register/submit.png"
        alt=""
      />
      <img className="modal-window-fp__back" src="/images/frenzy/register/back.png" alt="" />
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
    <div className="modal-window-fill-backevent" @click="setState({ keyboardVisible: false })" />
  </div>
</template>

<script>
import { EE } from '../../Game'
import '@/assets/css/freeplay.css'
import { PAGE_SIZE_DEFAULT } from '@/libs/common/Config'
import { isMobile } from '@/libs/common/Utils'
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'

export default {
  props: ['onClose'],
  data() {
    return {
      keyboardVisible: false,
      inputNode: null,
      layoutName: 'default',
      inputName: '',
      inputEmail: '',
      inputPass: '',
      inputPhone: '',
      keyboard: null,
    }
  },
  mounted() {
    EE.addListener('RESIZE', this.onResize)
    EE.emit('FORCE_RESIZE')
  },
  methods: {
    onResize(data) {
      const cont = document.getElementsByClassName('modal-window-fp__scale-cont')[0]
      const sc = Math.min(data.h / PAGE_SIZE_DEFAULT.height, data.w / PAGE_SIZE_DEFAULT.width)
      if (cont) {
        cont.style.transform = `scale(${sc})`
      }
    },
    onSubmit() {
      EE.emit('SHOW_SIGNPHONE')
    },
    onClose() {
      this.$emit('close')
      EE.emit('SHOW_LOGIN')
    },
    onInput(e) {
      if (e.target.value.length > 30) {
        e.target.value = e.target.value.slice(0, 30)
      }
    },
    handleFocusName() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '241px'
      }
      this.inputNode = this.$refs.refName
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputName)
    },
    handleFocusPhone() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '462px'
      }
      this.inputNode = this.$refs.refPhone
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputPhone)
    },
    handleFocusEmail() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '571px'
      }
      this.inputNode = this.$refs.refEmail
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputEmail)
    },
    handleFocusPass() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '351px'
      }
      this.inputNode = this.$refs.refPass
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputPass)
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
          this.goLogin()
          break
      }
    },
    onChange(input) {
      switch (this.inputNode) {
        case this.$refs.refName:
          this.inputName = input
          break
        case this.$refs.refPhone:
          this.inputPhone = input
          break
        case this.$refs.refEmail:
          this.inputEmail = input
          break
        case this.$refs.refPass:
          this.inputPass = input
          break
      }
    },
    onChangeName(event) {
      this.inputName = event.target.value
      if (this.keyboard) this.keyboard.setInput(this.inputName)
    },
    onChangePhone(event) {
      this.inputPhone = event.target.value
      if (this.keyboard) this.keyboard.setInput(this.inputPhone)
    },
    onChangeEmail(event) {
      this.inputEmail = event.target.value
      if (this.keyboard) this.keyboard.setInput(this.inputEmail)
    },
    onChangePass(event) {
      this.inputPass = event.target.value
      if (this.keyboard) this.keyboard.setInput(this.inputPass)
    },
  },
}
</script>

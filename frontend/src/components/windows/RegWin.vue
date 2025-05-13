<template>
  <div className="modal-window-reg">
    <div className="modal-window-reg__scale-cont">
      <input
        className="modal-window-reg__name modal-window-reg__fields"
        type="text"
        :value="inputName"
        @input="onInput"
        @focus="handleFocusName"
        @change="onChangeName"
        ref="refName"
        placeholder="Name"
      />
      <input
        className="modal-window-reg__phone modal-window-reg__fields"
        type="text"
        :value="inputPhone"
        @input="onInput"
        @focus="handleFocusPhone"
        @change="onChangePhone"
        ref="refPhone"
        placeholder="Phone"
      />
      <input
        className="modal-window-reg__email modal-window-reg__fields"
        type="text"
        :value="inputEmail"
        @input="onInput"
        @focus="handleFocusEmail"
        @change="onChangeEmail"
        ref="refEmail"
        placeholder="Email"
      />
      <textarea
        className="modal-window-reg__comment modal-window-reg__fields"
        type="text"
        :value="inputCom"
        @input="onInput"
        @focus="handleFocusCom"
        @change="onChangeCom"
        ref="refCom"
        placeholder="Comment"
      />
      <img
        className="modal-window-reg__close game-button"
        @click="onClose"
        src="/images/frenzy/bonus_close.png"
        alt=""
      />
      <img
        className="modal-window-reg__get game-button"
        @click="onRegistration"
        src="/images/frenzy/register/get.png"
        alt=""
      />
      <img className="modal-window-reg__back" src="/images/frenzy/register/back2.png" alt="" />
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
import '@/assets/css/reg.css'
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
      inputCom: '',
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
      const cont = document.getElementsByClassName('modal-window-reg__scale-cont')[0]
      const sc = Math.min(data.h / PAGE_SIZE_DEFAULT.height, data.w / PAGE_SIZE_DEFAULT.width)
      if (cont) {
        cont.style.transform = `scale(${sc})`
      }
    },
    onRegistration() {
      this.keyboardVisible = false
      const name = document.getElementsByClassName('modal-window-reg__name')[0]
      const phone = document.getElementsByClassName('modal-window-reg__phone')[0]
      const email = document.getElementsByClassName('modal-window-reg__email')[0]
      const comm = document.getElementsByClassName('modal-window-reg__comment')[0]
      console.log(name.value, phone.value, email.value, comm.value)

      //showPopup('Please input username!');
    },
    onClose() {
      this.keyboardVisible = false
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
        kb.style.top = '219px'
      }
      this.inputNode = this.$refs.refName
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputName)
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
    handleFocusEmail() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '399px'
      }
      this.inputNode = this.$refs.refEmail
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputEmail)
    },
    handleFocusCom() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '529px'
      }
      this.inputNode = this.$refs.refCom
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputCom)
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
        case this.$refs.refName:
          this.inputName = input
          break
        case this.$refs.refPhone:
          this.inputPhone = input
          break
        case this.$refs.refEmail:
          this.inputEmail = input
          break
        case this.$refs.refCom:
          this.inputCom = input
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
    onChangeCom(event) {
      this.inputCom = event.target.value
      if (this.keyboard) this.keyboard.setInput(this.inputCom)
    },
  },
}
</script>

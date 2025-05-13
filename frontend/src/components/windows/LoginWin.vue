<template>
  <div className="modal-window-login">
    <div className="modal-window-login__scale-cont">
      <div className="modal-window-login__logo">
        <img className="modal-window-login__logo1" src="" id="logo-login" alt="" />
      </div>
      <div className="modal-window-login__down">
        <input
          className="modal-window-login__text-id modal-window-login__fields"
          :value="inputId"
          type="text"
          @input="onInput"
          @focus="handleFocusId"
          @change="onChangeId"
          ref="refId"
          placeholder="input id"
        />
        <input
          className="modal-window-login__text-pass modal-window-login__fields"
          :value="inputPass"
          type="password"
          @input="onInput"
          @focus="handleFocusPass"
          @change="onChangePass"
          ref="refPass"
          placeholder="input password"
        />
        <img
          className="modal-window-login__check"
          @click="checkRem"
          src="/images/frenzy/login/pip.png"
          alt=""
        />
        <img
          className="modal-window-login__login modal-window-login__btn game-button"
          @click="goLogin"
          src="/images/frenzy/login/login_btn.png"
          alt=""
        />
        <img
          className="modal-window-login__fplay modal-window-login__btn game-button"
          @click="goFreeplay"
          src="/images/frenzy/login/free_btn.png"
          alt=""
        />
        <img
          className="modal-window-login__back"
          src="/images/frenzy/login/back.png"
          id="back-login"
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
    </div>
    <div className="modal-window-fill-backevent" @click="setState({ keyboardVisible: false })" />
  </div>
</template>

<script>
import { EE } from '../../Game'
import '@/assets/css/login.css'
import $ from 'jquery'
import { PAGE_SIZE_DEFAULT } from '@/libs/common/Config'
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import { isMobile } from '@/libs/common/Utils'

const logoimages = [
  'images/frenzy/login/logo/logo0001.png',
  'images/frenzy/login/logo/logo0002.png',
  'images/frenzy/login/logo/logo0003.png',
  'images/frenzy/login/logo/logo0004.png',
  'images/frenzy/login/logo/logo0005.png',
  'images/frenzy/login/logo/logo0006.png',
  'images/frenzy/login/logo/logo0007.png',
  'images/frenzy/login/logo/logo0008.png',
  'images/frenzy/login/logo/logo0009.png',
  'images/frenzy/login/logo/logo0010.png',
  'images/frenzy/login/logo/logo0011.png',
  'images/frenzy/login/logo/logo0012.png',
  'images/frenzy/login/logo/logo0013.png',
  'images/frenzy/login/logo/logo0014.png',
  'images/frenzy/login/logo/logo0015.png',
  'images/frenzy/login/logo/logo0016.png',
  'images/frenzy/login/logo/logo0017.png',
  'images/frenzy/login/logo/logo0018.png',
  'images/frenzy/login/logo/logo0019.png',
  'images/frenzy/login/logo/logo0020.png',
  'images/frenzy/login/logo/logo0021.png',
  'images/frenzy/login/logo/logo0022.png',
  'images/frenzy/login/logo/logo0023.png',
  'images/frenzy/login/logo/logo0024.png',
  'images/frenzy/login/logo/logo0025.png',
  'images/frenzy/login/logo/logo0026.png',
  'images/frenzy/login/logo/logo0027.png',
  'images/frenzy/login/logo/logo0028.png',
  'images/frenzy/login/logo/logo0029.png',
  'images/frenzy/login/logo/logo0030.png',
  'images/frenzy/login/logo/logo0031.png',
  'images/frenzy/login/logo/logo0032.png',
]

export default {
  data() {
    return {
      int: 0,
      i: 0,
      keyboard: null,
      keyboardVisible: false,
      inputNode: null,
      layoutName: 'default',
      inputId: '',
      inputPass: '',
    }
  },
  mounted() {
    EE.addListener('RESIZE', this.onResize)
    EE.emit('FORCE_RESIZE')
    this.int = setInterval(this.animateLogo, 50)
  },
  beforeUnmount() {
    clearInterval(this.int)
  },
  methods: {
    animateLogo() {
      const img = document.getElementById('logo-login')
      if (img) {
        img.src = logoimages[this.i]
        this.i++
        if (logoimages.length === this.i) {
          this.i = 0
        }
      }
    },
    onResize(data) {
      const cont = document.getElementsByClassName('modal-window-login__scale-cont')[0]
      const sc = Math.min(data.h / PAGE_SIZE_DEFAULT.height, data.w / PAGE_SIZE_DEFAULT.width)
      if (cont) {
        cont.style.transform = `scale(${sc})`
      }
    },
    goLogin() {
      const id = $('.modal-window-login__text-id')[0]
      const pass = $('.modal-window-login__text-pass')[0]
      const rem_obj = $('.modal-window-login__check')[0]
      const remember = rem_obj.style.opacity === '1' || rem_obj.style.opacity === ''
      console.log(id.value, pass.value, 'remember=', remember)
      EE.emit('GO_GAME')
    },
    onInput(e) {
      if (e.target.value.length > 30) {
        e.target.value = e.target.value.slice(0, 30)
      }
    },
    checkRem(e) {
      e.target.style.transition = '0.5s'
      e.target.style.opacity = e.target.style.opacity === '0' ? '1' : '0'
    },
    goFreeplay() {
      EE.emit('SHOW_FREE_PLAY')
    },
    handleFocusId() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '178px'
      }
      this.inputNode = this.$refs.refId
      this.keyboardVisible = true
      if (this.keyboard) this.keyboard.setInput(this.inputId)
    },
    handleFocusPass() {
      const kb = document.getElementsByClassName('game-keyboard')[0]
      if (kb) {
        kb.style.top = '284px'
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
          if (this.inputNode === this.$refs.refId) {
            this.handleFocusPass()
            return
          }
          this.goLogin()
          break
      }
    },
    onChange(input) {
      switch (this.inputNode) {
        case this.$refs.refId:
          this.inputId = input
          break
        case this.$refs.refPass:
          this.inputPass = input
          break
      }
    },
    onChangeId(event) {
      this.inputId = event.target.value
      if (this.keyboard) this.keyboard.setInput(this.inputId)
    },
    onChangePass(event) {
      this.inputPass = event.target.value
      if (this.keyboard) this.keyboard.setInput(this.inputPass)
    },
  },
}
</script>

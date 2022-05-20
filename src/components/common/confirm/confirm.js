import Vue from 'vue'
import message from './Confirm.vue'

const ConfirmConstructor = Vue.extend(message)

const vm = new ConfirmConstructor().$mount()

const defaultOptions = {
  yesBtnText: '确定',
  noBtnText: '取消'
}

const confirm = function (options) {
  Object.assign(vm, defaultOptions, options, {
    type: 'confirm'
  })
  if (options) {
    document.body.appendChild(vm.$el)
  } else {
    document.body.removeChild(vm.$el)
  }
  return vm.confirm()
}

export default confirm

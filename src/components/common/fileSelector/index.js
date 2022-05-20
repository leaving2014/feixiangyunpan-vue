import Vue from 'vue'
import message from './FileSelector.vue'
// 文件(夹)选择器
const FileSelectorConstructor = Vue.extend(message)

const vm = new FileSelectorConstructor().$mount()

const defaultOptions = {
  yesBtnText: '确定',
  noBtnText: '取消'
}

const fileSelector = function (options) {
  console.log(options)
  if (options) {
    Object.assign(vm, defaultOptions, options, {
      type: 'fileSelector'
    })
  }
  if (options) {
    document.body.appendChild(vm.$el)
  } else {
    document.body.removeChild(vm.$el)
  }

  return vm.fileSelector(options)
}

export default fileSelector

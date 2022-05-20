import Vue from 'vue'
// 导入组件
import ExcelPreview from './ExcelEditor.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const ExcelPreviewConstructor = Vue.extend(ExcelPreview)

let excelPreviewInstance = null
/**
 * 初始化代码预览实例
 * @param {string} fileInfo 文件信息
 */
const initInstanceCodePreview = (fileInfo) => {
  excelPreviewInstance = new ExcelPreviewConstructor({
    el: document.createElement('div'),
    data() {
      return {
        fileInfo
      }
    }
  })
}
/**
 * 代码预览 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showExcelPreviewBox = (obj) => {
  // 非首次调用服务时，在 DOM 中移除上个实例
  if (excelPreviewInstance !== null) {
    document.body.removeChild(excelPreviewInstance.$el)
  }
  const { fileInfo } = obj
  // eslint-disable-next-line promise/param-names
  return new Promise((reslove) => {
    initInstanceCodePreview(fileInfo)
    excelPreviewInstance.callback = (res) => {
      reslove(res)
      // 服务取消时卸载 DOM
      if (res === 'cancel' && excelPreviewInstance !== null) {
        document.body.removeChild(excelPreviewInstance.$el)
        excelPreviewInstance = null
      }
    }
    document.body.appendChild(excelPreviewInstance.$el) //  挂载 DOM
    Vue.nextTick(() => {
      excelPreviewInstance.visible = true //  打开代码预览遮罩层
    })
  })
}

export default showExcelPreviewBox

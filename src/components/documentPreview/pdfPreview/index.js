import Vue from 'vue'
// 导入组件
import PdfPreview from './PdfPreview.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const PdfPreviewConstructor = Vue.extend(PdfPreview)

let pdfPreviewInstance = null
/**
 * 初始化 markdown 预览实例
 * @param {string} fileInfo 文件信息
 */
const initInstancePdfPreview = (fileInfo) => {
  pdfPreviewInstance = new PdfPreviewConstructor({
    el: document.createElement('div'),
    data() {
      return {
        fileInfo
      }
    }
  })
}
/**
 *  markdown 预览 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showMarkdownPreviewBox = (obj) => {
  // 非首次调用服务时，在 DOM 中移除上个实例
  if (pdfPreviewInstance !== null) {
    document.body.removeChild(pdfPreviewInstance.$el)
  }
  const { fileInfo } = obj
  // eslint-disable-next-line promise/param-names
  return new Promise((reslove) => {
    initInstancePdfPreview(fileInfo)
    pdfPreviewInstance.callback = (res) => {
      reslove(res)
      // 服务取消时卸载 DOM
      if (res === 'cancel' && pdfPreviewInstance !== null) {
        document.body.removeChild(pdfPreviewInstance.$el)
        pdfPreviewInstance = null
      }
    }
    document.body.appendChild(pdfPreviewInstance.$el) //  挂载 DOM
    Vue.nextTick(() => {
      pdfPreviewInstance.visible = true //  打开 markdown 预览遮罩层
    })
  })
}

export default showMarkdownPreviewBox

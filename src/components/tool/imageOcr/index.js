import Vue from 'vue'
// 导入组件
import ImgOcr from './ImageOcr.vue'
// 使用基础 Vue 构造器，创建一个“子类”
const ImgOcrConstructor = Vue.extend(ImgOcr)

let imgOcrInstance = null
/**
 * 初始化图片预览实例
 * @param {string} imgList 图片列表
 * @param {object} defaultIndex 当前查看的图片索引
 */
const initInstanceImgPreview = (imageList, defaultIndex) => {
  imgOcrInstance = new ImgOcrConstructor({
    el: document.createElement('div'),
    data() {
      return {
        imageList,
        defaultIndex
      }
    }
  })
}
/**
 * 图片预览 Promise 函数
 * @returns {Promise} 抛出确认和取消回调函数
 */
const showImageOcrBox = (obj) => {
  // 非首次调用服务时，在 DOM 中移除上个实例
  if (imgOcrInstance !== null) {
    document.body.removeChild(imgOcrInstance.$el)
  }
  const { imageList, defaultIndex } = obj
  // eslint-disable-next-line promise/param-names
  return new Promise((reslove) => {
    initInstanceImgPreview(imageList, defaultIndex)
    imgOcrInstance.callback = (res) => {
      reslove(res)
      // 服务取消时卸载 DOM
      if (res === 'cancel' && imgOcrInstance !== null) {
        document.body.removeChild(imgOcrInstance.$el)
        imgOcrInstance = null
      }
    }
    document.body.appendChild(imgOcrInstance.$el) //  挂载 DOM
    Vue.nextTick(() => {
      imgOcrInstance.visible = true //  打开图片预览遮罩层
    })
  })
}

export default showImageOcrBox

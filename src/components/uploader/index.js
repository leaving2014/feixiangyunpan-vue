// import Vue from 'vue'
// // 导入组件
// import UploadFile from './Uploader.vue'
// // 使用基础 Vue 构造器，创建一个“子类”
// const UploadConstructor = Vue.extend(UploadFile)
//
// let uploadInstance = null
// /**
//  * 初始化右键菜单实例
//  * @param {string} params 上传文件组件参数
//  * @param {object} uploadWay 上传方式 0-文件上传 1-文件夹上传 2-粘贴图片或拖拽上传
//  * @param {el} serviceEl 组件实例
//  */
// const initInstanceUploadFile = (params, uploadWay, serviceEl) => {
//   uploadInstance = new UploadConstructor({
//     el: document.createElement('div'),
//     data() {
//       return {
//         params,
//         uploadWay,
//         serviceEl
//       }
//     }
//   })
// }
// /**
//  * 右键菜单 Promise 函数
//  * @returns {Promise} 抛出确认和取消回调函数
//  */
// const showUploadFileBox = (obj) => {
//   // 非首次调用服务时，在 DOM 中移除上个实例
//   if (uploadInstance !== null) {
//     const { params, uploadWay, serviceEl } = obj
//     uploadInstance.params = params
//     uploadInstance.uploadWay = uploadWay
//     uploadInstance.serviceEl = serviceEl
//     // uploadInstance.handlePrepareUpload() //  上传组件开始预处理
//   } else {
//     const { params, uploadWay, serviceEl } = obj
//     // eslint-disable-next-line promise/param-names
//     return new Promise((reslove) => {
//       initInstanceUploadFile(params, uploadWay, serviceEl)
//       uploadInstance.callback = (res) => {
//         reslove(res)
//         // 服务取消时卸载 DOM
//         if (res === 'cancel' && uploadInstance !== null) {
//           document.body.removeChild(uploadInstance.$el)
//           uploadInstance = null
//         }
//       }
//       document.body.appendChild(uploadInstance.$el) //  挂载 DOM
//       Vue.nextTick(() => {
//         uploadInstance.visible = true
//         // uploadInstance.handlePrepareUpload() //  上传组件开始预处理
//       })
//     })
//   }
// }
//
// export default showUploadFileBox

/**
 * 以服务的方式，将对文件的一些操作挂载到 Vue 上
 * 在 *.vue 文件中，使用 this.$addFolder 调用创建文件夹服务
 * 在 *.js 文件中，需要现在文件顶部引入 Vue ，即 import Vue from 'vue' ，然后使用 Vue.property.$addFolder 调用创建文件夹服务
 * @description 各个服务的参数传递查看服务封装对应目录下的 index.js 文件，里面注明了需要船队的参数
 * @author 李雅婷
 */

// 导入操作文件的弹窗类组件
// 导入操作文件的遮罩类组件
import showUploadFileBox from '../components/index/uploadTask/index.js'
import showCodePreviewBox from '@/components/documentPreview/codePreview/index.js'
import showAudioPreviewBox from '@/components/play/audioPlayer/index.js'
import showVideoPreviewBox from '@/components/play/videoPlayer/index.js'
import showMarkdownPreviewBox from '@/components/documentPreview/markdownPreview/index.js'
import showPdfPreviewBox from '@/components/documentPreview/pdfPreview/index.js'
import showExcelPreviewBox from '@/components/office/excelEditor/index.js'
import showImageOcrBox from '@/components/tool/imageOcr/index.js'
import showFileSelectorBox from '@/components/common/fileSelector'
import showImgPreviewBox from '@/components/play/imagePreview'
// import showConfirmBox from '@/components/common/confirm/index.js'
// import showUpload from '@/components/uploader/index.js'

const operateElement = {
  install: (Vue) => {
    // 挂载操作文件的弹窗类组件
    // Vue.prototype.$addFolder = showAddFolderDialog
    // Vue.prototype.$addFile = showAddFileDialog
    // Vue.prototype.$copyFile = showCopyFileDialog
    // Vue.prototype.$moveFile = showMoveFileDialog
    // Vue.prototype.$saveShareFile = showSaveShareFileDialog
    // Vue.prototype.$shareFile = showShareFileDialog
    // Vue.prototype.$unzipFile = showUnzipFileDialog
    // Vue.prototype.$renameFile = showRenameFileDialog
    // Vue.prototype.$deleteFile = showDeleteFileDialog
    // Vue.prototype.$restoreFile = showRestoreFileDialog
    // Vue.prototype.$showFileDetailInfo = showFileDetailInfoDialog
    // 挂载操作文件的遮罩类组件
    // Vue.prototype.$openContextMenu = showContextMenuBox
    Vue.prototype.$openFileSelector = showFileSelectorBox
    Vue.prototype.$previewImg = showImgPreviewBox
    Vue.prototype.$previewVideo = showVideoPreviewBox
    Vue.prototype.$uploadFile = showUploadFileBox
    Vue.prototype.$preivewAudio = showAudioPreviewBox
    Vue.prototype.$previewMarkdown = showMarkdownPreviewBox
    Vue.prototype.$previewCode = showCodePreviewBox
    Vue.prototype.$previewPdf = showPdfPreviewBox
    Vue.prototype.$previewExcel = showExcelPreviewBox
    Vue.prototype.$previewImageOcr = showImageOcrBox
    // Vue.prototype.$confirmBox = showConfirmBox
    // Vue.prototype.$uploader = showUpload
  }
}
export default operateElement

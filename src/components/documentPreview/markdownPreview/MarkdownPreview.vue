<template>
  <div class="markdown-preview-main" v-show="visible">
    <div class="markdown-preview-wrapper">
      <div class="header" v-show="!fullScreen">
        <div class="header-file-name text-ellip">
          <h3>{{ fileInfo.fileName }}</h3>
        </div>
        <div class="desc text-ellip">
          <h3>在线编辑</h3>
        </div>
        <i class="iconfont icon-guanbi cursor-p" @click="close()"></i>
        <!--<div class="menu">-->
        <!--  -->
        <!--</div>-->
      </div>
      <div class="preview-body"
           :class="fullScreen? 'full-screen' :''"
           style="box-shadow: rgba(0, 0, 0, 0.1) 0px 2px 12px 0px;">
        <mavonEditor class="editor-main"
                     v-model="markdownText"
                     @fullScreen="changeFullScreen"
                     @paste="handlePaste"
                     @save="handleModifyFileContent"
                     @imgAdd="imgAdd" :ishljs="true" />

      </div>

    </div>

  </div>
</template>

<script>
import store from '@/store'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
// 代码高亮样式表
// import '../../../public/mavonEditor/css/tomorrow-night.css'
// import '../../../public/mavonEditor/css/github-markdown.css'
import '../../../../public/mavonEditor/css/tomorrow-night.css'
import '../../../../public/mavonEditor/css/github-markdown.css'
import axios from 'axios'
import {
  addDocument,
  getFileInfo,
  getFilePreview,
  loadDocument,
  modifyFileContent,
  modifyDocument
} from '@/request/file'
import Bus from '@/libs/bus'

export default {
  name: 'MarkdownPreview',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    file: {
      type: Object
    }
  },
  components: {
    mavonEditor
  },
  data () {
    return {
      docId: '',
      visible: false, //  markdown 预览遮罩层组件是否显示
      fullScreen: false,
      originalMarkdownText: '', //  markdown 原本的文本
      markdownText: '', //  markdown 实时修改的文本
      markdownLoading: false, //  markdown 内容是否加载中
      imgUploadApi: '',
      // 工具栏
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: true, // 保存（触发 events 中的 save 事件）
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      type: '',
      currentFileInfo: {} // 当前文件信息
    }
  },
  watch: {
    // 监听 markdown 查看组件 显隐状态变化
    visible (val) {
      if (val) {
        if (this.doc) {
          this.docId = this.doc.id
          this.markdownLoading = false
          this.originalMarkdownText = this.doc.context.toString()
          this.markdownText = this.doc.context.toString()
        } else {
          this.getMarkdownText()
        }
        // 添加键盘 Esc 事件
        this.$nextTick(() => {
          document.addEventListener('keyup', (e) => {
            if (e.keyCode === 27) {
              this.closeMarkdownPreview()
            }
          })
        })
      } else {
        document.removeEventListener('keyup', (e) => {
          if (e.keyCode === 27) {
            this.closeMarkdownPreview()
          }
        })
      }
    }
  },
  computed: {
    // 屏幕宽度
    screenWidth () {
      return store.state.common.screenWidth
    },
    // 是否修改
    isModify () {
      return this.originalMarkdownText !== this.markdownText
    },
    // 外链 cdn 改为本地引入
    externalLink () {
      const context =
        process.env.NODE_ENV === 'production'
          ? '/' //  生产环境
          : '/' //  开发环境
      return {
        markdown_css: function() {
          // 这是你的markdown css文件路径
          return `${context}mavonEditor/css/github-markdown.css`
        },
        hljs_js: function() {
          // 这是你的hljs文件路径
          return `${context}mavonEditor/js/highlight.min.js`
        },
        hljs_css: function() {
          // 这是你的代码高亮配色文件路径
          return `${context}mavonEditor/css/tomorrow-night.css`
        },
        hljs_lang: function() {
          // 这是你的代码高亮语言解析路径
          return `${context}mavonEditor/js/lang.hljs.js`
        },
        katex_css: function() {
          // 这是你的katex配色方案路径路径
          return `${context}mavonEditor/css/katex.min.css`
        },
        katex_js: function() {
          // 这是你的katex.js路径
          return `${context}mavonEditor/js/katex.min.js`
        }
      }
    }
  },
  created () {
    this.currentFileInfo = this.fileInfo
    this.type = this.fileInfo.type || ''
    // this.file = this.$store.state.fileList[this.$store.state.selectFileIndex]
  },
  mounted () {
  },
  methods: {
    // 全屏
    changeFullScreen () {
      this.fullScreen = !this.fullScreen
    },
    // 获取文件信息
    getFileInfo (id) {
      getFileInfo({
        id: id
      }).then(res => {
        this.file = res.data
      })
    },
    /**
     * 获取 markdown 文本内容
     */
    getMarkdownText () {
      this.markdownLoading = true
      if (this.type === 'notes') {
        if (this.currentFileInfo.id == 0) {
          return
        }
        const data = {
          id: this.currentFileInfo.id,
          version: this.currentFileInfo.version
        }
        loadDocument(data).then(res => {
          this.docId = this.currentFileInfo.id
          this.markdownLoading = false
          this.originalMarkdownText = res.toString()
          this.markdownText = res.toString()
        })
      } else {
        getFilePreview({
          id: this.fileInfo.identifier,
          time: this.getFileCreateTimeStamp(this.currentFileInfo),
          fileType: this.fileInfo.fileType,
          extensionName: this.fileInfo.fileExt
        }).then((res) => {
          this.markdownLoading = false
          this.originalMarkdownText = res.toString()
          this.markdownText = res.toString()
        })
      }
    },
    handlePaste (e, p) {
      console.log(e, p)
    },
    /**
     * 修改 markdown 文本内容
     */
    handleModifyFileContent () {
      var fileId = 0
      if (this.currentFileInfo) {
        fileId = this.currentFileInfo.id
      }
      this.markdownLoading = true
      console.log('userFileId: this.fileInfo.id' + this.fileInfo.id)
      console.log('修改内容: ' + fileId)
      if (this.type === 'notes') {
        if (this.currentFileInfo.id === 0) {
          const data = {
            userId: this.getCookies('uid'),
            fileName: '',
            context: this.markdownText
          }
          addDocument(data).then(res => {
            if (res.code === 0) {
              this.$toast.success('保存成功')
              this.docId = res.data.id
            } else {
              this.$toast.error(res.msg || '保存失败')
            }
          })
        } else {
          const data = {
            userId: this.getCookies('uid'),
            id: this.fileInfo.id,
            context: this.markdownText,
            updateVersion: '0'
          }

          modifyDocument(data).then(res => {
            if (res.data.id != this.docId) {
              this.docId = res.data.id
              this.$toast.success('更新成功, 当前文档版本 V' + parseFloat(res.data.version.toString()))
            }
          })
          console.log('更新')
        }
      } else {
        if (this.currentFileInfo.origin === 1) {
          this.$confirmBox({
            title: '转存文件',
            msg: '该文件为引用文件,需要转存源文件到自己的网盘才能编辑,是否要转存? 转存后会关闭当前编辑窗口,请重新打开文件',
            showType: 0
          }).then(() => {
            modifyFileContent({
              fileId: this.currentFileInfo.id ? this.currentFileInfo.id : this.fileInfo.id,
              fileContent: this.markdownText,
              timestamp: new Date().getTime()
            })
              .then((res) => {
                this.markdownLoading = false
                if (res.code === 0) {
                  this.currentFileInfo = res.data.file
                  this.$toast.success('修改成功')
                  this.closeMarkdownPreview()
                  Bus.$emit('updateFileList')
                  this.$toast.success('请重新打开文件')
                  // this.getMarkdownText()
                } else {
                  this.$toast.error(res.message)
                }
              })
              .catch((err) => {
                this.markdownLoading = false
                this.$toast.error(err.message)
              })
          }).catch(() => {
            this.$toast.success('取消转存')
          })
        } else {
          modifyFileContent({
            fileId: this.currentFileInfo.id ? this.currentFileInfo.id : this.fileInfo.id,
            fileContent: this.markdownText,
            timestamp: new Date().getTime()
          })
            .then((res) => {
              this.markdownLoading = false
              if (res.code === 0) {
                this.currentFileInfo = res.data.file
                this.$toast.success('修改成功')
                Bus.$emit('updateFileList')
                // this.getMarkdownText()
              } else {
                this.$toast.error(res.message)
              }
            })
            .catch((err) => {
              this.markdownLoading = false
              this.$toast.error(err.message)
            })
        }
      }
    },
    /**
     * 关闭 markdown 预览
     */
    closeMarkdownPreview () {
      this.visible = false
      this.callback('cancel')
    },
    close () {
      this.visible = false
      this.callback('cancel')
    },
    imgAdd (pos, file) {
      debugger
      var formData = new FormData()
      formData.append('newImg', file)
      axios({
        url: '',
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((res) => {
        if (res.data.code === 0) {
          const json = res.data.data.picUrl
          this.$refs.md1.$imglst2Url([[pos, json]])
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.markdown-preview-main {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  background: rgba(0, 0, 0, .3);
  margin: 0;
  z-index: 2999;

  .markdown-preview-wrapper {
    //position: relative;
    margin: 0 auto;
    background: #fff;
    min-width: 300px;
    //box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
    box-sizing: border-box;
    //top: 10vh;
    margin: 56px auto 0 auto;
    width: 90%;
    //height: calc(100vh - 330px);

    .header {
      z-index: 9999;
      display: flex;
      flex-wrap: nowrap;
      height: 50px;
      line-height: 50px;
      min-width: 300px;
      justify-content: space-between;
      padding: 13px 24px 13px 24px;
      background: rgba(0, 0, 0, .7);
      color: #fff;
      vertical-align: middle;

      .header-file-name {
        min-width: 30px;
        max-width: 200px;
        flex-basis: 200px;
      }

      .desc {
        min-width: 30px;
        line-height: 50px;
      }


      .iconfont {
        display: inline-block;
        //margin-bottom: 5px;
        //position: absolute;
        //right: 8px;

        height: 25px;
        line-height: 25px;
      }
    }

    .preview-body.full-screen {
      .editor-main {
        height: 100% !important;
      }
    }

    .preview-body {
      top: 20px;
      //padding: 30px 40px;
      background: rgba(0, 0, 0, .5);
      //width: 90vw;

      .editor-main {
        height: calc(90vh - 100px);

      }


    }
  }


}
</style>

<template>
  <div class="file-selector-main">
    <div
      class="u-dialog__wrapper dialog-common-header"
      ref="dialog"
      style="z-index: 2555"
    >
      <!--:class="{ 'pop-up': true, show: show }"-->
      <div
        class="u-dialog u-dialog__mini"
        ref="dialog__mini"
        style="top: 59.5px; width: 440px"
      >
        <div class="u-dialog__header">
          <span class="u-dialog__title">{{ onlyFolder === true ? '选择目录' : '选择文件' }}</span>
          <button type="button" aria-label="Close" class="u-dialog__headerbtn">
            <i
              class="u-dialog__close u-icon u-icon-close iconfont icon-guanbi"
              @click="cancel"
            ></i>
          </button>
        </div>
        <!--文件选择框-->
        <div class="folder-selector-dialog__body" ref="formRef"
        >
          <div class="folder-selector-dialog__selector-wrapper">
            <div class="file-selector__body">
              <!--路径导航-->
              <div class="file-selector__nav">
                <div class="file-selector__nav-left">
                  <div class="item-group" v-show="fullPath === '/'">
                    <span class="file-selector__nav-item">{{
                        this.userInfo.userName
                      }}</span>
                  </div>
                  <div v-if="fullPath !== '/'">
                    <span class="file-selector__nav-item">
                      <span
                        class="file-selector__nav-item-title text-ellip"
                        @click="back()"
                      >返回上一级</span
                      >
                      <span class="file-selector__nav-item-sep">|</span>
                    </span>
                    <span class="file-selector__nav-item">
                      <span
                        class="file-selector__nav-item-title text-ellip"
                        @click="back('/')"
                      >全部文件
                      </span>
                      <span class="file-selector__nav-item-sep">></span>
                    </span>
                    <span
                      class="file-selector__nav-item"
                      v-for="(item, index) in fullPath.split('/').slice(1)"
                      :key="item"
                    >
                      <span
                        class="file-selector__nav-item-title text-ellip is-current-nav"
                        :path="fullPath.split('/')"
                        @click="navigate(index)"
                        :index="index"
                      >{{ item }}</span
                      >
                      <span class="file-selector__nav-item-sep">></span>
                    </span>
                  </div>

                  <!--<div v-if="fullPath === '/'">-->
                  <!--  <span class="title">{{ this.store.state.userInfo.userName }}</span>-->
                  <!--</div>-->
                </div>
                <!--<path-nav-->
                <!--  :fileList.sync="fileList"-->
                <!--  :currentPath="''"-->
                <!--&gt;</path-nav>-->
              </div>

              <div class="detail-filelist__list bg">
                <div>
                  <div
                    class="detail-filename"
                    :key="index"
                    :index="index"
                    :class="index === selectIndex ? 'is-selected' : ''"
                    :data-path="item.filePath"
                    v-for="(item, index) in sortFileList"
                    @click="clickActions(index, item, $event)"
                  >
                    <!--@click="selectTargetPath(item, $event)"-->
                    <img
                      :src="setFileImg(item)"
                      alt=""
                      class="detail-filename__title-icon img-before-icon iconfont icon-pure-color"
                    />

                    <span
                      class="detail-filename__title-text inline-block-v-middle text-ellip"
                    >{{ item.fileName }}</span
                    >
                  </div>

                </div>
                <div class="el-loading-mask" v-show="showLoading">
                  <div class="el-loading-spinner">
                    <svg viewBox="25 25 50 50" class="circular">
                      <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
                    </svg>
                    <p class="el-loading-text">加载中...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="u-dialog__footer">
          <div class="dialog-footer-center dialog-common-footer">
            <button
              class="u-button second-primary-btn btn-fix-size-middle u-button--week u-button--medium is-round"
              type="button"
              @click="cancel"
            >
              <span> 取消 </span>
            </button>
            <button
              @click="select"
              type="button"
              class="u-button btn-fix-size-middle u-button--primary u-button--medium is-round"
            >
            <span>
              <!--showType === 1 ? copyOptinon.noBtnText : showType === 2 ? moveOptinon.noBtnText ? showType === 3 ? renameOption.noBtnText : defaultOption.noBtnText-->
             {{ onlyFolder ? '选择目录' : '选择文件' }}</span
            >
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import store from '@/store'
import { getFileListByPath } from '@/request/file'

export default {
  name: 'FileSelector',
  props: {
    // title: {
    //   type: String,
    //   default: this.onlyFolder ? '选择目标文件夹' : '选择目标文件'
    // },
    onlyFolder: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: () => {
        return store.state.userInfo
      }
    },
    show: {
      type: Boolean,
      default: false
    }
    // extName: {
    //   type: Array
    // }
  },
  components: {},
  data () {
    return {
      visible: false,
      showLoading: false,
      resolveData: {},
      fileList: [],
      folderList: [],
      sortFileList: [],
      fullPath: '/',
      selectIndex: -1,
      extName: [],
      currentFolderId: -1
    }
  },
  watch: {
    show: function(newVal, oldVal) {
      if (newVal === true) {
        this.fullPath = '/'
        this.getFileList('/', false)
      }
    }
  },
  computed: {},
  created () {
    // this.getFileList('/', false)
  },
  mounted () {
    this.visible = true
  },
  methods: {
    init () {
      this.sortFileList.length = 0
    },
    // 组件初始化
    fileSelector (options) {
      console.log(options)
      if (options.visible) {
        this.getFileList('/', false)
      }
      const _this = this
      this.extName = options.extName
      return new Promise(function(resolve, reject) {
        _this.promiseStatus = {
          resolve,
          reject
        }
      })
    },
    cancel () {
      this.show = false
      var self = document.querySelector('.file-selector-main')
      if (!this.show) {
        document.body.removeChild(self)
      }
      this.promiseStatus && this.promiseStatus.reject()
      // this.$refs.formRef.resetFields()
      // Object.assign(this.$data, this.$options.data.call(this))

      // eslint-disable-next-line no-undef
    },
    select () {
      var self = document.querySelector('.file-selector-main')
      this.resolveData.filePath = this.fullPath
      this.resolveData.fileId = this.currentFolderId
      this.show = false
      this.promiseStatus && this.promiseStatus.resolve(this.resolveData)
      document.body.removeChild(self)
    },
    clickActions: function(index, row, e) {
      if (row.isDir === 1) {
        this.currentFolderId = row.id
        this.enterFolder(index, row.fileName, e)
      } else {
        this.selectFile(index, row, e)
      }
    },
    // 获取文件列表(通过全路径)
    async getFileList (path, isRefresh) {
      this.showLoading = true
      this.fileList.length = 0
      this.sortFileList.length = 0
      this.folderList.length = 0
      var data
      if (this.onlyFolder === true) {
        data = {
          userId: this.getCookies('uid'),
          filePath: path === '' ? '/' : path,
          dir: 1,
          refresh: !!isRefresh
        }
      } else {
        // dir = 0
        data = {
          userId: this.getCookies('uid'),
          filePath: path === '' ? '/' : path,
          refresh: !!isRefresh
        }
      }
      // const data = {
      //   filePath: path === '' ? '/' : path,
      //   dir: dir
      // }
      getFileListByPath(data).then((res) => {
        if (res.code === 0) {
          this.init()
          // 关闭动画
          this.showLoading = false
          if (this.onlyFolder === true) {
            this.sortFileList = res.data.list.filter(item => item.isDir === 1)
            // .sort(this.compare('isDir', -1))
          } else {
            if (this.extName !== null) {
              this.sortFileList = res.data.list.sort(this.compare('isDir', -1)).filter(item =>
                (item.isDir === 1 || this.extName.includes(item.fileExt)))
            } else {
              this.sortFileList = res.data.list.sort(this.compare('isDir', -1))

              // this.sortFileList = res.data.list.filter(item => item.isDir === 0)
            }
            // this.sortFileList = res.data.list.sort(this.compare('isDir', -1))
          }
          // this.sortFileList = this.fileList.sort(this.compare('isDir', -1))
          this.selectedFile = new Array(this.fileList.length).fill(false)
        } else {
          this.showLoading = false
          if (res.code === 401) {
            this.$toast.error(res.msg)
          }
        }
      })
    },
    // 路径导航
    navigate (index) {
      const routerLength = this.fullPath.split('/').length
      // 判断点击导航是否是最后一个,即当前路径,不是最后一个则回退
      if (routerLength - 2 - index !== 0) {
        const pathArr = this.fullPath.split('/')
        // console.log(pathArr)
        // console.log('点击跳转目录:' + pathArr[index + 1])
        const targetPath = pathArr[index + 1]
        // console.log(routerLength)
        let newFullPath = ''
        // console.log('选中目录索引' + pathArr.indexOf(targetPath))
        for (let i = 0; i < pathArr.indexOf(targetPath) + 1; i++) {
          if (i !== 0) {
            newFullPath = newFullPath + '/' + pathArr[i]
          }
        }
        this.fullPath = newFullPath
        this.getFileList(this.fullPath, false)
      }
    },
    // 返回上一级目录
    back (path) {
      if (path === '/') {
        this.fullPath = '/'
        store.commit('updateCopyMovePathId', -1)
        this.getFileList(this.fullPath, false)
      } else {
        const index = this.fullPath.lastIndexOf('/')
        this.fullPath = this.fullPath.substring(0, index)
        this.getFileList(this.fullPath, false)

        if (this.fullPath === '') {
          this.fullPath = '/'
          store.commit('updateCopyMovePath', this.fullPath)
        }
      }
    },
    enterFolder (index, path, e) {
      this.selectTargetPath(this.sortFileList[index], e)
      store.commit('updateCopyMovePathId', this.sortFileList[index].id)
      // this.showLoading = true
      this.selectedFileCount = 0
      this.selectAllFiles = false
      console.log('enterFolder进入的文件夹:' + path)
      // var prePath = ''
      // 在根目录下 目录前缀为 '/',则重置前缀为空,由于参数path是带 '/'的,防止目录多一个'/'
      // if (this.fullPath === '/') {
      //   // prePath = ''
      // } else {
      //   prePath = this.fullPath
      // }
      if (this.fullPath === '/') {
        this.fullPath = this.fullPath + path
      } else {
        this.fullPath = this.fullPath + '/' + path
      }
      this.currentPath = '/' + path
      console.log('fullPath:' + this.fullPath)
      console.log('currentPath:' + this.currentPath)
      this.getFileList(this.fullPath, false)
    },
    selectFile (index, item, e) {
      this.selectIndex = index
      this.resolveData.file = item
      console.log(this.getLocalFilePath(item))
      console.log('选中文件:' + item.fileName)
    },
    selectTargetPath (item, e) {
      this.selectIndex = e.target.index
    }
  }
}
</script>

<style lang="less" scoped>
.detail-filename.is-selected {
  background-color: #cccccc;
}
</style>

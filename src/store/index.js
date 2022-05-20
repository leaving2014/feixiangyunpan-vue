import Vue from 'vue'
import Vuex from 'vuex'
import common from '@/store/module/common'
import user from '@/store/module/user'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    scrollFlag: true,
    userInfo: {},
    isLogin: false,
    userStorage: {},
    sysConfig: {},
    renameFileName: '',
    selectUserCount: 0,
    // 页数
    pageCount: 50,
    // 每页获取的数量
    pageSize: 5,
    // 当前页
    currentPage: 1,
    displayMode: 'block',
    currentTargetPath: '',
    // 复制移动文件目录路径
    copyMovePath: '/',
    // 复制移动文件目录路径 id
    copyMovePathId: -1,
    // 分享文件过期时间
    expiredTime: 30,
    // 当前显示文件列表
    fileList: [],
    // 提示框
    showMessage: false,
    // 选中文件数量
    selectFileCount: 0,
    selectFileList: [],
    // 选中文件的索引
    selectFileIndex: [],
    // 操作文件列表 文件id
    selectFileIdList: [],
    // 全路径
    fullPath: '/',
    // 选中目录全路径, 用于副窗口显示 选中文件夹的内容
    selectFullPath: '',
    // 音乐是否在播放
    isPlay: false
  },
  mutations: {
    setScrollFlag(state, scrollFlag) {
      state.scrollFlag = scrollFlag
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    // 更新用户登录状态
    updateIsLogin(state, isLogin) {
      state.isLogin = isLogin
    },
    // 更新用户存储空间信息
    // updateUserStorage(state, userStorage) {
    //   state.userStorage = userStorage
    // },
    updateUserStorage: (state, userStorage) => {
      state.userStorage = userStorage
    },
    // 更新系统配置
    updateSysConfig(state, sysConfig) {
      state.sysConfig = sysConfig
    },
    updateRenameFileName(state, renameFileName) {
      state.renameFileName = renameFileName
    },
    updateSelectUserCount(state, selectUserCount) {
      state.selectUserCount = selectUserCount
    },
    // 更新每页获取数量
    updatePageCount(state, pageCount) {
      state.pageCount = pageCount
    },
    // 更新操作文件列表
    updateSelectFileIdList(state, selectFileIdList) {
      state.selectFileIdList = selectFileIdList
    },
    // 更新当前页
    updateCurrentPage(state, currentPage) {
      state.currentPage = currentPage
    },
    // 更新文件显示方式 列表或图标
    updateDisplayMode(state, displayMode) {
      state.displayMode = displayMode
    },
    // 更新复制移动读取显示路径
    updateCurrentTargetPath(state, currentTargetPath) {
      state.currentTargetPath = currentTargetPath
    },
    // 更新复制移动目标路径
    updateCopyMovePath(state, copyMovePath) {
      state.copyMovePath = copyMovePath
    },
    // 更新复制移动目标路径 id
    updateCopyMovePathId(state, copyMovePathId) {
      state.copyMovePathId = copyMovePathId
    },
    // 更新分享文件过期时间
    updateExpiredTime(state, expiredTime) {
      state.expiredTime = expiredTime
    },
    // 更新文件列表
    updateFileList(state, fileList) {
      state.fileList = fileList
    },
    updateShowMessage(state, showMessage) {
      state.showMessage = showMessage
    },
    // 选中文件数量
    updateSelectFileCount(state, selectFileCount) {
      state.selectFileCount = selectFileCount
    },
    // 选中文件索引
    updateSelectFileIndex(state, selectFileIndex) {
      state.selectFileIndex = selectFileIndex
    },
    // 当前全路径
    updateFullPath(state, fullPath) {
      state.fullPath = fullPath
    },
    // 选中全路径 = 当前路径 + 点击选中的文件夹
    updateSelectFullPath(state, selectFullPath) {
      state.selectFullPath = selectFullPath
    }
  },
  actions: {},
  getters: {
    selectFileIdList: (state) => state.selectFileIdList,
    userStorage: (state) => state.userStorage,
    userInfo: (state) => state.userInfo
  },
  modules: {
    common,
    user
  }
})

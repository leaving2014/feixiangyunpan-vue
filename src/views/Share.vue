<template>
  <div class="note-main">
    <div class="note-main__tip">
      <div class="text">
        提示:链接分享(分享失败或分享过期的将被自动清理)
      </div>
      <div class="actions">
        <button
          class="u-button u-button--primary u-button--small is-round"
          @click="clearInvalidShare()"
        >
          <i class="iconfont icon-shanchu"></i>
          <span>清除过期分享</span>
        </button>
      </div>
    </div>

    <div class="note-main__title">
      <div class="name">全部文件</div>
      <div class="count">已全部加载,共 {{ fileList.length }} 个</div>
    </div>

    <div class="container" id="share-list">
      <!--列表-->
      <div class="table share-list is-show-header">
        <div class="table__header">
          <table class="table__header-table">
            <colgroup>
              <col width="3%" />
              <col width="35%" />
              <col width="20%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <thead>
            <tr class="table__header-row">
              <th class="text-center table__header-select">
                <label
                  class="u-checkbox file-grid-list__select-all"
                  :class="selectAllFiles === true ? 'is-checked' : ''"
                >
                    <span
                      class="u-checkbox__input"
                      :class="selectAllFiles === true ? 'is-checked' : ''"
                    >
                      <span class="u-checkbox__inner"></span>
                      <input
                        type="checkbox"
                        aria-hidden="false"
                        @click.stop="selectAll($event)"
                        class="u-checkbox__original"
                        value=""
                      />
                    </span>
                </label>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle">
                  <section class="share-list__name_header">
                      <span @click="changeOrder('fileName')">{{
                          selectedFileCount > 0
                            ? '已选择' + selectedFileCount + '个文件/文件夹'
                            : '分享文件'
                        }}</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='fileName'" @click="changeOrder('fileName')">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle">
                  <section class="share-list__name_header">
                    <span @click="changeOrder('shareTime')">分享时间</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='shareTime'" @click="changeOrder('shareTime')">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle">
                  <section class="share-list__name_header">
                    <span @click="changeOrder('expiredTimes')">过期时间</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='browseTime'" @click="changeOrder('expiredTime')">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle">
                  <section class="share-list__name_header">
                    <span @click="changeOrder('browseTimes')">浏览次数</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='browseTimes'" @click="changeOrder('browseTimes')">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
            </tr>
            </thead>
          </table>
        </div>
        <!--数据显示主体-->
        <div class="table__body" v-if="fileList.length > 0">
          <table class="table__body-table">
            <colgroup>
              <col width="3%" />
              <col width="35%" />
              <col width="20%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <tbody>
            <tr
              class="table__body-row"
              :class="selectedFile[index] === true ? 'selected' : ''"
              @click.stop="selectFile(index, $event)"
              v-contextmenu:contextmenu
              :index="index"
              @contextmenu.prevent="openMenu($event, item, index)"
              v-for="(item, index) in fileList"
              :key="index"
              :sid="item.batchNum"
            >
              <td class="text-center">
                <label
                  class="u-checkbox"
                  :class="selectedFile[index] === true ? 'is-checked' : ''"
                >
                    <span
                      class="u-checkbox__input"
                      :class="selectedFile[index] === true ? 'is-checked' : ''"
                    >
                      <span class="u-checkbox__inner"></span>
                      <input
                        type="checkbox"
                        aria-hidden="false"
                        @click="selectFile(index, $event)"
                        class="u-checkbox__original"
                        value=""
                      />
                    </span>
                </label>
              </td>
              <td class="text-ellip table__td">
                <div class="list-name share-list__list-title" style="padding-left: 0">
                  <div class="pointer-events-all cursor-p" draggable="true">
                    <img
                      :src="setFileImg(item)"
                      class="list-name__title-icon img-before-icon iconfont icon-pure-color"
                    />
                    <a
                      class="list-name__title-text inline-block-v-middle text-ellip"
                      title=""
                    >{{ item.fileName }}</a
                    >
                  </div>
                </div>
              </td>
              <td class="text-ellip table__td normal-column">
                <section class="column-content-hide" style="text-align: left">
                    <span>{{
                        item.shareTime
                      }}</span>
                </section>
              </td>
              <td class="text-ellip table__td normal-column">
                <div class="share-list__list-title share-deletetime-column">
                  <p class="column-content-hide"
                     :class="new Date(item.expiredTime.replace(/-/g, '/')).getTime() < new Date().getTime()?'warn':''">
                    <template v-if="new Date(item.expiredTime.replace(/-/g, '/')).getTime() > new Date().getTime()">
                      <!--{{ item.expired === 0 ? '永久有效' : getTimeDifference(new Date(item.expiredTime).getTime()) + '天后过期'-->
                      <!--}}-->
                      {{ item.expired === 0 ? '永久有效' : calcDiffTime(new Date(item.expiredTime.replace(/-/g, '/'))) + '后过期'
                      }}
                    </template>
                    <template v-else>
                      已过期 {{ calcDiffTime(new Date(item.expiredTime.replace(/-/g, '/'))) }}
                    </template>
                    <!--{{ calcExpiredTime(item) }}-->
                    <!--{{ item.status === 0 ? item.expired === 0 ? '永久有效' -->
                    <!--: getTimeDifference(new Date(item.expiredTime).getTime()) > 0 -->
                    <!--  ? getTimeDifference(new Date(item.expiredTime).getTime()) + '天后过期' -->
                    <!--  : '已过期' + (-getTimeDifference(new Date(item.expiredTime).getTime())) + '天' -->
                    <!--: item.status === 1 ? '已失效' : item.status === 2 ? '已取消' : '已冻结'-->
                    <!--}}-->
                  </p>
                  <div
                    class="column-content-show share-deletetime-column__actions theme-primary-text"
                    style="display: none"
                  >
                    <section class="inline-block-v-middle">
                      <i
                        class="u-icon u-icon-recovery is-restore"
                        title="还原"
                      ></i>
                      还原
                    </section>
                    <section class="inline-block-v-middle pdl10">
                      <i class="u-icon u-icon-delete is-delete"></i>
                      删除
                    </section>
                  </div>
                </div>
              </td>
              <td class="text-ellip table__td normal-column">
                <div
                  class="share-list__list-title share-lefttime-column column-content-hide"
                >
                  <span>{{ item.browseTimes }}次</span>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div
          class="nd-table__body-empty"
          v-if="fileList.length === 0"
          style="vertical-align: middle;margin-top: 30px"
        >
          <p class="nd-table__body-empty-text">暂无数据</p>
        </div>
      </div>

      <FileInfo
        :file-list="fileList"
        :selectFileIndex="selectFileIndex"
        :selectedFileCount="selectedFileCount"
      ></FileInfo>
      <Loading v-show="loading"></Loading>
    </div>
    <v-contextmenu class="contextmenu" ref="contextmenu" style="width: 120px">
      <template>
        <v-contextmenu-item style="margin: 3px 0"

                            @click="copyShareLink(fileList[selectFileIndex])">
          <!--<i class="iconfont icon-wenzishibie v-contextmenu-submenu__icon" style="font-size: 14px">-->
          <!--</i>-->
          复制分享链接
        </v-contextmenu-item>
        <v-contextmenu-item style="margin: 3px 0"
                            @click="cancelShare(fileList[selectFileIndex])">
          <!--<i class="iconfont icon-wenzishibie v-contextmenu-submenu__icon" style="font-size: 14px">-->
          <!--</i>-->
          取消分享
        </v-contextmenu-item>
      </template>
    </v-contextmenu>

    <!--菜单-->
    <!--<ContextMenu-->
    <!--  :left="menuLeft"-->
    <!--  :top="menuTop"-->
    <!--  v-show="showMenu"-->
    <!--  :selectedFile="selectedFile"-->
    <!--  :file="fileList[this.selectFileIndex]"-->
    <!--  :count="selectedFileCount"-->
    <!--&gt;</ContextMenu>-->
  </div>
</template>

<script>
import FileInfo from '@/components/index/fileInfo/FileInfo'
import Loading from '@/components/common/loading/Loading'
import { cancelShareFile, clearInvalideShare, getShareList } from '@/request/file'
// import config from '@/config'

export default {
  name: 'Share',
  props: {},
  components: {
    // ContextMenu,
    FileInfo,
    Loading
  },
  data () {
    return {
      showDialog: false,
      selectedFileCount: 0,
      selectFileIndex: -1,
      selectedFile: [],
      selectAllFiles: false,
      fileList: [],
      // 右键菜单
      showMenu: false,
      selectFileList: [],
      selectFileIdList: [],
      visible: false,
      // 右键菜单弹窗左边距离
      menuLeft: 0,
      // 右键菜单弹窗上边距离
      menuTop: 0,
      menuFileIndex: -1,
      loading: true,
      orderColumn: '',
      order: ''
    }
  },
  watch: {
    // 监听选择文件数量
    selectedFileCount: function() {
      if (this.selectedFileCount === 1) {
        this.menuType = 1
      } else if (this.selectedFileCount > 1) {
        this.menuType = 2
      }
      this.selectFileList.length = 0
      this.selectFileIdList.length = 0

      var i = 0
      for (const argumentsKey of this.selectedFile) {
        if (argumentsKey === true) {
          this.selectFileList.push(this.fileList[i])
          this.selectFileIdList.push(this.fileList[i].id)
        }
        i++
      }
    },
    showMenu (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  computed: {
    calcExpiredTime (item) {
      if (item.expired === 0) {
        return '永久有效'
      }
      var day = this.getTimeDifference(new Date(item.expiredTime).getTime())
      if (day > 0) {
        return day + '天后到期'
      } else if (day === 0) {
        return '今天到期'
      } else {
        return '已过期' + Math.abs(day) + '天'
      }
    }
  },
  created () {
    this.getShareList()
  },
  mounted () {
    document.addEventListener('mouseup', (e) => {
      const el = this.$refs.dialog__mini
      if (el) {
        if (el !== e.target) {
          this.showDialog = false
        }
        if (!el.contains(e.target)) {
          this.showDialog = false
        }
      }
    })
  },
  methods: {
    init () {
      this.selectedFileCount = 0
      this.selectFileIndex = -1
      this.selectedFile = new Array(this.fileList.length).fill(false)
    },
    // 修改排序方式
    changeOrder (column) {
      if (column !== this.orderColumn) {
        this.order = 'desc'
      } else {
        if (this.order == '') {
          this.order = 'desc'
        } else if (this.order == 'desc') {
          this.order = 'asc'
        } else if (this.order == 'asc') {
          this.order = 'desc'
        }
      }
      this.orderColumn = column
      this.fileList = this.generateNewList(this.orderColumn, this.order, this.fileList)
    },
    selectFile (index, e) {
      if (this.selectAllFiles === true) {
        this.selectAllFiles = false
      }
      if (this.selectedFile[index] == false) {
        this.selectedFileCount += 1
        this.selectedFile[index] = true
        this.$store.commit('updateSelectFileCount', this.selectedFileCount)
        // 判断是否所有都选则
        if (
          this.selectedFile.filter((file) => file == true).length ===
          this.fileList.length
        ) {
          this.selectAllFiles = true
        } else {
          this.selectAllFiles = false
        }
      } else {
        this.selectedFileCount -= 1
        this.selectedFile[index] = false
        this.$store.commit('updateSelectFileCount', this.selectedFileCount)
      }
      if (this.selectedFileCount === 1) {
        this.selectFileIndex = this.getSelectedFileIndex(
          this.selectedFile,
          true
        )
      } else {
        this.selectFileIndex = -1
      }
    },
    openMenu (e, item, index) {
      if (this.selectedFile[index] === true) {
      } else {
        this.init()
      }
      this.menuFileIndex = e.target
        .closest('.table__body-row')
        .getAttribute('index')
      this.rightClickItem = item
      this.menuLeft = e.screenX - 190
      this.menuTop = e.screenY - 160
      this.showMenu = true
      if (this.getSelectedFileIndex(this.selectedFile, index) === index) {
        this.selectFile(index, e)
      } else if (this.selectedFileCount === 0) {
        this.selectFile(index, e)
      }
      if (this.selectedFile.length === 0) {
        this.selectedFileCount = 0
      }
    },
    closeMenu () {
      this.showMenu = false
    },
    getSelectedFileIndex (arrays, obj) {
      var i = arrays.length
      while (i--) {
        if (arrays[i] === obj) {
          return i
        }
      }
      return false
    },
    // 选择所有文件
    selectAll (e) {
      if (this.selectAllFiles === true) {
        // 取消选中所有
        this.selectedFileCount = 0
        this.selectedFile = new Array(this.fileList.length).fill(false)
      } else {
        this.selectedFileCount = this.fileList.length
        this.selectedFile = new Array(this.fileList.length).fill(true)
      }
      this.selectAllFiles = !this.selectAllFiles
    },
    copyShareLink (row) {
      if (this.selectedFileCount > 1) {
        this.$toast.error('请选择一个文件复制链接')
        return
      }
      if (new Date(row.expiredTime).getTime() < new Date().getTime()) {
        this.$toast.error('该分享已过期,无法复制链接')
        return
      }
      var input = document.createElement('input') // 直接构建input
      input.value = this.getHostUrl() + '/#/s/' + row.batchNum + '?extractionCode=' + row.extractionCode // 设置内容
      document.body.appendChild(input) // 添加临时实例
      input.select() // 选择实例内容
      document.execCommand('Copy') // 执行复制
      document.body.removeChild(input) // 删除临时实例
      this.$toast.success('复制成功')
    },
    // 获取分享列表
    getShareList () {
      getShareList().then((res) => {
        if (res.code === 0) {
          this.loading = false
          this.selectedFileCount = 0
          this.fileList.length = 0
          this.fileList = res.data.list
          this.selectedFile = new Array(this.fileList.length).fill(false)
          this.loading = false
        } else {
          this.$toast.error(res.msg)
        }
      })
    },
    clearInvalidShare () {
      var invalidList = this.fileList.filter((item) => {
        return new Date(item.expiredTime).getTime() < new Date().getTime()
      })
      if (invalidList.length === 0) {
        this.$toast.error('没有过期的分享')
        return
      }
      this.$confirmBox({
        title: '清除失效分享',
        msg: '确定清除失效分享文件吗',
        showType: 0
      })
        .then(() => {
          clearInvalideShare().then((res) => {
            if (res.code === 0) {
              if (res.data.total > 0) {
                this.$toast.success(res.msg + ',共清除' + res.data.total + '个失效分享')
                this.getShareList()
              } else {
                this.$toast.success(res.msg)
              }
            } else {
              this.$toast.error(res.msg)
            }
          })
        })
        .catch(() => {
          this.$toast('已取消')
        })
    },
    cancelShare (row) {
      const data = {
        id: row.id,
        batchNum: row.batchNum
      }
      this.$confirmBox({
        title: '取消分享',
        msg: '取消分享后，该条分享记录将被删除，好友将无法再访问此分享链接。\n' +
          '你确认要取消分享吗？',
        showType: 0
      })
        .then(() => {
          cancelShareFile(data).then((res) => {
            if (res.code === 0) {
              this.$toast.success(res.msg)
              this.getShareList()
            } else {
              this.$toast.error(res.msg)
            }
          })
        })
        .catch(() => {
          this.$toast.success('已取消')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.note-main {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 20px;
  min-width: 750px;

  .note-main__tip {
    color: #666;
    padding: 10px 0;
    font-size: 12px;
    height: 56px;
    position: relative;

    .text {
      position: absolute;
      left: 0;
      max-width: 79%;
      display: inline-block;
      line-height: 36px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      //width: 400px;
      //text-align: left;
    }

    .actions {
      display: inline-block;
      position: absolute;
      right: 0;
      //width: 100px !important;

      .u-button--small,
      .u-button--small.is-round {
        padding: 9px 16px;
      }

      .u-button.is-round {
        border-radius: 20px;
        padding: 12px 36px;
      }

      .u-button--primary {
        color: #fff;
        background-color: #06a7ff;
        border-color: #06a7ff;
      }
    }
  }

  .note-main__title {
    width: calc(100% - 288px);;
    font-size: 12px;
    padding-right: 18px;
    position: relative;
    height: 40px;

    .name {
      color: #03081a;
      font-weight: 700;
      display: inline-block;
      position: absolute;
      left: 0;
    }

    .count {
      color: #afb3bf;
      display: inline-block;
      position: absolute;
      right: 0;
    }
  }

  .container {
    //height: calc(100% - 150px);

    .table td,
    .table th,
    .table tr {
      line-height: 1;
    }

    .share-list {
      height: 100%;
      width: calc(100% - 288px);
      display: inline-block;
      vertical-align: top;

      .table__header-table {
        width: 100%;
        table-layout: fixed;

        .table__header-row {
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #f9f9f9;
          color: #03081a;
          text-align: left;
          font-size: 12px;

          .table__header-th {
            .content {
              position: relative;
              width: 100%;
              text-align: left;

              .share-list__name_header {
                display: inline-block;
                margin-left: 8px;
                font-weight: 700;
              }
            }
          }
        }
      }

      .table__body-table {
        width: 100%;
        table-layout: fixed;
        color: #424e67;

        .table__body-row:hover {
          background-color: #fafafc;
          border-color: #fafafc;
        }

        .table__body-row.selected {
          background: #f0faff !important;
        }

        .table__body-row {
          //padding-left: 14px;
          border-bottom: 1px solid #f9f9f9;
          height: 50px;
          line-height: 50px;
          color: #03081a;
          font-size: 12px;

          .normal-column {
            font-size: 12px;
            color: #afb3bf;
            overflow: inherit;
          }

          .text-center {
            text-align: center;
          }

          .share-list__list-title {
            position: relative;
            padding-right: 6.36896vw;
            line-height: 1;
            cursor: pointer;
            text-align: left;

            .list-name__title-icon {
              width: 30px;
              height: 30px;
              vertical-align: middle;
              position: relative;
              color: hsla(0, 0%, 74.1%, 0.28);
              line-height: 1;
            }

            .iconfont {
              font-size: 22px;
            }

            .list-name__title-text {
              margin-left: 6px;
            }
          }

          .column-content-hide {
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="recycle-main">
    <div class="recycle-main__tip">
      <div class="text">
        <el-input
          placeholder="请输入搜索内容"
          v-model="keyword"
          @clear="clearSearchKeyWords"
          @keyup.enter.native="search"
          clearable>
        </el-input>
      </div>
      <div class="actions">
        <button
          class="u-button u-button--primary u-button--small is-round"
          @click="deleteAll()"
        >
          <i class="iconfont icon-shanchu"></i>
          <span>清空回收站</span>
        </button>
      </div>
    </div>

    <div class="recycle-main__title">
      <div class="name">回收站</div>
      <div class="count">已全部加载，共 {{ fileList.length }} 个</div>
    </div>

    <div class="container" id="recycle-list">
      <!--标题-->
      <div class="table recycle-list is-show-header">
        <div class="table__header">
          <table class="table__header-table">
            <colgroup>
              <col width="3%" />
              <col width="50%" />
              <col width="15%" />
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
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('fileName')">
                  <section class="recycle-list__name_header">
                      <span>{{
                          selectedFileCount > 0
                            ? '已选择' + selectedFileCount + '个文件/文件夹'
                            : '文件名'
                        }}</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='name'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('fileSize')">
                  <section class="recycle-list__name_header">
                    <span>大小</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='size'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>

                </div>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('fileUpdateTime')">
                  <section class="recycle-list__name_header">
                    <span>删除时间</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='time'">
                    <i class="iconfont icon icon-shangsanjiaoxing"
                       :class="order==='asc'?'active':''"></i>
                    <i class="iconfont icon icon-xiasanjiaoxing"
                       :class="order==='desc'?'active':''"></i>
                  </div>
                </div>
              </th>
              <th class="table__header-th">
                <div class="text-ellip content inline-block-v-middle" @click="changeOrder('expired')">
                  <section class="recycle-list__name_header">
                    <span>有效时间</span>
                  </section>
                  <div class="nd-sort" v-show="orderColumn=='expired'">
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
        <div class="table__body" v-if="fileList.length> 0">
          <table class="table__body-table">
            <colgroup>
              <col width="3%" />
              <col width="50%" />
              <col width="15%" />
              <col width="15%" />
              <col width="15%" />
            </colgroup>
            <tbody>
            <tr
              class="table__body-row"
              :class="selectedFile[index] === true ? 'selected' : ''"
              @click.stop="selectFile(index, $event)"
              :index="index"
              v-contextmenu:contextmenu
              @contextmenu.prevent="openMenu($event, item, index)"
              @touchstart="showDeleteButton($event, item, index)"
              @touchend="clearLoop($event, item, index)"
              v-for="(item, index) in fileList"
              :key="index"
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
              <td class="text-ellip table__td" style="padding-left: 0px">
                <div class="list-name recycle-list__list-title" style="padding-left: 0px">
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
                    <span v-if="item.isDir === 0">{{
                        item.fileSize | storageTrans
                      }}</span>
                  <span v-else>-</span>
                </section>
              </td>
              <td class="text-ellip table__td normal-column">
                <div
                  class="recycle-list__list-title recycle-deletetime-column"
                >
                  <p class="column-content-hide">{{ item.fileUpdateTime }}</p>
                  <div
                    class="column-content-show recycle-deletetime-column__actions theme-primary-text"
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
                  class="recycle-list__list-title recycle-lefttime-column column-content-hide"
                >
                  <span>10天</span>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="table__body-empty" v-if="fileList.length === 0" style="vertical-align: middle">
          <p class="table__body-empty-text">暂无数据</p>
        </div>
      </div>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size=this.pageSize
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <Loading v-show="loading"></Loading>
    </div>

    <v-contextmenu class="contextmenu" ref="contextmenu" style="width: 120px">
      <template>
        <v-contextmenu-item
          @click="menuMethods(item.methodName)"
          style="margin: 3px 0"
          v-for="item in RecycleMenuList"
          :key="item.id">
          <i class="iconfont v-contextmenu-submenu__icon"
             :class="item.iconClassName"></i>
          {{ item.name }}
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
import Loading from '@/components/common/loading/Loading'
import { deleteRecycleFile, getRecycleFiles, restoreRecycleFile } from '@/request/manage'
import { RecycleMenuList } from '@/libs/map'
import { clearRecoveryFile } from '@/request/file'

export default {
  name: 'RecycleManage',
  props: {},
  components: {
    Loading
  },
  data () {
    return {
      RecycleMenuList,
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
      pageNum: 1,
      pageSize: 20,
      total: 0,
      keyword: '',
      orderColumn: '',
      order: ''
    }
  },
  watch: {
    pageNum: function(val) {
      this.getRecycleFiles()
    },
    pageSize: function(val) {
      this.getRecycleFiles()
    },
    // 监听选择文件数量
    selectedFileCount: function() {
      if (this.selectedFileCount === 1) {
        this.menuType = 1
      } else if (this.selectedFileCount > 1) {
        this.menuType = 2
      }
      this.selectFileList.length = 0
      this.selectFileIdList.length = 0

      console.log(this.selectedFile)
      var i = 0
      for (const argumentsKey of this.selectedFile) {
        if (argumentsKey === true) {
          this.selectFileList.push(this.fileList[i])
          this.selectFileIdList.push(this.fileList[i].id)
        }
        i++
      }
      console.log(this.selectFileList)
    },
    showMenu (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  computed: {},
  created () {
    this.getRecycleFiles()
  },
  mounted () {
    document.addEventListener('mouseup', (e) => {
      const el = this.$refs.dialog__mini
      if (el) {
        console.log(el)
        if (el !== e.target) {
          this.showDialog = false
        }
        // if (!el.contains(e.target)) {
        //   this.showDialog = false
        // }
      }
    })
  },
  methods: {
    init () {
      this.selectedFileCount = 0
      this.selectFileIndex = -1
      this.selectedFile = new Array(this.fileList.length).fill(false)
    },
    search () {
      this.getRecycleFiles()
    },
    clearSearchKeyWords () {
      this.keyword = ''
      this.getRecycleFiles()
    },
    handleSizeChange (val) {
      this.pageSize = val
    },
    handleCurrentChange (val) {
      this.pageNum = val
    },
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
      console.log('this.order', this.order)
      this.fileList = this.generateNewList(this.orderColumn, this.order, this.fileList)
      // this.getShareLists()
    },
    menuMethods (method) {
      this[method]()
    },
    // 清空回收站
    deleteAll () {
      if (this.fileList === 0) {
        this.$toast.error('回收站为空')
        return
      }
      this.$confirmBox({
        title: '清空回收站',
        msg: '确定清空回收站吗？',
        showType: 0
      })
        .then(() => {
          this.selectAll()
          clearRecoveryFile().then((res) => {
            console.log(res)
            if (res.code === 0) {
              this.fileList.length = 0
              this.selectedFileCount = 0
              // this.getRecycleFileList()
              this.$toast.success(res.msg)
            } else {
              this.$toast.error(res.msg)
            }
          })
        })
        .catch(() => {
        })
    },
    // 还原回收站文件
    restoreFile () {
      this.$confirmBox({
        title: '还原文件',
        msg: '确定还原选中的文件吗？',
        showType: 0
      })
        .then(() => {
          restoreRecycleFile(
            this.selectFileIdList
          ).then((res) => {
            console.log(res)
            if (res.code === 0) {
              this.getRecycleFiles()
              this.getFileList('/', true)
              this.$store.commit('updateUserStorage', res.data.userStorage)
              this.$toast.success('还原成功')
            } else {
              this.$toast.error('还原失败')
            }
          })
        })
        .catch(() => {
        })
    },
    // 删除回收站文件
    deleteRecycle () {
      this.$confirmBox({
        title: '彻底删除',
        msg: '确定彻底删除选中的项目吗？',
        showType: 0
      })
        .then(() => {
          console.log('彻底删除')
          deleteRecycleFile(this.selectFileIdList).then((res) => {
            console.log(res)
            if (res.code === 0) {
              this.fileList.length = 0
              this.selectedFileCount = 0
              this.getRecycleFiles()
              this.$toast.success(res.msg)
            } else {
              this.$toast.error(res.msg)
            }
          })
        })
        .catch(() => {
        })
    },
    selectFile (index, e) {
      console.log('选中文件index:' + index)
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
      if (this.getSelectedFileIndex(this.selectedFile, index) === index) {
        this.selectFile(index, e)
      } else if (this.selectedFileCount === 0) {
        this.selectFile(index, e)
      }
    },
    closeMenu () {
      this.showMenu = false
    },
    getSelectedFileIndex (arrays, obj) {
      var i = arrays.length
      while (i--) {
        if (arrays[i] === obj) {
          console.log('选中index==============================' + i)
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
      console.log(this.selectAllFiles)
    },
    // 获取回收站文件列表
    getRecycleFiles () {
      getRecycleFiles({
        query: this.keyword,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then((res) => {
        console.log(res)
        if (res.code === 0) {
          this.selectedFileCount = 0
          this.fileList.length = 0
          this.fileList = res.data.list
          this.selectedFile = new Array(this.fileList.length).fill(false)
          this.total = res.data.total
          this.loading = false
        } else {
          this.$toast.error(res.msg)
        }
      })
    },
    showDeleteButton (e, item, index) {
      const that = this
      this.showMenu = true
      clearTimeout(this.Loop) // 再次清空定时器，防止重复注册定时器
      this.Loop = setTimeout(
        function() {
          that.openMenu(e, item, index)
          e.target.dispatchEvent(e.target.createEvent('click'))
        },
        1000
      )
    },
    clearLoop (e) {
      clearTimeout(this.Loop)
    }
  }
}
</script>

<style lang="less" scoped>
.recycle-main {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 20px;
  min-width: 750px;

  .recycle-main__tip {
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

  .recycle-main__title {
    font-size: 12px;
    padding-right: 18px;
    position: relative;
    height: 40px;
    width: 100%;

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
    height: calc(100% - 150px);

    .table td,
    .table th,
    .table tr {
      line-height: 1;
    }

    .recycle-list {
      height: 100%;

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

              .recycle-list__name_header {
                display: inline-block;
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

          .list-name {
            padding-left: 0px !important;
          }

          .normal-column {
            font-size: 12px;
            color: #afb3bf;
            overflow: inherit;
          }

          .text-center {
            text-align: center;
          }

          .recycle-list__list-title {
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

  .table__body-empty {
    margin-top: 50px;
  }
}
</style>

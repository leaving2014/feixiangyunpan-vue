<template>
  <keep-alive>
    <section class="main-detail main-list__detail">


      <!--当选中一个文件夹时-->
      <div v-if="selectedFileCount === 1 && fileList[selectFileIndex].isDir===1">
        <div class="detail-filelist__title">文件夹内容</div>
        <div class="detail-filelist__name">
          <img src="@/assets/files/folder.png" alt="" class="icon">
          <span>{{ fileList[selectFileIndex].fileName }}</span>
        </div>
        <div class="detail-filelist__list bg">
          <div>
            <div class="detail-filename" v-for="(item, index) in sortFileList" :index="index" :key="index">
              <img :src="setFileImg(item)" alt=""
                   class="detail-filename__title-icon img-before-icon iconfont icon-pure-color">
              <span class="detail-filename__title-text inline-block-v-middle text-ellip">{{ item.fileName }}</span>
            </div>
          </div>
        </div>
      </div>

      <!--当选中文件数量大于1时-->
      <div class="detail__title" v-if="selectedFileCount > 1">
        {{
          this.selectedFileCount === 0
            ? '文件详情'
            : '共选中' + `${this.selectedFileCount}` + '个文件'
        }}
        <div class="detail__img bg" style="margin-top:10px;">
          <img
            src="@/assets/files/default.png"
            class="category"
          />
        </div>
      </div>
      <div>
        <!--空显示-->
        <!--当选中文件数量为0时-->
        <div class="detail__empty" v-if="this.selectedFileCount === 0">
          <img
            src="https://nd-static.bdstatic.com/m-static/v20-main/img/empty-folder.55c81ea2.png"
            class="img"
          />
          <p>选中文件，查看详情</p>
        </div>

        <!--文件详情显示 , 选中文件数量为1时-->
        <div class="detail__img bg" v-if="this.selectedFileCount === 1 && this.fileList[selectFileIndex].isDir===0">
          <img
            :src="fileList[selectFileIndex].fileType === 1 ? getImgMinPath(fileList[selectFileIndex]): setFileImg(fileList[selectFileIndex])"
            class="category" id="row-image"
            :class="fileList[selectFileIndex].fileType === 1 ? '':'image-icon'"
          />
        </div>
        <div class="detail__props" v-if="this.selectedFileCount === 1 && this.fileList[selectFileIndex].isDir===0">
          <div class="detail__name">
            <img
              :src="setFileImg(fileList[selectFileIndex])"
              class="icon"
            />
            <!--fileList[selectFileIndex].fileName-->
            <span class="file__name" style="margin-left: 5px">{{ fileList[selectFileIndex].fileName }}</span>
          </div>
          <div class="prop">
            创建时间:
            {{
              this.fileList[selectFileIndex].fileCreateTime
            }}
          </div>
          <div class="prop">
            最后修改:
            {{
              this.$route.path == '/share' ? this.fileList[selectFileIndex].updateTime : this.fileList[selectFileIndex].fileUpdateTime
            }}
          </div>
          <div class="prop" v-if="this.fileList[selectFileIndex].isDir===0">
            文件格式: {{ this.fileList[selectFileIndex].fileExt !== null ? this.fileList[selectFileIndex].fileExt : '' }}
            <!--{{-->
            <!--  selectFileIndex !== -1 ? '文件格式: ' + `${this.fileList[selectFileIndex].fileExt !== null ? this.fileList[selectFileIndex].fileExt : ''}`-->
            <!--}}-->
          </div>
          <div class="prop">
            <span>所在目录: </span>
            <div class="file-main__nav simple">
              <div class="file-main__nav-left">
                <div v-if="fullPath !== '/'">

                <span class="file-selector__nav-item">
                  <span class="file-selector__nav-item-title text-ellip" @click="back()"
                  >全部文件</span
                  >
                  <span class="file-selector__nav-item-sep">></span>
                </span>
                  <div class="file-selector__nav-list" v-if="this.$route.query.filePath !== undefined">
                  <span class="file-selector__nav-item"
                        v-for="(item, index) in this.$route.query.filePath.split('/').slice(1)" :key="item">
                          <span
                            class="file-selector__nav-item-title text-ellip"
                            :class="index===fullPath.length-1?'is-current-nav' :''"
                          >{{ item }}</span
                          >
                          <span class="file-selector__nav-item-sep">></span>
                        </span>
                  </div>


                </div>
                <div v-if="fullPath === '/'">
                  <span class="title">全部文件</span>
                </div>
              </div>
            </div>
          </div>
          <div class="prop" v-if="this.$route.path.includes('manage')">
            用户: {{ this.fileList[selectFileIndex].user !== null ? this.fileList[selectFileIndex].user.userName : '' }}
          </div>
          <div class="prop" v-if="this.$route.path.includes('/share')">
            提取码:
            {{ this.fileList[selectFileIndex].extractionCode !== null ? this.fileList[selectFileIndex].extractionCode : ''
            }}
          </div>
        </div>
      </div>
    </section>
  </keep-alive>

</template>

<script>
import { getFileListByPath } from '@/request/file.js'

export default {
  name: 'FileInfo',
  props: {
    folderName: {
      type: String
    },
    fullPath: {
      type: String,
      default: ''
    },
    fullPathArr: {
      type: Array
    },
    fileList: {
      type: Array
    },
    selectFileIndex: {
      type: Number,
      default: -1
    },
    selectedFileCount: {
      type: Number,
      default: 0
    }
  },
  components: {},
  data () {
    return {
      path: '/',
      // selectFileIndex: -1,
      selectedFile: [],
      sortFileList: [],
      currentFolderList: []
    }
  },
  watch: {
    '$store.state.selectFullPath': function(path) {
      if (this.$store.state.fileList[this.$store.state.selectFileIndex].isDir === 1) {
        this.getFileList(path, false)
      }
    }

  },
  computed: {},
  created () {
  },
  mounted () {
  },
  methods: {
    async getFileList (path, isRefresh) {
      const data = {
        filePath: path,
        refresh: !!isRefresh
        // filePath: this.filePath,
        // currentPage: this.pageData.currentPage,
        // pageCount: this.pageData.pageCount
      }
      getFileListByPath(data).then((res) => {
        console.log(JSON.parse(JSON.stringify(res.data.list)))
        if (res.code === 0) {
          this.currentFolderList = res.data.list
          this.sortFileList.length = 0
          this.sortFileList = res.data.list.sort(this.compare('isDir', -1))

          this.selectedFile = new Array(this.currentFolderList.length).fill(false)
          // this.pageData.total = res.data.total
          // this.loading = false
        } else {
          // this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>

.main-detail {
  padding: 16px;
  display: inline-block;
  background: #f5f6fa;
  border-radius: 8px;
  font-size: 12px;
  position: relative;
  overflow: auto;
  min-height: 450px;
  height: calc(100% - 130px);
  //height: 508px;

  .detail-filelist__title {
    text-align: left;
    color: #03081a;
    font-weight: 600;
    padding-bottom: 15px;
  }

  .detail-filelist__name {
    text-align: left;
    font-size: 14px;
    color: #454d5a;
    font-weight: 600;
    margin-top: 15px;
    word-break: break-all;

    .icon {
      width: 20px;
      height: 20px;
      -o-object-fit: contain;
      object-fit: contain;
      margin-right: 8px;
    }
  }

  .detail-filelist__list {
    background-color: #fff;
    width: 240px;
    height: 352px;
    border-radius: 13px;
    position: relative;
    margin-top: 14px;
    padding: 8px 12px;
    overflow-y: auto;

    .detail-filename {
      text-align: left;

      .detail-filename__title-icon {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        position: relative;
        color: hsla(0, 0%, 74.1%, .28);
        line-height: 1;
      }

      .detail-filename__title-icon.iconfont {
        font-size: 22px;
      }

      .detail-filename__title-text {
        padding-left: 5px;
        line-height: 40px;
        max-width: calc(100% - 40px);
      }
    }
  }

  .detail__title {
    color: #03081a;
    font-weight: 600;
    padding-bottom: 15px;
  }

  .detail__empty {
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    left: 50%;
    position: absolute;
    text-align: center;
    width: 240px;

    img {
      width: 60px;
      height: 60px;
    }

    p {
      color: #878c9c;
      letter-spacing: 0.57px;
      font-weight: 400;
      line-height: 50px;
    }
  }

  .detail__img {
    width: 240px;
    height: 134px;
    border-radius: 13px;
    position: relative;
  }

  .detail__img.bg {
    background: #fff;
  }

  .detail__img .category {
    position: absolute;
    left: 50%;
    top: 50%;
    object-fit: contain;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    //max-height: 134px;
    //max-width: 240px;
  }

  .detail__img .category.image-icon {
    max-height: 60px;
    max-width: 60px;
  }


  .detail__props {
    color: #878c9c;

    .detail__name {
      font-size: 14px;
      color: #454d5a;
      font-weight: 600;
      word-break: break-all;
      padding-top: 20px;

      .icon {
        width: 30px;
        height: 30px;
        object-fit: contain;
      }
    }

    .prop {
      margin-top: 10px;
      word-break: break-all;
      text-align: left;

      .file-main__nav {
        border-radius: 4px 4px 0 0;
        height: 40px;
        line-height: 40px;
        border-bottom-width: 0;
        overflow: hidden;
      }

      .simple {
        display: inline;
        height: auto;
        padding: 0;
        line-height: inherit;

        div {
          display: inline;
          float: none;
        }
      }
    }
  }
}

.main-list__detail {
  //height: calc(100% - 110px);
  width: 272px;
  margin-left: 16px;
  position: relative;
  top: 0;
}

.file-selector__nav-item:last-child > span {
  color: #afb3bf !important;
  cursor: text !important;
}
</style>

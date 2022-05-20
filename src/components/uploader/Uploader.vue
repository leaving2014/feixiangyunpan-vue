<template>
  <div class="dialog uploader upload-dialog" v-if="show"
       ref="uploaderWrapper">
    <section class="upload-dialog__left">
      <p class="upload-dialog__left-title">传输列表</p>
      <div class="upload-dialog__left-btn text-elip is-first"
           :class="[uploadTab=== 1 ? 'is-active' : '']"
           @click="changeTab(1)"
      >文件上传（1）
      </div>
      <a class="upload-dialog__left-btn text-elip"
         :class="[uploadTab=== 2 ? 'is-active' : '']"
         @click="changeTab(2)"
      >离线下载（{{ remoteDownloadList.length }}）</a>
    </section>
    <section class="middle"></section>

    <section class="right" tab="1" v-show="uploadTab===1">
      <div class="dialog-header">
        <p class="dialog-header-title">
          <em class="select-text">正在上传（0/1）</em>
          <span class="title-operate">
            <a style="display: none;">全部取消</a>
            <a style="display: none;">清空失败</a>
          </span>
        </p>
      </div>
      <div class="dialog-body">
        <div class="uploader-list-wrapper">
          <div class="uploader-list">
            <ul class="container" id="uploaderList">
              <li class="status-cancel file-list">
                <div class="info">
                  <div class="file-name">
                    <div class="file-icon">
                      <!--<img :src="setFileImg()" alt="">-->
                    </div>
                    <div class="file-progress">
                      <div class="name-text no-progress">11111</div>
                      <div class="progress-all progress-common"></div>
                      <div class="progress-now progress-common">
                        <div class="animation"></div>
                      </div>
                      <div class="status no-progress">
                        <span class="file-status">
                          <span class="error">
                            <span class="cursor-p"></span>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="file-operate">
                    <span class="common-icon-container"
                          v-show="uploadStatus==='success'"
                          title="所在文件夹"></span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="right" tab="2" v-show="uploadTab===2">
      <div class="remote-download-list">
        <div class="remote-download-list__header">
          <span class="remote-download-list__title">离线下载</span>
          <div class="remote-download-list__header-actions">
            <span class="remote-download-list__header-action theme-primary-text cursor-p"
                  @click="removeRecord(-1)"
            >清除记录</span>
          </div>
        </div>
        <div class="remote-download-list__body">
          <div class="remote-download-list__wrapper">
            <div class="remote-download-list__item is-no-progress"
                 v-for="(item,index) in remoteDownloadList"
                 :key="index"
            >
              <div class="remote-download-list__item-icon inline-block-v-middle">
                <img :src="setFileImg(item)" class="remote-download-list__item-icon-img">
              </div>
              <div class="remote-download-list__item-body inline-block-v-middle">
                <div class="remote-download-list__item-title text-elip">{{ item.fileName }}</div>
                <div class="remote-download-list__item-desc">
                  <span class="remote-download-list__item-size inline-block-v-middle">
                    {{
                      item.fileSize | storageTrans
                    }}
                  </span>
                </div>
              </div>
              <div class="remote-download-list__item-actions inline-block-v-middle">
                <span
                  class="u-tooltip remote-download-list__item-action-body inline-block-v-middle remote-download-list__item-action cursor-p">
                  <img src="@/assets/files/folder_blue.png" alt="" class="remote-download-list__item-action-img">
                </span>
                <span
                  class="u-tooltip remote-download-list__item-action-body inline-block-v-middle nd-remote-download-list__item-action inline-block-v-middle cursor-p">
                  <img src="@/assets/images/home/delete.png" class="remote-download-list__item-action-img"
                       @click="removeRecord(index)"
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!--<h3>uploader</h3>-->
  </div>
</template>

<script>
import store from '@/store'
import { getOfflineFileList } from '@/request/file'

export default {
  name: 'Uploader',
  props: {
    show: {
      type: Boolean
    },
    visible: {
      type: Boolean
    }
  },
  components: {},
  data () {
    return {
      remoteDownloadList: [],
      uploadTab: 1,
      // -1:失败 , 0: 等待, 1:成功, 2暂停 3排队 4.继续上传   5:取消
      uploadStatus: ''
    }
  },
  watch: {
    show: function(val) {
      if (val) {
        this.getOfflineFile()
      }
    }
  },
  computed: {},
  created () {
  },
  mounted () {
    this.remoteDownloadList = store.state.fileList
    document.addEventListener('mouseup', (e) => {
      const el = this.$refs.uploaderWrapper
      if (el) {
        if (!el.contains(e.target)) {
          this.visiable = false
        }
      }
    })
  },
  methods: {
    changeTab (index) {
      this.uploadTab = index
    },
    removeRecord (index) {
      if (index === -1) {
        console.log('清除所有')
        this.remoteDownloadList.length = 0
      } else {
        this.remoteDownloadList.splice(index, 1)
      }
    },
    getOfflineFile () {
      getOfflineFileList().then(res => {
        this.remoteDownloadList = res.data.list
      })
    }
  }
}
</script>

<style lang="less" scoped>
.dialog {
  top: 65px;
}

.upload-dialog {
  position: absolute;
  left: -708px;
  width: 704px;
  font-size: 12px;
  background: #fff;
  -webkit-box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .16);
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .16);
  border-radius: 8px;
  height: 408px;
  //position: absolute;
  //left: -704px;
  //width: 704px;
  //top: 70px;
  //font-size: 12px;
  //background: #fff;
  //-webkit-box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .16);
  //box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .16);
  //border-radius: 8px;
  //height: 408px;
  //z-index: 99999;
  //float: right;

  .upload-dialog__left {
    display: inline-block;
    position: absolute;
    line-height: 1;
    width: 144px;
    padding: 12px;

    .upload-dialog__left-title {
      color: #878c9c;
      letter-spacing: 0;
      line-height: 16px;
    }

    .upload-dialog__left-btn.is-first {
      margin-top: 8px;
    }

    .upload-dialog__left-btn.is-active {
      color: #06a7ff;
      background-color: #eef9fe;
    }

    .upload-dialog__left-btn {
      border-radius: 10px;
      padding-left: 12px;
      margin-top: 4px;
      display: block;
      width: 120px;
      height: 32px;
      line-height: 32px;
    }
  }

  .middle {
    width: 1px;
    background-color: #f4f4f4;
    height: 100%;
    position: absolute;
    left: 144px;
    top: 0;
  }

  .right {
    display: inline-block;
    position: absolute;
    right: 0;
    width: 560px;
    left: 145px;

    .dialog-header {
      font-size: 14px;
      font-weight: 600;
      border-bottom-width: 1px;
      border-color: #f4f4f4;
      border-bottom-style: solid;
      height: 40px;
      line-height: 24px;
      padding: 8px 16px;

      em {
        font-style: normal;
      }

      .title-operate {
        font-size: 12px;
        float: right;

        a {
          display: inline-block;
          color: #06a7ff;
          font-weight: 600;
          margin-left: 16px;
        }
      }
    }

    .dialog-body {
      .uploader-list-wrapper {
        position: relative;

        .uploader-list {
          position: relative;
          overflow: hidden;
          overflow-y: auto;
          height: 349px;

          .container {

            .file-list {
              position: relative;
              border-bottom: 1px solid #f2f6fd;
              height: 72px;
              line-height: 72px;

              .info {
                position: absolute;
                width: 100%;
                height: 100%;

                .file-name {
                  position: relative;
                  overflow: hidden;
                  width: 416px;
                  height: 72px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  display: inline-block;

                  .file-icon {
                    position: absolute;
                    top: 15px;
                    left: 10px;
                    width: 40px;
                    height: 40px;

                    img {
                      width: 30px;
                      height: 30px;
                      position: absolute;
                      right: 0;
                      image-rendering: -moz-crisp-edges;
                      image-rendering: -o-crisp-edges;
                    }
                  }

                  .file-progress {
                    display: inline-block;
                    position: absolute;
                    left: 56px;
                    line-height: 1;
                    width: 360px;
                  }
                }

                .name-text.no-progress {
                  padding: 19px 0 0 0;
                }

                .file-progress {
                  display: inline-block;
                  position: absolute;
                  left: 56px;
                  line-height: 1;
                  width: 360px;

                  .name-text {
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    font-size: 14px;
                    color: #03081a;
                    padding: 10px 0;
                  }
                }

                .file-operate {
                  display: inline-block;

                  .common-icon-container {
                    background: #f0faff;
                    border-radius: 13.28px;
                    display: inline-block;
                    width: 28px;
                    height: 28px;
                    position: relative;
                    color: #06a7ff;
                    margin-left: 12px;
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }

      }
    }

    .remote-download-list {
      line-height: 1.5;

      .remote-download-list__header {
        font-size: 14px;
        font-weight: 700;
        border-bottom: 1px solid #f4f4f4;
        padding: 8px 16px;
        height: 40px;
        line-height: 24px;


        .remote-download-list__header-actions {
          float: right;
          font-size: 12px;
          display: inline-block;
          position: relative;
          top: 1px;

        }
      }

      .remote-download-list__body {
        height: 350px;
        overflow: auto;

        .remote-download-list__item {
          height: 72px;
          border-bottom: 1px solid #f2f6fd;

          .remote-download-list__item-icon {
            padding: 0 6px 0 10px;

            img {
              width: 30px;
              overflow: hidden;
            }

            .remote-download-list__item-action-img {
              width: 100%;
              height: 100%;
            }
          }

          .remote-download-list__item-body {
            width: 360px;
            padding-top: 11px;
            padding-bottom: 11px;


            .remote-download-list__item-title {
              font-size: 14px;
              line-height: 20px;
              color: #03081a;
            }

            .remote-download-list__item-desc {
              margin-top: 4px;
              font-size: 12px;
              color: #878c9c;

              .remote-download-list__item-size {

              }
            }
          }
        }
      }

      .remote-download-list__item-actions {
        margin-left: 20px;

        .remote-download-list__item-action-body {
          width: 28px;
          height: 28px;
          position: relative;
          color: #06a7ff;
          background-color: #f0faff;
          border-radius: 50%;
        }

        .remote-download-list__item-action {
          margin-left: 12px;
        }

        .remote-download-list__item-action-img {
          width: 30px;
          height: 30px;
        }
      }

    }
  }
}
</style>

<template>
  <div class="share-view-main">
    <!--<PathNav></PathNav>-->
    <!--v-if="this.$route.query.extractionCode == undefined"-->
    <div class="auth-main" v-if="!auth">
      <div class="acss-header">
        <div class="acss_banner">
          <img src="@/assets/logo@2x.png" alt="" style="left: 0" />
        </div>
        <div class="verify-form">
          <form action class="clearfix" onsubmit="return false">
            <div class="user-main">
              <div class="avatar">
                <div class="photo-frame theme-share-head">
                  <span class="radius-3">
                    <img
                      :alt="shareUser.userName"
                      :src="getStaticPicUrl(shareUser.avatar)"
                      width="44"
                    />
                  </span>
                </div>
              </div>
              <div class="verify-property">
                <div class="verify-user theme-share-text">
                  <div class="username theme-share-name">
                    {{ shareUser.userName }}
                  </div>
                </div>
                <!--<div class="author-desc theme-share-name">暂无签名</div>-->
              </div>
            </div>
            <div class="verify-input ac-close clearfix">
              <dl class="pickpw clearfix">
                <dt>请输入提取码:</dt>
                <dd>
                  <input
                    type="text"
                    class="input-text QKKaIE LxgeIt"
                    id="accessCode"
                    v-model="extractionCode"
                    placeholder="请输入提取码"
                  />
                  <div class="submitBtn">
                    <a
                      class="submit-a g-button-blue-large"
                      @click="checkExtractionCode"
                      title="提取文件"
                    >
                      <span class="g-button-right">
                        <span class="text submit-btn-text" style="width: auto"
                        >提取文件</span
                        >
                      </span>
                    </a>
                  </div>
                </dd>
              </dl>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="main-list" v-if="auth">
      <div class="share-header">
        <div class="slide-show-header clearfix">
          <div class="header-top">
            <div class="slide-show-left">
              <h2 class="file-name" :title="this.fileList[0].fileName">
                <em class="global-icon-16 global-icon-16-multi"> </em>
                {{ this.fileList[0].fileName }}
                <template v-if="this.fileList.length > 1">等{{ this.fileList.length }}个文件</template>
              </h2>
            </div>
            <div class="slide-show-right">
              <div class="x-button-box">
                <a
                  class="g-button tools-share-save-hb"
                  @click="shareSave"
                  title="保存到网盘"
                  node-type="shareSave"
                >
                  <span class="g-button-right">
                    <em class="iconfont icon-daochu" title="保存到网盘"> </em>
                    <span class="text" style="width: auto">保存到网盘 </span>
                  </span>
                </a>

                <!--<a v-if="auth"-->
                <!--   class="g-button tools-share-download-hb"-->
                <!--   :href="-->
                <!--     getShareDownloadPath(-->
                <!--          this.shareInfo,-->
                <!--          this.extractionCode)-->
                <!--  "-->
                <!--   title="下载"-->
                <!--   node-type="shareDownload"-->
                <!--&gt;-->
                <!--  <span class="g-button-right">-->
                <!--    <em class="iconfont icon-xiazai" title="下载"> </em>-->
                <!--    <span class="text" style="width: auto">下载 </span>-->
                <!--  </span>-->
                <!--</a>-->
              </div>
            </div>
          </div>
          <div class="slide-show-other-infos">
            <div class="share-file-info">
              <i class="iconfont icon-shijian_zhongbiao"></i>
              <span>{{ shareInfo.shareTime }}</span>
            </div>
            <div class="share-valid-check">
              过期时间:
              <template v-if="new Date(shareInfo.expiredTime).getTime() > new Date().getTime()">
                <!--{{ item.expired === 0 ? '永久有效' : getTimeDifference(new Date(item.expiredTime).getTime()) + '天后过期'-->
                <!--}}-->
                {{ shareInfo.expired === 0 ? '永久有效' : calcDiffTime(new Date(shareInfo.expiredTime)) + '后过期' }}
              </template>
              <template v-else>
                已过期 {{ calcDiffTime(new Date(shareInfo.expiredTime)) }}
              </template>
              <!--{{ new Date(shareInfo.expiredTime) > new Date().getTime() ? calcExpiredTime : '已过期' }}-->
              <!--{{ shareInfo.status === 0 ? shareInfo.expired === 0 ? '永久有效' :-->
              <!--getTimeDifference(new Date(shareInfo.expiredTime).getTime()) > 0 ?-->
              <!--  getTimeDifference(new Date(item.expiredTime).getTime()) + '天后过期'-->
              <!--  : '已过期' + (-getTimeDifference(new Date(shareInfo.expiredTime).getTime())) + '天' : shareInfo.status === 1 ? '已失效' : shareInfo.status === 2 ? '已取消' : '已冻结'-->
              <!--}}-->
              <!--{{-->
              <!--  shareInfo.status === 0-->
              <!--    ? shareInfo.expired === 0 ? '永久有效' :-->
              <!--      getTimeDifference(new Date(shareInfo.expiredTime).getTime()) > 0 ? getTimeDifference(new-->
              <!--      Date(shareInfo.expiredTime).getTime()) + '天后' :-->
              <!--        '已过期' + (-getTimeDifference(new Date(shareInfo.expiredTime).getTime())) + '天'-->
              <!--    : shareInfo.status === 1-->
              <!--      ? '已失效'-->
              <!--      : shareInfo.status === 2-->
              <!--        ? '已取消'-->
              <!--        : '已冻结'-->
              <!--}}-->
            </div>
          </div>
        </div>
      </div>
      <!--路径导航-->
      <PathNav
        path="/"
        style="width: calc(100% - 272px); margin: 0 auto"
      ></PathNav>
      <FileTable :file-list="fileList"></FileTable>
    </div>
  </div>
</template>

<script>
import {
  checkShareLinkCode,
  getShareFileList,
  getShareInfo,
  saveShareFile
} from '@/request/file'
import { getShareUserInfo } from '@/request/user'
import PathNav from '@/components/common/pathNav/PathNav'
import FileTable from '@/components/file/FileTable.vue'
import { mapGetters } from 'vuex'
import Bus from '@/libs/bus'

export default {
  name: 'ShareView',
  props: {},
  components: {
    FileTable,
    PathNav
  },
  data () {
    return {
      userInfo: {},
      shareUserInfo: {},
      fileList: [
        {
          id: 74,
          fileName: '新建 Microsoft Word 文档.docx',
          filePath: '/',
          fileExt: 'docx',
          fileSize: 29509,
          fileType: 2,
          userId: 1,
          originName: null,
          isDir: 0,
          identifier: 'e48197bd33a50750a4146f3e6f878506',
          fileUrl: null,
          isShared: 0,
          storageType: 0,
          origin: 0,
          parentPathId: -1,
          fileUpdateTime: '2022-03-12 03:07:58',
          fileCreateTime: '2022-03-12 03:07:58'
        },
        {
          id: 94,
          fileName: '2021年12月17日.md',
          filePath: '/',
          fileExt: 'md',
          fileSize: 47959,
          fileType: 2,
          userId: 1,
          originName: null,
          isDir: 0,
          identifier: 'fa8c2e11568714861a975ce92521efcc',
          fileUrl: '20220318/fa8c2e11568714861a975ce92521efcc.md',
          isShared: 0,
          storageType: 0,
          origin: 0,
          parentPathId: -1,
          fileUpdateTime: '2022-03-27 18:44:01',
          fileCreateTime: '2022-03-18 09:15:36'
        },
        {
          id: 96,
          fileName: 'docker.txt',
          filePath: '/',
          fileExt: 'txt',
          fileSize: 881,
          fileType: 2,
          userId: 1,
          originName: null,
          isDir: 0,
          identifier: 'e1507eb79898c05cc883fe07acce6d60',
          fileUrl: '20220318/e1507eb79898c05cc883fe07acce6d60.txt',
          isShared: 0,
          storageType: 0,
          origin: 0,
          parentPathId: -1,
          fileUpdateTime: '2022-03-27 18:54:16',
          fileCreateTime: '2022-03-18 10:10:16'
        },
        {
          id: 105,
          fileName: 'storage.xlsx',
          filePath: '/',
          fileExt: 'xlsx',
          fileSize: 9036,
          fileType: 2,
          userId: 1,
          originName: null,
          isDir: 0,
          identifier: 'b703fe71087c8533c2bf9fefdf3058eb',
          fileUrl: '20220321/b703fe71087c8533c2bf9fefdf3058eb.xlsx',
          isShared: 0,
          storageType: 0,
          origin: 0,
          parentPathId: -1,
          fileUpdateTime: '2022-03-21 22:33:28',
          fileCreateTime: '2022-03-21 22:33:28'
        },
        {
          id: 125,
          fileName: 'PlayerAPI_v1.0.6.pdf',
          filePath: '/',
          fileExt: 'pdf',
          fileSize: 262296,
          fileType: 2,
          userId: 1,
          originName: null,
          isDir: 0,
          identifier: 'eaa4dd1c0a25c82dc614a1655640e4ed',
          fileUrl: '20220326/eaa4dd1c0a25c82dc614a1655640e4ed.pdf',
          isShared: 0,
          storageType: 0,
          origin: 0,
          parentPathId: -1,
          fileUpdateTime: '2022-03-26 13:34:55',
          fileCreateTime: '2022-03-26 13:34:55'
        },
        {
          id: 126,
          fileName: 'docker.txt',
          filePath: '/我的文件1',
          fileExt: 'txt',
          fileSize: 885,
          fileType: 2,
          userId: 1,
          originName: null,
          isDir: 0,
          identifier: '1f39218bacfa7c0cf426a699aeadd819',
          fileUrl: '20220318/1f39218bacfa7c0cf426a699aeadd819.txt',
          isShared: 0,
          storageType: 0,
          origin: 0,
          parentPathId: 52,
          fileUpdateTime: '2022-03-27 12:12:13',
          fileCreateTime: '2022-03-27 12:12:13'
        },
        {
          id: 127,
          fileName: '2021年12月17日.md',
          filePath: '/我的文件1',
          fileExt: 'md',
          fileSize: 47955,
          fileType: 2,
          userId: 1,
          originName: null,
          isDir: 0,
          identifier: '54ee3056dc9d87afb3266b554c87e4f4',
          fileUrl: '20220318/54ee3056dc9d87afb3266b554c87e4f4.md',
          isShared: 0,
          storageType: 0,
          origin: 0,
          parentPathId: 52,
          fileUpdateTime: '2022-03-27 12:14:33',
          fileCreateTime: '2022-03-27 12:14:33'
        }
      ],
      loading: false,
      // selectedFiles: [],
      batchNum: '',
      // filePath: '',
      auth: false,
      shareInfo: {},
      shareUser: {},
      shareFile: {},
      selectFileIndex: -1,
      extractionCode: '',
      expiredTime: ''
    }
  },
  watch: {
    extractionCode (val) {
      if (val.length === 4) {
        setTimeout(() => {
          this.checkExtractionCode()
        }, 1500)
      }
    },
    selectFileIdList (newVal) {
      console.log(newVal)
      this.chipInState = newVal
    }
  },
  computed: {
    ...mapGetters(['selectFileIdList']),
    shareBatchNum () {
      return this.$route.params.shareBatchNum
    },
    // eslint-disable-next-line vue/no-dupe-keys
    filePath () {
      return this.$route.query.filePath
    },
    shareFilePath () {
      return this.$route.query.filePath
    },
    // 被选中的文件列表
    // eslint-disable-next-line vue/no-dupe-keys
    selectedFiles () {
      console.log(this.$store.state.selectFileIdList)
      return this.$store.state.selectFileIdList
    },
    calcExpiredTime () {
      if (this.shareInfo.expired === 0) {
        return '永久有效'
      }
      const now = new Date().getTime()
      const diff = now - new Date(this.shareInfo.expiredTime).getTime()
      const day = Math.floor(diff / (24 * 3600 * 1000))
      const hour = Math.floor(diff / (3600 * 1000))
      const minute = Math.floor(diff / (60 * 1000))
      const second = Math.floor(diff / 1000)
      console.log(day, hour, minute, second)
      if (day > 1) {
        return day + '天'
      } else if (hour > 1) {
        return hour + '小时'
      } else if (minute > 1) {
        return minute + '分钟'
      } else {
        return second + '秒'
      }

      // var day = this.getTimeDifference(new Date(this.shareInfo.expiredTime).getTime())
      // if (day > 0) {
      //   return day + '天后到期'
      // } else if (day === 0) {
      //   return '今天到期'
      // } else {
      //   return '已过期' + Math.abs(day) + '天'
      // }
    }
  },
  created () {
    this.batchNum = this.$route.params.shareBatchNum
    console.log('this.batchNum', this.batchNum)
    this.getShareInfo()
    if (this.$route.query.extractionCode == undefined) {
      console.log('没有提取码,需要验证')
    } else {
      this.extractionCode = this.$route.query.extractionCode
      console.log(
        'this.$route.query.extractionCode == ',
        this.$route.query.extractionCode
      )
    }

    if (!this.filePath) {
    }
  },
  mounted () {
    Bus.$on('getShare', (file) => {
      this.getShareInfo()
    })
  },
  methods: {
    init () {
      this.selectedCount = 0
      this.selectFileIndex = -1
      this.selectFileIdList = new Array(this.fileList.length).fill(false)
    },
    // 计算时间差
    calcDiffTime (Time) {
      let now = new Date() // 新建一个日期对象，默认现在的时间
      var expireTime = new Date(Time) // 设置过去的一个时间点，"yyyy-MM-dd HH:mm:ss"格式化日期
      if (now.getTime() > expireTime.getTime()) {
        // 如果现在的时间大于过去的时间，则返回差值,交换两个时间的值
        const temp = now
        now = expireTime
        expireTime = temp
      }
      const difftime = (expireTime - now) / 1000 // 计算时间差,并把毫秒转换成秒
      const days = parseInt(difftime / 86400) // 天  24*60*60*1000
      const hours = parseInt(difftime / 3600) - 24 * days // 小时 60*60 总小时数-过去的小时数=现在的小时数
      const minutes = parseInt(difftime % 3600 / 60) // 分钟 -(day*24) 以60秒为一整份 取余 剩下秒数 秒数/60 就是分钟数
      if (days > 0) {
        return days + '天'
      } else if (hours > 0) {
        return hours + '小时'
      } else if (minutes > 0) {
        return minutes + '分钟'
      } else {
        return minutes + '秒'
      }
      // this.BindTime = days + '天' + hours + '时' + minutes + '分'
    },
    // 计算时间差,判断是过期还是没过期,当天数大于1时,返回天数,否则返回小时数,当小时数小于1时,返回分钟数,当分钟数小于1时,返回秒数

    getTimeDifference (time) {
      const now = new Date().getTime()
      const diff = now - time
      const day = Math.floor(diff / (24 * 3600 * 1000))
      const hour = Math.floor(diff / (3600 * 1000))
      const minute = Math.floor(diff / (60 * 1000))
      const second = Math.floor(diff / 1000)
      if (day > 1) {
        return day
      } else if (hour > 1) {
        return hour
      } else if (minute > 1) {
        return minute
      } else {
        return second
      }
    },
    shareSave () {
      if (this.$store.state.isLogin == false) {
        this.$toast.error('请先登录')
        return
      }
      if (this.selectFileIdList.length === 0) {
        this.$toast.error('请选择要转存的文件')
        return
      }
      if (new Date(this.shareInfo.expiredTime).getTime() < new Date().getTime()) {
        this.$toast.error('分享已过期')
        return
      }
      if (this.shareInfo.userId == this.$store.state.userInfo.userId) {
        this.$toast.error('不能转存自己的分享')
        return
      }
      this.$fileSelector({
        title: '选择保存目录',
        userInfo: this.$store.state.userInfo,
        onlyFolder: true,
        visible: true
      })
        .then((p) => {
          console.log('p', p.filePath)
          const data = {
            batchNum: this.batchNum,
            filePath: p.filePath,
            files: this.selectedFiles
          }
          saveShareFile(data).then((res) => {
            console.log('res', res)
            if (res.code === 0) {
              this.$store.commit('updateUserStorage', res.data.userStorage)
              this.$toast.success('保存成功')
              this.getFileList('/', true)
            } else {
              this.$toast.error(res.msg)
            }
          })
        })
        .catch((err) => {
          console.log('err', err)
        })
    },
    checkExtractionCode () {
      checkShareLinkCode({
        batchNum: this.batchNum,
        extractionCode: this.extractionCode
      }).then((res) => {
        console.log(res)
        if (res.code === 0) {
          this.auth = true
          this.fileList.length = 0
          this.fileList.push(res.data.file)
          if (this.$route.query.extractionCode == undefined) {
            this.$router.push({
              path: `/s/${this.batchNum}`,
              query: {
                extractionCode: this.extractionCode
              }
            })
          }
          this.getShareInfo()
        } else {
          this.$toast.error(res.data.msg)
        }
      })
    },
    getShareInfo () {
      getShareInfo({
        shareBatchNum: this.batchNum
      }).then((res) => {
        if (res.code === 0) {
          this.shareInfo = res.data.share
          this.shareUser = res.data.user
          if (this.auth) {
            this.fileList.length = 0
            this.fileList.push(res.data.file)
          }
          if (this.shareUserInfo.userName == null) {
            this.getShareUserInfo(res.data.share.userId)
          }
        } else {
          this.$toast.error(res.msg)
        }
      })
    },

    getShareFileList () {
      getShareFileList({
        shareFilePath: this.shareFilePath,
        shareBatchNum: this.shareBatchNum,
        userId: 1
      }).then((res) => {
        if (res.success) {
          this.fileList = res.data.list
          this.loading = false
          this.init()
        } else {
          this.$toast.error(res.msg)
        }
      })
    },
    async getShareUserInfo (id) {
      const data = {
        userId: id
      }
      console.log('data', data)
      getShareUserInfo(data).then((res) => {
        if (res.code === 0) {
          this.shareUserInfo = res.data.userInfo
        }
      })
    }
  }
}
</script>

<style lang="less">
.share-view-main {
  //background-color: #eef2f6;
  //position: absolute;
  //width: 100%;
  height: 100%;
  overflow: hidden;

  .auth-main {
    display: block;
    position: relative;
    width: 100%;
    //margin-top: 80px;
    height: 100%;
    //top: 50%;
    //left: 50%;
    //margin: -240px 0 0 -230px;
    z-index: 1;


    .acss-header {
      display: block;
      position: absolute;
      top: 20%;
      left: calc(50% - 230px);
      margin: 0 auto;
      //margin: -240px 0 0 -230px;
      z-index: 1;

      .acss_banner {
        //width: 212px;
        height: 55px;
        //background-image: url(``);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        margin: 0 auto 70px;
      }

      .verify-form {
        margin: 0 auto;
        width: 460px;
        text-align: left;
        font-size: 14px;
        position: relative;
        background: #fff;
        box-shadow: 0 0 10px #ccc;
        border-radius: 4px;
        border: 1px solid #dedede;
      }

      .user-main {
        background: url(https://nd-static.bdstatic.com/m-static/disk-share/widget/pageModule/init/image/share_tit_bg_5855301.png) no-repeat;
        background-size: 100% 100%;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;

        .avatar {
          display: inline-block;
          vertical-align: middle;
          padding: 15px 10px 15px 30px;

          .photo-frame,
          .photo-frame > span {
            width: 44px;
            height: 44px;
            overflow: hidden;
            border-radius: 60px;
          }

          .photo-frame {
            padding: 3px;
            background: #9adaf2;

            img {
              width: 100%;
              vertical-align: middle;
            }
          }
        }

        .verify-property {
          width: 248px;
          color: #fff;
          overflow: hidden;
          display: inline-block;
          vertical-align: middle;

          .verify-user {
            height: 26px;
            line-height: 30px;
            overflow: hidden;

            .username {
              _display: inline;
              display: inline-block;
              font-size: 16px;
              font-weight: 900;
            }
          }

          .author-desc {
            display: -webkit-box;
            word-break: break-all;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            color: #e1f5ff;
            overflow: hidden;
            font-size: 10px;
            width: 248px;
          }
        }
      }
    }

    .verify-form {
      margin: 0 auto;
      width: 460px;
      text-align: left;
      font-size: 14px;
      position: relative;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 0 10px rgb(171 198 235 / 30%);
    }

    .ac-close {
      padding: 20px 30px 48px;
    }

    .verify-input {
      float: left;
      width: 460px;

      dt {
        padding: 0 0 5px;
        margin: 20px 0 10px;
        color: #666;
        font-weight: 500;
      }

      .pickpw {
        padding: 0 0 15px;

        dt {
          font-weight: 700;
        }
      }

      .input-area {
        position: relative;
      }

      .QKKaIE {
        width: 280px;
      }

      .LxgeIt {
        width: 280px;
        border: 1px solid #f2f2f2;
        padding: 16px 10px !important;
        height: 20px;
        line-height: 19px;
        border-radius: 4px;
      }

      .submitBtn {
        width: 80px;
        display: inline-block;

        .submit-a {
          position: relative;
          display: inline-block;
          font-size: 14px;
          border: 1px solid #09aaff;
          background: #09aaff;
          padding: 0 13px;

          text-decoration: none;
          vertical-align: top;
          white-space: nowrap;
          outline: 0;

          .text {
            width: auto;
            color: #fff;
            display: inline-block;
            font-size: 13px;
            margin-left: 2px;
            margin-right: 2px;
            vertical-align: baseline;
            height: 36px;
            line-height: 36px;
          }
        }

        .g-button-blue-large {
          border-radius: 4px;
          margin-left: 14px;
          height: 36px;
          line-height: 36px;

          .g-button-right {
            height: 36px;
            line-height: 36px;
          }
        }
      }
    }
  }

  .main-list {
    .share-header {
      width: calc(100% - 272px);
      //min-width: 1330px;
      margin: 0 auto;

      .slide-show-header {
        display: flex;
        flex-direction: column;
        padding: 15px 0 15px 5px;
        position: relative;
        //height: 100px;
        align-items: flex-start;

        h2 {
          color: #424e67;
          max-width: 480px;
          font-size: 14px;
          font-weight: 200;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 32px;
        }

        .header-top {
          width: 100%;
          display: flex;
          justify-content: space-between;

          .slide-show-left {
            //display: inline-block;
            //float: left;
            margin: 10px 0;
            text-align: left;
            //position: absolute;
          }

          .slide-show-right {
            //display: inline-block;
            //float: right;
            margin: 10px 0;
            text-align: right;
            //position: absolute;
            .x-button-box {
              .g-button:link,
              .g-button:visited {
                color: #09aaff;
              }

              .g-button:link,
              .g-button:visited {
                color: #666;
              }

              .g-button {
                cursor: pointer;
                text-decoration: none;
                color: #09aaff !important;
                border: 1px solid #c3eaff !important;
                border-radius: 4px;
                height: 32px;
                line-height: 32px;
                padding-left: 10px;
                position: relative;
                display: inline-block;
                margin: 0 5px;
                padding-right: 15px;
                font-size: 12px;
                vertical-align: top;
                text-align: center;
                white-space: nowrap;
                outline: 0;

                .text {
                  font-size: 13px;
                  margin-left: 2px;
                  margin-right: 2px;
                  vertical-align: baseline;
                  margin-bottom: 5px;
                  *display: inline;
                  *zoom: 1;
                }
              }

              .tools-share-save-hb {
                position: relative;
              }

              .g-button {
              }
            }
          }
        }
      }
    }
  }
}
</style>

<template>
  <div class="main_layout_con"
       :class="mode"
       id="main_layout_con" style="height: 100%;">
    <div class="header">
      <div class="header__left">
        <a href="" class="header__left-item header__item-logo"
           style="width: 133px;">
          <img src="@/assets/logo@2x.png" alt="" class="header__item-img">
        </a>
      </div>
      <div class="header__right clearfix">
        <div class="header__right-item">

          <span class="is-vip-type-0">
            <span class="u-popover__reference-wrapper">
              <span class="header-user u-popover__reference">
                <div class="header-user__body" v-if="this.$store.state.isLogin">

                    <input type="file" id="recordAvatar"
                           style="display:none"
                           @change="changeAvatar"
                           ref="avatarInput"
                           name="recordAvatar" />
                    <img :src="getStaticPicUrl(this.getCookies('avatar'))"
                         for="recordAvatar"
                         title="点击更换头像"
                         @click="modifyAvatar"

                         class="header-user__body-avatar inline-block-v-middle">

                  <router-link to="/user">
                    <p title="进入用户中心"
                       class="header-user__body-username inline-block-v-middle text-ellip">
                    {{ this.$store.state.userInfo.userName }}
                  </p>
                  </router-link>

                  <div class="user-operation">
                   <span class="logout" @click="logout" title="退出登录">退出</span>
                  </div>
                </div>


                <div v-if="!this.$store.state.isLogin" class="header-user__body">
                  <a :href="getAccountHref('/login')" target="_self">登录</a>
                  <!--<router-link to="/login" class="login-btn inline-block-v-middle text-ellip">登录</router-link>-->
                </div>

              </span>
            </span>
          </span>


          <div class="transfer uploader-list header__right-item">
            <!--<a class="upload-transfer_list"></a>-->
            <!--<i class="iconfont icon-chuanshuliebiao"-->
            <!--   @click="showUploader(1)"-->
            <!--&gt;</i>-->
            <Uploader :show="visible"></Uploader>

            <!--<div class="upload-main" style="z-index: 5999;width: 704px;height: 408px">-->
            <!--</div>-->
          </div>
        </div>
      </div>
    </div>
    <div class="main_layout_wrap" :class="{fullscreen: showMarkdown}"
         :style="showMarkdown? ``:''"
    >
      <!-- 导航栏 -->
      <div class="aside_main" v-if="!this.$route.path.includes('/s/')">
        <TabBar type="user"></TabBar>
      </div>
      <!-- 主显示区域 -->
      <div class="main_layout_body" :style="{width: this.$route.path.includes('/s/')?'100%':''}">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

import TabBar from '@/components/common/TabBar'
// import { getUserInfo } from '@/request/user'
import Uploader from '@/components/uploader/Uploader.vue'
import { getUserInfo, logout, uploadAvatar } from '@/request/user'

export default {
  name: 'Home',
  components: {
    TabBar,
    Uploader

  },
  data () {
    return {
      // 主题
      mode: '',
      fileList: [],
      visible: false,
      showUpload: false,
      file: Object,
      showMarkdown: false,
      showMessage: false,
      dialogShow: false,
      tabList: [
        {
          id: 1,
          name: '图片',
          iconClass: 'icon-tupian1'
        },
        {
          id: 2,
          name: '文档',
          iconClass: 'icon-wendang1'
        },
        {
          id: 3,
          name: '视频',
          iconClass: 'icon-icon_video'
        },
        {
          id: 4,
          name: '种子',
          iconClass: 'icon-BTzhongzi'
        },
        {
          id: 5,
          name: '音频',
          iconClass: 'icon-yinpin'
        },
        {
          id: 6,
          name: '其他',
          iconClass: 'icon-qita'
        }
      ]
    }
  },
  watch: {
    '$store.state.showMessage' (showMessage) {
      if (showMessage) {
        window.setTimeout(() => {
          this.showMessage = false
          this.$store.commit('updateShowMessage', false)
        }, 3000)
      }
    },
    // 监听路由path变化, 将选中文件数量置 0
    '$router.query.path': function(path) {
      this.$store.commit('updateSelectFileCount', 0)
    }
  },
  computed: {},
  created () {
    this.mode = getComputedStyle(document.documentElement)
      .getPropertyValue('--mode')
      .trim()
    console.log('this.getCookies(\'remember\')', this.getCookies('remember'))
    if (this.getCookies('remember')) {
      console.log('记住用户,获取用户信息')
      this.getUserInfo()
    }

    // 获取当前是否是深色模式
    // window.matchMedia('(prefers-color-scheme: dark)').matches
    window.matchMedia && console.log('Is dark mode: ', window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (localStorage.getItem('display') != null) {
      const displayMode = localStorage.getItem('display')
      if (displayMode === 'block') {
        this.$store.commit('updateDisplayMode', 'block')
      } else {
        this.$store.commit('updateDisplayMode', 'list')
      }
    }
  },
  mounted () {
    const detectionDiv = document.querySelector('.main_layout_con')
    // If the computed style is not white then the page is in Auto Dark Theme.
    const isAutoDark = getComputedStyle(detectionDiv).backgroundColor != 'rgb(255, 255, 255)'
    // Update element styles when Auto Dark Theme is applied.
    if (isAutoDark) {
      // const myElement = document.querySelector('.main_layout_con')
      // myElement.classList.add('autoDarkOnlyStyle')
    }
    // 设置 prefers-color-scheme 为light
    document.documentElement.setAttribute('data-theme', 'light')
    // console.log('设置 prefers-color-scheme 为light')
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {

    }
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    if (mql.matches) {
      // console.log('dark mode')
      // document.body.classList.add('dark-mode')
    } else {
      // document.body.classList.remove('dark-mode')
    }
  },
  methods: {
    getAccountHref (path) {
      // return window.location.host + `/#${path}?redirect=${location.href}`
      return `/#${path}?redirect=${location.href}`
    },
    getUserInfo () {
      getUserInfo().then((res) => {
        if (res.code === 0) {
          localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
          // const token = this.getCookies('token')
          // if (!token) {
          //   this.setCookies('token', localStorage.getItem('token'), { expires: 7 })
          // }
          this.$store.commit('updateIsLogin', true)
          this.$store.commit('updateUserInfo', res.data.userInfo)
        } else {
          this.$router.push('/login')
          this.$toast.error(res.msg)
        }
      })
    },
    modifyAvatar () {
      this.$refs.avatarInput.dispatchEvent(new MouseEvent('click'))
      console.log('modifyAvatar')
      // this.$refs.avatar.click()
    },
    uploadAvatar (e) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('avatar', file)
      uploadAvatar(formData).then((res) => {
        this.userInfo.avatar = res.data.avatar
      })
    },
    changeAvatar (e) {
      const file = e.target.files[0]
      console.log(file)
      // 限制上传图片类型
      if (!/\.(jpg|jpeg|png|JPG|PNG)$/.test(e.target.value)) {
        this.$message({
          message: '图片类型要求：jpeg、jpg、png',
          type: 'error'
        })
        return false
      }
      // 图片大小不超过1M
      if (file.size / (1024 * 1024) > 1) {
        this.$message({
          message: '图片大小不超过1M',
          type: 'error'
        })
        return false
      }
      const formData = new FormData()
      formData.append('file', file)
      uploadAvatar(formData).then((res) => {
        this.userInfo.avatar = res.data.avatar
      })
    },
    /**
     * 退出登录
     */
    logout () {
      this.$confirmBox({
        title: '退出登录',
        msg: '确定要退出登录吗?',
        showType: 0
      }).then(() => {
        logout().then((res) => {
          if (res.code === 0) {
            this.removeCookies(this.$config.tokenKeyName)
            localStorage.removeItem('token')
            localStorage.removeItem('userInfo')
            sessionStorage.clear()
            // 清空cookie
            this.clearCookies()
            this.$store.commit('updateIsLogin', false)
            this.$store.commit('updateUserInfo', {})
            this.$router.push('/login')
            this.$toast.success('退出成功')
          } else {
            this.$toast.error(res.msg)
          }
        })
      }).catch(() => {
        this.$toast.info('已取消')
      })
    }
  }
}
</script>

<style lang="less">


//:root {
//  --mode: 'unknown';
//}
//
//@media (prefers-color-scheme: dark) {
//  :root {
//    --mode: 'dark';
//  }
//}
//
//@media (prefers-color-scheme: light) {
//  :root {
//    --mode: 'light';
//  }
//}

.header {
  z-index: 2000;
  -webkit-box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .06);
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, .06);
  height: 56px;
  padding-left: 24px;
  padding-right: 24px;
  position: relative;
  z-index: 200;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: justify;
  -ms-flex-pack: justify;
  justify-content: space-between;

  .header__left {
    display: inline-block;

    .head-title {
      font-size: 18px;
      font-weight: 500;
      color: #333;
      margin-left: 30px;
    }
  }

  .header__item-img {
    width: 120px;
    height: auto;
  }

  .header__right {
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;

    .header__right-item {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      margin-left: 20px;
      height: 32px;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      color: #454d5a;
      position: relative;

      .header-user__body-username:hover {
        color: #06a7ff;
      }

      .header-user {
        position: relative;
      }

      .user-operation:hover {
        color: #06a7ff;
      }

      .user-operation {
        display: none;
        z-index: 9999;
        width: 50px;
        //height: 60px;
        line-height: 30px;
        vertical-align: middle;
        //background-color: #06a7ff;
        //position: absolute;
        //margin-top: 30px;
        //right: 100px;
      }

      .header-user__body:hover .user-operation {
        display: inline-block !important;
      }

      .header-user__body {
        cursor: pointer;
        color: #424e67;
        //position: relative;

        .header-user__body-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }

        .header-user__body-username {
          font-weight: 700;
          margin-left: 10px;
          font-size: 12px;
          max-width: 140px;
        }
      }
    }

    .header__right-item:first-child {
      margin-left: 0;
    }

    .uploader-list {
      //display: -webkit-box;
      //display: -ms-flexbox;
      display: flex;
      //margin-left: 20px;
      //height: 32px;
      //-webkit-box-align: center;
      //-ms-flex-align: center;
      //align-items: center;
      //color: #454d5a;
      //position: relative;
    }

    .header__right-item:last-child {
      display: -webkit-box;
      display: -ms-flexbox;
      display: flex;
      margin-left: 20px;
      height: 32px;
      -webkit-box-align: center;
      -ms-flex-align: center;
      align-items: center;
      color: #454d5a;
      position: relative;
    }

    .transfer {
      position: relative;
      font-size: 20px;
      font-weight: 700;
      margin-left: 20px;

      .iconfont {
        cursor: pointer;
      }

      .iconfont:hover {
        color: #06a7ff;
      }
    }
  }

}

.main_layout_wrap {
  height: calc(100% - 60px);
  overflow: hidden;
  width: 100%;

  .aside_main {
    width: 200px;
    height: 100%;
    display: inline-block;
    position: relative;
  }

  .main_layout_body {
    height: 100%;
    display: inline-block;
    width: calc(100% - 200px);
    overflow: auto;


  }
}

.player-main {
  position: absolute;
  width: 100%;
  bottom: 0;
}
</style>

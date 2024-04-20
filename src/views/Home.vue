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
      <div class="header__tab_wrap">

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
                         @click="showOptions"

                         class="header-user__body-avatar inline-block-v-middle">
                  <router-link to="/user">
                    <p title="进入用户中心"
                       class="header-user__body-username inline-block-v-middle text-ellip">
                    {{ this.$store.state.userInfo.userName }}
                  </p>
                  </router-link>

                  <!--<div class="user-operation">-->
                  <!-- <span class="logout" @click="logout" title="退出登录">退出</span>-->
                  <!--</div>-->
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
        <div class="user-operation" v-show="showOption" ref="userOption"
             style="position: fixed;width:120px;top: 65px;right: 40px;z-index: 3000;background: #f4f6f9;border-radius: 4px;">
          <span class="Popover-arrow Popover-arrow--bottom" style="left: 60px; top: 0px;"></span>
          <div v-for="item in userOptions" :key="item.index" class="user-operation-item" style="padding: 5px">
            <!--<router-link :to="item.url" v-if="item.url">{{ item.name }}</router-link>-->
            <a href="javascript:;" @click="clickUserOption(item)" class="option-name" v-if="item.show"
               style="font-size: 14px;color: rgb(132, 145, 165)">
              <!--<template v-html="item.svg" class="option-icon"><template/>-->
              {{ item.name }}</a>
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

import TabBar from '@/components/common/AsideTabBar.vue'
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
      showOption: false,
      userOptions: [
        {
          url: '/user',
          name: '我的主页',
          iconClass: 'icon-tupian1',
          func: '',
          svg: '<svg width="16" height="16" viewBox="0 0 24 24" class="ZDI ZDI--UserFill24" fill="currentColor"><path fill-rule="evenodd" d="M12 2.5A5.5 5.5 0 0 0 6.5 8a5.5 5.5 0 0 0 5.5 5.5A5.5 5.5 0 0 0 17.5 8 5.5 5.5 0 0 0 12 2.5ZM7.224 14.632c.68-.294 1.454-.35 2.501-.206a16.62 16.62 0 0 0 4.55 0c1.047-.144 1.821-.088 2.501.206.656.284 1.155.766 1.676 1.27 1.536 1.489 2.436 3.37 2.649 4.911.107.777-.536 1.337-1.201 1.337H4.1c-.665 0-1.308-.56-1.2-1.337.212-1.54 1.112-3.422 2.648-4.91.52-.505 1.02-.987 1.676-1.271Z" clip-rule="evenodd"></path></svg>',
          show: true
        },
        {
          url: '',
          name: '设置',
          iconClass: 'icon-tupian1',
          func: '',
          svg: '',
          show: false
        },
        {
          url: '',
          name: '退出',
          iconClass: 'icon-tupian1',
          func: 'logout',
          svg: '',
          show: true
        }
      ],
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
    this.mode = getComputedStyle(document.documentElement).getPropertyValue('--mode').trim()
    this.getUserInfo()

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
    document.addEventListener('mouseup', (e) => {
      const el = this.$refs.userOption
      if (el) {
        if (!el.contains(e.target)) {
          this.showOption = false
        }
      }
    })
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
      if (location.port == 8081) {
        return `http://localhost:8081/#${path}?redirect=${location.href}`
      } else {
        return `https://www.leaving.top/pan/#${path}?redirect=${location.href}`
      }
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
          this.isLogin = true
          this.$store.commit('updateUserInfo', res.data.userInfo)
        } else {
          this.$router.push('/login')
          // this.$toast.error(res.msg)
        }
      })
    },
    showOptions () {
      this.showOption = true
    },
    clickUserOption (option) {
      if (option.func) {
        this[option.func]()
      } else {
        this.$router.push(option.url)
      }
      this.showOption = false
    },
    modifyAvatar () {
      this.$refs.avatarInput.dispatchEvent(new MouseEvent('click'))
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

  .Popover-arrow--bottom {
    height: 16px;
    -webkit-transform: translate(-50%, -100%);
    transform: translate(-50%, -100%);
    width: 32px;
  }

  .Popover-arrow {
    overflow: hidden;
    pointer-events: none;
    position: absolute;
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
    //padding: 20px 0 0;


  }
}

.player-main {
  position: absolute;
  width: 100%;
  bottom: 0;
}
</style>

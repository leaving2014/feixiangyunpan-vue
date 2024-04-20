<template>
  <div class="main_layout_con manage_con"
       :class="mode"
       id="main_layout_con mange" style="height: 100%;">
    <div class="header">
      <div class="header__left">
        <router-link to="/manage" class="header__left-item header__item-logo"
                     style="width: 133px;">
          <img src="@/assets/logo@2x.png" alt="" class="header__item-img">
        </router-link>
        <span class="head-title">飞享云盘后台管理</span>

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
                    <img :src="getStaticPicUrl(this.$store.state.userInfo.avatar)"
                         for="recordAvatar"
                         @click="modifyAvatar"

                         class="header-user__body-avatar inline-block-v-middle">

                  <router-link to="/user">
                    <p
                      class="header-user__body-username inline-block-v-middle text-ellip">
                    {{ this.$store.state.userInfo.userName }}
                  </p>
                  </router-link>

                  <div class="user-operation">
                   <span class="logout" @click="logout">退出</span>
                  </div>
                </div>


                <div v-if="!this.$store.state.isLogin" class="header-user__body">
                  <a :href="getAccountHref('/login')" target="_self">登录</a>
                  <!--<router-link to="/login" class="login-btn inline-block-v-middle text-ellip">登录</router-link>-->
                </div>

              </span>
            </span>
          </span>
          <!--<div class="transfer">-->
          <!--  <i class="iconfont icon-chuanshuliebiao"-->
          <!--     @click="showUploader(1)"-->
          <!--  ></i>-->
          <!--  <Uploader :show="visible"></Uploader>-->

          <!--  &lt;!&ndash;<div class="upload-main" style="z-index: 5999;width: 704px;height: 408px">&ndash;&gt;-->
          <!--  &lt;!&ndash;</div>&ndash;&gt;-->
          <!--</div>-->
        </div>

      </div>
    </div>
    <div class="main_layout_wrap">
      <!-- 导航栏 -->
      <div class="aside_main" v-if="!this.$route.path.includes('/s/')">
        <TabBar :list="tabList" type="manage"></TabBar>
      </div>
      <!-- 主显示区域 -->
      <div class="main_layout_body" :style="{width: this.$route.path.includes('/s/')?'100%':''}">
        <router-view></router-view>
      </div>
    </div>

  </div>
</template>

<script>
import TabBar from '@/components/common/AsideTabBar.vue'
import { getUserInfo, logout, uploadAvatar } from '@/request/user'

export default {
  name: 'Manage',
  props: {},
  components: {
    TabBar
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
      tabList: [
        {
          id: 1,
          name: '图片',
          iconClass: 'icon-tupian1',
          show: true
        },
        {
          id: 2,
          name: '文档',
          iconClass: 'icon-wendang1',
          show: true
        },
        {
          id: 3,
          name: '视频',
          iconClass: 'icon-icon_video',
          show: true
        },
        {
          id: 4,
          name: '压缩',
          iconClass: 'icon-yasuowenjian1',
          show: true
        },
        {
          id: 5,
          name: '音频',
          iconClass: 'icon-yinpin',
          show: true
        },
        {
          id: 6,
          name: '其他',
          iconClass: 'icon-qita',
          show: true
        }
      ]
    }
  },
  watch: {},
  computed: {},
  created () {
    if (localStorage.getItem('token') !== undefined) {
      this.getUserInfo()
    }
  },
  mounted () {
  },
  methods: {
    getAccountHref (path) {
      // return window.location.host + `/#${path}?redirect=${location.href}`
      return `/#${path}?redirect=${location.href}`
    },
    getUserInfo () {
      getUserInfo().then((res) => {
        if (res.code === 0) {
          if (res.data.userInfo.role === 2 || res.data.userInfo.role === 3) {
            localStorage.setItem('userInfo', JSON.stringify(res.data.userInfo))
            this.$store.commit('updateIsLogin', true)
            this.$store.commit('updateUserInfo', res.data.userInfo)
          } else {
            this.$toast.success('您没有权限访问该页面')
          }
        } else {
          this.$router.push('/login')
          this.$toast.error(res.msg)
        }
      })
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
      // if (file) {
      //   const formData = new FormData()
      //   formData.append('file', file)
      //   this.uploadAvatar(formData)
      // }
    },
    logout () {
      this.$confirmBox({
        title: '退出登录',
        msg: '确定要退出登录吗?',
        showType: 0
      }).then(() => {
        logout().then((res) => {
          if (res.code === 0) {
            localStorage.clear()
            this.$store.commit('updateIsLogin', false)
            this.$store.commit('updateUserInfo', {})
            this.$cookie.remove('token')
            this.$router.push({
              path: '/admin'
            })
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

<style lang="less" scoped>
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
        line-height: 30px;
        vertical-align: middle;

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
</style>

<template>
  <transition name="fade" style="width:100%">
    <div role="alert" class="u-message toast-main"
         v-if="show"
         style="z-index: 5999;"
         :style="{top: topHeight}"
    >
      <i
        class="iconfont icon-zhengquetishitianchong"
        :class="iconClass(type)"
      ></i>
      <p class="u-message__content">
        <span>{{ content }}</span>
        <span v-if="showToastMenu">
          <a class="toast-menu" @click="nav('fid166')">{{ menuInfo.content }}</a>
        </span>
      </p>
      <i class="iconfont icon-guanbi" v-if="duration === -1"
         @click="closeToast" style="text-align: right;margin-left: 10px"></i>
    </div>

    <!--<div class="message-main" :class="type" v-if="visible">-->
    <!--  <i class="icon-type iconfont icon-tishi" :class="'icon-'+type"></i>-->
    <!--  <div class="content">{{ content }}-->
    <!--    <i v-if="hasClose" class="btn-close iconfont icon-guanbi" @click="visible=false"></i>-->
    <!--  </div>-->
    <!--</div>-->
  </transition>
</template>

<script>

import Bus from '@/libs/bus'

export default {
  name: 'MyMessage',
  props: {
    type: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      toastId: 0,
      toastNum: 1,
      content: '网络请求错误',
      visible: false,
      iconName: 'success',
      duration: 3000,
      showToastMenu: false,
      menuInfo: {},
      fid: -1
    }
  },
  created () {
    this.duration = this.duration || 3000
  },
  mounted () {
    Bus.$on('closeToast', (e) => {
      setTimeout(() => {
        this.closeToast()
      }, 3000)
    })
    Bus.$on('toastMsg', (e) => {
      this.content = e
    })
    Bus.$on('toastMenu', (e) => {
      console.log('menuInfo', e)
      this.menuInfo = e
      this.showToastMenu = true
    })
    this.iconName = this.type
    this.toastId = 120 + this.toastNum * 50
    var el = window.document.getElementsByClassName('toast-main')
    this.toastNum = el.length
    // this.close()
  },
  computed: {
    topHeight: function() {
      return 120 + this.toastNum * 50 + 'px'
    }

  },
  methods: {
    // 锚点跳转
    nav (el) {
      document.querySelector('#' + el).scrollIntoView(true)
    },
    closeToast () {
      this.show = false
      this.duration = 0
      // setTimeout(() => {
      //   // this.$bus.$emit('MinusToast', this.toastId)
      //   this.show = false
      // }, this.duration)
    },
    iconClass: function(type) {
      var iconClsss
      if (type === 'sucess') {
        iconClsss = 'icon-success'
      } else if (type === 'error') {
        iconClsss = 'icon-tishicuowu'
      } else if (type === 'warning') {
        iconClsss = 'icon-jinggao'
      } else {
        iconClsss = 'icon-tishi'
      }
      return iconClsss
    }
  }
}
</script>


<style lang="less" scoped>
//:class="type === 'success'? 'icon-success' : type === 'warning' ? 'icon-jinggao': type === 'error' ? 'icon-tishicuowu' : 'icon-tishi'"></i>
.iconfont {
  display: inline-block;
  line-height: 40px;
}

.icon-success {
  //background-color: ;
  color: #06a7ff !important;

}

.icon-jinggao {
  color: darkgoldenrod;
}

.icon-tishicuowu {
  color: #F56C6C;
}

.icon-tishi {
  //color: #979797;
  color: #06a7ff !important;
}

.success {
  background-color: #06a7ff !important;
}

.info {
  background-color: #edf2fc !important;
}

.warning {
  background-color: #fdf6ec !important;
}

.error {
  background-color: #fef0f0 !important;

}

.icon-guanbi {
  cursor: pointer;
}

.u-message {
  box-sizing: border-box;
  border-radius: 22px;
  height: 40px;
  min-width: 120px;
  position: fixed;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  transition: opacity .3s, transform .4s, top .4s;
  overflow: hidden;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 16px 0 rgba(3, 11, 26, .1);
  text-align: center;
}

.u-message, .u-message--error, .u-message--success, .u-message--warning {
  background-color: #fff;
}

.u-message .u-icon-success {
  color: #0bd6a7;
}

.u-message .u-icon-error {
  color: #F56C6C;
}

.u-message__icon {
  margin-right: 8px;
}

.u-message--error .u-message__content, .u-message--info .u-message__content, .u-message--success .u-message__content, .u-message--warning .u-message__content {
  color: #495366;
}

.u-message p {
  margin: 0;
}

.u-message__content {
  font-size: 14px;
  line-height: 1;
  padding-left: 8px;

  .toast-menu {
    line-height: 1;
    margin-left: 10px;
  }

  .toast-menu:hover {
    cursor: pointer;
    color: #06a7ff;
  }
}


.message-main {
  position: fixed;
  background-color: #edf2fc !important;
  //left: 600px;
  //margin: 0 auto;
  width: 200px;
  height: 60px;
  z-index: 4000;
  vertical-align: middle;
  border-radius: 12px;
  //transform: translateX(-50%) translateY(-50%);
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  margin: auto;

  .icon-type {
    display: inline-block;
    text-align: center;
    line-height: 60px;
  }

  icon-tishi {
    color: #edf2fc;
  }

  .content {
    display: inline-block;
    line-height: 60px;
    margin-left: 10px;
    text-align: center;
  }
}
</style>

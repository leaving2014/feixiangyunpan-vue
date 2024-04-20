<template>
  <div id="app" class="main-layout">
    <router-view />
  </div>
</template>
<script>
import { getSystemConfig } from '@/request/system'

export default {
  data () {
    return {}
  },
  created () {
    this.getSysConfig()
  },
  mounted () {
    const that = this
    window.addEventListener('resize', function() {
      return (() => {
        that.$store.commit('changeScreenWidth', document.body.clientWidth)
      })()
    })

    // 禁止缩放
    // window.onload = function() {
    //   document.addEventListener('touchstart', function(event) {
    //     if (event.touches.length > 1) {
    //       event.preventDefault()
    //     }
    //   });
    //   document.addEventListener('gesturestart', function(event) {
    //     event.preventDefault()
    //   })
    // };
  },
  methods: {
    getSysConfig () {
      getSystemConfig().then(res => {
        if (res.code === 0) {
          localStorage.setItem('systemConfig', JSON.stringify(res.data))
          this.$store.commit('updateSysConfig', res.data)
        }
      })
    }
  }
}

</script>

<style>
.main-layout {
  height: 100%;
  min-width: 1080px;
}
</style>

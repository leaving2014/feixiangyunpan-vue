<template>
  <div class="el-loading-mask">
    <div class="el-loading-spinner">
      <svg viewBox="25 25 50 50" class="circular">
        <circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
      </svg>
      <p class="el-loading-text">{{ loadingText }}</p>
    </div>
  </div>

</template>

<script>
// import Bus from '@/libs/bus'

export default {
  name: 'Loading',
  props: {
    text: {
      type: String,
      default: '加载中...'
    }
  },
  components: {},
  data () {
    return {
      loadingText: ''
    }
  },
  watch: {},
  computed: {},
  created () {
    this.loadingText = this.text
  },
  mounted () {
    // Bus.$on('updateLoadingText', (text) => {
    //   this.loadingText = text
    //   console.log('updateLoadingText' + text)
    // })
  },
  methods: {}
}
</script>

<style lang="less" scoped>

.el-loading-mask {
  position: absolute;
  z-index: 2000;
  background-color: hsla(0, 0%, 100%, .9);
  margin: 0;
  transition: opacity .3s;
}

.el-loading-mask {
  position: absolute;
  z-index: 10000;
  background-color: hsla(0, 0%, 100%, .9);
  margin: 0;

  transition: opacity .3s;
}

.el-loading-mask.is-fullscreen .el-loading-spinner {
  margin-top: -25px;
}

.el-loading-spinner {
  top: 50%;
  margin-top: -21px;
  width: 100%;
  text-align: center;
  position: absolute;
}

.el-loading-mask.is-fullscreen .el-loading-spinner .circular {
  width: 50px;
  height: 50px;
}

.el-loading-spinner .circular {
  width: 42px;
  height: 42px;
  animation: loading-rotate 2s linear infinite;
}

svg:not(:root) {
  overflow: hidden;
}

.el-loading-spinner .el-loading-text {
  color: #20a0ff !important;
}

.el-loading-spinner .el-loading-text {
  color: #20a0ff;
  margin: 3px 0;
  font-size: 14px;
}

.el-loading-spinner .path {
  stroke: #20a0ff !important;
}

.el-loading-spinner .path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: #20a0ff;
  stroke-linecap: round;
}

@keyframes loading-rotate {

  to {
    transform: rotate(1turn)
  }

}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px
  }
  to {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px

  }
}

</style>

<template>
  <div class="aside-nav__sub-bottom">
    <div class="aside-nav__quota"
         :class="scrollerWidthNum > 90 ? 'is-alert' : scrollerWidthNum > 60 ? 'is-warn' : 'is-nomal'"
    >
      <span>
        <span class="u-popover__reference-wrapper">
          <div class="aside-nav__quota-wrapper u-popover__reference">
            <div class="aside-nav__quota-progress">
              <div
                ref="progress"
                class="aside-nav__quota-progress-rate"
                :style="{width:progressWidth}"
              ></div>
              <!---->
            </div>
            <div class="aside-nav__quota-body">
              <span class="aside-nav__quota-body-text"
              >{{
                  this.calculateFileSize(
                    this.storageInfo.storageSizeUsed
                  )
                }}/{{
                  this.calculateFileSize(
                    this.storageInfo.storageSize
                  )
                }}</span
              >
            </div>
          </div>
        </span>
      </span>
    </div>
  </div>
</template>

<script>
import { getStorage } from '@/request/file'

export default {
  name: 'StorageBar',
  props: {},
  components: {},
  data () {
    return {
      storageInfo: {},
      storageSizeUsed: 0,
      storageSize: 0,
      progress: 0,
      useStoragePecent: 0
    }
  },
  watch: {
    storage (newVal, oldVal) {
      this.$nextTick(() => {
        this.storageInfo = newVal
        this.storageSizeUsed = newVal.storageSizeUsed
        this.storageSize = newVal.storageSize
      })
    }
  },
  computed: {
    progressWidth: function() {
      const userd = this.storageSizeUsed
      const size = this.storageSize
      const width = (userd / size) * 100
      if (userd === 0) {
        return '100%'
      }
      if (width < 0.0001) {
        return 0 + '%'
      } else {
        return 100 - (userd / size) * 100 + '%'
      }
    },
    scrollerWidthNum () {
      const used = this.storageSizeUsed
      const size = this.storageSize
      return (used / size) * 100
    }
  },
  created () {
    getStorage().then((res) => {
      if (res.code === 0) {
        this.storageInfo = res.data.userStorage
        this.storageSizeUsed = this.storageInfo.storageSizeUsed
        this.storageSize = this.storageInfo.storageSize
        window.localStorage.setItem(
          'userStorage',
          JSON.stringify(this.storageInfo)
        )
        this.$store.commit('updateUserStorage', res.data.userStorage)
        this.progress = (this.storageSizeUsed / this.storageSize) * 100
      }
    })
  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang="less" scoped>
@media (max-height: 650px) {
  .aside-nav__quota-wrapper {
    display: none !important;
  }
}

.aside-nav__sub-bottom {
  position: absolute;
  bottom: 25px;
  width: 100%;
  margin: 0 auto;
  text-align: center;

  .aside-nav__quota {
    text-align: center;


    .aside-nav__quota-wrapper {
      display: inline-block;
      width: 140px;
      text-align: left;

      .aside-nav__quota-progress {
        height: 6px;
        border-radius: 4px;
        position: relative;
        width: 140px;
        background: linear-gradient(to right, #4ae1f8, #06a7ff, #e0c111, #e51313, #f30707);


        .aside-nav__quota-progress-rate {
          position: absolute;
          right: -1px;
          top: 0;
          bottom: 0;
          background-color: #eeeff4;
          border-radius: 0 4px 4px 0;
          max-width: 100%;
        }

        .wp-aside-nav__quota-progress-rate {
          background-color: #ffd821;
        }
      }

      .aside-nav__quota-body-action {
        color: #06a7ff;
        float: right;
        font-weight: 700;
      }
    }

    .aside-nav__quota-body {
      margin-top: 8px;
      font-size: 12px;

      .aside-nav__quota-body-text {
        color: #afb3bf;
      }

    }
  }
}
</style>

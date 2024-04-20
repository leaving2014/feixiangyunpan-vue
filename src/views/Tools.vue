<template>
  <div class="tools-main">
    <div class="tools-list-main_body">
      <div class="tools-title">网盘工具箱</div>
      <div class="tools-list-wrapper">
        <div class="tools-list-wrapper-item" v-for="(item,index) in toolsList" :key="index">
          <a class="tool-item-main" @click="toolMethods(item.method)" style="cursor: pointer">
            <!--<img src="@/assets/images/tools/icon-wordturnpdf.png" :alt="item.name"-->
            <!--     class="tool-item-main__icon inline-block-v-middle">-->
            <i class="iconfont" :class="item.icon"></i>

            <div class="tool-item-main__right inline-block-v-middle">
              <p class="tool-item-main__right--title text-elip">{{ item.name }}</p>
              <span class="tool-item-main__right--des text-elip">{{ item.desc }}</span>
            </div>
          </a>
          <!--<i class="iconfont" :class="item.icon"></i>-->
        </div>
      </div>

      <Loading v-show="loading" text="正在转换中,请稍后..."></Loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { formatconversion } from '@/request/file'
import Loading from '@/components/common/loading/Loading'
import Vue from 'vue'

export default {
  name: 'Tools',
  props: {},
  components: { Loading },
  data () {
    return {
      loading: false,
      toolsList: [
        {
          name: 'Word转Pdf',
          icon: 'icon-wordturnpdf',
          method: 'WordToPdf',
          desc: 'Word文件转换'
        },
        {
          name: 'Pdf转Word',
          icon: 'icon-pdfturnword',
          method: 'PdfToWord',
          desc: 'Pdf文件转换'
        },
        {
          name: 'Excel转Pdf',
          icon: 'icon-excelturnpdf',
          method: 'ExcelToPdf',
          desc: 'Excel文件转换'
        },
        {
          name: '清理文件',
          icon: 'icon-shanchu',
          method: 'clearFile',
          desc: '清理垃圾文件'
        }
      ]
    }
  },
  watch: {},
  computed: {},
  created () {
  },
  mounted () {
  },
  methods: {
    functionTools (method) {
      this.$emit('functionTools', method)
    },
    toolMethods (method) {
      this[method]()
    },
    WordToPdf () {
      this.$fileSelector({
        title: '选择文件',
        userInfo: this.$store.state.userInfo,
        onlyFolder: false,
        show: true,
        extName: ['doc', 'docx']
      }).then(res => {
        var file = res.file
        const data = {
          fileExt: 'docx',
          convertExt: 'pdf',
          fileId: file.id
        }
        this.loading = true
        formatconversion(data, true).then((res) => {
          if (res.code === 0) {
            this.loading = false
            this.$toast.success(res.msg)
          } else {
            this.loading = false
            this.$toast.error(res.msg)
          }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    PdfToWord () {
      this.$fileSelector({
        title: '选择文件',
        userInfo: this.$store.state.userInfo,
        onlyFolder: false,
        show: true,
        extName: ['pdf']
      }).then(res => {
        var file = res.file
        const data = {
          fileExt: 'pdf',
          convertExt: 'docx',
          fileId: file.id
        }
        this.loading = true
        formatconversion(data, true).then((res) => {
          if (res.code === 0) {
            this.loading = false
            this.$toast.success(res.msg)
          } else {
            this.loading = false
            this.$toast.error(res.msg)
          }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    ExcelToPdf () {
      this.$fileSelector({
        title: '选择文件',
        userInfo: this.$store.state.userInfo,
        onlyFolder: false,
        show: true,
        extName: ['xls', 'xlsx']
      }).then(res => {
        var file = res.file
        const data = {
          fileExt: 'xlsx',
          convertExt: 'pdf',
          fileId: file.id
        }
        this.loading = true
        formatconversion(data, true).then((res) => {
          if (res.code === 0) {
            this.loading = false
            this.$toast.success(res.msg)
          } else {
            this.loading = false
            this.$toast.error(res.msg)
          }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    clearFile () {
      this.$router.push({
        path: '/clear'
      })
    },
    onlineNote () {
      Vue.prototype.$previewMarkdown({ fileInfo: { id: 0 } })
    }
  }
}
</script>

<style lang="less" scoped>
.tools-main {
  background-color: #f5f6fa;
  background-image: -webkit-gradient(linear, left top, left bottom, from(#fcfcfc), color-stop(10%, #f5f6fa), to(#f5f6fa));
  background-image: linear-gradient(180deg, #fcfcfc, #f5f6fa 10%, #f5f6fa);
  padding: 80px 8px 80px 54px;
  height: 100%;
  overflow: auto;
  text-align: center;

  .tools-list-main_body {
    display: inline-block;
    text-align: left;

    .tools-title {
      font-size: 20px;
      color: #03081a;
      font-weight: 700;
      padding-bottom: 33px;
    }

    .tools-list-wrapper {
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      margin-bottom: 33px;
      margin-left: -23px;

      .tools-list-wrapper-item {
        display: inline-block;
        margin-right: 23px;
        margin-left: 23px;
        margin-bottom: 46px;
        position: relative;

        .tool-item-main {
          display: inline-block;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          width: 264px;
          height: 96px;
          background-color: #fff;
          border-radius: 9px;
          padding: 29px 0 29px 22px;
          position: relative;

          .iconfont {
            color: #06a7ff;
            font-size: 22px;
          }

          .tool-item-main__icon {
            width: 38px;
            height: 38px;
          }

          .tool-item-main__right {
            margin-left: 15px;

            .tool-item-main__right--title {
              font-size: 16px;
              color: #454d5a;
              max-width: 160px;
              font-weight: 700;
            }

            .tool-item-main__right--des {
              font-size: 12px;
              color: #636d7e;
              max-width: 160px;
            }
          }
        }
      }
    }
  }


}
</style>

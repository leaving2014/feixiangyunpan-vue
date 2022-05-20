<template>
  <div class="file-main__nav-left" :fullPath="fullPath">
    <div v-if="true" style="text-align: left;">
      <template v-show="fullPath!='/'">
            <span class="file-selector__nav-item" :fullPath="fullPath" v-show="fullPath!='/'">
            <span
              class="file-selector__nav-item-title text-ellip"
              @click="back(-1)"
            >返回上一级</span
            >
            <span class="file-selector__nav-item-sep">|</span>
          </span>
      </template>

      <span class="file-selector__nav-item">
            <span
              class="file-selector__nav-item-title text-ellip"
              @click="back('/')"
            >全部文件
            </span>
            <span class="file-selector__nav-item-sep">></span>
          </span>
      <!--v-for="item in this.$route.query.filePath.split('/').slice(1)"-->

      <template v-show="fullPath!=='/'">
        <span
          class="file-selector__nav-item"
          v-for="(item,index) in this.fullPath.split('/').slice(1)"
          :key="item"
        >
            <span
              @click="navigate(index)"
              class="file-selector__nav-item-title text-ellip is-current-nav"
              :path="fullPath.split('/')"
            >{{ item }}</span
            >
            <span class="file-selector__nav-item-sep">></span>
          </span>
      </template>

    </div>
    <!--<div v-if="$route.path === '/index'">-->
    <!--      <span class="title">{{-->
    <!--          this.getIndexPageTitle($route.query.category)-->
    <!--        }}</span>-->
    <!--</div>-->
  </div>
</template>

<script>
import { getFileListByPath } from '@/request/file'

export default {
  name: 'PathNav',
  props: {
    fileList: {
      type: Array
    },
    path: {
      type: String
    }
  },
  components: {},
  data () {
    return {
      // fileList: [],
      sortFileList: [],
      selectedFile: [],
      fullPath: '/'
    }
  },
  watch: {
    '$route.query.filePath': function(val) {
      if (val) {
        this.fullPath = val
      } else {
        this.fullPath = '/'
      }
    }
  },
  computed: {},
  created () {
    // this.getFileList('/')
  },
  mounted () {
  },
  methods: {
    back (path) {
      console.log('返回上一层')
      this.selectedFileCount = 0
      this.selectAllFiles = false
      if (path === '/') {
        this.$router.replace({
          // path: '/index',
          query: {
            filePath: '/'
            // filePath: this.fullPath
          }
        })
      } else {
        // var arrurl = this.$route.query.filePath.split('/')
        // console.log('上一级目录:' + arrurl[arrurl.length - 1])
        // console.log(arrurl[arrurl.length - 1]);
        // this.fullPath = this.$router.query.filePath.split('/').slice()
        this.$router.go(-1)
        // console.log('当前path:' + this.$route.query.filePath)
        // console.log('当前path:' + this.$store.state.fullPath)
        console.log('当前 vuex-fullPath:' + this.$store.state.fullPath)
        this.$nextTick(function() {
          this.getFileList(this.$store.state.fullPath, true)
        })
      }
    },
    // 路径导航
    navigate (index) {
      var routerLength = this.$route.query.filePath.split('/').length
      // 判断点击导航是否是最后一个,即当前路径,不是最后一个则回退
      if (routerLength - 2 - index !== 0) {
        this.$router.go(-(routerLength - 2 - index))
      }
    },
    async getFileList (path, isRefresh) {
      const data = {
        filePath: path,
        isRefresh: !!isRefresh
        // filePath: this.filePath,
        // currentPage: this.pageData.currentPage,
        // pageCount: this.pageData.pageCount
      }
      getFileListByPath(data).then((res) => {
        if (res.code === 0) {
          // this.sortFileList.length = 0

          // this.currentFolderList = res.data.list
          // this.sortFileList = this.fileList.sort(this.compare('isDir', -1))
          // this.$emit('update:fileList', this.sortFileList)
          // this.selectedFile = new Array(this.currentFolderList.length).fill(false)
          // this.pageData.total = res.data.total
          // this.loading = false
        } else {
          // this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.file-main__nav-left {
  float: none !important;
  text-align: left;

  .title {
    font-size: 12px;
    color: #03081a;
    font-weight: 700;
  }

  .file-selector__nav-item {
    font-size: 12px;

    .file-selector__nav-item-title {
      color: #06a7ff;
      max-width: 120px;
      cursor: pointer;
      display: inline-block;
      vertical-align: middle;
      font-size: 12px;
    }

    .file-selector__nav-item-sep {
      margin: 0 4px;
      color: #c4d8f4;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .file-selector__nav-item:last-child
  .file-selector__nav-item-title.is-current-nav {
    color: #afb3bf;
    cursor: auto;
  }

  .file-selector__nav-item:last-child .file-selector__nav-item-sep {
    display: none;
  }
}
</style>

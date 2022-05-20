<template>
  <div class="menu-main" :style="{left:left+'px',top:top+'px'}">
    <ul class="contextmenu">

      <!--空白区域-->
      <div class="file-blank" v-if="this.$route.path === '/index' && this.count===0">
        <li v-for="(item,index) in showMenuList" :index="item.index"
            @click="menuMethods(item.methodName)"
            :key="index+1">
          <i class="iconfont" :class="item.iconClassName"></i>
          <span class="text">{{ item.name }}</span>
        </li>
      </div>
      <!--单文件-->
      <div class="file-single" v-if="this.$route.path === '/index' && this.count===1">
        <li v-for="(item,index) in showMenuList" :index="item.index"
            @click="menuMethods(item.methodName)"
            :key="index+1">
          <i class="iconfont" :class="item.iconClassName"></i>
          <span class="text">{{ item.name }}</span>
        </li>
        <!--下载-->
        <li
          @click="menuMethods('menuDownload')"
          :key="index+1">
          <a :href="getDownloadFilePath($store.state.fileList[$store.state.selectFileIndex])"
             :path="getDownloadFilePath($store.state.fileList[$store.state.selectFileIndex])">
            <i class="iconfont icon-xiazai"></i>
            <span class="text">下载</span>
          </a>

        </li>
      </div>
      <!--多文件-->

      <div class="file-multi" v-if="this.$route.path === '/index' && this.count>1">
        <li v-show="this.count ===1 && this.$route.path === 'index'"
            @click="menuMethods('menuDownloader')"
            :key="index+1">
          <a :href="getDownloadFilePath($store.state.fileList[$store.state.selectFileIndex])"
             :path="getDownloadFilePath($store.state.fileList[$store.state.selectFileIndex])">
            <i class="iconfont icon-xiazai"></i>
            <span class="text">下载</span>
          </a>

        </li>
        <li v-for="(item,index) in showMenuList" :index="item.index"
            @click="menuMethods(item.methodName)"
            :key="index+1">
          <i class="iconfont" :class="item.iconClassName"></i>
          <span class="text">{{ item.name }}</span>
        </li>
      </div>
      <!--回收站-->
      <div class="recycle" v-if="this.$route.path === '/recycle'">
        <li v-for="(item,index) in showMenuList" :index="item.index"
            @click="menuMethods(item.methodName)"
            :key="index+1">
          <i class="iconfont" :class="item.iconClassName"></i>
          <span class="text">{{ item.name }}</span>
        </li>
      </div>

      <!--分享-->
      <div class="recycle" v-if="this.$route.path === '/share'">
        <li v-for="(item,index) in showMenuList" :index="item.index"
            @click="menuMethods(item.methodName)"
            :key="index+1">
          <i class="iconfont" :class="item.iconClassName"></i>
          <span class="text">{{ item.name }}</span>
        </li>
      </div>


      <!--<div class="folder" v-if="true">-->
      <!--  <li v-show="this.count ===1 && this.$route.path === 'index'"-->
      <!--      @click="menuMethods('menuOpen')"-->
      <!--  >-->
      <!--    <i class="iconfont icon-openl"></i>-->
      <!--    <span class="text" action="openFolder">打开</span>-->
      <!--  </li>-->

      <!--  <li v-for="(item,index) in showMenuList" :index="item.index"-->
      <!--      @click="menuMethods(item.methodName)"-->
      <!--      :key="index+1">-->
      <!--    <i class="iconfont" :class="item.iconClassName"></i>-->
      <!--    <span class="text">{{ item.name }}</span>-->
      <!--  </li>-->
      <!--  &lt;!&ndash;下载&ndash;&gt;-->
      <!--  <li v-show="this.count ===1 && this.$route.path === 'index'"-->
      <!--      @click="menuMethods('menuDownloader')"-->
      <!--      :key="index+1">-->
      <!--    <a :href="getDownloadFilePath($store.state.fileList[$store.state.selectFileIndex])"-->
      <!--       :path="getDownloadFilePath($store.state.fileList[$store.state.selectFileIndex])">-->
      <!--      <i class="iconfont icon-xiazai"></i>-->
      <!--      <span class="text">下载</span>-->
      <!--    </a>-->

      <!--  </li>-->

      <!--  <li v-show="this.count ===1 && this.$route.path === 'index'"-->
      <!--      @click="menuMethods('menuRename')"-->
      <!--      :key="index+1">-->
      <!--    <i class="iconfont icon-zhongmingming"></i>-->
      <!--    <span class="text">重命名</span>-->
      <!--  </li>-->
      <!--</div>-->
    </ul>

  </div>
</template>

<script>

export default {
  name: 'contextMenu',
  props: {
    index: {
      type: Number
    },
    e: {
      type: Object
    },
    left: {
      type: Number,
      default: 500
    },
    top: {
      type: Number,
      default: 60
    },
    fileList: {
      type: Array
    },
    file: {
      type: Object
    },
    count: {
      type: Number,
      default: 0
    },
    selectFileIndex: {
      type: Number
    },
    selectedFile: {
      type: Array
    },
    // 默认是右击单个文件菜单
    defaultMenu: {
      type: Array,
      default: () => [
        {
          id: 1,
          name: '打开',
          iconClassName: 'icon-openl',
          methodName: 'menuOpen',
          count: 1
        },
        // {
        //   id: 2,
        //   name: '下载',
        //   iconClassName: 'icon-xiazai',
        //   methodName: 'menuDownload'
        // },
        {
          id: 3,
          name: '分享',
          iconClassName: 'icon-fenxiang1',
          methodName: 'menuShare'
        },
        {
          id: 4,
          name: '复制',
          iconClassName: 'icon-fuzhi',
          methodName: 'menuCopy'
        },
        {
          id: 5,
          name: '移动',
          iconClassName: 'icon-yidong',
          methodName: 'menuMove'
        },
        {
          id: 6,
          name: '重命名',
          iconClassName: 'icon-zhongmingming',
          methodName: 'menuRename'
        },
        {
          id: 7,
          name: '删除',
          iconClassName: 'icon-shanchu',
          methodName: 'menuDelete'
        }
      ]
    },
    // 菜单点击类型 1:单个文件 2:多文件 3. 4:回收站
    type: {
      type: Number
    }
  },
  components: {},
  data () {
    return {
      showMenuList: [],
      MultiMenuList: [
        {
          id: 2,
          name: '下载',
          iconClassName: 'icon-xiazai',
          methodName: 'menuDownload'
        },
        {
          id: 3,
          name: '分享',
          iconClassName: 'icon-fenxiang1',
          methodName: 'menuShare'
        },
        {
          id: 4,
          name: '复制',
          iconClassName: 'icon-fuzhi',
          methodName: 'menuCopy'
        },
        {
          id: 5,
          name: '移动',
          iconClassName: 'icon-yidong',
          methodName: 'menuMove'
        },
        // {
        //   id: 6,
        //   name: '重命名',
        //   iconClassName: 'icon-zhongmingming',
        //   methodName: 'menuRename'
        // },
        {
          id: 7,
          name: '删除',
          iconClassName: 'icon-shanchu',
          methodName: 'menuDelete'
        }
      ],
      BlankMenuList: [
        {
          id: 1,
          name: '刷新',
          iconClassName: 'icon-shuaxin',
          methodName: 'menuRefresh',
          count: 1
        },
        {
          id: 2,
          name: '新建文件夹',
          iconClassName: 'icon-xinjianwenjianjia',
          methodName: 'menuCreateFolder'
        }
      ],
      RecycleMenuList: [
        {
          id: 1,
          name: '还原',
          iconClassName: 'icon-huanyuanhuanyuanxuanzhongxiang',
          methodName: 'menuRestoreFile',
          count: 1
        },
        {
          id: 2,
          name: '删除',
          iconClassName: 'icon-shanchu',
          methodName: 'menuDeleteRecycle'
        }
      ],
      shareMenuList: [
        {
          id: 1,
          name: '取消分享',
          iconClassName: '',
          methodName: 'menuCancelShare'
        }
      ],
      visible: false
    }
  },
  watch: {
    '$store.state.selectFileCount': function(count) {
      if (this.$route.path === '/index') {
        if (count === 1) {
          this.showMenuList = this.defaultMenu
        } else if (count > 1) {
          this.showMenuList = this.MultiMenuList
        } else {
          this.showMenuList = this.BlankMenuList
        }
      } else if (this.$route.path === '/recycle') {
        this.showMenuList = this.RecycleMenuList
      } else if (this.$route.path === '/share') {
        this.showMenuList = this.shareMenuList
      }
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  computed: {},
  created () {

  },
  mounted () {
  },
  methods: {
    menuMethods (method) {
      this[method]()

      // const defaultOptions = {
      //   yesBtnText: '确定',
      //   noBtnText: '取消'
      // }
      // Vue.prototype.$confirmBox({
      //   defaultOptions
      // })
    },
    // 打开
    menuOpen: function() {
      var index = this.$store.state.selectFileIndex
      // var path = ''
      this.$parent.clickActions(index, this.file)

      // if (this.$route.query.filePath === undefined) {
      //   path = '/' + this.$store.state.fileList[0].fileName
      //   // path = this.$store.state.selectFullPath
      //   console.log('menuOpen:=====' + path)
      // } else {
      //   path = '/' + this.$store.state.fileList[index].fileName
      // }
      // console.log('要进入的文件夹:menuOpen=====' + path)
      // this.$parent.enterFolder(index, path, this.e)
    },
    // 分享文件
    menuShare: function() {
      this.$parent.shareFile()
    },
    // 复制文件
    menuCopy: function() {
      this.$parent.copyFile()
    },
    // 移动文件
    menuMove: function() {
      this.$parent.moveFile()
    },
    // 文件重命名
    menuRename: function() {
      this.$parent.renameFile()
      // bus.$emit('renameFileName', this.$store.state.fileList[this.$store.state.selectFileIndex].fileName)
    },
    // 删除文件
    menuDelete: function() {
      this.$parent.deleteFile()
    },
    menuDownload: function() {
      // this.$parent.download()
    },
    // 刷新页面
    menuRefresh: function() {
    },
    // 创建文件夹
    menuCreateFolder: function() {
    },
    menuRestoreFile: function() {
      this.$parent.restoreFile()
    },
    menuDeleteRecycle: function() {
      this.$parent.deleteRecycle()
    }

  }
}
</script>

<style lang="less" scoped>
.menu-main {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  width: 100px;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu {
  text-align: left;
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;

  .iconfont {

  }


}

.contextmenu li:hover {
  background: #eee;
}

.text {
  //padding-left: 8px;
  margin-left: 8px !important;
}
</style>

<template>
  <div class="tab_bar_main">
    <div class="tab_bar_box nav_file-list">
      <!--v-for='item in list' :key='item'>{{ item.name }}-->
      <router-link
        class="tab_item cursor-p is-exact-active is-active is-exact-active"
        :to="type === 'user' ? '/index?category=all' : '/manage?category=all'"
      >
        <i
          class="iconfont inline-block-v-middle icon-xiasanjiao"
          @click="collapse()"
          :class="closed === true ? 'is-collapse' : ''"
        ></i>
        <span class="tab_name">{{ $route.path.includes('manage') ? '文件管理' : '我的文件' }}</span>
        <span class="tab_item_edit">
          <i class="iconfont icon-icmore" @click="showEdit()"></i>
        </span>
        <!--显示编辑菜单-->
        <div class="u-popover u-popper wp-header-user__tooltip-padding wp-header-user__tooltip-margin-left"
             style="width: 120px; transform-origin: left center;
             z-index: 2219; position: absolute; top: 33px; left: 174px;"
             v-show="showEditMenu"
             ref="editTab"
        >
          <div class="wp-aside-nav__cate-pop">
            <div class="u-checkbox-group">
              <div class="wp-aside-nav__cate-pop-item"
                   v-for="(item, index) in tabList" :key="index">
                <label
                  class="u-checkbox"
                  :id="item.show === true ? 'is-checked' : ''"
                  :class="[
                  item.show === true ? 'is-checked' : ''
                ]"
                >
                <span
                  class="u-checkbox__input"
                  :class="[
                    item.show=== true ? 'is-checked' : ''
                  ]"
                >
                  <span
                    class="u-checkbox__inner"
                    @click.stop="selectItem(index, $event)"
                  ></span>
                  <!--@click.stop="selectFile(index, $event)"-->
                  <input
                    type="checkbox"
                    aria-hidden="false"
                    class="u-checkbox__original"
                    value=""
                  />
                </span>
                </label>
                <span class="u-checkbox__label">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </router-link>
      <div class="file-list-con" v-if="!closed">
        <div>
          <span>
            <!--$route.path.includes('index') -->
            <!--:to="$route.path !== undefined ? '/index?category='+item.id : ''"-->
            <router-link class="sub_item is-active"
                         :to="type === 'user' ? '/index?category='+item.id : '/manage?category='+item.id"
                         href="javascript:;"
                         :fileType="item.id"
                         :class="item.id == $route.query.category ? 'router-link-exact-active' : ''"
                         @click="selectTab(item.id, $event)"
                         v-for="(item, index) in tabList"
                         v-show="item.show"
                         :key="index + 1"

            >
              <div class="tab-item-box">
                <i
                  class="iconfont inline-block-v-middle"
                  :class="item.iconClass === undefined ? '' : item.iconClass"
                ></i>
                <p
                  :title="item.name"
                  class="sub_item_text text-elip inline-block-v-middle"
                >
                  {{ item.name }}
                </p>
              </div>
            </router-link>
          </span>
        </div>
      </div>
    </div>

    <div v-for="(item,index) in tabs" :key="index">
      <div class="aside-nav__divider"></div>
      <router-link class="aside-nav__sub-item sub_item" :to="{path:'/'+item.path}">
        <div class="aside-nav__sub-item-body">
          <p class="aside-nav__sub-item-text inline-block-v-middle text-elip" :title="item.name">
            {{ item.name }}
          </p>
        </div>
      </router-link>
    </div>


    <!--<router-link class="aside-nav__sub-item sub_item" :to="{path:'/recycle'}">-->
    <!--  <div class="aside-nav__sub-item-body">-->
    <!--    <p class="aside-nav__sub-item-text inline-block-v-middle text-elip" title="回收站">-->
    <!--      回收站-->
    <!--    </p>-->
    <!--  </div>-->
    <!--</router-link>-->
    <!--<div class="aside-nav__divider"></div>-->
    <!--<router-link class="aside-nav__sub-item sub_item" :to="{path:'/share'}">-->
    <!--  <div class="aside-nav__sub-item-body">-->
    <!--    <p class="aside-nav__sub-item-text inline-block-v-middle text-elip" title="分享">-->
    <!--      分享-->
    <!--    </p>-->
    <!--  </div>-->
    <!--</router-link>-->
    <!--<div class="aside-nav__divider"></div>-->
    <!--<router-link class="aside-nav__sub-item sub_item" :to="{path:'/tools'}">-->
    <!--  <div class="aside-nav__sub-item-body">-->
    <!--    <p class="aside-nav__sub-item-text inline-block-v-middle text-elip" title="回收站">-->
    <!--      工具箱-->
    <!--    </p>-->
    <!--  </div>-->
    <!--</router-link>-->
    <!--<div class="aside-nav__divider"></div>-->
    <!--<router-link class="aside-nav__sub-item sub_item" :to="{path:'/play'}">-->
    <!--  <div class="aside-nav__sub-item-body">-->
    <!--    <p class="aside-nav__sub-item-text inline-block-v-middle text-elip" title="回收站">-->
    <!--      视频播放-->
    <!--    </p>-->
    <!--  </div>-->
    <!--</router-link>-->
    <!--<div class="aside-nav__divider"></div>-->
    <!--<router-link class="aside-nav__sub-item sub_item" :to="{path:'/audio'}">-->
    <!--  <div class="aside-nav__sub-item-body">-->
    <!--    <p class="aside-nav__sub-item-text inline-block-v-middle text-elip" title="回收站">-->
    <!--      音乐播放-->
    <!--    </p>-->
    <!--  </div>-->
    <!--</router-link>-->
    <!--<div class="aside-nav__divider"></div>-->

    <StorageBar v-if="type==='user'"></StorageBar>
  </div>
</template>

<script>
import StorageBar from '@/components/index/storageBar/StorageBar'

export default {
  name: 'TabBar',
  components: {
    StorageBar
  },
  props: {
    /**
     * tab的列表,必须为数组
     */
    list: {
      type: Array,
      required: false,
      default: function() {
        return [
          {
            name: '图片',
            fileType: 1,
            iconClass: 'icon-tupian1',
            show: true
          },
          {
            name: '文档',
            fileType: 2,
            iconClass: 'icon-wendang',
            show: true
          },
          {
            name: '视频',
            fileType: 3,
            iconClass: 'icon-icon_video',
            show: true
          },
          {
            name: '种子',
            fileType: 4,
            iconClass: 'icon-BTzhongzi',
            show: true
          },
          {
            name: '音频',
            fileType: 5,
            iconClass: 'icon-yinpin',
            show: true
          },
          {
            name: '其他',
            fileType: 6,
            iconClass: 'icon-qita',
            show: true
          }
        ]
      }
    },
    type: {
      type: String,
      required: false,
      default: 'user'
    },
    bottomTab: {
      type: Array,
      required: false,
      default: function() {
        return [
          {
            name: '回收站',
            fileType: 7,
            iconClass: 'icon-huishouzhan',
            show: true
          },
          {
            name: '分享',
            fileType: 8,
            iconClass: 'icon-fenxiang',
            show: true
          },
          {
            name: '工具箱',
            fileType: 9,
            iconClass: 'icon-gongju',
            show: true
          }
          // {
          //   name: '视频播放',
          //   fileType: 10,
          //   iconClass: 'icon-shipinbofang',
          //   show: true
          // },
          // {
          //   name: '音乐播放',
          //   fileType: 11,
          //   iconClass: 'icon-yinlebofang',
          //   show: true
          // }
        ]
      }
    },
    /**
     * tab的方向,默认为行,可选值 column
     */
    direction: {
      default: 'row',
      required: false
    },
    /**
     * 是否可编辑显示内容
     */
    editable: {
      default: false,
      required: false
    }
  },

  data () {
    return {
      showEditMenu: false,
      closed: false,
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
      ],
      tabs: [],
      tabUser: [
        {
          id: 7,
          name: '回收站',
          iconClass: 'icon-huishouzhan',
          path: 'recycle',
          show: true
        },
        {
          id: 8,
          name: '分享',
          iconClass: 'icon-fenxiang',
          path: 'share',
          show: true
        },
        {
          id: 9,
          name: '工具箱',
          iconClass: 'icon-gongju',
          path: 'tools',
          show: true
        },
        {
          id: 10,
          name: '用户中心',
          iconClass: 'icon-yonghuzhongxin',
          path: 'user',
          show: true
        }
        // {
        //   id: 10,
        //   name: '视频播放',
        //   iconClass: 'icon-shipinbofang',
        //   show: true
        // },
        // {
        //   id: 11,
        //   name: '音乐播放',
        //   iconClass: 'icon-yinlebofang',
        //   show: true
        // }
      ],
      tabManage: [
        {
          id: 7,
          name: '回收站管理 ',
          iconClass: 'icon-huishouzhan',
          path: 'manage/recycles',
          show: true
        },
        {
          id: 8,
          name: '分享管理',
          iconClass: 'icon-fenxiang',
          path: 'manage/shares',
          show: true
        },
        {
          id: 9,
          name: '用户管理',
          iconClass: 'icon-yonghuguanli',
          path: 'manage/users',
          show: true
        }
      ]
    }
  },
  watch: {
    // showEditMenu (value) {
    //   console.log(value)
    //   if (!value == true) {
    //     document.body.addEventListener('click', this.close)
    //   } else {
    //     document.body.removeEventListener('click', this.close)
    //   }
    // }
  },
  computed: {},
  created () {
    if (this.type === 'user') {
      this.tabs = this.tabUser
    } else {
      this.tabs = this.tabManage
    }
  },
  mounted () {
    document.addEventListener('mouseup', (e) => {
      const el = this.$refs.editTab
      if (el) {
        if (!el.contains(e.target)) {
          this.showEditMenu = false
        }
      }
    })
  },
  methods: {
    collapse () {
      this.closed = !this.closed
    },
    close () {
      this.showEditMenu = false
    },
    selectTab (index, e) {
      console.log(index)
    },
    showEdit () {
      if (this.showEditMenu == true) {
        this.showEditMenu = false
      } else {
        this.showEditMenu = true
      }
    },
    selectItem (index, e) {
      if (this.tabList[index].show === true) {
        this.tabList[index].show = false
      } else {
        this.tabList[index].show = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.u-popover {
  position: absolute;
  background: #fff;
  border-radius: 8px;
  z-index: 2000;
  color: #606266;
  //line-height: 1.4;
  text-align: justify;
  //font-size: 14px;
  box-shadow: 0 0 30px 0 rgba(175, 179, 191, .6);
}

.u-checkbox-group {
  text-align: center;
}

.wp-aside-nav__cate-pop-item {
  text-align: center;
  position: relative;

  label {
    position: absolute;
    left: 10px;
    display: inline-block;
    margin-left: 10px;
  }
}

.u-checkbox__label {
  padding-left: 14px;;
}

.router-link-exact-active {
  color: #06a7ff !important;
}


.tab_bar_main {
  display: inline-block;
  position: relative;
  height: 100%;
  border-right: 1px solid #f1f2f4;
  width: 200px;
  //background-color: #F56C6C;


  .tab_bar_box {
    padding-top: 20px;
    background-color: #fff;

    a {
      user-select: none;
    }

    .tab_item {
      height: 40px;
      line-height: 40px;
      display: inline-block;
      width: 177px;
      border-radius: 10px;
      //padding-left: 24px;
      padding-right: 18px;
      margin-left: 12px;
      font-weight: 700;
      color: #636d7e;
      background-color: #fff;

      .icon-xiasanjiao {
        -webkit-transition: -webkit-transform 0.1s ease-in-out;
        transition: -webkit-transform 0.1s ease-in-out;
        transition: transform 0.1s ease-in-out;
        transition: transform 0.1s ease-in-out,
        -webkit-transform 0.1s ease-in-out;
      }

      .icon-xiasanjiao.is-collapse {
        -webkit-transform: rotate(-90deg);
        transform: rotate(-90deg);
      }

      .tab_name {
        margin-left: 10px;
      }

      .tab_item_edit {
        margin-left: 10px;
        float: right;
        padding-top: 1px;
      }
    }

    .file-list-con {
      .sub_item.is-active {
        color: #636d7e;
        border-radius: 0;
        background-color: #fff;
      }

      .sub_item {
        font-size: 12px;
        font-weight: 400;
        height: 40px;
        line-height: 40px;
        width: 100%;
        display: inline-block;
        //margin-left: 12px;
        width: 177px;

        .tab-item-box {
          //padding-left: 10px;

          .sub_item_text {
            margin-left: 13px;
          }
        }
      }

      .sub_item:hover {
        background-color: #fafafc;
        border-radius: 12px;
      }
    }
  }

  .aside-nav__divider {
    display: inline-block;
    width: 70%;
    height: 1px;
    background-color: #f1f2f4;
  }

  .aside-nav__sub-item {
    height: 40px;
    line-height: 40px;
    width: 100%;
    display: inline-block;
    width: 177px;
    font-size: 14px;
    font-weight: 700;
    color: #636d7e;
    border-radius: 0;
    background-color: #fff;

    .aside-nav__sub-item-body {
      //padding-left: 5px;

      .aside-nav__sub-item-text {
        max-width: 110px;
      }
    }
  }
}
</style>

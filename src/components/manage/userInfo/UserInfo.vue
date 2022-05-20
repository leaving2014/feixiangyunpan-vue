<template>
  <keep-alive>
    <section class="main-detail main-list__detail">

      <!--当选中用户数量大于1时-->
      <div class="detail__title" v-if="selectedCount > 1">
        {{
          this.selectedCount === 0
            ? '用户详情'
            : '共选中' + `${this.selectedCount}` + '个用户'
        }}
        <div class="detail__img bg" style="margin-top:10px;">
          <img
            :src="getStaticPicUrl(userList[selectIndex].avatar)"
            class="category"
          />
        </div>
      </div>
      <div>
        <!--空显示-->
        <!--当选中用户数量为0时-->
        <div class="detail__empty" v-if="this.selectedCount === 0">
          <img
            src="https://nd-static.bdstatic.com/m-static/v20-main/img/empty-folder.55c81ea2.png"
            class="img"
          />
          <p>选中用户，查看详情</p>
        </div>

        <!--用户详情显示 , 选中用户数量为1时-->
        <!--<div class="detail__img bg" v-if="this.selectedCount === 1 && this.userList[selectIndex].isDir===0">-->
        <!--  <img-->
        <!--    :src="userList[selectIndex].fileType === 1 ? getRowImageSrc(userList[selectIndex]): setFileImg(userList[selectIndex])"-->
        <!--    class="category" id="row-image"-->
        <!--    :class="userList[selectIndex].fileType === 1 ? '':'image-icon'"-->
        <!--  />-->
        <!--</div>-->
        <div class="detail__props" v-if="this.selectedCount === 1">
          <div class="detail__name">
            <img
              :src="getStaticPicUrl(userList[selectIndex].avatar)"
              class="icon"
            />
            <!--userList[selectIndex].userName-->
            <span class="user-name-text">{{ userList[selectIndex].userName }}</span>
          </div>

          <div class="prop">
            用户昵称:
            {{
              this.userList[selectIndex].nickName
            }}
          </div>
          <div class="prop">
            手机号:
            {{
              this.userList[selectIndex].phoneNumber
            }}
          </div>
          <div class="prop">
            用户邮箱:
            {{
              this.userList[selectIndex].email
            }}
          </div>

          <div class="prop">
            用户性别:
            {{
              this.userList[selectIndex].sex === 0 ? '男' : this.userList[selectIndex].sex === 1 ? '女' : '未知'
            }}
          </div>
          <div class="prop">
            用户角色:
            {{ this.userList[selectIndex].role === 1 ? '普通用户' : this.userList[selectIndex].role === 2 ? '管理员' : '超级管理员'
            }}
            <!--{{-->
            <!--  selectIndex !== -1 ? '用户格式: ' + `${this.userList[selectIndex].fileExt !== null ? this.userList[selectIndex].fileExt : ''}`-->
            <!--}}-->
          </div>
          <div class="prop">
            用户状态:
            <span :class="userList[selectIndex].status === 0?'normal':'exception'">{{
                this.userList[selectIndex].status === 0 ? '正常' : this.userList[selectIndex].status === 1 ? '禁用' : '未知'
              }}</span>

          </div>
          <div class="prop">
            注册时间:
            {{
              this.userList[selectIndex].createTime
            }}
          </div>
          <!--<div class="prop" v-if="this.$route.path.includes('manage')">-->
          <!--  用户: {{ this.userList[selectIndex].user !== null ? this.userList[selectIndex].userName : '' }}-->
          <!--  &lt;!&ndash;{{ &ndash;&gt;-- >
        < !-- &lt; ! & ndash;  selectIndex !== -1 ? '用户格式: ' + `${this.userList[selectIndex].fileExt !== null ? this.userList[selectIndex].fileExt : ''}` & ndash;&gt;-- >
        < !-- &lt; ! & ndash; }}&ndash;&gt;-->
          <!--</div>-->
        </div>
      </div>
    </section>
  </keep-alive>
</template>

<script>
export default {
  name: 'UserInfo',
  props: {
    userList: {
      type: Array
    },
    selectIndex: {
      type: Number,
      default: -1
    },
    selectedCount: {
      type: Number,
      default: 0
    }
  },
  components: {},
  data () {
    return {
      selectedUsers: [],
      sortUserList: []
    }
  },
  watch: {},
  computed: {},
  created () {
  },
  mounted () {
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.main-detail {
  padding: 16px;
  display: inline-block;
  background: #f5f6fa;
  border-radius: 8px;
  font-size: 12px;
  position: relative;
  overflow: auto;
  min-height: 356px;
  //height: 508px;

  .detail-filelist__title {
    text-align: left;
    color: #03081a;
    font-weight: 600;
    padding-bottom: 15px;
  }

  .detail-filelist__name {
    text-align: left;
    font-size: 14px;
    color: #454d5a;
    font-weight: 600;
    margin-top: 15px;
    word-break: break-all;

    .icon {
      width: 20px;
      height: 20px;
      -o-object-fit: contain;
      object-fit: contain;
      margin-right: 8px;
    }
  }

  .detail-filelist__list {
    background-color: #fff;
    width: 240px;
    height: 352px;
    border-radius: 13px;
    position: relative;
    margin-top: 14px;
    padding: 8px 12px;
    overflow-y: auto;

    .detail-filename {
      text-align: left;

      .detail-filename__title-icon {
        width: 30px;
        height: 30px;
        vertical-align: middle;
        position: relative;
        color: hsla(0, 0%, 74.1%, .28);
        line-height: 1;
      }

      .detail-filename__title-icon.iconfont {
        font-size: 22px;
      }

      .detail-filename__title-text {
        padding-left: 5px;
        line-height: 40px;
        max-width: calc(100% - 40px);
      }
    }
  }

  .detail__title {
    color: #03081a;
    font-weight: 600;
    padding-bottom: 15px;
  }

  .detail__empty {
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    left: 50%;
    position: absolute;
    text-align: center;
    width: 240px;

    img {
      width: 60px;
      height: 60px;
    }

    p {
      color: #878c9c;
      letter-spacing: 0.57px;
      font-weight: 400;
      line-height: 50px;
    }
  }

  .detail__img {
    width: 240px;
    height: 134px;
    border-radius: 13px;
    position: relative;
  }

  .detail__img.bg {
    background: #fff;
  }

  .detail__img .category {
    position: absolute;
    left: 50%;
    top: 50%;
    object-fit: contain;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    width: 100%;
    height: 100%;
    //max-height: 134px;
    //max-width: 240px;
  }

  .detail__img .category.image-icon {
    max-height: 60px;
    max-width: 60px;
  }


  .detail__props {
    color: #878c9c;

    .detail__name {
      font-size: 14px;
      color: #454d5a;
      font-weight: 600;
      word-break: break-all;
      padding-top: 20px;

      .user-name-text {
        margin-left: 10px;
      }

      .icon {
        width: 30px;
        height: 30px;
        object-fit: contain;
      }
    }

    .prop .exception {
      color: #f5222d;
    }

    .prop {
      margin-top: 10px;
      word-break: break-all;
      text-align: left;

      .file-main__nav {
        border-radius: 4px 4px 0 0;
        height: 40px;
        line-height: 40px;
        border-bottom-width: 0;
        overflow: hidden;
      }

      .simple {
        display: inline;
        height: auto;
        padding: 0;
        line-height: inherit;

        div {
          display: inline;
          float: none;
        }
      }
    }
  }
}

.main-list__detail {
  //height: calc(100% - 110px);
  width: 272px;
  margin-left: 16px;
  position: relative;
  top: 0;
}
</style>

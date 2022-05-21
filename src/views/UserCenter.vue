<template>
  <div class="user-center">
    <div class="title">
      <span class="title-icon"></span>
      <span class="title-text">我的信息</span>
      <!--<span class="reg-time">今天是你加入飞享云盘的第{{ -getTimeDifference(new Date(userInfo.createTime).getTime())-->
      <span
        class="reg-time">今天是你加入飞享云盘的第{{ -getTimeDifference(new Date(userInfo.createTime.replace(/-/g, '/')).getTime())
        }}天</span>
    </div>
    <div class="user-setting-warp">
      <div>
        <form class="el-form clearfix">
          <div class="el-form-item user-nick-rel-name">
            <label class="el-form-item__label">用户名:</label>
            <div class="el-form-item__content">
              <span class="userinfo-descript">{{ editUserInfo.userName }}</span
              >
            </div>
          </div>
          <div class="el-form-item user-nick-name">
            <label class="el-form-item__label">昵称:</label>
            <div class="el-form-item__content">
              <div class="el-input">
                <input
                  autocomplete="off"
                  placeholder="你的昵称"
                  type="text"
                  rows="2"
                  maxlength="16"
                  validateevent="true"
                  class="el-input__inner"
                  v-model="editUserInfo.nickName"
                />

              </div>
            </div>
          </div>
          <div class="el-form-item user-nick-name">
            <label class="el-form-item__label">邮箱:</label>
            <div class="el-form-item__content">
              <div class="el-input">
                <input
                  autocomplete="off"
                  placeholder="你的邮箱"
                  type="text"
                  rows="2"
                  maxlength="30"
                  validateevent="true"
                  class="el-input__inner"
                  v-model="editUserInfo.email"
                />

              </div>
            </div>
          </div>
          <div class="el-form-item user-nick-name">
            <label class="el-form-item__label">手机号:</label>
            <div class="el-form-item__content">
              <div class="el-input">
                <input
                  autocomplete="off"
                  placeholder="你的手机号"
                  type="text"
                  rows="2"
                  maxlength="16"
                  validateevent="true"
                  class="el-input__inner"
                  v-model="editUserInfo.phoneNumber"
                />

              </div>
            </div>
          </div>

          <div class="el-form-item user-my-sex">
            <label class="el-form-item__label">性别:</label>
            <div class="el-form-item__content">
              <div class="el-radio-group">
                <label class="el-radio-button"
                ><input
                  type="radio"
                  name="sex"
                  class="el-radio-button__orig-radio"
                  v-model="editUserInfo.sex"
                  value="0"
                /><span class="el-radio-button__inner">男</span></label
                >
                <label class="el-radio-button"
                ><input
                  type="radio"
                  name="sex"
                  class="el-radio-button__orig-radio"
                  v-model="editUserInfo.sex"
                  value="1"
                /><span class="el-radio-button__inner">女</span></label
                >
                <label class="el-radio-button"
                ><input
                  type="radio"
                  name="sex"
                  class="el-radio-button__orig-radio"
                  v-model="editUserInfo.sex"
                  value="2"
                /><span class="el-radio-button__inner">保密</span></label
                >
              </div>

            </div>
          </div>

          <div class="el-form-item user-my-btn">
            <div class="el-form-item__content">
              <div class="user-my-btn-warp">
                <button type="button" class="el-button el-button--primary" @click="updateUserInfo">
                  <span>保存</span>
                </button>
              </div>
            </div>
          </div>
          <div class="padding-dom"></div>

          <!--修改密码-->
          <div class="password" style="display: flex;align-items: center;">
            <div class="password-input" style="width: 500px;display: block">
              <div class="el-form-item user-nick-name" style="width: 400px">
                <label class="el-form-item__label">旧密码:</label>
                <div class="el-form-item__content">
                  <div class="el-input">
                    <input
                      autocomplete="off"
                      placeholder="请输入旧密码"
                      type="text"
                      rows="2"
                      maxlength="16"
                      class="el-input__inner"
                      v-model="oldPassword"
                    />
                  </div>
                </div>
              </div>
              <div class="el-form-item user-nick-name" style="width: 400px">
                <label class="el-form-item__label">新密码:</label>
                <div class="el-form-item__content">
                  <div class="el-input">
                    <input
                      autocomplete="off"
                      placeholder="请输入新密码"
                      type="text"
                      rows="2"
                      maxlength="16"
                      class="el-input__inner"
                      v-model="newPassword"
                    />
                  </div>
                </div>

              </div>
            </div>

            <div class="el-form-item__content" style="width: 100px;display: block">
              <div class="user-my-btn-warp" style="width: inherit">
                <button type="button" class="el-button el-button--primary" @click="updatePassword">
                  <span>修改密码</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
import { getUserInfo, updatePassword, updateUserInfo, uploadAvatar } from '@/request/user'

export default {
  name: 'UserCenter',
  props: {},
  components: {},
  data () {
    return {
      userInfo: {},
      editUserInfo: {
        userName: '',
        nickName: '',
        sex: null,
        phoneNumber: '',
        email: ''
      },
      oldPassword: '',
      newPassword: '',
      check: true
    }
  },
  watch: {
    editUserInfo: {
      handler: function(val) { // 此处注意，handler函数不能为箭头函数，this会取上下文，而不是组件里的this,此外，深度监听，必须为handler函数名，否则会无效果
        console.log(val)
        var flag = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？ ]')
        // 判断文件名是否包含特殊字符
        if (flag.test(val.userName || val.nickName)) {
          this.$toast.error('不能包含特殊字符')
          this.check = false
        }
        // 可以做些相应的处理
      },
      deep: true
    }

    // function(val) {
    // var flag = new RegExp('[`~!@#$^&*()=|{}\':;\',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“\'。，、？ ]')
    // // 判断文件名是否包含特殊字符
    // if (flag.test(val.userName)) {
    //   this.$toast.error('不能包含特殊字符')
    //   this.check = false
    // }

  },
  computed: {},
  created () {
    getUserInfo().then((res) => {
      this.userInfo = res.data.userInfo
      this.editUserInfo = res.data.userInfo
    })
  },
  mounted () {
  },
  methods: {
    uploadAvatar (e) {
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('avatar', file)
      uploadAvatar(formData).then((res) => {
        this.userInfo.avatar = res.data.avatar
      })
    },
    updateUserInfo () {
      // const obj = this.editForm
      // for (const key in this.userInfo) {
      //   if (this.editForm[key] !== this.userInfo[key]) {
      //     obj[key] = this.editForm[key]
      //   }
      //   obj.sex = parseInt(this.editForm.sex)
      //   obj.id = this.userInfo.id
      // }
      updateUserInfo(this.editUserInfo).then((res) => {
        if (res.code === 0) {
          this.$toast.success('保存成功')
          this.userInfo = res.data.userInfo
        }
      })
    },
    updatePassword () {
      if (this.oldPassword === '' || this.newPassword === '') {
        this.$toast.error('请输入密码')
        return
      }
      if (this.newPassword.length < 6) {
        this.$toast.error('新密码长度不能小于6位')
        return
      }
      const data = {
        oldPassword: this.oldPassword,
        newPassword: this.newPassword
      }
      updatePassword(data).then((res) => {
        if (res.code === 0) {
          this.$toast.success('修改密码成功')
          // this.userInfo = res.data.userInfo
        } else {
          this.$toast.error(res.msg)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
input {
  line-height: 30px;
  vertical-align: middle;
}

.user-setting-warp .padding-dom {
  width: 789px;
  //height: 39px;
  border-bottom: 1px solid #e5e9ef;
  margin-bottom: 40px;
}

.el-form-item__content {
  line-height: 30px;
}

.el-radio-group {
  float: left;
}

.user-local,
.user-my-aim,
.user-my-btn,
.user-my-date,
.user-my-love,
.user-my-school,
.user-my-sex,
.user-my-sign,
.user-nick-name,
.user-nick-rel-name {
  //float: left;
  //width: 789px;
  //width: 100% !important;
}

.user-setting-warp {
  padding: 20px 20px 0;
  position: relative;
}

.el-form-item {
  width: 100%;
  display: block;
}

.el-form-item__content {
  width: 100%;
}

.el-form-item__label {
  width: 95px;
  text-align: right;
  margin-right: 20px;
  float: left;
  line-height: 30px;
  padding: 0;
}

.user-nick-name .el-input,
.user-nick-name .el-input__inner {
  float: left;
  width: 225px;
  height: 30px;
  margin-right: 40px;
}

.nick-name-not {
  color: #aaa;
}

.user-my-sign .el-textarea,
.user-my-sign .el-textarea .el-textarea__inner {
  float: left;
  width: 618px;
  height: 88px;
  resize: none;
}

.user-my-sex .el-radio-button__inner {
  margin-right: 20px;
  padding: 5px 8px;
  border: 1px solid #bfcbd9;
  border-radius: 5px !important;
  background: #f4f4f4;
  color: #717171;
}

.user-my-date .el-input__inner {
  height: 30px;
  color: #b7b7b7;
}

.user-local .el-select {
  margin-right: 30px;
}

.el-select-dropdown {
  width: 210px !important;
}

.user-local .el-input__inner,
.user-love .el-input__inner,
.user-my-aim .el-input__inner,
.user-my-love .el-input__inner {
  color: #99a2aa;
}

.user-my-btn-warp {
  float: left;
  width: 789px;
  height: 36px;
  position: relative;
}

.el-button--primary {
  width: 110px;
  position: absolute;
  top: 50%;
  left: 25%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background: #06a7ff !important;
}

.user-my-btn .el-button--primary:hover {
  background-color: #06a7ff !important;
}

.setting-no-data {
  width: 800px;
  height: 500px;
  position: relative;
}

.loading-icon {
  width: 100px;
  height: 100px;
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background: url(https://s1.hdslb.com/bfs/static/account-fe/static/img/loadTV.99606e2.gif) no-repeat;
  background-size: 100% 100%;
}

.userinfo-descript {
  font-size: 14px;
  float: left;
  color: #898989;
}

.user-setting-warp
.el-radio-button__orig-radio:checked
+ .el-radio-button__inner {
  background-color: #06a7ff !important;
  border-color: #06a7ff !important;
}

.user-center {
  width: 100%;
  height: 100%;
  background-color: #fff;

  .title {
    height: 50px;
    padding-left: 30px;
    border-bottom: 1px solid #ddd;

    .title-icon {
      float: left;
      width: 4px;
      height: 16px;
      margin-top: 18px;
      background-color: #06a7ff;
      border-radius: 4px;
    }

    .title-text {
      float: left;
      margin: 15px 0 0 5px;
      color: #06a7ff;
      font-size: 14px;
      cursor: default;
    }

    .reg-time {
      float: left;
      margin: 15px 0 0 50px;
      font-size: 14px;
      cursor: default;
    }
  }

  .user-setting-warp {
    padding: 20px 20px 0;
    position: relative;

    .avatar-main {
      float: left;
      width: 789px;
    }
  }
}
</style>

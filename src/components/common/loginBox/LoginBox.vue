<template>
  <div class="login-wrapper router-view">
    <div class="login-inner">
      <div class="login-card">
        <ul class="login-type-list">
          <li class="login-type-item" :class="loginType===0 ? 'active':''" @click="loginType=0">密码登录</li>
          <li class="login-type-item" :class="loginType===1 ? 'active':''" @click="loginType=1">验证码登录</li>
        </ul>
        <div class="login-content">
          <div class="account-wrapper" v-show="loginType === 0">
            <form class="el-form login-form">
              <div class="el-form-item is-error is-required">
                <div class="el-form-item__content" style="margin-left: 0px">
                  <div
                    class="loginTelephoneInput el-input el-input-group el-input-group--prepend"
                  >
                    <div class="el-input-group__prepend">
                      <span>+86</span>
                    </div>
                    <input
                      type="text"
                      autocomplete="off"
                      placeholder="请输入手机号"
                      maxlength="11"
                      class="el-input__inner"
                    />
                  </div>
                  <div class="el-form-item__error">请输入手机号</div>
                </div>
              </div>
              <div class="el-form-item is-required">
                <div class="el-form-item__content" style="margin-left: 0px">
                  <div
                    class="el-input el-input-group el-input-group--prepend el-input--suffix"
                  >
                    <div class="el-input-group__prepend">
                      <i class="el-icon-lock"> </i>
                    </div>
                    <input
                      type="password"
                      autocomplete="off"
                      placeholder="密码"
                      maxlength="20"
                      class="el-input__inner"
                    /><span class="el-input__suffix"
                  ><span class="el-input__suffix-inner"></span
                  ></span>
                  </div>
                </div>
              </div>
              <div class="slot-wrapper">
                <label data-v-923c4e12="" class="el-checkbox"
                ><span class="el-checkbox__input"
                ><span class="el-checkbox__inner"></span
                ><input
                  type="checkbox"
                  aria-hidden="false"
                  class="el-checkbox__original"
                  value="" /></span
                ><span class="el-checkbox__label">记住我</span></label
                ><a
                href="/forget?Rurl=https://pan.qiwenshare.com/share/889bc306921f4ce58493d72418fad74b?filePath=/333333/"
                class="forget-link el-link el-link--default is-underline"
              ><span class="el-link--inner">忘记密码</span></a
              >
              </div>
              <div class="el-form-item">
                <div class="el-form-item__content" style="margin-left: 0px">
                  <button
                    type="button"
                    class="el-button login-btn el-button--primary"
                  >
                    <span>登 录</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginBox',
  props: {},
  components: {},
  data () {
    return {
      loginType: 0
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

<style lang="less" scoped></style>

<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit" :errorsMsg="err"></login-form>
          <p class="login-tip">输入用户名和密码</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },

  data () {
    return {
      err: ''
    }
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit ({ userName, password }) {
      this.err = ''
      this.handleLogin({ userName, password })
        .then(res => {
          this.getUserInfo().then(res => {
            this.$router.push({
              name: 'home'
            })
          })
        })
        .catch(err => {
          this.err = err.response && err.response.data.message
          console.log('handleLogin  err', err)
        })
    }
  }
}
</script>

<style>
</style>

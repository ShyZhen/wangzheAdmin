<template>
  <view className="container">
    <view className="t-login">
      <view className="t-b">{{ title }}</view>

    </view>
  </view>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {getAppId, getPlatformId} from "@/utils/auth";

export default {
  data() {
    return {
      title: '待定页面',
      appId: '',
      platformId: '',
    }
  },
  computed: {
    ...mapState(['hasBinding', 'hasLogin']),
  },
  onLoad() {
    // 在需要登录的地方执行初始化方法
    this.initLoginState()

    // 判断登录状态 并跳转到首页
    if (!this.hasLogin) {
      this.$toLogin()
    }

    this.appId = getAppId()
    this.platformId = getPlatformId()
  },
  methods: {

    ...mapActions(['initLoginState']),

  }
}
</script>

<style>

</style>

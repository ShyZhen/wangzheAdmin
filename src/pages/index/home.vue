<template>
	<view class="container">
    <view class="t-login">
      <view class="t-b">{{title}}</view>
      <view><button @tap="drawList">抽奖模块</button></view>
      <view><button @tap="skinQuery">碎片兑换查询</button></view>
      <view><button @tap="bindLogout">登出</button></view>
    </view>
	</view>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import {removeLoginStorage} from "@/utils/auth";
  import store from "@/store/index.js";

  export default {
		data() {
			return {
        title: '已经登录了进来了'
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
		},
		methods: {

      ...mapActions(['initLoginState']),

      drawList() {
        uni.navigateTo({
          url: '../index/draw'
        });
      },

      skinQuery() {
        uni.navigateTo({
          url: '../index/skin'
        });
      },

      bindLogout() {
        let that = this
        // 清除localstorage和vuex
        removeLoginStorage()
        store.commit('logout')

        setTimeout(() => {
          that.$toLogin()
        }, 500);
      },
		}
	}
</script>

<style>

</style>

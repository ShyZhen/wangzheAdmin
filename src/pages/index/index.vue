<template>
	<view class="container content">

    <view class="header">
      <view class="logo-img">
        <image :src="logo" lazy-load @load="onoff='1'" @tap="" />
      </view>
    </view>

    <view class="t-login">
      <view class="t-b">{{title}}</view>
      <form class="cl">

        <view class="t-a">
          <image src="/static/A.png" mode="widthFix"></image>
          <input clearable v-model="iAppid" maxlength="32" placeholder-class="e-cb" placeholder="请输入小程序APPID" />
        </view>

        <view class="t-a">
          <image src="/static/P.png" mode="widthFix"></image>
          <input clearable v-model="iPlatform" maxlength="64" placeholder-class="e-cb" placeholder="请输入平台唯一UUID" />
        </view>

        <view>
          <button class="btn" @tap="loginAndSave">立即登录</button>
        </view>

      </form>
    </view>
	</view>
</template>

<script>

  import { mapState, mapActions } from 'vuex'
  import {platformLogin} from "@/apis/api";
  import {setAppId,setPlatformId} from "@/utils/auth";
	export default {
		data() {
			return {
        logo: '/static/admin1.png',
				title: '王者后台',
        iAppid: '',
        iPlatform: '',
			}
		},
    computed: {
      ...mapState(['hasBinding', 'hasLogin']),
    },
		onLoad() {
      // 在需要登录的地方执行初始化方法
      this.initLoginState()

      // 判断登录状态 并跳转到首页
      if (this.hasLogin) {
        this.$toHome()
      }
		},
		methods: {

      ...mapActions(['initLoginState']),

      loginAndSave() {
        let that = this
        if (this.iPlatform && this.iAppid) {
          // 登录成功保存到本地，每次进来此页面重新登录，并记录到vuex
          platformLogin(this.iAppid, this.iPlatform).then(res => {
            if (res.data) {
              // 登录成功
              setAppId(that.iAppid) && setPlatformId(that.iPlatform) && this.$toHome()
            }
          })
        } else {
          this.$toast("输入有误")
        }
      }
		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

  .header .logo-img image {
    width: 68px;
    height: 68px;
    border-radius: 50%;
  }

  .t-login {
    width: 600rpx;
    margin: 0 auto;
    font-size: 28rpx;
    color: #000
  }

  .t-login input {
    padding: 0 20rpx 0 120rpx;
    height: 90rpx;
    /*line-height: 90rpx;*/
    margin-bottom: 50rpx;
    background: #f4f4f4;
    font-size: 28rpx;
    border-radius: 50rpx
  }

  .t-login .t-a {
    position: relative
  }

  .t-login .t-a image {
    width: 32rpx;
    height: 32rpx;
    position: absolute;
    left: 40rpx;
    top: 30rpx;
    border-right: 2rpx solid #dedede;
    padding-right: 20rpx;
  }

  .t-login .t-b {
    text-align: center;
    font-size: 46rpx;
    color: #ffffff;
    padding: 150rpx 0
  }


  .t-g button {
    border: none;
    background:none;
  }
  .t-g button::after{
    border: none;
  }

  .t-login .t-e image {
    width: 90rpx;
    height: 90rpx
  }


  .t-login .t-f text {
    margin-left: 8rpx;
    color: #999
  }

  .cl {
    zoom: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .cl:after {
    clear: both;
    display: block;
    visibility: hidden;
    height: 0;
    content: '\20'
  }
</style>

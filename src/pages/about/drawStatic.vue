<template>
  <view class="container" :style="{opacity:pageOpacity}">
    <view class="content">
      <!--  header  -->
      <view class="header-container">
        <view class="header">
          <view class="logo-img">
            <image :src="logo" lazy-load @load="onoff='1'" @tap="" />
          </view>
        </view>
        <view class="title">
          <p>{{ appName }}</p>
          <p>{{ version }}</p>
        </view>
      </view>

      <view class="about">
        <view class="header"><span>抽奖模块说明：</span></view>
        <view class="chapter">
          <view>【添加】抽奖数据每天最多十个</view>
          <view>【上传】抽奖图尺寸1080*496，上传前必须压缩，提高响应速度（压缩图片 https://tinyjpg.com）</view>
          <view>【修改】抽奖不支持修改图片</view>
          <view>【内定】抽奖支持内定中奖用户ID，但是不建议一毛不拔，格局要大</view>
          <view>【已结束】的抽奖数据无法修改</view>
          <view>【已结束】列表可以看到当前用户的UUID，用户申请兑奖的时候，要对比中奖用户ID以及UUID是否一致</view>
        </view>
      </view>

      <view class="about">
        <view class="header"><span>碎片兑换说明：</span></view>
        <view class="chapter">
          <view>用户提交了兑换申请后才能查询到兑换记录日志，并扣除用户的碎片</view>
          <view>兑换前需要检查用户提交的兑换记录的截图，确定是自己的小程序名字</view>
          <view>兑换方式：腾讯充值中心-扫码登录-充值、微信转账、或者其他方式协商都可以</view>
          <view>兑换完了记得在本项目中设置兑换成功，避免重复兑换</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>

import Config from '../../config/config'
export default {
  data() {
    return {
      pageOpacity: 0,
      appName: Config.appName,
      version: Config.version,
      logo: '/static/admin1.png',
    }
  },
  onLoad: function () {
  },
  onReady(e) {
    this.pageOpacity = 1
  },
  methods: {
    goStaticPage(type) {
      let page = '/pages/about/' + type + 'Static'
      uni.navigateTo({
        url: page
      });
    },
  }
}
</script>

<style>
.container {
  transition: all 0.5s linear;
  font-size: 14px;
  line-height: 24px;
  color: #F4F5F6;
}
.container .content {
  padding: 0 32rpx;
}
.container .content .header-container .header {
  text-align: center;
}
.container .content .header-container .header .logo-img {
  height: 68px;
  padding-top: 120rpx;
}
.container .content .header-container .header .logo-img image {
  width: 68px;
  height: 68px;
  border-radius: 50%;
}
.container .content .header-container .title {
  margin-top: 12px;
  text-align: center;
  font-size: 16px;
}
.container .content .about {
  margin-top: 60rpx;
}
.container .content .about .header {
  margin-bottom: 32rpx;
  display: inline-block;
  position: relative;
  font-size: 32rpx;
  font-weight: bold;
}
.container .content .about .header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 12rpx;
  background-color: #fdefec;
}
.container .content .about .chapter view {
  position: relative;
  margin-bottom: 20rpx;
  padding: 24rpx;
  background-color: #1D3549;
  border: 1px solid #F4F5F6;
  color: #F4F5F6;
  font-size: 28rpx;
  line-height: 40rpx;
  border-radius: 4rpx;
}

</style>

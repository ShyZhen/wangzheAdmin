<template>
	<view class="container content">
    <view>
      <view><button class="btn" @tap="drawList">抽奖模块</button></view>
      <view><button class="btn" @tap="skinQuery">碎片兑换查询</button></view>
      <view><button class="btn" @tap="bindLogout">登出</button></view>
    </view>

    <view>
      <e-modal :visible.sync="visible" @cancel="handleCancel">
        <view class="detail">
          <view class="header">
            <view class="info">
              <view class="e-mt20">
                <input type="text" clearable class="desc ellipsis" v-model="userUuid" maxlength="64" placeholder-class="e-cb" placeholder="请输入待查询用户的UUID"/>
              </view>
              <view class="e-mt10">
                <button class="btn" @tap="getSkinConvertLog">查询兑换记录</button>
              </view>
            </view>
          </view>
        </view>
      </e-modal>
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
        visible: false,
        userUuid: ''
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
          url: '/pages/index/draw'
        });
      },

      skinQuery() {
        // 展示模态框
        this.visible=true
      },
      getSkinConvertLog() {
        this.userUuid = this.userUuid.trim()
        if (!this.userUuid) {
          uni.showModal({
            title: '输入有误',
            content: '查询用户的UUID不能为空',
            showCancel: false,
            confirmText: '好叻',
          })
          return false
        } else {
          uni.navigateTo({
            url: '/pages/index/skin?uuid='+this.userUuid
          });
        }
      },
      handleCancel() {
        console.log('cancel')
        this.visible = false
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

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

<script>
	export default {
		onLaunch: function() {
      console.log('App Launch')
      // 强制更新
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        console.log("强制更新检查", res.hasUpdate)
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        wx.showModal({
          title: '提示',
          content: '检查到有新版本，但下载失败，请检查网络后重试',
          showCancel: false
        })
      })
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';
@import './common/animate.min.css';

/* H5 兼容 pc 所需 */
/* #ifdef H5 */
@media screen and (min-width: 768px) {
  body{
    overflow-y: scroll;
  }
}

/* 顶栏通栏样式 */
/* .uni-top-window {
    left: 0;
    right: 0;
} */

uni-page-body {
  background-color: #F5F5F5 !important;
  min-height: 100% !important;
  height: auto !important;
}
/* #endif */
/* #endif*/
</style>

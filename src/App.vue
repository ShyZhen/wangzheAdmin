<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
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

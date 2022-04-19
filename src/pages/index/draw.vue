<template>
  <view class="container" :style="{opacity:pageOpacity}">
    <!-- 滚动分类 -->
    <view class="page-section-spacing scrollH navFlex">
      <scroll-view class="scroll-view_H" scroll-x="true" @scroll="scroll" style="width: 100%">
        <view class="scroll-view-item_H e-wh50" v-for="(item,index) in navList" :key="item.id">
          <text :class="item.type === type ? 'navItem active' : 'navItem'"
                :data-item="item"
                :data-index="index"
                @tap="changeType">{{item.title}}</text>
        </view>
      </scroll-view>
    </view>

    <view class="e-mt100">
      <video-list :videolist="navList[type].itemsList" @itemClick="itemClick"></video-list>
      <load-more :status="navList[type].loadMoreStatus" />
    </view>

  </view>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import {getAppId, getPlatformId} from "@/utils/auth";
  import {getDrawList} from '@/apis/api.js'
  import VideoList from '@/components/videolist/video-list'
  import LoadMore from '@/components/loadmore/load-more'

  export default {
    components: {LoadMore, VideoList},
		data() {
			return {
        title: 'draw',
        appId: '',
        platformId: '',
        pageOpacity: 0,
        pageSize: 10,
        type: 0,  // 第几个、也是type值
        navList: [
          {type: 0, title: '进行中'},
          {type: 1, title: '已结束'},
        ],
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

      this.loadTabBars()
		},
    onReady(e) {
      this.pageOpacity = 1
    },
    onReachBottom() {
      //上滑加载
      setTimeout(() => {
        this.loadData('add');
      }, 1000);
    },
    //下拉刷新
    onPullDownRefresh () {
      this.loadData('refresh');
    },
		methods: {
      ...mapActions(['initLoginState']),
      loadTabBars() {
        this.navList.forEach(item => {
          this.$set(item, 'itemsList', [])
          // 加载更多 0加载前，1加载中，2没有更多了
          this.$set(item, 'loadMoreStatus', 0)
          this.$set(item, 'refreshing', 0)
          this.$set(item, 'currentPage', 1)
        })
        this.loadData('add')
      },
      loadData(type) {
        let that = this
        let tabItem = this.navList[this.type]
        // 加载
        if (type === 'add') {
          if (tabItem.loadMoreStatus === 2){
            return
          }
          tabItem.loadMoreStatus = 1
        }
        // 刷新
        if (type === 'refresh') {
          tabItem.currentPage = 1
        }

        getDrawList(this.type, tabItem.currentPage, that.appId, that.platformId).then(res => {
          let list = res.data.data

          if (type === 'refresh') {
            // 刷新前清空数组
            tabItem.itemsList = []
          }
          list.forEach(item => {
            tabItem.itemsList.push(item)
          })

          // 下拉刷新 关闭刷新动画
          if (type === 'refresh') {
            setTimeout(function () {
              uni.stopPullDownRefresh();
            }, 500);
            tabItem.loadMoreStatus = 0
          }

          // 上滑加载 处理状态以及页数
          if (type === 'add') {
            tabItem.loadMoreStatus = list.length < this.pageSize ? 2: 0
          }
          tabItem.currentPage += 1
        }).catch(err => {})
      },
      changeType(e) {
        const index = e.target.dataset.index
        const slectItem = e.target.dataset.item
        this.type = slectItem.type
        this.loadData('add')
      },

      itemClick(item) {
        if (item.type !== 0) {
          uni.showModal({
            title: '结束活动无法更改',
            content: '请ID为'+item.winner_id+'的用户尽快联系兑换',
            showCancel: false,
            confirmText: '好叻',
          })
          return false
        } else {
          uni.navigateTo({
            url: '/pages/draw/joinDraw?prams=' + JSON.stringify(item)
          })
        }
      },
		}
	}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.5s linear;
  font-size: 14px;
  color: #F4F5F6;
}
.page-section-spacing {
  background: rgba(0, 0, 0, 0.3);
  width: 100%;
  color: #fff;
  box-shadow: 0 0.01rem 0.18rem rgba(0, 0, 0, 0.6);
}
.scroll-view_H {
  white-space: nowrap;
}
.scroll-view-item_H {
  display: inline-block;
  height: 70rpx;
  line-height: 70rpx;
  font-size: 10pt;
}
.navItem {
  text-align: center;
  padding: 0 10px;
  width: 100%;
  height: 100%;
  display: block;
}
</style>

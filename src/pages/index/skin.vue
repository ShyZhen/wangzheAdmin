<template>
  <view class="container">

    <view class="exchange-list">
      <view class="exchange-list--item" v-for="(item,index) in converts" :key="item.id" @tap="handleStatus(item)">
        <view class="info">
          <view class="nums">兑换数量：{{item.convert_num}}</view>
          <view class="date">{{item.created_at}}</view>
        </view>

        <view class="info">
          <view class="nums">
            <view class="status" :class="EXCHANGE_STATUS_CLASS[item.status]">
              状态：{{EXCHANGE_STATUS[item.status]}}
            </view>
          </view>
          <view class="date e-txtR">{{appName}}</view>

        </view>
      </view>
    </view>

    <load-more :status="loadMoreStatus" />

  </view>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import {getAppId, getPlatformId} from "@/utils/auth"
import LoadMore from '@/components/loadmore/load-more'
import Config from "@/config/config"
import {getConvertList, setSkinStatus} from '@/apis/api.js'

const CONSTANTS = {
  EXCHANGE_STATUS: {
    'success': '已完成',
    'wait': '待处理',
    'fail': '未完成'
  },
  EXCHANGE_STATUS_CLASS: {
    'success': 'complate',
    'wait': 'pending',
    'fail': 'no_complate'
  }
}

export default {
  data() {
    return {
      appId: '',
      platformId: '',
      userUuid: '',

      appName: Config.appName,
      loadMoreStatus: 0,
      page: 1,
      pageSize: 20,  // 此处固定20个,为了高度够用,下拉加载更多
      converts: [],
      ...CONSTANTS
    }
  },
  computed: {
    ...mapState(['hasBinding', 'hasLogin']),
  },
  components:{
    LoadMore
  },
  onLoad(option) {
    // 在需要登录的地方执行初始化方法
    this.initLoginState()

    // 判断登录状态 并跳转到首页
    if (!this.hasLogin) {
      this.$toLogin()
    }

    this.userUuid = option.uuid
    this.appId = getAppId()
    this.platformId = getPlatformId()

    this.loadData('add')
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
    // 获取兑换日志
    loadData(type) {
      let that = this
      if (!this.hasLogin) {
        this.$toast('需要先登录')
        return false
      } else {
        if (type === 'add') {
          if (this.loadMoreStatus === 2) {
            return false
          }
          this.loadMoreStatus = 1
        }

        if (type === 'refresh') {
          this.page = 1
        }

        getConvertList(this.userUuid,this.page,this.appId,this.platformId).then(res => {
          let list = res.data.data
          if (type === 'refresh') {
            // 刷新前清空数组
            that.converts = []
            that.loadMoreStatus = 0
            setTimeout(function () {
              uni.stopPullDownRefresh()
            }, 500)
          }

          list.forEach(item => {
            that.converts.push(item)
          })

          if (type === 'add') {
            that.loadMoreStatus = list.length < this.pageSize ? 2: 0
          }

          that.page += 1
        })
      }
    },

    handleStatus(item) {
      let that = this
      if (item.status === 'wait') {
        uni.showModal({
          title: '状态更新',
          content: '更改状态为已完成？',
          success: function(res) {
            if (res.confirm) {

              setSkinStatus(item.id, that.userUuid, that.appId, that.platformId).then(res => {
                that.loadData('refresh');
              })
            } else if (res.cancel) {}
          }
        })
      } else {
        this.$toast('该兑换已完成，无需更新')
        return false
      }
    }
  }
}
</script>

<style>
.exchange-list{
  width: 100%;
  background: #12202C;
}

.exchange-list--item{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx;
  height: 160rpx;
  font-size: 28rpx;
  font-weight: 400;
  color: #EBEBEB;
  border-bottom: 1rpx solid #263440;
}
.exchange-list--item .nums{
  margin-bottom: 32rpx;
}
.exchange-list--item .date{
  font-size: 24rpx;
  color: #9D9D9D;
  font-weight: 400;
}
.status{
  position: relative;
  padding-left: 34rpx;
}
.status::after{
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 20rpx;
  height: 20rpx;
  border-radius: 50rpx;
}
.status.complate::after{
  background: #5FFF24;
}
.status.pending::after{
  background: #FFA224;
}
.status.no_complate::after{
  background: #FF2424;
}
</style>

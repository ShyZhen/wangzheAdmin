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

    <!--  模态框-修改  -->
    <view v-show="chooseDrawItem">
      <e-modal :visible.sync="visibleEdit" @cancel="handleCancel">
        <view class="detail">
          <view class="header">
            <view class="info">
              <view class="e-mt20">
                <label class="name">抽奖标题</label>
                <input clearable class="desc ellipsis" v-model="chooseDrawItem.title" maxlength="64" placeholder-class="e-cb" placeholder="请输入标题" />
              </view>
              <view class="e-mt10">
                <label class="name">开奖人数</label>
                <input type="number" clearable class="desc ellipsis" v-model="chooseDrawItem.limit_user" placeholder-class="e-cb" placeholder="" />
              </view>
              <view class="e-mt10">
                <label class="name">内定中奖ID(0为随机开奖)</label>
                <input type="number" clearable class="desc ellipsis" v-model="chooseDrawItem.winner_id" placeholder-class="e-cb" placeholder="" />
              </view>
              <view class="e-mt10">
                <button @tap="handleEdit">确定更新</button>
              </view>
            </view>
          </view>
        </view>
      </e-modal>
    </view>

    <!--  模态框-添加  -->
    <view v-show="addDrawItem">
      <e-modal :visible.sync="visibleAdd" @cancel="handleCancel">
        <view class="detail">
          <view class="header">
            <view class="avatar-group" @tap="upload">
              <view class="h100">
                <image :src="addDrawItem.image"></image>
              </view>
            </view>
            <view class="info">
              <view class="e-mt20">
                <label class="name">抽奖标题</label>
                <input clearable class="desc ellipsis" v-model="addDrawItem.title" maxlength="64" placeholder-class="e-cb" placeholder="请输入标题" />
              </view>
              <view class="e-mt10">
                <label class="name">开奖人数</label>
                <input type="number" clearable class="desc ellipsis" v-model="addDrawItem.limit_user" placeholder-class="e-cb" placeholder="" />
              </view>
              <view class="e-mt10">
                <label class="name">内定中奖ID(0为随机开奖)</label>
                <input type="number" clearable class="desc ellipsis" v-model="addDrawItem.winner_id" placeholder-class="e-cb" placeholder="" />
              </view>
              <view class="e-mt10">
                <button @tap="handleAdd">确定添加</button>
              </view>
            </view>
          </view>
        </view>
      </e-modal>
    </view>

    <!-- 右下角按钮 -->
    <y-Fab :bottom="140" :right="40" :btnList="fabList" @click="handleFab" />

  </view>
</template>

<script>
  import { mapState, mapActions } from 'vuex'
  import {getAppId, getPlatformId} from "@/utils/auth";
  import {editDraw, getDrawList, uniUploadImage, addDraw} from '@/apis/api.js'
  import VideoList from '@/components/videolist/video-list'
  import LoadMore from '@/components/loadmore/load-more'
  import yFab from '@/components/y-Fab/y-Fab'
  import EModal from '@/components/e-modal/e-modal'

  export default {
    components: {LoadMore, VideoList, yFab, EModal},
		data() {
			return {
        addDrawItem: {
          title: '',
          limit_user: 0,
          winner_id: 0,
          image: '/static/image.png',
        },
        chooseDrawItem: {},
        visibleEdit: false,
        visibleAdd: false,
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
        //fab的设置
        fabList: [
          {
            bgColor: '#3196FA',
            text: '发布',
            fontSize: 28,
            color: '#fff'
          },
          {
            bgColor: '#67aff6',
            text: '必读',
            fontSize: 28,
            color: '#fff'
          }
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
            content: '校验UUID：'+item.user.uuid,
            showCancel: false,
            confirmText: '好叻',
          })
          return false
        } else {
          // 更新模态框
          this.visibleEdit = true
          this.chooseDrawItem = item
        }
      },
      // 提交更新
      handleEdit() {
        let that = this
        let err = this.checkData(this.chooseDrawItem);
        if (err) {
          uni.showModal({
            title: '输入有误',
            content: err,
            showCancel: false,
            confirmText: '好叻',
          })
          return false
        } else {
          editDraw(that.appId, that.platformId, that.chooseDrawItem.id, that.chooseDrawItem.title, that.chooseDrawItem.winner_id, that.chooseDrawItem.limit_user).then(res => {
            that.handleCancel()
            uni.showModal({
              title: '更新成功',
              content: '是否需要刷新页面？',
              success: function(res) {
                if (res.confirm) {
                  that.loadData('refresh');
                } else if (res.cancel) {
                  console.log('bu shua')
                }
              }
            })
          }).catch(err => {})
        }
      },
      // 提交添加
      handleAdd() {
        let that = this
        let err = this.checkData(this.addDrawItem);
        if (err) {
          uni.showModal({
            title: '输入有误',
            content: err,
            showCancel: false,
            confirmText: '好叻',
          })
          return false
        } else {
          // 添加
          addDraw(that.appId, that.platformId, that.addDrawItem.title, that.addDrawItem.winner_id, that.addDrawItem.limit_user, that.addDrawItem.image).then(res => {
            that.handleCancel()
            uni.showModal({
              title: '添加成功',
              content: '是否需要刷新页面？',
              success: function(res) {
                if (res.confirm) {
                  that.loadData('refresh');
                } else if (res.cancel) {
                  console.log('bu shua')
                }
              }
            })
          }).catch(err => {})
        }
      },
      upload() {
        let that = this
        uni.chooseImage({
          count: 1, //默认9
          sizeType: ['compressed'],
          sourceType: ['album'],
          success: (fileRes) => {
            if (fileRes.tempFilePaths.length) {
              that.$loading('压缩上传中...')

              let counter = 0
              fileRes.tempFilePaths.forEach(function(item) {
                uniUploadImage(that.appId, that.platformId, item).then(res => {
                  // 此处无法依赖request中的错误处理
                  if (res.statusCode !== 201) {
                    that.$toast(JSON.parse(res.data).message)
                    return false
                  }

                  // 回显
                  that.addDrawItem.image = (JSON.parse(res.data).data)
                  that.$loading(false)
                }).catch(err => {
                  console.log(err)
                  that.$toast('上传失败，请重试')
                })
              })
            }
          }
        });
      },


      //点击右下角tab按钮
      handleFab(e) {
        let that = this
        let index = e.index;
        switch (index) {
          case 0:
            if (this.hasLogin) {
              that.visibleAdd = true
            } else {
              this.$toast('需要先登录')
              setTimeout(() => {
                this.$toLogin()
              }, 1000);
              return false
            }
            break;
          case 1:
            let page = '/pages/about/drawStatic'
            uni.navigateTo({
              url: page
            });
            break;
        }
      },
      handleCancel() {
        console.log('cancel')
        this.visibleEdit = false
        this.visibleAdd = false
      },
      checkData(item) {
        let numReg = /^[0-9]*$/
        let numRe = new RegExp(numReg)

        if (!item.title.trim()) {
          return '标题不能为空'
        }
        if (!numRe.test(item.limit_user)) {
          return '开奖人数只能为数字'
        }
        if (!numRe.test(item.winner_id)) {
          return '中奖者ID只能为数字'
        }
        if (!item.image.trim() || item.image === '/static/image.png') {
          return '图片地址不能为空'
        }
        return ''
      },

		}
	}
</script>

<style>

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
.active {
  background: transparent url('/static/active.png') no-repeat;
  background-size: contain;
  background-position: bottom center;
}

/* 模态框 */
.ellipsis{
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.detail{
  border-radius: 4px;
  padding: 12px;
  background: #0A98D5;
}
.detail .header{
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-bottom: 12px;
  color: #fabd0c;
}
.detail .avatar-group{
  flex-shrink: 0;
  width: 88px;
  height: 88px;
  margin-right: 12px;
  overflow: hidden;
  border-radius: 6px;
}
.detail .avatar-group image{
  width: 100%;
  height: 100%;
}
.detail .info{
  width: 100%;
  overflow: hidden;
}
.detail .info view:not(:last-child){
  margin-bottom: 12px;
}
.detail .name{
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
  color: #50d3fd;
}
.detail .desc{
  font-size: 12px;
  line-height: 20px;
  color: #ffffff;
}
</style>

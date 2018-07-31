// pages/particulars/particulars.js
const app = getApp()
var util = require("../../utils/util.js");
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lock: false,
    item: {},
    userInfo: {},
    hidden:true,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pageId: 0,
    options: null,
  },
  hidden:function(){
let that=this
that.setData({
  hidden: !that.data.hidden
})
  },
  flaunt:function(){
    let that=this
wx:wx.navigateTo({
  url: '../flaunt/flaunt?giftId=' + that.data.item.giftCard.id,

})
  },
  coypHidden:function(){
    let that=this
    wx.setClipboardData({
      data: that.data.item.address,
      success: function (res) {
console.log(res)
      }
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      common.uploadInfo(e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl)
    }
  },
  backHome: function () {
    wx.switchTab({
      url: '../home/home'
    })
  },

  initiate: function () { //发起抽奖
    let that = this
    wx.navigateTo({
      url: '../producePhoto/producePhoto?giftId=' + that.data.item.giftCard.id
    })

  },
  winUserInfo: function (e) { //查看中将则信息
    let that = this
    wx: wx.navigateTo({
      url: '../winUserInfo/winUserInfo?giftId=' + e.currentTarget.dataset.id + "&wayOfGiving=" + that.data.item.giftCard.wayOfGiving

    })
  },
  formSubmit: function (e) { //获取formId并参与
    let that = this
    common.uploadInfo(that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
    common.req({
      url: 'user/participate',
      data: {
        'giftId': parseInt(e.detail.target.dataset.id),
        'msgFormId': e.detail.formId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function (res) {
        if (res.data.status == '0000') {

          let firstUrl = that.data.item.participantList //参与成功，，替换首个头像
          if (that.data.item.participantList.length <= 0) {
            firstUrl.unshift(that.data.userInfo.avatarUrl)
          } else if (that.data.item.participantList.length == 8) {
            firstUrl.splice(7, 1)
            firstUrl.unshift(that.data.userInfo.avatarUrl)
          } else if (0 < that.data.item.participantList.lengt < 8) {
            firstUrl.unshift(that.data.userInfo.avatarUrl)
          }

          that.setData({
            "item.participantList": firstUrl,
            'item.isParticipated': 'true',
            'item.participantCount': (parseInt(that.data.item.participantCount) + 1)
          })

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    app.globalData.invitorId = options.invitorId
    console.log(options)
    that.setData({
      options: options
    })
    if (options.pageId) {
      that.setData({
        pageId: 1
      })
    }


    if (app.globalData.userInfo) { //在app页面获取userInfo
      that.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })


    } else if (that.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况

      app.userInfoReadyCallback = res => {
        that.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })

        }
      })
    }
    wx.setNavigationBarTitle({
      title: '礼品卡详情'
    })


  },
  select: function () {
    let that = this
    if (that.data.item.giftCard.wayOfGiving==4){
      wx.setClipboardData({
        data: that.data.item.giftCard.awardWechat,
        success: function (res) {
          console.log(res)
        }
      })
return
    }
    wx: wx.navigateTo({
      url: '../addAddress/addAddress?giftId=' + that.data.item.giftCard.id + "&wayOfGiving=" + that.data.item.giftCard.wayOfGiving,

    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function () {
    let that = this


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    let that = this


    let options = that.data.options
    let scene = decodeURIComponent(options.scene)
    if (options.giftId) {
      getList(options.giftId)
    } else if (options.scene) {
      getList(scene)
    }

    // getList(443)
    function getList(id) {
      that.setData({
        lock: true
      })
      common.req({
        url: 'gift/getGiftDetail',
        data: {
          'giftId': parseInt(id)
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        dataType: 'json',
        method: 'POST',
        success: function (res) {
          let str = res.data.data.giftCard.awardTime;
          str = str.replace(/-/g, '/');
          let date = new Date(str);
          let awardTime = setDate(date)
          res.data.data.giftCard.awardTime = awardTime,
            res.data.data.giftCard.picPath = app.FILE_URL + res.data.data.giftCard.picPath
          if (res.data.data.participantCount > 8) {
            that.setData({
              beyond: '...'
            })
          }
          that.setData({
            item: res.data.data
          })

        },
        complete: function (res) {
          that.setData({
            lock: false
          })
        },
      })
    }

    function setDate(date) { //将时间转化格式
      let getHours, getMinutes, getMonth, getDate;

      if (date.getMonth() < 9) {
        getMonth = '0' + (parseInt(date.getMonth()) + 1)
      } else {
        getMonth = date.getMonth()
      }
      if (date.getDate() < 10) {
        getDate = '0' + date.getDate()
      } else {
        getDate = date.getDate()
      }

      if (date.getHours() < 10) {
        getHours = '0' + date.getHours()
      } else {
        getHours = date.getHours()
      }
      if (date.getMinutes() < 10) {
        getMinutes = '0' + date.getMinutes()
      } else {
        getMinutes = date.getMinutes()
      }
      let newData = getMonth + "月" + getDate + "日 " + getHours + ":" + getMinutes
      return newData;

    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh() //停止下拉刷新

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () { //分享页面

    try {
      var value = wx.getStorageSync('userId')
      if (value) {
        app.globalData.userId = value
      }
    } catch (e) {

    }

    var that = this
    return {
      title: that.data.item.createrInfo.nickName + '准备了' + that.data.item.giftCard.amount + '份' + that.data.item.giftCard.name + '的礼品卡，大家快来抢。',
      path: '/pages/particulars/particulars?giftId=' + that.data.item.giftCard.id + "&invitorId=" + (app.globalData.userId || '')
    }
  }
})
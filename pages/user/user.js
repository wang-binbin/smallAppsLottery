// pages/user/user.js
const app = getApp()
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getUserInfo: function(e) { //获取头像昵称
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      common.uploadInfo(e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl)
    }
  },
  myAddGiftCard: function() { //跳转我生成的礼品卡页面

    wx: wx.navigateTo({
      url: '../myAddGiftCard/myAddGiftCard',
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // walletAddress: function() { //钱包地址页面
  //   wx: wx.navigateTo({
  //     url: '../walletAddressList/walletAddressList',
  //   })
  // },
  myGiftCard: function() { //我生成的礼品卡
    wx: wx.navigateTo({
      url: '../myGiftCard/myGiftCard',
    })
  },
  contact:function() {//联系我们
    wx: wx.navigateTo({
      url: '../contact/contact',
    })
  },
  myBalance:function(){//我的余额
    wx: wx.navigateTo({
      url: '../myBalance/myBalance',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '我的'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setStorage({
      key: "tabIndex",
      data: 2
    })
    if (app.globalData.userInfo) { //在app页面获取userInfo信息
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })

        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    wx.stopPullDownRefresh() //停止下拉刷新

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})
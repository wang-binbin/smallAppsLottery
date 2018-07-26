// pages/giftParticulars/giftParticulars.js
const app = getApp()
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: {},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    let awardTime = setDate()
    options.picPath = app.FILE_URL + options.picPath
    options.awardTime = awardTime
    that.setData({
      item: options,
    })

    function setDate() {
      let str = options.awardTime;
      str = str.replace(/-/g, '/');
      let date = new Date(str);
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
    wx.setNavigationBarTitle({
      title: '生成礼品卡'
    })

  },
  producePhoto: function() {
    var that = this
    // console.log(that.data.item.giftId)
    wx.navigateTo({
      url: '../producePhoto/producePhoto?giftId=' + that.data.item.giftId
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
  gohome: function() {
    wx.switchTab({
      url: '../home/home'
    })
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

  onShareAppMessage: function() {
    let that = this

    try {
      var value = wx.getStorageSync('userId')
      if (value) {
        app.globalData.userId = value
      }
    } catch (e) {

    }
    return {
      title: that.data.item.nickName + '准备了' + that.data.item.amount + '份' + that.data.item.name + '的礼品卡，大家快来抢。',
      path: '/pages/particulars/particulars?giftId=' + that.data.item.giftId + "&invitorId=" + (app.globalData.userId || '')
    }
  }

})
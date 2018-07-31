// pages/winUserInfo/winUserInfo.js
const app = getApp()
var util = require("../../utils/util.js");
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  list:[],
  wayOfGiving:null
  },
  copy:function(e){//复制
    wx.setClipboardData({
      data: e.currentTarget.dataset.copy,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
          },
          fail:function(){
            wx.showToast({
              title: '复制失败！请重试',
              icon: 'none',
              duration: 2000
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    console.log(options)
    that.setData({
      wayOfGiving: options.wayOfGiving
    })
    wx.setNavigationBarTitle({
      title: '获奖者信息'
    })
    common.req({
      url: 'gift/getWinnerInfo',
      data: { 'giftId': parseInt(options.giftId)},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function (res) {
        console.log(res)

      that.setData({
        list: res.data.data
      })
      console.log(res.data.data)
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  // onShareAppMessage: function () {
  
  // }
})
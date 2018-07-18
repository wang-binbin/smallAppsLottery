// pages/addAddress/addAddress.js
const app = getApp()
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    accountName: '',
    address: ''
  },
  accountName: function(e) {
    let that = this
    var val = e.detail.value;
    that.setData({
      accountName: val
    });
  },
  address: function(e) {
    let that = this
    var val = e.detail.value;
    that.setData({
      address: val
    });
  },
  modification: function() {
    let that = this
    if (that.data.accountName != '' && that.data.address != '') {
      common.req({
        url: 'user/createAccount',
        data: {
          "accountName": that.data.accountName,
          "address": that.data.address
        },

        method: 'post',
        success: function(res) {

          if (res.data.status == '0000') {
            wx.navigateBack({
              delta: 1
            })
          }
        },
      })

    } else {
      wx.showToast({
        title: '不能为空！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '我的钱包地址'
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
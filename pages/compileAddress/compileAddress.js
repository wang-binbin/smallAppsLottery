// pages/compileAddress/compileAddress.js
const app = getApp()
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [],
    isdefault: true,
    accountName: '',
    address: ''
  },
  Default: function() {
    var that = this
    that.setData({
      isdefault: !that.data.isdefault
    })
  },
  modification: function() {
    let that = this

    common.req({
      url: 'user/updateAccount',
      data: {
        'accountId': that.data.item.addressid,
        "accountName": that.data.accountName,
        "address": that.data.address,
        "isDefault": "" + that.data.isdefault + "",
      },
      method: 'post',
      success: function(res) {
        wx.navigateBack({
          delta: 1
        })
      },
    })
  },
  Delete: function(e) {
    common.req({
      url: 'user/deleteAccount',
      data: {
        'accountId': e.currentTarget.dataset.id
      },
      method: 'post',
      success: function(res) {
        wx.navigateBack({
          delta: 1
        })
      },
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.setNavigationBarTitle({
      title: '我的钱包地址'
    })

    that.setData({
      item: options
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
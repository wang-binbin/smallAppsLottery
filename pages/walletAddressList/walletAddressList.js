// pages/walletAddressList/walletAddressList.js
const app = getApp()
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    select: false,
    addressid: '',
    giftId: '',
  },
  isdefault: function(index) {//是否默认
    let that = this
    let list = 'list[' + index.currentTarget.dataset.index + '].isdefault'
    let accounId = that.data.list[index.currentTarget.dataset.index].address
    for (var i = 0; i < that.data.list.length; i++) {
      let list = 'list[' + i + '].isdefault'
      that.setData({
        [list]: false
      })
    }
    that.setData({
      [list]: true,
      addressid: accounId
    })

  },
  compileAddress: function(e) {//编辑
    let that = this
    console.log(e)
    wx: wx.navigateTo({
      url: '../compileAddress/compileAddress?addressid=' + e.currentTarget.dataset.addressid.accountId + '&accountName=' + e.currentTarget.dataset.addressid.accountName + '&address=' + e.currentTarget.dataset.addressid.address + '&isDefault=' + e.currentTarget.dataset.addressid.isDefault,
    })
  },
  addAddrName: function() {
    wx: wx.navigateTo({
      url: '../addAddress/addAddress'

    })
  },
  confirm: function() {//确认选中的钱包地址
    let that = this
    console.log(that.data.addressid)
    common.req({
      url: 'user/updateGiftAddress',
      data: {
        'giftId': parseInt(that.data.giftId),
        "address": that.data.addressid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        if (res.data.status == '0000') {
          wx: wx.navigateBack({
            delta: 1
          })
        }
        else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        }
      },
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    if (options.select) {
      that.setData({
        select: true
      })
    }
    if (options.giftId) {
      that.setData({
        giftId: options.giftId
      })
    }
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
    let that = this
    common.req({//请求钱包地址列表
      url: 'user/getAccountList',
      data: '',
      method: 'post',
      success: function(res) {
        console.log(res)
        that.setData({
          list: res.data.data
        })
      },
    })
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
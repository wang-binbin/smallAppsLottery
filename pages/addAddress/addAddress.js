// pages/addAddress/addAddress.js
const app = getApp()
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressToken: null,
    name: null,
    moble: null,
    addressHome: null,
    wayOfGiving:null,
    giftId:null
  },

  addressToken: function(e) {
    let that = this
   
    that.setData({
      addressToken: e.detail.value
    });
  },
  name: function (e) {
    let that = this
   
    that.setData({
      name: e.detail.value
    });
  },
  moble: function (e) {
    let that = this
   
    that.setData({
      moble: e.detail.value
    });
  },
  addressHome: function (e) {
    let that = this
   
    that.setData({
      addressHome: e.detail.value
    });
  },

  modification: function() {
    let that = this

    if (that.data.wayOfGiving==1){
      if (that.data.addressToken != null && that.data.addressToken != '') {
        address(that.data.addressToken)
        
      } else {
        wx.showToast({
          title: '不能为空！',
          icon: 'none',
          duration: 2000
        })
      }
    } else if (that.data.wayOfGiving == 2) {
      if (that.data.name != null && that.data.name != '' && that.data.moble != null && that.data.moble != '' && that.data.addressHome != null && that.data.addressHome != '') {
        address(that.data.name + '|' + that.data.moble + '|' + that.data.addressHome)
        
      } else {
        wx.showToast({
          title: '不能为空！',
          icon: 'none',
          duration: 2000
        })
      }
    } else if (that.data.wayOfGiving == 3) {

      if (that.data.moble != null && that.data.moble != '') {
        address(that.data.moble)
        
      } else {
        wx.showToast({
          title: '不能为空！',
          icon: 'none',
          duration: 2000
        })
      }
    }

    function address(address){
      common.req({
        url: 'user/updateGiftAddress',
        data: {
          "giftId": that.data.giftId,
          "address": address
        },

        method: 'post',
        success: function (res) {
          if (res.data.status == '0000') {
            wx.navigateBack({
              delta: 1
            })
          }
        },
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log(options)
    that.setData({
      wayOfGiving: options.wayOfGiving,
      giftId: options.giftId

    })
    wx.setNavigationBarTitle({
      title: '填写领奖信息'
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
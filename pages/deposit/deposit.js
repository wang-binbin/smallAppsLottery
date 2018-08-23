// pages/deposit/deposit.js

var app = getApp();
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiveBy: null,
    inputNum: null,
    confirm: false
  },
  receiveBy: function(e) {
    let that = this
    that.setData({
      receiveBy: e.detail.value
    })
  },
  inputNum: function(e) {
    let that = this
    that.setData({
      inputNum: e.detail.value
    })
  },
  confirm: function() {
    let that = this
    if (that.data.confirm) {
      return
    }
    that.setData({
      confirm: true
    })
    console.log(that.data.inputNum)
    console.log(that.data.receiveBy)
    if (that.data.inputNum != null && that.data.inputNum != '' && that.data.receiveBy != null && that.data.receiveBy != '') {
      if (Number(that.data.inputNum) > Number(that.data.balance)) {
        wx.showToast({
          title: '提现数量不得大于可提取数量',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          confirm: false
        })
        return
      }
      console.log()
      if (Number(that.data.inputNum) <= 0) {
        wx.showToast({
          title: '提现数量必须大于0',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          confirm: false
        })
        return
      }
      if (isNaN(Number(that.data.inputNum))) {
        wx.showToast({
          title: '提现数量必须是数字',
          icon: 'none',
          duration: 2000
        })
        that.setData({
          confirm: false
        })
        return
      }
      common.req({
        url: 'user/withdrawApply',
        data: {
          "amt": that.data.inputNum,
          "relatedAddress": that.data.receiveBy,
          "tokenSymbol": that.data.symbol,

        },
        dataType: 'json',
        method: 'POST',
        success: function(res) {
          that.setData({
            confirm: true
          })
          console.log(that.data.confirm)
          if (res.data.status = "0000") {
            wx.showToast({
              title: '提现成功，待确认!',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function() {
              that.setData({
                confirm: false
              })
              wx.navigateBack({
                delta: 1
              })
            }, 2000)

          } else {
            that.setData({
              confirm: false
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请填写地址和数量',
        icon: 'none',
        duration: 2000
      })
    }
    that.setData({
      confirm: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    if (options.balance < 0) {
      options.balance = 0
    }
    that.setData({
      balance: options.balance,
      symbol: options.symbol
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

  }
})
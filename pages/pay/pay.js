// pages/pay/pay.js
const app = getApp()
var util = require("../../utils/util.js");
var common = require("../../common.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  pay: function(e) {
    let that=this
    console.log(Number(e.currentTarget.dataset.pice))
    common.req({
      url: 'user/createUnifiedOrder',
      data: {
        "amount": Number(e.currentTarget.dataset.pice)
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        console.log(res.data.data)
        wx.requestPayment({
          'timeStamp': res.data.data.timeStamp,
          'nonceStr': res.data.data.nonceStr,
          'package': res.data.data.package,
          'signType': 'MD5',
          'paySign': res.data.data.paySign,
          'success': function(res) {
            console.log(res)
            wx.redirectTo({
              url: '../addaAdvanced/addAdvanced'
            })
          },
          'fail': function(res) {
            console.log(res)
            wx.showToast({
              title: res.err_desc+',请稍后重试!',
              icon: 'none',
              duration: 2000
            })
          },
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    common.req({
      url: 'user/getRechargeList',
      data: {},
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        console.log(res)
        // for(let i=0;i<res.data.data.length;i++){
          
        //   res.data.data[i].originalPrice = Number(res.data.data[i].originalPrice) / 100
        //   res.data.data[i].discountPrice = Number(res.data.data[i].discountPrice)/100


        // }
        that.setData({
          list: res.data.data
        })

      },
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


})
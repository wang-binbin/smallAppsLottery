// pages/myBalance/myBalance.js
const app = getApp()
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  list:[]
  },
  balanceList:function(e){
    let that=this
    console.log(e.currentTarget.dataset.index)
wx:wx.navigateTo({
  url: '../papersParticulars/papersParticulars?balance=' + that.data.list[e.currentTarget.dataset.index].balance + "&id=" + that.data.list[e.currentTarget.dataset.index].token.id + "&introduction=" + that.data.list[e.currentTarget.dataset.index].token.introduction + "&symbol=" + that.data.list[e.currentTarget.dataset.index].token.symbol + "&picPath=" + that.data.list[e.currentTarget.dataset.index].token.picPath + "&minEnvelopeAmount=" + that.data.list[e.currentTarget.dataset.index].token.minEnvelopeAmount,
})

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    common.req({
      url: 'user/getToken',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function (res) {
        console.log(res)
        for(let i=0;i<res.data.data.length;i++){
          res.data.data[i].balance = Number(res.data.data[i].balance),
            res.data.data[i].token.picPath = app.FILE_URL + res.data.data[i].token.picPath
        }
        that.setData({
          list:res.data.data
        })

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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
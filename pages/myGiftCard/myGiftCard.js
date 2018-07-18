// pages/myGiftCard/myGiftCard.js
const app = getApp()
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    listOpen: []
  },
  particulars: function(e) { //查看详情
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../particulars/particulars?giftId=' + id + "&pageId=0"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '我生成的礼品卡'
    })
    let that = this

  
    common.req({
      url: 'user/getCreatedGifts',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        console.log(res)
        that.setData({
          list: res.data.data.openList,
          listOpen: res.data.data.closedList,
        })
        function setDate(date) {
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
        for (var i = 0; i < that.data.list.length; i++) {
          let str = that.data.list[i].awardTime;
          str = str.replace(/-/g, '/');
          let date = new Date(str);
          let awardTime = setDate(date)
          console.log(awardTime)
          let item = 'list[' + i + '].awardTime'
          that.setData({
            [item]: awardTime
          })
        }
        for (var i = 0; i < that.data.listOpen.length; i++) {
          let str = that.data.listOpen[i].awardTime;
          str = str.replace(/-/g, '/');
          let date = new Date(str);
          let awardTime = setDate(date)
          let item = 'listOpen[' + i + '].awardTime'
          that.setData({
            [item]: awardTime
          })
        }


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
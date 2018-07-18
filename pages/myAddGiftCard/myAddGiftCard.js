// pages/myAddGiftCard/myAddGiftCard.js
const app = getApp()
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wonListWidth: 0,
    wonListHeight: 0,
    // tab切换  
    currentTab: 0,
    closedList: [],
    openList: [],
    wonList: []
  },
  particulars: function(e) {

    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../particulars/particulars?giftId=' + id + "&pageId=0"
    })

  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });

  },
  /** 
   * 点击tab切换 
   */
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    common.req({//请求我的礼品卡列表
      url: 'user/getParticipatedGifts',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {

        for (var i = 0; i < res.data.data.closedList.length; i++) {//给图片加域名
          if (res.data.data.closedList[i].picPath != null) {
            res.data.data.closedList[i].picPath = app.FILE_URL + res.data.data.closedList[i].picPath
          }
        }
        for (var i = 0; i < res.data.data.openList.length; i++) {
          if (res.data.data.openList[i].picPath != null) {
            res.data.data.openList[i].picPath = app.FILE_URL + res.data.data.openList[i].picPath
          }
        }
        for (var i = 0; i < res.data.data.wonList.length; i++) {
          if (res.data.data.wonList[i].picPath != null) {
            res.data.data.wonList[i].picPath = app.FILE_URL + res.data.data.wonList[i].picPath
          }
        }
        that.setData({
          closedList: res.data.data.closedList,
          openList: res.data.data.openList,
          wonList: res.data.data.wonList
        })


        function setDate(date) {//设置时间格式
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
        for (var i = 0; i < that.data.closedList.length; i++) {
          let str = that.data.closedList[i].awardTime;
          str = str.replace(/-/g, '/');
          let date = new Date(str);
          let awardTime = setDate(date)

          let item = 'closedList[' + i + '].awardTime'
          that.setData({
            [item]: awardTime
          })
        }
        for (var i = 0; i < that.data.wonList.length; i++) {
          let str = that.data.wonList[i].awardTime;
          str = str.replace(/-/g, '/');
          let date = new Date(str);
          let awardTime = setDate(date)
          let item = 'wonList[' + i + '].awardTime'
          that.setData({
            [item]: awardTime
          })
        }
        for (var i = 0; i < that.data.openList.length; i++) {
          let str = that.data.openList[i].awardTime;
          str = str.replace(/-/g, '/');
          let date = new Date(str);
          let awardTime = setDate(date)
          let item = 'openList[' + i + '].awardTime'
          that.setData({
            [item]: awardTime
          })
        }

      },
    })


    wx.setNavigationBarTitle({
      title: '我的礼品卡'
    })
    wx.getSystemInfo({

      success: function(res) {

        that.setData({
          wonListWidth: res.windowWidth,
          wonListHeight: res.windowHeight
        });
      }

    });

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
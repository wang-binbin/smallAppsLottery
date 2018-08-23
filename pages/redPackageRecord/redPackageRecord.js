// pages/redPackageRecord/redPackageRecord.js
var app = getApp();
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sentList: {},
    receivedList: {},
    wonListWidth: 0,
    wonListHeight: 0,
    // tab切换  
    currentTab: 0,
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
  robRedPackage:function(e){
    let that=this
    console.log()
wx:wx.navigateTo({
  url: '../robRedPackage/robRedPackage?envelopeId=' + e.currentTarget.dataset.id +"&gohome=true",

})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          wonListWidth: res.windowWidth,
          wonListHeight: res.windowHeight
        });
      }

    });
    common.req({
      url: 'user/getRedEnvelopeRecords',
      data: {
        "page":0
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        console.log(res)
        for (let i = 0; i < res.data.data.receivedList.content.length; i++) {
          res.data.data.receivedList.content[i].snatchedAmount = parseFloat(res.data.data.receivedList.content[i].snatchedAmount)
        }
        for (let i = 0; i < res.data.data.sentList.content.length; i++) {
          res.data.data.sentList.content[i].tokenTotal = parseFloat(res.data.data.sentList.content[i].tokenTotal)
        }
        that.setData({
          sentList: res.data.data.sentList,
          receivedList: res.data.data.receivedList,
        })
      }
    })
  },
  redPackage: function(e) {
    console.log(e.currentTarget.dataset)
    let that = this
    wx: wx.navigateTo({
      url: '../robRedPackage/robRedPackage?envelopeId=' + e.currentTarget.dataset.id + "&redPackage=" + e.currentTarget.dataset.redpackage,
    })

  },
  moreData: function () {
    let that = this;
    let page;
    let listType;
    if (that.data.currentTab == 0) {
      page = that.data.receivedList.number
      listType = 'receivedList'
      if (that.data.receivedList.last) {
        return
      }
    } else if (that.data.currentTab == 1) {
      page = that.data.sentList.number
      listType = 'sentList'
      if (that.data.sentList.last) {
        return
      }
    } 
    wx.showLoading({
      title: '玩命加载中...',
    })
    // 页数+1
    common.req({
      url: 'user/getRedEnvelopeRecords',
      data: {
        "page": parseInt(page) + 1,
        "listType": listType
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.data.sentList != null) {
          for (let i = 0; i < res.data.data.sentList.content.length; i++) {
            res.data.data.sentList.content[i].picPath = app.FILE_URL + res.data.data.sentList.content[i].picPath
            that.data.sentList.content.push(res.data.data.sentList.content[i])
            res.data.data.sentList.content[i].tokenTotal = parseFloat(res.data.data.sentList.content[i].tokenTotal)
          }
          res.data.data.sentList.content = that.data.sentList.content
          that.setData({
            sentList: res.data.data.sentList
          })
        } else if (res.data.data.receivedList != null) {
          for (let i = 0; i < res.data.data.receivedList.content.length; i++) {
            res.data.data.receivedList.content[i].picPath = app.FILE_URL + res.data.data.receivedList.content[i].picPath
            res.data.data.receivedList.content[i].snatchedAmount = parseFloat(res.data.data.receivedList.content[i].snatchedAmount)
            that.data.receivedList.content.push(res.data.data.receivedList.content[i])
          }
          res.data.data.receivedList.content = that.data.receivedList.content
          that.setData({
            receivedList: res.data.data.receivedList
          })
        } 
        wx.hideLoading()
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

})
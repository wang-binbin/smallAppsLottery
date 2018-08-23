// pages/robRedPackage/robRedPackage.js
var app = getApp();
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rob: [],
    lastData: true,
    user: false,
    userInfo: null,
    robRedPackage:true,
    gohome: false,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getUserInfo: function(e) { //获取头像昵称
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.errMsg == 'getUserInfo:ok') {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      common.uploadInfo(e.detail.userInfo.nickName, e.detail.userInfo.avatarUrl)
    }
  },
  gohome: function() {
    wx.switchTab({
      url: '../home/home'
    })
  },
  rob: function() {
    let that = this
    if(!that.data.robRedPackage){
return
    }
    that.setData({
      robRedPackage:false
    })
    wx.showLoading({
      title: '正在打开红包',
    })
    common.req({
      url: 'user/snatchRedEnvelope',
      data: {
        "envelopeId": that.data.envelopeId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        console.log(res.data.status)

          common.req({
            url: 'envelope/getRedEnvelopeDetail',
            data: {
              "envelopeId": that.data.envelopeId
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            method: 'POST',
            success: function(res) {
              wx.hideLoading()
              res.data.data.redEnvelope.tokenTotal = Number(res.data.data.redEnvelope.tokenTotal)
              res.data.data.snatchedAmount = Number(res.data.data.snatchedAmount)
              for (let i = 0; i < res.data.data.snatchedList.content.length; i++) {
                res.data.data.snatchedList.content[i].amount = Number(res.data.data.snatchedList.content[i].amount)
              }
              that.setData({
                rob: res.data.data
              })
   
            }
          })
        
      },
        complete: function () {
  
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let that = this
    that.setData({
      envelopeId: options.envelopeId
    })
    if (!options.gohome) {
      that.setData({
        gohome: true,

      })
    }

    if (app.globalData.userInfo) { //在app页面获取userInfo信息
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })

    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res)
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })

        }
      })
    }
    common.req({
      url: 'envelope/getRedEnvelopeDetail',
      data: {
        "envelopeId": options.envelopeId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        res.data.data.redEnvelope.tokenTotal = Number(res.data.data.redEnvelope.tokenTotal)
        res.data.data.snatchedAmount = Number(res.data.data.snatchedAmount)
        for (let i = 0; i < res.data.data.snatchedList.content.length; i++) {
          res.data.data.snatchedList.content[i].amount = Number(res.data.data.snatchedList.content[i].amount)
        }
        try {
          var value = wx.getStorageSync('userId')
          if (value) {
            app.globalData.userId = value
          }
        } catch (e) {

        }
        
        if (app.globalData.userId == res.data.data.createrInfo.id) {
          that.setData({
            user: true
          })
        }
        that.setData({
          rob: res.data.data
        })
        console.log(that.data.rob.redEnvelope.status == "0000" && that.data.user && !that.data.gohome && that.data.rob.isParticipated == "true")
      }
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
    let that = this

    if (!that.data.rob.snatchedList.last) {
      if (!that.data.lastData) {
        return
      }
      wx.showLoading({
        title: '加载中',
      })
      that.setData({
        lastData: false
      })
      common.req({
        url: 'envelope/getRedEnvelopeParticipantInfoList',
        data: {
          "envelopeId": that.data.rob.redEnvelope.id,
          "page": Number(that.data.rob.snatchedList.number) + 1
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        dataType: 'json',
        method: 'POST',
        success: function(res) {
          for (let i = 0; i < res.data.data.content.length; i++) {
            res.data.data.content[i].amount = Number(res.data.data.content[i].amount)
            that.data.rob.snatchedList.content.push(res.data.data.content[i])
          }
          res.data.data.content = that.data.rob.snatchedList.content
          let rob = 'rob.snatchedList'
          that.setData({
            [rob]: res.data.data
          })
          that.setData({
            lastData: true
          })

        },
        fail: function() {
          that.setData({
            lastData: true
          })
        },

        complete: function() {
          wx.hideLoading()
        },
      })
    }
  },
  shear: function() {
    wx: wx.navigateTo({
      url: '../redPackagePhoto/redPackagePhoto?envelopeId=' + this.data.rob.redEnvelope.id,
    })
  },
  /**
   * 用户点击右上角分享
   */

})
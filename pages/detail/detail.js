// pages/detail/detail.js
const app = getApp()
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    lastData:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    
    that.setData({
      options: options
    })
    
    common.req({
      url: 'user/tokenFlow',
      data: {
        'page': 0,
        "tokenSymbol": options.tokenSymbol
      },
      method: 'post',
      success: function(res) {
        console.log(res)
        for (let i = 0; i < res.data.data.content.length; i++) {
          res.data.data.content[i].amount = Number(res.data.data.content[i].amount)
        }
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
let that=this
    if (!that.data.list.last) {
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
        url: 'user/tokenFlow',
        data: {
          'page': Number(that.data.list.number)+1,
          "tokenSymbol": that.data.options.tokenSymbol
        },
        method: 'post',
        success: function (res) {
          
          for (let i = 0; i < res.data.data.content.length; i++) {
            res.data.data.content[i].amount = Number(res.data.data.content[i].amount)
            that.data.list.content.push(res.data.data.content[i])
          }
          res.data.data.content = that.data.list.content
          that.setData({
            list: res.data.data
          })
          that.setData({
            lastData: true
          })
          console.log(res)

        },
        fail: function () {
          that.setData({
            lastData: true
          })
        },

        complete: function () {
          wx.hideLoading()
        },
      })
    }

  },


})
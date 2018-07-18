// pages/skip/skip.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      "id":"",
      "tabIndex":'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.setNavigationBarTitle({
      title: ''
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
    var that = this;
    // console.log(that.data.id)
    wx.getStorage({
      key: 'tabIndex',
      success: function (res) {
        that.setData({
          tabIndex: res.data
      })
        if (that.data.id == '1') {
          if (that.data.tabIndex=='0'){//检测上层页面
            wx.switchTab({
              url: '../home/home',
            })
          } else if (that.data.tabIndex == '2') {
            wx.switchTab({
              url: '../user/user',
            })
          }
         
          setTimeout(function () {
            that.setData({
              id: ''
            })
          }, 500)

        } else {
          wx.navigateTo({
            url: '../add/add',
          })
        }
      }
    })
    

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
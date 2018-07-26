// pages/sponsor/sponsor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  preview: function() { //预览图片
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: ["https://maggie-public.oss-cn-beijing.aliyuncs.com/littleApps/maggie.png"] // 需要预览的图片http链接列表
    })
  },
  copy: function(event) { //复制
    wx.setClipboardData({
      data: 'maggiekf01',
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '成为赞助商'
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
    wx.stopPullDownRefresh() //停止下拉刷新

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})
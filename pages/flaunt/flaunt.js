// pages/flaunt/flaunt.js

const app = getApp()
var common = require("../../common.js");
var tempFilePath;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    // smallProgramCodePath:null,
    canvasHidden: true, //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
    avatarUrl: null, //用户头像
    nickName: '', //用户昵称
    shareImgPath: null,//分享路径
    screenWidth: null, //设备屏幕宽度
    FilePath: '',//本地路径
    giftPhoto: null,//礼品卡图片路径
    save: true,
    item: {},
  },

  saveImageToPhotosAlbum: function () {
    wx.showLoading({
      title: '保存中...',
    })
    var that = this;
    setTimeout(function () {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.shareImgPath,
        //保存成功失败之后，都要隐藏画板，否则影响界面显示。
        success: (res) => {
          // console.log(res)
          wx.hideLoading()
        },
        fail: (err) => {
          wx.hideLoading()
        }
      })
    }, 500)
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '生成分享图片'
    })
    var that = this

    that.setData({
      lock: true,
      userInfo: app.globalData.userInfo
    })
    // options.giftId
    common.req({
      url: 'gift/getGiftDetail',
      data: {
        'giftId': options.giftId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function (res) {
   
          res.data.data.giftCard.picPath = app.FILE_URL + res.data.data.giftCard.picPath
        that.setData({
          item: res.data.data
        })
        wx.downloadFile({ //把图片下载下来
          url: that.data.item.giftCard.picPath,
          success: function (res) {
            if (res.statusCode === 200) {
              that.setData({
                giftPhoto: res.tempFilePath
              })
            }
          }
        }) 
       

        wx.downloadFile({
          url: 'https://giftcard-test.maggie.vip/giftCard/cover/2018-07-18-11/ogCeW5DhUTKOvEDYEwx9M5eOahfQ/1531885203309.jpg',
          success: function (res) {
            if (res.statusCode === 200) {
              that.setData({
                smallProgramCodePath: res.tempFilePath
              })
            }
          }
        })
       
        wx.downloadFile({ //把图片下载下来
          url: that.data.userInfo.avatarUrl,
          success: function (res) {
            if (res.statusCode === 200) {
              that.setData({
                avatarUrl: res.tempFilePath
              })
            }
          }
        })
      },
      complete: function (res) {
        that.setData({
          lock: false
        })
      },
    })



    wx.showLoading({
      title: '图片绘制中',
    })
   


    //获取用户设备信息，屏幕宽度
    wx.getSystemInfo({
      success: res => {
        that.setData({
          screenWidth: res.screenWidth
        })
      }
    })




  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this

    var count = 0;
    var interval = setInterval(function () {

      if (!(that.data.screenWidth && that.data.giftPhoto && that.data.avatarUrl && that.data.smallProgramCodePath) && ++count < 5) {//检测图片是否下载完成
        return;
      } else {//完成清除计时器
        clearInterval(interval);
      }
      let str;
      if (!(/^[a-zA-Z]*$/.test(that.data.item.giftCard.name))) {
        if (that.data.item.giftCard.name.length >= 10) {
          if (!(/^[\u4e00-\u9fa5]*$/.test(that.data.item.giftCard.name.substring(0, 10)))) {
            str = that.data.item.giftCard.name.substring(0, 10) + '...'
          } else if (/^[\u4e00-\u9fa5]*$/.test(that.data.item.giftCard.name.substring(0, 10))) {
            str = that.data.item.giftCard.name.substring(0, 8) + '...'
          }
        } else {
          str = that.data.item.giftCard.name
        }
      } else if (/^[a-zA-Z]*$/.test(that.data.item.giftCard.name)) {
        if (that.data.item.giftCard.name.length >= 15) {
          str = that.data.item.giftCard.name.substring(0, 15) + '...'
        } else {
          str = that.data.item.giftCard.name
        }

      }
      that.setData({
        save: false
      })
      wx.hideLoading()
      var giftPhoto = that.data.giftPhoto
      if (giftPhoto == null) {
        giftPhoto = ' ../../images/default.png'
      }
      var avatarUrl = that.data.avatarUrl == null ? '../../images/defaultUrl.png' : that.data.avatarUrl
      //设置画板显示，才能开始绘图
      that.setData({
        canvasHidden: false
      })
      let num = that.data.item.winnerCount / that.data.item.participantCount
      let percentage=num.toFixed(2) * 100 + '%'
      var unit = that.data.screenWidth / 375
      var path1 = "../../images/Group.png" //底部图片
      var avatarurl_width = 50; //绘制的头像宽度
      var avatarurl_heigth = 50; //绘制的头像高度
      var avatarurl_x = unit * 375 / 2 - 25; //绘制的头像在画布上的位置
      var avatarurl_y = 34; //绘制的头像在画布上的位置
      var nickName = that.data.userInfo.nickName
      var nickName1 = '我在通证礼品卡中奖了：' + str;
      // var prize = '奖品:' + that.data.item.giftCard.name + '×' + that.data.item.giftCard.amount + "份"
      // var prizeIfon = that.data.item.giftCard.awardTime + '  自动开奖'
      var context = wx.createCanvasContext('share')
      context.save();
      var description = that.data.description
      var wxappName = "长按识别小程序，来「通证礼品卡 」试试手气"
      context.drawImage(path1, unit * 15, unit * 15, unit * 345, unit * 524)
      context.setFontSize(15) //设置nickname
      context.setFillStyle("#fff")
      context.setTextAlign('center')
      context.fillText(nickName, unit * 375 / 2, unit * 105)
      context.setFontSize(16) //设置文字
      context.setFillStyle("#FFF2BC")
      context.setTextAlign('center')
      context.fillText(nickName1, unit * 375 / 2, unit * 131)
      context.rect(unit * 40, unit * 170, unit * 296, unit * 200)
      context.setShadow(1, 1, 10, '#e5e5e5')
      context.setFillStyle('#fff')
      context.fill()
      context.setShadow(0, 0, 0, '#fff')
      context.drawImage(giftPhoto, unit * 40, unit * 170, unit * 296, unit * 140)
      context.setFontSize(17) //设置奖品
      context.setFillStyle("#444")
      context.setTextAlign('left')
      context.drawImage('../../images/people.png', unit * 60, unit * 335, unit * 15, unit * 15)
      context.setFillStyle("#939393")
      context.setFontSize(13)
      context.fillText('参与人数  ' + that.data.item.participantCount, unit * 80, unit * 348,)
      // context.drawImage('../../images/probability.png', unit * 220, unit * 335, unit * 15, unit * 15)
      // context.setFillStyle("#939393")
      // context.setFontSize(13)
   
      // context.fillText('中奖率  ' + percentage , unit * 240, unit * 348, )
      context.drawImage(that.data.smallProgramCodePath, unit * (375 - 89) / 2, unit * 390, unit * 89, unit * 89)//小程序吗
      context.setTextAlign('center')
      context.setFontSize(13)
      context.fillText(wxappName, unit * 375 / 2, unit * 513)
      context.setFillStyle("#9f9f9f")
      context.setFontSize(13)
      context.setTextAlign('center')
      context.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);//切圆形图
      context.clip();
      context.drawImage(avatarUrl, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
      context.draw(false, function () {
        wx.canvasToTempFilePath({//将图片绘制
          x: 0,
          y: 0,
          width: unit * 375,
          height: unit * 540,
          destWidth: unit * 375 * 10,
          destHeight: unit * 540 * 10,
          quality: 1,
          canvasId: 'share',
          success: function (res) {

            that.setData({
              shareImgPath: res.tempFilePath
            })
            if (!res.tempFilePath) {
              wx.showModal({
                title: '提示',
                content: '图片绘制中，请稍后重试',
                showCancel: false
              })
            }
          }
        })
      })
    }, 1000)
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
    wx.stopPullDownRefresh() //停止下拉刷新

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})
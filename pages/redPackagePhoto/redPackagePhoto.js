// pages/redPackagePhoto/redPackagePhoto.js
// pages/producePhoto/producePhoto.js
const app = getApp()
var common = require("../../common.js");
var tempFilePath;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    openSetting: true,
    canvasHidden: true, //设置画板的显示与隐藏，画板不隐藏会影响页面正常显示
    avatarUrl: null, //用户头像
    nickName: null, //用户昵称
    shareImgPath: null, //分享路径
    screenWidth: null, //设备屏幕宽度
    FilePath: '', //本地路径
    giftPhoto: null, //礼品卡图片路径
    save: true,
    smallProgramCodePath:'',
    item: {}, 
  },

  saveImageToPhotosAlbum: function() {
    wx.showLoading({
      title: '保存中...',
    })
    var that = this;
    setTimeout(function() {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.shareImgPath,
        //保存成功失败之后，都要隐藏画板，否则影响界面显示。
        success: (res) => {
          console.log(res)
          wx.hideLoading()
        },
        fail: (err) => {

          if (err.errMsg == "saveImageToPhotosAlbum:fail auth deny") {
            that.setData({
              openSetting: false
            })

          }
          wx.hideLoading()
        }
      })
    }, 500)
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '生成成功'
    })
    var that = this
    that.setData({
      lock: true
    })
console.log(options)
    common.req({
      url: 'envelope/getRedEnvelopeDetail',
      data: {
        'envelopeId': options.envelopeId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {

        that.setData({
          item: res.data.data
        })

        wx.downloadFile({
          url: app.FILE_URL + that.data.item.redEnvelope.smallProgramCodePath,
          success: function(res) { //如果有小程序吗就下载
            if (res.statusCode === 200) {
              console.log(res.tempFilePath)
              that.setData({
                smallProgramCodePath: res.tempFilePath
              })
            } else { //没有用默认的
              wx.downloadFile({
                url: 'https://giftcard-test.maggie.vip/giftCard/cover/2018-07-18-11/ogCeW5DhUTKOvEDYEwx9M5eOahfQ/1531885203309.jpg',
                success: function(res) {
                  if (res.statusCode === 200) {
                    that.setData({
                      smallProgramCodePath: res.tempFilePath
                    })
                  }
                }
              })
            }

          },
          fail: function(res) {
            console.log(res)
          }
        })
        wx.downloadFile({ //把头像下载下来
          url: that.data.item.createrInfo.avatarUrl,
          success: function(res) {
            if (res.statusCode === 200) {
              that.setData({
                avatarUrl: res.tempFilePath
              })
            }
            // console.log(res.tempFilePath)
          }
        })
      },
      complete: function(res) {
        that.setData({
          lock: false
        })
      },
    })



    wx.showLoading({
      title: '图片绘制中',
    })

    that.setData({
      userInfo: app.globalData.userInfo
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
  onShow: function() {
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: (res) => {},
            fail() { //这里是用户拒绝授权后的回调
              that.setData({
                openSetting: false
              })
            }
          })
        } else { //用户已经授权过了
          that.setData({
            openSetting: true
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this

    var count = 0;
    var interval = setInterval(function() {

      if (!(that.data.screenWidth && that.data.avatarUrl && that.data.smallProgramCodePath) && ++count < 5) { //检测图片是否下载完成
        return;
      } else { //完成清除计时器
        clearInterval(interval);
      }
      that.setData({
        save: false
      })
      wx.hideLoading()

      var avatarUrl = that.data.avatarUrl == null ? '../../images/defaultUrl.png' : that.data.avatarUrl

      //设置画板显示，才能开始绘图
      that.setData({
        canvasHidden: false
      })
      var unit = that.data.screenWidth / 375
      // var unit=1;
      let path1 = "../../images/redPackagePhoto.png" //底部图片
      let avatarurl_width = 50; //绘制的头像宽度
      let avatarurl_heigth = 50; //绘制的头像高度
      let avatarurl_x = unit * 375 / 2 - 25; //绘制的头像在画布上的位置
      let avatarurl_y = 70; //绘制的头像在画布上的位置
      let nickName = that.data.item.createrInfo.nickName
      let nickName1 = '发送了' + that.data.item.redEnvelope.envelopeNumber + '份' + that.data.item.redEnvelope.tokenSymbol + '红包';
      let context = wx.createCanvasContext('share')
      context.save();
      let description = that.data.item.redEnvelope.message
      context.drawImage(path1, unit * 15, unit * 15, unit * 345, unit * 524)
      context.setFontSize(15) //设置nickname
      context.setFillStyle("#FFF2BC")
      context.setTextAlign('center')
      context.fillText(nickName, unit * 375 / 2, unit * 140)
      context.setFontSize(16) //设置文字
      context.setFillStyle("#FFF2BC")
      context.setTextAlign('center')
      context.fillText(nickName1, unit * 375 / 2, unit * 180)
      context.setFontSize(22) //设置文字
      context.setFillStyle("#FFF2BC")
      context.setTextAlign('center')
      context.fillText(description, unit * 375 / 2, unit * 250)
      context.beginPath()
      context.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
      context.arc(unit * 85 / 2 + unit * (375 - 85) / 2, unit * 85 / 2 + unit * 316, unit * 85 / 2, 0, Math.PI * 2,false);
      context.clip();
      context.drawImage(avatarUrl, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth);
      context.drawImage(that.data.smallProgramCodePath, unit * (375 - 85) / 2, unit * 316, unit * 85, unit * 85);
      context.restore();
      context.draw(false, function() {
        wx.canvasToTempFilePath({ //将图片绘制
          x: 0,
          y: 0,
          width: unit * 375,
          height: unit * 540,
          destWidth: unit * 375 * 10,
          destHeight: unit * 540 * 10,
          quality: 1,
          canvasId: 'share',
          success: function(res) {

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
   * 用户点击右上角分享
   */
  // that.data.item.createrInfo.nickName + '准备了' + that.data.item.redEnvelope.envelopeNumber + '份' + that.data.item.redEnvelope.tokenSymbol + '的红包，大家快来抢.'
  onShareAppMessage: function() {
    try {
      var value = wx.getStorageSync('userId')
      if (value) {
        app.globalData.userId = value
      }
    } catch (e) {

    }

    var that = this

    return {
      title: that.data.item.createrInfo.nickName + '准备了' + that.data.item.redEnvelope.envelopeNumber + '份' + that.data.item.redEnvelope.tokenSymbol + '的红包，大家快来抢.',
      path: '/pages/robRedPackage/robRedPackage?envelopeId=' + that.data.item.redEnvelope.id + "&invitorId=" + (app.globalData.userId || '')
    }
  }

})
//app.js
var util = require("utils/util.js");

App({

  onLaunch: function (options) {
// console.log(options)
    let that=this
    this.globalData.scene = options.scene
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.login({
      success: res=>{
        // console.log(res.code)
        wx.getSetting({
          success: settingRes => {
           
            if (settingRes.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: infoRes => {
                  // 可以将 res 发送给后台解码出 unionId
                  that.globalData.userInfo = infoRes.userInfo
                  
                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
            
                  if (that.userInfoReadyCallback) {
                    that.userInfoReadyCallback(infoRes)
                  }
                }
              })
            }
          }
        })
      }
    })
  },
  
  REQ_URL: 'https://service.maggie.vip/giftcard/api/',
  FILE_URL :"https://giftcard-prod-bucket.maggie.vip/",
// FILE_URL :'https://maggie-public.oss-cn-beijing.aliyuncs.com/',
  globalData: {
    userInfo: null,
    appId: null,
    isLogon: false,
    scene:null,
    invitorId:null,
    userId:null,
  },
  state:{
    loginLock:false
  }
})
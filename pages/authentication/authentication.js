// pages/authentication/authentication.js
var app = getApp();
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    idCardA: 'https://maggie-public.oss-cn-beijing.aliyuncs.com/littleApps/idCardA.png',
    idCardJ: 'https://maggie-public.oss-cn-beijing.aliyuncs.com/littleApps/idCardJ.png',
    photographA: true,
    photographJ: true,
    idcard:null,
    lock:false,
    realName:null,
    isPass:null,
  },
  idCardA: function() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0]
        common.req({
          url: 'user/uploadUserCard',
          data: {},
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          dataType: 'json',
          method: 'POST',
          success: function(uploadGiftCardCoverRes) {
            console.log(uploadGiftCardCoverRes)
            var filename = new Date().getTime() + util.getSuffix(tempFilePath);
            var formdata = {};
            // 注意formdata里append添加的键的大小写
            formdata.key = uploadGiftCardCoverRes.data.data.dir + filename;   //存储在oss的文件路径
            formdata.policy = uploadGiftCardCoverRes.data.data.policy;   //policy
            formdata.OSSAccessKeyId = uploadGiftCardCoverRes.data.data.accessId;   //accessKeyId
            formdata.success_action_status = "200";   //成功后返回的操作码
            formdata.Signature = uploadGiftCardCoverRes.data.data.signature;    //签名
            formdata['x-oss-security-token'] = uploadGiftCardCoverRes.data.data.securityToken;

       
            wx: wx.uploadFile({
              url: app.FILE_URL,
              filePath: tempFilePath,
              name: 'file',
              formData: formdata,
              success: function(uploadFileRes) {
                console.log(uploadFileRes)
                that.setData({
                  idCardA: app.FILE_URL + formdata.key,
                  photographA: false
                })
              },
            })
           
          },
        })
      
      }
    })
  },
  idCardJ: function() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0]
        common.req({
          url: 'user/uploadUserCard',
          data: {},
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          dataType: 'json',
          method: 'POST',
          success: function(uploadGiftCardCoverRes) {
            console.log(uploadGiftCardCoverRes)
            var filename = new Date().getTime() + util.getSuffix(tempFilePath);
            var formdata = {};
            // 注意formdata里append添加的键的大小写
            formdata.key = uploadGiftCardCoverRes.data.data.dir + filename;   //存储在oss的文件路径
            formdata.policy = uploadGiftCardCoverRes.data.data.policy;   //policy
            formdata.OSSAccessKeyId = uploadGiftCardCoverRes.data.data.accessId;   //accessKeyId
            formdata.success_action_status = "200";   //成功后返回的操作码
            formdata.Signature = uploadGiftCardCoverRes.data.data.signature;    //签名
            formdata['x-oss-security-token'] = uploadGiftCardCoverRes.data.data.securityToken;
            console.log(that.data.picKey)
            wx: wx.uploadFile({
              url: app.FILE_URL,
              filePath: tempFilePath,
              name: 'file',
              formData: formdata,
              success: function(uploadFileRes) {
                console.log(uploadFileRes)
                that.setData({
                  idCardJ: app.FILE_URL + formdata.key,
                  photographJ: false
                })
              },
            })
     
          },
        })
    
      }
    })
  },
  sub: function() {
    let that = this
    if (that.data.lock){
return
    }
that.setData({
  lock:true
})
    if (that.data.realName != null && that.data.idcard != null && that.data.realName != '' && that.data.idcard != ''){
      if (that.data.idCardJ == 'https://maggie-public.oss-cn-beijing.aliyuncs.com/littleApps/idCardJ.png' || that.data.idCardA =='https://maggie-public.oss-cn-beijing.aliyuncs.com/littleApps/idCardA.png'){
        wx.showToast({
          title: '请添加身份证图片',
          icon: 'none',
          duration: 2000
        })
         that.setData({
          lock: false
        })
      return
      }
    common.req({
      url: 'user/submitRealnameAudit',
      data: {
        "realName": that.data.realName,
        "cardNum": that.data.idcard,
        "cardFront": that.data.idCardJ,
        "cardBack": that.data.idCardA,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.setData({
          lock: false
        })
        if (res.data.status == '0000') {
          common.req({
            url: 'user/getIDCardIsCertification',
            data: {},
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            dataType: 'json',
            method: 'POST',
            success: function (res) {
              console.log(res)
              that.setData({
                isPass: res.data.data.isPass
              })
            },
       
          })

        }
      }  ,   fail: function () {
        that.setData({
          lock: false
        })
      }
    })
    }else{
      wx.showToast({
        title: '不能为空',
        icon: 'none',
        duration: 2000
      })
    }
    that.setData({
      lock: false
    })
  },
  idcard: function(e) {
    let that = this
    that.setData({
      idcard: e.detail.value
    })
  },
  name: function(e) {
    let that = this
    that.setData({
      realName: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
let that=this
    common.req({
      url: 'user/getIDCardIsCertification',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function (res) {
        console.log(res)
       that.setData({
         isPass: res.data.data.isPass
       })
      }
    })
  },
  again:function(){
this.setData({
  isPass:null
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
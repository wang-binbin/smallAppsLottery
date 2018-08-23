// pages/editor/editor.js
const app = getApp()
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isOpen: true,
    commonValue: null,
  },
  copyTitle: function(e) {
    let that = this
    let title = 'list[' + e.currentTarget.dataset.index + '].title'
    that.setData({
      [title]: e.detail.value
    })
    console.log(that.data.list)
  },
  addCopy: function(e) {
    let that = this

    if (that.data.list.length == 0) {
      that.data.list.unshift({
        "type": "copy",
        "title": '点此填写引导文案',
        "value": "点此填写需要被复制的内容"
      })
      that.setData({
        list: that.data.list,
        isOpen: true
      })
    } else if (that.data.list.length != 0) {
      if (that.data.list[0].type == "copy") {
        return
      } else {
        that.data.list.unshift({
          "type": "copy",
          "title": '点此填写引导文案',
          "value": "点此填写需要被复制的内容"
        })
        that.setData({
          list: that.data.list,
          isOpen: true
        })
      }
    }
  },
  copyCon: function(e) {
    let that = this
    let value = 'list[' + e.currentTarget.dataset.index + '].value'
    that.setData({
      [value]: e.detail.value
    })
    console.log(that.data.list)
  },
  isOpen: function() {
    this.setData({
      isOpen: !this.data.isOpen
    })
  },
  closeImg: function(e) {
    let that = this
    that.data.list.splice(e.currentTarget.dataset.index, 1)
    that.setData({
      list: that.data.list
    })
  },
  commonValue: function(e) {
    let that = this
    that.setData({
      commonValue: e.detail.value
    })

  },
  bindTextAreaBlur: function(e) {
    let that = this
    let value = 'list[' + e.currentTarget.dataset.index + '].value'
    that.setData({
      [value]: e.detail.value
    })
    if (e.detail.value == '') {
      that.data.list.splice(e.currentTarget.dataset.index, 1)
      that.setData({
        list: that.data.list
      })
    }
  },
  addImg: function(e) {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        console.log(that.data.commonValue)
        if (that.data.commonValue != '' && that.data.commonValue != null) {
          that.data.list.push({
            "type": "text",
            "value": that.data.commonValue
          })
          that.setData({
            commonValue: null
          })
        }
        that.data.list.push({
          "type": "img",
          "src": res.tempFilePaths[0],
          "isUpload": false
        })
        that.setData({
          list: that.data.list,
          isOpen: true
        })

      }
    })
  },
  over: function() {
    let that = this
    if (that.data.commonValue != '' && that.data.commonValue != null) {
      that.data.list.push({
        "type": "text",
        "value": that.data.commonValue
      })
      that.setData({
        commonValue: null,
        list: that.data.list
      })
    }
    common.req({
      url: 'gift/uploadGiftCardCover',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(uploadGiftCardCoverRes) {
        // for (let i = 0; i < that.data.list.length; i++) {
        upLoad(0)
        function upLoad(i) {
          if (that.data.list[i].type == 'img') {
            if (that.data.list[i].isUpload) {
              // continue;
              let j = i + 1;
              console.log(that.data.list)

              if (that.data.list[i].src.substring(0, 4)=='http') {
                that.data.list[i].src = that.data.list[i].src.substring(33)
                console.log(that.data.list[i].src)
             
              }
              if (j < that.data.list.length) {
                upLoad(j)
              } else if (j == that.data.list.length) {
                app.globalData.introduction = encodeURIComponent(JSON.stringify(that.data.list))
                wx.navigateBack({
                  delta: 1
                })
              }
            } else {
              var filename = new Date().getTime() + util.getSuffix(that.data.list[i].src);
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
                filePath: that.data.list[i].src,
                name: 'file',
                formData: formdata,
                success: function(uploadFileRes) {
                  console.log(uploadFileRes)
                  that.data.list[i].src = formdata.key
                  that.data.list[i].isUpload = true
                  let j = i + 1;
                  console.log(that.data.list)
                  if (j < that.data.list.length) {
                    upLoad(j)
                  } else if (j == that.data.list.length) {
                    app.globalData.introduction = encodeURIComponent(JSON.stringify(that.data.list))
                    console.log(app.globalData.introduction)
                    wx.navigateBack({
                      delta: 1
                    })

                  }

                },
                fail: function() {
                  wx.showToast({
                    title: '上传失败!!请稍后重试!',
                    icon: 'none',
                    duration: 2000
                  })
                }
              })
            }

          } else {
            let j = i + 1;
            console.log(that.data.list)
            if (j < that.data.list.length) {
              upLoad(j)
            } else if (j == that.data.list.length) {

              app.globalData.introduction = encodeURIComponent(JSON.stringify(that.data.list))
              console.log(app.globalData.introduction)
              wx.navigateBack({
                delta: 1
              })
            }
          }
        }

        // }
      },
    })


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    
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
    console.log(JSON.parse(decodeURIComponent(app.globalData.introduction)))
    if (app.globalData.introduction != null && app.globalData.introduction!=''){
      let newArraya = JSON.parse(decodeURIComponent(app.globalData.introduction))
      for(let i=0;i<newArraya.length;i++){
        if (newArraya[i].type=='img'){
          newArraya[i].src = app.FILE_URL + newArraya[i].src
          }
      }
      this.setData({
        list: newArraya
      })
    }
 
    console.log(this.data.list)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

})
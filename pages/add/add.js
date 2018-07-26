// pages/add/add.js
//获取应用实例
var app = getApp();
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lock: false,
    byte: false,
    bytenumber: false,
    newDate: false,
    pickDate: '',
    name: '',
    amount: '',
    picKey: 'giftCard/cover/default.png',
    src: 'https://maggie-public.oss-cn-beijing.aliyuncs.com/littleApps/583594514074129397.png',
    index: 0,
    pageback: false,
    multiArray: [ //时间选择器
      ['', ''],
      ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
      ['00', '30']
    ],
    multiIndex: [0, 0, 0], //展示时间
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  getUserInfo: function (e) {
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
  inputchange: function (event) { //输入奖品名称时判断字节
    var that = this;
    var str = event.detail.value;
    var bytes = new Array();
    var len, c;
    len = str.length;
    for (var i = 0; i < len; i++) {
      c = str.charCodeAt(i);
      if (c >= 0x010000 && c <= 0x10FFFF) {
        bytes.push(((c >> 18) & 0x07) | 0xF0);
        bytes.push(((c >> 12) & 0x3F) | 0x80);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        bytes.push(((c >> 12) & 0x0F) | 0xE0);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        bytes.push(((c >> 6) & 0x1F) | 0xC0);
        bytes.push((c & 0x3F) | 0x80);
      } else {
        bytes.push(c & 0xFF);
      }
      if (bytes.length >= 24) {

        that.setData({
          byte: true
        })
      } else if (bytes.length < 24) {

        that.setData({
          byte: false
        })
      }
    }
    that.setData({
      name: event.detail.value.replace(/\s+/g, '')
    })
  },
  numberchange: function (event) { //输入数量判断
    var that = this;
    that.setData({
      amount: event.detail.value.replace(/\s+/g, '')
    })
  },
  cehngePhoto: function () {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePath = res.tempFilePaths[0]
        common.req({
          url: 'gift/uploadGiftCardCover',
          data: {},
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          dataType: 'json',
          method: 'POST',
          success: function (uploadGiftCardCoverRes) {
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
            that.setData({
              picKey: formdata.key
            })
            console.log(that.data.picKey)
            wx: wx.uploadFile({
              url: app.FILE_URL,
              filePath: tempFilePath,
              name: 'file',
              formData: formdata,
              success: function (uploadFileRes) {
                console.log(uploadFileRes)
              },
            })
          },
        })
        that.setData({
          src: tempFilePath
        })
      }
    })
  },

  formSubmit: function (e) {
    let that = this
    that.setData({
      lock: true
    })
    

    let date = new Date();
    let hour = date.getHours() //计算小时数
    let minute = date.getMinutes() //计算分数
    let hous = that.data.multiArray[1][that.data.multiIndex[1]]
    let min = that.data.multiIndex[2]
    var minut = '';
    if (min == '0') {
      minut = '00'
    } else if (min == '1') {
      minut = 30
    }
    if (that.data.multiIndex[0] <= 0) {
      if (that.data.multiIndex[1] < hour) { //判断时间是否在当前时间之后
        that.setData({
          newDate: true
        })
      } else if (that.data.multiIndex[1] > hour) {
        that.setData({
          newDate: false
        })
      } else if (that.data.multiIndex[1] == hour) {
        if (minut < minute) {
          that.setData({
            newDate: true
          })
        } else {
          that.setData({
            newDate: false
          })
        }

      }
    } else {
      that.setData({
        newDate: false
      })
    }
    var str = that.data.multiArray[0][that.data.multiIndex[0]]
    let mon = str.slice(0, 2)
    let day = str.slice(3, 5)
    let year = date.getFullYear();
    if (mon < (date.getMonth() + 1)) {
      year = year + 1
    }
    let awardTime = year + '-' + mon + '-' + day + ' ' + hous + ":" + minut + ":00"
    if (that.data.amount > 0 && that.data.name != '' && that.data.byte == false) { //判断名称数量是否合法
      if (that.data.newDate == false) { //判断是时间是否合法
        common.req({
          url: 'gift/createGiftCard',
          data: {
            "type": "0000",
            "level": "0000",
            "name": that.data.name,
            "amount": that.data.amount,
            "picPath": that.data.picKey,
            "awardTime": awardTime,
            "sponsor": '',
            "introduction": '',
            "msgFormId": e.detail.formId,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          dataType: 'json',
          method: 'POST',
          success: function (res) {
            common.uploadInfo(that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
            wx.reLaunch({
              url: '../giftParticulars/giftParticulars?awardTime=' + res.data.data.awardTime + '&giftId=' + res.data.data.id + '&picPath=' + res.data.data.picPath + '&name=' + res.data.data.name + '&smallProgramCodePath=' + res.data.data.smallProgramCodePath + '&amount=' + res.data.data.amount + '&nickName=' + that.data.userInfo.nickName,
            })
          },

          complete: function (res) {
            that.setData({
              lock: false
            })
          },

        })
      } else {
        wx.showToast({
          title: '请检查开奖时间',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      wx.showToast({
        title: '奖品名称或数量不符合标准!',
        icon: 'none',
        duration: 2000
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '生成礼品卡'
    })


    var dateObj = []; //生成最近三天的日期
    var date = new Date();
    var hour = date.getHours() //计算小时数
    var minute = date.getMinutes() //计算分数

    for (var i = 0; i < 3; i++) {
      let day;
      if (i == 0) {
        day = (date.getDay() + 0) % 7;
        date.setDate(date.getDate() + 0);
      } else if (i > 0) {
        day = (date.getDay() + 1) % 7;
        date.setDate(date.getDate() + 1);
      }
      let show_day = new Array('周日', '周一', '周二', '周三', '周四', '周五', '周六');

      dateObj.push(((date.getMonth() + 1) < 10 ? ("0" + (date.getMonth() + 1)) : date.getMonth() + 1) + "月" + (date.getDate() < 10 ? ("0" + date.getDate()) : date.getDate()) + "日" + " " + show_day[day])

    }
    if (minute < 30) { //如果分数小于30则把时间提高到30分
      that.setData({
        "multiIndex[2]": 1
      })
      that.setData({
        "multiIndex[1]": hour
      })
    } else if (minute >= 30) { //如果分数大于30则把小时提高一小时，分数为00
      that.setData({
        "multiIndex[1]": (hour + 1)
      })
      that.setData({
        "multiIndex[2]": 0
      })
    }
    that.setData({
      "multiArray[0]": dateObj
    })

  },
  bindPickerChange: function (e) { //时间选择器

    this.setData({
      index: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    var that = this;
    let date = new Date();
    let hour = date.getHours() //计算小时数
    let minute = date.getMinutes() //计算分数
    let hous = that.data.multiIndex[1]
    let min = that.data.multiIndex[2]
    var minut = '';
    if (that.data.multiIndex[2] == '0') {
      minut = 0
    } else if (that.data.multiIndex[2] == '1') {
      minut = 30
    }
    if (that.data.multiIndex[0] <= 0) {
      if (that.data.multiIndex[1] < hour) { //判断时间是否在当前时间之后
        that.setData({
          newDate: true
        })
      } else if (that.data.multiIndex[1] > hour) {
        that.setData({
          newDate: false
        })
      } else if (that.data.multiIndex[1] == hour) {
        if (minut < minute) {
          that.setData({
            newDate: true
          })
        } else {
          that.setData({
            newDate: false
          })
        }

      }
    } else {
      that.setData({
        newDate: false
      })
    }
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.userInfo) { //在app页面获取userInfo
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
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })

        }
      })
    }
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
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面

    //直接调用上一个页面的setData()方法，把数据存到上一个页面中去

    prevPage.setData({
      id: 1
    })

    //   wx.navigateBack();
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
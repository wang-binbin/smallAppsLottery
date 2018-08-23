// pages/addaAdvanced/addAdvanced.js
var app = getApp();
var common = require("../../common.js");
var util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    select: {},
    descriptionInput: '大吉大利,涨涨涨',
    sumInput: '请输入通证总量',
    sumValue: '',
    numValue: '',
    availableBalance: 0,
    gross: 0,
    selePackage: true,
    aggregate: 0,
    tokenSymbol: 'MAG',
    redPackage: true,
    advanced: false,
    array: ['钱包地址领奖', '收货地址领奖', '手机号领奖', '添加官方微信领奖'],
    popUp: false,
    lock: false,
    price: null,
    expireTime: false,
    wayOfGiving: 0,
    vipExpiryTime: null,
    WechatAccept: false,
    byte: false,
    bytenumber: false,
    Wechat: null,
    newDate: false,
    pickDate: '',
    lockk: false,
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
  },
  addImgTxt: function() {
    wx: wx.navigateTo({
      url: '../editor/editor',
    })
  },
  getUserInfo: function (e) { //获取头像昵称
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
  send: function(e) {
    let that = this
    that.setData({
      lockk: true
    })
    let totality;
    if (that.data.sumValue != '' && that.data.sumValue != null && that.data.numValue != '' && that.data.numValue != null && Number(that.data.numValue) > 0 && Number(that.data.numValue) < 100) {
      if (that.data.selePackage) {
        if (that.data.sumValue / that.data.numValue < that.data.minEnvelopeAmount) {
          wx.showToast({
            title: '人均不得少于' + that.data.minEnvelopeAmount,
            icon: 'none',
            duration: 2000
          })
          that.setData({
            lockk: false
          })
          return
        } else {
          totality = that.data.sumValue
        }
      } else {
        if (that.data.aggregate > that.data.availableBalance) {
          wx.showToast({
            title: '可用余额不足',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            lockk: false
          })
          return
        } else {
          totality = that.data.aggregate
        }
      }
      common.req({
        url: 'envelope/createRedEnvelope',
        data: {
          "type": (that.data.selePackage ? '0000' : !that.data.selePackage ? '0001' : ''),
          "tokenSymbol": that.data.tokenSymbol,
          "tokenTotal": totality,
          "envelopeNumber": that.data.numValue,
          "message": that.data.descriptionInput,
          "msgFormId": e.detail.formId
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        dataType: 'json',
        method: 'POST',
        success: function(res) {
          that.setData({
            lockk: false
          })
          console.log(res)
          wx: wx.navigateTo({
            url: '../redPackagePhoto/redPackagePhoto?envelopeId=' + res.data.data.id,
            success: function(res) {},
            fail: function(res) {},
            complete: function(res) {},
          })
        },
      })

    } else {
      that.setData({
        lockk: false
      })
      wx.showToast({
        title: '总量或份数缺失！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  NumInput: function(e) {
    let that = this
    if (e.detail.value > 100) {
      wx.showToast({
        title: '数量不得超过100',
        icon: 'none',
        duration: 2000
      })
    }
    that.setData({
      numValue: e.detail.value
    })
    if (!(that.data.selePackage)) {
      that.setData({
        aggregate: e.detail.value * that.data.sumValue,
      })
    }
  },
  SumInput: function(e) {
    let that = this
    if (e.detail.value == '' || e.detail.value == null) {
      that.setData({
        sumValue: e.detail.value,
        gross: 0
      })
    } else {
      that.setData({
        sumValue: e.detail.value,
        gross: e.detail.value
      })
    }
    if (!(that.data.selePackage)) {
      that.setData({
        aggregate: e.detail.value * that.data.numValue,
      })
    }
  },
  descriptionInput: function(e) {
    let that = this

    that.setData({
      descriptionInput: e.detail.value
    })
  },

  redPackage: function() {
    let that = this
    that.setData({
      redPackage: true,
      advanced: false,
    })
  },
  advanced: function() {
    let that = this
    that.setData({
      redPackage: false,
      advanced: true,
    })
  },
  // ***************************************************
  Wechat: function(event) {
    let that = this;
    that.setData({
      Wechat: event.detail.value
    })

  },


  inputchange: function(event) { //输入奖品名称时判断字节
    var that = this;
    if (event.detail.value.length >= 20) {

      that.setData({
        byte: true
      })
    } else if (event.detail.value.length < 20) {

      that.setData({
        byte: false
      })
    }
    // }
    that.setData({
      name: event.detail.value.replace(/\s+/g, '')
    })
  },
  numberchange: function(event) { //输入数量判断
    var that = this;
    that.setData({
      amount: event.detail.value.replace(/\s+/g, '')
    })
  },
  cehngePhoto: function() {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
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
            that.setData({
              picKey: formdata.key
            })
            console.log(that.data.picKey)
            wx: wx.uploadFile({
              url: app.FILE_URL,
              filePath: tempFilePath,
              name: 'file',
              formData: formdata,
              success: function(uploadFileRes) {
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

  formSubmit: function(e) {
    let that = this
    that.setData({
      lock: true
    })
    if (that.data.wayOfGiving == 3 && that.data.Wechat == null) {
      wx.showToast({
        title: '请填写客服微信号',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        lock: false
      })
      return
    }
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
            "introduction": app.globalData.introduction,
            "msgFormId": e.detail.formId,
            "wayOfGiving": parseInt(that.data.wayOfGiving) + 1,
            "awardWechat": that.data.Wechat
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          dataType: 'json',
          method: 'POST',
          success: function(res) {
            common.uploadInfo(that.data.userInfo.nickName, that.data.userInfo.avatarUrl)
            wx.reLaunch({
              url: '../giftParticulars/giftParticulars?awardTime=' + res.data.data.awardTime + '&giftId=' + res.data.data.id + '&picPath=' + res.data.data.picPath + '&name=' + res.data.data.name + '&smallProgramCodePath=' + res.data.data.smallProgramCodePath + '&amount=' + res.data.data.amount + '&nickName=' + that.data.userInfo.nickName,
            })
          },

          complete: function(res) {
            that.setData({
              lock: false
            })
          },

        })
      } else {
        that.setData({
          lock: false
        })
        wx.showToast({
          title: '请检查开奖时间',
          icon: 'none',
          duration: 2000
        })
      }
    } else {
      that.setData({
        lock: false
      })
      wx.showToast({
        title: '奖品名称或数量不符合标准!',
        icon: 'none',
        duration: 2000
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   * 
   */
  onLoad: function(options) {
    let that = this
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
    common.req({
      url: 'user/getTokenBaseInfo',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        for (let i = 0; i < res.data.data.length; i++) {
          res.data.data[i].checked = false;
        }
        res.data.data[0].checked = true;
        that.setData({
          select: res.data.data,
          availableBalance: res.data.data[0].availableBalance,
          minEnvelopeAmount: res.data.data[0].minEnvelopeAmount
        })
      },
    })
    common.req({
      url: 'v2/ticker/2434/?convert=CNY',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        that.setData({
          price: res.data.data.quotes.CNY.price
        })

      }
    })

  },
  luck: function() {
    let that = this
    that.setData({
      selePackage: true,
      sumInput: "请输入通证总量",
      sumValue: '',
      numValue: '',
      gross: 0,
      aggregate: 0
    })
  },
  common: function() {
    let that = this
    that.setData({
      selePackage: false,
      sumInput: "请输入单个数量",
      sumValue: '',
      numValue: '',
      gross: 0,
      aggregate: 0
    })
  },

  Select: function(e) {
    let that = this
    for (let i = 0; i < that.data.select.length; i++) {
      that.data.select[i].checked = false;
    }
    common.req({
      url: 'v2/ticker/?convert=CNY',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      dataType: 'json',
      method: 'POST',
      success: function(res) {
        for (x in res.data.data) {
          if (res.data.data[x].symbol == that.data.select[e.currentTarget.dataset.index].tokenSymbol) {
            that.setData({
              price: res.data.data[x].quotes.CNY.price
            })
          }
        }


      }
    })
    that.data.select[e.currentTarget.dataset.index].checked = true;
    that.setData({
      select: that.data.select,
      tokenSymbol: that.data.select[e.currentTarget.dataset.index].tokenSymbol,
      availableBalance: that.data.select[e.currentTarget.dataset.index].availableBalance,
      minEnvelopeAmount: that.data.select[e.currentTarget.dataset.index].minEnvelopeAmount
    })
  },
  bindPickerChange: function(e) {
    let that = this
    console.log(e.detail.value)
    if (e.detail.value == 3) {
      that.setData({
        WechatAccept: true
      })
    } else {
      that.setData({
        WechatAccept: false,
        Wechat: null
      })
    }
    that.setData({
      wayOfGiving: e.detail.value
    })

  },
  bindMultiPickerChange: function(e) {
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
  bindMultiPickerColumnChange: function(e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },

  // ---------------------------------------------------
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    common.req({
      url: 'user/getVipExpiryTime',
      data: {},
      dataType: 'json',
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (((new Date(res.data.data.vipExpiryTime.replace(/-/g, "\/"))) > (new Date()))) {
          that.setData({
            vipExpiryTime: res.data.data.vipExpiryTime
          })
        } else {
          wx.showModal({
            // title: '提示',
            content: 'vip已到期',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx: wx.navigateTo({
                  url: '../pay/pay',
                })
              }
            }
          })
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      introduction: app.globalData.introduction
    })
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
    // console.log(encodeURIComponent('haadasphdaaeq3-0842309-5673056%$&%^(*)#$$@$'))
    // // console.log(decodeURIComponent(encodeURIComponent('app.globalData.introduction')))
  },




})
var app = getApp();
module.exports = {
  req: req,
  updateUserInfo: updateUserInfo,
  uploadInfo: uploadInfo
}

function updateUserInfo() {
  req({
    url: 'user/updateUserInfo',
    data: {
      'nickName': app.globalData.userInfo.nickName,
      'avatarUrl': app.globalData.userInfo.avatarUrl
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    method: 'POST',
    success: function(res) {
      console.log(res)
    },
  })

}

function reLogin(options) {
  // if (app.state.loginLock){
  //   while(true){
  //     // sleep(100);
  //     if (!app.state.loginLock){
  //       req(options);
  //       break;
  //     }
  //   }
  // }
  app.state.loginLock = true;
  wx.login({ // 登录
    success: loginRes => {
      console.log(app.globalData.invitorId)
      req({
        url: 'user/login',
        data: {
          'jsCode': loginRes.code,
          "invitorId": app.globalData.invitorId || ''
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(serviceLoginRes) {
          console.log(serviceLoginRes.header['Set-Cookie'])
          if (serviceLoginRes.data.status == '0000') {
            if (app.globalData.userId!=null){
            }else{
            wx.setStorage({
              key: "userId",
              data: serviceLoginRes.data.data.userId
              })
            }
            try {
              if (serviceLoginRes.header["Set-Cookie"]){
                wx.setStorageSync('cookie', serviceLoginRes.header["Set-Cookie"])
              }
              
            } catch (e) {
              console.error(e)
            }
            app.state.loginLock = false;
            req(options);
          } else {
            wx.showToast({
              title: '登陆失败!!',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
    },
    fail:res=>{
      app.state.loginLock = false;
    }
  })
}

function req(options) {
  wx.getStorage({
    key: 'cookie',

    complete: function(res) {
      // console.log(res)
      if (options.header && options.header != "") {
        options.header.Cookie = res.data || '';
        if (!options.header['Content-Type']) options.header['Content-Type'] = 'application/x-www-form-urlencoded';
      } else {
        options.header = {
          Cookie: res.data || '',
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      options.fail = function() {
        wx.showToast({
          title: '网络不给力!',
          icon: 'none',
          duration: 2000
        })
      }
      let oldUrl = options.url;
      options.url = app.REQ_URL + options.url;
      let oldSuccess = options.success;
      options.success = function(res) {
        if (res.data.status == '2010') {
          options.success = oldSuccess;
          options.url = oldUrl;
          reLogin(options)
        } else {
          if (res.data.status!='0000'){
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
          oldSuccess(res);
          
        }
      }

      wx: wx.request(options)
    }
  })

}

function uploadInfo(nickName, avatarUrl) {
  if (nickName != null && avatarUrl != null && avatarUrl != '' && nickName != ''){
  req({
    url: 'user/updateUserInfo',
    data: {
      'nickName': nickName,
      'avatarUrl': avatarUrl,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    dataType: 'json',
    method: 'POST',
    success: function(res) {
      console.log(res)
    },

  })
  }
}
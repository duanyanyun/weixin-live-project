//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo && this.globalData.user) {
      typeof cb == "function" && cb(this.globalData.user)
    } else {
      wx.login({
        success: function (res) {
          var code=res.code;
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              wx.request({
                url: that.url+'/api/wx/login', 
                method:'GET',
                data: {
                  'code':code,
                  'rawData':res.rawData
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log(res.data)
                  that.httpError(res)
                  that.globalData.user = res.data.data
                  that.globalData.userInfo = res.userInfo
                  wx.setStorageSync("UserInfo", res.data.data)
                  typeof cb == "function" && cb(res.data.data)
                }
              })
              
            },
            fail: function (res) {
              wx.openSetting({
                success: (res) => {
                  if (!res.authSetting["scope.userInfo"]){
                    wx.showToast({
                      title: '你拒绝了授权',
                      image: '../../images/icon_error_03.png',
                      duration: 800
                    })
                  }else{
                    wx.showToast({
                      title: '授权成功',
                      duration: 800
                    })
                  }
                }
              })

            }
          })
        }
      })
      
    }
  },
  getUser:function(cb){
    var user = wx.getStorageSync("UserInfo")
    var authKey = user.auth_key;
    if (user.auth_key == undefined) {
      this.getUserInfo(function (userInfo) {
        cb(userInfo);
      })
    } else {
      cb(user);
    }
  },
  httpError: function (status){
    if (status.statusCode == 404) {
        wx.showToast({
          title: '请求错误',
          image: '../../images/icon_error_03.png',
          duration: 800
        })
    } else if (status.statusCode == 500) {
        wx.showToast({
          title: '服务器错误',
          image: '../../images/icon_error_03.png',
          duration: 1000
        })
    } else if (status.data.data == 403) {
        wx.showToast({
          title: '权限不足',
          image: '../../images/icon_error_03.png',
          duration: 1000
        })
      } else {
      // var ad = JSON.stringify(status.data.data)
      var ad = status.data.data
        wx.showToast({
          title: ad,
          image: '../../images/icon_error_03.png',
          duration: 1000
        })
      }
  },
  httpPost: function (url, model, success, fail){
    var _this = this;
    _this.getUser(function(user){
      model.token = user.auth_key;
      wx.request({
        url: url,
        data: model,
        method: "POST",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        success: function (res) {
          if (res.data.status == 0) {
            fail(res);
            _this.httpError(res);
            return true;
          }
          success(res.data.data);
        }
      });
    });
  },
  httpGet: function (url, model, success, fail) {
    var _this = this;
    wx.request({
      url: url,
      data: model,
      header: { 'content-type': 'application/json' },
      success: function (res) {
        if (res.data.status == 0) {
          fail(res);
          _this.httpError(res);
          return true;
        }
        success(res.data.data);
      }
    });
  }
  ,
  getDateTime:function (created_at,fmt) {
            var date=new Date(parseInt(created_at+"000"));
            var o = {
               "M+": date.getMonth() + 1, //月份
               "d+": date.getDate(), //日
               "H+": date.getHours(), //小时
               "m+": date.getMinutes(), //分
               "s+": date.getSeconds(), //秒
               "q+": Math.floor((date.getMonth() + 3) / 3), //季度
               "S": date.getMilliseconds() //毫秒
           };
           
           if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
           for (var k in o)
               if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
           return fmt;
  },
  globalData: {
    userInfo: null,
    user:null
  },
  url:"http://192.168.6.62:8090",
  imgUrl: "http://img.csjimg.com/"
})



var app = getApp();
Page({
  data:{
    loginStatus:true,
    headImg:' ',
    nickName:' ',
    imgUrl: "http://img.csjimg.com/",
  },
  onLoad:function(options){
    var that=this
    var user = wx.getStorageSync("UserInfo");
    var authKey = user.auth_key;
    if (authKey == undefined || authKey == null) {
      that.setData({ loginStatus: true })
    }else{
      that.setData({ 
        loginStatus: false,
        headImg: that.data.imgUrl + user.head_img,
        nickName: user.nickname
      })
    }
  },
  // 登录
  userLogin:function(){
    var that=this
    app.getUser(function(user){
      that.onLoad();
      console.log(user)
    })
  },
  // 更换头像
  changeHead : function () {
    var that=this
    var user = wx.getStorageSync("UserInfo");
    console.log(user);
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        console.log(res);
        wx.uploadFile({
          url: app.url + "/api/upload/img",
          filePath: res.tempFilePaths[0],
          name: 'filedata',
          formData: { token: user.auth_key },
          success: function (data) {
            var data = JSON.parse(data.data);
            var headImg = that.data.imgUrl + data.data;
            if (data.status == 1) {
              app.httpPost(app.url + '/api/user/update-headimg', { "headimg":data.data},function(ab){
                wx.showToast({
                  title: '更改成功',
                  duration: 1000
                })
                that.setData({ headImg: headImg});
                user.head_img =data.data
                wx.setStorageSync("UserInfo", user);
                
              }, function (ab){})
            }else{
              app.httpError(data);
            }
           
          },
          fail: function (data) {
            console.log('失败'+data);
          }
        })
      },
      fail: function (res) {
        // fail
      }
    })
  }
})
// pages/my-refer/my-refer.js
var app = getApp();

Page({
  data:{
    myRefer: [],
    myPage: 0,
    imgUrl: "http://img.csjimg.com/",
    isLoadComplete: true,
    isPosa: true
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;
    that.loadReferData(that.data.myPage + 1);
  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({ isPosa: false });
    that.loadReferData(1);
  },
  onReachBottom: function () {
    var that = this
    wx.showLoading({ title: '加载中' })
    that.loadReferData(that.data.myPage + 1);
  },
  loadReferData: function (page){
    var that = this
    app.getUser(function (user) {
      if (!that.data.isLoadComplete) {
        return null;
      }
      var authKey = user.auth_key;
      // if (authKey == undefined || authKey == null) {
      //   wx.showToast({
      //     title: '请登录',
      //     icon: 'loading',
      //     duration: 3000
      //   })
      //   return true;
      // }
      that.setData({ isLoadComplete: false });
      app.httpGet(app.url + '/api/reference/my', { 'page_size': 10, 'token': authKey, 'page': page },function(data){
        wx.hideLoading()
        if (data.references.length == 0 && page != 1) {
          wx.showToast({
            title: '没有更多',
            duration: 800
          })
        }
        if (page == 1) {
          setTimeout(function () { wx.stopPullDownRefresh(); }, 800);
          that.data.myRefer = [];
        }
        for (var i = 0; i <data.references.length; i++) {
          data.references[i].created_at = app.getDateTime(data.references[i].created_at, "yyyy-MM-dd HH:mm");
          that.data.myRefer.push(data.references[i]);
        }
        that.setData({ myRefer: that.data.myRefer, myPage: page, isLoadComplete: true });
      }, function(data){
          wx.hideLoading()
          that.setData({ isLoadComplete: true });
          if (page == 1) {
            setTimeout(function () { wx.stopPullDownRefresh(); }, 800);
          }
      })

    });

  },
  clickReference: function (event) {
    wx.navigateTo({
      url: '../refer-detail/refer-detail?rid=' + event.target.dataset.rid
    })
  }
})
// pages/refer/refer.js

var app = getApp();

Page({
  data: {
    selectTab: 1,
    winWidth: '',
    winHeight: '',
    allRefer: [],
    myRefer: [],
    allPage: 0,
    myPage: 0,
    imgUrl: "http://img.csjimg.com/",
    isLoadComplete: true,
    isPosa: true
  },
  clickTab: function (event) {
    var that = this;
    var typeTab = event.target.dataset.type;
    wx.stopPullDownRefresh(); 
    that.setData({ isPosa: true });
    if (that.data.selectTab != typeTab) {
      that.setData({ selectTab: typeTab });
      if (typeTab == 2 && that.data.myRefer.length <= 0) {
        app.getUser(function (user) {
          that.loadReference(typeTab, 1);
        });
      }
    }
  },
  onPullDownRefresh: function () {
    var that = this;
    that.setData({ isPosa: false });
    
    if (that.data.selectTab == 1) {
      that.loadReference(that.data.selectTab, 1);
    } else {
      that.loadReference(that.data.selectTab, 1);
    }
  },
  loadReference: function (types, page) {
    var that = this;

    if (!that.data.isLoadComplete) {
      return null;
    }
    that.setData({ isLoadComplete: false });

    var url="";
    var model={};
    var page;
    if (types==1){
      url = app.url +"/api/reference/list";
      model = { "page": page ,"page_size":10};
    }else{
      var user = wx.getStorageSync("UserInfo");
      var authKey = user.auth_key;
      url =app.url+"/api/reference/my";
      model = { "page": page, "page_size": 10,"token": authKey};
    }
    app.httpGet(url, model, function(data){
      wx.hideLoading()
      if (data.references.length == 0 && page != 1) {
        wx.showToast({
          title: '没有更多',
          duration: 800
        })
      }
      if (page == 1) {
        setTimeout(function () { wx.stopPullDownRefresh(); that.setData({ isPosa: true }); }, 800);
        if (types == 1) {
          that.data.allRefer = [];
        } else {
          that.data.myRefer = [];
        }
      }
      for (var i = 0; i < data.references.length; i++) {
        data.references[i].created_at = app.getDateTime(data.references[i].created_at, "yyyy-MM-dd HH:mm");
        if (types == 1) {

          that.data.allRefer.push(data.references[i]);
        } else {
          that.data.myRefer.push(data.references[i]);
        }
      }
      if (types == 1) {
        that.setData({ allRefer: that.data.allRefer, allPage: page, isLoadComplete: true });
      } else {
        that.setData({ myRefer: that.data.myRefer, myPage: page, isLoadComplete: true });
      }
    },function(data){
      wx.hideLoading()
      that.setData({ isLoadComplete: true })
      if (page == 1) {
        setTimeout(function () { wx.stopPullDownRefresh(); }, 800);
      }
    })

  },
  onLoad: function (options) {
    var that = this;
    // 获取系统信息 
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }
    });
    var user = wx.getStorageSync("UserInfo");
    if (user!=null){
      that.loadReference(that.data.selectTab, that.data.allPage + 1);
    }else{
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.loadReference(that.data.selectTab, that.data.allPage + 1);
      })
    }
  },
  clickReference: function (event){
     wx.navigateTo({
       url: '../refer-detail/refer-detail?rid=' + event.target.dataset.rid
     })
  },
  payReference: function (event){
    var id = event.target.dataset.rid;
    // 页面关闭
    console.log("rid:" + id);
  },
  onReachBottom: function () {
    var that = this;
    wx.showLoading({ title: '加载中' })
    if (that.data.selectTab == 1) {
      that.loadReference(that.data.selectTab, that.data.allPage + 1);
    } else {
      that.loadReference(that.data.selectTab, that.data.myPage + 1);
    }
  }

})
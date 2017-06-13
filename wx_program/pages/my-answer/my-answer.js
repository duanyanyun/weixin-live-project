// pages/my-answer/my-answer.js
var app = getApp();

var WxParse = require('../../wxParse/wxParse.js');

Page({
  data:{
    answerList: [],
    imgUrl: "http://img.csjimg.com/",
    page: 0,
    indexArr: [],
    isLoadComplete: true
  }, 
  onReachBottom: function () {
    var that = this
    // 加载提示
    wx.showLoading({ title: '加载中' })
    that.loadAnswerData(that.data.page + 1);
  },
  onPullDownRefresh: function () {
    var that=this;
    that.loadAnswerData(1);
  },
  onLoad:function(options){
    var that = this
    that.loadAnswerData(that.data.page + 1);
  },
  loadAnswerData: function (page) {

    var that = this

    app.getUser(function (user) {
      if (!that.data.isLoadComplete) {
        return null;
      }
      var authKey = user.auth_key;
      that.setData({ isLoadComplete: false });
      app.httpGet(app.url + "/api/questions/my", { "page_size": 10, "token": authKey, "page": page },function(data){
        wx.hideLoading()
        var index;
        if (page == 1) {
          wx.stopPullDownRefresh();
          that.data.indexArr = [];
          that.data.answerList = [];
          that.setData({ temArray: [] });
        }
        if (that.data.temArray != undefined) {
          index = that.data.temArray.length;
        } else {
          index = 0;
        }
        if (data.messages.length == 0 && page != 1) {
          wx.showToast({
            title: '没有更多',
            duration: 800
          })
        }
        for (var i = 0; i < data.messages.length; i++) {
          var model = [];
          var messages = data.messages[i];
          messages.data.created_at = app.getDateTime(messages.data.created_at, "MM-dd HH:mm:ss");
          messages.data.content = messages.data.content == null ? "" : messages.data.content;
          WxParse.wxParse('reply' + index, 'html', messages.data.content, that);
          if (page != 1) {
            WxParse.wxParseTemAdd('reply', index, that);
          }
          model[0] = index;
          index++;
          if (messages.data.question != undefined) {
            messages.data.question.created_at = app.getDateTime(messages.data.question.created_at, "MM-dd HH:mm:ss");
            messages.data.question.content = messages.data.question.content == null ? "" : messages.data.question.content;
            WxParse.wxParse('reply' + index, 'html', messages.data.question.content, that);
            if (page != 1) {
              WxParse.wxParseTemAdd('reply', index, that);
            }
            model[1] = index;
            index++;
          }
          that.data.indexArr.push(model);
          that.data.answerList.push(messages);
        }
        if (page == 1) {
          WxParse.wxParseTemArray('reply', index, that)
        }

        that.setData({ answerList: that.data.answerList, indexArr: that.data.indexArr, page: page, isLoadComplete: true });
      },function(data){
          wx.hideLoading()
          that.setData({ isLoadComplete: true });
          if (page == 1) {
            setTimeout(function () { wx.stopPullDownRefresh(); }, 800);
          }
      })
      
    });

    

  }
})
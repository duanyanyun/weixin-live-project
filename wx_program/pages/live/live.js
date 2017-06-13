//index.js
//获取应用实例


var app = getApp();

var comment = require('../comment/comment.js');
var WxParse = require('../../wxParse/wxParseLive.js');

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        message: [],
        messageIndex: [],
        userId: 0,
        showType: 0,
        imgUrl: "http://img.csjimg.com/",
        liveSelectType: 0,
        selectType: 1,
        toView: "",
        windowHeight: 0,
        isScrollBottom: true,
        liveId: 0,
        authority: false,
        teacherId: 0,
        network:{},
        isNetwork:true
    },  
    onLoad: function (options) {
        var that = this
        that.setData({ liveId:options.liveId});

        comment.init.apply(that, []);
        
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    windowHeight: res.screenHeight
                })
            }
        }) 
        that.getNetwork();
    },
    onShow:function(){
      this.loadLiveData();
    },
    onHide:function(){
      wx.closeSocket();
    },
    onUnload:function(){
      wx.closeSocket();
    },
    loadLiveData: function () {
        var that = this;
        var model={ "live_id": that.data.liveId, "page_size": 30 };
        var user = wx.getStorageSync("UserInfo")
        if (user.auth_key != undefined) {
          model.token = user.auth_key;
          that.setData({ userId: user.user_id});
        }
        app.httpGet(app.url + "/api/live/live-detail", model, function(data){
          for (var i = 0; i < data.messages.length; i++) {
            data.messages[i].data.created_at = app.getDateTime(data.messages[i].data.created_at, "MM-dd HH:mm:ss");
            data.messages[i].data.content = data.messages[i].data.content == null ? "" : data.messages[i].data.content;
            WxParse.wxParse('reply' + i, 'html', data.messages[i].data.content, that);
            WxParse.wxParseTemAdd('reply', i, that);
          }
          that.setData({
            message: data.messages,
            authority: data.live.authority,
            teacherId: data.live.user_id
          })

          that.loadSocket(data.im_url)
          setTimeout(function () {
            that.setData({
              toView: "scrollBottom"
            });
          }, 800);
        }, function(data){})

    },
    getNetwork:function(){
      var that = this
      wx.getNetworkType({
        success: function (res) {
          that.setData({ isNetwork: res.networkType != "none"});
        }
      });
      wx.onNetworkStatusChange(function (res){
        if (!that.data.isNetwork && res.isConnected){
          wx.closeSocket();
          that.loadLiveData();
        }
        that.setData({ network: res, isNetwork: res.isConnected });
      });
    },
    loadSocket: function (urlWs) {
        var that = this;
        wx.connectSocket({
            url: urlWs,
            data: {},
            method: 'GET', 
            success: function (res) {}
        })
        wx.onSocketOpen(function (res) {
            console.log('WebSocket连接已打开！')
        })
        wx.onSocketError(function (res) {
            console.log('WebSocket连接打开失败，请检查！')
        })
        wx.onSocketClose(function (res) {
          console.log('WebSocket 已关闭！')
        })
        wx.onSocketMessage(function (res) {
          console.log(res.data);
            var data = JSON.parse(res.data)
            switch (data.cmd) {
                case "s":
                    that.addMessageItem(data);
                    break;
                case "d":
                    that.deleteMessageItem(data);
                    break;
            }
        })

    },
    tabLiveType: function (event) {
        console.log(event);
        this.setData({ showType: event.currentTarget.dataset.type });

    },
    addMessageItem: function (data) {
        var that = this;
        data.status = 1;
        data.data.created_at = app.getDateTime(data.data.created_at, "MM-dd HH:mm:ss");
        if (that.data.message.length > 0) {
            var index = that.data.message.length - 1;
            if (that.data.message[index].sn >= data.sn) {
                return null;
            }
        }
        if (data.type == 1 || data.type == 21 || data.type == 40) {
            data.data.content = data.data.content == null ? "" : data.data.content;
            WxParse.wxParse('reply' + that.data.message.length, 'html', data.data.content, that);
            WxParse.wxParseTemAdd('reply', that.data.message.length, that)
            that.data.message.push(data)
            that.setData({ message: that.data.message })
        }
        if (that.data.isScrollBottom) {
            that.setData({ toView: "messageItem" + (that.data.message.length - 1) })
        }

    },
    deleteMessageItem: function (data) {
        var that = this;
        var isExist = false;
        for (var i = 0; that.data.message.length; i++) {
            if (that.data.message[i].sn == data.sn) {
                that.data.message[i].status = 0;
                isExist = true;
                break;
            }
        }
        if (isExist) {
            that.setData({ message: that.data.message })
            console.log(that.data.message)
        }
    },
    messageScroll: function (e) {
        var that = this;
        var top = e.detail.scrollHeight - e.detail.scrollTop;
        if (that.data.windowHeight < top) {
            if (that.data.isScrollBottom) {
                that.setData({ isScrollBottom: false })
            }
        } else {
            if (!that.data.isScrollBottom) {
                that.setData({ isScrollBottom: true })
            }
        }

    }

})

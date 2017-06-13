// pages/answer/answer.js
var app = getApp();

var WxParse = require('../../wxParse/wxParseLive.js');

Page({
  data:{
    answerTab:1,
    winWidth:' ',
    winHeight:' ',
    answerList:[],
    imgUrl: "http://img.csjimg.com/",
    page:0,
    indexArr:[],
    isLoadComplete:true,
    textContent:null,
    askPrice:98
  },
  onReachBottom:function(){
    var that=this
    wx.showLoading({ title: '加载中'})
    that.loadAnswerData(that.data.page + 1);
  },
  onLoad:function(options){
    var  that= this;
    wx.getSystemInfo({
        success: function (res) {
            that.setData({
                winWidth: res.windowWidth,
                winHeight: res.windowHeight,
            });
        }
    });
    that.loadAnswerData(that.data.page+1);

  },
  selectTab:function(event){ 
    var typeTab= event.target.dataset.type;
    if(this.data.answerTab!=typeTab){ 
      this.setData({answerTab:typeTab});
    }
  },
  onPullDownRefresh: function () {
    var that = this;
    that.loadAnswerData(1);
  },
  loadAnswerData:function(page){

    var that = this
    if (!that.data.isLoadComplete){
      return null;
    }
    that.setData({ isLoadComplete: false });
    var model = { "page_size": 10, "page": page };
    var user = wx.getStorageSync("UserInfo")
    if (user.auth_key!=undefined){
      model.token = user.auth_key;
    }
    app.httpGet(app.url + "/api/questions/answer", model ,function(data){
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
      if (data.messages.length == 0) {
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
        WxParse.wxParseTemAdd('reply', index, that);
        model[0] = index;
        index++;
        if (messages.data.answer != undefined) {
          messages.data.answer.created_at = app.getDateTime(messages.data.answer.created_at, "MM-dd HH:mm:ss");
          messages.data.answer.content = messages.data.answer.content == null ? "" : messages.data.answer.content;
          WxParse.wxParse('reply' + index, 'html', messages.data.answer.content, that);
          WxParse.wxParseTemAdd('reply', index, that);
          model[1] = index;
          index++;
        }
        that.data.indexArr.push(model);
        that.data.answerList.push(messages);
      }

      that.setData({ answerList: that.data.answerList, indexArr: that.data.indexArr, page: page, isLoadComplete: true });
      
    },function(data){
          wx.hideLoading()
          that.setData({ isLoadComplete: true });
    })
  
  },
  getIndex:function(i){
    var data = this.data.temArray[i+this.data.indexArr];
    that.setData({ indexArr: this.data.indexArr+1 });
    return data;
  },
  // 提问内容
  textValue:function(e){
    var that=this
    that.setData({
      textContent:e.detail.value
    })
  },
  // 确认提问
  askBtn:function(){
    var that =this;
    var askType = that.data.answerTab;
    app.getUser(function (user) {

      var authKey = user.auth_key;
      if (that.data.textContent == null) {
        wx.showToast({
          title: '内容不能为空',
          image: '../../images/icon_error_03.png',
          duration: 1000
        })
        return true;
      }  
      var liveId = wx.getStorageSync("live_id");
      app.httpPost(app.url + "/api/questions/ask", { "content": that.data.textContent, "live_id": liveId, "status": askType, "price": that.data.askPrice },function(data){
        that.setData({ textContent: null });
        wx.showToast({
          title: '发送成功',
          duration: 1000
        },function(data){
          that.setData({ textContent: null });
        })
      })

    });

  },
  //查看问答
  getAnswerClick: function (event){
    var that = this
    var index = event.target.dataset.index;
    var data= that.data.answerList[index];
    var price= data.data.price-10;
    var sn = data.sn;
    //console.log('index：' + index + "   price:" + price + "    sn:" + sn);
    //内容替换索引
    var indexItem= that.data.indexArr[index];
    // app.httpPost(app.url +"",{},function(data){

    // });

  }

})
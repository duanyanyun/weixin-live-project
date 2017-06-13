// pages/refer-detail/refer-detail.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data:{
    model:{}
  },
  onLoad:function(options){
    var rid = options.rid;
    console.log(options.rid);
    this.loadDetail(rid);
  },
  loadDetail: function (rid){
    var that = this
    app.httpGet(app.url + '/api/reference/detail', { "reference_id": rid },function(data){
      console.log(data)
      data.created_at = app.getDateTime(data.created_at, "yyyy-MM-dd");
      WxParse.wxParse('referContent', 'html', data.content, that);
      that.setData({
        model: data
      });
    },function(data){})
  }
})
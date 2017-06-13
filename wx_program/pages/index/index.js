var app = getApp();
Page({
    data: {
      imgUrl: "http://img.csjimg.com/",
      model:{}
    },
    onLoad: function (options) { 
      
      // app.httpGet("https://api.weixin.qq.com/cgi-bin/token", { "grant_type": "client_credential", "appid": "wxff952d1ede00a27d", "secret":"24acb2a323881cff865b1b9713e48888"},function(ret){
      //   console.log(ret);
      // });
      
      wx.request({
        url: "https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=hQS9z1lPqtwwGhLRf4TVBdGiVAaMdhFINLbe-jEiV23KTpYWLT8s4GJWCxXFwRmOAZKLsl_usBHYEciISOJj5zL5QDzg2TjqQh3Is5lNw32O5RrkGucMwz_-QJ75g_phFWDjAGAOFM",
        data: { "path": "pages/index/index?rid=10060", "width": 430 },
        method: "POST",
        success: function (res) {
         
          console.log(res);
        }
      });

      
      if (options.uid!=undefined){
        wx.showToast({
          title: '用用户Id' + options.uid,
          duration: 800
        })
      }
    },
    onShow:function(){
      this.loadData();
    },
    loadData(){
      var that= this;
      app.httpGet(app.url + "/api/wx/index", {}, function(data){
        wx.setStorageSync("live_id", data.live_id);
        that.setData({ model: data });
      },function(data){})

    },clickLiveBut:function(){
      var that = this;
      if (that.data.model.live_id != undefined){
        wx.navigateTo({ url: '/pages/live/live?liveId=' + that.data.model.live_id });
      }
    }
})
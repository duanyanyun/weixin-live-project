var app = getApp();

function init(){
  var that = this;
  that.setData({
        content:"",
        liveTabShow:false,
        isTabShow:true,
        isEmojiShow:true,
        isActionShow:true,
        isEmojiHide:true,
        isSend:true,
        isLoadTab:true,
        isLoad:true,
        isLoadT:true,
        focus: false,
        commentUrl:"http://common.csjimg.com/",
        qqEmoji:[["玫瑰","50.gif"],["凋谢","51.gif"], ["爱心","52.gif"], ["心碎","53.gif"],["礼物","54.gif"],["太阳","55.gif"],["月亮","56.gif"],["强","57.gif"], ["弱","58.gif"], ["握手","59.gif"], ["飞吻","60.gif"],["怄火","61.gif"], ["西瓜","62.gif"],["惊讶","1.gif"], ["撇嘴","2.gif"], ["色","3.gif"], ["发呆","4.gif"], ["得意","5.gif"], ["害羞","6.gif"], ["闭嘴","7.gif"], ["睡","8.gif"],["大哭","9.gif"], ["尴尬","10.gif"],["发怒","11.gif"]  , ["调皮","12.gif"], ["呲牙","13.gif"], ["微笑","14.gif"], ["难过","15.gif"], ["酷","16.gif"], ["折磨","17.gif"], ["吐","18.gif"], ["偷笑","19.gif"], ["可爱","20.gif"], ["白眼","21.gif"], ["傲慢","22.gif"], ["饥饿","23.gif"], ["困","24.gif"],["惊恐","25.gif"], ["流汗","26.gif"], ["憨笑","27.gif"], ["大兵","28.gif"], ["奋斗","29.gif"], ["疑问","30.gif"],["嘘","31.gif"], ["晕","32.gif"],["衰","33.gif"], ["骷髅","34.gif"], ["敲打","35.gif"], ["再见","36.gif"], ["发抖","37.gif"], ["爱情","38.gif"], ["跳跳","39.gif"], ["猪头","40.gif"],["拥抱","41.gif"], ["蛋糕","42.gif"], ["闪电","43.gif"], ["炸弹","44.gif"], ["刀","45.gif"], ["足球","46.gif"], ["便便","47.gif"], ["咖啡","48.gif"],["饭","49.gif"],  ["冷汗","63.gif"], ["抠鼻","64.gif"],["鼓掌","65.gif"], ["溴大了","66.gif"], ["坏笑","67.gif"], ["左哼哼","68.gif"], ["右哼哼","69.gif"], ["哈欠","70.gif"], ["鄙视","71.gif"], ["委屈","72.gif"],["快哭了","73.gif"], ["阴险","74.gif"], ["亲亲","75.gif"], ["吓","76.gif"], ["可怜","77.gif"], ["菜刀","78.gif"], ["啤酒","79.gif"], ["篮球","80.gif"],["乒乓","81.gif"], ["示爱","82.gif"], ["瓢虫","83.gif"], ["抱拳","84.gif"], ["勾引","85.gif"], ["拳头","86.gif"], ["差劲","87.gif"], ["爱你","88.gif"],["NO","89.gif"], ["OK","90.gif"],["转圈","91.gif"], ["磕头","92.gif"], ["回头","93.gif"], ["跳绳","94.gif"], ["挥手","95.gif"], ["激动","96.gif"],["街舞","97.gif"], ["献吻","98.gif"], ["左太极","99.gif"], ["右太极","100.gif"],["领带","101.gif"], ["祈祷","102.gif"], ["金领","103.gif"], ["糖果","104.gif"],["红包","105.gif"], ["切糕","106.gif"], ["十一","107.gif"], ["万圣节","108.gif"], ["月饼","109.gif"], ["国庆","110.gif"],["福到","111.gif"], ["礼炮","112.gif"],["铃铛","113.gif"], ["给力","114.gif"], ["围观","115.gif"], ["围巾","116.gif"],["雪花","117.gif"], ["手套","118.gif"], ["圣诞袜","119.gif"]],
        isGiftShow:true,
        isLoadGift:true,
        emojiContent:"",
        giftCount:0,
        giftItems:[]
  });

  that.emojiClick=function(event){
     var index= event.target.dataset.index;
     if(that.data.qqEmoji.length>index){
        var key=that.data.qqEmoji[index][0]+":"+that.data.qqEmoji[index][1]+",";
        var model={ content:that.data.content+"["+that.data.qqEmoji[index][0]+"]"};
        if(that.data.emojiContent.indexOf(key)<=-1){
          model.emojiContent=that.data.emojiContent+key;
        }
        that.setData(model)
     }
  };

  that.emojiParsingImg=function(){
     var emojis= that.data.emojiContent;
     var content= that.data.content;
     if(emojis.length>0){
        var emojiArr=emojis.split(",");
        for (var i = 0; i < emojiArr.length; i++) {
	    	if(emojiArr[i].length>0){
	    		var item=emojiArr[i].split(":");
	    		content=content.replace(new RegExp('\\['+item[0]+'\\]', 'g'),"<img class='face-img' src='"+that.data.commentUrl+'emot/qq/'+item[1]+"' >");
	    	}
	    }
     }
     
     return content;
  };

  that.boxShow=function(){
    that.setData({
      isActionShow:true,
      isEmojiShow:true,
      isEmojiHide:true
    })
  };

  that.sendMessage = function (content, authKey){
    var url = "";
    var model = {};
    if(content==''){
      wx.showToast({
        title: '内容不能为空',
        image: '../../images/icon_error_03.png',
        duration: 1000
      })
      return true;
    }
    if (that.data.authority) {
      url = app.url + "/api/live/send-opinion";
      model = { "live_id": that.data.liveId, "content": content, "token": authKey };
    } else {
      url = app.url + "/api/live/send-interaction";
      model = { "live_id": that.data.liveId, "content": content, "token": authKey };
    }
    app.httpPost(url, model, function (data) {
      that.setData({ emojiContent: "", content: "" })

    }, function (data) { })
    that.setData({
      isActionShow: true,
      isEmojiShow: true
    });
  };
  // 发送
  that.inputSend=function(){  
    var content= that.emojiParsingImg();
    app.getUser(function (user) {
      that.setData({ userId: user.user_id });
      that.sendMessage(content, user.auth_key);
    });
    
  };

  // input输入
  that.inputImport=function(e){
    if(e.detail.value.length>=1){
      that.setData({
        isSend:false
      })
    }else{
      that.setData({
        isSend:true
      })
    }
  };

  that.setCoutent=function(e){
    that.setData({ content:e.detail.value })
  };
  
  //input聚焦
  that.inputFocus=function(){
    that.setData({
      isEmojiHide:true
    });
  };

  // 表情显示
  that.emojiShow=function(){
    that.setData({
      isEmojiShow:false,
      isEmojiHide:false,
      isActionShow:true,
      isLoad:false,
      isGiftShow:true
    })
  };
  //表情隐藏
  that.emojiHide=function(){
    that.setData({
      isEmojiHide:true,
      isEmojiShow: true
    });
    setTimeout(function(){
        that.setData({
            focus: true
        });  
    },300);
  };
  // 功能显示隐藏
  that.actionShow=function(){
    if(that.data.isActionShow==true){
      that.setData({      
        isActionShow:false,
        isEmojiShow:true,
        isEmojiHide:true,
        isLoadT:false,
        isGiftShow:true
      })
    }else{
      that.setData({
        isActionShow:true,
        isEmojiShow:true,
        isEmojiHide:true,
        isGiftShow:true     
      })
    }
    
  };

  // 礼物显示
  that.giftShow=function(){
    if(this.data.giftItems.length<=0){
      that.loadGift();
      return true;
    } 
    this.setData({      
        isGiftShow:false,
        isActionShow:true,
        isLoadGift:false
      })
  };
  
  that.loadGift=function(){
    app.httpGet(app.url + '/api/gift/all', {}, function(data){
      var count = data.length;
      if (count > 0) {
        that.setData({ giftCount: Math.ceil(count / 8), giftItems: data })
      }
    },function(data){})
    that.setData({isGiftShow:false,isActionShow:true,isLoadGift:false})
  };

  that.sendGift=function(event){
    var that=this;
    var index= event.target.dataset.index;
    var gid = that.data.giftItems[index].gift_id;
    app.getUser(function (user) {
      that.setData({ userId: user.user_id });
      app.httpPost(app.url + "/api/live/send-gift", { "live_id": that.data.liveId, "gift_id": gid, "users": that.data.teacherId, "count": 1},function(data){
        wx.showToast({
          title: data,
          duration: 1000
        })
      },function(data){});
    });  

  };
  //点击照片
  that.clickPhoto=function(){
    app.getUser(function(user){
      that.setData({ userId: user.user_id });
      wx.chooseImage({
        count: 1, 
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: function (res) {
          wx.uploadFile({
            url: app.url + "/api/upload/img",
            filePath: res.tempFilePaths[0],
            name: 'filedata',
            formData: { token: user.auth_key},
            success: function (data) {
              var data = JSON.parse(data.data);
              if (data.status==1){
                that.sendMessage('<img src="' + app.imgUrl+ data.data + '">', user.auth_key);
              }else{
                app.httpError(data)
              }
              console.log(data.data);
            },
            fail: function (data) {
              console.log(data);
            }
          })

        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })

    });
    
  };

  wx.showShareMenu({
    withShareTicket: true,
    success: function (res) {
      // 分享成功
      console.log("showShareMenu:成功");
    },
    fail: function (res) {
      // 分享失败
      console.log("showShareMenu:失败");
    }
  });

  that.onShareAppMessage=function(){
    var user = wx.getStorageSync("UserInfo")
    var authKey = user.auth_key;
    var userId=0;
    if (user.auth_key != undefined) {
      userId = user.user_id;
    }

    return {
      title: '分享',
      path: '/pages/index/index?uid=' + userId,
      success: function (res) {
        // 分享成功
        console.log("onShareAppMessage:分享成功");
      },
      fail: function (res) {
        // 分享失败
        console.log("onShareAppMessage:分享失败");
      }
    }
  };

};

module.exports = { init: init };
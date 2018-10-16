Page({
  data: {
    filesUrl:"",
    urlVal:"",
    desVal: "",
    files: [],
    showTopTips: false,
    inputShowed: false,
    inputVal: "",
    grids:[0,1,2,3,4,5,6,7,8,9]
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    wx.previewImage({
      current: current,// 当前显示图片的http链接  
      urls: [String(current)] // 需要预览的图片http链接列表  
    })
  },
  show:function(e){
    var input = String(this.data.inputVal);
    var that = this;
    wx.navigateTo({
      url: '../results/results?keywords='+input,
    })
    that.setData({
      inputVal:''
    });
  },
  update:function(e){
    var that = this;
    if(that.data.filesUrl!=null){
      var url = that.data.filesUrl
    }else{
      var url = String(e.detail.value.url);
    }
    var des = String(e.detail.value.des)
    var that = this;
    wx.request({
      url: 'https://stvea.cn/bqbUpdata.php?url='+url+"&des="+des,
      method:'GET',
      success:function(){
        
        that.setData({
          showTopTips: true
        });
        setTimeout(function () {
          that.setData({
            showTopTips: false
          });
        }, 3000);
      }
    })
    that.setData({
      urlVal:'',
      desVal:''
    })
    this.cancel();
  },
  showTopTips: function() {
    var that = this;
    that.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  chooseImage:function(){
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
        var tempFilePaths = res.tempFilePaths;
        //启动上传等待中...
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        });
        wx.uploadFile({
          url: 'https://stvea.cn/bqbUpdata.php?id=1',
          filePath: tempFilePaths[0],
          name: 'file',
          header: { "Content-Type": "multipart/form-data" },
          formData: {
            'user': 'stvea'
          },
          success: function (res) {
            that.setData({
              filesUrl:res.data
            });
            console.log(that.data.filesUrl);
            wx.hideToast();
          },
        })
      }
    })
  },
  cancel:function(e){
    var that = this;
    that.setData({
      files:[],
      filesUrl:''
    });
  }
});
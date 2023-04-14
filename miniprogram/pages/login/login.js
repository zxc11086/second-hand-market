const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const db=wx.cloud.database();
const app=getApp();
const chat_users=db.collection('chat_users');

Page({
  data: {
    flag:true,
    Img: defaultAvatarUrl,
    nickName:'',
    photourl:''
  },

  nickName(e) {
    this.setData({
      nickName: e.detail.value
    })
  },

  chooseImg: function() {
    var that = this;
    wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: function(photo) {
          that.setData({
            Img: photo.tempFilePaths,
          })
        }
      })
  },

  formSubmit(e) {
    var that = this
    if (e.detail.value.nickName === "") {
      wx.showToast({
        title: '请输入昵称',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (e.detail.value.nickName.length > 10) {
      wx.showToast({
        title: '昵称不得大10字',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else if (that.data.Img.length === defaultAvatarUrl.length) {
      wx.showToast({
        title: '请选择头像',
        icon: "none",
        duration: 1000,
        mask: true,
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '确定设置信息',
        success:(res)=> {
          if (res.confirm) {
            wx.showLoading({
                title: '正在设置...',
            });
            let filePath=that.data.Img[0]
            console.log(that.data.Img[0])
            wx.cloud.uploadFile({
              cloudPath: (new Date()).valueOf() + '.png',//文件名 //云存储图片名字
              filePath,
              success:function(res) {
                console.log('[上传图片] 成功：', res)
                that.setData({
                   photourl:res.fileID
                })
                that.sureRelease()
              },
            });
          }
        }
    })
    }
},
    sureRelease:function(){
      var that=this
      app.globalData.nickName=this.data.nickName
      app.globalData.Img=this.data.photourl
      db.collection('chat_users').add({
        data:{
          nickName:that.data.nickName,
          Img:that.data.photourl
        },
        success:function(res){
            console.log(res)
            db.collection('chat_users').doc(res._id).get({
                success(res){
                    console.log(res)
                    app.globalData.userInfo=res.data
                    wx.getStorageSync('userInfo',res.data)
                }
            })
            wx.hideLoading({
            })
            wx.showToast({
                title: '设置成功！',
                icon: 'none',
                mask:true,
                duration: 1500,
                success: function() {
                  setTimeout(function() {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 1000) //延迟时间
                },
            })
        }
      })
    },
})
const app = getApp();
const db=wx.cloud.database();
const chat_users=db.collection('chat_users');


Page({

    /**
     * 页面的初始数据
     */
    data: {
      code:[],
      Img:'/images/icon/login.png',
      nickName:'点击登录'
    },

    onShow(){
        this.setData({
          Img:app.globalData.Img,
          nickName:app.globalData.nickName
        })
    },

   gotoPublish:function(options){
    wx.navigateTo({
      url: '../publish/publish',
    })
   },

   gotoPublished:function(options){
    wx.navigateTo({
      url: '../published/published',
    })
   },

   gotoChat:function(options){
    wx.navigateTo({
      url: '../chat/chat',
    })
   },


   //用户点击右上角分享给朋友
   onShareAppMessage:function(){
    wx.showShareMenu({
      withShareTicket:true,
      menu:['shareAppMessage','shareTimeline']
    })
    return {
      title:'北化咸鱼',
      imageUrl:''
    }
  },

  //用户点击右上角分享朋友圈
  onShareTimeline:function(){
    return {
      title:'北化咸鱼',
      query:{
        key:123
      },
      imageUrl:''
    }
  },

  //如果该用户未登陆过，则注册
   gotoLogin:function(options){
    var that = this;
    if(app.globalData.openid==''){
          wx.cloud.callFunction({
            name:'get_openid',
            data:{
              message:'hellocloud',
            }
          }).then(res=>{
            app.globalData.openid=res.result.openid
            db.collection('chat_users').where({
               "_openid":app.globalData.openid
            }).get({
                success: function(res){
                    console.log(res)
                    if(res.data.length==0){
                        wx.navigateTo({
                          url: '../login/login',
                        })
                    }
                    else{
                      app.globalData.userInfo=res.data[0]
                      wx.setStorageSync('userInfo', res.data[0])
                      app.globalData.nickName=res.data[0].nickName
                      app.globalData.Img=res.data[0].Img
                        that.setData({
                            nickName:res.data[0].nickName,
                            Img:res.data[0].Img,
                        })
                        // // 在需要发送模板消息的页面中，获取用户授权并订阅消息
                        // wx.requestSubscribeMessage({
                        //     tmplIds: ['Edhp0grJHOe-bVBSpZApn0ITlnTKK35od_wIIJrIGMA'], // 订阅的模板消息ID
                        //     success: async (res) => {
                        //       // 用户同意授权
                        //       if (res['Edhp0grJHOe-bVBSpZApn0ITlnTKK35od_wIIJrIGMA'] === 'accept') {
                        //         // 获取formId
                        //         const formId = await getFormId()
                        //         // 调用云函数发送模板消息
                        //         wx.cloud.callFunction({
                        //           name: 'sendTemplateMessage',
                        //           data: {
                        //             openid: wx.getStorageSync('openid'),
                        //             formId: formId
                        //           },
                        //           success: (res) => {
                        //             console.log('发送模板消息成功', res)
                        //           },
                        //           fail: (err) => {
                        //             console.log('发送模板消息失败', err)
                        //           }
                        //         })
                        //       } else {
                        //         console.log('用户拒绝订阅消息')
                        //       }
                        //     },
                        //     fail: (err) => {
                        //       console.log('订阅消息失败', err)
                        //     }
                        // })
  
                        // // 获取formId
                        // function getFormId() {
                        //     return new Promise((resolve, reject) => {
                        //       wx.createSelectorQuery().select('#form').boundingClientRect((rect) => {
                        //         if (rect && rect.formId) {
                        //           resolve(rect.formId)
                        //         } else {
                        //           reject('获取formId失败')
                        //         }
                        //       }).exec()
                        //     })
                        // }
                    }
                }
            })
            console.log(res)
          })
      }
    },
})
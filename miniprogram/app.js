// app.js
App({
  // onLaunch: function () {
  //   if (!wx.cloud) {
  //     console.error('请使用 2.2.3 或以上的基础库以使用云能力');
  //   } else {
  //     wx.cloud.init({
  //       env: 'cloud1-8ghe0w5nbd71f4cf',
  //       traceUser: true,
  //     });
  //   }

  //   this.globalData = {
  //     openid:'',
  //     Img:'/images/icon/login.png',
  //     nickName:'点击登录'
  //   },

  //   wx.setTabBarStyle({
  //     color: '#ffffff',
  //     selectedColor: '#FFD301',
  //     backgroundColor: '#535386',
  //     borderStyle: 'white'
  //   })
  // },
  onLaunch(){
      wx.cloud.init({
         env: 'cloud1-8ghe0w5nbd71f4cf',
         traceUser: true,
      })
      if(wx.getStorageSync('userInfo'))
      {
        this.globalData.userInfo=wx.getStorageSync('userInfo')
      }
  },
    globalData:{
        userInfo:null,
        openid:'',
        Img:'/images/icon/login.png',
        nickName:'点击登录'
  },
  onShow(){
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-8ghe0w5nbd71f4cf',
        traceUser: true,
      });
    }

    wx.setTabBarStyle({
      color: '#ffffff',
      selectedColor: '#FFD301',
      backgroundColor: '#535386',
      borderStyle: 'white'
    })
  }
});

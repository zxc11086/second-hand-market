const db = wx.cloud.database()
const app=getApp();

Page({
    /**
     * 页面的初始数据
     */
    data: {
        goods_Arrays:[],
        ImageData:'',
        imgURL:'',
        photourl:[],
        isloading:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var that=this
      if(app.globalData.openid==''){
          wx.showToast({
              title: '请先登录！',
              icon: 'none',
              mask:true,
              duration: 1500,
              success: function() {
                setTimeout(function() {
                  wx.navigateBack({
                    delta: 1
                  })
                }, 2000) //延迟时间
              },
          })
      }
      else{
          db.collection('goods').where({
              "_openid": app.globalData.openid
          }).get({
              success: function(res) {
                  console.log(res)
                  if(res.data.length==0){
                      wx.showToast({
                          title: '你还没发布产品!',
                          icon: 'none',
                          mask:true,
                          duration: 1500,
                          success: function() {
                            setTimeout(function() {
                              wx.navigateBack({
                                delta: 1
                              })
                            }, 2000) //延迟时间
                          },
                      })
                  }
                  else{
                      that.setData({
                          goods_Arrays:res.data
                      });
                      that.show();
                  }
              }
          })
      }
    },
    

    //展示已发布的商品
    getURL(){
        var that=this
        console.log(this.data.goods_Arrays[1].photourl[0])
        wx.cloud.getTempFileURL({
            fileList: [{
              fileID: that.data.goods_Arrays[0].photourl[0]
            }]
          }).then(res => {
            console.log(res.fileList)
            that.setData({
              imgURL: res.fileList[0].tempFileURL
            }) 
          }).catch(error => {
            
        })
    },


    remove(e){
      let that=this
      let id=e.currentTarget.dataset.value
      db.collection('goods').where({
        "_id":id
      }).get({
        success(res){
          that.setData({
            photourl:res.data[0].photourl
          })
          console.log(that.data.photourl)
          wx.cloud.deleteFile({
            fileList:that.data.photourl,
            success: res => {
              console.log(res.fileList)
            },
            fail: console.error
          })
        }
      })
      db.collection('goods').where({
        "_id":id
      }).remove({
        success(res){
          db.collection('goods').where({
            "_openid":app.globalData.openid
          }).get({
            success(res){
              that.setData({
                goods_Arrays:res.data
              })
            }
          })
        }
      })
    },

    onReachBottom: function () {
      let that=this
      if(this.data.isloading==false){
          console.log(1)
          that.getGoodsList()// 重新获取列表数据
      }
  },

  getGoodsList(){
      let that = this
      this.setData({
          isloading:true
      })
      db.collection('goods').skip(that.data.goods_Arrays.length).where({
          "_openid":app.globalData.openid
      }).get({
          success: function(res){
              console.log(res)
              if(res.data.length==0){
                  wx.showToast({
                      title: '没有更多商品辣！',
                      icon: 'none',
                      mask:true,
                      duration: 1500,
                  })
              }
              else{
                  that.setData({
                      isloading:false,
                      goods_Array:that.data.goods_Array.concat(res.data)
                  });
              }
          }
      })
  }
})
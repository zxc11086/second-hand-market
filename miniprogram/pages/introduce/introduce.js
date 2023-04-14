const app=getApp();
const db=wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        price:'',
        title:'',
        info:'',
        p1:'',
        p2:'',
        p3:'',
        openid:'',
        goods_id:'',
        photoUrl:[],
        nickName:'',
        Img:'',
        myopenid:app.globalData.openid,
        Height:0,
    },
    getHeight:function(e){
        var winWId=wx.getSystemInfoSync().windowWidth;
        var imgh=e.detail.height;
        var imgw=e.detail.width;
         var swiperH=winWId*imgh/imgw;
         this.setData({
             Height:swiperH
         })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(e){
        let that=this
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
            this.setData({
                price:e.price,
                title:e.title,
                info:e.info,
                p1:e.p1,
                p2:e.p2,
                p3:e.p3,
                openid:e.openid,
                goods_id:e.goods_id,
                myopenid:app.globalData.openid
            })
            if(this.data.photoUrl === undefined) {
                this.data.photoUrl = []
            }
            if(this.data.p1!=''){
                this.data.photoUrl.push(this.data.p1)
                this.setData({
                    photoUrl:this.data.photoUrl
                })
            }
            if(this.data.p2!=''){
                this.data.photoUrl.push(this.data.p2)
                this.setData({
                    photoUrl:this.data.photoUrl
                })
            }
            if(this.data.p3!=''){
                this.data.photoUrl.push(this.data.p3)
                this.setData({
                    photoUrl:this.data.photoUrl
                })
            }
        }
        db.collection('chat_users').where({
            "_openid":this.data.openid
        }).get({
            success(res){
                console.log(res)
                that.setData({
                    nickName:res.data[0].nickName,
                    Img:res.data[0].Img
                })
            }
        })
   },



    clickImg: function(e){
        console.log(e)
        var imgUrl = this.data.photoUrl;
        wx.previewImage({
            urls: imgUrl, //需要预览的图片http链接列表，注意是数组
           // current: '', // 当前显示图片的http链接，默认是第一个
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    },

   onReady(){
       wx.setNavigationBarTitle({
         title: this.data.title,
       })
   },

})
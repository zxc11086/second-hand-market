const db=wx.cloud.database();
const app=getApp();
const chat_users=db.collection('chat_users');
const dc=db.command

Page({

    /**
     * 页面的初始数据
     */
    data: {
        friendsList:[],
        myopenid:'',
        msg:'',
        num:20,
        isloading:false
    },

    /**
     * 生命周期函数--监听页面加载
     */

    getFriendsList(){
        let that=this
        this.setData({
            isLoading:true
        })
        db.collection('chat_record').skip(that.data.friendsList.length).where(dc.or([
            {
                "userA_id": app.globalData.openid
            },
            {
                "userB_id": app.globalData.openid
            }
        ])).orderBy('time','desc').get({
            success:function(res){
                console.log(res)
                if(res.data.length==0){
                    wx.showToast({
                        title: '没有更多联系人辣！',
                        icon: 'none',
                        mask:true,
                        duration: 1500,
                        // success: function() {
                        //   setTimeout(function() {
                        //     wx.navigateBack({
                        //       delta: 1
                        //     })
                        //   }, 2000) //延迟时间
                        // },
                    })
                }
                else{
                    that.setData({
                        friendsList: that.data.friendsList.concat(res.data)
                    })
                    that.check(),
                    that.listsort()
                }
            }
        })
    },

    onShow(options) {
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
                  }, 500) //延迟时间
                },
            })
        }
        else{
            db.collection('chat_record').where(dc.or([
                {
                    "userA_id": app.globalData.openid
                },
                {
                    "userB_id": app.globalData.openid
                }
            ])).orderBy('time','desc').get({
                success:function(res){
                    console.log(res)
                    that.setData({
                        friendsList:res.data,
                        myopenid:app.globalData.openid
                    })
                    that.check()
                    // that.listsort()
                }
            })
        }
    },

    onReachBottom: function () {
        let that=this
        if(this.data.isloading==false){
            console.log(1)
            that.getFriendsList()// 重新获取列表数据
        }
    },

    check(e){
        // console.log(app.globalData.Img)
        if(this.data.friendsList.length==0){
            wx.showToast({
                title: '你还没有消息！',
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
    },

    mysort:function(e){
        console.log(123)
        return function(a,b){
            if(a.userA_id==app.globalData.openid){
                if(b.userA_id==app.globalData.openid){
                    return a.Avisual - b.Avisual
                }
                else{
                    return a.Avisual - b.Bvisual
                }
            }
            else{
                if(b.userA_id==app.globalData.openid){
                    return a.Bvisual - b.Avisual
                }
                else{
                    return a.Bvisual - b.Bvisual
                }
            }
        }
    },

    listsort(){
        let that = this
        let list=this.data.friendsList
        list.sort(that.mysort('1'))
        this.setData({
            friendsList:list
        })
    }

})
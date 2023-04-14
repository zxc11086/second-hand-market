const db = wx.cloud.database()
const app=getApp();
const util=require("../../utils/util")
const dc=db.command

Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid:'',
        chatlist:[],
        tempchatlist:[],
        Img:'',
        nickName:'',
        scrollHeight: '100vh',
        inputBottom: 0 ,
        inputvalue:'',
        myopenid:app.globalData.openid,
    },

    // 判断是否需要显示时间
    needTime(now,lastTime){
        var y=parseInt(now.slice(0,4))-parseInt(lastTime.slice(0,4))
        var m=parseInt(now.slice(5,7))-parseInt(lastTime.slice(5,7))
        var d=parseInt(now.slice(8,10))-parseInt(lastTime.slice(8,10))
        var h=parseInt(now.slice(11,13))-parseInt(lastTime.slice(11,13))
        var minute=parseInt(now.slice(14,16))-parseInt(lastTime.slice(14,16))
        // 判断时间间隔是否大于5分钟
        if(y==0 && m==0 && d==0 && h==0 && Math.abs(minute)<=5){
            return false
        } 
        else{
            return true
        }
    },

    // toDate(number) {
    //     var n = number;
    //     var date = new Date(parseInt(n));
    //     var y = date.getFullYear();
    //     var m = date.getMonth() + 1;
    //     m = m < 10 ? ('0' + m) : m;
    //     var d = date.getDate();
    //     d = d < 10 ? ('0' + d) : d;
    //     var h = date.getHours();
    //     h = h < 10 ? ('0' + h) : h;
    //     var minute = date.getMinutes();
    //     var second = date.getSeconds();
    //     minute = minute < 10 ? ('0' + minute) : minute;
    //     second = second < 10 ? ('0' + second) : second;
    //     return y + '-' + m + '-' + d + ' ' + h + ':' + minute+':' + second;
    //   },
  
  

    //拉到底部
    onPullDownRefresh(){
        this.initChat()
    },


    // 监听键盘高度变化,
  
    //键盘拉起
    focus: function(e) {
        var keyHeight = e.detail.height;
        this.setData({
         inputBottom: keyHeight+'px'
        })
    },
       
    //失去聚焦(软键盘消失)
    blur: function(e) {
        this.setData({
         inputBottom: 0
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(e) {
        if(e.openid==app.globalData.openid){
            wx.showToast({
                title: '这是你自己发布的嗷！',
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
                openid:e.openid,
                myopenid:app.globalData.openid
            })
            this.initChat()
        }
    },

    //初始化
    initChat(){
        var that=this
        console.log(that.data.openid)
        //获取img和nickname
        db.collection('chat_users').where({
            "_openid":that.data.openid
        }).get({
            success(res){
                that.setData({
                    nickName:res.data[0].nickName,
                    Img:res.data[0].Img
                })
                //异步处理，防止出现无头像昵称情况
                wx.setNavigationBarTitle({
                    title: that.data.nickName,
                  })
                that.addRecord()
            }
        })
    },

    //往数据库中新增记录/读取记录
    addRecord(){
        let that=this
        //获取聊天数据
        db.collection('chat_record').where(dc.or([
            {
                "userB_id":that.data.openid,
                "userA_id":app.globalData.openid,
            },
            {
                "userA_id":that.data.openid,
                "userB_id":app.globalData.openid,
            }
            ])).get({
                success(res){
                    //未找到则新增
                    if(res.data.length==0){
                        db.collection('chat_record').add({
                            data:{
                            userA_id:app.globalData.openid,
                            userA_Img:app.globalData.Img,
                            userA_nickName:app.globalData.nickName,
                            userB_id:that.data.openid,
                            userB_Img:that.data.Img,
                            userB_nickName:that.data.nickName,
                            time:util.formatTime(new Date()),
                            record:[],
                            Avisual:true,
                            Bvisual:false,
                            }
                        })
                    }
                    //找到则读取
                    else{
                        that.setData({
                            chatlist:res.data[0].record,                           
                        })
                        wx.pageScrollTo({
                                scrollTop: 99999
                        })
                        let id=res.data[0]._id
                        if(res.data[0].userA_id==app.globalData.openid){
                            let Avisual=true
                            db.collection('chat_record').doc(id).update({
                                data:{
                                    Avisual
                                },
                                success(res){
                                    console.log(res)
                                }
                            })
                        }
                        else{
                            let Bvisual=true
                            db.collection('chat_record').doc(id).update({
                                data:{
                                    Bvisual
                                },
                            })
                        }
                    }
                }
        })
    },
    
    // //输入处理
    // bindInputData:function(e){
    //     this.setData({
    //     inputvalue:e.detail.value
    //   });
    // },

    //发送
    formSubmit(e){
        this.setData({
            inputvalue:e.detail.value
        })
        console.log(this.data.inputvalue)
        var that=this
        if(that.data.inputvalue==''){
            wx.showToast({
                title: '不能发送空消息！',
                icon: 'none',
                mask:true,
                duration: 1500,
            })
        }
        else{
            db.collection('chat_record').where(dc.or([
                {
                    "userB_id":that.data.openid,
                    "userA_id":app.globalData.openid,
                },
                {
                    "userA_id":that.data.openid,
                    "userB_id":app.globalData.openid,
                }
                ])).get({
                success(res){
                    console.log(res)
                    let id=res.data[0]._id
                    let record=that.data.chatlist
                    let msg={}
                    msg.nickName=app.globalData.nickName
                    msg.Img=app.globalData.Img
                    msg.text=that.data.inputvalue
                    msg.index=record.length-1
                    msg.time=util.formatTime(new Date())
                    var time=msg.time
                    if(record.length==0){
                        msg.showtime=true;
                    }
                    else{
                        if(that.needTime(record[record.length-1].time,msg.time)){
                            msg.showtime=true;
                        }
                        else{
                            msg.showtime=false;
                        }
                    }
                    msg.openid=app.globalData.openid
                    record.push(msg)
                    console.log(msg)
                    if(res.data[0].userA_id==app.globalData.openid){
                        db.collection('chat_record').doc(id).update({
                            data:{
                                record,
                                time,
                                Bvisual: false
                            },
                            success(res){
                                that.setData({
                                    chatlist:record,
                                    inputvalue:'',
                                })
                                wx.pageScrollTo({
                                    scrollTop: 99999
                                })
                            }
                        })
                    }
                    else{
                        db.collection('chat_record').doc(id).update({
                            data:{
                                record,
                                time,
                                Avisual: false,
                            },
                            success(res){
                                that.setData({
                                    chatlist:record,
                                    inputvalue:'',
                                })
                                wx.pageScrollTo({
                                    scrollTop: 99999
                                })
                            }
                        })
                    }
                }
            })
        }
    }

})
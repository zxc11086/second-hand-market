const app = getApp();
const db=wx.cloud.database();
const dc=db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodslist:[],
        s:'',
        isloading:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(e) {
        var that=this
        console.log(e)
        this.setData({
            s:String(e.id)
        })
        let s=this.data.s
        console.log(s.length)
        //服装，22
        if(s.length==22){
            wx.setNavigationBarTitle({
              title: '服装',
            })
            db.collection('goods').where(dc.or([
            {
                title: db.RegExp({
                    regexp: "衣",
                    options: 'i',
                  })
            },
            {
                title: db.RegExp({
                    regexp: "裤",
                    options: 'i',
                  })
            },
            {
                title: db.RegExp({
                    regexp: "鞋",
                    options: 'i',
                  })
            },
            ])).get({
                success(res){
                    that.setData({
                        goodslist:res.data
                    })
                }
            })
        }
        //电子，20 
        if(s.length==20){
            wx.setNavigationBarTitle({
                title: '电子',
              })
            db.collection('goods').where(dc.or([
                {
                    title: db.RegExp({
                        regexp: "机",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "电",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "耳",
                        options: 'i',
                      })
                },
                ])).get({
                    success(res){
                        that.setData({
                            goodslist:res.data
                        })
                    }
                })
        }
        //书籍
        if(s.length==21){
            wx.setNavigationBarTitle({
                title: '书籍',
              })
            db.collection('goods').where(dc.or([
                {
                    title: db.RegExp({
                        regexp: "书",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "本",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "教",
                        options: 'i',
                      })
                },
                ])).get({
                    success(res){
                        that.setData({
                            goodslist:res.data
                        })
                    }
                })
        }
        //文具等
        if(s.length==26){
            wx.setNavigationBarTitle({
                title: '文具等',
              })
            db.collection('goods').where(dc.or([
                {
                    title: db.RegExp({
                        regexp: "笔",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "文",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "记",
                        options: 'i',
                      })
                },
                ])).get({
                    success(res){
                        that.setData({
                            goodslist:res.data
                        })
                    }
                })
        }
    },

    onReachBottom: function () {
        let that=this
        console.log(1)
        if(this.data.isloading==false){
            console.log(1)
            that.getGoodsList()// 重新获取列表数据
        }
    },

    getGoodsList(){
        let s=this.data.s
        let that=this
        console.log(s.length)
        this.setData({
            isLoading:true
        })
        //服装，22
        if(s.length==22){
            db.collection('goods').skip(that.data.goodslist.length).where(dc.or([
            {
                title: db.RegExp({
                    regexp: "衣",
                    options: 'i',
                  })
            },
            {
                title: db.RegExp({
                    regexp: "裤",
                    options: 'i',
                  })
            },
            {
                title: db.RegExp({
                    regexp: "鞋",
                    options: 'i',
                  })
            },
            ])).get({
                success(res){
                    if(res.data.length==0){
                        wx.showToast({
                            title: '没有更多商品辣！',
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
                            goodslist:res.data,
                            isloading:false
                        })
                    }
                }
            })
        }
        //电子，20 
        if(s.length==20){
            db.collection('goods').skip(that.data.goodslist.length).where(dc.or([
                {
                    title: db.RegExp({
                        regexp: "机",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "电",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "耳",
                        options: 'i',
                      })
                },
                ])).get({
                    success(res){
                        if(res.data.length==0){
                            wx.showToast({
                                title: '没有更多商品辣！',
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
                                goodslist:res.data,
                                isloading:false
                            })
                        }
                    }
                })
        }
        //书籍
        if(s.length==21){
            db.collection('goods').skip(that.data.goodslist.length).where(dc.or([
                {
                    title: db.RegExp({
                        regexp: "书",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "本",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "教",
                        options: 'i',
                      })
                },
                ])).get({
                    success(res){
                        if(res.data.length==0){
                            wx.showToast({
                                title: '没有更多商品辣！',
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
                                goodslist:res.data,
                                isloading:false
                            })
                        }
                    }
                })
        }
        //文具等
        if(s.length==26){
            db.collection('goods').skip(that.data.goodslist.length).where(dc.or([
                {
                    title: db.RegExp({
                        regexp: "笔",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "文",
                        options: 'i',
                      })
                },
                {
                    title: db.RegExp({
                        regexp: "记",
                        options: 'i',
                      })
                },
                ])).get({
                    success(res){
                        if(res.data.length==0){
                            wx.showToast({
                                title: '没有更多商品辣！',
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
                                goodslist:res.data,
                                isloading:false
                            })
                        }
                    }
                })
        }
    },



})